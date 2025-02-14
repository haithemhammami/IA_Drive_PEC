import { NextResponse } from "next/server";
import Stripe from "stripe";
import {prisma} from "@/lib/prisma"; // Assurez-vous que prisma est bien importé

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
    apiVersion: "2025-01-27.acacia" });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ message: "Session ID manquant." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ message: "Paiement non confirmé." }, { status: 400 });
    }

    // Mettre à jour le statut de la commande
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.commande.update({
        where: { id: parseInt(orderId) },
        data: { statutId: 2 }, // Assurez-vous que le statut "Payée" a l'ID 2
      });

      // Vider le panier de l'utilisateur
      await prisma.cart.deleteMany({
        where: { utilisateurId: parseInt(session.metadata?.utilisateurId || "0") },
      });
    }

    return NextResponse.json({ message: "Paiement confirmé." });
  } catch {
    return NextResponse.json({ message: "Erreur lors de la confirmation." }, { status: 500 });
  }
}
