import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma"; // Assurez-vous que prisma est bien importé

export async function POST(request: Request) {
  try {
    // Récupérer le corps de la requête
    const body = await request.json();
    console.log("Requête reçue:", body);

    // Vérifier si l'utilisateur est connecté (vérifier l'ID utilisateur)
    if (!body.utilisateurId) {
      return NextResponse.json(
        { message: "Utilisateur non connecté." },
        { status: 401 } // Erreur 401 si l'utilisateur n'est pas connecté
      );
    }

    // Vérifier si le productId est présent dans la requête
    if (!body.productId) {
      return NextResponse.json(
        { message: "ID du produit requis." },
        { status: 400 } // Erreur 400 si l'ID du produit est manquant
      );
    }

    // Convertir les IDs en entiers
    const utilisateurIdInt = Number(body.utilisateurId);
    const productIdInt = Number(body.productId);

    if (isNaN(utilisateurIdInt) || isNaN(productIdInt)) {
      return NextResponse.json(
        { message: "ID utilisateur et produit doivent être valides." },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await prisma.utilisateur.findUnique({
      where: { id: utilisateurIdInt },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 } // Erreur 404 si l'utilisateur n'existe pas
      );
    }

    // Récupérer le produit à partir de l'ID
    const product = await prisma.produit.findUnique({
      where: { id: productIdInt },
      select: { prix: true, image: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produit non trouvé." },
        { status: 404 } // Erreur 404 si le produit n'existe pas
      );
    }

    // Vérifier que le prix du produit est valide
    if (product.prix === null || product.prix === undefined) {
      return NextResponse.json(
        { message: "Erreur: prix du produit manquant." },
        { status: 500 } // Erreur interne serveur si le prix est manquant
      );
    }

    // Vérifier que l'image est bien définie ou utiliser une valeur par défaut
    const imageFinale = product.image || "default-image.jpg";

    // Vérifier si l'élément existe déjà dans le panier
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        utilisateurId: utilisateurIdInt,
        produitId: productIdInt,
      },
    });

    if (existingCartItem) {
      // Si l'élément existe déjà, augmenter la quantité
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantite: existingCartItem.quantite + 1 },
      });

      return NextResponse.json({ cartItem: updatedCartItem }, { status: 200 });
    } else {
      // Si l'élément n'existe pas, créer un nouvel élément dans le panier
      const newCartItem = await prisma.cart.create({
        data: {
          utilisateurId: utilisateurIdInt,
          produitId: productIdInt,
          quantite: 1,
          prix: product.prix, // Prix validé plus haut
          image: imageFinale, // Image ou valeur par défaut
        } as Prisma.CartUncheckedCreateInput,
      });

      return NextResponse.json({ cartItem: newCartItem }, { status: 201 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur lors de l'ajout au panier:", error.message);
    } else {
      console.error("Erreur inconnue lors de l'ajout au panier");
    }
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: { utilisateurId: string } }) {
  const { utilisateurId } = context.params;
  const utilisateurIdInt = parseInt(utilisateurId);

  if (isNaN(utilisateurIdInt)) {
    return NextResponse.json({ message: 'ID utilisateur invalide' }, { status: 400 });
  }

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        utilisateurId: utilisateurIdInt,
      },
      include: {
        produit: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: 'Aucun produit dans le panier.' }, { status: 404 });
    }

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur lors de la récupération du panier:', error.message);
    } else {
      console.error('Erreur inconnue lors de la récupération du panier');
    }
    return NextResponse.json({ message: 'Erreur lors de la récupération du panier' }, { status: 500 });
  }
}
