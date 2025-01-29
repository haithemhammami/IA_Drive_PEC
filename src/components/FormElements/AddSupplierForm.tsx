import type React from "react"
import { useState } from "react"
import type { Supplier } from "@/types/supplier"

interface AddSupplierFormProps {
  onAdd: (supplier: FormData) => void
  onCancel: () => void
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onAdd, onCancel }) => {
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id" | "logo" | "createdAt" | "updatedAt">>({
    name: "",
    productCategories: "",
    minPurchase: 0,
    deliveryTime: "",
    phoneNumber: "",
  })
  const [logo, setLogo] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSupplier((prev) => ({
      ...prev,
      [name]: name === "minPurchase" ? Number(value) || 0 : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(newSupplier).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    if (logo) {
      formData.append("logo", logo)
    }
    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Ajouter un fournisseur</h2>
        <input
          type="text"
          name="name"
          value={newSupplier.name}
          onChange={handleChange}
          placeholder="Nom de la société (ex: ALLO Fruits)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="productCategories"
          value={newSupplier.productCategories}
          onChange={handleChange}
          placeholder="Catégories de produits (ex: Fruits, Légumes)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          name="minPurchase"
          value={newSupplier.minPurchase}
          onChange={handleChange}
          placeholder="Achat minimum en euros (ex: 500)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="deliveryTime"
          value={newSupplier.deliveryTime}
          onChange={handleChange}
          placeholder="Durée de livraison (ex: 2-3 jours)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={newSupplier.phoneNumber}
          onChange={handleChange}
          placeholder="Numéro de téléphone (ex: +33 1 23 45 67 89)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-2 border rounded" />
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSupplierForm

