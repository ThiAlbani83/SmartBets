/*
  Warnings:

  - You are about to drop the `_producttosupplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_producttosupplier` DROP FOREIGN KEY `_ProductToSupplier_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttosupplier` DROP FOREIGN KEY `_ProductToSupplier_B_fkey`;

-- DropTable
DROP TABLE `_producttosupplier`;
