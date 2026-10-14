<?php
// ==========================================================================
// 1. รับค่าและประมวลผลข้อมูล (รองรับทั้ง POST จาก Register และ Session จาก Login)
// ==========================================================================
session_start();
date_default_timezone_set('Asia/Bangkok');

// รวมไฟล์เชื่อมต่อฐานข้อมูล PDO
require_once __DIR__ . '/connect.php';

$is_post = ($_SERVER['REQUEST_METHOD'] === 'POST');

// ฟังก์ชันช่วยทำความสะอาดข้อมูลเพื่อความปลอดภัย (Prevent XSS)
function clean_input($data) {
    return htmlspecialchars(trim($data ?? ''), ENT_QUOTES, 'UTF-8');
}

$fullname = '';
$phone    = '';
$email    = '';
$gender   = '';
$has_data = false;
$db_error = null;
$insert_id = null;
$login_message = $_SESSION['login_success'] ?? null;
unset($_SESSION['login_success']); // ลบข้อความแจ้งเตือนหลังแสดงผล 1 ครั้ง

$duplicate_error = null;

// กรณีที่ 1: มาจากการส่งฟอร์ม Register (POST)
if ($is_post) {
    $fullname = clean_input($_POST['fullname'] ?? '');
    $phone    = clean_input($_POST['phone'] ?? '');
    $email    = clean_input($_POST['email'] ?? '');
    $gender   = clean_input($_POST['gender'] ?? '');

    if (!empty($fullname) && !empty($phone) && !empty($email) && !empty($gender)) {
        try {
            // 1. ตรวจสอบว่ามีอีเมลหรือเบอร์โทรศัพท์นี้ในระบบแล้วหรือไม่ เพื่อป้องกันข้อมูลซ้ำ
            $check_stmt = $pdo->prepare("SELECT id, email, phone FROM `user` WHERE `email` = :email OR `phone` = :phone LIMIT 1");
            $check_stmt->execute([
                ':email' => $email,
                ':phone' => $phone
            ]);
            $existing_user = $check_stmt->fetch();

            if ($existing_user) {
                // ตรวจสอบว่าข้อมูลส่วนใดที่ซ้ำ
                if ($existing_user['email'] === $email && $existing_user['phone'] === $phone) {
                    $duplicate_error = "ทั้งอีเมล ({$email}) และเบอร์โทรศัพท์ ({$phone}) นี้มีอยู่ในระบบแล้ว กรุณาเข้าสู่ระบบ";
                } elseif ($existing_user['email'] === $email) {
                    $duplicate_error = "อีเมล ({$email}) นี้มีอยู่ในระบบแล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบ";
                } else {
                    $duplicate_error = "เบอร์โทรศัพท์ ({$phone}) นี้มีอยู่ในระบบแล้ว กรุณาใช้เบอร์โทรศัพท์อื่น หรือเข้าสู่ระบบ";
                }
            } else {
                // 2. ถ้าไม่ซ้ำ ทำการบันทึกลงฐานข้อมูล
                $sql = "INSERT INTO `user` (`fullname`, `phone`, `email`, `gender`) VALUES (:fullname, :phone, :email, :gender)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':fullname' => $fullname,
                    ':phone'    => $phone,
                    ':email'    => $email,
                    ':gender'   => $gender
                ]);
                
                $insert_id = $pdo->lastInsertId();
                $_SESSION['user_id'] = $insert_id;
                $_SESSION['user_fullname'] = $fullname;

                $has_data = true;
                $member_id = 'DP-' . date('Ymd') . '-' . str_pad($insert_id, 4, '0', STR_PAD_LEFT);
                $registered_at = date('d/m/Y H:i:s น.');
            }
        } catch (PDOException $e) {
            // ตรวจสอบ Error Code ของ MySQL กรณีเกิด Duplicate Entry (1062)
            if ($e->getCode() == 23000) {
                $duplicate_error = "อีเมลหรือเบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว ไม่สามารถลงทะเบียนซ้ำได้";
            } else {
                $db_error = $e->getMessage();
            }
        }
    }
} 
// กรณีที่ 2: มาจากการเข้าสู่ระบบสำเร็จ (Login Session)
elseif (isset($_SESSION['user_id'])) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM `user` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $_SESSION['user_id']]);
        $user = $stmt->fetch();

        if ($user) {
            $has_data = true;
            $fullname = $user['fullname'];
            $phone    = $user['phone'];
            $email    = $user['email'];
            $gender   = $user['gender'];
            $created_time = strtotime($user['created_at']);
            $member_id = 'DP-' . date('Ymd', $created_time) . '-' . str_pad($user['id'], 4, '0', STR_PAD_LEFT);
            $registered_at = date('d/m/Y H:i:s น.', $created_time);
        }
    } catch (PDOException $e) {
        $db_error = $e->getMessage();
    }
}

