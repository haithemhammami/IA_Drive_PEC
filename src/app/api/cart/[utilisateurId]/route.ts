import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const utilisateurId = request.nextUrl.pathname.split("/").pop()
  const utilisateurIdInt = Number.parseInt(utilisateurId || "")

  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: "ID utilisateur invalide" }, { status: 400 })
  }

  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return NextResponse.json({ message: "JWT secret non défini" }, { status: 500 })
  }

  let decoded: { userId: number }
  try {
    decoded = jwt.verify(token, secret) as { userId: number }
  } catch (error: unknown) {
    console.error("Erreur de vérification du token:", error instanceof Error ? error.message : "Erreur inconnue")
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 })
  }

  if (decoded.userId !== utilisateurIdInt) {
    return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 })
  }

  try {
    // ✅ Initialiser Stripe à l'intérieur pour éviter la vérification lors du build
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json({ message: "Clé Stripe non définie" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-01-27.acacia", // Utilise une version stable
    })

    const cartItems = await prisma.cart.findMany({
      where: { utilisateurId: utilisateurIdInt },
      include: { produit: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Aucun produit dans le panier." }, { status: 404 })
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.prix * item.quantite, 0)

    let defaultStatus = await prisma.commandeStatut.findFirst({
      where: { statut: "En attente de paiement" },
    })

    if (!defaultStatus) {
      defaultStatus = await prisma.commandeStatut.create({
        data: { statut: "En attente de paiement" },
      })
    }

    const newOrder = await prisma.commande.create({
      data: {
        clientId: utilisateurIdInt,
        statutId: defaultStatus.id,
        total: totalAmount,
        createdAt: new Date(),
        commandeDetails: {
          create: cartItems.map((item) => ({
            produitId: item.produitId,
            quantite: item.quantite,
            prixUnitaire: item.prix,
          })),
        },
      },
    })

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.produit.nom },
        unit_amount: Math.round(item.prix * 100),
      },
      quantity: item.quantite,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderId: newOrder.id.toString(),
        utilisateurId: utilisateurIdInt.toString(),
      },
    })

    return NextResponse.json(
      {
        message: "Commande créée avec succès.",
        order: newOrder,
        url: session.url,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error("Erreur lors de la création de la commande:", (error as Error).message)
    return NextResponse.json({ message: "Erreur lors de la création de la commande" }, { status: 500 })
  }
}
