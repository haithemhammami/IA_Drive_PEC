"use client";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Produit } from "@prisma/client";

interface ProductPageProps {}

const ProductPage: React.FC<ProductPageProps> = async () => {
  const [cart, setCart] = useState<Produit[]>([]);  // Ajout de l'état du panier
  const searchParams = useSearchParams();
  const productId = searchParams ? parseInt(searchParams.get('productId') || '', 10) : NaN;

  if (isNaN(productId)) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  const product = await prisma.produit.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  async function addToCart(product: Produit) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Veuillez vous connecter pour ajouter des produits au panier.");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ utilisateurId: userId, productId: product.id }),
      });

      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`);
      }

      const { cartItem } = await res.json();
      setCart((prevCart) => [...prevCart, cartItem.produit]);
    } catch (err: any) {
      console.error("Erreur lors de l'ajout au panier:", err.message);
    }
  }

  return (
    <div className="flex flex-col justify-center px-2 py-12 my-12 mx-auto w-3/4 aspect-square bg-white shadow-lg rounded-lg">
      {product.image && (
        <Image
          src={product.image}
          alt={product.nom}
          className="h-40 w-full object-cover rounded-md"
        />
      )}
      <h1 className="mt-4 text-base text-gray-700 font-bold">{product.nom}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-gray-600 font-medium text-lg">Prix : {product.prix} €</p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => addToCart(product)}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default ProductPage;
