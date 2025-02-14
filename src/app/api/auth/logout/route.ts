import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    if (!token) {
      console.error('Token manquant:', token);
      return NextResponse.json({ error: "Token requis." }, { status: 400 })
    }

    // Recherche de la session par token
    const session = await prisma.session.findFirst({
      where: { token },
    })

    if (!session) {
      return NextResponse.json({ error: "Session non trouvée." }, { status: 404 })
    }

    // Suppression de la session de la base de données
    await prisma.session.delete({
      where: { id: session.id },
    })

    return NextResponse.json({ message: "Déconnexion réussie." }, { status: 200 })
  } catch (error) {
    console.error("Erreur serveur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 })
  }
}

