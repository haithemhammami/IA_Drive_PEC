"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface AnalysisItem {
  id: number
  name: string
  createdAt: string
}

const AnalysisList: React.FC = () => {
  const [analysisItems, setAnalysisItems] = useState<AnalysisItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchAnalysisItems = async () => {
      try {
        const response = await fetch("/api/analysis")
        if (!response.ok) {
          throw new Error("Failed to fetch analysis items")
        }
        const data = await response.json()
        setAnalysisItems(data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching analysis items")
        setLoading(false)
        console.error("Error fetching analysis items:", err)
      }
    }

    fetchAnalysisItems()

    // Set up real-time updates
    const eventSource = new EventSource("/api/analysis")
    eventSource.onmessage = (event) => {
      const newItem = JSON.parse(event.data)
      setAnalysisItems((prevItems) => [newItem, ...prevItems])
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const filteredItems = analysisItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="text-center py-4">Loading analysis items...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Analyse IA des produits manquants</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Recherche/produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-body" />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">Nom du produit</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Date de l’alerte</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === currentItems.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white">{item.name}</h5>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === currentItems.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">{new Date(item.createdAt).toLocaleString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}{" "}
          items
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= filteredItems.length}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisList

