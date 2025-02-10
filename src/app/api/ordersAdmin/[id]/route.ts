import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const orderId = Number.parseInt(params.id, 10)
  const { statusId } = await request.json()

  try {
    const updatedOrder = await prisma.commande.update({
      where: { id: orderId },
      data: { statutId: statusId },
      include: { statut: true },
    })

    // Add status change to history
    await prisma.commandeStatutHistorique.create({
      data: {
        commandeId: orderId,
        statutId: statusId,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

