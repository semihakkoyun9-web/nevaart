<?php
/**
 * NEVAART - Gelişmiş Kategori & Gerçek Renk Yoğunluğu Keşif Sayfası (PHP)
 * Seçilen rengin piksel yoğunluğu en yüksek olan eserleri matematiksel HSL/RGB skorlamasıyla en üstte sıralar.
 */
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/i18n.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/includes/color_extractor.php';

$artworks = $db->getArtworks();
$categories = $db->getCategories();

$colorFamilies = [
    ['id' => 'all',   'nameTr' => 'Tüm Spektrum',       'nameEn' => 'All Spectrum',        'dot' => '#D6CEBE'],
    ['id' => 'blue',  'nameTr' => 'Prusya & Kobalt',    'nameEn' => 'Prussian & Cobalt',   'dot' => '#204E8A'],
    ['id' => 'red',   'nameTr' => 'Vermilion & Kızıl',  'nameEn' => 'Vermilion & Crimson', 'dot' => '#AF3026'],
    ['id' => 'gold',  'nameTr' => 'Altın & Okre Sarı',  'nameEn' => 'Gold & Ochre',        'dot' => '#D4A53A'],
    ['id' => 'green', 'nameTr' => 'Zümrüt & Doğa',      'nameEn' => 'Emerald & Nature',    'dot' => '#3A7044'],
    ['id' => 'earth', 'nameTr' => 'Toprak & Sienna',    'nameEn' => 'Earth & Sienna',      'dot' => '#7A4E30'],
    ['id' => 'dark',  'nameTr' => 'Kömür & Chiaroscuro','nameEn' => 'Charcoal & Noir',     'dot' => '#181818'],
    ['id' => 'light', 'nameTr' => 'Alabaster & Işık',   'nameEn' => 'Alabaster & Light',   'dot' => '#EAE6DE'],
];

function computeColorDensityPhp(array $art, string $familyId): int {
    if ($familyId === 'all') return 100;
    $score = 0.0;
    foreach ($art['colorPalette'] as $sw) {
        $rgb = $sw['rgb'] ?? [0, 0, 0];
        $r = (int)$rgb[0]; $g = (int)$rgb[1]; $b = (int)$rgb[2];
        $hsl = rgbToHslPhp($r, $g, $b);
        $h = $hsl['h']; $s = $hsl['s']; $l = $hsl['l'];
        $w = 0.0;
        if ($familyId === 'blue') {
            if ($h >= 185 && $h <= 265 && $s >= 14 && $l >= 10 && $l <= 85) $w = 0.55 + 0.45 * min(1.0, $s / 40.0);
            elseif ($b > $r + 18 && $b > $g + 5) $w = 0.5;
        } elseif ($familyId === 'red') {
            if (($h <= 22 || $h >= 335) && $s >= 22 && $l >= 12 && $l <= 75 && $r > $g + 22) $w = 0.6 + 0.4 * min(1.0, $s / 50.0);
        } elseif ($familyId === 'gold') {
            if ($h >= 30 && $h <= 66 && $s >= 24 && $l >= 28 && $l <= 82) $w = 0.6 + 0.4 * min(1.0, $s / 50.0);
        } elseif ($familyId === 'green') {
            if ($h >= 68 && $h <= 172 && $s >= 14 && $l >= 12 && $l <= 78) $w = 0.6 + 0.4 * min(1.0, $s / 45.0);
        } elseif ($familyId === 'earth') {
            if ($h >= 15 && $h <= 45 && $s >= 14 && $s <= 65 && $l >= 16 && $l <= 55) $w = 0.65 + 0.35 * (1.0 - abs($l - 34) / 30.0);
        } elseif ($familyId === 'dark') {
            if ($l <= 26) $w = 0.6 + 0.4 * (1.0 - $l / 26.0);
        } elseif ($familyId === 'light') {
            if ($l >= 68) $w = 0.55 + 0.45 * min(1.0, ($l - 68) / 28.0);
        }
        if ($w > 0) $score += ((int)$sw['percentage']) * $w;
    }
    return min(100, (int)round($score));
}

$selCat = $_GET['cat'] ?? 'all';
$selColor = $_GET['color'] ?? 'all';
$selCentury = $_GET['century'] ?? 'all';
$q = trim((string)($_GET['q'] ?? ''));

$ranked = [];
foreach ($artworks as $art) {
    if ($selCat !== 'all' && $art['category'] !== $selCat) continue;
    $density = computeColorDensityPhp($art, $selColor);
    if ($selColor !== 'all' && $density < 8) continue;
    if ($selCentury === 'pre1700' && (int)$art['year'] >= 1700) continue;
    if ($selCentury === '1700s' && ((int)$art['year'] < 1700 || (int)$art['year'] >= 1800)) continue;
    if ($selCentury === '1800s' && ((int)$art['year'] < 1800 || (int)$art['year'] >= 1900)) continue;
    if ($selCentury === '1900s' && (int)$art['year'] < 1900) continue;
    if ($q !== '') {
        $blob = mb_strtolower($art['title'] . ' ' . $art['artist'] . ' ' . $art['accessionNumber'], 'UTF-8');
        if (mb_strpos($blob, mb_strtolower($q, 'UTF-8')) === false) continue;
    }
    $ranked[] = ['art' => $art, 'density' => $density];
}

usort($ranked, fn($a, $b) => $b['density'] <=> $a['density'] ?: $a['art']['id'] <=> $b['art']['id']);
?>
<!doctype html>
<html lang="<?= e($currentLang) ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEVAART — <?= $currentLang === 'tr' ? 'Kategoriler & Renk Yoğunluğu Keşfi' : 'Categories & Color Density' ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/tailwind.css" />
</head>
<body class="bg-[#FAFAFA] text-[#111111] min-h-screen">
  <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-stone-200 mb-8">
      <div>
        <a href="index.php" class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-black mb-4">
          ← <?= $currentLang === 'tr' ? 'Ana Galeriye Dön' : 'Back to Gallery' ?>
        </a>
        <h1 class="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight">
          KATEGORİLER &amp; <span class="font-light text-stone-600">RENK YOĞUNLUĞU</span>
        </h1>
        <p class="text-xs sm:text-sm text-stone-500 mt-2">
          Bir renk veya kategori seçtiğinizde o rengin piksel yoğunluğu en yüksek olan başyapıtlar otomatik olarak en üstte sıralanır.
        </p>
      </div>
      <div class="text-xs font-mono text-stone-500">
        <span class="text-black font-bold text-xl"><?= count($ranked) ?></span> eşleşen başyapıt
      </div>
    </div>

    <!-- Color Spectrum Buttons -->
    <div class="bg-white border border-stone-200 rounded-2xl p-6 mb-8 shadow-xs space-y-4">
      <div class="flex flex-wrap gap-2">
        <?php foreach ($colorFamilies as $cf): ?>
          <a
            href="?cat=<?= e($selCat) ?>&color=<?= e($cf['id']) ?>&century=<?= e($selCentury) ?>&q=<?= urlencode($q) ?>"
            class="px-3.5 py-2 rounded-full text-xs flex items-center gap-2 border transition-all <?= $selColor === $cf['id'] ? 'bg-black text-white border-black font-semibold' : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-500' ?>"
          >
            <span class="w-3.5 h-3.5 rounded-full border border-black/20" style="background-color: <?= e($cf['dot']) ?>;"></span>
            <span><?= e($currentLang === 'tr' ? $cf['nameTr'] : $cf['nameEn']) ?></span>
          </a>
        <?php endforeach; ?>
      </div>

      <div class="flex flex-wrap gap-2 pt-3 border-t border-stone-100">
        <a href="?cat=all&color=<?= e($selColor) ?>&century=<?= e($selCentury) ?>" class="px-3.5 py-1.5 rounded-full text-xs <?= $selCat === 'all' ? 'bg-black text-white font-semibold' : 'bg-stone-100 text-stone-700' ?>">Tüm Kategoriler</a>
        <?php foreach ($categories as $cat): ?>
          <a href="?cat=<?= e($cat['id']) ?>&color=<?= e($selColor) ?>&century=<?= e($selCentury) ?>" class="px-3.5 py-1.5 rounded-full text-xs <?= $selCat === $cat['id'] ? 'bg-black text-white font-semibold' : 'bg-stone-100 text-stone-700' ?>">
            <?= e($currentLang === 'tr' ? $cat['nameTr'] : $cat['nameEn']) ?>
          </a>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Ranked Artworks Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      <?php foreach ($ranked as $idx => $entry): $art = $entry['art']; ?>
        <a href="index.php?eser=<?= e($art['slug']) ?>" class="group bg-white border border-stone-200 hover:border-black rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl">
          <div class="aspect-4/3 w-full bg-[#F4EFEB] relative overflow-hidden">
            <img src="<?= e($art['imageUrl']) ?>" alt="<?= e($art['title']) ?>" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <?php if ($selColor !== 'all'): ?>
              <span class="absolute top-3 left-3 bg-black/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full">
                #<?= $idx + 1 ?> · %<?= (int)$entry['density'] ?> Yoğunluk
              </span>
            <?php endif; ?>
            <div class="absolute bottom-0 left-0 right-0 h-1.5 flex">
              <?php foreach (array_slice($art['colorPalette'], 0, 5) as $c): ?>
                <div style="background-color: <?= e($c['hex']) ?>; width: <?= (int)$c['percentage'] ?>%;" class="h-full"></div>
              <?php endforeach; ?>
            </div>
          </div>
          <div class="p-5">
            <div class="text-[10px] font-mono text-stone-400 uppercase"><?= e($art['accessionNumber']) ?> · <?= (int)$art['year'] ?></div>
            <h3 class="font-serif text-lg font-bold text-stone-900 mt-1"><?= e($art['title']) ?></h3>
            <p class="text-xs text-stone-600 mt-0.5"><?= e($art['artist']) ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</body>
</html>
