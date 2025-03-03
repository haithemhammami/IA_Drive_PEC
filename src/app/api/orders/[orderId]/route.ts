import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
//import nodemailer from "nodemailer"; 

export async function GET(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

  const orderId = request.nextUrl.pathname.split("/").pop();
  const orderIdInt = Number.parseInt(orderId || "");

  if (isNaN(orderIdInt)) {
    return NextResponse.json({ message: "ID de commande invalide" }, { status: 400 });
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

  let decoded: { userId: number };
  try {
    decoded = jwt.verify(token, secret) as { userId: number };
  } catch (error : unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
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
  } catch (error : unknown) {
    console.error("Erreur lors de la récupération de la commande:", error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Erreur lors de la récupération de la commande" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

  const orderId = request.nextUrl.pathname.split("/").pop();
  const orderIdInt = Number.parseInt(orderId || "");

  if (isNaN(orderIdInt)) {
    return NextResponse.json({ message: "ID de commande invalide" }, { status: 400 });
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

  let decoded: any;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
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
    console.error("Erreur lors de la création de la session de paiement:", (error as any).message);
    return NextResponse.json({ message: "Erreur lors de la création de la session de paiement" }, { status: 500 });
  }
}