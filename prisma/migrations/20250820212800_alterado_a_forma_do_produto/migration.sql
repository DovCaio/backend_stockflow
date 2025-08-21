/*
  Warnings:

  - You are about to drop the column `SKU` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `qtt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `qttMin` on the `Product` table. All the data in the column will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "SKU",
DROP COLUMN "nome",
DROP COLUMN "qtt",
DROP COLUMN "qttMin",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "creatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentStock" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "minimumStock" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "updateAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
