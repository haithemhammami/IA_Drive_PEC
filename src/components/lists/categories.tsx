"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Categorie {
  id: number
  nom: string
  logo: string | null
  createdAt: string
  updatedAt: string
}

const TableCategories = () => {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoriesAdmin")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des catégories")
        }
        const data = await response.json()
        setCategories(data)
        setIsLoading(false)
      } catch (err) {
        setError("Impossible de charger les catégories")
        setIsLoading(false)
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return <div>Chargement des rayons...</div>
  }

  if (error) {
    return <div>Erreur : {error}</div>
  }

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">Toutes les rayons</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-4">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Logo</h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nom</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Créé le</h5>
          </div>
          <div className="hidden px-2 pb-3.5 text-center sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Mis à jour le</h5>
          </div>
        </div>

        {categories.map((categorie, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-4 ${
              key === categories.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
            }`}
            key={categorie.id}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex-shrink-0">
                {categorie.logo ? (
                  <Image src={categorie.logo || "/placeholder.svg"} alt={categorie.nom} width={48} height={48} />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-500">No Logo</div>
                )}
              </div>
            </div>

            <div className="flex items-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{categorie.nom}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {new Date(categorie.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="hidden items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">
                {new Date(categorie.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableCategories

