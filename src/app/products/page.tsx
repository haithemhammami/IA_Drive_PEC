"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import type { Produit } from "@prisma/client"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [products, setProducts] = useState<Produit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<Produit[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<string>("asc")
  const [notFoundProducts, setNotFoundProducts] = useState<string[]>([])

  const searchParams = useSearchParams()
  const ingredients = searchParams ? searchParams.get("ingredients") : null

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        let url = "/api/products"
        if (ingredients) {
          url += `?ingredients=${encodeURIComponent(ingredients)}`
        }
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Erreur: ${res.status}`)
        }
        const data = await res.json()
        setProducts(data.products)
        setNotFoundProducts(data.notFoundProducts)
      } catch (err: any) {
        setError(err.message || "Erreur lors de la récupération des produits")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Decode JWT to retrieve user ID
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUserId(decoded.userId)
      } catch (err) {
        console.error("Erreur de décodage du token", err)
      }
    }
  }, [ingredients])

  const addToCart = async (product: Produit) => {
    if (!userId) {
      alert("Veuillez vous connecter pour ajouter des produits au panier.")
      return
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ utilisateurId: userId, productId: product.id }),
      })

      if (!res.ok) {
        throw new Error(`Erreur: ${res.status}`)
      }

      const { cartItem } = await res.json()
      setCart((prevCart) => [...prevCart, cartItem.produit])
    } catch (err: any) {
      console.error("Erreur lors de l'ajout au panier:", err.message)
    }
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value)
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.prix - b.prix
    } else {
      return b.prix - a.prix
    }
  })

  if (loading) return <div className="text-center p-4">Chargement...</div>
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          {ingredients ? `Produits correspondant à : ${ingredients}` : "Tous les produits"}
        </h1>

        <div className="mb-8 text-center">
          <label htmlFor="sort" className="mr-2 text-lg font-medium text-gray-700">Trier par prix :</label>
          <select id="sort" value={sortOrder} onChange={handleSortChange} className="p-2 border rounded-lg shadow-sm">
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>

        {sortedProducts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <li key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <Link href={`/products/${product.id}`} className="block">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.nom}
                      className="w-full h-64 object-contain group-hover:opacity-75 transition duration-300"
                    />
                  ) : null}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.nom}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <p className="text-green-600 font-bold text-xl">Prix : {product.prix} €</p>
                  </div>
                </Link>
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-b-lg hover:bg-blue-700 transition duration-300"
                >
                  Ajouter au panier
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">Aucun produit trouvé.</p>
        )}

        {notFoundProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Produits non disponibles :</h2>
            <ul className="list-disc list-inside">
              {notFoundProducts.map((product, index) => (
                <li key={index} className="text-gray-600">
                  {product}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}