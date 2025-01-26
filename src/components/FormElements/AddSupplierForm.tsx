import type React from "react"
import { useState } from "react"
import type { Supplier } from "@/types/supplier"

interface AddSupplierFormProps {
  onAdd: (supplier: Supplier) => void
  onCancel: () => void
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onAdd, onCancel }) => {
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    logo: "/images/brand/brand-default.svg",
    name: "",
    productCategories: "",
    minPurchase: 0,
    deliveryTime: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSupplier((prev) => ({ ...prev, [name]: name === "minPurchase" ? Number(value) : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(newSupplier as Supplier)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Ajouter un fournisseur</h2>
        <input
          type="text"
          name="name"
          value={newSupplier.name}
          onChange={handleChange}
          placeholder="Nom de la société"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="productCategories"
          value={newSupplier.productCategories}
          onChange={handleChange}
          placeholder="Catégories de produits"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          name="minPurchase"
          value={newSupplier.minPurchase}
          onChange={handleChange}
          placeholder="Achat minimum"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="deliveryTime"
          value={newSupplier.deliveryTime}
          onChange={handleChange}
          placeholder="Durée de livraison"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={newSupplier.phoneNumber}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <div className="flex justify-end">
          <button type="button" onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-200 rounded">
            Annuler
          </button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSupplierForm

