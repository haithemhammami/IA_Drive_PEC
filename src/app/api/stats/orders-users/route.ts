import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "monthly"

  const startDate = new Date()
  if (range === "yearly") {
    startDate.setFullYear(startDate.getFullYear() - 1)
  } else {
    startDate.setMonth(startDate.getMonth() - 1)
  }

  try {
    const users = await prisma.utilisateur.groupBy({
      by: ["dateCreation"],
      _count: {
        id: true,
      },
      where: {
        dateCreation: {
          gte: startDate,
        },
      },
    })

    const orders = await prisma.commande.groupBy({
      by: ["createdAt"],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const data = users.map((user) => ({
      date: user.dateCreation.toISOString().split("T")[0],
      users: user._count.id,
      orders:
        orders.find(
          (order) => order.createdAt.toISOString().split("T")[0] === user.dateCreation.toISOString().split("T")[0],
        )?._sum.total || 0,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des données des commandes et utilisateurs:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

