-- AlterTable
ALTER TABLE `Plot` ADD COLUMN `housing_scheme` INTEGER NULL,
    ADD COLUMN `uniqueId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `HousingScheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
