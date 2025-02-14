/*
  Warnings:

  - You are about to drop the column `idUtilisateur` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `idUtilisateur` on the `Panier` table. All the data in the column will be lost.
  - You are about to drop the column `utilisateurId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `Panier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Commande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Panier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix` to the `PanierProduit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_idUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "Panier" DROP CONSTRAINT "Panier_idUtilisateur_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_utilisateurId_fkey";

-- DropIndex
DROP INDEX "Panier_idUtilisateur_key";

-- AlterTable
ALTER TABLE "Commande" DROP COLUMN "idUtilisateur",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Panier" DROP COLUMN "idUtilisateur",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PanierProduit" ADD COLUMN     "prix" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "utilisateurId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Utilisateur";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "clientId" INTEGER,
    "adminId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_adminId_key" ON "User"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Panier_clientId_key" ON "Panier"("clientId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panier" ADD CONSTRAINT "Panier_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
