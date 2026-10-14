<?php
/**
 * ============================================================================
 * ไฟล์ประมวลผลการเพิ่มข้อมูลสัตว์เลี้ยง (add_pet.php)
 * บันทึกลงตาราง `pet` ในฐานข้อมูล `dogpet_db`
 * ============================================================================
 */
session_start();
require_once __DIR__ . '/connect.php';

// ตรวจสอบสถานะการเข้าสู่ระบบ
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id   = $_SESSION['user_id'];
    $pet_name  = htmlspecialchars(trim($_POST['pet_name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $breed     = htmlspecialchars(trim($_POST['breed'] ?? ''), ENT_QUOTES, 'UTF-8');
    $gender    = htmlspecialchars(trim($_POST['gender'] ?? ''), ENT_QUOTES, 'UTF-8');
    $birthdate = !empty($_POST['birthdate']) ? trim($_POST['birthdate']) : null;
    $weight    = (!empty($_POST['weight']) && is_numeric($_POST['weight'])) ? floatval($_POST['weight']) : null;
    $notes     = htmlspecialchars(trim($_POST['notes'] ?? ''), ENT_QUOTES, 'UTF-8');

    // ตรวจสอบความถูกต้องของข้อมูลพื้นฐาน
    if (!empty($pet_name) && !empty($breed) && in_array($gender, ['ผู้', 'เมีย'])) {
        try {
            $sql = "INSERT INTO `pet` (`user_id`, `pet_name`, `breed`, `gender`, `birthdate`, `weight`, `notes`) 
                    VALUES (:user_id, :pet_name, :breed, :gender, :birthdate, :weight, :notes)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':user_id'   => $user_id,
                ':pet_name'  => $pet_name,
                ':breed'     => $breed,
                ':gender'    => $gender,
                ':birthdate' => $birthdate,
                ':weight'    => $weight,
                ':notes'     => $notes
            ]);

            $_SESSION['pet_success'] = "เพิ่มข้อมูลน้องสุนัข \"{$pet_name}\" สำเร็จเรียบร้อยแล้ว!";
        } catch (PDOException $e) {
            $_SESSION['pet_error'] = "เกิดข้อผิดพลาดในการบันทึก: " . $e->getMessage();
        }
    } else {
        $_SESSION['pet_error'] = "กรุณากรอกข้อมูลชื่อสุนัข สายพันธุ์ และเลือกเพศให้ครบถ้วน";
    }
}

// ส่งกลับไปยังหน้าแสดงข้อมูล
header("Location: information.php#petSection");
exit;

