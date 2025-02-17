"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection({ onStartClick }: { onStartClick: () => void }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32" id="about" aria-labelledby="hero-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20 items-center">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <motion.h1
              id="hero-title"
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Assistant de courses alimenté par l'IA
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              YumiMind vous aide à gérer efficacement vos courses en générant automatiquement des listes de courses à
              partir de photos d'aliments. Notre IA identifie les plats, extrait les ingrédients et suggère des recettes
              tout en recommandant les articles manquants.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-x-6 gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button onClick={onStartClick}>Commencer</Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("trustfeatures")?.scrollIntoView({ behavior: "smooth" })}
              >
                En savoir plus
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Image
              src="/hero.png"
              alt="Illustration de YumiMind en action"
              width={1016}
              height={784}
              className="rounded-xl shadow-xl ring-1 ring-gray-400/10 dark:ring-gray-700/10 w-full h-auto object-cover transition-transform duration-300 hover:scale-105 sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

