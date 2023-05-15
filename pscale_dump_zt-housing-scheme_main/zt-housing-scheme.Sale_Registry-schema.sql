CREATE TABLE `Sale_Registry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plot_id` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `registry_status` enum('waiting_government_approval','registry_ready_for_customer','registry_transferred_to_customer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` int DEFAULT NULL,
  `registry_given_to_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registry_given_to_son_of` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registry_given_to_cnic` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registry_given_to_phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registry_ready_for_customer_date` datetime(3) DEFAULT NULL,
  `registry_transferred_to_customer` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
