import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que prisma est bien importé
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

export async function GET(req: Request, context: { params: { orderId: string } }) {
  const { orderId } = await context.params;

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

  // Convertir l'ID de la commande en entier
  const orderIdInt = parseInt(orderId);

  // Vérification si l'ID de la commande est valide
  if (isNaN(orderIdInt)) {
    return NextResponse.json({ message: "ID de commande invalide" }, { status: 400 });
  }

  try {
    // Récupérer la commande
    const order = await prisma.commande.findUnique({
      where: { id: orderIdInt },
      include: {
        commandeDetails: {
          include: {
            produit: true,
          },
        },
        client: true,
        statut: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier si l'utilisateur connecté est le propriétaire de la commande
    if (order.clientId !== decoded.userId) {
      return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error.message);
    return NextResponse.json({ message: "Erreur lors de la récupération de la commande" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: { orderId: string } }) {
  const { orderId } = context.params;

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

  // Convertir l'ID de la commande en entier
  const orderIdInt = parseInt(orderId);

  // Vérification si l'ID de la commande est valide
  if (isNaN(orderIdInt)) {
    return NextResponse.json({ message: "ID de commande invalide" }, { status: 400 });
  }

  try {
    // Récupérer la commande
    const order = await prisma.commande.findUnique({
      where: { id: orderIdInt },
      include: {
        commandeDetails: {
          include: {
            produit: true,
          },
        },
        client: true,
        statut: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier si l'utilisateur connecté est le propriétaire de la commande
    if (order.clientId !== decoded.userId) {
      return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
    }

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.commandeDetails.map((detail) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: detail.produit.nom,
          },
          unit_amount: detail.prixUnitaire * 100, // Stripe amount is in cents
        },
        quantity: detail.quantite,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
      metadata: {
        orderId: order.id.toString(),
        utilisateurId: order.clientId.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la création de la session de paiement:", error.message);
    return NextResponse.json({ message: "Erreur lors de la création de la session de paiement" }, { status: 500 });
  }
}
