import { NextRequest, NextResponse } from "next/server";
import { getProductsByQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Récupération du paramètre 'query' dans l'URL
    const query = request.nextUrl.searchParams.get("query")?.trim() || "";

    if (!query) {
      return NextResponse.json({ error: "Le paramètre 'query' est requis" }, { status: 400 });
    }

    // Récupération des produits en fonction de la requête
    const products = await getProductsByQuery(query);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
