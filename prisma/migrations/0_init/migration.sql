-- CreateTable
CREATE TABLE `Plot` (
    `id` INTEGER NOT NULL,
    `dimension` VARCHAR(255) NULL,
    `square_feet` INTEGER NULL,
    `sale_id` INTEGER NULL,
    `sale_price` INTEGER NULL,
    `fully_sold_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plot_status` ENUM('not_sold', 'partially_paid', 'fully_paid', 'registry_transferred') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `sold_date` DATETIME(3) NOT NULL,
    `total_sale_price` INTEGER NOT NULL,
    `sale_status` ENUM('cancel', 'active') NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `son_of` VARCHAR(255) NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `cnic` VARCHAR(15) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_cnic_key`(`cnic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RescindedSalePlotMetdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sale_id` INTEGER NOT NULL,
    `sale_price` INTEGER NOT NULL,
    `plot_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment_Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_type` ENUM('down_payment', 'development_charge', 'installment', 'other') NOT NULL,
    `sale_id` INTEGER NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `payment_value` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `payment_type` ENUM('down_payment', 'development_charge', 'installment', 'other') NOT NULL,
    `sale_id` INTEGER NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `payment_status` ENUM('refund', 'active') NULL DEFAULT 'active',
    `payment_value` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale_Registry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plot_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `registry_status` ENUM('waiting_government_approval', 'registry_ready_for_customer', 'registry_transferred_to_customer') NOT NULL,
    `customer_id` INTEGER NULL,
    `registry_given_to_name` VARCHAR(191) NULL,
    `registry_given_to_son_of` VARCHAR(191) NULL,
    `registry_given_to_cnic` VARCHAR(191) NULL,
    `registry_given_to_phone` VARCHAR(191) NULL,
    `registry_ready_for_customer_date` DATETIME(3) NULL,
    `registry_transferred_to_customer` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `verifiedUser` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

