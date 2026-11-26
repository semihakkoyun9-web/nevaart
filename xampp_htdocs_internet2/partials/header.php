<?php
/**
 * NEVAART - İki Katmanlı Editoryal Müze Üst Navigasyon Çubuğu (Header)
 */
$roleLabel = $currentUser['role'] === 'curator'
    ? $t['roleCurator']
    : ($currentUser['role'] === 'member' ? $t['roleMember'] : $t['roleVisitor']);
$nextLang = $currentLang === 'tr' ? 'en' : 'tr';
$currentScript = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');
?>
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-2xs transition-all">
  <!-- Tier 1: Museum Masthead & Spacious Utilities -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

    <!-- Left: Bespoke Museum Crest & Wordmark -->
    <a href="index.php" class="shrink-0 flex items-center gap-3.5 group cursor-pointer">
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-[1.03]" aria-hidden="true">
        <rect x="1" y="1" width="42" height="42" rx="4" fill="#111113" stroke="#C59B5F" stroke-width="1.2" stroke-opacity="0.45"/>
        <rect x="5" y="5" width="34" height="34" rx="2" stroke="#C59B5F" stroke-width="0.75" stroke-opacity="0.45"/>
        <path d="M11 33V20C11 13.9249 15.9249 9 22 9C28.0751 9 33 13.9249 33 20V33" stroke="#C59B5F" stroke-width="1" stroke-opacity="0.55"/>
        <path d="M15.5 31V15.5L28.5 31V15.5" stroke="#FAF8F5" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.5 16.5C19.5 20.5 24.5 26.5 28.5 30" stroke="#C59B5F" stroke-width="2.3" stroke-linecap="round"/>
        <circle cx="22" cy="13.5" r="1.4" fill="#C59B5F"/>
      </svg>
      <div class="flex flex-col">
        <span class="font-serif text-[21px] sm:text-[23px] font-semibold tracking-[0.14em] text-[#111113] leading-none uppercase">
          NevaArt
        </span>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="w-3 h-px bg-[#C59B5F]"></span>
          <span class="text-[9px] uppercase tracking-[0.26em] font-mono text-stone-500 font-medium whitespace-nowrap leading-none">
            <?= $currentLang === 'tr' ? 'Dijital Sanat Müzesi' : 'Digital Art Museum' ?>
          </span>
        </div>
      </div>
    </a>

    <!-- Right: Clean Museum Utility Controls -->
    <div class="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
      <button
        type="button"
        id="header-fav-btn"
        onclick="NevaApp.openFavorites()"
        aria-label="<?= $currentLang === 'tr' ? 'Beğenilenler' : 'Favorites' ?>"
        class="relative p-2 rounded-md text-stone-600 hover:text-[#111113] hover:bg-stone-100 transition-colors cursor-pointer"
      >
        <span id="header-fav-icon"><?= icon('heart', 'w-[18px] h-[18px]') ?></span>
        <span id="header-fav-count" class="hidden absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">0</span>
      </button>

      <a
        href="?lang=<?= e($nextLang) ?>"
        class="text-[11px] font-mono font-semibold uppercase tracking-widest text-stone-500 hover:text-[#111113] px-1.5 py-1 transition-colors"
      >
        <span class="<?= $currentLang === 'tr' ? 'text-[#111113] underline underline-offset-4' : '' ?>">TR</span>
        <span class="mx-1 text-stone-300">/</span>
        <span class="<?= $currentLang === 'en' ? 'text-[#111113] underline underline-offset-4' : '' ?>">EN</span>
      </a>

      <span class="hidden sm:block w-px h-5 bg-stone-200"></span>

      <button
        type="button"
        onclick="NevaApp.openModal('auth-modal')"
        class="flex items-center gap-2 text-xs font-medium text-stone-700 hover:text-[#111113] px-2.5 py-1.5 rounded-md border border-transparent hover:border-stone-200 hover:bg-[#FAF8F5] transition-all cursor-pointer whitespace-nowrap"
      >
        <?= icon('user-check', 'w-3.5 h-3.5 text-[#9A7137]') ?>
        <span class="text-[11px] uppercase tracking-[0.12em] font-semibold">
          <?= $currentLang === 'tr' ? 'Giriş' : 'Sign In' ?>
        </span>
      </button>

      <button
        type="button"
        onclick="NevaApp.openModal('upload-modal')"
        class="h-9 px-3.5 sm:px-4 bg-[#111113] hover:bg-stone-800 border border-[#111113] text-white text-[11px] uppercase tracking-[0.14em] font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
      >
        <?= icon('plus', 'w-3.5 h-3.5 text-[#C59B5F]') ?>
        <span class="hidden sm:inline"><?= $currentLang === 'tr' ? 'Eser Gönder' : 'Submit' ?></span>
        <span class="sm:hidden"><?= $currentLang === 'tr' ? 'Ekle' : 'Add' ?></span>
      </button>
    </div>

  </div>

  <!-- Tier 2: Spacious Architectural Navigation Ribbon -->
  <nav aria-label="<?= $currentLang === 'tr' ? 'Ana Müze Navigasyonu' : 'Primary Museum Navigation' ?>" class="h-11 bg-[#FAF8F5]/95 border-t border-[#E8E2D9]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center sm:justify-center gap-7 sm:gap-10 overflow-x-auto no-scrollbar">
      <a href="index.php" class="relative h-full flex items-center text-[11px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap shrink-0 <?= $currentScript === 'index.php' ? 'text-[#111113]' : 'text-stone-500 hover:text-[#111113]' ?>">
        <span><?= $currentLang === 'tr' ? 'Keşfet' : 'Explore' ?></span>
        <?php if ($currentScript === 'index.php'): ?>
          <span class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111113]"></span>
        <?php endif; ?>
      </a>
      <a href="kategoriler.php" class="relative h-full flex items-center text-[11px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap shrink-0 <?= $currentScript === 'kategoriler.php' ? 'text-[#111113]' : 'text-stone-500 hover:text-[#111113]' ?>">
        <span><?= $currentLang === 'tr' ? 'Koleksiyon' : 'Collection' ?></span>
        <?php if ($currentScript === 'kategoriler.php'): ?>
          <span class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111113]"></span>
        <?php endif; ?>
      </a>
      <a href="sozler.php" class="relative h-full flex items-center text-[11px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap shrink-0 <?= $currentScript === 'sozler.php' ? 'text-[#111113]' : 'text-stone-500 hover:text-[#111113]' ?>">
        <span><?= $currentLang === 'tr' ? 'Sözler' : 'Quotes' ?></span>
        <?php if ($currentScript === 'sozler.php'): ?>
          <span class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111113]"></span>
        <?php endif; ?>
      </a>
      <button type="button" onclick="NevaApp.openModal('map-modal')" class="relative h-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 hover:text-[#111113] transition-colors cursor-pointer whitespace-nowrap shrink-0">
        <?= icon('map-pin', 'w-3.5 h-3.5 text-[#9A7137]') ?>
        <span><?= $currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map' ?></span>
      </button>
    </div>
  </nav>
</header>
