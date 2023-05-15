CREATE TABLE `Payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` enum('down_payment','development_charge','installment','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sale_id` int NOT NULL,
  `payment_date` datetime(3) NOT NULL,
  `payment_value` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
