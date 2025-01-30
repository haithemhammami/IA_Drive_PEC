"use client"

import { motion } from "framer-motion"

const announcements = [
  "🎉 Nouvelle fonctionnalité : Suggestions de recettes alimentées par l'IA maintenant disponibles !",
  "🛒 Obtenez 20% de réduction sur votre première commande avec le code BIENVENUE20",
  "🚚 Livraison gratuite pour les commandes de plus de 50€",
]

export function AnnouncementBanner() {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
        className="whitespace-nowrap"
      >
        {announcements.map((announcement, index) => (
          <span key={index} className="inline-block mx-4">
            {announcement}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

