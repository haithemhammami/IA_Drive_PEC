"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, Truck, CheckCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import OrderDetails from "@/components/lists/OrderDetails"
import type { Order } from "@/types/order"

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const ordersPerPage = 10

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/ordersAdmin")
        if (!response.ok) {
          throw new Error("Échec de la récupération des commandes")
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toString().includes(searchTerm) || order.clientId.toString().includes(searchTerm)
    const matchesStatus = statusFilter ? order.statutId.toString() === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      const response = await fetch(`/api/ordersAdmin/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId: newStatusId }),
      })

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut de la commande")
      }

      const updatedOrder = await response.json()
      setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande:", error)
    }
  }

  const getStatusColor = (statutId: number) => {
    switch (statutId) {
      case 2: // En préparation
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
      case 4: // En cours de livraison
        return "bg-[#3C50E0]/[0.08] text-[#3C50E0]"
      case 5: // Livré
        return "bg-[#219653]/[0.08] text-[#219653]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Commandes</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ID_commande/ID_client"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-body" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          >
            <option value="">Tous les statuts</option>
            <option value="2">En préparation</option>
            <option value="4">En cours de livraison</option>
            <option value="5">Livré</option>
          </select>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">ID Commande</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">ID Client</th>
              <th className="min-w-[160px] px-4 py-4 font-medium text-dark dark:text-white">Date et Heure</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Statut</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Total</th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white">#{order.id}</h5>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">{order.clientId}</p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">{new Date(order.createdAt).toLocaleString()}</p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p
                    className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${getStatusColor(order.statutId)}`}
                  >
                    {order.statut.statut}
                  </p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">{order.total.toFixed(2)} €</p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === currentOrders.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <div className="flex items-center justify-end space-x-3.5">
                    <button className="hover:text-primary" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-5 w-5" />
                    </button>
                    {order.statutId === 2 && (
                      <button className="hover:text-primary" onClick={() => handleStatusChange(order.id, 4)}>
                        <Truck className="h-5 w-5" />
                      </button>
                    )}
                    {order.statutId === 4 && (
                      <button className="hover:text-primary" onClick={() => handleStatusChange(order.id, 5)}>
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
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
            disabled={indexOfLastOrder >= filteredOrders.length}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {selectedOrder && <OrderDetails orderId={selectedOrder.id} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}

export default OrderTable

