-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "idCategorie" INTEGER NOT NULL,
    "idMagasin" INTEGER NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "nomCategorie" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magasin" (
    "id" SERIAL NOT NULL,
    "nomMagasin" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "Magasin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "idUtilisateur" INTEGER NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPrix" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "idMagasin" INTEGER NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panier" (
    "id" SERIAL NOT NULL,
    "idUtilisateur" INTEGER NOT NULL,
    "dateAjout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Panier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanierProduit" (
    "id" SERIAL NOT NULL,
    "idPanier" INTEGER NOT NULL,
    "idProduit" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "PanierProduit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandeProduit" (
    "id" SERIAL NOT NULL,
    "idCommande" INTEGER NOT NULL,
    "idProduit" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "CommandeProduit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" SERIAL NOT NULL,
    "idCommande" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "dateLivraison" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL,

    CONSTRAINT "Livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "idCommande" INTEGER NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "modePaiement" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Panier_idUtilisateur_key" ON "Panier"("idUtilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Livraison_idCommande_key" ON "Livraison"("idCommande");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_idCommande_key" ON "Paiement"("idCommande");

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_idCategorie_fkey" FOREIGN KEY ("idCategorie") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_idMagasin_fkey" FOREIGN KEY ("idMagasin") REFERENCES "Magasin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_idMagasin_fkey" FOREIGN KEY ("idMagasin") REFERENCES "Magasin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panier" ADD CONSTRAINT "Panier_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanierProduit" ADD CONSTRAINT "PanierProduit_idPanier_fkey" FOREIGN KEY ("idPanier") REFERENCES "Panier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanierProduit" ADD CONSTRAINT "PanierProduit_idProduit_fkey" FOREIGN KEY ("idProduit") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeProduit" ADD CONSTRAINT "CommandeProduit_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeProduit" ADD CONSTRAINT "CommandeProduit_idProduit_fkey" FOREIGN KEY ("idProduit") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
