
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `library`;
DROP TABLE IF EXISTS `country`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `product_category`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `product_library`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `order_product`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `full_name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `gender` varchar(255),
  `date_of_birth` varchar(255),
  `phone` varchar(255),
  `address` text,
  `country_code` int,
  `created_at` varchar(255)
);
CREATE TABLE `country` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `code` varchar(255) UNIQUE,
  `level` varchar(255),
  `parent_id` int,
  `created_at` varchar(255)
);

CREATE TABLE `library` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `url` varchar(255),
  `size` int,
  `created_at` varchar(255)
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(255),
  `description` longtext,
  `details` longtext,
  `quantily` int,
  `regular_price` int,
  `sale_price` int,
  `status` varchar(255),
  `created_at` varchar(255)
);

CREATE TABLE `product_category` (
  `product_id` int,
  `category_id` int,
  `type` char
);

CREATE TABLE `product_categories` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `parent_id` int,
  `created_at` varchar(255)
);

CREATE TABLE `product_library` (
  `product_id` int,
  `library_id` int,
  `type` char
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `description` longtext,
  `status` varchar(255),
  `created_at` varchar(255)
);

CREATE TABLE `order_product` (
  `product_id` int,
  `order_id` int,
  `quantily` int
);

ALTER TABLE `users` ADD FOREIGN KEY (`country_code`) REFERENCES `country` (`id`);

ALTER TABLE `product_library` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `product_library` ADD FOREIGN KEY (`library_id`) REFERENCES `library` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`);

ALTER TABLE `product_category` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
