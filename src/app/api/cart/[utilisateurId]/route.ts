import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma" 
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function GET(req: Request, context: { params: { utilisateurId: string } }) {
  const { utilisateurId } =  await context.params;  // Extraire l'ID utilisateur des paramètres

  // Convertir l'ID utilisateur en entier
  const utilisateurIdInt = parseInt(utilisateurId);
  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: "ID utilisateur invalide" }, { status: 400 });
  }

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
  } catch (error: unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
  }

  // Vérifier si l'utilisateur connecté est le propriétaire du panier
  if (decoded.userId !== utilisateurIdInt) {
    return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
  }

  try {
    // Récupérer l'utilisateur
    const user = await prisma.utilisateur.findUnique({
      where: { id: utilisateurIdInt },
      select: { nom: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Récupérer tous les éléments du panier pour cet utilisateur
    const cartItems = await prisma.cart.findMany({
      where: {
        utilisateurId: utilisateurIdInt,  // Filtrer les éléments du panier pour l'utilisateur donné
      },
      include: {
        produit: true,  // Inclure les informations du produit lié à chaque élément du panier
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Aucun produit dans le panier." }, { status: 404 });
    }

    // Calculer le montant total du panier
    const totalAmount = cartItems.reduce((total: number, item: { prix: number; quantite: number }) => total + item.prix * item.quantite, 0);

    return NextResponse.json({ cartItems, userName: user.nom, totalAmount }, { status: 200 });  // Retourner les éléments du panier avec les produits, le nom de l'utilisateur et le montant total
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du panier:", (error as Error).message);
    return NextResponse.json({ message: "Erreur lors de la récupération du panier" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { utilisateurId: string } }) {
  const { utilisateurId } = await context.params;
  const { productId, removeAll } = await req.json();

  // Convertir l'ID utilisateur et produit en entier
  const utilisateurIdInt = parseInt(utilisateurId);
  const productIdInt = parseInt(productId);

  // Vérification si les ID sont valides
  if (isNaN(utilisateurIdInt) || isNaN(productIdInt)) {
    return NextResponse.json({ message: "ID utilisateur ou produit invalide" }, { status: 400 });
  }

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
  } catch (error: unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
  }

  // Vérifier si l'utilisateur connecté est le propriétaire du panier
  if (decoded.userId !== utilisateurIdInt) {
    return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const cartItem = await prisma.cart.findFirst({
      where: {
        utilisateurId: utilisateurIdInt,
        produitId: productIdInt,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Produit non trouvé dans le panier." }, { status: 404 });
    }

    if (removeAll || cartItem.quantite === 1) {
      // Supprimer l'élément du panier
      await prisma.cart.delete({
        where: { id: cartItem.id },
      });
    } else {
      // Décrémenter la quantité
      await prisma.cart.update({
        where: { id: cartItem.id },
        data: { quantite: cartItem.quantite - 1 },
      });
    }

    return NextResponse.json({ message: "Produit mis à jour dans le panier." }, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour du produit dans le panier:", (error as Error).message);
    return NextResponse.json({ message: "Erreur lors de la mise à jour du produit dans le panier" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: { utilisateurId: string } }) {
  const { utilisateurId } = context.params;

  // Convertir l'ID utilisateur en entier
  const utilisateurIdInt = parseInt(utilisateurId);

  // Vérification si l'ID utilisateur est valide
  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: "ID utilisateur invalide" }, { status: 400 });
  }

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
  } catch (error: unknown) {
    console.error('Erreur de vérification du token:', error instanceof Error ? error.message : 'Erreur inconnue');
    return NextResponse.json({ message: "Token invalide ou expiré" }, { status: 401 });
  }

  // Vérifier si l'utilisateur connecté est le propriétaire du panier
  if (decoded.userId !== utilisateurIdInt) {
    return NextResponse.json({ message: "Accès non autorisé" }, { status: 403 });
  }

  try {
    // Récupérer tous les éléments du panier pour cet utilisateur
    const cartItems = await prisma.cart.findMany({
      where: {
        utilisateurId: utilisateurIdInt,  // Filtrer les éléments du panier pour l'utilisateur donné
      },
      include: {
        produit: true,  // Inclure les informations du produit lié à chaque élément du panier
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Aucun produit dans le panier." }, { status: 404 });
    }

    // Calculer le montant total du panier
    const totalAmount = cartItems.reduce((total: number, item: { prix: number; quantite: number }) => total + item.prix * item.quantite, 0);

    // Vérifier si le statut par défaut existe
    let defaultStatus = await prisma.commandeStatut.findFirst({
      where: { statut: "En attente de paiement" },
    });

    // Créer le statut par défaut s'il n'existe pas
    if (!defaultStatus) {
      defaultStatus = await prisma.commandeStatut.create({
        data: { statut: "En attente de paiement" },
      });
    }

    // Créer une nouvelle commande
    const newOrder = await prisma.commande.create({
      data: {
        clientId: utilisateurIdInt,
        statutId: defaultStatus.id, // Utiliser l'ID du statut par défaut
        total: totalAmount,
        createdAt: new Date(), 
        commandeDetails: {
          create: cartItems.map((item: { produitId: number; quantite: number; prix: number }) => ({
            produitId: item.produitId,
            quantite: item.quantite,
            prixUnitaire: item.prix,
          })),
        },
      },
    });

    // Créer une session Stripe Checkout
    const lineItems = cartItems.map((item: { produit: { nom: string }; prix: number; quantite: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.produit.nom },
        unit_amount: item.prix * 100, // Prix en centimes
      },
      quantity: item.quantite,
    }));

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
    });

    return NextResponse.json({ message: "Commande créée avec succès.", order: newOrder, url: session.url }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création de la commande:", (error as Error).message);
    return NextResponse.json({ message: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}