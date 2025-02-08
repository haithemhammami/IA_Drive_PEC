import { NextResponse } from "next/server"
import prisma from "lib/prisma"

const lowStockThreshold = 10

async function checkStockLevels() {
  const products = await prisma.produit.findMany()
  const alerts = []

  for (const product of products) {
    let alertType = null
    let message = ""

    if (product.stock === 0) {
      alertType = "error"
      message = `Le produit "${product.nom}" est en rupture de stock. Veuillez réapprovisionner rapidement.`
    } else if (product.stock <= lowStockThreshold) {
      alertType = "warning"
      message = `Le stock du produit "${product.nom}" est bas (${product.stock} unités restantes). Pensez à réapprovisionner.`
    }

    if (alertType) {
      // Vérifier si une alerte existe déjà pour ce produit
      const existingAlert = await prisma.alertes.findFirst({
        where: {
          produitId: product.id,
          // Nous considérons qu'une alerte est "la même" si elle a le même type
          message: {
            contains: alertType === "error" ? "rupture de stock" : "stock du produit",
          },
        },
      })

      if (existingAlert) {
        // Mettre à jour l'alerte existante si le message a changé
        if (existingAlert.message !== message) {
          const updatedAlert = await prisma.alertes.update({
            where: { id: existingAlert.id },
            data: { message, dateAlerte: new Date() },
          })
          alerts.push(updatedAlert)
        }
      } else {
        // Créer une nouvelle alerte
        const newAlert = await prisma.alertes.create({
          data: {
            produitId: product.id,
            message: message,
          },
        })
        alerts.push(newAlert)
      }
    } else {
      // Si le stock est revenu à un niveau normal, supprimer les alertes existantes
      await prisma.alertes.deleteMany({
        where: {
          produitId: product.id,
          message: {
            contains: "stock",
          },
        },
      })
    }
  }

  return alerts
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const sendEvent = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch (error) {
          console.error("Error sending event:", error)
        }
      }

      const interval = setInterval(async () => {
        try {
          const alerts = await checkStockLevels()
          if (alerts.length > 0) {
            sendEvent(JSON.stringify(alerts))
          }
        } catch (error) {
          console.error("Error checking stock levels:", error)
        }
      }, 30000)

      return () => {
        clearInterval(interval)
      }
    },
    cancel() {
      console.log("Client closed the connection")
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

