<<<<<<< HEAD
import Image from "next/image";
import { Product } from "@/types/product";

const productData: Product[] = [
  {
    image: "/images/product/product-01.png",
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    image: "/images/product/product-02.png",
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    image: "/images/product/product-03.png",
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const TableTwo = () => {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-4 py-6 md:px-6 xl:px-9">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
        Tous les produits
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Profit</p>
        </div>
      </div>

      {productData.map((product, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={product.image}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {product.name}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.category}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              ${product.price}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.sold}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-green">
              ${product.profit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
=======
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { Category } from "@/types/category"

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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(5)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

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
    }
  }

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
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.categorieId === Number.parseInt(selectedCategory) : true
    return matchesSearch && matchesCategory
  })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Liste des produits</h3>
      </div>

      <div className="px-4 py-3 sm:px-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Produit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Catégorie
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Prix
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Date de création
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Date de modification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image || ""}
                        alt={product.nom}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{product.nom}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{product.description}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {categories.find((cat) => cat.id === product.categorieId)?.nom || "N/A"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">${product.prix.toFixed(2)}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{product.stock}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            Précédent
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastProduct >= filteredProducts.length}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            Suivant
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">{indexOfFirstProduct + 1}</span> à{" "}
              <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> sur{" "}
              <span className="font-medium">{filteredProducts.length}</span> résultats
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === i + 1
                      ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700"
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

export default ProductList

>>>>>>> 1e330dfb07b3c1100addbad2ac5c63be5485e4cf
