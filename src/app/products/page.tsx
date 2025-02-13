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
  const [notFoundProducts, setNotFoundProducts] = useState<string[]>([])

  const searchParams = useSearchParams()
  const ingredients = searchParams.get("ingredients")

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

  if (loading) return <div className="text-center p-4">Chargement...</div>
  if (error) return <div className="text-center text-red-600 p-4">{error}</div>

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {ingredients ? `Produits correspondant à : ${ingredients}` : "Tous les produits"}
        </h1>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <li key={product.id} className="group">
                <Link href={`/products/${product.id}`} className="block">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.nom}
                      className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                    />
                  ) : null}
                  <h3 className="mt-4 text-m text-gray-700 font-bold">{product.nom}</h3>
                  <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                  <p className="text-green-600 font-medium text-lg">Prix : {product.prix} €</p>
                </Link>
                <Button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
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

