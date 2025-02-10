"use client"

import { useState, useEffect } from "react"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLaout"
import AlertUser from "@/components/Alerts/AlertUsers"

interface Review {
  id: number
  nom: string
  note: number
  commentaire: string
  createdAt: string
}

const AlertsUsers = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const handleDeleteReview = async (id: number) => {
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== id))
      }
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Avis Utilisateurs" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          {reviews.map((review) => (
            <AlertUser key={review.id} review={review} onDelete={() => handleDeleteReview(review.id)} />
          ))}
        </div>
      </div>
    </DefaultLayout>
  )
}

export default AlertsUsers

