<?php
/**
 * NEVAART - Yüzen Cam Efektli Pill Üst Bar + Mobil Alt İkon Barı (Header)
 */
$userRole = $currentUser['role'] ?? 'visitor';
$roleLabel = $userRole === 'curator'
    ? $t['roleCurator']
    : ($userRole === 'member' ? $t['roleMember'] : $t['roleVisitor']);
$nextLang = $currentLang === 'tr' ? 'en' : 'tr';
$currentScript = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');

// Mücevher çerçeveli rol halkası: Baş Küratör = Yakut Kırmızı, Kayıtlı Sanatçı = Altın Amber, Ziyaretçi = Zümrüt Yeşil
$profileOuterBezel = $userRole === 'curator'
    ? 'bg-gradient-to-tr from-red-700 via-rose-500 to-amber-400 shadow-[0_0_16px_rgba(220,38,38,0.4)]'
    : ($userRole === 'member'
        ? 'bg-gradient-to-tr from-amber-600 via-[#C59B5F] to-yellow-300 shadow-[0_0_14px_rgba(197,155,95,0.35)]'
        : 'bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_14px_rgba(16,185,129,0.32)]');
$profileInnerMedallion = $userRole === 'curator'
    ? 'bg-[#161415] text-rose-200 group-hover:bg-[#1f1719]'
    : ($userRole === 'member'
        ? 'bg-[#FAF8F5] text-amber-800 group-hover:bg-white'
        : 'bg-[#FAF8F5] text-emerald-700 group-hover:bg-white');
$profileTooltip = ($currentUser['name'] ?? 'Ziyaretçi') . ' · ' . $roleLabel;

$phpNav = [
    ['href' => 'index.php', 'script' => 'index.php', 'icon' => 'compass', 'tr' => 'Keşfet', 'en' => 'Explore'],
    ['href' => 'kategoriler.php', 'script' => 'kategoriler.php', 'icon' => 'layout-grid', 'tr' => 'Koleksiyon', 'en' => 'Collection'],
    ['href' => 'sozler.php', 'script' => 'sozler.php', 'icon' => 'quote', 'tr' => 'Sözler', 'en' => 'Quotes'],
];
?>
<!-- TOP FLOATING GLASS PILL BAR -->
<header class="fixed top-2.5 sm:top-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
  <div class="pointer-events-auto max-w-6xl mx-auto rounded-full bg-white/58 backdrop-blur-2xl backdrop-saturate-150 border border-white/65 shadow-[0_12px_38px_-10px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300">
    <div class="px-3.5 sm:px-5 h-14 sm:h-[62px] flex items-center justify-between gap-2 sm:gap-3">

      <!-- Left: Bespoke Museum Crest & Wordmark -->
      <a href="index.php" class="shrink-0 flex items-center gap-2.5 group cursor-pointer">
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-[1.03]" aria-hidden="true">
          <rect x="1" y="1" width="42" height="42" rx="4" fill="#111113" stroke="#C59B5F" stroke-width="1.2" stroke-opacity="0.45"/>
          <rect x="5" y="5" width="34" height="34" rx="2" stroke="#C59B5F" stroke-width="0.75" stroke-opacity="0.45"/>
          <path d="M11 33V20C11 13.9249 15.9249 9 22 9C28.0751 9 33 13.9249 33 20V33" stroke="#C59B5F" stroke-width="1" stroke-opacity="0.55"/>
          <path d="M15.5 31V15.5L28.5 31V15.5" stroke="#FAF8F5" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.5 16.5C19.5 20.5 24.5 26.5 28.5 30" stroke="#C59B5F" stroke-width="2.3" stroke-linecap="round"/>
          <circle cx="22" cy="13.5" r="1.4" fill="#C59B5F"/>
        </svg>
        <div class="flex flex-col">
          <span class="font-serif text-[18px] sm:text-[20px] font-semibold tracking-[0.14em] text-[#111113] leading-none uppercase">
            NevaArt
          </span>
          <span class="hidden xl:block text-[8px] uppercase tracking-[0.24em] font-mono text-stone-600 font-medium mt-1 whitespace-nowrap leading-none">
            <?= $currentLang === 'tr' ? 'Dijital Sanat Müzesi' : 'Digital Art Museum' ?>
          </span>
        </div>
      </a>

      <!-- Center: Integrated Animated Glass Navigation (Desktop Only) -->
      <nav aria-label="<?= $currentLang === 'tr' ? 'Ana Müze Navigasyonu' : 'Primary Museum Navigation' ?>" class="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
        <?php foreach ($phpNav as $nav):
            $isAct = $currentScript === $nav['script'];
        ?>
          <a href="<?= e($nav['href']) ?>" class="group relative px-3.5 py-2 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-300 whitespace-nowrap <?= $isAct ? 'bg-[#111113] text-white shadow-sm' : 'text-stone-800 hover:text-[#111113] hover:bg-white/75' ?>">
            <span class="transition-transform duration-300 group-hover:-translate-y-0.5 <?= $isAct ? 'text-[#E3C289]' : 'text-stone-600 group-hover:text-[#9A7137]' ?>"><?= icon($nav['icon'], 'w-3.5 h-3.5') ?></span>
            <span class="transition-transform duration-300 group-hover:-translate-y-0.5"><?= $currentLang === 'tr' ? $nav['tr'] : $nav['en'] ?></span>
            <?php if (!$isAct): ?>
              <span class="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-[#C59B5F] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            <?php endif; ?>
          </a>
        <?php endforeach; ?>

        <button type="button" onclick="NevaApp.openModal('map-modal')" class="group relative px-3.5 py-2 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-stone-800 hover:text-[#111113] hover:bg-white/75 transition-all duration-300 cursor-pointer whitespace-nowrap">
          <span class="text-[#9A7137] transition-transform duration-300 group-hover:-translate-y-0.5"><?= icon('map-pin', 'w-3.5 h-3.5') ?></span>
          <span class="transition-transform duration-300 group-hover:-translate-y-0.5"><?= $currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map' ?></span>
          <span class="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-[#C59B5F] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
        </button>
      </nav>

      <!-- Right: Heart · Single Lang Toggle · Circular "+" · Role-Ring Profile -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          type="button"
          id="header-fav-btn"
          onclick="NevaApp.openFavorites()"
          aria-label="<?= $currentLang === 'tr' ? 'Beğenilenler' : 'Favorites' ?>"
          class="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-800 hover:text-[#111113] hover:bg-white/75 transition-colors cursor-pointer"
        >
          <span id="header-fav-icon"><?= icon('heart', 'w-[17px] h-[17px]') ?></span>
          <span id="header-fav-count" class="hidden absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">0</span>
        </button>

        <!-- Single-Code Language Toggle (TR or EN) -->
        <a
          href="?lang=<?= e($nextLang) ?>"
          aria-label="<?= $currentLang === 'tr' ? 'Switch to English' : 'Türkçeye Geç' ?>"
          title="<?= $currentLang === 'tr' ? 'İngilizceye Geç (EN)' : 'Switch to Turkish (TR)' ?>"
          class="w-9 h-9 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-stone-900 bg-white/55 hover:bg-white/85 border border-white/70 flex items-center justify-center transition-all duration-200 shadow-2xs"
        >
          <?= e(strtoupper($currentLang)) ?>
        </a>

        <span class="hidden sm:block w-px h-5 bg-stone-400/40"></span>

        <!-- Prominent Circular Black "+" Submit Button -->
        <button
          type="button"
          onclick="NevaApp.openModal('upload-modal')"
          aria-label="<?= $currentLang === 'tr' ? 'Eser Gönder' : 'Submit Artwork' ?>"
          title="<?= $currentLang === 'tr' ? 'Eser Gönder' : 'Submit Artwork' ?>"
          class="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full bg-[#111113] hover:bg-stone-800 text-white border border-[#C59B5F]/65 hover:border-[#C59B5F] shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0 group"
        >
          <?= icon('plus', 'w-4 h-4 sm:w-[18px] sm:h-[18px] text-white group-hover:rotate-90 transition-transform duration-300') ?>
        </button>

        <!-- Far-Right Circular Profile Button with Luxury Gradient Role Bezel -->
        <button
          type="button"
          onclick="NevaApp.openModal('auth-modal')"
          aria-label="<?= e($profileTooltip) ?>"
          title="<?= e($profileTooltip) ?>"
          class="group relative p-[2.5px] rounded-full transition-all duration-250 hover:scale-105 active:scale-95 cursor-pointer shrink-0 <?= $profileOuterBezel ?>"
        >
          <span class="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center border border-white/85 transition-colors <?= $profileInnerMedallion ?>">
            <?= icon('user', 'w-4 h-4 sm:w-[17px] sm:h-[17px]') ?>
          </span>
        </button>
      </div>

    </div>
  </div>
