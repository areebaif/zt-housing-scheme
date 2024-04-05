/*
  Warnings:

  - Made the column `housing_scheme` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Sale` MODIFY `housing_scheme` INTEGER NOT NULL;
