import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.categorie.findMany();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Catégories</h1>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
          {categories.map((category: { id: string; logo: string | null; nom: string }) => (
            <li key={category.id} className="group shadow-lg p-4 rounded-lg overflow-hidden">
              <Link href={`/categories/${category.id}`} passHref>
                <div className="cursor-pointer">
                  {category.logo && (
                    <img
                      src={category.logo}
                      alt={category.nom}
                      className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                    />
                  )}
                  <h3 className="mt-4 text-m text-gray-700 font-bold text-center">{category.nom}</h3>
                </div>
              </Link>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Ajouter au panier
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
