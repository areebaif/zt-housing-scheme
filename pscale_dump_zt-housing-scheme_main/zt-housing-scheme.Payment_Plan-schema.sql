CREATE TABLE `Payment_Plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_type` enum('down_payment','development_charge','installment','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sale_id` int NOT NULL,
  `payment_date` datetime(3) DEFAULT NULL,
  `payment_value` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=628 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