// ดึงข้อมูลสัตว์เลี้ยง (Pets) ของผู้ใช้งานปัจจุบัน
$user_pets   = [];
$active_uid  = $insert_id ?? $_SESSION['user_id'] ?? null;
$pet_success = $_SESSION['pet_success'] ?? null;
$pet_error   = $_SESSION['pet_error'] ?? null;
unset($_SESSION['pet_success'], $_SESSION['pet_error']);

if ($active_uid) {
    try {
        $pet_stmt = $pdo->prepare("SELECT * FROM `pet` WHERE `user_id` = :uid ORDER BY id DESC");
        $pet_stmt->execute([':uid' => $active_uid]);
        $user_pets = $pet_stmt->fetchAll();
    } catch (PDOException $e) {
        $pet_error = "ไม่สามารถโหลดข้อมูลสุนัขได้: " . $e->getMessage();
    }
}

// จัดการไอคอนและสีตามเพศ
$gender_icon  = ($gender === 'ชาย') ? 'fa-solid fa-mars' : 'fa-solid fa-venus';
$gender_theme = ($gender === 'ชาย') ? 'primary' : 'danger';
$avatar_icon  = ($gender === 'ชาย') ? 'fa-solid fa-user-tie' : 'fa-solid fa-user';
?>
<!DOCTYPE html>
<html lang="th">
<head>
  <!-- ==========================================================================
       2. META TAGS & TITLE
       ========================================================================== -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ข้อมูลการลงทะเบียน (Member Information) - สุนัขเลี้ยงดอทคอม</title>

  <!-- ==========================================================================
       3. EXTERNAL CSS & FONTS (Bootstrap 5, Font Awesome, Google Font)
       ========================================================================== -->
  <!-- Bootstrap 5 CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome 6 Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="css/style.css">

  <style>
    .info-card {
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 8px 15px -6px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }
    .info-header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 2.5rem 1.5rem;
      position: relative;
    }
    .avatar-wrapper {
      width: 90px;
      height: 90px;
      margin: 0 auto;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border: 4px solid rgba(255, 255, 255, 0.8);
    }
    .info-row {
      padding: 0.9rem 1.25rem;
      border-radius: 12px;
      background-color: #f8fafc;
      transition: background-color 0.2s ease;
    }
    .info-row:hover {
      background-color: #f1f5f9;
    }
    .info-label {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .info-value {
      color: #1e293b;
      font-weight: 600;
      font-size: 1rem;
    }
    @media print {
      .navbar, .footer, .btn-action-group, .page-header-banner {
        display: none !important;
      }
      .info-card {
        box-shadow: none !important;
        border: 1px solid #ddd !important;
      }
    }
  </style>
</head>
<body class="d-flex flex-column min-vh-100">

  <!-- ==========================================================================
       4. NAVIGATION BAR
       ========================================================================== -->
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <span class="brand-icon"><i class="fa-solid fa-paw"></i></span>
        <span>สุนัขเลี้ยงดอทคอม</span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="สลับแถบเมนู">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-1">
          <li class="nav-item">
            <a class="nav-link" href="index.html">
              <i class="fa-solid fa-house me-1"></i> หน้าแรก
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="breeds.html">
              <i class="fa-solid fa-dog me-1"></i> รวมสายพันธุ์
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="groups.html">
              <i class="fa-solid fa-layer-group me-1"></i> กลุ่มสายพันธุ์
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="quiz.html">
              <i class="fa-solid fa-wand-magic-sparkles me-1"></i> ค้นหาสุนัขที่ใช่
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="care.html">
              <i class="fa-solid fa-heart-pulse me-1"></i> การดูแลและสุขภาพ
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="contact.html">
              <i class="fa-solid fa-envelope me-1"></i> ติดต่อเรา
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="register.html">
              <i class="fa-solid fa-user-plus me-1"></i> ลงทะเบียน
            </a>
          </li>
          <?php if (isset($_SESSION['user_id'])): ?>
            <li class="nav-item">
              <a class="nav-link text-danger fw-semibold" href="logout.php">
                <i class="fa-solid fa-right-from-bracket me-1"></i> ออกจากระบบ
              </a>
            </li>
          <?php else: ?>
            <li class="nav-item">
              <a class="nav-link" href="login.php">
                <i class="fa-solid fa-right-to-bracket me-1"></i> เข้าสู่ระบบ
              </a>
            </li>
          <?php endif; ?>
        </ul>
      </div>
    </div>
  </nav>

  <!-- ==========================================================================
       5. HEADER BANNER
       ========================================================================== -->
  <header class="page-header-banner">
    <div class="container text-center">
      <span class="badge bg-warning text-dark rounded-pill mb-2">
        <i class="fa-solid fa-circle-user me-1"></i> Member Profile
      </span>
      <h1 class="fw-bold mb-2">ข้อมูลสมาชิกที่เข้าสู่ระบบ</h1>
      <p class="text-secondary mb-0">ระบบแสดงข้อมูลสมาชิกของคุณจากฐานข้อมูล รายละเอียดดังแสดงด้านล่าง</p>
    </div>
  </header>

  <!-- ==========================================================================
       6. MAIN CONTENT SECTION
       ========================================================================== -->
  <main class="py-5 flex-grow-1">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-9 col-lg-7">

          <!-- แสดงแจ้งเตือนเมื่อเข้าสู่ระบบสำเร็จ -->
          <?php if (!empty($login_message)): ?>
            <div class="alert alert-success alert-dismissible fade show shadow-sm rounded-4 mb-4" role="alert">
              <div class="d-flex align-items-center">
                <i class="fa-solid fa-circle-check fs-2 me-3 text-success"></i>
                <div>
                  <h5 class="alert-heading fw-bold mb-1">เข้าสู่ระบบสำเร็จ!</h5>
                  <p class="mb-0 small text-secondary"><?= htmlspecialchars($login_message, ENT_QUOTES, 'UTF-8') ?> ยินดีต้อนรับคุณ <strong><?= htmlspecialchars($fullname, ENT_QUOTES, 'UTF-8') ?></strong></p>
                </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          <?php endif; ?>

          <?php if (!empty($duplicate_error)): ?>
            <!-- การ์ดแจ้งเตือนกรณีข้อมูลซ้ำในระบบ -->
            <div class="card shadow-sm border-0 rounded-4 text-center p-4 p-md-5">
              <div class="mb-3 text-danger">
                <div class="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3" style="width: 80px; height: 80px;">
                  <i class="fa-solid fa-triangle-exclamation fs-1"></i>
                </div>
              </div>
              <h3 class="fw-bold text-dark mb-2">ไม่สามารถลงทะเบียนได้</h3>
              <div class="alert alert-warning border border-warning-subtle text-start d-inline-block mx-auto my-3 px-4 py-3 rounded-3 shadow-sm" style="max-width: 550px;">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-circle-exclamation text-warning fs-4 me-3"></i>
                  <div>
                    <strong class="d-block text-dark">ตรวจพบข้อมูลซ้ำในระบบ:</strong>
                    <span class="text-secondary"><?= htmlspecialchars($duplicate_error, ENT_QUOTES, 'UTF-8') ?></span>
                  </div>
                </div>
              </div>
              <p class="text-secondary mb-4">
                หากคุณเคยลงทะเบียนไว้แล้ว สามารถเข้าสู่ระบบด้วยอีเมลและเบอร์โทรศัพท์ของคุณได้ทันที
              </p>
              <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="login.php" class="btn btn-primary-custom btn-lg px-4 py-2">
                  <i class="fa-solid fa-right-to-bracket me-2"></i> เข้าสู่ระบบทันที
                </a>
                <a href="register.html" class="btn btn-outline-secondary btn-lg px-4 py-2">
                  <i class="fa-solid fa-arrow-left me-2"></i> กลับไปแก้ไขข้อมูล
                </a>
              </div>
            </div>

          <?php elseif ($has_data): ?>
            <!-- การ์ดแสดงผลข้อมูลเมื่อได้รับค่าถูกต้อง -->
            <div class="info-card">
              <!-- การ์ดส่วนหัว (Gradient Header) -->
              <div class="info-header text-center">
                <div class="avatar-wrapper mb-3">
                  <i class="<?= $avatar_icon ?> fs-1 text-<?= $gender_theme ?>"></i>
                </div>
                <h3 class="fw-bold mb-1"><?= $fullname ?></h3>
                <span class="badge bg-white text-dark rounded-pill px-3 py-2 fw-semibold shadow-sm">
                  <i class="fa-solid fa-id-badge text-warning me-1"></i> รหัสสมาชิก: <?= $member_id ?>
                </span>
              </div>

              <!-- รายละเอียดข้อมูล -->
              <div class="p-4 p-md-5">
                <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <h5 class="fw-bold text-dark mb-0">
                    <i class="fa-solid fa-address-card text-warning me-2"></i>รายละเอียดข้อมูลสมาชิก
                  </h5>
                  <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill">
                    <i class="fa-solid fa-circle-check me-1"></i> บันทึกข้อมูลแล้ว
                  </span>
                </div>

                <div class="d-flex flex-column gap-3 mb-4">
                  <!-- 1. ชื่อ - สกุล -->
                  <div class="info-row d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-warning-subtle text-warning p-2 rounded-3 me-3" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-user"></i>
                      </div>
                      <span class="info-label">ชื่อ - นามสกุล:</span>
                    </div>
                    <span class="info-value"><?= $fullname ?></span>
                  </div>

                  <!-- 2. เพศ -->
                  <div class="info-row d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-<?= $gender_theme ?>-subtle text-<?= $gender_theme ?> p-2 rounded-3 me-3" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <i class="<?= $gender_icon ?>"></i>
                      </div>
                      <span class="info-label">เพศ:</span>
                    </div>
                    <span class="badge bg-<?= $gender_theme ?>-subtle text-<?= $gender_theme ?> border border-<?= $gender_theme ?>-subtle px-3 py-2 rounded-pill fs-6">
                      <i class="<?= $gender_icon ?> me-1"></i> <?= $gender ?>
                    </span>
                  </div>

                  <!-- 3. เบอร์โทร -->
                  <div class="info-row d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary-subtle text-primary p-2 rounded-3 me-3" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-phone"></i>
                      </div>
                      <span class="info-label">เบอร์โทรศัพท์:</span>
                    </div>
                    <span class="info-value">
                      <a href="tel:<?= $phone ?>" class="text-decoration-none text-dark">
                        <?= $phone ?>
                      </a>
                    </span>
                  </div>

                  <!-- 4. อีเมล -->
                  <div class="info-row d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-info-subtle text-info p-2 rounded-3 me-3" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-envelope"></i>
                      </div>
                      <span class="info-label">อีเมล:</span>
                    </div>
                    <span class="info-value">
                      <a href="mailto:<?= $email ?>" class="text-decoration-none text-primary">
                        <?= $email ?>
                      </a>
                    </span>
                  </div>

                  <!-- เวลาที่ลงทะเบียน -->
                  <div class="info-row d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <div class="bg-secondary-subtle text-secondary p-2 rounded-3 me-3" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-clock"></i>
                      </div>
                      <span class="info-label">วันที่ลงทะเบียน:</span>
                    </div>
                    <span class="info-value text-secondary small"><?= $registered_at ?></span>
                  </div>
                </div>

                <!-- กลุ่มปุ่มสั่งการ -->
                <div class="btn-action-group pt-3 d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn-warning text-dark fw-bold flex-grow-1 py-2 rounded-3" data-bs-toggle="modal" data-bs-target="#addPetModal">
                    <i class="fa-solid fa-plus me-1"></i> เพิ่มข้อมูลสุนัข
                  </button>
                  <a href="register.html" class="btn btn-outline-secondary flex-grow-1 py-2 rounded-3">
                    <i class="fa-solid fa-user-plus me-1"></i> ลงทะเบียนใหม่
                  </a>
                  <button type="button" onclick="window.print()" class="btn btn-outline-primary flex-grow-1 py-2 rounded-3">
                    <i class="fa-solid fa-print me-1"></i> พิมพ์ข้อมูล
                  </button>
                  <a href="index.html" class="btn btn-primary-custom flex-grow-1 py-2 rounded-3">
                    <i class="fa-solid fa-house me-1"></i> กลับหน้าหลัก
                  </a>
                  <a href="logout.php" class="btn btn-outline-danger flex-grow-1 py-2 rounded-3">
                    <i class="fa-solid fa-right-from-bracket me-1"></i> ออกจากระบบ
                  </a>
                </div>

              </div>
            </div>

            <!-- ========================================================
                 ส่วนแสดงข้อมูลสัตว์เลี้ยง (Pet Management Section)
                 ======================================================== -->
            <div class="card shadow-sm border-0 rounded-4 mt-4 overflow-hidden" id="petSection">
              <div class="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
                <div class="d-flex align-items-center">
                  <div class="bg-warning-subtle text-warning p-2 rounded-3 me-3" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-dog fs-4"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-0 text-dark">สุนัขในความดูแลของคุณ (My Dogs)</h5>
                    <small class="text-muted">ข้อมูลสุนัขที่บันทึกไว้ในตาราง pet</small>
                  </div>
                </div>
                <button type="button" class="btn btn-warning text-dark fw-bold btn-sm rounded-pill px-3 py-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#addPetModal">
                  <i class="fa-solid fa-plus me-1"></i> เพิ่มสุนัขตัวใหม่
                </button>
              </div>

              <div class="card-body p-4">
                <!-- แจ้งเตือนสถานะการเพิ่ม/ลบ สัตว์เลี้ยง -->
                <?php if (!empty($pet_success)): ?>
                  <div class="alert alert-success alert-dismissible fade show rounded-3 mb-3 py-2 shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-check me-2"></i> <?= htmlspecialchars($pet_success, ENT_QUOTES, 'UTF-8') ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                <?php endif; ?>
                <?php if (!empty($pet_error)): ?>
                  <div class="alert alert-danger alert-dismissible fade show rounded-3 mb-3 py-2 shadow-sm" role="alert">
                    <i class="fa-solid fa-circle-exclamation me-2"></i> <?= htmlspecialchars($pet_error, ENT_QUOTES, 'UTF-8') ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                <?php endif; ?>

                <?php if (!empty($user_pets)): ?>
                  <div class="row g-3">
                    <?php foreach ($user_pets as $pet): ?>
                      <?php 
                        $p_gender_theme = ($pet['gender'] === 'ผู้') ? 'primary' : 'danger';
                        $p_gender_icon  = ($pet['gender'] === 'ผู้') ? 'fa-mars' : 'fa-venus';
                      ?>
                      <div class="col-12 col-md-6">
                        <div class="border rounded-4 p-3 bg-light h-100 position-relative shadow-sm">
                          <div class="d-flex align-items-start justify-content-between mb-2">
                            <div class="d-flex align-items-center">
                              <div class="bg-white text-warning rounded-circle p-2 me-2 shadow-sm" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                                <i class="fa-solid fa-paw fs-4"></i>
                              </div>
                              <div>
                                <h6 class="fw-bold mb-0 text-dark"><?= htmlspecialchars($pet['pet_name'], ENT_QUOTES, 'UTF-8') ?></h6>
                                <span class="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill small">
                                  <?= htmlspecialchars($pet['breed'], ENT_QUOTES, 'UTF-8') ?>
                                </span>
                              </div>
                            </div>
                            <!-- ปุ่มลบข้อมูลสัตว์เลี้ยง -->
                            <a href="delete_pet.php?id=<?= $pet['id'] ?>" 
                               class="btn btn-outline-danger btn-sm rounded-circle p-1" 
                               style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"
                               onclick="return confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลสุนัขชื่อ &quot;<?= htmlspecialchars($pet['pet_name'], ENT_QUOTES, 'UTF-8') ?>&quot;?');"
                               title="ลบข้อมูล">
                              <i class="fa-solid fa-trash-can small"></i>
                            </a>
                          </div>

                          <div class="d-flex flex-wrap gap-2 my-2 small">
                            <span class="badge bg-<?= $p_gender_theme ?>-subtle text-<?= $p_gender_theme ?> border border-<?= $p_gender_theme ?>-subtle rounded-pill">
                              <i class="fa-solid <?= $p_gender_icon ?> me-1"></i> เพศ<?= $pet['gender'] ?>
                            </span>
                            <?php if (!empty($pet['weight'])): ?>
                              <span class="badge bg-secondary-subtle text-secondary border rounded-pill">
                                <i class="fa-solid fa-weight-scale me-1"></i> <?= number_format($pet['weight'], 1) ?> กก.
                              </span>
                            <?php endif; ?>
                            <?php if (!empty($pet['birthdate'])): ?>
                              <span class="badge bg-secondary-subtle text-secondary border rounded-pill">
                                <i class="fa-solid fa-cake-candles me-1"></i> <?= date('d/m/Y', strtotime($pet['birthdate'])) ?>
                              </span>
                            <?php endif; ?>
                          </div>

                          <?php if (!empty($pet['notes'])): ?>
                            <p class="small text-secondary mb-0 bg-white p-2 rounded-3 border">
                              <i class="fa-solid fa-note-sticky text-warning me-1"></i> <?= htmlspecialchars($pet['notes'], ENT_QUOTES, 'UTF-8') ?>
                            </p>
                          <?php endif; ?>
                        </div>
                      </div>
                    <?php endforeach; ?>
                  </div>
                <?php else: ?>
                  <!-- แสดงเมื่อยังไม่มีสัตว์เลี้ยง -->
                  <div class="text-center py-4 text-muted">
                    <i class="fa-solid fa-shield-dog fs-1 text-secondary mb-2 d-block opacity-50"></i>
                    <p class="mb-2">คุณยังไม่ได้เพิ่มข้อมูลสุนัขในระบบ</p>
                    <button type="button" class="btn btn-outline-warning text-dark btn-sm rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#addPetModal">
                      <i class="fa-solid fa-plus me-1"></i> เพิ่มสุนัขตัวแรกของคุณ
                    </button>
                  </div>
                <?php endif; ?>
              </div>
            </div>

          <?php else: ?>
            <!-- กล่องแจ้งเตือนกรณีเข้าหน้านี้โดยตรงโดยไม่ได้ล็อกอินหรือไม่ได้ส่งฟอร์ม -->
            <div class="card shadow-sm border-0 rounded-4 text-center p-5">
              <div class="mb-3 text-warning">
                <i class="fa-solid fa-lock display-3 text-warning"></i>
              </div>
              <h4 class="fw-bold text-dark mb-2">ยังไม่ได้เข้าสู่ระบบ</h4>
              <p class="text-secondary mb-4">
                คุณยังไม่ได้เข้าสู่ระบบ หรือยังไม่ได้กรอกแบบฟอร์มลงทะเบียน กรุณาเข้าสู่ระบบด้วยอีเมลและเบอร์โทรศัพท์ของคุณ
              </p>
              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <a href="login.php" class="btn btn-primary-custom btn-lg px-4 py-2">
                  <i class="fa-solid fa-right-to-bracket me-2"></i> ไปที่หน้าเข้าสู่ระบบ
                </a>
                <a href="register.html" class="btn btn-outline-secondary btn-lg px-4 py-2">
                  <i class="fa-solid fa-user-plus me-2"></i> สมัครสมาชิก
                </a>
              </div>
            </div>
          <?php endif; ?>

        </div>
      </div>
    </div>
  </main>

  <!-- ==========================================================================
       7. FOOTER
       ========================================================================== -->
  <footer class="footer mt-auto">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <h5 class="footer-heading">
            <i class="fa-solid fa-paw text-warning me-2"></i>สุนัขเลี้ยงดอทคอม
          </h5>
          <p class="small text-secondary">
            ศูนย์รวมความรู้สำหรับคนรักสุนัข แนะนำสายพันธุ์ การเลี้ยงดู และการดูแลสุขภาพอย่างถูกวิธี
          </p>
        </div>

        <div class="col-lg-4 col-md-6">
          <h5 class="footer-heading">เมนูหลัก (Navigation)</h5>
          <ul class="list-unstyled small d-flex flex-column gap-2">
            <li><a href="index.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> หน้าแรก (Home)</a></li>
            <li><a href="breeds.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> รวมสายพันธุ์ (All Breeds)</a></li>
            <li><a href="groups.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> กลุ่มสายพันธุ์ (Breed Groups)</a></li>
            <li><a href="quiz.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> ค้นหาสุนัขที่ใช่ (Dog Matcher)</a></li>
            <li><a href="care.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> การดูแลและสุขภาพ (Care & Nutrition)</a></li>
            <li><a href="contact.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> ติดต่อเรา (Contact Us)</a></li>
            <li><a href="register.html"><i class="fa-solid fa-chevron-right me-1 text-warning"></i> ลงทะเบียน (Register)</a></li>
          </ul>
        </div>

        <div class="col-lg-4 col-md-12">
          <h5 class="footer-heading">ติดต่อสอบถาม</h5>
          <p class="small text-secondary mb-2"><i class="fa-solid fa-location-dot me-2 text-warning"></i> มหาวิทยาลัยมหาสารคาม</p>
          <p class="small text-secondary mb-2"><i class="fa-solid fa-phone me-2 text-warning"></i> 02-123-4567, 089-999-8888</p>
          <p class="small text-secondary mb-3"><i class="fa-solid fa-envelope me-2 text-warning"></i> contact@msu.ac.th</p>
        </div>
      </div>

      <div class="footer-bottom text-center text-secondary">
        <p class="mb-0">© 2026 สุนัขเลี้ยงดอทคอม. All rights reserved. พัฒนาด้วย HTML, Bootstrap และ JavaScript</p>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       MODAL: เพิ่มข้อมูลสุนัข (Add Pet Modal)
       ========================================================================== -->
  <div class="modal fade" id="addPetModal" tabindex="-1" aria-labelledby="addPetModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4 shadow">
        <div class="modal-header bg-warning-subtle text-dark border-0 py-3 px-4">
          <h5 class="modal-title fw-bold" id="addPetModalLabel">
            <i class="fa-solid fa-dog text-warning me-2"></i>เพิ่มข้อมูลสุนัขตัวใหม่
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form action="add_pet.php" method="POST" class="needs-validation" novalidate>
          <div class="modal-body p-4">

            <!-- 1. ชื่อสุนัข -->
            <div class="mb-3">
              <label for="pet_name" class="form-label fw-semibold small">ชื่อสุนัข <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-tag text-muted"></i></span>
                <input type="text" class="form-control" id="pet_name" name="pet_name" placeholder="เช่น ลัคกี้, เฉาก๊วย, มิลค์" required>
                <div class="invalid-feedback">กรุณากรอกชื่อสุนัข</div>
              </div>
            </div>

            <!-- 2. สายพันธุ์ -->
            <div class="mb-3">
              <label for="breed" class="form-label fw-semibold small">สายพันธุ์ <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text"><i class="fa-solid fa-paw text-muted"></i></span>
                <input type="text" class="form-control" id="breed" name="breed" list="breedList" placeholder="พิมพ์หรือเลือกสายพันธุ์" required>
                <datalist id="breedList">
                  <option value="โกลเด้น รีทรีฟเวอร์">
                  <option value="ไซบีเรียน ฮัสกี้">
                  <option value="ปอมเมอเรเนียน">
                  <option value="ชิบะ อินุ">
                  <option value="เฟรนช์ บูลด็อก">
                  <option value="พุดเดิ้ล">
                  <option value="ชิวาวา">
                  <option value="บีเกิล">
                  <option value="ร็อตไวเลอร์">
                  <option value="เวลช์ คอร์กี้">
                  <option value="ไทยบางแก้ว">
                  <option value="ไทยหลังอาน">
                  <option value="ซามอยด์">
                  <option value="พันธุ์ผสม / อื่นๆ">
                </datalist>
                <div class="invalid-feedback">กรุณาระบุสายพันธุ์สุนัข</div>
              </div>
            </div>

            <!-- 3. เพศ -->
            <div class="mb-3">
              <label class="form-label fw-semibold small d-block mb-1">เพศสุนัข <span class="text-danger">*</span></label>
              <div class="p-2 border rounded-3 bg-light">
                <div class="form-check form-check-inline me-4">
                  <input class="form-check-input" type="radio" name="gender" id="petGenderMale" value="ผู้" checked required>
                  <label class="form-check-label" for="petGenderMale">
                    <i class="fa-solid fa-mars text-primary me-1"></i> ผู้ (Male)
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="gender" id="petGenderFemale" value="เมีย" required>
                  <label class="form-check-label" for="petGenderFemale">
                    <i class="fa-solid fa-venus text-danger me-1"></i> เมีย (Female)
                  </label>
                </div>
              </div>
            </div>

            <div class="row g-2 mb-3">
              <!-- 4. วันเกิด -->
              <div class="col-6">
                <label for="birthdate" class="form-label fw-semibold small">วันเกิดสุนัข</label>
                <input type="date" class="form-control" id="birthdate" name="birthdate">
              </div>

              <!-- 5. น้ำหนัก -->
              <div class="col-6">
                <label for="weight" class="form-label fw-semibold small">น้ำหนัก (กก.)</label>
                <div class="input-group">
                  <input type="number" step="0.1" min="0.1" max="150" class="form-control" id="weight" name="weight" placeholder="เช่น 12.5">
                  <span class="input-group-text small">กก.</span>
                </div>
              </div>
            </div>

            <!-- 6. บันทึกเพิ่มเติม / นิสัย -->
            <div class="mb-2">
              <label for="notes" class="form-label fw-semibold small">ลักษณะนิสัย / ข้อมูลสุขภาพ</label>
              <textarea class="form-control" id="notes" name="notes" rows="2" placeholder="เช่น ขี้เล่น ร่าเริง แพ้อาหารทะเล..."></textarea>
            </div>

          </div>

          <div class="modal-footer border-0 pt-0 px-4 pb-4">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">ยกเลิก</button>
            <button type="submit" class="btn btn-primary-custom px-4">
              <i class="fa-solid fa-floppy-disk me-1"></i> บันทึกข้อมูล
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>

  <!-- ==========================================================================
       8. SCRIPTS
       ========================================================================== -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

