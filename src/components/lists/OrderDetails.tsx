"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"

interface OrderDetailsProps {
  orderId: number
  onClose: () => void
}

interface OrderDetail {
  id: number
  clientId: number
  statutId: number
  total: number
  createdAt: string
  updatedAt: string
  statut: {
    id: number
    statut: string
  }
  client: {
    id: number
    nom: string
    email: string
    adresse: string | null
    phone: string | null
  }
  commandeDetails: Array<{
    id: number
    produitId: number
    quantite: number
    prixUnitaire: number
    produit: {
      id: number
      nom: string
      image: string | null
    }
  }>
  livraison: {
    id: number
    adresse: string
    statut: string
    dateLivraison: string | null
    trackingNumber: string | null
    typeLivraison: {
      id: number
      type: string
    }
  } | null
  paiement: {
    id: number
    montant: number
    statutPaiement: string
    datePaiement: string
    transactionId: string | null
    mode: {
      id: number
      mode: string
    }
  } | null
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
})

const OrderPDF: React.FC<{ order: OrderDetail }> = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Détails de la commande</Text>
        <Text style={styles.text}>ID Commande: {order.id}</Text>
        <Text style={styles.text}>Date: {new Date(order.createdAt).toLocaleString()}</Text>
        <Text style={styles.text}>Statut: {order.statut.statut}</Text>
        <Text style={styles.text}>Total: {order.total.toFixed(2)} €</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Informations client</Text>
        <Text style={styles.text}>Nom: {order.client.nom}</Text>
        <Text style={styles.text}>Email: {order.client.email}</Text>
        <Text style={styles.text}>Adresse: {order.client.adresse || "Non renseignée"}</Text>
        <Text style={styles.text}>Téléphone: {order.client.phone || "Non renseigné"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Articles commandés</Text>
        {order.commandeDetails.map((item) => (
          <Text key={item.id} style={styles.text}>
            {item.produit.nom} - Quantité: {item.quantite} - Prix: {item.prixUnitaire.toFixed(2)} €
          </Text>
        ))}
      </View>
      {order.livraison && (
        <View style={styles.section}>
          <Text style={styles.title}>Informations de livraison</Text>
          <Text style={styles.text}>Adresse de livraison: {order.livraison.adresse}</Text>
          <Text style={styles.text}>Type de livraison: {order.livraison.typeLivraison.type}</Text>
          <Text style={styles.text}>Statut de livraison: {order.livraison.statut}</Text>
          {order.livraison.dateLivraison && (
            <Text style={styles.text}>
              Date de livraison: {new Date(order.livraison.dateLivraison).toLocaleString()}
            </Text>
          )}
          {order.livraison.trackingNumber && (
            <Text style={styles.text}>Numéro de suivi: {order.livraison.trackingNumber}</Text>
          )}
        </View>
      )}
      {order.paiement && (
        <View style={styles.section}>
          <Text style={styles.title}>Informations de paiement</Text>
          <Text style={styles.text}>Montant: {order.paiement.montant.toFixed(2)} €</Text>
          <Text style={styles.text}>Statut du paiement: {order.paiement.statutPaiement}</Text>
          <Text style={styles.text}>Date du paiement: {new Date(order.paiement.datePaiement).toLocaleString()}</Text>
          <Text style={styles.text}>Mode de paiement: {order.paiement.mode.mode}</Text>
          {order.paiement.transactionId && (
            <Text style={styles.text}>ID de transaction: {order.paiement.transactionId}</Text>
          )}
        </View>
      )}
    </Page>
  </Document>
)

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return
      try {
        const response = await fetch(`/api/ordersDetailAdmin/${orderId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }
        const data = await response.json()
        setOrder(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Une erreur est survenue lors de la récupération des détails de la commande.")
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (isLoading) {
    return <div>Chargement des détails de la commande...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  if (!order) {
    return <div>Aucune commande trouvée</div>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Détails de la commande #{order.id}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Informations générales</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Statut: {order.statut.statut}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total: {order.total.toFixed(2)} €</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Informations client</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Nom: {order.client.nom}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email: {order.client.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adresse: {order.client.adresse || "Non renseignée"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Téléphone: {order.client.phone || "Non renseigné"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Articles commandés</h3>
          <ul>
            {order.commandeDetails.map((item) => (
              <li key={item.id} className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {item.produit.nom} - Quantité: {item.quantite} - Prix: {item.prixUnitaire.toFixed(2)} €
              </li>
            ))}
          </ul>
        </div>
        {order.livraison && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Informations de livraison</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Adresse de livraison: {order.livraison.adresse}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type de livraison: {order.livraison.typeLivraison.type}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Statut de livraison: {order.livraison.statut}</p>
            {order.livraison.dateLivraison && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date de livraison: {new Date(order.livraison.dateLivraison).toLocaleString()}
              </p>
            )}
            {order.livraison.trackingNumber && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Numéro de suivi: {order.livraison.trackingNumber}
              </p>
            )}
          </div>
        )}
        {order.paiement && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Informations de paiement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Montant: {order.paiement.montant.toFixed(2)} €</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Statut du paiement: {order.paiement.statutPaiement}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Date du paiement: {new Date(order.paiement.datePaiement).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mode de paiement: {order.paiement.mode.mode}</p>
            {order.paiement.transactionId && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID de transaction: {order.paiement.transactionId}
              </p>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <PDFDownloadLink
            document={<OrderPDF order={order} />}
            fileName={`commande-${order.id}.pdf`}
            className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {({loading}) =>
              loading ? (
                "Chargement du document..."
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger le PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

