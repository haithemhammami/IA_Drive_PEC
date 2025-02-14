import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.pathname.split("/").pop();
  const productIdInt = Number.parseInt(productId || "");

  if (isNaN(productIdInt)) {
    return NextResponse.json({ message: "ID produit invalide" }, { status: 400 });
  }

  try {
    const product = await prisma.produit.findUnique({
      where: {
        id: productIdInt,
      },
      include: {
        categorie: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: "Produit non trouvé" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du produit:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
