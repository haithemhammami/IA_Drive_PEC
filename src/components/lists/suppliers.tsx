"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { Supplier } from "@/types/supplier"
import AddSupplierForm from "@/components/FormElements/AddSupplierForm"
import EditSupplierForm from "@/components/FormElements/EditSupplierForm"

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    logo: "/images/brand/brand-01.svg",
    name: "ALLO",
    productCategories: "Fruits, Légumes",
    minPurchase: 500,
    deliveryTime: "2-3 jours",
    phoneNumber: "+33 1 23 45 67 89",
  },
  {
    id: "2",
    logo: "/images/brand/brand-02.svg",
    name: "DRIVEME",
    productCategories: "Boissons, Snacks",
    minPurchase: 300,
    deliveryTime: "1-2 jours",
    phoneNumber: "+33 9 87 65 43 21",
  },
  {
    id: "3",
    logo: "/images/brand/brand-03.svg",
    name: "FRUIT",
    productCategories: "Fruits exotiques",
    minPurchase: 1000,
    deliveryTime: "3-4 jours",
    phoneNumber: "+33 6 12 34 56 78",
  },
  {
    id: "4",
    logo: "/images/brand/brand-04.svg",
    name: "BIO",
    productCategories: "Produits bio",
    minPurchase: 750,
    deliveryTime: "2-3 jours",
    phoneNumber: "+33 7 89 01 23 45",
  },
  {
    id: "5",
    logo: "/images/brand/brand-05.svg",
    name: "CHOCO",
    productCategories: "Chocolats, Confiseries",
    minPurchase: 250,
    deliveryTime: "1-2 jours",
    phoneNumber: "+33 6 54 32 10 98",
  },
]

const SupplierTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [suppliersPerPage] = useState(5)
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

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

  const addSupplier = (newSupplier: Supplier) => {
    setSuppliers([...suppliers, { ...newSupplier, id: Date.now().toString() }])
    setIsAddingSupplier(false)
  }

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map((supplier) => (supplier.id === updatedSupplier.id ? updatedSupplier : supplier)))
    setEditingSupplier(null)
  }

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id))
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
          onUpdate={updateSupplier}
          onCancel={() => setEditingSupplier(null)}
        />
      )}
    </div>
  )
}

export default SupplierTable

