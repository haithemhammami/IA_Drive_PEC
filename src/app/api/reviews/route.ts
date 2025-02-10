import { NextResponse } from "next/server"
import prisma from "lib/prisma"

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
  } catch (error) {
    return NextResponse.json({ error: "Error deleting review" }, { status: 400 })
  }
}

