# IA_Drive_PEC
Application Drive alimentaire enrichie par l'intelligence artificielle (IA).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Projet de Fin d'Année - E-commerce

## Présentation

Ce projet est une application de commerce électronique développée avec Next.js. Elle permet aux utilisateurs de parcourir et d'acheter des produits, de gérer leur panier, de passer des commandes et de procéder au paiement en ligne. L'application comprend également des fonctionnalités d'administration pour gérer les produits, les catégories, les commandes et les utilisateurs.

## Fonctionnalités Principales

### Gestion des Produits

- Affichage des détails d'un produit spécifique (`/products/[productId]/page.tsx`)
- Affichage de la liste des produits (`/products/page.tsx`)

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

### Gestion des Catégories et Fournisseurs

- Gestion des catégories de produits (`/api/categories`, `/api/categoriesAdmin`)
- Gestion des fournisseurs (`/api/suppliersAdmin`)

### Chat et Alertes

- Fonctionnalité de chat (`/api/chat`)
- Gestion des alertes (`/api/alerts`)

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Membres du groupe:
- [Berki Khalida ](https://github.com/khalidaBerki)
- [haithem hammami](https://github.com/haithemhammami)