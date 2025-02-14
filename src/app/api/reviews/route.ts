import { NextRequest, NextResponse } from "next/server"
import prisma from "lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { nom, note, commentaire } = await request.json()
    const newReview = await prisma.avisGlobale.create({
      data: {
        nom,
        note,
        commentaire,
      },
    })
    return NextResponse.json(newReview, { status: 201 })
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Error creating review" }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const reviews = await prisma.avisGlobale.findMany()
    return NextResponse.json(reviews)
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des avis:", error instanceof Error ? error.message : "Erreur inconnue")
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 })
    }

    await prisma.avisGlobale.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting review" }, { status: 400 })
  }
}

