'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const OrderPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        if (res.status === 401 || res.status === 403) {
          router.push('/auth/login');
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Commande #{order.id}</h1>
      <p>Client: {order.client.nom}</p>
      <p>Statut: {order.statut.statut}</p>
      <p>Total: {order.total}€</p>
      <h2>Détails de la commande</h2>
      <ul>
        {order.commandeDetails.map((detail: any) => (
          <li key={detail.id}>
            <p>Produit: {detail.produit.nom}</p>
            <p>Quantité: {detail.quantite}</p>
            <p>Prix unitaire: {detail.prixUnitaire}€</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;
