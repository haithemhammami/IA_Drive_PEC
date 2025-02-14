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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching alerts:", error.message)
    } else {
      console.error("Unknown error occurred while fetching alerts")
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}