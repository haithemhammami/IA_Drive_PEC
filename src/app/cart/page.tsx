'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  prix: number;
  image: string;
  nom: string;
}

interface CartItem {
  id: number;
  quantite: number;
  produit: Product;
}

export default function CartPage() {
  const { utilisateurId } = useParams(); // Récupérer l'ID utilisateur depuis l'URL
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Liste des articles du panier
  const [loading, setLoading] = useState<boolean>(true); // Pour afficher le loading
  const [error, setError] = useState<string | null>(null); // Gérer les erreurs
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Vérifier l'authentification
  const router = useRouter(); // Pour la redirection

  // Effectuer la vérification de l'authentification
  useEffect(() => {
    const checkAuthentication = () => {
      const userToken = localStorage.getItem('userToken'); // Exemple, tu pourrais utiliser un cookie ou un token JWT
      if (!userToken) {
        setIsAuthenticated(false);
        router.push('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      } else {
        setIsAuthenticated(true); // L'utilisateur est connecté
      }
    };

    checkAuthentication(); // Vérifier dès que le composant est monté
  }, [router]);

  // Récupérer le panier de l'utilisateur après la vérification de l'authentification
  useEffect(() => {
    if (!utilisateurId || !isAuthenticated) return; // Ne rien faire si l'utilisateur n'est pas connecté

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart/${utilisateurId}`); // Appel API pour récupérer le panier
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération du panier');
        }
        const data = await res.json();
        setCartItems(data); // Stocker les éléments du panier dans l'état
      } catch (err: any) {
        setError(err.message); // Gérer les erreurs
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchCart(); // Lancer la récupération du panier
  }, [utilisateurId, isAuthenticated]); // Rechargement lorsque l'utilisateur devient authentifié

  // Si en cours de chargement, afficher un message de chargement
  if (loading) {
    return <div>Chargement du panier...</div>;
  }

  // Si une erreur se produit, afficher un message d'erreur
  if (error) {
    return <div>Erreur: {error}</div>;
  }

  // Si le panier est vide
  if (cartItems.length === 0) {
    return <div>Aucun produit dans le panier.</div>;
  }

  return (
    <div>
      <h1>Panier de l'utilisateur {utilisateurId}</h1>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', marginBottom: '20px' }}>
            <img
              src={item.produit.image || '/default-image.jpg'}
              alt={item.produit.nom}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div style={{ marginLeft: '20px' }}>
              <h2>{item.produit.nom}</h2>
              <p>Prix: {item.produit.prix} €</p>
              <p>Quantité: {item.quantite}</p>
              <p>Total: {item.produit.prix * item.quantite} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
