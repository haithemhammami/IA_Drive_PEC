"use client"

import { motion } from "framer-motion"
import { Camera, List, ShoppingBag } from "lucide-react"
import Image from 'next/image';

const features = [
  {
    icon: Camera,
    title: "Reconnaissance d'image",
    description: "Prenez une photo de vos ingrédients et obtenez instantanément des suggestions de recettes.",
  },
  {
    icon: List,
    title: "Listes de courses intelligentes",
    description: "Générez automatiquement des listes de courses basées sur vos recettes préférées.",
  },
  {
    icon: ShoppingBag,
    title: "Recommandations personnalisées",
    description: "Recevez des suggestions de produits adaptées à vos préférences et habitudes d'achat.",
  },
]

export function FeatureShowcase() {
  return (
    <section className="py-20 sm:py-32" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <Image 
              src="/uploads/1739038396412-2074.webp" 
              alt="Feature Showcase Image" 
              width={800} 
              height={600} 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Amazing Feature</h3>
            <p className="text-lg text-gray-700">Description of the amazing feature.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

