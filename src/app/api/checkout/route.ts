import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2025-01-27.acacia",
    });

    try {
        const { cartItems } = await req.json(); // Récupérer les articles du panier
  
        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ message: "Panier vide." }, { status: 400 });
        }
  
        interface CartItem {
            nom: string;
            prix: number;
            quantite: number;
        }
      
        const lineItems = cartItems.map((item: CartItem) => ({
            price_data: {
                currency: "eur",
                product_data: { name: item.nom },
                unit_amount: item.prix * 100, // Prix en centimes
            },
            quantity: item.quantite,
        }));
      
        // Création de la session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
        });
  
        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error("Erreur Stripe:", error instanceof Error ? error.message : 'Erreur inconnue');
        return NextResponse.json({ message: "Erreur lors du paiement." }, { status: 500 });
    }
}
