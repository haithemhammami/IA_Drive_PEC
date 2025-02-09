"use client"

import { useEffect, useState, useCallback } from "react"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLaout"
import AlertError from "@/components/Alerts/AlertError"
import AlertWarning from "@/components/Alerts/AlertWarning"
import AlertSuccess from "@/components/Alerts/AlertSuccess"

interface Alert {
  id: number
  produitId: number
  message: string
  dateAlerte: string
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<"all" | "warning" | "success" | "error">("all")

  const fetchAlerts = useCallback(async () => {
    const response = await fetch("/api/alerts/getAll")
    if (response.ok) {
      const data = await response.json()
      setAlerts(data)
      setFilteredAlerts(data)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()

    const eventSource = new EventSource("/api/alerts")

    eventSource.onmessage = (event) => {
      const newAlerts: Alert[] = JSON.parse(event.data)
      setAlerts((prevAlerts) => {
        const updatedAlerts = [...newAlerts, ...prevAlerts]
        const uniqueAlerts = updatedAlerts.filter(
          (alert, index, self) => index === self.findIndex((t) => t.id === alert.id),
        )
        return uniqueAlerts.sort((a, b) => new Date(b.dateAlerte).getTime() - new Date(a.dateAlerte).getTime())
      })
    }

    return () => {
      eventSource.close()
    }
  }, [fetchAlerts])

  useEffect(() => {
    if (filter === "all") {
      setFilteredAlerts(alerts)
    } else {
      setFilteredAlerts(alerts.filter((alert) => getAlertType(alert.message) === filter))
    }
  }, [filter, alerts])

  const getAlertType = (message: string): "warning" | "success" | "error" => {
    if (message.includes("bas") || message.includes("Pensez à réapprovisionner")) return "warning"
    if (message.includes("quantité suffisante") || message.includes("a été ajouté")) return "success"
    if (message.includes("rupture")) return "error"
    return "warning"
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Alertes Produits" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="mb-4 flex justify-end">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "warning" | "success" | "error")}
          >
            <option value="all">Toutes les alertes</option>
            <option value="warning">Avertissements</option>
            <option value="success">Succès</option>
            <option value="error">Attention</option>
          </select>
        </div>

        <div className="flex flex-col gap-7.5 max-h-[70vh] overflow-y-auto">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const AlertComponent =
                getAlertType(alert.message) === "warning"
                  ? AlertWarning
                  : getAlertType(alert.message) === "success"
                    ? AlertSuccess
                    : AlertError

              return (
                <AlertComponent
                  key={alert.id}
                  message={alert.message}
                  date={new Date(alert.dateAlerte).toLocaleString()}
                />
              )
            })
          ) : (
            <p className="text-center text-gray-500">Aucune alerte pour le moment.</p>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Alerts

