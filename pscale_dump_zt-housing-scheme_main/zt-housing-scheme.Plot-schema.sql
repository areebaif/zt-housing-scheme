CREATE TABLE `Plot` (
  `id` int NOT NULL,
  `dimension` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `square_feet` int DEFAULT NULL,
  `sale_id` int DEFAULT NULL,
  `sale_price` int DEFAULT NULL,
  `fully_sold_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `plot_status` enum('not_sold','partially_paid','fully_paid','registry_transferred') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
