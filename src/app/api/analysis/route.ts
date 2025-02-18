import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function POST(req: Request) {
  console.log("POST /api/analysis called")
  try {
    const { missingProduct } = await req.json()
    console.log("Received missing product:", missingProduct)
    if (!missingProduct || typeof missingProduct !== "string") {
      return NextResponse.json({ error: "Invalid missing product data" }, { status: 400 })
    }

    const createdEntry = await prisma.analysis.create({
      data: { name: missingProduct, createdAt: new Date() },
    })

    console.log("Missing product added to analysis:", createdEntry)
    return NextResponse.json(createdEntry, { status: 201 })
  } catch (error) {
    console.error("Error posting missing product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const missingIngredients = await prisma.analysis.findMany()
    return NextResponse.json(missingIngredients)
  } catch (error) {
    console.error("Error fetching missing ingredients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

