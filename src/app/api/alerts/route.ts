import { NextResponse } from "next/server"
import prisma from "lib/prisma"

const lowStockThreshold = 10

async function getOrCreateAlert(produitId: number, message: string) {
  let alert = await prisma.alertes.findFirst({
    where: { produitId },
  })

  if (!alert) {
    alert = await prisma.alertes.create({
      data: {
        produitId,
        message,
        dateAlerte: new Date(),
      },
    })
  }

  return alert
}

async function updateAlertMessage(alertId: number, newMessage: string) {
  return prisma.alertes.update({
    where: { id: alertId },
    data: {
      message: newMessage,
      dateAlerte: new Date(),
    },
  })
}

async function checkStockLevels() {
  const products = await prisma.produit.findMany()
  const updatedAlerts = []

  for (const product of products) {
    let message = ""

    if (product.stock === 0) {
      message = `Le produit "${product.nom}" est en rupture de stock. Veuillez réapprovisionner rapidement.`
    } else if (product.stock <= lowStockThreshold) {
      message = `Le stock du produit "${product.nom}" est bas (${product.stock} unités restantes). Pensez à réapprovisionner.`
    } else {
      message = `Le produit "${product.nom}" est disponible en quantité suffisante (${product.stock} unités).`
    }

    const alert = await getOrCreateAlert(product.id, message)

    if (alert.message !== message) {
      const updatedAlert = await updateAlertMessage(alert.id, message)
      updatedAlerts.push(updatedAlert)
    }
  }

  return updatedAlerts
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      // Envoyer les alertes initiales
      const initialAlerts = await prisma.alertes.findMany({
        orderBy: { dateAlerte: "desc" },
      })
      sendEvent(JSON.stringify(initialAlerts))

      // Vérifier les niveaux de stock toutes les 30 secondes
      const interval = setInterval(async () => {
        const updatedAlerts = await checkStockLevels()
        if (updatedAlerts.length > 0) {
          const allAlerts = await prisma.alertes.findMany({
            orderBy: { dateAlerte: "desc" },
          })
          sendEvent(JSON.stringify(allAlerts))
        }
      }, 30000)

      return () => clearInterval(interval)
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

