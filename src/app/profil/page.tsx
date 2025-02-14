'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Utilisateur } from '@prisma/client';

export default function ProfilePage() {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      //const decoded: any = jwtDecode(token);
      fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            router.push('/auth/login');
          }
        })
        .catch(() => router.push('/auth/login'));
    } catch (err) {
      console.error("Erreur de décodage du token", err);
      router.push('/auth/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Profil de {user.nom}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div className="mt-2">
              <input
                type="email"
                value={user.email}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Adresse</label>
            <div className="mt-2">
              <input
                type="text"
                value={user.adresse || ''}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Téléphone</label>
            <div className="mt-2">
              <input
                type="text"
                value={user.phone || ''}
                readOnly
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <Link href={`/orders/user/${user.id}`} className="block w-full text-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-indigo-600 hover:bg-indigo-500">
              Voir les commandes passées
            </Link>
          </div>

          <div>
            <Link href="/auth/logout" className="block w-full text-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-red-600 hover:bg-red-500">
              Se déconnecter
            </Link>
          </div>

          <div>
            <Link href="/profil/edit" className="block w-full text-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-indigo-600 hover:bg-indigo-500">
              Modifier le profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
