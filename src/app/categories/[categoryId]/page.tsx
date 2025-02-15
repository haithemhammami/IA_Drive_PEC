'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Produit, Prisma } from '@prisma/client';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function ProductsByCategoryPage() {
  const params = useParams();
  const categoryId = params?.categoryId as string;

  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Produit[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoryId) return;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        if (!res.ok) {
          throw new Error(`Erreur : ${res.status}`);
        }

        const data: Produit[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la récupération des produits');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Erreur de décodage du token", err);
      }
    }
  }, [categoryId]);

  useEffect(() => {
    categoryRef.current?.focus();
  }, [loading, error]);

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
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white" ref={categoryRef} tabIndex={-1} aria-live="polite">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Produits de la catégorie {categoryId}</h1>
        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <li key={product.id} className="group">
                <Link href={`/products/${product.id}`} passHref>
                  <div className="cursor-pointer">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.nom}
                        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                      />
                    ) : null}
                    <h2 className="mt-4 text-m text-gray-700 font-bold px-2">{product.nom}</h2>
                    <p className="text-gray-600 text-sm mb-1 px-2">{product.description}</p>
                    <p className="text-green-600 font-medium text-lg px-2">Prix : {product.prix} €</p>
                  </div>
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  aria-label={`Ajouter ${product.nom} au panier`}
                >
                  Ajouter au panier
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun produit trouvé pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
}