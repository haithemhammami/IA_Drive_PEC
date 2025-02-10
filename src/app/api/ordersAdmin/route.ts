import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.commande.findMany({
      where: {
        statutId: {
          in: [2, 4, 5], // Only fetch orders with status 2, 4, or 5
        },
      },
      include: {
        statut: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

