'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const UserOrdersPage = () => {
  const params = useParams();
  const utilisateurId = params?.utilisateurId as string | undefined;
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/path/to/default/image.jpg'; // Chemin vers une image par défaut
  };

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
    return <p aria-live="polite">Chargement...</p>;
  }

  if (error) {
    return <p aria-live="assertive">{error}</p>;
  }

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl mb-5">Commandes de l'utilisateur</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">Commande #{order.id}</h2>
                <p className="text-gray-600 text-sm mb-2">Statut: {order.statut.statut}</p>
                <p className="text-green-600 font-bold text-xl">Total: {order.total}€</p>
                <h3 className="text-md mt-2">Détails de la commande</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {order.commandeDetails.map((detail: any) => (
                    <div key={detail.id} className="text-gray-600 text-sm">
                      <img 
                        src={detail.produit.image || '/default-image.png'} 
                        alt={`Image de ${detail.produit.nom}`} 
                        className="w-full h-32 object-contain group-hover:opacity-75 transition duration-300" 
                        onError={handleImageError} 
                        aria-hidden="true"
                      />
                      <p>Produit: {detail.produit.nom}</p>
                      <p>Quantité: {detail.quantite}</p>
                      <p>Prix unitaire: {detail.prixUnitaire}€</p>
                    </div>
                  ))}
                </div>
                <button 
                  className="mt-3 text-blue-500 hover:underline" 
                  onClick={() => router.push(`/orders/${order.id}`)}
                  aria-label={`Voir la commande ${order.id}`}
                >
                  Voir la commande
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;