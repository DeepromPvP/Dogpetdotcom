-- ============================================================================
-- สคริปต์สร้างฐานข้อมูลและตารางสำหรับระบบลงทะเบียน DogPetDotCom
-- Database: dogpet_db
-- Table: user
-- รองรับภาษาไทยสมบูรณ์ด้วย utf8mb4
-- ============================================================================

-- 1. สร้างฐานข้อมูลชื่อ "dogpet_db" (ถ้ายังไม่มี)
CREATE DATABASE IF NOT EXISTS `dogpet_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. เลือกใช้งานฐานข้อมูล
USE `dogpet_db`;

-- 3. สร้างตาราง "user"
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสลำดับผู้ใช้งาน (Primary Key)',
    `fullname` VARCHAR(100) NOT NULL COMMENT 'ชื่อ - สกุล',
    `phone` VARCHAR(20) NOT NULL COMMENT 'เบอร์โทรศัพท์',
    `email` VARCHAR(100) NOT NULL COMMENT 'อีเมล',
    `gender` ENUM('ชาย', 'หญิง') NOT NULL COMMENT 'เพศ (ชาย / หญิง)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันและเวลาที่ลงทะเบียน',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันและเวลาที่แก้ไขข้อมูลล่าสุด',
    
    -- กำหนดให้ อีเมล และ เบอร์โทรศัพท์ ต้องไม่ซ้ำกันในระบบ (UNIQUE)
    UNIQUE KEY `uq_email` (`email`),
    UNIQUE KEY `uq_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลผู้ลงทะเบียนสมาชิก';

-- ============================================================================
-- ตัวอย่างข้อมูลจำลอง (Sample Data)
-- ============================================================================
INSERT INTO `user` (`fullname`, `phone`, `email`, `gender`) VALUES
('สมชาย ใจดี', '0812345678', 'somchai@example.com', 'ชาย'),
('สมหญิง รักสัตว์', '0899998888', 'somying@example.com', 'หญิง');

-- ============================================================================
-- 4. สร้างตาราง "pet" (เก็บข้อมูลสัตว์เลี้ยง/สุนัขของสมาชิก)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `pet` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'รหัสสัตว์เลี้ยง',
    `user_id` INT UNSIGNED NOT NULL COMMENT 'รหัสเจ้าของ (เชื่อมโยงกับ user.id)',
    `pet_name` VARCHAR(100) NOT NULL COMMENT 'ชื่อสุนัข',
    `breed` VARCHAR(100) NOT NULL COMMENT 'สายพันธุ์',
    `gender` ENUM('ผู้', 'เมีย') NOT NULL COMMENT 'เพศสุนัข',
    `birthdate` DATE NULL COMMENT 'วันเกิดสุนัข',
    `weight` DECIMAL(5, 2) NULL COMMENT 'น้ำหนัก (กิโลกรัม)',
    `notes` TEXT NULL COMMENT 'หมายเหตุหรือลักษณะนิสัย',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่มข้อมูล',
    
    -- ทำ Foreign Key เชื่อมกับ user.id (หากลบ user ข้อมูลสัตว์เลี้ยงจะถูกลบตาม)
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลสุนัขของสมาชิก';

-- ตัวอย่างข้อมูลสุนัขจำลอง
INSERT INTO `pet` (`user_id`, `pet_name`, `breed`, `gender`, `birthdate`, `weight`, `notes`) VALUES
(1, 'ลัคกี้ (Lucky)', 'โกลเด้น รีทรีฟเวอร์', 'ผู้', '2023-05-10', 28.50, 'ขี้เล่น ชอบว่ายน้ำ ทานอาหารเก่งมาก'),
(1, 'มิลค์ (Milk)', 'ปอมเมอเรเนียน', 'เมีย', '2024-01-15', 3.20, 'น่ารัก ขนฟู ชอบอ้อนเจ้าของ');


