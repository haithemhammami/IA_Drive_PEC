import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ingredients = searchParams.get("ingredients")

  try {
    let products: any[] = []
    let notFoundProducts: string[] = []

    if (ingredients) {
      const ingredientList = ingredients.split(",").map((i) => i.trim())
      products = await prisma.produit.findMany({
        where: {
          OR: ingredientList.map((ingredient) => ({
            OR: [
              {
                nom: {
                  contains: ingredient,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: ingredient,
                  mode: "insensitive",
                },
              },
            ],
          })),
        },
        include: {
          categorie: true,
        },
      })

      notFoundProducts = ingredientList.filter(
        (ingredient) => !products.some((p) => p.nom.toLowerCase().includes(ingredient.toLowerCase())),
      )

      console.log(`Recherche de produits pour les ingrédients: ${ingredients}`)
      console.log(`Nombre de produits trouvés: ${products.length}`)
      console.log(`Produits non trouvés: ${notFoundProducts.join(", ")}`)
    } else {
      products = await prisma.produit.findMany({
        include: {
          categorie: true,
        },
      })
      console.log("Récupération de tous les produits")
      console.log(`Nombre total de produits: ${products.length}`)
    }

    return NextResponse.json({ products, notFoundProducts })
  } catch (error: any) {
    console.error("Erreur API produits:", error.message || error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { productId, userId } = await request.json(); // Assuming userId is passed in the request body

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, utilisateurId: userId }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: "Produit ajouté au panier" });
    } else {
      return NextResponse.json({ error: data.message || "Erreur lors de l'ajout au panier" }, { status: response.status });
    }
  } catch (error) {
    console.error("Erreur API ajout au panier:", error);
    return NextResponse.json({ error: "Erreur lors de l'ajout au panier" }, { status: 500 });
  }
}