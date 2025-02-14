import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await prisma.produit.findUnique({
    where: { id: parseInt(params.productId) },
  });

  if (!product) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  return (
    <div className="flex flex-col justify-center px-2 py-12 my-12 mx-auto w-3/4 aspect-square bg-white shadow-lg rounded-lg">
      {product.image && (
        <img
          src={product.image}
          alt={product.nom}
          className="h-40 w-full object-cover rounded-md"
        />
      )}
      <h1 className="mt-4 text-base text-gray-700 font-bold">{product.nom}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-gray-600 font-medium text-lg">Prix : {product.prix} €</p>
      {/* Le bouton Ajouter au panier devra être géré côté client */}
    </div>
  );
}
