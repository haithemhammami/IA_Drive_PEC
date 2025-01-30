"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const reviews = [
  {
    id: 1,
    name: "Émilie Dupont",
    rating: 5,
    comment: "IA_Drive a révolutionné mes courses ! Les suggestions de l'IA sont parfaites.",
  },
  {
    id: 2,
    name: "Michel Chen",
    rating: 4,
    comment: "Super application, me fait gagner beaucoup de temps. Les suggestions de recettes sont une belle touche.",
  },
  {
    id: 3,
    name: "Sarah Martin",
    rating: 5,
    comment: "J'adore comment ça génère des listes de courses à partir de photos d'aliments. Tellement pratique !",
  },
  {
    id: 4,
    name: "David Lefebvre",
    rating: 4,
    comment: "L'IA est impressionnante. C'est comme avoir un assistant personnel pour les courses.",
  },
]

export function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0)

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `${-currentReview * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {reviews.map((review, index) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
                    <p className="font-semibold">{review.name}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md"
            onClick={prevReview}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md"
            onClick={nextReview}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-12 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="glow">
                <MessageSquare className="mr-2 h-4 w-4" />
                Laisser un avis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Laisser un avis</DialogTitle>
                <DialogDescription>
                  Partagez votre expérience avec IA_Drive. Vos commentaires nous aident à nous améliorer !
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Nom
                  </label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="rating" className="text-right">
                    Note
                  </label>
                  <div className="flex col-span-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="comment" className="text-right">
                    Commentaire
                  </label>
                  <Textarea id="comment" className="col-span-3" />
                </div>
              </div>
              <Button type="submit">Soumettre l'avis</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}

