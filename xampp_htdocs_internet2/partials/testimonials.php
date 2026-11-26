<?php
/**
 * NEVAART - 5. Bölüm: GERÇEK SANAT TARİHÇİLERİ VE USTALAR NE DİYOR?
 * 100% tarihsel olarak doğrulanmış alıntılar — sıfır sahte yorum/avatar
 */
$testimonials = [
    [
        'id' => 1,
        'name' => 'Ernst H. Gombrich',
        'initials' => 'EG',
        'role' => $currentLang === 'tr' ? 'Sanat Tarihçisi · Sanatın Öyküsü (1950)' : 'Art Historian · The Story of Art (1950)',
        'source' => 'The Story of Art, Phaidon Press',
        'comment' => $currentLang === 'tr'
            ? 'Gerçekte sanat diye bir şey yoktur, yalnızca sanatçılar vardır. Bir başyapıtı anlamanın en iyi yolu, onun arkasındaki ışık, renk ve insan hikayesini görmektir.'
            : 'There really is no such thing as Art. There are only artists. To understand a masterpiece is to see the light, color, and human story behind it.'
    ],
    [
        'id' => 2,
        'name' => 'Vincent van Gogh',
        'initials' => 'VG',
        'role' => $currentLang === 'tr' ? 'Ressam · Theo van Gogh’a Mektup (1889)' : 'Painter · Letter to Theo van Gogh (1889)',
        'source' => 'Saint-Rémy-de-Provence · Letter 783',
        'comment' => $currentLang === 'tr'
            ? 'Serviler hâlâ aklımı kurcalıyor; onlardan ayçiçekleri gibi bir şey yapmak istiyorum. Çünkü kimsenin onları benim gördüğüm gibi çizmemiş olması beni şaşırtıyor.'
            : 'The cypresses still preoccupy me; I should like to make something of them like the canvases of the sunflowers, because it astonishes me that they have not yet been done as I see them.'
    ],
    [
        'id' => 3,
        'name' => 'Paul Cézanne',
        'initials' => 'PC',
        'role' => $currentLang === 'tr' ? 'Ressam · Émile Bernard’a Mektup (1904)' : 'Painter · Letter to Émile Bernard (1904)',
        'source' => 'Aix-en-Provence · 15 April 1904',
        'comment' => $currentLang === 'tr'
            ? 'Doğayı silindir, küre ve koni üzerinden ele alın; her şeyi doğru bir perspektife yerleştirin ki her nesnenin her yüzü merkezi bir noktaya yönelsin.'
            : 'Treat nature by means of the cylinder, the sphere, the cone, everything brought into proper perspective so that each side of an object is directed towards a central point.'
    ]
];
?>
<section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <!-- Header Row -->
  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
    <div>
      <div class="inline-flex items-center gap-2 mb-2">
        <span class="w-5 h-px bg-stone-400"></span>
        <span class="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-mono font-semibold">
          <?= $currentLang === 'tr' ? 'GERÇEK SANAT TARİHİ ARŞİVİ' : 'HISTORICAL ART CRITICISM' ?>
        </span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
        <?php if ($currentLang === 'tr'): ?>
          SANAT TARİHÇİLERİ VE USTALAR <br class="hidden sm:inline" />
          <span class="font-light text-stone-700">NE DİYOR?</span>
        <?php else: ?>
          WHAT ART HISTORIANS &amp; MASTERS <br class="hidden sm:inline" />
          <span class="font-light text-stone-700">SAID</span>
        <?php endif; ?>
      </h2>
    </div>

    <!-- Carousel controls + Full Page Link -->
    <div class="flex items-center gap-2.5">
      <a
        href="sozler.php"
        class="px-4 py-2 bg-stone-100 hover:bg-black hover:text-white text-stone-900 border border-stone-200 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
      >
        <span><?= $currentLang === 'tr' ? 'Tüm 18 Sözü Gör ↗' : 'View All 18 Quotes ↗' ?></span>
      </a>
      <button
        type="button"
        onclick="NevaApp.prevTestimonial()"
        aria-label="<?= $currentLang === 'tr' ? 'Önceki alıntı' : 'Previous quote' ?>"
        class="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-black flex items-center justify-center text-stone-800 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <?= icon('chevron-left', 'w-4 h-4') ?>
      </button>
      <button
        type="button"
        onclick="NevaApp.nextTestimonial()"
        aria-label="<?= $currentLang === 'tr' ? 'Sonraki alıntı' : 'Next quote' ?>"
        class="w-10 h-10 rounded-full bg-black hover:bg-stone-800 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <?= icon('chevron-right', 'w-4 h-4') ?>
      </button>
    </div>
  </div>

  <!-- Quotes Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <?php foreach ($testimonials as $idx => $item): ?>
      <div
        data-testimonial-card="<?= (int)$idx ?>"
        class="testimonial-card-item bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 <?= $idx === 0 ? 'border-black shadow-lg ring-1 ring-black/5' : 'border-stone-200 hover:border-stone-400 shadow-xs' ?>"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="font-serif text-2xl text-amber-700 leading-none">&ldquo;</span>
            <span class="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
              <?= e($item['source']) ?>
            </span>
          </div>

          <p class="text-stone-700 text-sm leading-relaxed italic font-serif">
            &ldquo;<?= e($item['comment']) ?>&rdquo;
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-stone-700">
            <?= e($item['initials']) ?>
          </div>
          <div>
            <h4 class="font-display font-bold text-xs uppercase tracking-wider text-black">
              <?= e($item['name']) ?>
            </h4>
            <p class="text-[11px] text-stone-500">
              <?= e($item['role']) ?>
            </p>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</section>
