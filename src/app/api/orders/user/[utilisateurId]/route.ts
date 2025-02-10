import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que prisma est bien importé
import jwt from "jsonwebtoken";

export async function GET(req: Request, context: { params: { utilisateurId: string } }) {
  const { utilisateurId } = await  context.params;

  // Récupérer le token JWT de l'utilisateur connecté
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  // Vérifier le token JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "JWT secret non défini" }, { status: 500 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
  }

  // Convertir l'ID utilisateur en entier
  const utilisateurIdInt = parseInt(utilisateurId);

  // Vérification si l'ID utilisateur est valide
  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: "ID utilisateur invalide" }, { status: 400 });
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
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error.message);
    return NextResponse.json({ message: "Erreur lors de la récupération des commandes" }, { status: 500 });
  }
}
