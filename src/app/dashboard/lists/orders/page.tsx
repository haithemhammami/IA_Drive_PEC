import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import OrderTable from "@/components/lists/OrderTable"

import type { Metadata } from "next"
import DefaultLayout from "@/components/Layouts/DefaultLaout"

export const metadata: Metadata = {
  title: "IA Drive PEC - Commandes",
  description: "Application de drive alimentaire enrichie par IA pour Admin - Gestion des commandes",
}

const OrdersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des Commandes" />

      <div className="flex flex-col gap-10">
        <OrderTable />
      </div>
    </DefaultLayout>
  )
}

export default OrdersPage

