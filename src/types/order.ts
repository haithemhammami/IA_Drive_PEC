export interface Order {
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
    client: User
    commandeDetails: OrderItem[]
  }
  
  export interface OrderItem {
    id: number
    produitId: number
    quantite: number
    prixUnitaire: number
    produit: {
      nom: string
    }
  }
  
  export interface User {
    id: number
    nom: string
    email: string
    adresse: string
  }
  
  