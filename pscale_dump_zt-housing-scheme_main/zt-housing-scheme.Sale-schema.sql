CREATE TABLE `Sale` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `sold_date` datetime(3) NOT NULL,
  `total_sale_price` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
