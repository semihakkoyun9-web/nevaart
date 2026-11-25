-- ====================================================================
-- NEVAART - İNTERNET PROGRAMCILIĞI II VERİTABANI ŞEMASI (MySQL / MariaDB)
-- Bandırma Onyedi Eylül Üniversitesi · Gönen MYO · Dr. Ahmet Akkaya
-- Kriter H: Veritabanı bağlantısı (PDO & İlişkisel Tablolar)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `nevaart_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nevaart_db`;

-- 1. Kullanıcılar ve RBAC Rol Tablosu (Kriter I & J)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('visitor', 'member', 'curator') NOT NULL DEFAULT 'visitor',
  `bio` TEXT,
  `joined_date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `bio`, `joined_date`) VALUES
(1, 'Prof. Dr. Halil Erdem', 'halil@nevaart.org', '$2y$10$eF8bJk7u3xV9mN1qR5tY7uW2zX4cV6bN8mQ0pL2kJ4hG6fD8sA0e', 'curator', 'Baş Küratör & Sanat Tarihçisi, Viyana ve İstanbul Güzel Sanatlar Danışmanı.', '2024-01-10'),
(2, 'Elenora Vane', 'elenora@vane.art', '$2y$10$eF8bJk7u3xV9mN1qR5tY7uW2zX4cV6bN8mQ0pL2kJ4hG6fD8sA0e', 'member', 'Kayıtlı Dijital Sanatçı & Parametrik Heykeltıraş.', '2025-02-14'),
(3, 'Misafir Ziyaretçi', 'ziyaretci@nevaart.org', '$2y$10$eF8bJk7u3xV9mN1qR5tY7uW2zX4cV6bN8mQ0pL2kJ4hG6fD8sA0e', 'visitor', 'Sanatsever ve Koleksiyon Takipçisi.', '2026-01-01');

-- 2. Sanat Eserleri Tablosu (Kriter H, L, M, X)
CREATE TABLE IF NOT EXISTS `artworks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(180) NOT NULL UNIQUE,
  `accession_number` VARCHAR(40) NOT NULL,
  `title` VARCHAR(220) NOT NULL,
  `artist` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `prod_year` INT NOT NULL,
  `medium_tr` VARCHAR(255) NOT NULL,
  `dimensions` VARCHAR(120) NOT NULL,
  `story_tr` TEXT NOT NULL,
  `technical_tr` TEXT,
  `image_url` TEXT NOT NULL,
  `color_palette_json` JSON,
  `views` INT NOT NULL DEFAULT 100,
  `likes` INT NOT NULL DEFAULT 10,
  `is_curator_pick` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Küratör Değerlendirmeleri Tablosu (Kriter K)
CREATE TABLE IF NOT EXISTS `curator_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `artwork_id` INT NOT NULL,
  `user_name` VARCHAR(120) NOT NULL,
  `user_role` VARCHAR(40) NOT NULL,
  `rating` TINYINT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `review_date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Sanatçı İletişim & Edinim Mesajları Tablosu (Kriter AC - Email Gönderimi)
CREATE TABLE IF NOT EXISTS `artist_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `artwork_id` INT NOT NULL,
  `inquiry_type` VARCHAR(80) NOT NULL,
  `sender_name` VARCHAR(120) NOT NULL,
  `sender_email` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `reference_no` VARCHAR(60) NOT NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. E-Bülten Aboneleri Tablosu (Kriter AC)
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `subscribed_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

