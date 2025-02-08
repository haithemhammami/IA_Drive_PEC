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

  const fetchAlerts = useCallback(async () => {
    const response = await fetch("/api/alerts/getAll")
    if (response.ok) {
      const data = await response.json()
      setAlerts(data)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()

    const eventSource = new EventSource("/api/alerts")

    eventSource.onmessage = (event) => {
      const newAlerts: Alert[] = JSON.parse(event.data)
      setAlerts((prevAlerts) => {
        const updatedAlerts = [...prevAlerts]
        newAlerts.forEach((newAlert) => {
          const index = updatedAlerts.findIndex((a) => a.produitId === newAlert.produitId)
          if (index !== -1) {
            updatedAlerts[index] = newAlert
          } else {
            updatedAlerts.unshift(newAlert)
          }
        })
        return updatedAlerts.slice(0, 10)
      })
    }

    return () => {
      eventSource.close()
    }
  }, [fetchAlerts])

  const getAlertType = (message: string): "warning" | "success" | "error" => {
    if (message.includes("bas")) return "warning"
    if (message.includes("Nouveau produit")) return "success"
    if (message.includes("rupture")) return "error"
    return "warning"
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Alertes Produits" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
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

