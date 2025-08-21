/*
  Warnings:

  - You are about to drop the column `qttMin` on the `Historic` table. All the data in the column will be lost.
  - Added the required column `currentStock` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Historic" DROP COLUMN "qttMin",
ADD COLUMN     "currentStock" INTEGER NOT NULL;
