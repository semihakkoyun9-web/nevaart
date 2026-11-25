<?php
/**
 * NEVAART - Üst Navigasyon Çubuğu (Header) Şablonu
 * Birebir React Header.tsx karşılığı — %100 aynı Tailwind sınıfları ve düzen
 */
$roleLabel = $currentUser['role'] === 'curator'
    ? $t['roleCurator']
    : ($currentUser['role'] === 'member' ? $t['roleMember'] : $t['roleVisitor']);
$nextLang = $currentLang === 'tr' ? 'en' : 'tr';
?>
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
    
    <!-- Left: Refined Brand Logo -->
    <div class="shrink-0 flex items-center">
      <a 
        href="index.php#hero" 
        onclick="NevaApp.scrollToSection('hero', 'home'); return false;"
        class="flex flex-col group cursor-pointer"
      >
        <span class="font-serif italic text-2xl font-bold tracking-tight text-black group-hover:text-amber-900 transition-colors leading-none">
          NevaArt
        </span>
        <span class="text-[9px] uppercase tracking-[0.22em] font-mono text-stone-400 font-semibold mt-1">
          <?= $currentLang === 'tr' ? 'Açık Sanat Galerisi' : 'Open Art Gallery' ?>
        </span>
      </a>
    </div>

    <!-- Center: Clean & Balanced Floating Pill Navigation Bar -->
    <nav class="hidden lg:flex items-center gap-1 bg-[#F4F3F0] p-1.5 rounded-full border border-stone-200 shadow-xs">
      <button
        type="button"
        id="nav-tab-home"
        onclick="NevaApp.scrollToSection('hero', 'home')"
        class="nav-pill-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer bg-black text-white shadow-xs"
      >
        <?= $currentLang === 'tr' ? 'Galeri' : 'Gallery' ?>
      </button>

      <button
        type="button"
        id="nav-tab-stories"
        onclick="NevaApp.scrollToSection('curated-dark-section', 'stories')"
        class="nav-pill-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-stone-700 hover:text-black hover:bg-stone-200/50"
      >
        <?= $currentLang === 'tr' ? 'Hikayeler' : 'Stories' ?>
      </button>

      <button
        type="button"
        id="nav-tab-gallery"
        onclick="NevaApp.scrollToSection('katalog', 'gallery')"
        class="nav-pill-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-stone-700 hover:text-black hover:bg-stone-200/50"
      >
        <?= $currentLang === 'tr' ? 'Eser Kataloğu' : 'Catalog' ?>
      </button>

      <button
        type="button"
        onclick="NevaApp.openModal('map-modal')"
        class="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
      >
        <?= $currentLang === 'tr' ? 'Sergi Haritası' : 'Exhibitions' ?>
      </button>

      <button
        type="button"
        onclick="NevaApp.scrollToSection('analitik', 'analytics')"
        class="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
      >
        <?= $currentLang === 'tr' ? 'Analitik' : 'Analytics' ?>
      </button>
    </nav>

    <!-- Right: Perfectly Proportioned Actions Group -->
    <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <!-- Circular Search Button -->
      <button
        type="button"
        onclick="NevaApp.scrollToSection('katalog', 'gallery'); document.getElementById('catalog-search-input')?.focus();"
        aria-label="<?= $currentLang === 'tr' ? 'Eser Ara' : 'Search Artworks' ?>"
        class="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 flex items-center justify-center transition-all cursor-pointer"
        title="<?= $currentLang === 'tr' ? 'Eser veya Sanatçı Ara' : 'Search Artworks' ?>"
      >
        <?= icon('search', 'w-4 h-4') ?>
      </button>

      <!-- Favorites Button (Beğeni Sayfası / Filtresi - Kriter P & Z) -->
      <button
        type="button"
        id="header-fav-btn"
        onclick="NevaApp.openFavorites()"
        aria-label="<?= $currentLang === 'tr' ? 'Beğenilenler' : 'Favorites' ?>"
        class="relative w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 flex items-center justify-center transition-all cursor-pointer group"
        title="<?= $currentLang === 'tr' ? 'Beğenilen Eserler (Favorilerim)' : 'Favorites' ?>"
      >
        <span id="header-fav-icon"><?= icon('heart', 'w-4 h-4 text-stone-700 group-hover:text-red-500 transition-colors') ?></span>
        <span id="header-fav-count" class="hidden absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">0</span>
      </button>

      <!-- Language Toggle (PHP GET ?lang=tr|en) -->
      <a
        href="?lang=<?= e($nextLang) ?>"
        class="h-9 px-3 text-xs text-stone-700 hover:text-black border border-stone-200 hover:border-stone-400 rounded-full transition-all flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs"
        title="<?= $currentLang === 'tr' ? 'Dili Değiştir / Switch Language' : 'Switch Language' ?>"
      >
        <?= icon('globe', 'w-3.5 h-3.5 text-stone-400') ?>
        <span class="font-mono uppercase font-semibold text-[11px]"><?= e($currentLang) ?></span>
      </a>

      <!-- User Profile / Auth / Register Button (Kriter I & J) -->
      <button
        type="button"
        onclick="NevaApp.openModal('auth-modal')"
        class="flex items-center gap-1.5 h-9 px-3 sm:px-3.5 text-xs border border-stone-200 hover:border-black text-stone-800 rounded-full transition-all cursor-pointer bg-white shadow-2xs hover:bg-stone-50"
        title="<?= $currentLang === 'tr' ? 'Kullanıcı Oturum Açma, Kayıt ve Rol Yönetimi (Kriter I & J)' : 'User Login & Registration' ?>"
      >
        <?= icon('user-check', 'w-3.5 h-3.5 text-amber-800') ?>
        <span class="font-medium text-[11px]">
          <?= $currentLang === 'tr' ? 'Giriş / Kayıt' : 'Login / Register' ?>
        </span>
        <span id="header-role-label" class="hidden md:inline-block text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium border border-stone-200 truncate max-w-[100px]">
          <?= e($roleLabel) ?>
        </span>
      </button>

      <!-- Primary Action Button: Eserini Yayınla -->
      <button
        type="button"
        onclick="NevaApp.openModal('upload-modal')"
        class="h-9 px-4 bg-black hover:bg-stone-800 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
      >
        <?= icon('plus', 'w-3.5 h-3.5') ?>
        <span class="tracking-wide">
          <?= $currentLang === 'tr' ? 'Eserini Yayınla' : 'Publish Art' ?>
        </span>
      </button>
    </div>

  </div>
</header>

