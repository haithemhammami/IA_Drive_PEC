import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.pathname.split('/').pop();
  const categoryIdInt = Number.parseInt(categoryId || '');

  if (isNaN(categoryIdInt)) {
    return NextResponse.json({ message: 'ID de catégorie invalide' }, { status: 400 });
  }

  try {
    const category = await prisma.categorie.findUnique({
      where: { id: categoryIdInt },
    });

    if (!category) {
      return NextResponse.json({ message: 'Catégorie non trouvée' }, { status: 404 });
    }

    const products = await prisma.produit.findMany({
      where: {
        categorieId: categoryIdInt,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur API :', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des produits' }, { status: 500 });
  }
}
