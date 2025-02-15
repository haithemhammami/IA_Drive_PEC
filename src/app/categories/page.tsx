'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Categorie, Prisma } from '@prisma/client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) {
          throw new Error(`Erreur: ${res.status}`);
        }
        const data: Categorie[] = await res.json();
        setCategories(data);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des catégories:', err.message);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    categoriesRef.current?.focus();
  }, [categories]);

  return (
    <div className="bg-white" ref={categoriesRef} tabIndex={-1} aria-live="polite">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Catégories</h1>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8 ">
          {Array.isArray(categories) && categories.map((category) => (
            <li
              key={category.id}
              className="group shadow-lg p-4 rounded-lg overflow-hidden"
            >
              <Link href={`/categories/${category.id}`} passHref>
                {category.logo ? (
                <img
                  src={category.logo}
                  alt={category.nom}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                ) : null}
                <h3 className="mt-4 text-m text-gray-700 font-bold text-center">{category.nom}</h3>
                
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}