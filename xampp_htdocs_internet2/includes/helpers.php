<?php
/**
 * NEVAART - Yardımcı PHP Fonksiyonları (XSS Koruması, SEO Slug, Formatlama)
 * Kriter S (Güvenlik) & Kriter X (SEO Dostu URL yapısı)
 */

/**
 * Güvenli HTML çıktısı (XSS önleme - Kriter S)
 */
function e(?string $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * SEO Dostu URL Slug Üretici (Kriter X)
 */
function createSeoSlug(string $text): string {
    $trMap = [
        'ç' => 'c', 'Ç' => 'c',
        'ğ' => 'g', 'Ğ' => 'g',
        'ı' => 'i', 'I' => 'i', 'İ' => 'i',
        'ö' => 'o', 'Ö' => 'o',
        'ş' => 's', 'Ş' => 's',
        'ü' => 'u', 'Ü' => 'u',
        'â' => 'a', 'å' => 'a', 'ä' => 'a', 'é' => 'e', 'ō' => 'o', 'ū' => 'u'
    ];
    $text = strtr($text, $trMap);
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim($text, '-');
    return ($text ?: 'eser') . '-' . random_int(10, 99);
}

/**
 * Flash Bildirim (Toast) Mesajı Ayarlama
 */
function setFlashNotification(string $message): void {
    $_SESSION['flash_notification'] = $message;
}

/**
 * Flash Bildirim (Toast) Mesajını Okuma ve Temizleme
 */
function getFlashNotification(): ?string {
    if (!empty($_SESSION['flash_notification'])) {
        $msg = $_SESSION['flash_notification'];
        unset($_SESSION['flash_notification']);
        return $msg;
    }
    return null;
}

