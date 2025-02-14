/*
  Warnings:

  - Added the required column `prenom` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "prenom" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "prenom" TEXT NOT NULL;
