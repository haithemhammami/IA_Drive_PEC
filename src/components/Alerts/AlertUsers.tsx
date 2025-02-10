"use client"

import type React from "react"
import { useState } from "react"
import { Trash2 } from "lucide-react"

interface Review {
  id: number
  nom: string
  note: number
  commentaire: string
  createdAt: string
}

interface AlertUserProps {
  review: Review
  onDelete: () => void
}

const AlertUser: React.FC<AlertUserProps> = ({ review, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete()
    setIsDeleting(false)
    setShowConfirmation(false)
  }

  return (
    <div className="flex w-full rounded-[10px] border-l-6 border-orange-500 bg-orange-100 px-7 py-8 dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
      <div className="mr-5 mt-[5px] flex h-8 w-full max-w-8 items-center justify-center rounded-md bg-orange-500">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 2H4C2.89 2 2 2.89 2 4V20L6 16H20C21.1 16 22 15.1 22 14V4C22 2.89 21.1 2 20 2ZM20 14H5.17L4 15.17V4H20V14Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-start mb-4">
          <h5 className="font-bold leading-[22px] text-orange-600">Avis de {review.nom}</h5>
          <div className="flex items-center">
            <span className="mr-2 text-orange-600">Note: {review.note}/5</span>
            {!showConfirmation ? (
              <button
                onClick={() => setShowConfirmation(true)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-red-700 transition-colors duration-200"
                >
                  {isDeleting ? "Suppression..." : "Confirmer"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-orange-700 mb-2">{review.commentaire}</p>
        <p className="text-sm text-orange-600">Reçu le: {new Date(review.createdAt).toLocaleString()}</p>
      </div>
    </div>
  )
}

export default AlertUser

