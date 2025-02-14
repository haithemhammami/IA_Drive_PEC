import { NextResponse } from "next/server"
import prisma from "lib/prisma"

const lowStockThreshold = 10
const RETRY_INTERVAL = 5000 // 5 seconds
const CHECK_INTERVAL = 30000 // 30 seconds

enum AlertType {
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  STOCK_RECOVERED = "STOCK_RECOVERED",
}

async function fetchAlerts(retries = 3): Promise<unknown[]> {
  try {
    return await prisma.alertes.findMany({
      orderBy: { dateAlerte: "desc" },
    })
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL))
      return fetchAlerts(retries - 1)
    }
    console.error("Failed to fetch alerts after retries:", error)
    return []
  }
}

async function checkStockLevels() {
  const products = await prisma.produit.findMany({
    include: { alertState: true },
  })
  const updatedAlerts = []

  for (const product of products) {
    let alertType: AlertType | null = null
    let message = ""

    if (product.stock === 0) {
      alertType = AlertType.OUT_OF_STOCK
      message = `Le produit "${product.nom}" est en rupture de stock. Veuillez réapprovisionner rapidement.`
    } else if (product.stock <= lowStockThreshold) {
      alertType = AlertType.LOW_STOCK
      message = `Le stock du produit "${product.nom}" est bas (${product.stock} unités restantes). Pensez à réapprovisionner.`
    } else if (
      product.alertState?.lastAlertType === AlertType.LOW_STOCK ||
      product.alertState?.lastAlertType === AlertType.OUT_OF_STOCK
    ) {
      alertType = AlertType.STOCK_RECOVERED
      message = `Le produit "${product.nom}" est à nouveau disponible en quantité suffisante (${product.stock} unités).`
    }

    if (alertType) {
      const alert = await createOrUpdateAlert(product.id, message, alertType)
      if (alert) {
        updatedAlerts.push(alert)
      }
    }
  }

  return updatedAlerts
}

async function createOrUpdateAlert(produitId: number, message: string, alertType: AlertType) {
  const now = new Date()

  // Find existing alert for this product
  const existingAlert = await prisma.alertes.findFirst({
    where: { produitId },
  })

  // Get the current alert state for the product
  let alertState = await prisma.productAlertState.findUnique({
    where: { produitId },
  })

  // If no alert state exists, create one
  if (!alertState) {
    alertState = await prisma.productAlertState.create({
      data: {
        produitId,
        lastAlertType: alertType,
        lastAlertDate: now,
      },
    })
  }

  // Check if we need to create a new alert or update the existing one
  if (!existingAlert || alertState.lastAlertType !== alertType) {
    let alert
    if (existingAlert) {
      // Update existing alert
      alert = await prisma.alertes.update({
        where: { id: existingAlert.id },
        data: {
          message,
          dateAlerte: now,
        },
      })
    } else {
      // Create new alert
      alert = await prisma.alertes.create({
        data: {
          produitId,
          message,
          dateAlerte: now,
        },
      })
    }

    // Update the alert state
    await prisma.productAlertState.update({
      where: { produitId },
      data: {
        lastAlertType: alertType,
        lastAlertDate: now,
      },
    })

    return alert
  }

  return null
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      // Send initial alerts with retry mechanism
      const initialAlerts = await fetchAlerts()
      sendEvent(JSON.stringify(initialAlerts))

      let isActive = true
      const checkStock = async () => {
        if (!isActive) return

        try {
          const updatedAlerts = await checkStockLevels()
          if (updatedAlerts.length > 0) {
            const allAlerts = await fetchAlerts()
            sendEvent(JSON.stringify(allAlerts))
          }
        } catch (error) {
          console.error("Error checking stock levels:", error)
          // Don't terminate the stream on error
        }

        // Schedule next check if stream is still active
        if (isActive) {
          setTimeout(checkStock, CHECK_INTERVAL)
        }
      }

      // Start the stock checking loop
      checkStock()

      return () => {
        isActive = false
      }
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