</header>

<!-- MOBILE FLOATING BOTTOM ICON-ONLY GLASS BAR -->
<nav aria-label="<?= $currentLang === 'tr' ? 'Mobil Alt Navigasyon' : 'Mobile Bottom Navigation' ?>" class="lg:hidden fixed bottom-3 inset-x-0 z-40 px-4 pointer-events-none">
  <div class="pointer-events-auto max-w-[300px] mx-auto rounded-full bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/75 shadow-[0_14px_38px_-8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.85)] px-2.5 py-1.5 flex items-center justify-between gap-1">
    <?php foreach ($phpNav as $nav):
        $isAct = $currentScript === $nav['script'];
        $lbl = $currentLang === 'tr' ? $nav['tr'] : $nav['en'];
    ?>
      <a
        href="<?= e($nav['href']) ?>"
        aria-label="<?= e($lbl) ?>"
        title="<?= e($lbl) ?>"
        class="w-12 h-11 rounded-full flex items-center justify-center transition-all duration-250 active:scale-90 <?= $isAct ? 'bg-[#111113] text-[#E3C289] shadow-md scale-105' : 'text-stone-700 hover:text-[#111113] hover:bg-white/80' ?>"
      >
        <?= icon($nav['icon'], 'w-[19px] h-[19px]') ?>
      </a>
    <?php endforeach; ?>

    <button
      type="button"
      onclick="NevaApp.openModal('map-modal')"
      aria-label="<?= $currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map' ?>"
      title="<?= $currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map' ?>"
      class="w-12 h-11 rounded-full flex items-center justify-center text-stone-700 hover:text-[#111113] hover:bg-white/80 transition-all duration-250 cursor-pointer active:scale-90"
    >
      <?= icon('map-pin', 'w-[19px] h-[19px] text-[#9A7137]') ?>
    </button>
  </div>
</nav>
