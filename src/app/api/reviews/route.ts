import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prisma";

// POST - Ajouter un avis
export async function POST(request: NextRequest) {
  try {
    const { nom, note, commentaire } = await request.json();

    if (!nom || !note || !commentaire) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const newReview = await prisma.avisGlobale.create({
      data: { nom, note, commentaire },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'avis" }, { status: 500 });
  }
}

// GET - Récupérer tous les avis
export async function GET() {
  try {
    const reviews = await prisma.avisGlobale.findMany();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des avis" }, { status: 500 });
  }
}

// DELETE - Supprimer un avis
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.avisGlobale.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Avis supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'avis" }, { status: 500 });
  }
}
