import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url)
  const userId = pathname.split("/").pop()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  const skip = (page - 1) * limit

  try {
    const [users, total] = await Promise.all([
      prisma.utilisateur.findMany({
        where: {
          OR: [
            { nom: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { adresse: { contains: search, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          nom: true,
          email: true,
          phone: true,
          adresse: true,
          isActive: true,
          dateCreation: true,
          role: true,
          commandes: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          dateCreation: "desc",
        },
      }),
      prisma.utilisateur.count({
        where: {
          OR: [
            { nom: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { adresse: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ])

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        derniereCommandeId: user.commandes[0]?.id || null,
        commandes: undefined, // Remove the commandes array from the response
      })),
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}

