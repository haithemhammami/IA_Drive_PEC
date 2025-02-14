import { NextResponse } from "next/server";
import prisma from "lib/prisma";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nom = formData.get('nom') as string;
    const logoFile = formData.get('logo') as File | null;

    if (!nom) {
      return NextResponse.json(
        { error: "Le nom de la catégorie est requis" },
        { status: 400 }
      );
    }

    let logoPath: string | null = null;
    
    if (logoFile) {
      // S'assurer que le dossier uploads existe
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        console.error("Erreur création dossier uploads:", error);
      }

      // Créer un nom de fichier unique
      const bytes = new Uint8Array(await logoFile.arrayBuffer());
      const fileName = `${Date.now()}-${logoFile.name.replace(/\s+/g, '-')}`;
      const filePath = join(uploadsDir, fileName);
      
      await writeFile(filePath, bytes);
      logoPath = `/uploads/${fileName}`;
    }

    // Créer la catégorie dans la base de données
    const categorie = await prisma.categorie.create({
      data: {
        nom,
        ...(logoPath && { logo: logoPath }), // Ajout conditionnel du logo
      },
    });

    return NextResponse.json(categorie);
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        _count: {
          select: { produits: true }
        }
      }
    });

    // Logging des catégories récupérées
    console.log('Catégories récupérées:', categories);

    return NextResponse.json(categories);
  } catch (error) {
    // Logging détaillé de l'erreur
    console.error("Erreur lors de la récupération des catégories:", error);
    if (error) {
      const errorDetails = error as unknown as Record<string, unknown>;
      console.error("Détails de l'erreur:", {
        message: errorDetails.message,
        stack: errorDetails.stack,
        ...errorDetails
      });
    }
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}