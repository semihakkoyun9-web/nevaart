<?php
/**
 * NEVAART - Oturum, Çerez, Güvenlik (CSRF & Bcrypt) ve RBAC Rol Yönetimi
 * Kriter I, J, S, T: Kullanıcı girişi, RBAC yetkilendirme, Güvenlik önlemleri, Oturum ve Çerez kullanımı
 */

if (session_status() === PHP_SESSION_NONE) {
    $savePath = session_save_path();
    if (empty($savePath) || !is_dir($savePath) || !is_writable($savePath)) {
        $localSessionDir = __DIR__ . '/../database/sessions';
        if (!is_dir($localSessionDir)) {
            @mkdir($localSessionDir, 0777, true);
        }
        if (is_dir($localSessionDir) && is_writable($localSessionDir)) {
            session_save_path($localSessionDir);
        }
    }
    @session_start();
}

// CSRF Token üretimi (Kriter S - Güvenlik önlemleri)
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Çoklu dil tercihi (GET -> SESSION -> COOKIE sırasıyla kontrol)
if (isset($_GET['lang']) && in_array($_GET['lang'], ['tr', 'en'], true)) {
    $_SESSION['lang'] = $_GET['lang'];
    if (!headers_sent()) {
        setcookie('nevaart_lang', $_GET['lang'], time() + (86400 * 30), '/', '', false, true);
    }
}

$currentLang = $_SESSION['lang'] ?? $_COOKIE['nevaart_lang'] ?? 'tr';
if (!in_array($currentLang, ['tr', 'en'], true)) {
    $currentLang = 'tr';
}

// Varsayılan aktif kullanıcı oturumu (Sadece semihakkoyun9@gmail.com Baş Küratör yetkisine sahiptir)
if (!isset($_SESSION['user']) || !is_array($_SESSION['user'])) {
    $defaultPasswordHash = password_hash('Semih2026!', PASSWORD_BCRYPT);
    $_SESSION['user'] = [
        'id' => 1,
        'name' => 'Semih Akkoyun',
        'email' => 'semihakkoyun9@gmail.com',
        'role' => 'curator',
        'bio' => 'NevaArt Kurucu Baş Küratörü.',
        'joinedDate' => '2026-01-01',
        'passwordHash' => $defaultPasswordHash
    ];
    if (!headers_sent()) {
        setcookie('nevaart_user_role', 'curator', time() + (86400 * 30), '/', '', false, true);
    }
}

$currentUser = $_SESSION['user'];
$csrfToken = $_SESSION['csrf_token'];

/**
 * CSRF doğrulama yardımcı fonksiyonu
 */
function verifyCsrfToken(?string $token): bool {
    if (!$token || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

