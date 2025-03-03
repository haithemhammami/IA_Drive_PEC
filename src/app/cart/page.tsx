'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image'; // Import next/image

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
  const params = useParams();
  const utilisateurId = params?.utilisateurId as string | undefined; // Récupérer l'ID utilisateur depuis l'URL
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Liste des articles du panier
  const [loading, setLoading] = useState<boolean>(true); // Pour afficher le loading
  const [error, setError] = useState<string | null>(null); // Gérer les erreurs
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Vérifier l'authentification
  const router = useRouter(); // Pour la redirection
  const cartRef = useRef<HTMLDivElement>(null);

  // Effectuer la vérification de l'authentification
  useEffect(() => {
    const checkAuthentication = () => {
      const userToken = localStorage.getItem('userToken'); // Exemple, tu pourrais utiliser un cookie ou un token JWT
      if (!userToken) {
        setIsAuthenticated(false);
        router.push('/auth/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
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
      } catch (err: unknown) { // Specify the error type
        if (err instanceof Error) {
          setError(err.message); // Gérer les erreurs
        } else {
          setError('Une erreur inconnue est survenue'); // Gérer les erreurs inconnues
        }
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchCart(); // Lancer la récupération du panier
  }, [utilisateurId, isAuthenticated]); // Rechargement lorsque l'utilisateur devient authentifié

  useEffect(() => {
    cartRef.current?.focus();
  }, [loading, error]);

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
    <div ref={cartRef} tabIndex={-1} aria-live="polite">
      <h1>Panier de l'utilisateur {utilisateurId}</h1>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', marginBottom: '20px' }}>
            <Image
              src={item.produit.image || '/default-image.jpg'}
              alt={item.produit.nom}
              width={100}
              height={100}
              style={{ objectFit: 'cover' }}
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
