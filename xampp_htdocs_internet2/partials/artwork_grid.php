<?php
/**
 * NEVAART - 4. Bölüm: "ÇAĞDAŞ SANATÇILAR - MODERN GALERİ" Eser Kataloğu
 * Birebir React ArtworkGrid.tsx karşılığı — %100 aynı HTML ve CSS sınıfları
 */
$categoryLabels = [
    'digital' => ['tr' => 'RENK TEORİSİ', 'en' => 'COLOR THEORY'],
    'street' => ['tr' => 'PORTRE & YAŞAM', 'en' => 'PORTRAIT & LIFE'],
    'illustration' => ['tr' => 'EMPRESYONİZM & UKİYO-E', 'en' => 'IMPRESSIONISM & UKIYO-E'],
    'architecture' => ['tr' => 'PEYZAJ & MEKÂN', 'en' => 'LANDSCAPE & SPACE'],
    'concept' => ['tr' => 'TARİH & MİTOLOJİ', 'en' => 'HISTORY & MYTHOLOGY'],
];

$colorFamilies = [
    ['id' => 'all', 'name' => $currentLang === 'tr' ? 'Tüm Spektrum' : 'All Spectrum', 'dot' => '#D6CEBE'],
    ['id' => 'blue', 'name' => $currentLang === 'tr' ? 'Prusya & Lapis' : 'Prussian & Lapis', 'dot' => '#183661'],
    ['id' => 'mono', 'name' => $currentLang === 'tr' ? 'Monokrom Noir' : 'Monochrome Noir', 'dot' => '#0D0D0D'],
    ['id' => 'red', 'name' => $currentLang === 'tr' ? 'Vermilion & Oksit' : 'Vermilion & Oxide', 'dot' => '#9E2A2B'],
    ['id' => 'alabaster', 'name' => $currentLang === 'tr' ? 'Alabaster & Beton' : 'Alabaster & Concrete', 'dot' => '#858380'],
];
?>
<section id="katalog" class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <!-- Section Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-200">
    <div>
      <div class="inline-flex items-center gap-2 mb-2">
        <span class="w-5 h-px bg-stone-400"></span>
        <span class="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-mono font-semibold">
          <?= $currentLang === 'tr' ? 'YENİ — KOLEKSİYON' : 'NEW — ARTWORKS' ?>
        </span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
        <?php if ($currentLang === 'tr'): ?>
          ÇAĞDAŞ SANATÇILAR <br />
          <span class="font-light text-stone-700">MODERN GALERİ</span>
        <?php else: ?>
          DRAMATIC ARTIST <br />
          <span class="font-light text-stone-700">MODERN GALLERY</span>
        <?php endif; ?>
      </h2>
      <p class="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl">
        <?= $currentLang === 'tr'
          ? 'Küratör onaylı başyapıtlar, bağımsız sanatçı çizimleri ve derin renk teorisi analitiği.'
          : 'Curator-approved masterpieces, independent artist submissions, and deep chromatic spectrum analytics.' ?>
      </p>
    </div>

    <div class="text-xs text-stone-500 font-mono self-start md:self-auto">
      <span id="catalog-count-num" class="text-black font-bold text-sm"><?= count($artworks) ?></span> <?= $currentLang === 'tr' ? 'eser sergileniyor' : 'artworks displayed' ?>
    </div>
  </div>

  <!-- Filter Tabs & Search Controls -->
  <div class="space-y-4 mb-10">
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/90 rounded-full border border-stone-200/80">
        <button
          type="button"
          data-cat-pill="all"
          onclick="NevaApp.filterByCategory('all')"
          class="cat-filter-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap bg-black text-white shadow-xs font-semibold"
        >
          <?= e($t['allCategories']) ?>
        </button>

        <!-- Dedicated Favorites Tab (Beğeni Sayfası / Filtresi) -->
        <button
          type="button"
          data-cat-pill="favorites"
          onclick="NevaApp.filterByCategory('favorites')"
          class="cat-filter-btn px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap text-stone-700 hover:text-red-600 hover:bg-stone-200/60 flex items-center gap-1.5"
        >
          <span class="text-red-500">❤️</span>
          <span id="cat-pill-fav-label"><?= $currentLang === 'tr' ? 'Beğendiklerim (0)' : 'Favorites (0)' ?></span>
        </button>
        <?php foreach ($categories as $cat): ?>
          <button
            type="button"
            data-cat-pill="<?= e($cat['id']) ?>"
            onclick="NevaApp.filterByCategory('<?= e($cat['id']) ?>')"
            class="cat-filter-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap text-stone-700 hover:text-black hover:bg-stone-200/60"
          >
            <?= e($currentLang === 'tr' ? $cat['nameTr'] : $cat['nameEn']) ?>
          </button>
        <?php endforeach; ?>
      </div>

      <!-- Live Search Input -->
      <div class="relative min-w-[280px]">
        <span class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          <?= icon('search', 'w-4 h-4') ?>
        </span>
        <input
          type="text"
          id="catalog-search-input"
          oninput="NevaApp.filterBySearch(this.value)"
          placeholder="<?= $currentLang === 'tr' ? 'Sanatçı, eser veya teknik ara...' : 'Search artist, artwork or medium...' ?>"
          class="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 focus:border-black rounded-full text-xs text-stone-900 placeholder:text-stone-400 outline-none transition-colors shadow-xs"
        />
        <button
          type="button"
          id="catalog-search-clear"
          onclick="NevaApp.clearSearch()"
          class="hidden absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-black cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Dominant Color Spectrum Filter Bar -->
    <div class="flex flex-wrap items-center gap-2 pt-2 text-xs">
      <span class="text-stone-700 font-mono text-[11px] font-semibold flex items-center gap-1">
        <?= icon('palette', 'w-3.5 h-3.5 text-amber-800') ?>
        <span><?= $currentLang === 'tr' ? 'Renk Filtresi:' : 'Color Palette:' ?></span>
      </span>
      <?php foreach ($colorFamilies as $idx => $cf): ?>
        <button
          type="button"
          data-color-pill="<?= e($cf['id']) ?>"
          onclick="NevaApp.filterByColor('<?= e($cf['id']) ?>')"
          class="color-filter-btn px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all cursor-pointer <?= $idx === 0 ? 'bg-black border-black text-white font-semibold shadow-xs' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400' ?>"
        >
          <span
            class="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
            style="background-color: <?= e($cf['dot']) ?>;"
          ></span>
          <span><?= e($cf['name']) ?></span>
        </button>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Empty Filter State -->
  <div id="catalog-empty-state" class="hidden py-20 text-center border border-dashed border-stone-300 bg-white rounded-2xl">
    <p class="font-serif text-2xl text-stone-600">
      <?= $currentLang === 'tr' ? 'Aradığınız kriterlere uygun eser bulunamadı.' : 'No artworks found matching your criteria.' ?>
    </p>
    <p class="text-xs text-stone-400 mt-2">
      <?= $currentLang === 'tr' ? 'Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayabilirsiniz.' : 'Try different keywords or clear the filters.' ?>
    </p>
    <button
      type="button"
      onclick="NevaApp.resetCatalogFilters()"
      class="mt-4 px-5 py-2 bg-black text-white text-xs rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
    >
      <?= $currentLang === 'tr' ? 'Filtreleri Sıfırla' : 'Reset Filters' ?>
    </button>
  </div>

  <!-- Artworks Catalog Grid -->
  <div id="catalog-grid-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <?php foreach ($artworks as $art): 
      $catBadge = $categoryLabels[$art['category']][$currentLang] ?? strtoupper($art['category']);
      $hexList = implode(',', array_map(fn($c) => strtoupper($c['hex']), $art['colorPalette']));
      $searchBlob = strtolower(
          $art['title'] . ' ' .
          $art['artist'] . ' ' .
          $art['accessionNumber'] . ' ' .
          $art['mediumTr'] . ' ' .
          $art['mediumEn'] . ' ' .
          implode(' ', $art['tags'] ?? [])
      );
    ?>
      <article
        data-grid-artwork-id="<?= (int)$art['id'] ?>"
        data-category="<?= e($art['category']) ?>"
        data-hexes="<?= e($hexList) ?>"
        data-search="<?= e($searchBlob) ?>"
        onclick="NevaApp.openArtworkModal(<?= (int)$art['id'] ?>)"
        class="catalog-card-item group bg-white border border-stone-200 hover:border-black transition-all duration-300 rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1"
      >
        <!-- Image slot -->
        <div class="aspect-4/3 w-full bg-[#F4EFEB] relative overflow-hidden border-b border-stone-100">
          <img
            src="<?= e($art['imageUrl']) ?>"
            alt="<?= e($art['title']) ?>"
            referrerpolicy="no-referrer"
            class="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          <!-- Curator Pick Label -->
          <?php if (!empty($art['isCuratorPick'])): ?>
            <span class="absolute top-3 left-3 bg-black/85 backdrop-blur-xs text-white text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded shadow-xs">
              <?= $currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Pick' ?>
            </span>
          <?php endif; ?>

          <!-- Quick Like Action Button (Kırmızı Kalp Durumu) -->
          <button
            type="button"
            id="card-like-btn-<?= (int)$art['id'] ?>"
            onclick="event.stopPropagation(); NevaApp.likeArtwork(<?= (int)$art['id'] ?>);"
            class="card-like-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="<?= $currentLang === 'tr' ? 'Beğen / Favorilere Ekle' : 'Like' ?>"
          >
            <?= icon('heart', 'w-4 h-4 card-like-icon') ?>
          </button>

          <!-- Discipline / Year indicator -->
          <div class="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
            <?= icon('award', 'w-3 h-3 text-amber-300') ?>
            <span><?= e($catBadge) ?> · <?= (int)$art['year'] ?></span>
          </div>

          <!-- Color bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1 flex">
            <?php foreach (array_slice($art['colorPalette'], 0, 5) as $color): ?>
              <div
                style="background-color: <?= e($color['hex']) ?>; width: <?= (int)$color['percentage'] ?>%;"
                class="h-full"
              ></div>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-[10px] text-stone-500 font-mono mb-1.5">
              <span><?= e($art['accessionNumber']) ?></span>
              <span aria-hidden="true">·</span>
              <span><?= (int)$art['year'] ?></span>
              <span aria-hidden="true">·</span>
              <span class="capitalize"><?= e($catBadge) ?></span>
            </div>

            <h3 class="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
              <?= e($art['title']) ?>
            </h3>
            <p class="text-xs text-stone-600 mt-0.5 font-medium">
              <?= e($art['artist']) ?>
            </p>
            <p class="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
              <?= e($currentLang === 'tr' ? $art['storyTr'] : $art['storyEn']) ?>
            </p>
          </div>

          <!-- Action row -->
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1">
              <?php foreach (array_slice($art['colorPalette'], 0, 4) as $c): ?>
                <span
                  class="w-3 h-3 rounded-full border border-black/10 inline-block"
                  style="background-color: <?= e($c['hex']) ?>;"
                ></span>
              <?php endforeach; ?>
            </div>

            <span class="text-black font-semibold group-hover:text-amber-900 flex items-center gap-1">
              <span><?= $currentLang === 'tr' ? 'Hikayesini Oku & İncele' : 'Read Story & Inspect' ?></span>
              <?= icon('arrow-up-right', 'w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5') ?>
            </span>
          </div>
        </div>
      </article>
    <?php endforeach; ?>
  </div>
</section>

