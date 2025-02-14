import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Assurez-vous que ce chemin est correct

// Fonction pour récupérer tous les produits
export async function GET() {
  try {
    const products = await prisma.produit.findMany({
      include: {
        categorie: true,  // Inclure les informations de la catégorie
      },
    });

    return NextResponse.json(products); // Retourner les produits en JSON
  } catch (error: any) {
    console.error('Erreur API produits:', error.message || error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 });
  }
}

// Fonction pour ajouter un produit au panier
export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    const product = await prisma.produit.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Logique pour ajouter le produit au panier (à implémenter selon votre structure de données)
    // Par exemple, ajouter le produit à une table "cart" dans la base de données

    return NextResponse.json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    console.error('Erreur API ajout au panier:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout au panier' }, { status: 500 });
  }
}