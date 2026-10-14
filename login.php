<?php
/**
 * ============================================================================
 * หน้า Login เข้าสู่ระบบ (login.php)
 * เข้าสู่ระบบด้วย Email (Username) และ เบอร์โทรศัพท์ (Password)
 * เมื่อสำเร็จจะ Redirect ไปยังหน้า information.php
 * ============================================================================
 */
session_start();

// รวมไฟล์เชื่อมต่อฐานข้อมูล PDO
require_once __DIR__ . '/connect.php';

// หากล็อกอินอยู่แล้ว ให้ไปที่หน้า information.php ได้ทันที
if (isset($_SESSION['user_id'])) {
    header("Location: information.php");
    exit;
}

$error_message = '';
$email_input   = '';

// ตรวจสอบเมื่อมีการกดส่งฟอร์ม (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email_input = trim($_POST['email'] ?? '');
    $phone_input = trim($_POST['password'] ?? ''); // รหัสผ่านคือเบอร์โทรศัพท์ตามโจทย์

    if (empty($email_input) || empty($phone_input)) {
        $error_message = 'กรุณากรอกทั้งอีเมลและเบอร์โทรศัพท์ (รหัสผ่าน)';
    } else {
        try {
            // ตรวจสอบข้อมูลในตาราง user ด้วย Prepared Statement
            $stmt = $pdo->prepare("SELECT * FROM `user` WHERE `email` = :email AND `phone` = :phone LIMIT 1");
            $stmt->execute([
                ':email' => $email_input,
                ':phone' => $phone_input
            ]);
            $user = $stmt->fetch();

            if ($user) {
                // บันทึกข้อมูลลง Session เมื่อเข้าสู่ระบบสำเร็จ
                $_SESSION['user_id']       = $user['id'];
                $_SESSION['user_fullname'] = $user['fullname'];
                $_SESSION['login_success'] = 'ยินดีต้อนรับเข้าสู่ระบบสำเร็จ!';

                // ย้ายไปยังหน้าแสดงข้อมูล
                header("Location: information.php");
                exit;
            } else {
                $error_message = 'อีเมลหรือเบอร์โทรศัพท์ (รหัสผ่าน) ไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง';
            }
        } catch (PDOException $e) {
            $error_message = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
  <!-- ==========================================================================
       META TAGS & TITLE
       ========================================================================== -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เข้าสู่ระบบ (Login) - สุนัขเลี้ยงดอทคอม</title>

  <!-- ==========================================================================
       EXTERNAL CSS & FONTS (Bootstrap 5, Font Awesome, Custom CSS)
       ========================================================================== -->
  <!-- Bootstrap 5 CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome 6 Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="css/style.css">

  <style>
    .login-card {
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 8px 15px -6px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }
    .input-group-text {
      background-color: #f8fafc;
      border-color: #dee2e6;
      color: #64748b;
    }
    .form-control:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 0.25rem rgba(245, 158, 11, 0.15);
    }
    .btn-toggle-pwd {
      cursor: pointer;
      border-left: 0;
    }
  </style>
</head>
<body class="d-flex flex-column min-vh-100">

  <!-- ==========================================================================
       NAVIGATION BAR
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
          <li class="nav-item">
            <a class="nav-link active text-warning fw-semibold" aria-current="page" href="login.php">
              <i class="fa-solid fa-right-to-bracket me-1"></i> เข้าสู่ระบบ
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- ==========================================================================
       HEADER BANNER
       ========================================================================== -->
  <header class="page-header-banner">
    <div class="container text-center">
      <span class="badge bg-warning text-dark rounded-pill mb-2">
        <i class="fa-solid fa-lock me-1"></i> Member Login
      </span>
      <h1 class="fw-bold mb-2">เข้าสู่ระบบสมาชิก</h1>
      <p class="text-secondary mb-0">ยินดีต้อนรับกลับสู่ระบบ กรุณาใช้อีเมลและเบอร์โทรศัพท์ของคุณเพื่อเข้าสู่ระบบ</p>
    </div>
  </header>

  <!-- ==========================================================================
       LOGIN FORM SECTION
       ========================================================================== -->
  <main class="py-5 flex-grow-1">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">

          <!-- แจ้งเตือนข้อผิดพลาด (ถ้ามี) -->
          <?php if (!empty($error_message)): ?>
            <div class="alert alert-danger alert-dismissible fade show shadow-sm rounded-3 mb-4" role="alert">
              <div class="d-flex align-items-center">
                <i class="fa-solid fa-circle-exclamation fs-4 me-3 text-danger"></i>
                <div>
                  <strong>เข้าสู่ระบบไม่สำเร็จ!</strong><br>
                  <span class="small"><?= htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8') ?></span>
                </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          <?php endif; ?>

          <!-- กล่องฟอร์ม Login -->
          <div class="login-card">
            <div class="card-body p-4 p-md-5">

              <!-- ไอคอนหัวฟอร์ม -->
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-circle mb-3" style="width: 70px; height: 70px;">
                  <i class="fa-solid fa-shield-cat fs-2"></i>
                </div>
                <h4 class="fw-bold text-dark mb-1">ลงชื่อเข้าใช้งาน</h4>
                <p class="text-muted small">ระบบแสดงข้อมูลสมาชิก DogPetDotCom</p>
              </div>

              <form action="login.php" method="POST" class="needs-validation" novalidate>

                <!-- 1. ช่อง Username (อีเมล) -->
                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold small">
                    <i class="fa-solid fa-envelope text-secondary me-1"></i> อีเมลผู้ใช้งาน (Username) <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-at"></i></span>
                    <input 
                      type="email" 
                      class="form-control form-control-lg fs-6" 
                      id="email" 
                      name="email" 
                      placeholder="เช่น somchai@example.com" 
                      value="<?= htmlspecialchars($email_input, ENT_QUOTES, 'UTF-8') ?>" 
                      required
                    >
                    <div class="invalid-feedback">กรุณากรอกอีเมลที่ใช้ลงทะเบียน</div>
                  </div>
                </div>

                <!-- 2. ช่อง Password (เบอร์โทรศัพท์) -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label for="password" class="form-label fw-semibold small mb-0">
                      <i class="fa-solid fa-key text-secondary me-1"></i> รหัสผ่าน (เบอร์โทรศัพท์) <span class="text-danger">*</span>
                    </label>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                    <input 
                      type="password" 
                      class="form-control form-control-lg fs-6" 
                      id="password" 
                      name="password" 
                      placeholder="กรอกเบอร์โทรที่ใช้สมัคร (เช่น 0812345678)" 
                      required
                    >
                    <button class="btn btn-outline-secondary btn-toggle-pwd" type="button" id="togglePassword" title="แสดง/ซ่อนรหัสผ่าน">
                      <i class="fa-regular fa-eye" id="eyeIcon"></i>
                    </button>
                    <div class="invalid-feedback">กรุณากรอกรหัสผ่าน (เบอร์โทรศัพท์)</div>
                  </div>
                  <div class="form-text small text-muted">
                    <i class="fa-solid fa-circle-info me-1"></i> รหัสผ่านคือเบอร์โทรศัพท์ที่ระบุไว้ตอนลงทะเบียน
                  </div>
                </div>

                <!-- ปุ่ม Submit -->
                <div class="d-grid gap-2 mb-4">
                  <button type="submit" class="btn btn-primary-custom btn-lg fs-6 py-3 fw-bold">
                    <i class="fa-solid fa-right-to-bracket me-2"></i> เข้าสู่ระบบ
                  </button>
                </div>

                <!-- ลิงก์สมัครสมาชิก -->
                <div class="text-center pt-3 border-top">
                  <p class="text-muted small mb-0">
                    ยังไม่มีบัญชีสมาชิก? 
                    <a href="register.html" class="text-warning fw-bold text-decoration-none ms-1">
                      ลงทะเบียนที่นี่ <i class="fa-solid fa-arrow-right small"></i>
                    </a>
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  </main>

  <!-- ==========================================================================
       FOOTER
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
       SCRIPTS (Bootstrap & Show/Hide Password)
       ========================================================================== -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // สคริปต์เปิด/ปิดการมองเห็นรหัสผ่าน
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
    });

    // ตรวจสอบความถูกต้องของแบบฟอร์มก่อนส่ง
    (() => {
      'use strict';
      const forms = document.querySelectorAll('.needs-validation');
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    })();
  </script>
</body>
</html>

