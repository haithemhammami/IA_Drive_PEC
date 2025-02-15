"use client";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface ProductPageProps {}

export default async function ProductPage({}: ProductPageProps) {
  const searchParams = useSearchParams();
  const productId = searchParams ? parseInt(searchParams.get('productId') || '', 10) : NaN;

  if (isNaN(productId)) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  const product = await prisma.produit.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  return (
    <div className="flex flex-col justify-center px-2 py-12 my-12 mx-auto w-3/4 aspect-square bg-white shadow-lg rounded-lg">
      {product.image && (
        <Image src={product.image} alt={product.nom} className="h-40 w-full object-cover rounded-md" width={300} height={200} />
      )}
      <h1 className="mt-4 text-base text-gray-700 font-bold">{product.nom}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-gray-600 font-medium text-lg">Prix : {product.prix} €</p>
    </div>
  );
}
