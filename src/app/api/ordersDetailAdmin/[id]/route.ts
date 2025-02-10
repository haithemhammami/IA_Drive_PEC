import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET(request: Request, { params }: { params: { id: Promise<string> } }) {
  try {
    const id = await params.id
    const orderId = Number.parseInt(id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const order = await prisma.commande.findUnique({
      where: { id: orderId },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            email: true,
            adresse: true,
            phone: true,
          },
        },
        statut: true,
        commandeDetails: {
          include: {
            produit: {
              select: {
                id: true,
                nom: true,
                prix: true,
                image: true,
              },
            },
          },
        },
        livraison: {
          include: {
            typeLivraison: true,
          },
        },
        paiement: {
          include: {
            mode: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

