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

  // Logging de la date de début
  console.log('Date de début:', startDate);

  try {
    const orderStatuses = await prisma.commande.groupBy({
      by: ["statutId"],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Logging des statuts des commandes
    console.log('Statuts des commandes:', orderStatuses);

    const statusMap = {
      1: "En attente de paiement",
      2: "En préparation",
      4: "En livraison",
      5: "Livré",
    }

    const data = orderStatuses.map((status) => ({
      id: status.statutId,
      status: statusMap[status.statutId as keyof typeof statusMap] || "Inconnu",
      count: status._count.id,
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des données de statut des commandes:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

