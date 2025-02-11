"use client"

import type { ApexOptions } from "apexcharts"
import type React from "react"
import { useState, useEffect } from "react"
import ReactApexChart from "react-apexcharts"
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption"

interface DataPoint {
  date: string
  users: number
  orders: number
}

const ChartOne: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([])
  const [timeRange, setTimeRange] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stats/orders-users?range=${timeRange}`)
        if (!response.ok) throw new Error("Échec de la récupération des données")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      }
    }

    fetchData()
  }, [timeRange])

  const series = [
    {
      name: "Montant reçu",
      data: data.map((item) => item.orders),
    },
    {
      name: "Montant dû",
      data: data.map((item) => item.users),
    },
  ]

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: (seriesName: string) => (seriesName === "Montant reçu" ? "Commandes: " : "Utilisateurs: "),
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: data.map((item) => item.date),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">Aperçu des paiements</h4>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium uppercase text-dark dark:text-dark-6">Trier par :</p>
          <DefaultSelectOption
            options={["Mensuel", "Annuel"]}
            onChange={(value: string) => setTimeRange(value.toLowerCase() as "monthly" | "yearly")}
          />
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">Montant reçu</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {data.reduce((sum, item) => sum + item.orders, 0)} €
          </h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">Montant dû</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {data.reduce((sum, item) => sum + item.users, 0)} €
          </h4>
        </div>
      </div>
    </div>
  )
}

export default ChartOne

