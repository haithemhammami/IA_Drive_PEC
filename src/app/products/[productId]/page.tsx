"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Produit } from "@prisma/client";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Produit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Produit[]>([]);

  // Remplacez cela par la gestion de l'utilisateur authentifié
  const utilisateurId = 1; // ID de l'utilisateur connecté, modifiez cela pour l'obtenir dynamiquement

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        throw new Error(`Erreur lors de la récupération du produit : ${res.status}`);
      }

      const data: Produit = await res.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération du produit");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const addToCart = async (product: Produit) => {
    if (!utilisateurId) {
      setError("Veuillez vous connecter avant d'ajouter un produit au panier.");
      return;
    }

    try {
      // Vérification du stock
      if (product.stock <= 0) {
        setError("Le produit est en rupture de stock.");
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utilisateurId, productId: product.id }),
      });

      if (!res.ok) {
        // Si la réponse est 404, cela peut être dû à un problème avec l'utilisateur ou le produit
        const errorData = await res.json();
        setError(errorData.message || "Erreur inconnue lors de l'ajout au panier");
        return;
      }

      const { cartItem } = await res.json();
      setCart((prevCart) => [...prevCart, cartItem.produit]);

      alert("Produit ajouté au panier avec succès !");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout au panier");
    }
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="flex flex-col justify-center px-4 py-8 my-12 mx-auto w-full max-w-2xl bg-white shadow-md rounded-lg">
      {product ? (
        <>
          {product.image && (
            <img
              src={product.image}
              alt={product.nom}
              className="w-full h-64 object-contain rounded-md"
            />
          )}
          <h1 className="mt-4 text-xl text-gray-800 font-bold">{product.nom}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-800 font-semibold text-lg mb-4">Prix : {product.prix} €</p>
          <button
            onClick={() => addToCart(product)}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Ajouter au panier
          </button>
        </>
      ) : (
        <p className="text-center text-gray-600">Produit non trouvé.</p>
      )}
    </div>
  );
}