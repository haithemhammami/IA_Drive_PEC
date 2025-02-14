"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface DataStats {
  icon: React.ReactNode
  color: string
  title: string
  value: string
  growthRate: number
}

interface Product {
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

interface User {
  id: number
  nom: string
  email: string
  dateCreation: string
}

interface Order {
  id: number
  total: number
  createdAt: string
}

const DataStatsOne: React.FC = () => {
  const [totalCategories, setTotalCategories] = useState(0)
  const [categoryGrowthRate, setCategoryGrowthRate] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [productGrowthRate, setProductGrowthRate] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [userGrowthRate, setUserGrowthRate] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [profitGrowthRate, setProfitGrowthRate] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesResponse, productsResponse, usersResponse, ordersResponse] = await Promise.all([
          fetch("/api/categoriesAdmin"),
          fetch("/api/productsAdmin"),
          fetch("/api/usersAdmin"),
          fetch("/api/ordersAdmin"),
        ])

        if (!categoriesResponse.ok || !productsResponse.ok || !usersResponse.ok || !ordersResponse.ok) {
          throw new Error("Failed to fetch stats")
        }

        const categoriesData = await categoriesResponse.json()
        const productsData: Product[] = await productsResponse.json()
        const { users: usersData } = await usersResponse.json()
        const ordersData: Order[] = await ordersResponse.json()

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        //const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        //const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Catégories
        setTotalCategories(categoriesData.length)
        const newCategoriesThisMonth = categoriesData.filter((cat: { createdAt: string }) => {
          const createdDate = new Date(cat.createdAt)
          return createdDate >= firstDayOfMonth && createdDate <= now
        }).length
        setCategoryGrowthRate(newCategoriesThisMonth)

        // Produits
        setTotalProducts(productsData.length)
        const newProductsThisMonth = productsData.filter(
          (product) => new Date(product.createdAt) >= firstDayOfMonth,
        ).length
        setProductGrowthRate(newProductsThisMonth)

        // Utilisateurs
        setTotalUsers(usersData.length)
        const newUsersThisMonth = usersData.filter((user: User) => new Date(user.dateCreation) >= firstDayOfMonth).length
        setUserGrowthRate(newUsersThisMonth)

        // Profit
        const totalProfit = ordersData.reduce((sum, order) => sum + order.total, 0)
        setTotalProfit(totalProfit)

        const profitThisMonth = ordersData
          .filter((order) => new Date(order.createdAt) >= firstDayOfMonth)
          .reduce((sum, order) => sum + order.total, 0)

