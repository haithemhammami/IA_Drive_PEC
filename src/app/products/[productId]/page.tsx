//import { prisma } from "@/lib/prisma";
//import Image from "next/image";
//import { Produit } from "@prisma/client";
//import { GetServerSidePropsContext } from "next";
//
//export default async function ProductPage({params,}: GetServerSidePropsContext<{ productId: string }>) {
//  // Vérification et conversion de l'ID du produit
//  const productId = params ? Number(params.productId) : NaN;
//  if (isNaN(productId)) {
//    return <div className="text-center text-red-600 p-4">ID de produit invalide.</div>;
//  }
//
//  // Récupérer le produit depuis la base de données
//  const product = await prisma.produit.findUnique({
//    where: { id: productId },
//  });
//
//  if (!product) {
//    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
//  }
//
//  return (
//    <div className="flex flex-col justify-center px-2 py-12 my-12 mx-auto w-3/4 aspect-square bg-white shadow-lg rounded-lg">
//      {product.image && (
//        <Image
//          src={product.image}
//          alt={product.nom}
//          className="h-40 w-full object-cover rounded-md"
//          width={300}
//          height={300}
//          priority
//        />
//      )}
//      <h1 className="mt-4 text-base text-gray-700 font-bold">{product.nom}</h1>
//      <p className="text-gray-600 mb-2">{product.description}</p>
//      <p className="text-gray-600 font-medium text-lg">Prix : {product.prix} €</p>
//    </div>
//  );
//}

import { prisma } from "@/lib/prisma";
import Image from "next/image";


type Props = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProductPage({
  params,
}: Props) {
  // Vérification et conversion de l'ID du produit
  const productId = Number(params.productId);
  if (isNaN(productId)) {
    return <div className="text-center text-red-600 p-4">ID de produit invalide.</div>;
  }

  // Récupérer le produit depuis la base de données
  const product = await prisma.produit.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return <div className="text-center text-red-600 p-4">Produit non trouvé.</div>;
  }

  return (
    <div className="flex flex-col justify-center px-2 py-12 my-12 mx-auto w-3/4 aspect-square bg-white shadow-lg rounded-lg">
      {product.image && (
        <Image
          src={product.image}
          alt={product.nom}
          className="h-40 w-full object-cover rounded-md"
          width={300}
          height={300}
          priority
        />
      )}
      <h1 className="mt-4 text-base text-gray-700 font-bold">{product.nom}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-gray-600 font-medium text-lg">Prix : {product.prix} €</p>
    </div>
  );
}