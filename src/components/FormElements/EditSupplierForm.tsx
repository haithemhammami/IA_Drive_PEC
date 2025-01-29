import type React from "react"
import { useState, useCallback } from "react"
import Image from "next/image"
import type { Supplier } from "@/types/supplier"

interface EditSupplierFormProps {
  supplier: Supplier
  onUpdate: (supplier: FormData) => void
  onCancel: () => void
}

const EditSupplierForm: React.FC<EditSupplierFormProps> = ({ supplier, onUpdate, onCancel }) => {
  const [editedSupplier, setEditedSupplier] = useState<Supplier>(supplier)
  const [newLogo, setNewLogo] = useState<File | null>(null)
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedSupplier((prev) => ({ ...prev, [name]: name === "minPurchase" ? Number(value) : value }))
  }, [])

  //const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //  if (e.target.files && e.target.files[0]) {
  //    const file = e.target.files[0]
  //    setNewLogo(file)
  //    setPreviewLogo(URL.createObjectURL(file))
  //  }
  //}, [])
  //<input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-2 border rounded" />

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData()
      formData.append("id", editedSupplier.id.toString())
      Object.entries(editedSupplier).forEach(([key, value]) => {
        if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
          formData.append(key, value.toString())
        }
      })
      if (newLogo) {
        formData.append("logo", newLogo)
      }
      onUpdate(formData)
    },
    [editedSupplier, newLogo, onUpdate],
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Modifier un fournisseur</h2>
        <input
          type="text"
          name="name"
          value={editedSupplier.name}
          onChange={handleChange}
          placeholder="Nom de la société"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="productCategories"
          value={editedSupplier.productCategories}
          onChange={handleChange}
          placeholder="Catégories de produits"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          name="minPurchase"
          value={editedSupplier.minPurchase}
          onChange={handleChange}
          placeholder="Achat minimum"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="deliveryTime"
          value={editedSupplier.deliveryTime}
          onChange={handleChange}
          placeholder="Durée de livraison"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={editedSupplier.phoneNumber}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <div className="mb-2">
          <p className="mb-1">Logo:</p>
          <Image
            src={previewLogo || editedSupplier.logo || "/placeholder.svg"}
            alt="Current logo"
            width={100}
            height={100}
            className="rounded"
          />
        </div>
        
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
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditSupplierForm

