<?php
/**
 * ====================================================================
 * NEVAART - KÜRESEL GÖRSEL SANATLAR VE DİJİTAL KÜRATÖRLÜK ANSİKLOPEDİSİ
 * Bandırma Onyedi Eylül Üniversitesi · Gönen Meslek Yüksekokulu
 * İnternet Programcılığı II — Dr. Ahmet Akkaya
 * 
 * %100 Yerel PHP 8.2+ Mimarisi (UI Tasarımı Birebir Korunmuştur)
 * Dosya Yolu: C:\xampp\htdocs\internet2\index.php
 * ====================================================================
 */

require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/i18n.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/color_extractor.php';

// Aktif dil sözlüğü ve veritabanı/JSON koleksiyonları
$t = $translations[$currentLang];
$artworks = $db->getArtworks();
$categories = $db->getCategories();
$reviews = $db->getReviews();
$venues = $db->getVenues();
$initialSlug = isset($_GET['eser']) ? trim((string)$_GET['eser']) : null;
$flashToast = getFlashNotification();
?>
<!doctype html>
<html lang="<?= e($currentLang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEVAART - <?= e($t['brandSubtitle']) ?></title>
    <meta name="description" content="Lüks, minimalist ve akışkan dairesel animasyonlara sahip dijital sanatlar, sokak fotoğrafçılığı ve mimari küratörlük ansiklopedisi." />
    <meta property="og:title" content="NEVAART - <?= e($t['brandSubtitle']) ?>" />
    <meta property="og:description" content="Lüks, minimalist ve akışkan dairesel animasyonlara sahip dijital sanatlar, sokak fotoğrafçılığı ve mimari küratörlük ansiklopedisi." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Derlenmiş Orijinal Tailwind CSS v4 Paketi (Birebir aynı tasarım) -->
    <link rel="stylesheet" href="assets/css/tailwind.css" />
  </head>
  <body class="bg-[#FAF8F5] text-[#1C1917] antialiased selection:bg-[#E8E2D9] selection:text-[#1C1917]">
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white">
      
      <!-- Canlı Toast Bildirimi -->
      <div id="neva-toast" class="<?= $flashToast ? '' : 'hidden' ?> fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-stone-800">
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span id="neva-toast-text"><?= e($flashToast ?? '') ?></span>
      </div>

      <!-- 0. Üst Navigasyon Çubuğu (Header) -->
      <?php require __DIR__ . '/partials/header.php'; ?>

      <!-- Ana İçerik Alanı -->
      <main class="flex-1">
        <!-- 1. Hero: "SANATLA BİR YOLCULUK" + 3D Panoramik Sergi Duvarı -->
        <?php require __DIR__ . '/partials/hero_carousel.php'; ?>

        <!-- 2. Koyu Tema Seçkisi: "BİNLERCE KELİMEYİ ANLATAN BAŞYAPITLAR" -->
        <?php require __DIR__ . '/partials/curated_dark.php'; ?>

        <!-- 3. İkili Aksiyon Bannerları ve 4 Galeri Rozeti -->
        <?php require __DIR__ . '/partials/feature_banners.php'; ?>

        <!-- 4. Eser Kataloğu Grid ve Canlı Filtreler -->
        <?php require __DIR__ . '/partials/artwork_grid.php'; ?>

        <!-- 5. Topluluk Deneyimleri (Testimonials) -->
        <?php require __DIR__ . '/partials/testimonials.php'; ?>

        <!-- 6. Akademik Kürasyon ve Envanter Analitiği (PHP Dinamik Raporlama) -->
        <?php require __DIR__ . '/partials/analytics.php'; ?>
      </main>

      <!-- 7. Koyu Alt Bilgi (Footer) -->
      <?php require __DIR__ . '/partials/footer.php'; ?>

      <!-- 8. Tüm Modallar (Eser Detay, PHP GD Yükleme, Google Maps Sergi Haritası, RBAC Kimlik) -->
      <?php require __DIR__ . '/partials/modals.php'; ?>

    </div>

    <!-- PHP'den JavaScript Motoruna Aktarılan Başlangıç Verisi (JSON) -->
    <script>
      window.NEVA_INITIAL_STATE = <?= json_encode([
          'lang' => $currentLang,
          'artworks' => $artworks,
          'categories' => $categories,
          'reviews' => $reviews,
          'venues' => $venues,
          'currentUser' => $currentUser,
          'initialSlug' => $initialSlug
      ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
    </script>
    <script src="assets/js/app.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        NevaApp.init(window.NEVA_INITIAL_STATE);
      });
    </script>
  </body>
</html>
