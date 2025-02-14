import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, MessageSquare, Loader2 } from "lucide-react"
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
import useSWR, { mutate } from "swr"

interface Review {
  id: number
  nom: string
  note: number
  commentaire: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CustomerReviews() {
  const [currentReview, setCurrentReview] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: reviews, error } = useSWR<Review[]>("/api/reviews", fetcher)
  const [newReview, setNewReview] = useState({ nom: "", note: 5, commentaire: "" })

  const nextReview = () => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }
  }

  const prevReview = () => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      })
      if (response.ok) {
        await mutate("/api/reviews")
        setNewReview({ nom: "", note: 5, commentaire: "" })
        setDialogOpen(false) // Fermeture automatique
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
          <div className="text-center text-red-500">Impossible de charger les avis</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!Array.isArray(reviews) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center min-h-[200px]"
              >
                <Loader2 className="w-8 h-8 animate-spin" />
              </motion.div>
            ) : (
              <div className="overflow-hidden rounded-xl">
                <motion.div
                  className="flex"
                  initial={{ x: 0 }}
                  animate={{ x: `${-currentReview * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      className="w-full flex-shrink-0 px-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${
                                i < review.note ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{review.commentaire}</p>
                        <p className="font-semibold text-xl">{review.nom}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md rounded-full"
            onClick={prevReview}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white dark:bg-gray-700 shadow-md rounded-full"
            onClick={nextReview}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-12 text-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  Partagez votre expérience avec YumiMind. Vos commentaires nous aident à nous améliorer !
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitReview} className="grid gap-6 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="name"
                    value={newReview.nom}
                    onChange={(e) => setNewReview({ ...newReview, nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium">
                    Note
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= newReview.note ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                        onClick={() => setNewReview({ ...newReview, note: star })}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Commentaire
                  </label>
                  <Textarea
                    id="comment"
                    value={newReview.commentaire}
                    onChange={(e) => setNewReview({ ...newReview, commentaire: e.target.value })}
                    placeholder="Partagez votre expérience..."
                    className="w-full min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Soumettre l'avis"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}