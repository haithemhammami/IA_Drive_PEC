"use client"

import { motion } from "framer-motion"
import { Camera, List, ShoppingBag } from "lucide-react"

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
    <section className="py-20 bg-gray-50 dark:bg-gray-800" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos fonctionnalités principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

