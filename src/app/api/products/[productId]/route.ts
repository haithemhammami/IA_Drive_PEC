import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  const productIdInt = Number.parseInt(productId || "");

  if (isNaN(productIdInt)) {
    return NextResponse.json({ message: "ID produit invalide" }, { status: 400 });
  }

  try {
    const product = await prisma.produit.findUnique({
      where: { id: productIdInt },
      include: { categorie: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Produit non trouvé" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error occurred");
    return NextResponse.json({ message: "Erreur lors de la récupération du produit" }, { status: 500 });
  }
}
