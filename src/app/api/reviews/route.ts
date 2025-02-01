import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
  } catch (error) {
    return NextResponse.json({ error: "Error creating review" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const reviews = await prisma.avisGlobale.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 400 })
  }
}

