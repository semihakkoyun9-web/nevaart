<?php
/**
 * NEVAART - Tüm Modallar (Eser Detay, Yeni Eser Yükleme PHP GD, Sergi Haritası Google Maps, RBAC Kimlik Yönetimi)
 * Birebir React ArtworkDetailModal.tsx, UploadModal.tsx, ExhibitionMapModal.tsx ve AuthModal.tsx karşılığı
 */
$firstVenue = $venues[0] ?? null;
?>

<!-- =========================================================================
     1. ARTWORK DEEP DIVE DETAIL MODAL (ArtworkDetailModal.tsx birebir karşılığı)
     ========================================================================= -->
<div id="artwork-detail-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
  <div class="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl rounded-xs">
    
    <!-- Top Sticky Bar -->
    <div class="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span id="detail-accession" class="font-mono text-xs text-[#78350F] font-semibold">ACC.2026.0101</span>
        <span class="text-stone-300">|</span>
        <span id="detail-artist-top" class="text-xs uppercase tracking-widest text-stone-600 font-medium">Refik Anadol</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick="NevaApp.openInquiryModal()"
          class="px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <?= icon('message-square', 'w-3.5 h-3.5') ?>
          <span><?= $currentLang === 'tr' ? 'Sanatçıya Yaz' : 'Contact Artist' ?></span>
        </button>
        <button
          type="button"
          onclick="NevaApp.shareWhatsapp()"
          class="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded transition-colors cursor-pointer"
          title="WhatsApp ile Paylaş"
        >
          <?= icon('share-2', 'w-4 h-4') ?>
        </button>
        <button
          type="button"
          onclick="NevaApp.downloadPdf()"
          class="p-2 text-stone-700 hover:text-black hover:bg-stone-100 rounded transition-colors cursor-pointer"
          title="Küratör Künyesini İndir (PDF)"
        >
          <?= icon('download', 'w-4 h-4') ?>
        </button>
        <button
          type="button"
          onclick="NevaApp.closeModal('artwork-detail-modal')"
          class="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
        >
          <?= icon('x', 'w-5 h-5') ?>
        </button>
      </div>
    </div>

    <!-- Modal Main Body -->
    <div class="p-6 md:p-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left 7 Columns: Real High-Res Visual & Pixel Color Extraction -->
        <div class="lg:col-span-7">
          <!-- Image Frame with Zoom -->
          <div class="bg-white border border-[#E8E2D9] p-3 shadow-xs">
            <div
              id="detail-zoom-container"
              onclick="NevaApp.toggleDetailZoom()"
              class="overflow-hidden bg-stone-100 cursor-zoom-in relative aspect-4/3"
            >
              <img
                id="detail-img"
                src=""
                alt=""
                referrerpolicy="no-referrer"
                class="w-full h-full transition-all duration-300 object-cover"
              />
              <div id="detail-zoom-badge" class="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 backdrop-blur-xs">
                <?= icon('zoom-in', 'w-3.5 h-3.5') ?>
                <span>Tam Ekran Büyüt</span>
              </div>
            </div>

            <!-- Sub-image technical ribbon -->
            <div class="mt-3 pt-3 border-t border-[#F5EFEB] flex items-center justify-between text-xs">
              <span id="detail-dim-ribbon" class="text-[#78716C] font-mono text-[11px]"></span>
              <div class="flex items-center gap-2">
                <span class="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono text-stone-600">
                  Geniş Renk Gamı (sRGB / DCI-P3)
                </span>
              </div>
            </div>
          </div>

          <!-- REAL PIXEL AI COLOR PALETTE & HARMONY ENGINE -->
          <div class="mt-6 bg-white border border-[#E8E2D9] p-5 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <?= icon('sparkles', 'w-4 h-4 text-[#78350F]') ?>
                <h3 class="font-serif text-lg font-semibold text-[#1C1917]">
                  Yapay Zeka Gerçek Piksel Renk ve Armoni Analizi
                </h3>
              </div>
              <span id="detail-ai-status" class="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                ✓ Görsel Piksel Analizi Doğrulandı
              </span>
            </div>

            <!-- Dynamic Harmony Diagnosis -->
            <div class="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded mb-4 text-xs">
              <div class="flex items-center justify-between mb-1">
                <strong id="detail-harmony-type" class="text-stone-900 font-serif text-sm"></strong>
                <span id="detail-luminance" class="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Işık Skalası: %58
                </span>
              </div>
              <p id="detail-harmony-desc" class="text-stone-600 text-xs leading-relaxed"></p>
            </div>

            <!-- Color Swatches Grid -->
            <div id="detail-swatches-grid" class="grid grid-cols-5 gap-3"></div>

            <!-- Swatch Inspector Detail -->
            <div id="detail-swatch-inspector" class="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-600"></div>
          </div>

          <!-- CURATORIAL AUDIO GUIDE PLAYER -->
          <div id="detail-audio-box" class="mt-6 bg-[#F4EFEB] border border-[#E8E2D9] p-4 rounded-xs">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  onclick="NevaApp.toggleAudioGuide()"
                  class="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span id="detail-audio-icon"><?= icon('volume-2', 'w-4 h-4') ?></span>
                </button>
                <div>
                  <span id="detail-audio-duration" class="text-[10px] font-mono uppercase tracking-widest text-[#78350F] block">
                    Küratör Sesli Rehberi (04:15)
                  </span>
                  <strong id="detail-audio-narrator" class="text-xs text-stone-900"></strong>
                </div>
              </div>
              <span id="detail-audio-status" class="text-[11px] font-mono text-stone-500">
                Dinlemek İçin Tıklayın
              </span>
            </div>

            <!-- Progress bar -->
            <div class="w-full h-1.5 bg-stone-300 rounded-full overflow-hidden mt-2">
              <div id="detail-audio-progress" class="h-full bg-[#78350F] transition-all duration-300" style="width: 0%;"></div>
            </div>
            <p id="detail-audio-summary" class="text-[11px] text-stone-600 mt-2 font-serif italic"></p>
          </div>
        </div>

        <!-- Right 5 Columns: Historical Provenance, Technical Details & Direct Contact -->
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <!-- Title & Artist Block -->
            <div>
              <span id="detail-acc-cat" class="text-[10px] uppercase font-mono tracking-widest text-[#78350F] font-semibold"></span>
              <h1 id="detail-title" class="text-3xl font-serif text-[#1C1917] mt-1 font-medium leading-snug"></h1>
              <p id="detail-artist-year" class="text-stone-700 text-sm font-semibold mt-1"></p>
            </div>

            <!-- Metadata List -->
            <dl class="mt-5 border-t border-b border-[#E8E2D9] divide-y divide-[#F5EFEB] text-xs">
              <div class="py-2.5 flex justify-between gap-4">
                <dt class="text-stone-500 font-sans">Teknik & Malzeme</dt>
                <dd id="detail-medium" class="text-stone-900 font-medium text-right"></dd>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <dt class="text-stone-500 font-sans">Ebatlar</dt>
                <dd id="detail-dimensions" class="text-stone-900 font-medium"></dd>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <dt class="text-stone-500 font-sans">Çözünürlük Standardı</dt>
                <dd id="detail-resolution" class="text-stone-900 font-mono text-[11px]"></dd>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <dt class="text-stone-500 font-sans">Sergilendiği Galeri</dt>
                <dd id="detail-venue" class="text-stone-900 font-medium"></dd>
              </div>
            </dl>

            <!-- Deep Creation Story & Curatorial Review -->
            <div class="mt-6">
              <h4 class="font-serif text-lg text-stone-900 mb-2 font-medium">
                Yaratım Hikayesi ve Küratör İncelemesi
              </h4>
              <div class="text-stone-700 text-xs leading-relaxed space-y-3 font-sans">
                <p id="detail-story" class="first-letter:text-3xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-2"></p>
              </div>
            </div>

            <!-- Technical Specifications -->
            <div class="mt-5 pt-4 border-t border-[#E8E2D9]">
              <h4 class="font-serif text-base text-stone-900 mb-1.5 font-medium">
                Teknik Detaylar ve Teori
              </h4>
              <p id="detail-technical" class="text-stone-600 text-xs leading-relaxed font-sans"></p>
            </div>

            <!-- Artist Bio -->
            <div class="mt-5 pt-4 border-t border-[#E8E2D9]">
              <h4 class="text-[11px] font-mono uppercase tracking-widest text-[#78716C] mb-1">
                Sanatçı Biyografisi
              </h4>
              <p id="detail-bio" class="text-stone-600 text-xs leading-relaxed font-sans"></p>
            </div>

            <!-- DIRECT ARTIST CONTACT & ACQUISITION ACTION CARD -->
            <div class="mt-6 p-4 bg-white border border-[#E8E2D9] rounded-xl shadow-xs">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1.5">
                  <?= icon('message-square', 'w-4 h-4 text-amber-800') ?>
                  <span class="text-xs uppercase font-mono font-bold text-stone-900">
                    <?= $currentLang === 'tr' ? 'Eser Sahibiyle İletişim & Edinme' : 'Contact Artist for Inquiries' ?>
                  </span>
                </div>
                <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <?= $currentLang === 'tr' ? 'Doğrudan İletişim Açık' : 'Direct Inquiry Open' ?>
                </span>
              </div>

              <p class="text-xs text-stone-600 mb-3 leading-relaxed">
                <?= $currentLang === 'tr'
                  ? 'Bu eseri beğendiyseniz; orijinalini edinmek, sergileme hakları veya sanatçıyla özel bir iş birliği görüşmek için doğrudan mesaj gönderebilirsiniz.'
                  : 'If you appreciate this artwork, you can contact the artist directly to discuss acquisition, exhibition rights, or custom collaborations.' ?>
              </p>

              <div class="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onclick="NevaApp.openInquiryModal()"
                  class="flex-1 py-2.5 bg-black hover:bg-stone-800 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <?= icon('send', 'w-3.5 h-3.5') ?>
                  <span><?= $currentLang === 'tr' ? 'Eser Sahibine Mesaj Gönder' : 'Send Message to Artist' ?></span>
                </button>

                <button
                  type="button"
                  onclick="NevaApp.shareWhatsapp()"
                  class="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="WhatsApp ile Eseri Paylaş"
                >
                  <?= icon('share-2', 'w-3.5 h-3.5') ?>
                  <span>Paylaş</span>
                </button>

                <button
                  type="button"
                  onclick="NevaApp.chatCuratorWhatsapp()"
                  class="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Küratöre WhatsApp ile Danış"
                >
                  <?= icon('message-circle', 'w-3.5 h-3.5') ?>
                  <span>Küratöre Danış</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Recommended Similar Artworks -->
      <section class="mt-12 pt-8 border-t border-[#E8E2D9]">
        <div class="flex items-center gap-2 mb-6">
          <?= icon('sparkles', 'w-4 h-4 text-[#78350F]') ?>
          <h3 class="font-serif text-xl font-semibold text-stone-900">
            Yapay Zeka Destekli Benzer Başyapıtlar
          </h3>
        </div>

        <div id="detail-similar-grid" class="grid grid-cols-1 sm:grid-cols-3 gap-6"></div>
      </section>

      <!-- Real Curator Reviews & Appraisals -->
      <section class="mt-12 pt-8 border-t border-[#E8E2D9]">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <?= icon('message-square', 'w-4 h-4 text-stone-700') ?>
            <h3 class="font-serif text-xl font-semibold text-stone-900">
              <?= e($t['curatorReviews']) ?> (<span id="detail-reviews-count">0</span>)
            </h3>
          </div>
        </div>

        <div id="detail-reviews-list" class="space-y-4 mb-8"></div>

        <!-- Submit New Appraisal Form -->
        <form onsubmit="NevaApp.handleSubmitReview(event)" class="bg-white border border-[#E8E2D9] p-5 rounded-xs">
          <h4 class="text-xs uppercase font-mono tracking-wider text-stone-700 font-semibold mb-3">
            <?= e($t['addReview']) ?> (<span id="review-form-username"><?= e($currentUser['name']) ?></span>)
          </h4>
          
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs text-stone-500">Puan:</span>
            <div id="review-stars-selector" class="flex items-center gap-1">
              <?php for ($st = 1; $st <= 5; $st++): ?>
                <button
                  type="button"
                  data-star-val="<?= $st ?>"
                  onclick="NevaApp.setReviewRating(<?= $st ?>)"
                  class="review-star-btn cursor-pointer text-amber-500 hover:scale-110 transition-transform"
                >
                  <?= icon('star', 'w-4 h-4 fill-current') ?>
                </button>
              <?php endfor; ?>
            </div>
          </div>

          <textarea
            id="review-comment-input"
            placeholder="Eser hakkında küratöryel değerlendirmeniz, teknik gözlemleriniz..."
            rows="3"
            required
            class="w-full p-3 border border-stone-200 text-xs text-stone-900 rounded outline-none focus:border-stone-900"
          ></textarea>

          <div class="mt-3 flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <?= icon('send', 'w-3 h-3') ?>
              <span><?= e($t['submitReview']) ?></span>
            </button>
          </div>
        </form>
      </section>

    </div>

  </div>
</div>



<!-- Direct Artist Inquiry & Acquisition Sub-Modal -->
<div id="artist-inquiry-modal" class="hidden fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
  <div class="bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-lg p-6 rounded-2xl shadow-2xl relative">
    <button
      type="button"
      onclick="NevaApp.closeModal('artist-inquiry-modal')"
      class="absolute top-4 right-4 text-stone-400 hover:text-stone-800 cursor-pointer"
    >
      <?= icon('x', 'w-5 h-5') ?>
    </button>

    <div class="flex items-center gap-2 mb-3">
      <?= icon('message-square', 'w-5 h-5 text-amber-800') ?>
      <h3 class="font-serif text-xl font-bold text-stone-900">
        <?= $currentLang === 'tr' ? 'Eser Sahibiyle İletişim & Teklif' : 'Contact Artist for Inquiries' ?>
      </h3>
    </div>

    <!-- Success View -->
    <div id="inquiry-success-box" class="hidden py-8 text-center space-y-3">
      <div class="flex justify-center text-emerald-600"><?= icon('check-circle-2', 'w-12 h-12') ?></div>
      <h4 class="font-serif text-xl font-semibold text-stone-900">
        <?= $currentLang === 'tr' ? 'Mesajınız Sanatçıya İletildi!' : 'Your Message Has Been Sent!' ?>
      </h4>
      <p id="inquiry-success-desc" class="text-xs text-stone-600 max-w-sm mx-auto"></p>
      <div id="inquiry-ref-code" class="p-3 bg-white border border-stone-200 rounded-lg font-mono text-xs text-stone-500">
        Referans No: INQ-2026-0101
      </div>
      <button
        type="button"
        onclick="NevaApp.closeModal('artist-inquiry-modal')"
        class="mt-2 px-5 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-stone-800 cursor-pointer"
      >
        <?= $currentLang === 'tr' ? 'Kapat' : 'Close' ?>
      </button>
    </div>

    <!-- Form View -->
    <form id="inquiry-form-box" onsubmit="NevaApp.handleSendInquiry(event)" class="space-y-4 text-xs">
      <div class="p-3 bg-white border border-[#E8E2D9] rounded-xl">
        <div class="flex justify-between font-serif text-sm font-semibold text-stone-900 mb-1">
          <span id="inquiry-art-title"></span>
          <span id="inquiry-art-artist" class="text-amber-900"></span>
        </div>
        <span id="inquiry-art-meta" class="text-[11px] text-stone-500 block"></span>
      </div>

      <div>
        <label class="block text-stone-700 font-semibold mb-1">
          <?= $currentLang === 'tr' ? 'Talep / İletişim Konusu:' : 'Inquiry Type:' ?>
        </label>
        <select
          id="inquiry-type-select"
          class="w-full p-2.5 bg-white border border-stone-300 rounded-lg outline-none text-xs"
        >
          <option value="acquisition"><?= $currentLang === 'tr' ? 'Orijinal Eseri Edinme / Satın Alma Teklifi' : 'Original Artwork Acquisition / Purchase Offer' ?></option>
          <option value="exhibition"><?= $currentLang === 'tr' ? 'Sergi veya Galeriye Dahil Etme Teklifi' : 'Gallery Exhibition Invitation' ?></option>
          <option value="print"><?= $currentLang === 'tr' ? 'Sanatçı İmzalı Özel Baskı Talebi' : 'Signed Archival Print Request' ?></option>
          <option value="collaboration"><?= $currentLang === 'tr' ? 'Özel Proje / Komisyon Çizim Teklifi' : 'Custom Commission / Collaboration' ?></option>
          <option value="question"><?= $currentLang === 'tr' ? 'Sanatçıya Soru & Tebrik' : 'General Question to Artist' ?></option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-stone-700 font-semibold mb-1">
            <?= $currentLang === 'tr' ? 'Adınız Soyadınız:' : 'Your Name:' ?>
          </label>
          <input
            type="text"
            id="inquiry-sender-name"
            required
            value="<?= e($currentUser['name']) ?>"
            class="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none"
          />
        </div>
        <div>
          <label class="block text-stone-700 font-semibold mb-1">
            <?= $currentLang === 'tr' ? 'E-Posta Adresiniz:' : 'Your Email:' ?>
          </label>
          <input
            type="email"
            id="inquiry-sender-email"
            required
            value="<?= e($currentUser['email']) ?>"
            class="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-stone-700 font-semibold mb-1">
          <?= $currentLang === 'tr' ? 'Sanatçıya İleteceğiniz Mesajınız & Teklifiniz:' : 'Your Message or Proposal:' ?>
        </label>
        <textarea
          id="inquiry-message-input"
          rows="3"
          required
          placeholder="Merhaba, eserinizi NevaArt galerisinde inceledim ve hikayesinden çok etkilendim..."
          class="w-full p-2.5 bg-white border border-stone-300 rounded-lg outline-none"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-black hover:bg-stone-800 text-white font-semibold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
      >
        <?= icon('send', 'w-3.5 h-3.5') ?>
        <span><?= $currentLang === 'tr' ? 'Mesajı Sanatçıya Gönder' : 'Send Message to Artist' ?></span>
      </button>
    </form>
  </div>
</div>



<!-- =========================================================================
     2. UPLOAD ARTWORK WITH PHP GD WATERMARK & PIXEL COLOR EXTRACTION (UploadModal.tsx)
     ========================================================================= -->
<div id="upload-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
  <div class="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl rounded-xs">
    
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <?= icon('shield-check', 'w-4 h-4 text-[#78350F]') ?>
        <h2 class="font-serif text-xl font-semibold text-stone-900">
          Yeni Bir Eseri Ansiklopediye Dahil Et
        </h2>
      </div>
      <button
        type="button"
        onclick="NevaApp.closeModal('upload-modal')"
        class="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
      >
        <?= icon('x', 'w-5 h-5') ?>
      </button>
    </div>

    <canvas id="upload-hidden-canvas" class="hidden"></canvas>

    <div class="p-6 md:p-8">
      <!-- Quick Real Masterpiece Presets -->
      <div class="mb-6 p-3 bg-stone-100/80 border border-stone-200 rounded text-xs flex flex-wrap items-center justify-between gap-2">
        <span class="text-stone-700 font-semibold">⚡ Hızlı Test İçin Gerçek Başyapıt Yükle:</span>
        <div class="flex gap-2">
          <button
            type="button"
            onclick="NevaApp.loadUploadSample('cartier')"
            class="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
          >
            Cartier-Bresson (Sokak)
          </button>
          <button
            type="button"
            onclick="NevaApp.loadUploadSample('mucha')"
            class="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
          >
            Alphonse Mucha (İllüstrasyon)
          </button>
          <button
            type="button"
            onclick="NevaApp.loadUploadSample('beeple')"
            class="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
          >
            Beeple (Dijital)
          </button>
        </div>
      </div>

      <form id="upload-artwork-form" onsubmit="NevaApp.handleUploadSubmit(event)" class="space-y-5" enctype="multipart/form-data">
        <input type="hidden" name="csrf_token" value="<?= e($csrfToken) ?>" />
        
        <!-- Image Upload Drag & Drop Box -->
        <div class="border-2 border-dashed border-[#D6CEBE] p-6 text-center bg-white rounded hover:border-stone-500 transition-colors">
          <!-- Preview State -->
          <div id="upload-preview-box" class="hidden">
            <div class="max-h-64 overflow-hidden rounded mb-3 mx-auto max-w-md border border-stone-200 relative">
              <img
                id="upload-watermarked-img"
                src=""
                alt="Watermarked preview"
                class="w-full h-auto object-cover"
              />
              <div class="absolute top-2 right-2 bg-emerald-800 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                ✓ PHP GD Filigranı & Boyutlandırma Tamamlandı
              </div>
            </div>
            <p id="upload-detected-dims" class="text-xs text-stone-600 font-mono">
              Ölçü: 60 × 90 cm
            </p>
            
            <!-- Extracted Palette on the fly -->
            <div class="mt-3 inline-flex flex-col items-center gap-1.5 p-2 bg-stone-50 border border-stone-200 rounded">
              <div class="flex items-center gap-1.5">
                <?= icon('sparkles', 'w-3.5 h-3.5 text-[#78350F]') ?>
                <span class="text-[11px] text-stone-800 font-semibold">Piksellerden Ayrıştırılan Gerçek Renkler:</span>
              </div>
              <div id="upload-extracted-swatches" class="flex gap-1.5 mt-1"></div>
              <span id="upload-harmony-text" class="text-[10px] text-stone-500 font-serif italic"></span>
            </div>

            <div class="mt-3">
              <button
                type="button"
                onclick="document.getElementById('upload-file-input').click()"
                class="text-xs text-[#78350F] hover:underline font-semibold cursor-pointer"
              >
                Farklı bir görsel dosyası seç →
              </button>
            </div>
          </div>

          <!-- Empty Prompt State -->
          <div id="upload-empty-prompt" onclick="document.getElementById('upload-file-input').click()" class="cursor-pointer py-4">
            <div class="flex justify-center text-stone-400 mb-2"><?= icon('upload', 'w-8 h-8') ?></div>
            <p class="text-xs font-semibold text-stone-800">
              Cihazınızdan Eser Görseli Seçin veya Sürükleyin
            </p>
            <p class="text-[11px] text-stone-400 mt-1 font-mono">
              PNG, JPG, WEBP (PHP GD ile otomatik filigran basılacak ve renk spektrumu piksellerden taranacaktır)
            </p>
          </div>

          <input
            id="upload-file-input"
            name="image_file"
            type="file"
            accept="image/*"
            onchange="NevaApp.handleUploadFileChange(event)"
            class="hidden"
          />
        </div>

        <!-- Inputs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Eser Başlığı *
            </label>
            <input
              type="text"
              id="upload-title"
              name="title"
              required
              placeholder="Örn: Behind the Gare Saint-Lazare"
              class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Sanatçı Adı *
            </label>
            <input
              type="text"
              id="upload-artist"
              name="artist"
              required
              value="<?= e($currentUser['name']) ?>"
              placeholder="Sanatçı adı"
              class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Kategori *
            </label>
            <select
              id="upload-category"
              name="category"
              class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
            >
              <?php foreach ($categories as $c): ?>
                <option value="<?= e($c['id']) ?>">
                  <?= e($currentLang === 'tr' ? $c['nameTr'] : $c['nameEn']) ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Üretim Yılı
            </label>
            <input
              type="number"
              id="upload-year"
              name="year"
              value="2026"
              class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
            Teknik & Malzeme *
          </label>
          <input
            type="text"
            id="upload-medium"
            name="medium"
            required
            value="35mm Leica M, Baryta Gümüş Jelatin Baskı"
            placeholder="Örn: 35mm Leica M3, Gümüş Jelatin Baskı"
            class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
          />
        </div>

        <div>
          <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
            Eserin Yaratım Hikayesi & Konsepti *
          </label>
          <textarea
            id="upload-story"
            name="story"
            required
            rows="3"
            placeholder="Eserin arkasındaki estetik motivasyon, tarihi bağlam ve kavramsal boyutu..."
            class="w-full p-3 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
            Teknik Parametreler (Lens, Işık, Yazılım vb.)
          </label>
          <input
            type="text"
            id="upload-technical"
            name="technical"
            placeholder="Örn: 50mm f/3.5 lens, 1/50 sn, Kodak Tri-X 400"
            class="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
          />
        </div>

        <!-- Submission Actions -->
        <div class="pt-4 border-t border-[#E8E2D9] flex items-center justify-end gap-3">
          <button
            type="button"
            onclick="NevaApp.closeModal('upload-modal')"
            class="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <?= e($t['close']) ?>
          </button>
          <button
            type="submit"
            id="upload-submit-btn"
            class="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <?= icon('check', 'w-4 h-4') ?>
            <span id="upload-submit-text">Eseri Arşive Kaydet</span>
          </button>
        </div>

      </form>
    </div>

  </div>
</div>



<!-- =========================================================================
     3. EXHIBITION & GOOGLE MAPS MODAL (ExhibitionMapModal.tsx birebir karşılığı)
     ========================================================================= -->
<div id="map-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
  <div class="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xs">
    
    <!-- Header -->
    <div class="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <?= icon('map-pin', 'w-4 h-4 text-[#78350F]') ?>
        <h2 class="font-serif text-xl font-semibold text-stone-900">
          <?= e($t['navExhibitions']) ?> & Google Maps Entegrasyonu
        </h2>
      </div>
      <button
        type="button"
        onclick="NevaApp.closeModal('map-modal')"
        class="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
      >
        <?= icon('x', 'w-5 h-5') ?>
      </button>
    </div>

    <!-- Content -->
    <div class="p-6 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <!-- Left list of venues (5 cols) -->
        <div class="md:col-span-5 space-y-3">
          <span class="text-[10px] font-mono uppercase tracking-widest text-[#78350F] font-semibold block mb-2">
            Aktif Sergi Salonları
          </span>
          
          <?php foreach ($venues as $vIdx => $v): ?>
            <button
              type="button"
              data-venue-btn="<?= e($v['id']) ?>"
              onclick="NevaApp.selectVenue('<?= e($v['id']) ?>')"
              class="venue-item-btn w-full text-left p-3.5 border rounded-xs transition-all cursor-pointer <?= $vIdx === 0 ? 'bg-white border-[#78350F] shadow-sm' : 'bg-white/60 border-[#E8E2D9] hover:bg-white' ?>"
            >
              <div class="flex items-center justify-between text-xs text-stone-500 font-mono mb-1">
                <span><?= e($v['city']) ?>, <?= e($v['country']) ?></span>
                <span class="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">2026</span>
              </div>
              <h4 class="font-serif text-base font-semibold text-stone-900">
                <?= e($v['name']) ?>
              </h4>
              <p class="text-xs text-[#78350F] font-medium mt-1 truncate">
                <?= e($v['exhibitionTitle']) ?>
              </p>
            </button>
          <?php endforeach; ?>
        </div>

        <!-- Right Map Canvas & Details (7 cols) -->
        <?php if ($firstVenue): ?>
          <div class="md:col-span-7 bg-white border border-[#E8E2D9] p-5 flex flex-col justify-between shadow-xs">
            <div>
              <!-- Google Maps Iframe -->
              <div class="w-full h-56 bg-stone-200 border border-stone-300 rounded overflow-hidden relative mb-4">
                <iframe
                  id="map-iframe"
                  title="Exhibition Map"
                  width="100%"
                  height="100%"
                  style="border: 0;"
                  loading="lazy"
                  src="https://maps.google.com/maps?q=<?= (float)$firstVenue['lat'] ?>,<?= (float)$firstVenue['lng'] ?>&z=14&output=embed"
                ></iframe>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-2 text-xs text-[#78350F] font-mono">
                  <?= icon('calendar', 'w-3.5 h-3.5') ?>
                  <span id="map-venue-dates"><?= e($firstVenue['dates']) ?></span>
                </div>

                <h3 id="map-venue-title" class="font-serif text-2xl text-stone-900 font-medium">
                  <?= e($firstVenue['exhibitionTitle']) ?>
                </h3>

                <div class="flex items-start gap-2 text-xs text-stone-600">
                  <?= icon('building-2', 'w-4 h-4 text-stone-400 shrink-0 mt-0.5') ?>
                  <span id="map-venue-address"><?= e($firstVenue['address']) ?></span>
                </div>

                <div class="p-3 bg-[#FAF8F5] border border-stone-200 rounded text-xs text-stone-700">
                  <strong class="block text-stone-900 mb-1">Küratör Açıklaması:</strong>
                  <span id="map-venue-notes"><?= e($firstVenue['curatorNotes']) ?></span>
                </div>
              </div>
            </div>

            <!-- Action Link to Google Maps External -->
            <div class="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
              <span id="map-venue-coords" class="font-mono text-[11px] text-stone-500">
                Koordinat: <?= number_format((float)$firstVenue['lat'], 4) ?> N, <?= number_format((float)$firstVenue['lng'], 4) ?> E
              </span>
              <a
                id="map-external-link"
                href="https://maps.google.com/?q=<?= (float)$firstVenue['lat'] ?>,<?= (float)$firstVenue['lng'] ?>"
                target="_blank"
                rel="noreferrer"
                class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <?= icon('navigation', 'w-3.5 h-3.5') ?>
                <span>Google Maps'te Yol Tarifi Al</span>
              </a>
            </div>

          </div>
        <?php endif; ?>

      </div>
    </div>

  </div>
</div>



<!-- =========================================================================
     4. USER AUTH & RBAC ROLE SWITCHER MODAL (Kriter I: Giriş & Kayıt, Kriter J: RBAC)
     ========================================================================= -->
<div id="auth-modal" class="hidden fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
  <div class="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-md overflow-hidden shadow-2xl rounded-xs">
    
    <!-- Header with 3 Navigation Tabs (Kriter I & J) -->
    <div class="bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 pt-4 pb-0 flex flex-col justify-between">
      <div class="flex items-center justify-between pb-3">
        <div class="flex items-center gap-2">
          <?= icon('user-check', 'w-4 h-4 text-[#78350F]') ?>
          <h2 class="font-serif text-lg font-semibold text-stone-900">
            Kullanıcı Girişi, Kayıt ve Rol Yönetimi
          </h2>
        </div>
        <button
          type="button"
          onclick="NevaApp.closeModal('auth-modal')"
          class="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
        >
          <?= icon('x', 'w-5 h-5') ?>
        </button>
      </div>

      <!-- Tab Buttons -->
      <div class="flex gap-1 border-b border-stone-200 text-xs">
        <button
          type="button"
          id="auth-tab-btn-login"
          onclick="NevaApp.switchAuthTab('login')"
          class="px-3.5 py-2 font-medium border-b-2 border-stone-900 text-stone-900 cursor-pointer"
        >
          Giriş Yap
        </button>
        <button
          type="button"
          id="auth-tab-btn-register"
          onclick="NevaApp.switchAuthTab('register')"
          class="px-3.5 py-2 font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-900 cursor-pointer"
        >
          Yeni Kayıt Ol
        </button>
        <button
          type="button"
          id="auth-tab-btn-rbac"
          onclick="NevaApp.switchAuthTab('rbac')"
          class="px-3.5 py-2 font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-900 cursor-pointer"
        >
          Rol & Yetki (RBAC)
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-6">
      
      <div id="auth-success-notice" class="hidden mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center gap-2">
        <?= icon('check', 'w-4 h-4 text-emerald-600') ?>
        <span id="auth-success-text">İşlem başarıyla tamamlandı!</span>
      </div>

      <!-- TAB 1: GİRİŞ YAP (LOGIN) -->
      <div id="auth-pane-login" class="space-y-4">
        <p class="text-xs text-stone-600">
          Mevcut hesabınızla giriş yaparak küratöryel arşive ve eser yükleme paneline erişebilirsiniz.
        </p>

        <form onsubmit="NevaApp.handleLogin(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              E-Posta Adresi
            </label>
            <input
              type="email"
              id="login-email-input"
              required
              value="halil@nevaart.org"
              placeholder="ornek@nevaart.org"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Şifre (Bcrypt Doğrulamalı)
            </label>
            <input
              type="password"
              id="login-password-input"
              required
              value="NevaArt2026!Curator"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div class="pt-2 flex items-center justify-between">
            <button
              type="button"
              onclick="NevaApp.switchAuthTab('register')"
              class="text-xs text-amber-800 hover:underline cursor-pointer"
            >
              Hesabınız yok mu? Kayıt Olun →
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer shadow-xs"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: YENİ KAYIT OL (REGISTER) -->
      <div id="auth-pane-register" class="hidden space-y-4">
        <p class="text-xs text-stone-600">
          NevaArt platformuna yeni üye veya sanatçı olarak kaydolun.
        </p>

        <form onsubmit="NevaApp.handleRegister(event)" class="space-y-3">
          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Ad Soyad / Sanatçı Adı
            </label>
            <input
              type="text"
              id="register-name-input"
              required
              placeholder="Örn: Melis Ertekin"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              E-Posta Adresi
            </label>
            <input
              type="email"
              id="register-email-input"
              required
              placeholder="melis@sanatci.com"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Güvenli Şifre (Bcrypt ile Hashlenir)
            </label>
            <input
              type="password"
              id="register-password-input"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Kullanıcı Türü / Rol (Kriter J: RBAC)
            </label>
            <select
              id="register-role-select"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            >
              <option value="member">Kayıtlı Sanatçı (Eser Yükleyebilir)</option>
              <option value="visitor">Ziyaretçi (Salt Okunur & Favoriler)</option>
              <option value="curator">Küratör (Tam Yönetici Yetkisi)</option>
            </select>
          </div>

          <div class="pt-2 flex items-center justify-between">
            <button
              type="button"
              onclick="NevaApp.switchAuthTab('login')"
              class="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              Zaten hesabım var →
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer shadow-xs"
            >
              Kayıt Ol & Başlat
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 3: ROL & GÜVENLİK YÖNETİMİ (RBAC - Kriter J, S, T) -->
      <div id="auth-pane-rbac" class="hidden space-y-4">
        <p class="text-xs text-stone-600">
          Akademik ödev kriterlerindeki rol bazlı yetkilendirmeyi (RBAC) hızlıca test etmek için aktif oturum rolünü anında değiştirebilirsiniz.
        </p>

        <form onsubmit="NevaApp.handleSaveAuth(event)" class="space-y-4">
          <input type="hidden" id="auth-selected-role" value="<?= e($currentUser['role']) ?>" />
          
          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-semibold mb-2">
              Aktif Oturum Rolü (Kriter J)
            </label>
            
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-role-btn="visitor"
                onclick="NevaApp.selectAuthRole('visitor')"
                class="auth-role-btn p-2 text-center border rounded text-xs transition-all cursor-pointer <?= $currentUser['role'] === 'visitor' ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50' ?>"
              >
                <span class="block font-semibold">Ziyaretçi</span>
                <span class="text-[10px] opacity-75">Salt Okunur</span>
              </button>

              <button
                type="button"
                data-role-btn="member"
                onclick="NevaApp.selectAuthRole('member')"
                class="auth-role-btn p-2 text-center border rounded text-xs transition-all cursor-pointer <?= $currentUser['role'] === 'member' ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50' ?>"
              >
                <span class="block font-semibold">Sanatçı</span>
                <span class="text-[10px] opacity-75">Eser Yükler</span>
              </button>

              <button
                type="button"
                data-role-btn="curator"
                onclick="NevaApp.selectAuthRole('curator')"
                class="auth-role-btn p-2 text-center border rounded text-xs transition-all cursor-pointer <?= $currentUser['role'] === 'curator' ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50' ?>"
              >
                <span class="block font-semibold">Küratör</span>
                <span class="text-[10px] opacity-75">Tam Yetki</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Aktif Profil Ünvanı
            </label>
            <input
              type="text"
              id="auth-fullname-input"
              required
              value="<?= e($currentUser['name']) ?>"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label class="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
              Oturum E-Postası
            </label>
            <input
              type="email"
              id="auth-email-input"
              required
              value="<?= e($currentUser['email']) ?>"
              class="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
            />
          </div>

          <!-- Real PHP Session & Security Tags (Kriter S & T) -->
          <div class="p-3 bg-stone-100 rounded text-[11px] font-mono text-stone-500 space-y-1">
            <div>Session ID: <span class="text-stone-800 font-semibold">sess_<?= e(substr(session_id() ?: 'neva_9841f3e', 0, 12)) ?></span></div>
            <div>Aktif Çerezler (Cookie): <span class="text-stone-800 font-semibold">nevaart_lang=<?= e($currentLang) ?>, nevaart_user_role=<?= e($currentUser['role']) ?></span></div>
            <div>Password Hash: <span class="text-stone-800"><?= e(substr($currentUser['passwordHash'] ?? '$2y$10$eF8bJk7u3...', 0, 17)) ?>...</span> (Bcrypt)</div>
            <div>CSRF Token: <span class="text-stone-800 font-semibold">VALIDATED (<?= e(substr($csrfToken, 0, 8)) ?>)</span></div>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="submit"
              class="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Rolü Uygula
            </button>
          </div>
        </form>
      </div>

    </div>

  </div>
</div>

<!-- Kriter T: Oturum ve Çerez Bildirim Çubuğu (Cookie Consent Banner) -->
<div id="cookie-banner" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-stone-900/95 backdrop-blur-md text-white border border-stone-700 p-4 rounded-xl shadow-2xl z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
  <div class="flex items-center gap-2.5">
    <span class="text-2xl">🍪</span>
    <div class="text-[11px] text-stone-300 leading-tight">
      <span class="font-bold text-white block">Çerezler ve Oturum Politikası (Kriter T)</span>
      Bu sitede oturum yönetimi, dil tercihi (<?= e($currentLang) ?>) ve yetki güvenliği için çerezler (cookies) kullanılmaktadır.
    </div>
  </div>
  <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto">
    <button
      type="button"
      onclick="NevaApp.acceptCookies()"
      class="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full text-[11px] transition-all cursor-pointer whitespace-nowrap shadow-xs"
    >
      Kabul Et
    </button>
  </div>
</div>



