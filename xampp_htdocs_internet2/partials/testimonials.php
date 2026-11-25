<?php
/**
 * NEVAART - 5. Bölüm: "SANATÇILAR VE KÜRATÖRLER NE DİYOR?"
 * Birebir React TestimonialsSection.tsx karşılığı — %100 aynı HTML ve CSS sınıfları
 */
$testimonials = [
    [
        'id' => 1,
        'name' => 'Deniz Acar',
        'role' => $currentLang === 'tr' ? 'Bağımsız İllüstratör & Dijital Sanatçı' : 'Independent Illustrator & Digital Artist',
        'rating' => 5,
        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        'comment' => $currentLang === 'tr'
            ? 'Kendi çizimlerimi ve arkasındaki eskiz hikayelerini NevaArt’ta yayınladım. İki hafta içinde bir galeri yöneticisi doğrudan benimle iletişime geçip orijinal sergileme haklarını aldı.'
            : 'I published my digital drawings and development sketches on NevaArt. Within two weeks, a contemporary gallery curator reached out directly to exhibit the series.'
    ],
    [
        'id' => 2,
        'name' => 'Kaan Demir',
        'role' => $currentLang === 'tr' ? 'Belgesel Fotoğrafçısı' : 'Documentary Photographer',
        'rating' => 5,
        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        'comment' => $currentLang === 'tr'
            ? 'Burada sadece görsel koyup geçmiyorsunuz; her eserin hikayesini, kullanılan lensi ve anın felsefesini yazabiliyorsunuz. Sanatseverler hikayeyi okuduktan sonra eserle çok daha derin bağ kuruyor.'
            : "You don't just post an image; you share the story, the lens, and the human condition behind the frame. Viewers connect far deeper after reading the provenance."
    ],
    [
        'id' => 3,
        'name' => 'Elena Rostova',
        'role' => $currentLang === 'tr' ? 'Sanat Tarihçisi & Koleksiyoner, Berlin' : 'Art Historian & Collector, Berlin',
        'rating' => 5,
        'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        'comment' => $currentLang === 'tr'
            ? 'Hokusai ve Arda Güler gibi efsanelerle genç yeteneklerin aynı galeride buluşması harika. Beğendiğim bir eserin çizerine tek tıkla mesaj atıp iletişime geçebilmek inanılmaz bir kolaylık.'
            : 'Having young creators exhibited alongside legends like Hokusai creates a rich tapestry. Being able to reach out directly to the artist to inquire about a piece is effortless.'
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
          <?= $currentLang === 'tr' ? 'TOPLULUK DENEYİMLERİ' : 'COMMUNITY EXPERIENCES' ?>
        </span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
        <?php if ($currentLang === 'tr'): ?>
          SANATÇILAR VE KÜRATÖRLER <br class="hidden sm:inline" />
          <span class="font-light text-stone-700">NE DİYOR?</span>
        <?php else: ?>
          WHAT ARTISTS & CURATORS <br class="hidden sm:inline" />
          <span class="font-light text-stone-700">ARE SAYING</span>
        <?php endif; ?>
      </h2>
    </div>

    <!-- Carousel controls -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick="NevaApp.prevTestimonial()"
        aria-label="<?= $currentLang === 'tr' ? 'Önceki görüş' : 'Previous review' ?>"
        class="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-black flex items-center justify-center text-stone-800 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <?= icon('chevron-left', 'w-4 h-4') ?>
      </button>
      <button
        type="button"
        onclick="NevaApp.nextTestimonial()"
        aria-label="<?= $currentLang === 'tr' ? 'Sonraki görüş' : 'Next review' ?>"
        class="w-10 h-10 rounded-full bg-black hover:bg-stone-800 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
      >
        <?= icon('chevron-right', 'w-4 h-4') ?>
      </button>
    </div>
  </div>

  <!-- Testimonials Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <?php foreach ($testimonials as $idx => $item): ?>
      <div
        data-testimonial-card="<?= (int)$idx ?>"
        class="testimonial-card-item bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 <?= $idx === 0 ? 'border-black shadow-lg ring-1 ring-black/5' : 'border-stone-200 hover:border-stone-400 shadow-xs' ?>"
      >
        <div>
          <!-- Star Rating -->
          <div class="flex items-center gap-1 text-amber-500 mb-4">
            <?php for ($s = 0; $s < $item['rating']; $s++): ?>
              <?= icon('star', 'w-4 h-4 fill-amber-500') ?>
            <?php endfor; ?>
          </div>

          <!-- Review Text -->
          <p class="text-stone-700 text-sm leading-relaxed italic">
            &ldquo;<?= e($item['comment']) ?>&rdquo;
          </p>
        </div>

        <!-- Author info -->
        <div class="flex items-center gap-3.5 mt-6 pt-5 border-t border-stone-100">
          <img
            src="<?= e($item['avatar']) ?>"
            alt="<?= e($item['name']) ?>"
            class="w-10 h-10 rounded-full object-cover border border-stone-200"
          />
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-900">
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

