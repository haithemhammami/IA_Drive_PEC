"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export function TutorialVideo() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-20 sm:py-32" id="tutorial">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Comment ça marche</h2>
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:text-primary transition-all duration-300 transform hover:scale-110"
                onClick={() => setIsPlaying(true)}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Play className="h-16 w-16" />
                  <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-md animate-pulse"></div>
                </motion.div>
              </Button>
            </div>
          )}
          {isPlaying ? (
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/N0ADpGqGhY8?autoplay=1"
              title="Tutoriel YumiMind"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <Image
              src={`https://img.youtube.com/vi/N0ADpGqGhY8/maxresdefault.jpg`}
              alt="Miniature de la vidéo tutorielle"
              className="aspect-video w-full object-cover"
              width={1280}
              height={720}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}

