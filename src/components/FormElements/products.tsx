"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import SelectCategorie, { type Category } from "@/components/FormElements/SelectGroup/SelectCategorie"
import SelectProduct from "@/components/FormElements/SelectGroup/SelectProduct"
import DeletProduct from "@/components/Popups/DeletProduct"
import ModifyProduct from "@/components/Popups/ModifyProduct"

export interface Product {
  id: number
  nom: string
  description: string
  prix: number
  stock: number
  categorieId: number
  image: string | null
  createdAt: string
  updatedAt: string
}

const FormElements: React.FC = () => {
  const [isModifyPopupOpen, setModifyPopupOpen] = useState(false)
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // État de chargement
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    categorieId: "",
    image: null as File | null,
  })
  const [modifiedProduct, setModifiedProduct] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    categorieId: "",
    image: null as File | null,
  })
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; message: string } | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  // Mise à jour du useEffect pour réinitialiser modifiedProduct quand selectedProduct change
  useEffect(() => {
    if (selectedProduct) {
      setModifiedProduct({
        nom: selectedProduct.nom,
        description: selectedProduct.description || "",
        prix: selectedProduct.prix.toString(),
        stock: selectedProduct.stock.toString(),
        categorieId: selectedProduct.categorieId.toString(),
        image: null,
      })
    } else {
      setModifiedProduct({
        nom: "",
        description: "",
        prix: "",
        stock: "",
        categorieId: "",
        image: null,
      })
    }
  }, [selectedProduct])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categoriesAdmin")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setStatusMessage({ type: "error", message: "Erreur lors de la récupération des catégories" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/productsAdmin")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setStatusMessage({ type: "error", message: "Erreur lors de la récupération des produits" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
    }
  }

  const handleModifyClick = () => setModifyPopupOpen(true)
  const handleDeleteClick = () => setDeletePopupOpen(true)
  const handleClosePopup = () => {
    setModifyPopupOpen(false)
    setDeletePopupOpen(false)
  }

  const handleConfirmModify = async () => {
    if (!selectedProduct) {
      setStatusMessage({ type: "error", message: "Veuillez sélectionner un produit à modifier" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
      return
    }

    setIsLoading(true) // Activer l'état de chargement

    const formData = new FormData()
    formData.append("id", selectedProduct.id.toString())
    formData.append("nom", modifiedProduct.nom)
    formData.append("description", modifiedProduct.description)
    formData.append("prix", modifiedProduct.prix)
    formData.append("stock", modifiedProduct.stock)
    formData.append("categorieId", modifiedProduct.categorieId)

    if (modifiedProduct.image) {
      formData.append("image", modifiedProduct.image)
    }

    try {
      const response = await fetch(`/api/productsAdmin/${selectedProduct.id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      const updatedProduct = await response.json()
      setStatusMessage({ type: "success", message: "Produit modifié avec succès !" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
      await fetchProducts() // Actualiser la liste des produits
      setModifyPopupOpen(false)
      setSelectedProduct(updatedProduct.produit)
    } catch (error) {
      console.error("Error updating product:", error)
      setStatusMessage({ type: "error", message: "Erreur lors de la modification du produit" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
    } finally {
      setIsLoading(false) // Désactiver l'état de chargement
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedProduct) {
      setStatusMessage({ type: "error", message: "Veuillez sélectionner un produit à supprimer" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
      return
    }

    setIsLoading(true) // Activer l'état de chargement

    try {
      const response = await fetch(`/api/productsAdmin/${selectedProduct.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setStatusMessage({ type: "success", message: "Produit supprimé avec succès !" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
      fetchProducts()
      setDeletePopupOpen(false)
    } catch (error) {
      console.error("Error deleting product:", error)
      setStatusMessage({ type: "error", message: "Erreur lors de la suppression du produit" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
    } finally {
      setIsLoading(false) // Désactiver l'état de chargement
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    // Ajouter tous les champs du produit
    formData.append("nom", newProduct.nom)
    formData.append("description", newProduct.description)
    formData.append("prix", newProduct.prix)
    formData.append("stock", newProduct.stock)
    formData.append("categorieId", newProduct.categorieId)

    // Ajouter l'image seulement si elle existe
    if (newProduct.image) {
      formData.append("image", newProduct.image)
    }

    try {
      const response = await fetch("/api/productsAdmin", {
        method: "POST",
        body: formData, // Ne pas convertir en JSON
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      const data = await response.json()
      setStatusMessage({ type: "success", message: "Produit ajouté avec succès !" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
      fetchProducts()
      setNewProduct({
        nom: "",
        description: "",
        prix: "",
        stock: "",
        categorieId: "",
        image: null,
      })
    } catch (error) {
      console.error("Error adding product:", error)
      setStatusMessage({ type: "error", message: "Erreur lors de l'ajout du produit" })
      setTimeout(() => setStatusMessage(null), 10000) // Clear message after 10 seconds
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct((prev) => ({ ...prev, image: e.target.files![0] }))
    }
  }

  return (
    <>
      <Breadcrumb pageName="Gérer les produits" />

      {statusMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            statusMessage.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Ajout produit --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Ajouter un Produit</h3>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nom du Produit
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={newProduct.nom}
                    onChange={handleInputChange}
                    placeholder="Nom du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Description du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Prix</label>
                  <input
                    type="number"
                    name="prix"
                    value={newProduct.prix}
                    onChange={handleInputChange}
                    placeholder="Prix du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    placeholder="Quantité en stock"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Image du Produit
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                  />
                </div>

                <SelectCategorie
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category)
                    setNewProduct((prev) => ({ ...prev, categorieId: category.id.toString() }))
                  }}
                />

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>

          {/* <!-- Modif Produit --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Modifier un Produit</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleModifyClick()
              }}
            >
              <div className="flex flex-col gap-5.5 p-6.5">
                <SelectCategorie
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category)
                    setSelectedProduct(null)
                  }}
                />

                <SelectProduct
                  products={products}
                  selectedProduct={selectedProduct}
                  onProductChange={(product: Product | null) => setSelectedProduct(product)}
                  categoryId={selectedCategory?.id || null}
                />

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nouveau Nom du Produit
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={modifiedProduct.nom}
                    onChange={(e) => setModifiedProduct((prev) => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nouvelle Description du Produit
                  </label>
                  <textarea
                    name="description"
                    value={modifiedProduct.description}
                    onChange={(e) => setModifiedProduct((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nouveau Prix du Produit
                  </label>
                  <input
                    type="number"
                    name="prix"
                    value={modifiedProduct.prix}
                    onChange={(e) => setModifiedProduct((prev) => ({ ...prev, prix: e.target.value }))}
                    placeholder="Prix du Produit"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nouveau Stock du Produit
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={modifiedProduct.stock}
                    onChange={(e) => setModifiedProduct((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="Quantité en stock"
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Nouvelle Image du Produit
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setModifiedProduct((prev) => ({ ...prev, image: e.target.files![0] }))
                      }
                    }}
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  Modifier
                </button>
              </div>
            </form>

            {/* Afficher le popup de modification */}
            {isModifyPopupOpen && (
              <ModifyProduct
                onClose={handleClosePopup}
                onConfirm={handleConfirmModify}
                isLoading={isLoading} // Passer l'état de chargement
              />
            )}
          </div>

          {/* <!-- Supprim Produit --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Supprimer un Produit</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleDeleteClick()
              }}
            >
              <div className="flex flex-col gap-5.5 p-6.5">
                <SelectCategorie
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category)
                    setSelectedProduct(null)
                  }}
                />

                <SelectProduct
                  products={products}
                  selectedProduct={selectedProduct}
                  onProductChange={(product: Product | null) => setSelectedProduct(product)}
                  categoryId={selectedCategory?.id || null}
                />

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                >
                  Supprimer
                </button>
              </div>
            </form>

            {/* Afficher le popup de suppression */}
            {isDeletePopupOpen && (
              <DeletProduct
                onClose={handleClosePopup}
                onConfirm={handleConfirmDelete}
                isLoading={isLoading} // Passer l'état de chargement
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default FormElements

