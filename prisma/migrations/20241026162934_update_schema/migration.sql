/*
  Warnings:

  - Added the required column `typeLivraisonId` to the `Livraison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statutPaiement` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Livraison" ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "typeLivraisonId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Paiement" ADD COLUMN     "statutPaiement" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "resetToken" TEXT;

-- CreateTable
CREATE TABLE "Variante" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,

    CONSTRAINT "Variante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER,
    "reduction" DOUBLE PRECISION NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandeStatutHistorique" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "statutId" INTEGER NOT NULL,
    "dateStatut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommandeStatutHistorique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeLivraison" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "TypeLivraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adresse" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "pays" TEXT NOT NULL,

    CONSTRAINT "Adresse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "dateAvis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeLivraison_type_key" ON "TypeLivraison"("type");

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeStatutHistorique" ADD CONSTRAINT "CommandeStatutHistorique_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeStatutHistorique" ADD CONSTRAINT "CommandeStatutHistorique_statutId_fkey" FOREIGN KEY ("statutId") REFERENCES "CommandeStatut"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_typeLivraisonId_fkey" FOREIGN KEY ("typeLivraisonId") REFERENCES "TypeLivraison"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adresse" ADD CONSTRAINT "Adresse_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