        // Calculate the growth rate as the percentage of this month's profit compared to the total
        //const profitGrowthRate = totalProfit !== 0 ? (profitThisMonth / totalProfit) * 100 : 0
        //profitThisMonth
        const profitGrowthRate = profitThisMonth
        setProfitGrowthRate(Number(profitGrowthRate.toFixed(2)))
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  const dataStatsList: DataStats[] = [
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.41667 8.66667H20.5833M5.41667 13H20.5833M5.41667 17.3333H20.5833"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: "#FF9C55",
      title: "Total des Rayons",
      value: totalCategories.toString(),
      growthRate: categoryGrowthRate,
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.0425 4.80065L16.8758 3.66364C14.9739 2.66555 14.0229 2.1665 13 2.1665C11.977 2.1665 11.026 2.66555 9.12411 3.66363L6.95744 4.80065C5.03588 5.80904 3.90635 6.40179 3.20629 7.1946L13 12.0914L22.7936 7.1946C22.0936 6.40179 20.964 5.80904 19.0425 4.80065Z"
            fill="white"
          />
          <path
            d="M23.5607 8.62788L13.8125 13.502V23.7292C14.5902 23.5355 15.4751 23.0711 16.8758 22.336L19.0425 21.199C21.3734 19.9758 22.5389 19.3642 23.1861 18.2651C23.8333 17.1661 23.8333 15.7984 23.8333 13.0632V12.9365C23.8333 10.8861 23.8333 9.60421 23.5607 8.62788Z"
            fill="white"
          />
          <path
            d="M12.1875 23.7292V13.502L2.43923 8.62788C2.16663 9.60421 2.16663 10.8861 2.16663 12.9365V13.0632C2.16663 15.7984 2.16663 17.1661 2.81381 18.2651C3.46099 19.3642 4.62647 19.9758 6.95744 21.199L9.12411 22.336C10.5248 23.0711 11.4097 23.5355 12.1875 23.7292Z"
            fill="white"
          />
        </svg>
      ),
      color: "#8155FF",
      title: "Total des Produits",
      value: totalProducts.toString(),
      growthRate: productGrowthRate,
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="9.75106" cy="6.49984" rx="4.33333" ry="4.33333" fill="white" />
          <ellipse cx="9.75106" cy="18.4178" rx="7.58333" ry="4.33333" fill="white" />
          <path
            d="M22.7496 18.4173C22.7496 20.2123 20.5445 21.6673 17.8521 21.6673C18.6453 20.8003 19.1907 19.712 19.1907 18.4189C19.1907 17.1242 18.644 16.0349 17.8493 15.1674C20.5417 15.1674 22.7496 16.6224 22.7496 18.4173Z"
            fill="white"
          />
          <path
            d="M19.4996 6.50098C19.4996 8.2959 18.0446 9.75098 16.2496 9.75098C15.8582 9.75098 15.483 9.68179 15.1355 9.55498C15.648 8.65355 15.9407 7.61084 15.9407 6.49977C15.9407 5.38952 15.6484 4.34753 15.1366 3.44656C15.4838 3.32001 15.8587 3.25098 16.2496 3.25098C18.0446 3.25098 19.4996 4.70605 19.4996 6.50098Z"
            fill="white"
          />
        </svg>
      ),
      color: "#18BFFF",
      title: "Total des Utilisateurs",
      value: totalUsers.toString(),
      growthRate: userGrowthRate,
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 23.8332C18.983 23.8332 23.8333 18.9829 23.8333 12.9998C23.8333 7.01675 18.983 2.1665 13 2.1665C7.01687 2.1665 2.16663 7.01675 2.16663 12.9998C2.16663 18.9829 7.01687 23.8332 13 23.8332ZM13.8125 6.49984C13.8125 6.05111 13.4487 5.68734 13 5.68734C12.5512 5.68734 12.1875 6.05111 12.1875 6.49984V6.84297C10.4212 7.15923 8.93746 8.48625 8.93746 10.2915C8.93746 12.3684 10.9013 13.8123 13 13.8123C14.4912 13.8123 15.4375 14.7935 15.4375 15.7082C15.4375 16.6228 14.4912 17.604 13 17.604C11.5088 17.604 10.5625 16.6228 10.5625 15.7082C10.5625 15.2594 10.1987 14.8957 9.74996 14.8957C9.30123 14.8957 8.93746 15.2594 8.93746 15.7082C8.93746 17.5134 10.4212 18.8404 12.1875 19.1567V19.4998C12.1875 19.9486 12.5512 20.3123 13 20.3123C13.4487 20.3123 13.8125 19.9486 13.8125 19.4998V19.1567C15.5788 18.8404 17.0625 17.5134 17.0625 15.7082C17.0625 13.6313 15.0986 12.1873 13 12.1873C11.5088 12.1873 10.5625 11.2061 10.5625 10.2915C10.5625 9.37688 11.5088 8.39567 13 8.39567C14.4912 8.39567 15.4375 9.37688 15.4375 10.2915C15.4375 10.7402 15.8012 11.104 16.25 11.104C16.6987 11.104 17.0625 10.7402 17.0625 10.2915C17.0625 8.48625 15.5788 7.15923 13.8125 6.84297V6.49984Z"
            fill="white"
          />
        </svg>
      ),
      color: "#3FD97F",
      title: "Total de Profit",
      value: `€${totalProfit.toFixed(2)}`,
      growthRate: profitGrowthRate,
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div key={index} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">{item.value}</h4>
                <span className="text-body-sm font-medium">{item.title}</span>
              </div>

              <span
                className={`flex items-center gap-1.5 text-body-sm font-medium ${
                  item.growthRate > 0 ? "text-green" : "text-red"
                }`}
              >
                {item.growthRate}
                {item.growthRate > 0 ? (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                      fill=""
                    />
                  </svg>
                ) : (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                      fill=""
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default DataStatsOne

