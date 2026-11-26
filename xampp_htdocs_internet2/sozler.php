<?php
/**
 * NEVAART - Sanat Tarihçileri ve Ustalardan Ölümsüz Sözler Sayfası (PHP)
 */
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/i18n.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/icons.php';
require_once __DIR__ . '/data/art_quotes.php';

$t = $translations[$currentLang];
$era = $_GET['era'] ?? 'all';
$q = trim((string)($_GET['q'] ?? ''));

$filteredQuotes = array_filter($artQuotes, function ($item) use ($era, $q) {
    if ($era !== 'all' && $item['era'] !== $era) return false;
    if ($q !== '') {
        $blob = mb_strtolower($item['name'] . ' ' . $item['commentTr'] . ' ' . $item['commentEn'] . ' ' . $item['source'], 'UTF-8');
        if (mb_strpos($blob, mb_strtolower($q, 'UTF-8')) === false) return false;
    }
    return true;
});
?>
<!doctype html>
<html lang="<?= e($currentLang) ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEVAART — <?= $currentLang === 'tr' ? 'Sanat Tarihçileri ve Ustalardan Sözler' : 'Art Historians & Masters Quotes' ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/tailwind.css" />
</head>
<body class="bg-[#FAFAFA] text-[#111111] min-h-screen">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-stone-200 mb-10">
      <div>
        <a href="index.php" class="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-black mb-4">
          ← <?= $currentLang === 'tr' ? 'Dijital Müzeye Dön' : 'Back to Digital Museum' ?>
        </a>
        <div class="flex items-center gap-2 mb-2">
          <span class="w-5 h-px bg-amber-700"></span>
          <span class="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-mono font-semibold">
            <?= $currentLang === 'tr' ? 'DOĞRULANMIŞ SANAT TARİHİ MANİFESTOLARI' : 'VERIFIED ART HISTORY ARCHIVE' ?>
          </span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
          <?= $currentLang === 'tr' ? 'SANAT TARİHÇİLERİ VE USTALARDAN <span class="font-light text-stone-600">ÖLÜMSÜZ SÖZLER</span>' : 'TIMELESS QUOTES FROM <span class="font-light text-stone-600">ART MASTERS</span>' ?>
        </h1>
      </div>
      <div class="text-xs font-mono text-stone-500">
        <span class="text-black font-bold text-lg"><?= count($filteredQuotes) ?></span> <?= $currentLang === 'tr' ? 'doğrulanmış alıntı' : 'verified quotes' ?>
      </div>
    </div>

    <form method="get" class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10">
      <div class="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-2xl sm:rounded-full border border-stone-200">
        <?php
        $tabs = [
            'all' => $currentLang === 'tr' ? 'Tümü (' . count($artQuotes) . ')' : 'All (' . count($artQuotes) . ')',
            'historians' => $currentLang === 'tr' ? 'Sanat Tarihçileri' : 'Art Historians',
            'impressionism' => $currentLang === 'tr' ? 'Empresyonizm & Ukiyo-e' : 'Impressionism & Ukiyo-e',
            'renaissance' => $currentLang === 'tr' ? 'Rönesans & Barok' : 'Renaissance & Baroque',
            'modern' => $currentLang === 'tr' ? 'Modern Ustalar' : 'Modern Masters'
        ];
        foreach ($tabs as $key => $label):
        ?>
          <a href="?era=<?= e($key) ?>&q=<?= urlencode($q) ?>" class="px-4 py-1.5 text-xs font-medium rounded-full transition-all <?= $era === $key ? 'bg-black text-white shadow-xs font-semibold' : 'text-stone-700 hover:text-black hover:bg-stone-200/60' ?>">
            <?= e($label) ?>
          </a>
        <?php endforeach; ?>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
        <input type="hidden" name="era" value="<?= e($era) ?>" />
        <input type="text" name="q" value="<?= e($q) ?>" placeholder="<?= $currentLang === 'tr' ? 'Sanatçı veya söz ara...' : 'Search artist or quote...' ?>" class="w-full sm:w-auto sm:min-w-[240px] px-4 py-2 bg-white border border-stone-200 focus:border-black rounded-full text-xs outline-none shadow-xs" />
        <button type="submit" class="px-5 py-2 bg-black text-white text-xs font-semibold rounded-full cursor-pointer">Ara</button>
      </div>
    </form>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php foreach ($filteredQuotes as $item): ?>
        <article class="bg-white border border-stone-200 hover:border-black rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="font-serif text-2xl text-amber-700 leading-none">&ldquo;</span>
              <span class="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                <?= e($item['source']) ?> · <?= e($item['year']) ?>
              </span>
            </div>
            <p class="text-stone-800 text-sm leading-relaxed italic font-serif">
              &ldquo;<?= e($currentLang === 'tr' ? $item['commentTr'] : $item['commentEn']) ?>&rdquo;
            </p>
          </div>
          <div class="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-sm flex items-center justify-center shrink-0">
              <?= e($item['initials']) ?>
            </div>
            <div>
              <h3 class="font-display font-bold text-xs uppercase tracking-wider text-black"><?= e($item['name']) ?></h3>
              <p class="text-[11px] text-stone-500"><?= e($currentLang === 'tr' ? $item['roleTr'] : $item['roleEn']) ?></p>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</body>
</html>
