'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { Produit } from '@prisma/client';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('query') : null;
  const [searchResults, setSearchResults] = useState<Produit[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [, setCart] = useState<Produit[]>([]);
  const [user, setUser] = useState<unknown>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Veuillez vous connecter pour accéder à cette page.");
      return;
    }

    try {
      const decoded: unknown = jwtDecode(token);
      fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            setUserId((decoded as { userId: string }).userId);
          } else {
            alert("Veuillez vous connecter pour accéder à cette page.");
          }
        })
        .catch(() => alert("Veuillez vous connecter pour accéder à cette page."));
    } catch (err) {
      console.error("Erreur de décodage du token", err);
      alert("Veuillez vous connecter pour accéder à cette page.");
    }
  }, []);

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(`/api/search?query=${query}`);
          setSearchResults(response.data as Produit[]);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
      fetchSearchResults();
    }
  }, [query]);

  useEffect(() => {
    searchRef.current?.focus();
  }, [searchResults]);

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
      alert("Produit ajouté au panier avec succès !");
    } catch (erreur: unknown) {
      console.error("Erreur lors de l'ajout au panier:", erreur instanceof Error ? erreur.message : erreur);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8" ref={searchRef} tabIndex={-1} aria-live="polite">
      <h1 className="text-2xl font-bold mb-4">Résultats de recherche pour "{query}"</h1>
      {searchResults.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {searchResults.map((produit) => (
            <li key={produit.id} className="group">
              <Link href={`/produit/${produit.id}`} className="block">
                {produit.image ? (
                  <Image
                    src={produit.image || "/file.svg"}
                    alt={produit.nom}
                    width={500} height={300}
                    className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                  />
                ) : null}
                <h3 className="mt-4 text-m text-gray-700 font-bold">{produit.nom}</h3>
                <p className="text-gray-600 text-sm mb-1">{produit.description}</p>
                <p className="text-green-600 font-medium text-lg">Prix : {produit.prix} €</p>
              </Link>
              <button
                onClick={() => addToCart(produit)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                aria-label={`Ajouter ${produit.nom} au panier`}
              >
                Ajouter au panier
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
}
