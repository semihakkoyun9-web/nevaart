<?php
/**
 * NEVAART - 2. Bölüm: Koyu Tema "BİNLERCE KELİMEYİ ANLATAN BAŞYAPITLAR"
 * Birebir React CuratedDarkSection.tsx karşılığı — %100 aynı HTML ve CSS sınıfları
 */
$darkArtworks = array_slice($artworks, 2, 4);
?>
<section id="curated-dark-section" class="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
  <div class="bg-[#121214] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden">
    <!-- Ambient gradient mesh -->
    <div class="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Section Header Row -->
    <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
      <div>
        <div class="inline-flex items-center gap-2 mb-2">
          <span class="w-5 h-px bg-stone-500"></span>
          <span class="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-mono font-semibold">
            <?= $currentLang === 'tr' ? 'HİKAYESİ OLAN ESERLER' : 'STORIES BEHIND THE ART' ?>
          </span>
        </div>
        <h2 class="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
          <?php if ($currentLang === 'tr'): ?>
            BİNLERCE KELİMEYİ ANLATAN <br class="hidden sm:inline" />
            <span class="font-light text-stone-300">BAŞYAPITLAR VE HİKAYELER</span>
          <?php else: ?>
            ARTWORKS THAT SPEAK <br class="hidden sm:inline" />
            <span class="font-light text-stone-300">A MILLION WORDS</span>
          <?php endif; ?>
        </h2>
        <p class="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
          <?= $currentLang === 'tr' 
            ? 'Her fırça darbesinin, deklanşör anının ve renk seçiminin ardındaki felsefe. Eserleri inceleyin, hikayelerini okuyun ve sanatçısıyla doğrudan iletişim kurun.'
            : 'Every brushstroke, shutter click, and chromatic choice has a philosophy. Examine the artworks, read their stories, and reach out directly to the artist.' ?>
        </p>
      </div>

      <button
        type="button"
        onclick="NevaApp.scrollToSection('katalog', 'gallery')"
        class="self-start md:self-auto px-6 py-2.5 bg-white text-black hover:bg-stone-200 text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
      >
        <span><?= $currentLang === 'tr' ? 'TÜM ARŞİVİ KEŞFET' : 'EXPLORE ALL STORIES' ?></span>
        <?= icon('arrow-up-right', 'w-3.5 h-3.5') ?>
      </button>
    </div>

    <!-- 4 Artworks Grid -->
    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
      <?php foreach ($darkArtworks as $art): ?>
        <div
          onclick="NevaApp.openArtworkModal(<?= (int)$art['id'] ?>)"
          class="bg-[#1C1C1F] border border-white/10 rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        >
          <div>
            <!-- Artwork Image -->
            <div class="aspect-3/4 w-full rounded-xl overflow-hidden bg-stone-900 relative border border-white/5">
              <img
                src="<?= e($art['imageUrl']) ?>"
                alt="<?= e($art['title']) ?>"
                class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div class="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/10">
                <?= (int)$art['year'] ?>
              </div>

              <!-- Views counter -->
              <div class="absolute bottom-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-stone-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                <?= icon('eye', 'w-3 h-3 text-stone-400') ?>
                <span><?= number_format((int)$art['views']) ?> <?= $currentLang === 'tr' ? 'görüntülenme' : 'views' ?></span>
              </div>
            </div>

            <!-- Artwork Info -->
            <div class="pt-3.5">
              <span class="font-serif font-bold text-white text-base truncate block group-hover:text-amber-400 transition-colors">
                <?= e($art['title']) ?>
              </span>
              <p class="text-stone-400 text-xs truncate mt-0.5">
                <?= e($art['artist']) ?>
              </p>
              <p class="text-[11px] text-stone-500 font-mono mt-1 truncate">
                <?= e($currentLang === 'tr' ? $art['mediumTr'] : $art['mediumEn']) ?>
              </p>
            </div>
          </div>

          <!-- Read Story & Connect Action -->
          <div class="mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onclick="event.stopPropagation(); NevaApp.openArtworkModal(<?= (int)$art['id'] ?>);"
              class="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-[11px] font-semibold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 group-hover:border-white/20"
            >
              <?= icon('book-open', 'w-3.5 h-3.5 text-amber-400') ?>
              <span><?= $currentLang === 'tr' ? 'HİKAYESİNİ OKU & İLETİŞİM' : 'READ STORY & CONTACT' ?></span>
            </button>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

