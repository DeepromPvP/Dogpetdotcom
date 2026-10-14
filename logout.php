<?php
/**
 * ============================================================================
 * ไฟล์ออกจากระบบ (logout.php)
 * ล้างข้อมูล Session ทั้งหมดและส่งกลับไปหน้า login.php
 * ============================================================================
 */
session_start();
$_SESSION = [];

// ลบคุกกี้ Session หากมี
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

// ส่งกลับไปยังหน้า Login
header("Location: login.php");
exit;

