# YumiMind
Application Drive alimentaire enrichie par l'intelligence artificielle (IA).

[yumimind.vercel.app](https://yumimind.vercel.app/)

# Projet PEC

## Présentation

Ce projet est une application de commerce électronique développée avec Next.js. Elle permet aux utilisateurs de parcourir et d'acheter des produits, de gérer leur panier, de passer des commandes et de procéder au paiement en ligne. L'application comprend également des fonctionnalités d'administration pour gérer les produits, les catégories, les commandes et les utilisateurs.

---

## Mapping des contributeurs

| Pseudo      | Nom et Prénom       | Responsabilités                                                                |
|-------------|---------------------|--------------------------------------------------------------------------------|
| **Haithem** | HAMMAMI Haithem     | Front et backend du back-office , Landing page , IA                            |
| **Khalida** | BERKI Khalida       | Front et backend du front-office , inscription/connexion , Routes admin protégées, Test et WORKFLOW DEPLOYEMENT |

---

## Fonctionnalités Principales

### Compte Admin pour accéder au dashboard_Admin 

- Email : Admin@admin.com
- Mot de passe : Admin@admin.com

### Gestion des Produits

- Affichage des détails d'un produit spécifique (`/products/[productId]/page.tsx`)
- Affichage de la liste des produits (`/products/page.tsx`)

### Gestion des Produits_Admin

- CRUD Produit (`/api/products/[id]/route.ts`) / (`/api/products/route.ts`)
- Gestion du stock et gestion des alertes en temps réel SSE

### Gestion des Catégories et Fournisseurs

- CRUD Catégories de produits (`/api/categories`, `/api/categoriesAdmin`)
- CRUD Fournisseurs (`/api/suppliersAdmin`)

### Gestion du Panier

- Ajout, mise à jour et suppression des articles dans le panier (`/api/cart/[utilisateurId]/route.ts`)

### Authentification et Autorisation

- Gestion des utilisateurs et des sessions (`/api/auth`)
- Routes protégées nécessitant une authentification (`/api/protected`)

### Gestion des Commandes

- Création et gestion des commandes (`/api/orders`, `/api/ordersAdmin`)
- Affichage des détails d'une commande spécifique (`/orders/[orderId]/page.tsx`)
- Gestion des commandes par l'utilisateur (`/orders/user`)

### Paiement

- Processus de paiement et confirmation (`/api/checkout`, `/api/payment-confirm`)
- Page de succès après paiement (`/success/page.tsx`)

### Recherche et Analyse

- Fonctionnalité de recherche de produits (`/api/search`)
- Analyse d'images et génération de recettes (`/api/analyze-image`, `/api/generate-recipes`)
- Récupération des Produits manquants dans le dashboard admin en temps réel SSE (`/api/analysis`)

### Chat et Alertes

- Fonctionnalité de chat (`/api/chat`)
- Gestion des alertes (`/api/alerts`)

---

## Autres Fonctionnalités

- **Gestion des Avis**
  - Ajout et affichage des avis sur les produits (`/api/reviews`)

- **Gestion des Polices et Styles**
  - Polices personnalisées (`/fonts`)
  - Styles globaux (`/globals.css`)

- **Composants Réutilisables**
  - Composants réutilisables pour l'interface utilisateur (`/components`)

- **Hooks Personnalisés**
  - Hooks personnalisés pour la logique réutilisable (`/hooks`)

- **Images et Assets**
  - Gestion des images et autres assets (`/images`)

- **Middleware**
  - Middleware pour la gestion des requêtes (`/middleware`)

- **Types et Interfaces**
  - Définitions de types et interfaces TypeScript (`/types`)

---

## Procédure de Lancement du Projet en Local

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- PostgreSQL (ou tout autre SGBD compatible avec Prisma)

### Étapes

1. **Cloner le dépôt**

   ```
   git clone 
   ```
2. **Installer les dépendances**
    ```
    npm install
    # ou
    yarn install
    ```
3. **Configurer les variables d'environnement**

Créez un fichier .env à la racine du projet et ajoutez les variables d'environnement nécessaires :

    ```
        DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    	  JWT_SECRET=your_jwt_secret
        NEXT_PUBLIC_BASE_URL=http://localhost:3000
        STRIPE_SECRET_KEY=your_stripe_secret_key
        OPENAI_API_KEY= your OPENAI_API_KEY

    ```
4.  **Initialiser la base de données**

    ```
    npx prisma migrate dev --name init
    ```
5. **Lancer le serveur de développement**

    ```
    npm run dev
    # ou
    yarn dev
    ```
    [http://localhost:3000](http://localhost:3000)

---

# Membres du groupe:
- [Berki Khalida ](https://github.com/khalidaBerki)
- [Hammami Haithem](https://github.com/haithemhammami)
