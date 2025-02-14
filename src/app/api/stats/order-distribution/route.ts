import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "this"

  const startDate = new Date()
  const endDate = new Date()

  if (range === "last") {
    startDate.setDate(startDate.getDate() - 14)
    endDate.setDate(endDate.getDate() - 7)
  } else {
    startDate.setDate(startDate.getDate() - 7)
  }

  // Logging des dates de début et de fin
  console.log('Dates de la requête:', { startDate, endDate });

  try {
    const orders = await prisma.commande.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    })

    const data = [
      { day: "Lun", orders: 0, revenue: 0 },
      { day: "Mar", orders: 0, revenue: 0 },
      { day: "Mer", orders: 0, revenue: 0 },
      { day: "Jeu", orders: 0, revenue: 0 },
      { day: "Ven", orders: 0, revenue: 0 },
      { day: "Sam", orders: 0, revenue: 0 },
      { day: "Dim", orders: 0, revenue: 0 },
    ]

    orders.forEach((order) => {
      const dayIndex = order.createdAt.getDay()
      data[dayIndex].orders++
      data[dayIndex].revenue += order.total
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des données de distribution des commandes:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

