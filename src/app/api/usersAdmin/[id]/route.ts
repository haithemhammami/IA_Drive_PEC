import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split("/")
    const userId = Number.parseInt(pathSegments[pathSegments.length - 1], 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nom: true,
        email: true,
        adresse: true,
        phone: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
