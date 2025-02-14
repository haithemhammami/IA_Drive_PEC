import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request, context: { params: { productId: string } }) {
  const { productId } = await context.params;

  const productIdInt = Number.parseInt(productId)
  if (isNaN(productIdInt)) {
    return NextResponse.json({ message: "ID produit invalide" }, { status: 400 })
  }

  try {
    const product = await prisma.produit.findUnique({
      where: {
        id: productIdInt,
      },
      include: {
        categorie: true,
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error("Unknown error occurred")
    }
    return NextResponse.json({ message: "Erreur lors de la récupération du produit" }, { status: 500 })
  }
}
