'use client';  // Assure-toi que ce composant est exécuté côté client

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: number;
  produitId: number;
  produit: {
    nom: string;
  };
  quantite: number;
  prix: number;
  image: string;
}

const UserCartPage = () => {
  const { utilisateurId } = useParams() as { utilisateurId: string }; // Récupérer l'ID utilisateur à partir des paramètres d'URL
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const cartRef = useRef<HTMLDivElement>(null);

  const fetchCartItems = async (utilisateurId: string): Promise<CartItem[]> => {
    const response = await fetch(`/api/cart/${utilisateurId}`);
    const data: CartItem[] = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`/api/cart/${utilisateurId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cartItems);
        setUserName(data.userName);
        setTotalAmount(data.totalAmount);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login');
        }
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [utilisateurId, router]);

  const handleRemoveItem = async (productId: number, removeAll: boolean = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch(`/api/cart/${utilisateurId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, removeAll }),
      });

      if (res.ok) {
        if (removeAll) {
          setCartItems((prevItems) => prevItems.filter((item) => item.produitId !== productId));
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.produitId === productId ? { ...item, quantite: item.quantite - 1 } : item
            ).filter((item) => item.quantite > 0)
          );
        }
        const updatedTotalAmount = cartItems.reduce((total, item) => total + item.prix * item.quantite, 0);
        setTotalAmount(updatedTotalAmount);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit du panier:', error);
      setError('Erreur lors de la suppression du produit du panier');
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/cart/${utilisateurId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      window.location.href = data.url; // Redirige vers Stripe
    } catch (err: any) {
      console.error("Erreur de paiement:", err.message);
    }
  };

  useEffect(() => {
    const updatedTotalAmount = cartItems.reduce((total, item) => total + item.prix * item.quantite, 0);
    setTotalAmount(updatedTotalAmount);
  }, [cartItems]);

  useEffect(() => {
    cartRef.current?.focus();
  }, [loading, error]);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen" ref={cartRef} tabIndex={-1} aria-live="polite">
      <h1 className="text-3xl font-bold mb-6 text-center">Panier de {userName}</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit dans le panier.</p>
      ) : (
        <div className="p-6  bg-gray-100 rounded-lg shadow-lg">
          <ul className="space-y-6 ">
            {cartItems.map((item) => (
              <li key={item.id} className="bg-white flex items-center space-x-6 p-4 border-b last:border-b-0 m-2">
                <Image src={item.image} alt={item.produit.nom} width={96} height={96} className="object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{item.produit.nom}</h3>
                  <p className="text-gray-600">Quantité : {item.quantite}</p>
                  <p className="text-gray-600">Prix : {item.prix}€</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleRemoveItem(item.produitId)} 
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    aria-label={`Diminuer la quantité de ${item.produit.nom}`}
                  >
                    Diminuer
                  </button>
                  <button 
                    onClick={() => handleRemoveItem(item.produitId, true)} 
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    aria-label={`Supprimer ${item.produit.nom} du panier`}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-bold mt-8">Total du panier : {totalAmount}€</h2>
          <button 
            onClick={handleCheckout} 
            className="mt-6 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            aria-label="Valider le panier et passer commande"
          >
            Valider le panier et passer commande
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCartPage;
