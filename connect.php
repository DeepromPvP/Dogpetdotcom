<?php
/**
 * ============================================================================
 * ไฟล์เชื่อมต่อฐานข้อมูล MySQL ด้วย PDO (PHP Data Objects)
 * Database: dogpet_db
 * ============================================================================
 */

// 1. กำหนดค่าการเชื่อมต่อฐานข้อมูล
$db_host    = 'localhost';        // ชื่อโฮสต์ (Host)
$db_name    = 'dogpet_db';        // ชื่อฐานข้อมูล
$db_user    = 'root';             // ชื่อผู้ใช้งานฐานข้อมูล (Default ของ XAMPP คือ root)
$db_pass    = '';                 // รหัสผ่านฐานข้อมูล (Default ของ XAMPP คือค่าว่าง)
$db_charset = 'utf8mb4';          // ชุดอักขระรองรับภาษาไทยและสัญลักษณ์ต่างๆ

// 2. Data Source Name (DSN)
$dsn = "mysql:host={$db_host};dbname={$db_name};charset={$db_charset}";

// 3. กำหนดตัวเลือก (Options) สำหรับ PDO
$options = [
    // แสดง Error เป็น Exception เพื่อให้ดักจับด้วย try-catch ได้ง่าย
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // รูปแบบการดึงข้อมูลให้อยู่ในรูป Associative Array (เช่น $row['fullname'])
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // ปิดการจำลอง Prepared Statements เพื่อความปลอดภัยจาก SQL Injection สูงสุด
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// 4. ทำการเชื่อมต่อฐานข้อมูล
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    
    // กำหนดตัวแปรสำรอง $conn เผื่อใช้งานสลับกันระหว่าง $pdo และ $conn
    $conn = $pdo;

} catch (PDOException $e) {
    // บันทึก Log และแสดงข้อความเมื่อการเชื่อมต่อล้มเหลว
    error_log("Database Connection Failed: " . $e->getMessage());
    die("<div style='font-family: sans-serif; padding: 20px; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; border-radius: 8px; margin: 20px;'>
            <h3><i class='fa-solid fa-triangle-exclamation'></i> ไม่สามารถเชื่อมต่อฐานข้อมูลได้!</h3>
            <p><strong>ข้อผิดพลาด:</strong> " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "</p>
            <p>กรุณาตรวจสอบว่า Service MySQL ใน XAMPP Control Panel กำลังทำงานอยู่ และฐานข้อมูล <code>{$db_name}</code> ถูกสร้างเรียบร้อยแล้ว</p>
         </div>");
}

