"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const announcements = [
  "🎉 Nouvelle fonctionnalité : Suggestions de recettes alimentées par l'IA maintenant disponibles !",
  "🛒 Obtenez 20% de réduction sur votre première commande avec le code BIENVENUE20",
  "🚚 Livraison gratuite pour les commandes de plus de 50€",
]

export function AnnouncementBanner() {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length)
    }, 5000) // Change announcement every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="bg-primary text-primary-foreground py-2 overflow-hidden"
      role="banner"
      aria-label="Annonces importantes"
    >
      <div className="container mx-auto px-4">
        <motion.div
          key={currentAnnouncementIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm md:text-base">{announcements[currentAnnouncementIndex]}</p>
        </motion.div>
      </div>
    </div>
  )
}

