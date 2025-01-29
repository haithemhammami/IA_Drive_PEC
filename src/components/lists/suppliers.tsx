//"use client"
//
//import type React from "react"
//import { useState, useEffect } from "react"
//import Image from "next/image"
//import type { Supplier } from "@/types/supplier"
//import AddSupplierForm from "@/components/FormElements/AddSupplierForm"
//import EditSupplierForm from "@/components/FormElements/EditSupplierForm"
//
//
//const SupplierTable: React.FC = () => {
//  const [suppliers, setSuppliers] = useState<Supplier[]>([])
//  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
//  const [searchTerm, setSearchTerm] = useState("")
//  const [currentPage, setCurrentPage] = useState(1)
//  const [suppliersPerPage] = useState(5)
//  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
//  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
//
//  useEffect(() => {
//    fetchSuppliers()
//  }, [])
//
//  useEffect(() => {
//    const results = suppliers.filter(
//      (supplier) =>
//        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        supplier.productCategories.toLowerCase().includes(searchTerm.toLowerCase()),
//    )
//    setFilteredSuppliers(results)
//    setCurrentPage(1)
//  }, [searchTerm, suppliers])
//
//  const fetchSuppliers = async () => {
//    try {
//      const response = await fetch("/api/suppliersAdmin")
//      if (!response.ok) {
//        throw new Error("Failed to fetch suppliers")
//      }
//      const data = await response.json()
//      setSuppliers(data)
//    } catch (error) {
//      console.error("Error fetching suppliers:", error)
//    }
//  }
//
//  const indexOfLastSupplier = currentPage * suppliersPerPage
//  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage
//  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier)
//
//  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
//
//  const addSupplier = async (newSupplier: Omit<Supplier, "id">) => {
//    try {
//      const response = await fetch("/api/suppliersAdmin", {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(newSupplier),
//      })
//      if (!response.ok) {
//        throw new Error("Failed to add supplier")
//      }
//      await fetchSuppliers()
//      setIsAddingSupplier(false)
//    } catch (error) {
//      console.error("Error adding supplier:", error)
//    }
//  }
//
//  const updateSupplier = async (updatedSupplier: Supplier) => {
//    try {
//      const response = await fetch(`/api/suppliersAdmin/${updatedSupplier.id}`, {
//        method: "PUT",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(updatedSupplier),
//      })
//      if (!response.ok) {
//        throw new Error("Failed to update supplier")
//      }
//      await fetchSuppliers()
//      setEditingSupplier(null)
//    } catch (error) {
//      console.error("Error updating supplier:", error)
//    }
//  }
//
//  const deleteSupplier = async (id: string) => {
//    try {
//      const response = await fetch(`/api/suppliersAdmin/${id}`, {
//        method: "DELETE",
//      })
//      if (!response.ok) {
//        throw new Error("Failed to delete supplier")
//      }
//      await fetchSuppliers()
//    } catch (error) {
//      console.error("Error deleting supplier:", error)
//    }
//  }
//
//  return (
//    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
//      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">Tous les fournisseurs</h4>
//
//      <div className="mb-4 flex justify-between items-center">
//        <input
//          type="text"
//          placeholder="Rechercher un fournisseur..."
//          value={searchTerm}
//          onChange={(e) => setSearchTerm(e.target.value)}
//          className="w-64 px-4 py-2 border rounded-md"
//        />
//        <button onClick={() => setIsAddingSupplier(true)} className="bg-primary text-white px-4 py-2 rounded-md">
//          Ajouter un fournisseur
//        </button>
//      </div>
//
//      <div className="flex flex-col">
//        <div className="grid grid-cols-3 sm:grid-cols-6">
//          <div className="px-2 pb-3.5">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Société</h5>
//          </div>
//          <div className="px-2 pb-3.5 text-center">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Catégories produit</h5>
//          </div>
//          <div className="px-2 pb-3.5 text-center">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Min achat</h5>
//          </div>
//          <div className="px-2 pb-3.5 text-center">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Durée livraison</h5>
//          </div>
//          <div className="px-2 pb-3.5 text-center">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Numéro</h5>
//          </div>
//          <div className="px-2 pb-3.5 text-center">
//            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
//          </div>
//        </div>
//
//        {currentSuppliers.map((supplier, index) => (
//          <div
//            className={`grid grid-cols-3 sm:grid-cols-6 ${
//              index === currentSuppliers.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
//            }`}
//            key={supplier.id}
//          >
//            <div className="flex items-center gap-3.5 px-2 py-4">
//              <div className="flex-shrink-0">
//                <Image src={supplier.logo || "/placeholder.svg"} alt="Brand" width={48} height={48} />
//              </div>
//              <p className="hidden font-medium text-dark dark:text-white sm:block">{supplier.name}</p>
//            </div>
//
//            <div className="flex items-center justify-center px-2 py-4">
//              <p className="font-medium text-dark dark:text-white">{supplier.productCategories}</p>
//            </div>
//
//            <div className="flex items-center justify-center px-2 py-4">
//              <p className="font-medium text-green-light-1">€{supplier.minPurchase}</p>
//            </div>
//
//            <div className="items-center justify-center px-2 py-4 sm:flex">
//              <p className="font-medium text-dark dark:text-white">{supplier.deliveryTime}</p>
//            </div>
//
//            <div className="items-center justify-center px-2 py-4 sm:flex">
//              <p className="font-medium text-dark dark:text-white">{supplier.phoneNumber}</p>
//            </div>
//
//            <div className="flex items-center justify-center px-2 py-4 space-x-2">
//              <button
//                onClick={() => setEditingSupplier(supplier)}
//                className="bg-blue-500 text-white px-2 py-1 rounded-md"
//              >
//                Modifier
//              </button>
//              <button
//                onClick={() => deleteSupplier(supplier.id)}
//                className="bg-red-500 text-white px-2 py-1 rounded-md"
//              >
//                Supprimer
//              </button>
//            </div>
//          </div>
//        ))}
//      </div>
//
//      <div className="mt-4 flex justify-center">
//        {Array.from({ length: Math.ceil(filteredSuppliers.length / suppliersPerPage) }, (_, i) => (
//          <button
//            key={i}
//            onClick={() => paginate(i + 1)}
//            className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-primary text-white" : "bg-gray-200"}`}
//          >
//            {i + 1}
//          </button>
//        ))}
//      </div>
//
//      {isAddingSupplier && <AddSupplierForm onAdd={addSupplier} onCancel={() => setIsAddingSupplier(false)} />}
//
//      {editingSupplier && (
//        <EditSupplierForm
//          supplier={editingSupplier}
//          onUpdate={updateSupplier}
//          onCancel={() => setEditingSupplier(null)}
//        />
//      )}
//    </div>
//  )
//}
//
//export default SupplierTable
//
//
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { Supplier } from "@/types/supplier"
import AddSupplierForm from "@/components/FormElements/AddSupplierForm"
import EditSupplierForm from "@/components/FormElements/EditSupplierForm"

const SupplierTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [suppliersPerPage] = useState(5)
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    const results = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.productCategories.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSuppliers(results)
    setCurrentPage(1)
  }, [searchTerm, suppliers])

  const indexOfLastSupplier = currentPage * suppliersPerPage
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstSupplier, indexOfLastSupplier)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const addSupplier = async (formData: FormData) => {
    try {
      const response = await fetch("/api/suppliersAdmin", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Failed to add supplier")
      }
      await fetchSuppliers()
      setIsAddingSupplier(false)
    } catch (error) {
      console.error("Error adding supplier:", error)
    }
  }

  const updateSupplier = async (formData: FormData) => {
    try {
      const id = formData.get("id") as string
      const response = await fetch(`/api/suppliersAdmin/${id}`, {
        method: "PUT",
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Failed to update supplier")
      }
      await fetchSuppliers()
      setEditingSupplier(null)
    } catch (error) {
      console.error("Error updating supplier:", error)
    }
  }

  const deleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/suppliersAdmin/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete supplier")
      }
      await fetchSuppliers()
    } catch (error) {
      console.error("Error deleting supplier:", error)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliersAdmin")
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers")
      }
      const data = await response.json()
      setSuppliers(data)
      setFilteredSuppliers(data)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    }
  }

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">Tous les fournisseurs</h4>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Rechercher un fournisseur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 px-4 py-2 border rounded-md"
        />
        <button onClick={() => setIsAddingSupplier(true)} className="bg-primary text-white px-4 py-2 rounded-md">
          Ajouter un fournisseur
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 sm:grid-cols-6">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Société</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Catégories produit</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Min achat</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Durée livraison</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Numéro</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
          </div>
        </div>

        {currentSuppliers.map((supplier, index) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-6 ${
              index === currentSuppliers.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
            }`}
            key={supplier.id}
          >
            <div className="flex items-center gap-3.5 px-2 py-4">
              <div className="flex-shrink-0">
                <Image src={supplier.logo || "/placeholder.svg"} alt="Brand" width={48} height={48} />
              </div>
              <p className="hidden font-medium text-dark dark:text-white sm:block">{supplier.name}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">{supplier.productCategories}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-green-light-1">€{supplier.minPurchase}</p>
            </div>

            <div className="items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">{supplier.deliveryTime}</p>
            </div>

            <div className="items-center justify-center px-2 py-4 sm:flex">
              <p className="font-medium text-dark dark:text-white">{supplier.phoneNumber}</p>
            </div>

            <div className="flex items-center justify-center px-2 py-4 space-x-2">
              <button
                onClick={() => setEditingSupplier(supplier)}
                className="bg-blue-500 text-white px-2 py-1 rounded-md"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteSupplier(supplier.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredSuppliers.length / suppliersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {isAddingSupplier && <AddSupplierForm onAdd={addSupplier} onCancel={() => setIsAddingSupplier(false)} />}

      {editingSupplier && (
        <EditSupplierForm
          supplier={editingSupplier}
          onUpdate={(formData) => updateSupplier(formData)}
          onCancel={() => setEditingSupplier(null)}
        />
      )}
    </div>
  )
}

export default SupplierTable

