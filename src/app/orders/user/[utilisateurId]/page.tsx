'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const UserOrdersPage = () => {
  const { utilisateurId } = useParams();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`/api/orders/user/${utilisateurId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const filteredOrders = data.filter((order: any) => order.statutId === 2); // Filtrer les commandes avec statut "2"
        setOrders(filteredOrders);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login');
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, [utilisateurId, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Commandes de l'utilisateur</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <h2>Commande #{order.id}</h2>
              <p>Statut: {order.statut.statut}</p>
              <p>Total: {order.total}€</p>
              <h3>Détails de la commande</h3>
              <ul>
                {order.commandeDetails.map((detail: any) => (
                  <li key={detail.id}>
                    <p>Produit: {detail.produit.nom}</p>
                    <p>Quantité: {detail.quantite}</p>
                    <p>Prix unitaire: {detail.prixUnitaire}€</p>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push(`/orders/${order.id}`)}>Voir la commande</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrdersPage;
