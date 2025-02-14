'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface OrderDetail {
  id: number;
  produit: {
    nom: string;
    image: string; // Utilisez le champ image du modèle Produit
  };
  quantite: number;
  prixUnitaire: number;
}

interface Order {
  id: number;
  client: {
    nom: string;
  };
  statut: {
    statut: string;
  };
  total: number;
  commandeDetails: OrderDetail[];
}

const OrderPage = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/path/to/default/image.jpg'; // Chemin vers une image par défaut
  };

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
        const data: Order = await res.json();
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
    <div className="p-5 font-sans">
      <h1 className="text-2xl mb-5">Commande #{order?.id}</h1>
      <p className="text-lg">Client: {order?.client.nom}</p>
      <p className="text-lg">Statut: {order?.statut.statut}</p>
      <p className="text-lg font-bold">Total: {order?.total}€</p>
      <h2 className="text-xl mt-5">Détails de la commande</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {order?.commandeDetails.map((detail: OrderDetail) => (
          <div key={detail.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <img 
              src={detail.produit.image || '/default-image.png'} 
              alt={detail.produit.nom} 
              className="w-full h-64 object-contain group-hover:opacity-75 transition duration-300" 
              onError={handleImageError} 
            />
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800">Produit: {detail.produit.nom}</p>
              <p className="text-gray-600 text-sm mb-2">Quantité: {detail.quantite}</p>
              <p className="text-green-600 font-bold text-xl">Prix unitaire: {detail.prixUnitaire}€</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;