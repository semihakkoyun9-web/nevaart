<?php
/**
 * NEVAART - 1. Bölüm: "SANATLA BİR YOLCULUK" + 3D Panoramik Sergi Duvarı
 * Birebir React PanoramicGalleryShowcase.tsx karşılığı — %100 aynı HTML ve CSS sınıfları
 */
$activeArt = $artworks[0] ?? null;
?>
<section 
  id="hero"
  tabindex="0"
  class="relative pt-8 pb-16 px-4 overflow-hidden bg-white select-none outline-none"
>
  <!-- Editorial Header -->
  <div class="max-w-5xl mx-auto text-center mb-6">
    <!-- Eyebrow Label -->
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="w-6 h-px bg-stone-400"></span>
      <span class="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-stone-500 font-semibold font-mono">
        <?= $currentLang === 'tr' ? 'AÇIK SERGİ & SANAT ARŞİVİ' : 'OPEN EXHIBITION & ART ARCHIVE' ?>
      </span>
      <span class="w-6 h-px bg-stone-400"></span>
    </div>

    <!-- Big Bold Headline strictly localized -->
    <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-black tracking-tight uppercase leading-[0.95]">
      <?php if ($currentLang === 'tr'): ?>
        <span class="block">SANATLA BİR</span>
        <span class="block font-light text-stone-900 mt-1">YOLCULUK</span>
      <?php else: ?>
        <span class="block">A JOURNEY</span>
        <span class="block font-light text-stone-900 mt-1">THROUGH ARTS</span>
      <?php endif; ?>
    </h1>

    <p class="text-stone-600 max-w-2xl mx-auto mt-4 text-xs sm:text-sm leading-relaxed">
      <?= $currentLang === 'tr'
        ? 'Sanatçıların kendi çizim ve fotoğraflarını paylaştığı, dünya çapında ikonik başyapıtların yer aldığı açık dijital sanat galerisi. Eserleri keşfedin, yaratım hikayelerini okuyun ve sanatçılarla doğrudan iletişime geçin.'
        : 'A digital gallery showcasing both independent artists’ original drawings and photography alongside timeless world-famous masterpieces. Discover the stories, analyze the craft, and connect directly with the creators.' ?>
    </p>
  </div>

  <!-- 3D Panoramic Curved Gallery Stage -->
  <div 
    id="carousel-stage-container"
    class="relative max-w-7xl mx-auto h-[440px] sm:h-[480px] md:h-[510px] flex items-center justify-center select-none touch-none cursor-grab"
    style="perspective: 1200px; perspective-origin: 50% 42%;"
  >
    <!-- Subtle Ambient Curved Guide Shadow -->
    <div 
      class="absolute bottom-4 w-[700px] max-w-[88%] h-[100px] pointer-events-none rounded-[50%]"
      style="background: radial-gradient(ellipse at center, rgba(120,53,15,0.07) 0%, rgba(255,255,255,0) 70%); transform: rotateX(80deg);"
    ></div>

    <!-- Cards Container -->
    <div 
      id="carousel-cards-wrapper"
      class="relative w-full h-full flex items-center justify-center"
      style="transform-style: flat;"
    >
      <?php foreach ($artworks as $index => $art): 
        $isCenter = ($index === 0);
        $domColor = $art['colorPalette'][0]['hex'] ?? '#FAF8F5';
      ?>
        <div
          data-carousel-card="<?= (int)$index ?>"
          data-artwork-id="<?= (int)$art['id'] ?>"
          onclick="NevaApp.handleCarouselCardClick(<?= (int)$art['id'] ?>)"
          class="carousel-card-item absolute w-[260px] sm:w-[310px] md:w-[340px] bg-white border border-stone-200/90 p-3 sm:p-3.5 rounded-2xl cursor-pointer pointer-events-auto group will-change-transform transition-shadow duration-300 <?= $isCenter ? 'ring-2 ring-black shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]' : 'hover:border-stone-400 shadow-md' ?>"
        >
          <!-- Museum Exhibition Frame -->
          <div class="aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden relative rounded-xl border border-stone-200/90">
            <img
              src="<?= e($art['imageUrl']) ?>"
              alt="<?= e($art['title']) ?>"
              draggable="false"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />

            <?php if (!empty($art['isCuratorPick'])): ?>
              <div class="absolute top-2.5 left-2.5 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 tracking-widest uppercase rounded shadow-xs">
                <?= $currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Pick' ?>
              </div>
            <?php endif; ?>

            <div data-featured-badge="<?= (int)$index ?>" class="<?= $isCenter ? 'flex' : 'hidden' ?> absolute top-2.5 right-2.5 bg-amber-800 text-white text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase rounded items-center gap-1 shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
              <span><?= $currentLang === 'tr' ? 'Öne Çıkan' : 'Featured' ?></span>
            </div>

            <!-- Dominant Color Swatch Badge -->
            <div class="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-stone-200 shadow-xs">
              <span 
                class="w-2.5 h-2.5 rounded-full inline-block border border-black/10" 
                style="background-color: <?= e($domColor) ?>;" 
              ></span>
              <span class="text-[9px] font-mono text-stone-800 font-semibold"><?= e($domColor) ?></span>
            </div>
          </div>

          <!-- Artwork Metadata & Title -->
          <div class="pt-3">
            <div class="flex items-center justify-between text-[10px] text-stone-500 font-mono mb-1">
              <span><?= e($art['accessionNumber']) ?></span>
              <span class="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">
                <?= e(strtoupper($art['category'])) ?> · <?= (int)$art['year'] ?>
              </span>
            </div>
            <h3 class="font-serif text-base sm:text-lg font-bold text-stone-900 truncate group-hover:text-amber-900 transition-colors">
              <?= e($art['title']) ?>
            </h3>
            <p class="text-xs text-stone-600 truncate font-medium mt-0.5">
              <?= e($art['artist']) ?>
            </p>

            <!-- Card Action footer -->
            <div class="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="text-stone-400 font-mono text-[11px] flex items-center gap-1">
                <?= icon('eye', 'w-3 h-3 text-stone-400') ?>
                <span><?= number_format((int)$art['views']) ?></span>
              </span>

              <button
                type="button"
                onclick="event.stopPropagation(); NevaApp.openArtworkModal(<?= (int)$art['id'] ?>);"
                class="text-stone-900 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer transition-transform group-hover:translate-x-0.5"
              >
                <?= icon('book-open', 'w-3.5 h-3.5 text-amber-800') ?>
                <span><?= $currentLang === 'tr' ? 'Hikayesini Oku' : 'Read Story' ?></span>
              </button>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Navigation Buttons -->
    <button
      type="button"
      onpointerdown="event.stopPropagation()"
      onclick="NevaApp.carouselPrev(event)"
      aria-label="<?= $currentLang === 'tr' ? 'Önceki eser' : 'Previous artwork' ?>"
      class="absolute left-2 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
    >
      <?= icon('chevron-left', 'w-5 h-5 group-hover:-translate-x-0.5 transition-transform') ?>
    </button>
    <button
      type="button"
      onpointerdown="event.stopPropagation()"
      onclick="NevaApp.carouselNext(event)"
      aria-label="<?= $currentLang === 'tr' ? 'Sonraki eser' : 'Next artwork' ?>"
      class="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
    >
      <?= icon('chevron-right', 'w-5 h-5 group-hover:translate-x-0.5 transition-transform') ?>
    </button>
  </div>

  <!-- Active Artwork Spotlight Preview Strip -->
  <?php if ($activeArt): ?>
    <div class="max-w-lg mx-auto mt-4 px-4">
      <!-- Pagination Dots -->
      <div id="carousel-dots-container" class="flex items-center justify-center gap-1.5 mb-3">
        <?php foreach ($artworks as $dotIdx => $_): ?>
          <button
            type="button"
            data-carousel-dot="<?= (int)$dotIdx ?>"
            onclick="NevaApp.rotateToCard(<?= (int)$dotIdx ?>)"
            aria-label="Go to slide <?= (int)($dotIdx + 1) ?>"
            class="transition-all duration-300 rounded-full cursor-pointer <?= $dotIdx === 0 ? 'w-7 h-1.5 bg-black' : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400' ?>"
          ></button>
        <?php endforeach; ?>
      </div>

      <!-- Quick Details Pill -->
      <div class="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full shadow-xs flex items-center justify-between text-xs transition-all hover:border-stone-400">
        <div class="flex items-center gap-2.5 truncate pr-3">
          <img 
            id="spotlight-img"
            src="<?= e($activeArt['imageUrl']) ?>" 
            alt="" 
            class="w-7 h-7 rounded-full object-cover border border-stone-300 shrink-0" 
          />
          <div class="truncate">
            <span id="spotlight-title" class="font-semibold text-stone-900 truncate block text-xs">
              <?= e($activeArt['title']) ?>
            </span>
            <span id="spotlight-meta" class="text-[10px] text-stone-500 truncate block">
              <?= e($activeArt['artist']) ?> · <?= e($currentLang === 'tr' ? $activeArt['mediumTr'] : $activeArt['mediumEn']) ?>
            </span>
          </div>
        </div>
        <button
          type="button"
          id="spotlight-btn"
          onclick="NevaApp.openActiveCarouselArtwork()"
          class="px-4 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          <?= $currentLang === 'tr' ? 'Hikayesini Oku →' : 'Read Story →' ?>
        </button>
      </div>
    </div>
  <?php endif; ?>
</section>

