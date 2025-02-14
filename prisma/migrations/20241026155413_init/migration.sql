/*
  Warnings:

  - You are about to drop the column `nomCategorie` on the `Categorie` table. All the data in the column will be lost.
  - You are about to drop the column `idMagasin` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrix` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `idCommande` on the `Livraison` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `Livraison` table. All the data in the column will be lost.
  - You are about to drop the column `idCommande` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `modePaiement` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `idCategorie` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `idMagasin` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommandeProduit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Magasin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Panier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PanierProduit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[commandeId]` on the table `Livraison` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commandeId]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nom` to the `Categorie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statutId` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commandeId` to the `Livraison` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commandeId` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeId` to the `Paiement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorieId` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_userId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_idMagasin_fkey";

-- DropForeignKey
ALTER TABLE "CommandeProduit" DROP CONSTRAINT "CommandeProduit_idCommande_fkey";

-- DropForeignKey
ALTER TABLE "CommandeProduit" DROP CONSTRAINT "CommandeProduit_idProduit_fkey";

-- DropForeignKey
ALTER TABLE "Livraison" DROP CONSTRAINT "Livraison_idCommande_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_idCommande_fkey";

-- DropForeignKey
ALTER TABLE "Panier" DROP CONSTRAINT "Panier_clientId_fkey";

-- DropForeignKey
ALTER TABLE "PanierProduit" DROP CONSTRAINT "PanierProduit_idPanier_fkey";

-- DropForeignKey
ALTER TABLE "PanierProduit" DROP CONSTRAINT "PanierProduit_idProduit_fkey";

-- DropForeignKey
ALTER TABLE "Produit" DROP CONSTRAINT "Produit_idCategorie_fkey";

-- DropForeignKey
ALTER TABLE "Produit" DROP CONSTRAINT "Produit_idMagasin_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Livraison_idCommande_key";

-- DropIndex
DROP INDEX "Paiement_idCommande_key";

-- AlterTable
ALTER TABLE "Categorie" DROP COLUMN "nomCategorie",
ADD COLUMN     "nom" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Commande" DROP COLUMN "idMagasin",
DROP COLUMN "statut",
DROP COLUMN "totalPrix",
ADD COLUMN     "statutId" INTEGER NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Livraison" DROP COLUMN "idCommande",
DROP COLUMN "service",
ADD COLUMN     "commandeId" INTEGER NOT NULL,
ALTER COLUMN "dateLivraison" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "idCommande",
DROP COLUMN "modePaiement",
DROP COLUMN "statut",
ADD COLUMN     "commandeId" INTEGER NOT NULL,
ADD COLUMN     "modeId" INTEGER NOT NULL,
ALTER COLUMN "datePaiement" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "idCategorie",
DROP COLUMN "idMagasin",
ADD COLUMN     "categorieId" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "CommandeProduit";

-- DropTable
DROP TABLE "Magasin";

-- DropTable
DROP TABLE "Panier";

-- DropTable
DROP TABLE "PanierProduit";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT,
    "typeId" INTEGER NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandeStatut" (
    "id" SERIAL NOT NULL,
    "statut" TEXT NOT NULL,

    CONSTRAINT "CommandeStatut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailCommande" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetailCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModePaiement" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,

    CONSTRAINT "ModePaiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "produitId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alertes" (
    "id" SERIAL NOT NULL,
    "produitId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "dateAlerte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alertes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Ajoute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CommandeStatut_statut_key" ON "CommandeStatut"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "ModePaiement_mode_key" ON "ModePaiement"("mode");

-- CreateIndex
CREATE UNIQUE INDEX "_Ajoute_AB_unique" ON "_Ajoute"("A", "B");

-- CreateIndex
CREATE INDEX "_Ajoute_B_index" ON "_Ajoute"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Livraison_commandeId_key" ON "Livraison"("commandeId");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_commandeId_key" ON "Paiement"("commandeId");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_statutId_fkey" FOREIGN KEY ("statutId") REFERENCES "CommandeStatut"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailCommande" ADD CONSTRAINT "DetailCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailCommande" ADD CONSTRAINT "DetailCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_modeId_fkey" FOREIGN KEY ("modeId") REFERENCES "ModePaiement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alertes" ADD CONSTRAINT "Alertes_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ajoute" ADD CONSTRAINT "_Ajoute_A_fkey" FOREIGN KEY ("A") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ajoute" ADD CONSTRAINT "_Ajoute_B_fkey" FOREIGN KEY ("B") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
