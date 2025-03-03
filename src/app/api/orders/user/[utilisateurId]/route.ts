import { NextResponse, NextRequest } from "next/server";
import {prisma} from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const utilisateurId = request.nextUrl.pathname.split("/").pop();
  const utilisateurIdInt = Number.parseInt(utilisateurId || "");

  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: "ID utilisateur invalide" }, { status: 400 });
  }

  // Récupérer le token JWT de l'utilisateur connecté
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  // Vérifier le token JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "JWT secret non défini" }, { status: 500 });
  }

  interface DecodedToken {
    userId: number;
  }

  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, secret) as DecodedToken;
  } catch (error: unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
  }

  // Vérifier si l'utilisateur connecté est le propriétaire des commandes
  if (decoded.userId !== utilisateurIdInt) {
    return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
  }

  try {
    // Récupérer toutes les commandes de l'utilisateur
    const orders = await prisma.commande.findMany({
      where: { clientId: utilisateurIdInt },
      include: {
        commandeDetails: {
          include: {
            produit: true,
          },
        },
        statut: true,
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des commandes:", error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Erreur lors de la récupération des commandes" }, { status: 500 });
  }
}