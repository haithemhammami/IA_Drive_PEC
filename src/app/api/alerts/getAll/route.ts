import { NextResponse } from "next/server"
import prisma from "lib/prisma"

export async function GET() {
  try {
    const alerts = await prisma.alertes.findMany({
      orderBy: {
        dateAlerte: "desc",
      },
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

