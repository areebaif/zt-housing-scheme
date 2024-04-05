/*
  Warnings:

  - The primary key for the `Plot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[housing_scheme,id]` on the table `Plot` will be added. If there are existing duplicate values, this will fail.
  - Made the column `housing_scheme` on table `Plot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uniqueId` on table `Plot` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Plot` DROP PRIMARY KEY,
    MODIFY `housing_scheme` INTEGER NOT NULL,
    MODIFY `uniqueId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uniqueId`);

-- AlterTable
ALTER TABLE `Sale` ADD COLUMN `housing_scheme` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Plot_housing_scheme_id_key` ON `Plot`(`housing_scheme`, `id`);
