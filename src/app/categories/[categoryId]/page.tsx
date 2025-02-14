import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface ProductsByCategoryPageProps {
  params: { categoryId: string };
}

export default async function ProductsByCategoryPage({ params }: ProductsByCategoryPageProps) {
  const categoryIdInt = parseInt(params.categoryId);

  if (isNaN(categoryIdInt)) {
    return <div>ID de catégorie invalidze</div>;
  }

  const products = await prisma.produit.findMany({
    where: { categorieId: categoryIdInt },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Produits de la catégorie {categoryIdInt}
        </h1>
        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product: { id: number; image: string | null; nom: string; description: string; prix: number }) => (
              <li key={product.id} className="group">
                <Link href={`/products/${product.id}`} passHref>
                  <div className="cursor-pointer">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.nom}
                        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                      />
                    )}
                    <h2 className="mt-4 text-m text-gray-700 font-bold px-2">{product.nom}</h2>
                    <p className="text-gray-600 text-sm mb-1 px-2">{product.description}</p>
                    <p className="text-green-600 font-medium text-lg px-2">
                      Prix : {product.prix} €
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun produit trouvé pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
}
