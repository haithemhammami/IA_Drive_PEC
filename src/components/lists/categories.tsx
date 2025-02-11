"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Categorie {
  id: number
  nom: string
  logo: string | null
  createdAt: string
  updatedAt: string
}

const TableCategories: React.FC = () => {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 5

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
    return <div className="text-center py-4">Chargement des rayons...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur : {error}</div>
  }

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Tous les rayons</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Logo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Nom
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Créé le
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 hidden sm:table-cell"
              >
                Mis à jour le
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {currentCategories.map((categorie) => (
              <tr key={categorie.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-10 w-10">
                    {categorie.logo ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={categorie.logo || ""}
                        alt={categorie.nom}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Logo
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{categorie.nom}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(categorie.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(categorie.updatedAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Précédent
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCategory >= categories.length}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">{indexOfFirstCategory + 1}</span> à{" "}
              <span className="font-medium">{Math.min(indexOfLastCategory, categories.length)}</span> sur{" "}
              <span className="font-medium">{categories.length}</span> résultats
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? "z-10 bg-primary border-primary text-white dark:bg-primary dark:text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableCategories

