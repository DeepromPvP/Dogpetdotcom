<?php
/**
 * ============================================================================
 * API ตรวจสอบอีเมลและเบอร์โทรศัพท์ซ้ำแบบ Real-time (check_duplicate.php)
 * ตอบกลับเป็น JSON สำหรับใช้งานร่วมกับ AJAX / Fetch API ใน register.html
 * ============================================================================
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/connect.php';

$field = trim($_REQUEST['field'] ?? '');
$value = trim($_REQUEST['value'] ?? '');

$response = [
    'exists'  => false,
    'message' => ''
];

if (!empty($field) && !empty($value)) {
    try {
        if ($field === 'email') {
            $stmt = $pdo->prepare("SELECT id FROM `user` WHERE `email` = :val LIMIT 1");
            $stmt->execute([':val' => $value]);
            if ($stmt->fetch()) {
                $response['exists']  = true;
                $response['message'] = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบ';
            }
        } elseif ($field === 'phone') {
            $stmt = $pdo->prepare("SELECT id FROM `user` WHERE `phone` = :val LIMIT 1");
            $stmt->execute([':val' => $value]);
            if ($stmt->fetch()) {
                $response['exists']  = true;
                $response['message'] = 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว กรุณาใช้เบอร์อื่น หรือเข้าสู่ระบบ';
            }
        }
    } catch (PDOException $e) {
        $response['error'] = 'Database query error';
    }
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);

