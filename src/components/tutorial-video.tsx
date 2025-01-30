"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TutorialVideo() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isPlaying && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="h-20 w-20" />
            </Button>
          )}
          {isPlaying ? (
            <video className="aspect-video w-full" autoPlay controls>
              <source src="/path-to-your-video.mp4" type="video/mp4" />
              Votre navigateur ne prend pas en charge la balise vidéo.
            </video>
          ) : (
            <img
              src="/placeholder.svg?height=720&width=1280"
              alt="Miniature de la vidéo tutorielle"
              className="aspect-video w-full"
              width={1280}
              height={720}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}

