"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import jwtDecode from "jwt-decode";  // Assurez-vous que vous utilisez la bonne version de jwt-decode
import { Produit } from "@prisma/client";  // Import correct pour utiliser les produits

export default function ProductsPage() {
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error(`Erreur: ${res.status}`);
        }
        const data: Produit[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors de la récupération des produits");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Décodez le token pour obtenir l'ID de l'utilisateur
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);  // Utilisez jwt-decode correctement
        setUserId(decoded.userId);  // Définir l'ID utilisateur à partir du token
      } catch (err) {
        console.error("Erreur de décodage du token", err);
      }
    }
  }, []);

  const addToCart = async (product: Produit) => {
    if (!userId) {
      alert("Veuillez vous connecter pour ajouter des produits au panier.");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utilisateurId: userId, productId: product.id }),
      });

      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`);
      }

      const { cartItem } = await res.json();
      alert("Produit ajouté au panier !");
    } catch (err: any) {
      console.error("Erreur lors de l'ajout au panier:", err.message);
    }
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Tous les produits</h1>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <li key={product.id} className="group">
                <Link href={`/products/${product.id}`} className="block">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.nom}
                      className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                    />
                  )}
                  <h3 className="mt-4 text-m text-gray-700 font-bold">{product.nom}</h3>
                  <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                  <p className="text-green-600 font-medium text-lg">Prix : {product.prix} €</p>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Ajouter au panier
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}
