import { NextRequest, NextResponse } from 'next/server';
import prisma from 'lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { Categorie } from '@prisma/client'; 

// GET - Récupérer une catégorie par ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const idInt = Number.parseInt(id || "");

    if (isNaN(idInt)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const categorie = await prisma.categorie.findUnique({
      where: { id: idInt },
      include: {
        produits: true,
        _count: {
          select: { produits: true }
        }
      }
    });

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(categorie);
  } catch (error) {
    console.error('Erreur GET:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const idInt = Number.parseInt(id || "");

    if (isNaN(idInt)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const nom = formData.get('nom') as string;
    const logoFile = formData.get('logo') as File | null;

    if (!nom && !logoFile) {
      return NextResponse.json(
        { error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      );
    }

    // Récupérer la catégorie existante
    const existingCategorie = await prisma.categorie.findUnique({
      where: { id: idInt }
    }) as Categorie | null;

    if (!existingCategorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    let logoPath: string | undefined;

    if (logoFile) {
      try {
        // Supprimer l'ancien logo si existe
        if (existingCategorie.logo) {
          const oldLogoPath = join(process.cwd(), 'public', existingCategorie.logo);
          await unlink(oldLogoPath).catch(() => {});
        }

        // Traiter le nouveau logo
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });

        const bytes = new Uint8Array(await logoFile.arrayBuffer());
        const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, '-')}`;
        const filePath = join(uploadsDir, fileName);
        
        await writeFile(filePath, bytes);
        logoPath = `/uploads/${fileName}`;
      } catch (error) {
        console.error("Erreur lors du traitement du fichier:", error);
        return NextResponse.json(
          { error: "Erreur lors du traitement du logo" },
          { status: 500 }
        );
      }
    }

    // Mise à jour de la catégorie
    const updatedCategorie = await prisma.categorie.update({
      where: { id: idInt },
      data: {
        ...(nom && { nom }),
        ...(logoPath && { logo: logoPath }),
      },
    });

    return NextResponse.json({
      message: "Catégorie mise à jour avec succès",
      categorie: updatedCategorie
    });
  } catch (error) {
    console.error('Erreur PUT:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const idInt = Number.parseInt(id || "");

    if (isNaN(idInt)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Récupérer la catégorie pour obtenir le chemin du logo
    const categorie = await prisma.categorie.findUnique({
      where: { id: idInt }
    }) as Categorie | null;

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer le logo si existe
    if (categorie.logo) {
      try {
        const logoPath = join(process.cwd(), 'public', categorie.logo);
        await unlink(logoPath).catch(() => {});
      } catch (error) {
        console.error("Erreur lors de la suppression du logo:", error);
      }
    }

    // Supprimer la catégorie
    await prisma.categorie.delete({
      where: { id: idInt }
    });

    return NextResponse.json({
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur DELETE:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}