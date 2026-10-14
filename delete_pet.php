<?php
/**
 * ============================================================================
 * ไฟล์ประมวลผลการลบข้อมูลสัตว์เลี้ยง (delete_pet.php)
 * ลบจากตาราง `pet` โดยตรวจสอบว่าต้องเป็นเจ้าของตัวจริง (user_id ตรงกัน)
 * ============================================================================
 */
session_start();
require_once __DIR__ . '/connect.php';

// ตรวจสอบสถานะการเข้าสู่ระบบ
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$pet_id = intval($_GET['id'] ?? $_POST['id'] ?? 0);
$user_id = $_SESSION['user_id'];

if ($pet_id > 0) {
    try {
        $stmt = $pdo->prepare("DELETE FROM `pet` WHERE `id` = :id AND `user_id` = :user_id");
        $stmt->execute([
            ':id'      => $pet_id,
            ':user_id' => $user_id
        ]);

        if ($stmt->rowCount() > 0) {
            $_SESSION['pet_success'] = "ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้ว";
        } else {
            $_SESSION['pet_error'] = "ไม่พบข้อมูลสัตว์เลี้ยง หรือคุณไม่มีสิทธิ์ในการลบรายการนี้";
        }
    } catch (PDOException $e) {
        $_SESSION['pet_error'] = "เกิดข้อผิดพลาดในการลบ: " . $e->getMessage();
    }
}

// ส่งกลับไปยังหน้าแสดงข้อมูล
header("Location: information.php#petSection");
exit;

