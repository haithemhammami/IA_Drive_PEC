import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que prisma est bien importé
import jwt from "jsonwebtoken";
import Stripe from "stripe";
//import nodemailer from "nodemailer"; // Import nodemailer for sending emails

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

  let decoded: { userId: number };
  try {
    decoded = jwt.verify(token, secret) as { userId: number };
  } catch (error : unknown  ) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
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
  } catch (error : unknown) {
    console.error("Erreur lors de la récupération de la commande:", error instanceof Error ? error.message : 'Erreur inconnue');
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
    console.error("Erreur lors de la création de la session de paiement:", (error as any).message);
    return NextResponse.json({ message: "Erreur lors de la création de la session de paiement" }, { status: 500 });
  }
}

// // New SSE endpoint to handle order status changes
// export async function PUT(req: Request, context: { params: { orderId: string } }) {
//   const { orderId } = context.params;

//   // Récupérer le token JWT de l'utilisateur connecté
//   const token = req.headers.get('Authorization')?.split(' ')[1];
//   if (!token) {
//     return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
//   }

//   // Vérifier le token JWT
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     return NextResponse.json({ message: "JWT secret non défini" }, { status: 500 });
//   }

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, secret);
//   } catch (error) {
//     return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
//   }

//   // Convertir l'ID de la commande en entier
//   const orderIdInt = parseInt(orderId);

//   // Vérification si l'ID de la commande est valide
//   if (isNaN(orderIdInt)) {
//     return NextResponse.json({ message: "ID de commande invalide" }, { status: 400 });
//   }

//   try {
//     // Récupérer la commande
//     const order = await prisma.commande.findUnique({
//       where: { id: orderIdInt },
//       include: {
//         client: true,
//         statut: true,
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ message: "Commande non trouvée" }, { status: 404 });
//     }

//     // Vérifier si l'utilisateur connecté est le propriétaire de la commande
//     if (order.clientId !== decoded.userId) {
//       return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
//     }

//     // Mettre à jour le statut de la commande
//     const { newStatus } = await req.json();
//     const updatedOrder = await prisma.commande.update({
//       where: { id: orderIdInt },
//       data: { statutId: newStatus },
//       include: { statut: true },
//     });

//     // Envoyer un email à l'utilisateur
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: order.client.email,
//       subject: 'Mise à jour du statut de votre commande',
//       text: `Bonjour ${order.client.nom},\n\nLe statut de votre commande a été mis à jour.\n\nNouveau statut: ${updatedOrder.statut}\n\nMerci pour votre confiance.\n\nCordialement,\nL'équipe`,
//     };

//     await transporter.sendMail(mailOptions);

//     return NextResponse.json(updatedOrder, { status: 200 });
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de la commande:", (error as any).message);
//     return NextResponse.json({ message: "Erreur lors de la mise à jour de la commande" }, { status: 500 });
//   }
// }
