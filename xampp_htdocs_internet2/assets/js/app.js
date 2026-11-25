/**
 * NEVAART - İstemci Tarafı Etkileşim ve 3D Panoramik Galeri Motoru (PHP Backend Bağlantılı)
 * Kriter P (JavaScript ile etkileşimli arayüz), Kriter M (Yapay zeka piksel analizi), Kriter Z (UX)
 */

window.NevaApp = (function () {
  // PHP'den gelen başlangıç verileri (window.NEVA_INITIAL_STATE)
  let state = {
    lang: 'tr',
    artworks: [],
    categories: [],
    reviews: [],
    venues: [],
    currentUser: { id: 1, name: 'Prof. Dr. Halil Erdem', email: 'halil@nevaart.org', role: 'curator' },
    selectedArtwork: null,
    selectedColorDetail: null,
    isZoomed: false,
    reviewRating: 5,
    isPlayingAudio: false,
    audioProgress: 0,
    audioTimer: null,
    activeCategory: 'all',
    activeColor: 'all',
    searchQuery: '',
    testimonialIndex: 0,
    uploadWatermarkedDataUrl: null,
    uploadExtractedPalette: [],
    uploadDetectedDimensions: '60 × 90 cm',
    uploadHarmonyDiagnosed: 'Görsel piksellerinden çıkarılan tonal harmoni.',
    likedIds: [1, 3]
  };

  // 3D Panoramik Karusel Fizik Değişkenleri (Birebir PanoramicGalleryShowcase.tsx)
  let carousel = {
    activeIndex: 0,
    isPlaying: true,
    isDragging: false,
    isHovered: false,
    currentAngle: 0,
    targetAngle: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    totalDragDistance: 0,
    radii: { rx: 490, rz: 320 }
  };

  function init(initialData) {
    if (initialData) {
      state.lang = initialData.lang || 'tr';
      state.artworks = initialData.artworks || [];
      state.categories = initialData.categories || [];
      state.reviews = initialData.reviews || [];
      state.venues = initialData.venues || [];
      state.currentUser = initialData.currentUser || state.currentUser;
    }

    initCarousel();

    // SEO dostu URL (?eser=slug) ile gelindiyse ilgili eserin detay modalını aç
    if (initialData && initialData.initialSlug) {
      const found = state.artworks.find((a) => a.slug === initialData.initialSlug);
      if (found) {
        openArtworkModal(found.id);
      }
    }

    checkCookieBanner();

    try {
      const saved = localStorage.getItem('nevaart_liked_ids');
      if (saved) state.likedIds = JSON.parse(saved);
    } catch (e) {}
    renderLikeStates();
  }

  // Kriter T: Çerez İzin Kontrolü ve Kaydı
  function checkCookieBanner() {
    if (document.cookie.indexOf('nevaart_cookie_consent=1') !== -1) {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.style.display = 'none';
    }
  }

  function acceptCookies() {
    document.cookie = "nevaart_cookie_consent=1; path=/; max-age=" + (86400 * 30);
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
    showToast('Çerez tercihleriniz kaydedildi (Kriter T).');
  }

  // Toast Bildirim Gösterimi
  function showToast(msg) {
    const toast = document.getElementById('neva-toast');
    const textEl = document.getElementById('neva-toast-text');
    if (!toast || !textEl) return;
    textEl.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(window.__nevaToastTimer);
    window.__nevaToastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // Bölüme Yumuşak Kaydırma
  function scrollToSection(id, tabName) {
    document.querySelectorAll('.nav-pill-btn').forEach((btn) => {
      btn.className = 'nav-pill-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-stone-700 hover:text-black hover:bg-stone-200/50';
    });
    const activeBtn = document.getElementById('nav-tab-' + tabName);
    if (activeBtn) {
      activeBtn.className = 'nav-pill-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer bg-black text-white shadow-xs';
    }

    if (tabName === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // =========================================================================
  // 1. 3D PANORAMİK KARUSEL FİZİK MOTORU (120fps requestAnimationFrame)
  // =========================================================================
  function getRadii() {
    if (window.innerWidth < 640) return { rx: 270, rz: 190 };
    if (window.innerWidth < 1024) return { rx: 380, rz: 260 };
    return { rx: 490, rz: 320 };
  }

  function initCarousel() {
    const stage = document.getElementById('carousel-stage-container');
    const heroSection = document.getElementById('hero');
    if (!stage) return;

    carousel.radii = getRadii();
    window.addEventListener('resize', () => {
      carousel.radii = getRadii();
    });

    stage.addEventListener('pointerdown', (e) => {
      carousel.isDragging = true;
      stage.classList.remove('cursor-grab');
      stage.classList.add('cursor-grabbing');
      carousel.velocity = 0;
      carousel.lastX = e.clientX;
      carousel.totalDragDistance = 0;
      carousel.lastTime = performance.now();
    });

    window.addEventListener('pointermove', (e) => {
      if (!carousel.isDragging) return;
      const now = performance.now();
      const dt = Math.max(now - carousel.lastTime, 8);
      const deltaX = e.clientX - carousel.lastX;
      carousel.totalDragDistance += Math.abs(deltaX);

      carousel.targetAngle += deltaX * 0.35;
      const instVel = (deltaX / dt) * 14;
      carousel.velocity = carousel.velocity * 0.4 + instVel * 0.6;

      carousel.lastX = e.clientX;
      carousel.lastTime = now;
    });

    const endDrag = () => {
      if (!carousel.isDragging) return;
      carousel.isDragging = false;
      stage.classList.remove('cursor-grabbing');
      stage.classList.add('cursor-grab');
      carousel.velocity = Math.max(Math.min(carousel.velocity, 10), -10);
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    stage.addEventListener('mouseenter', () => { carousel.isHovered = true; });
    stage.addEventListener('mouseleave', () => { carousel.isHovered = false; });

    if (heroSection) {
      heroSection.addEventListener('keydown', (e) => {
        const count = state.artworks.length || 1;
        const angleStep = 360 / count;
        if (e.key === 'ArrowLeft') {
          carousel.velocity = 0;
          carousel.targetAngle = Math.round(carousel.targetAngle / angleStep) * angleStep + angleStep;
        } else if (e.key === 'ArrowRight') {
          carousel.velocity = 0;
          carousel.targetAngle = Math.round(carousel.targetAngle / angleStep) * angleStep - angleStep;
        } else if (e.key === ' ') {
          e.preventDefault();
          carousel.isPlaying = !carousel.isPlaying;
        }
      });
    }

    const loop = () => {
      if (!carousel.isDragging) {
        if (Math.abs(carousel.velocity) > 0.02) {
          carousel.targetAngle += carousel.velocity;
          carousel.velocity *= 0.93;
        } else {
          carousel.velocity = 0;
          if (carousel.isPlaying) {
            const speedMultiplier = carousel.isHovered ? 0.3 : 1.0;
            carousel.targetAngle -= 0.16 * speedMultiplier;
          }
        }
      }

      const lerp = carousel.isDragging ? 0.25 : 0.085;
      carousel.currentAngle += (carousel.targetAngle - carousel.currentAngle) * lerp;
      updateCardTransforms(carousel.currentAngle);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  function updateCardTransforms(angle) {
    const cards = document.querySelectorAll('[data-carousel-card]');
    const count = cards.length;
    if (!count) return;

    const angleStep = 360 / count;
    const { rx } = carousel.radii;

    const normalized = ((-angle % 360) + 360) % 360;
    const newActive = Math.round(normalized / angleStep) % count;

    if (newActive !== carousel.activeIndex) {
      carousel.activeIndex = newActive;
      updateCarouselSpotlight(newActive);
    }

    cards.forEach((el, i) => {
      let relAngle = ((angle + i * angleStep) % 360 + 360) % 360;
      if (relAngle > 180) relAngle -= 360;

      const rad = (relAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad);
      const sinVal = Math.sin(rad);

      if (cosVal < 0.05) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '0';
        el.style.transform = 'translate3d(0, 500px, 0) scale(0.5)';
        return;
      }

      el.style.pointerEvents = 'auto';
      const x = sinVal * rx;
      const y = (1 - cosVal) * 8;
      const distRatio = Math.max(0, (cosVal - 0.05) / 0.95);
      const scale = 0.72 + 0.31 * Math.pow(distRatio, 1.3);
      const opacity = Math.min(1, Math.max(0.08, Math.pow(distRatio, 1.5)));
      const zIndex = Math.round(cosVal * 200);
      const rotY = -relAngle * 0.6;
      const blurAmount = distRatio < 0.55 ? (0.55 - distRatio) * 2.5 : 0;
      const brightness = 0.78 + 0.25 * distRatio;

      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = `${zIndex}`;
      el.style.filter = `blur(${blurAmount.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;

      const badge = el.querySelector('[data-featured-badge]');
      if (i === newActive) {
        el.classList.add('ring-2', 'ring-black', 'shadow-2xl');
        if (badge) { badge.classList.remove('hidden'); badge.classList.add('flex'); }
      } else {
        el.classList.remove('ring-2', 'ring-black', 'shadow-2xl');
        if (badge) { badge.classList.add('hidden'); badge.classList.remove('flex'); }
      }
    });
  }

  function updateCarouselSpotlight(index) {
    const art = state.artworks[index];
    if (!art) return;

    const imgEl = document.getElementById('spotlight-img');
    const titleEl = document.getElementById('spotlight-title');
    const metaEl = document.getElementById('spotlight-meta');

    if (imgEl) imgEl.src = art.imageUrl;
    if (titleEl) titleEl.textContent = art.title;
    if (metaEl) {
      const med = state.lang === 'tr' ? art.mediumTr : art.mediumEn;
      metaEl.textContent = `${art.artist} · ${med}`;
    }

    document.querySelectorAll('[data-carousel-dot]').forEach((dot, idx) => {
      dot.className = idx === index
        ? 'transition-all duration-300 rounded-full cursor-pointer w-7 h-1.5 bg-black'
        : 'transition-all duration-300 rounded-full cursor-pointer w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400';
    });
  }

  function carouselPrev(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const count = Math.max(1, state.artworks.length);
    const angleStep = 360 / count;
    carousel.velocity = 0;
    carousel.targetAngle = Math.round(carousel.targetAngle / angleStep) * angleStep + angleStep;
  }

  function carouselNext(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const count = Math.max(1, state.artworks.length);
    const angleStep = 360 / count;
    carousel.velocity = 0;
    carousel.targetAngle = Math.round(carousel.targetAngle / angleStep) * angleStep - angleStep;
  }

  function rotateToCard(index) {
    const count = Math.max(1, state.artworks.length);
    const angleStep = 360 / count;
    carousel.velocity = 0;
    let diff = index - carousel.activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    carousel.targetAngle -= diff * angleStep;
  }

  function handleCarouselCardClick(artworkId) {
    if (carousel.totalDragDistance < 8) {
      openArtworkModal(artworkId);
    }
  }

  function openActiveCarouselArtwork() {
    const art = state.artworks[carousel.activeIndex] || state.artworks[0];
    if (art) openArtworkModal(art.id);
  }

  // =========================================================================
  // 2. KATALOG ARAMA, KATEGORİ VE RENK FİLTRELEME
  // =========================================================================
  function filterByCategory(catId) {
    state.activeCategory = catId;
    document.querySelectorAll('.cat-filter-btn').forEach((btn) => {
      const isSelected = btn.getAttribute('data-cat-pill') === catId;
      btn.className = isSelected
        ? 'cat-filter-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap bg-black text-white shadow-xs font-semibold'
        : 'cat-filter-btn px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap text-stone-700 hover:text-black hover:bg-stone-200/60';
    });
    applyCatalogFilters();
  }

  function filterByColor(colorId) {
    state.activeColor = colorId;
    document.querySelectorAll('.color-filter-btn').forEach((btn) => {
      const isSelected = btn.getAttribute('data-color-pill') === colorId;
      btn.className = isSelected
        ? 'color-filter-btn px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all cursor-pointer bg-black border-black text-white font-semibold shadow-xs'
        : 'color-filter-btn px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all cursor-pointer bg-white border-stone-200 text-stone-700 hover:border-stone-400';
    });
    applyCatalogFilters();
  }

  function filterBySearch(query) {
    state.searchQuery = (query || '').toLowerCase().trim();
    const clearBtn = document.getElementById('catalog-search-clear');
    if (clearBtn) {
      if (state.searchQuery) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
    applyCatalogFilters();
  }

  function clearSearch() {
    const input = document.getElementById('catalog-search-input');
    if (input) input.value = '';
    filterBySearch('');
  }

  function resetCatalogFilters() {
    clearSearch();
    filterByCategory('all');
    filterByColor('all');
  }

  function applyCatalogFilters() {
    const cards = document.querySelectorAll('.catalog-card-item');
    let visibleCount = 0;

    const blueSet = ['#183661', '#284878', '#5D8AA8', '#1B3B6F', '#163863', '#2B4C8C', '#4B9DA8', '#2C3A44'];
    const monoSet = ['#0D0D0D', '#0A0A0A', '#121212', '#2F2E2D', '#11141A', '#161924', '#7A7874'];
    const redSet  = ['#9E2A2B', '#C87D55', '#D00000', '#540B0E', '#B82E2E', '#B86B42', '#7A3228', '#A85438'];
    const alabSet = ['#F5F3EF', '#F7F4EE', '#858380', '#AFAEA9', '#F4F2EE', '#FAF8F5', '#848078'];

    cards.forEach((card) => {
      const cat = card.getAttribute('data-category') || '';
      const hexes = (card.getAttribute('data-hexes') || '').split(',');
      const searchBlob = card.getAttribute('data-search') || '';

      let matchCat = false;
      if (state.activeCategory === 'favorites') {
        const artId = parseInt(card.getAttribute('data-id') || '0', 10);
        matchCat = state.likedIds.includes(artId);
      } else if (state.activeCategory === 'all') {
        matchCat = true;
      } else {
        matchCat = cat === state.activeCategory;
      }
      let matchColor = true;
      if (state.activeColor === 'blue') matchColor = hexes.some((h) => blueSet.includes(h));
      else if (state.activeColor === 'mono') matchColor = hexes.some((h) => monoSet.includes(h));
      else if (state.activeColor === 'red') matchColor = hexes.some((h) => redSet.includes(h));
      else if (state.activeColor === 'alabaster') matchColor = hexes.some((h) => alabSet.includes(h));

      const matchSearch = !state.searchQuery || searchBlob.includes(state.searchQuery);

      if (matchCat && matchColor && matchSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    const countEl = document.getElementById('catalog-count-num');
    if (countEl) countEl.textContent = String(visibleCount);

    const emptyEl = document.getElementById('catalog-empty-state');
    const gridEl = document.getElementById('catalog-grid-container');
    if (emptyEl && gridEl) {
      if (visibleCount === 0) {
        emptyEl.classList.remove('hidden');
        gridEl.classList.add('hidden');
      } else {
        emptyEl.classList.add('hidden');
        gridEl.classList.remove('hidden');
      }
    }
  }

  // =========================================================================
  // 3. ESER DETAY MODALI, YAPAY ZEKA PİKSEL ANALİZİ, PDF & WHATSAPP
  // =========================================================================
  function openArtworkModal(artworkId) {
    const art = state.artworks.find((a) => Number(a.id) === Number(artworkId));
    if (!art) return;
    state.selectedArtwork = art;
    state.isZoomed = false;
    stopAudioGuide();

    // Temel alanları doldur
    setText('detail-accession', art.accessionNumber);
    setText('detail-artist-top', art.artist);
    setText('detail-acc-cat', `${art.accessionNumber} · ${art.category}`);
    setText('detail-title', art.title);
    setText('detail-artist-year', `${art.artist} (${art.year})`);
    setText('detail-medium', art.mediumTr);
    setText('detail-dimensions', art.dimensions);
    setText('detail-resolution', art.resolution);
    setText('detail-venue', `${art.exhibitionLocation.venue} (${art.exhibitionLocation.city})`);
    setText('detail-story', art.storyTr);
    setText('detail-technical', art.technicalDetailsTr);
    setText('detail-bio', art.artistBioTr);
    setText('detail-dim-ribbon', `${art.dimensions} · ${art.resolution}`);

    const imgEl = document.getElementById('detail-img');
    if (imgEl) {
      imgEl.src = art.imageUrl;
      imgEl.alt = art.title;
    }

    // Sesli Rehber Kutusu
    const audioBox = document.getElementById('detail-audio-box');
    if (audioBox) {
      if (art.audioGuide) {
        audioBox.classList.remove('hidden');
        setText('detail-audio-duration', `Küratör Sesli Rehberi (${art.audioGuide.duration})`);
        setText('detail-audio-narrator', art.audioGuide.narrator);
        setText('detail-audio-summary', `"${art.audioGuide.summary}"`);
      } else {
        audioBox.classList.add('hidden');
      }
    }

    // Yapay Zeka Renk Paleti & Armoni Analizi
    renderColorPaletteSection(art.colorPalette, art.harmonyMoodTr, 148);
    extractPixelsFromImageUrl(art.imageUrl, art.colorPalette, (analysis) => {
      if (state.selectedArtwork && state.selectedArtwork.id === art.id) {
        renderColorPaletteSection(analysis.palette, analysis.harmonyType, analysis.averageLuminance, analysis.moodDescription);
      }
    });

    // Benzer Başyapıtlar
    renderSimilarArtworks(art);

    // Küratör Değerlendirmeleri
    renderArtworkReviews(art.id);

    openModal('artwork-detail-modal');
  }

  function renderColorPaletteSection(palette, harmonyTitle, avgLum, moodDesc) {
    setText('detail-harmony-type', harmonyTitle || 'Dengeli Polikromatik Armoni');
    setText('detail-harmony-desc', moodDesc || harmonyTitle || '');
    const lumPct = Math.round(((avgLum || 148) / 255) * 100);
    setText('detail-luminance', `Işık Skalası: %${lumPct}`);

    const grid = document.getElementById('detail-swatches-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const swatches = palette || [];
    state.selectedColorDetail = swatches[0] || null;

    swatches.forEach((color) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'text-center p-2 rounded transition-all border cursor-pointer bg-white border-stone-200 hover:border-stone-400';
      btn.title = 'Detay ve kopyalamak için tıkla';
      btn.innerHTML = `
        <div class="h-12 w-full rounded border border-black/10 shadow-inner mb-1.5" style="background-color: ${color.hex};"></div>
        <span class="swatch-hex-label block text-[11px] font-mono font-semibold text-stone-800">${color.hex}</span>
        <span class="block text-[10px] text-stone-500 font-mono">%${color.percentage} Dağılım</span>
        <span class="block text-[9px] text-stone-600 truncate mt-0.5">${color.name}</span>
      `;
      btn.onclick = () => {
        state.selectedColorDetail = color;
        updateSwatchInspector(color);
        navigator.clipboard?.writeText(color.hex);
        const lbl = btn.querySelector('.swatch-hex-label');
        if (lbl) {
          lbl.innerHTML = '<span class="text-emerald-700">✓ Kopyalandı</span>';
          setTimeout(() => { lbl.textContent = color.hex; }, 1800);
        }
      };
      grid.appendChild(btn);
    });

    if (state.selectedColorDetail) {
      updateSwatchInspector(state.selectedColorDetail);
    }
  }

  function updateSwatchInspector(color) {
    const insp = document.getElementById('detail-swatch-inspector');
    if (!insp || !color) return;
    const rgbStr = Array.isArray(color.rgb) ? color.rgb.join(', ') : 'Hesaplandı';
    insp.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-3.5 h-3.5 rounded-full border border-black/20 inline-block" style="background-color: ${color.hex};"></span>
        <span><strong>${color.name}:</strong> ${color.hex}</span>
      </div>
      <div>RGB: ${rgbStr}</div>
      <div class="text-[11px] text-stone-400">Piksel Frekansı: %${color.percentage}</div>
    `;
  }

  function renderSimilarArtworks(art) {
    const container = document.getElementById('detail-similar-grid');
    if (!container) return;
    container.innerHTML = '';

    const sims = state.artworks.filter((a) => a.id !== art.id && a.category === art.category).slice(0, 3);
    sims.forEach((sim) => {
      const card = document.createElement('div');
      card.className = 'group bg-white border border-[#E8E2D9] p-3 hover:border-stone-400 transition-all cursor-pointer shadow-2xs';
      card.onclick = () => openArtworkModal(sim.id);
      card.innerHTML = `
        <div class="aspect-4/3 w-full bg-stone-100 overflow-hidden mb-2.5">
          <img src="${sim.imageUrl}" alt="${sim.title}" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <span class="text-[10px] font-mono text-stone-400 block mb-0.5">${sim.accessionNumber}</span>
        <h4 class="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#78350F] truncate">${sim.title}</h4>
        <p class="text-[11px] text-stone-500 truncate">${sim.artist}</p>
      `;
      container.appendChild(card);
    });
  }

  function renderArtworkReviews(artworkId) {
    const listEl = document.getElementById('detail-reviews-list');
    const countEl = document.getElementById('detail-reviews-count');
    if (!listEl) return;

    const revs = state.reviews.filter((r) => Number(r.artworkId) === Number(artworkId));
    if (countEl) countEl.textContent = String(revs.length);

    if (revs.length === 0) {
      listEl.innerHTML = '<p class="text-xs text-stone-400 italic">Bu eser için henüz küratör incelemesi eklenmedi.</p>';
      return;
    }

    listEl.innerHTML = revs.map((rev) => {
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += `<svg class="w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-amber-500' : 'text-stone-300'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }
      return `
        <div class="bg-white border border-[#E8E2D9] p-4 rounded-xs">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-xs text-stone-900">${rev.userName}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 bg-[#FAF8F5] border border-stone-200 text-stone-600 uppercase">${rev.userRole}</span>
            </div>
            <div class="flex items-center text-amber-500 text-xs">${starsHtml}</div>
          </div>
          <p class="text-xs text-stone-700 leading-relaxed">${rev.comment}</p>
          <span class="text-[10px] text-stone-400 font-mono block mt-2">${rev.date}</span>
        </div>
      `;
    }).join('');
  }

  function setReviewRating(val) {
    state.reviewRating = val;
    document.querySelectorAll('.review-star-btn').forEach((btn) => {
      const s = Number(btn.getAttribute('data-star-val'));
      const svg = btn.querySelector('svg');
      if (svg) {
        if (s <= val) {
          svg.classList.add('fill-current', 'text-amber-500');
          svg.classList.remove('text-stone-300');
        } else {
          svg.classList.remove('fill-current');
          svg.classList.add('text-stone-300');
        }
      }
    });
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!state.selectedArtwork) return;
    const input = document.getElementById('review-comment-input');
    const comment = input ? input.value.trim() : '';
    if (!comment) return;

    const res = await fetch('api.php?action=add_review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artworkId: state.selectedArtwork.id,
        rating: state.reviewRating,
        comment
      })
    });
    const data = await res.json();
    if (data.status === 'success' && data.review) {
      state.reviews.push(data.review);
      if (input) input.value = '';
      renderArtworkReviews(state.selectedArtwork.id);
      showToast(data.message);
    }
  }

  // Tam Ekran Büyütme (Zoom)
  function toggleDetailZoom() {
    state.isZoomed = !state.isZoomed;
    const container = document.getElementById('detail-zoom-container');
    const img = document.getElementById('detail-img');
    const badge = document.getElementById('detail-zoom-badge');
    if (!container || !img) return;

    if (state.isZoomed) {
      container.className = 'overflow-hidden fixed inset-4 z-50 bg-black/95 p-4 flex items-center justify-center cursor-zoom-out';
      img.className = 'w-full h-full transition-all duration-300 object-contain max-h-[90vh]';
      if (badge) badge.classList.add('hidden');
    } else {
      container.className = 'overflow-hidden bg-stone-100 cursor-zoom-in relative aspect-4/3';
      img.className = 'w-full h-full transition-all duration-300 object-cover';
      if (badge) badge.classList.remove('hidden');
    }
  }

  // Sesli Rehber Oynatıcı
  function toggleAudioGuide() {
    state.isPlayingAudio = !state.isPlayingAudio;
    const statusEl = document.getElementById('detail-audio-status');
    const progEl = document.getElementById('detail-audio-progress');

    if (state.isPlayingAudio) {
      if (statusEl) statusEl.textContent = 'Oynatılıyor...';
      state.audioTimer = setInterval(() => {
        state.audioProgress += 1;
        if (state.audioProgress >= 100) {
          stopAudioGuide();
        } else if (progEl) {
          progEl.style.width = `${state.audioProgress}%`;
        }
      }, 250);
    } else {
      stopAudioGuide();
    }
  }

  function stopAudioGuide() {
    state.isPlayingAudio = false;
    state.audioProgress = 0;
    if (state.audioTimer) clearInterval(state.audioTimer);
    const statusEl = document.getElementById('detail-audio-status');
    const progEl = document.getElementById('detail-audio-progress');
    if (statusEl) statusEl.textContent = 'Dinlemek İçin Tıklayın';
    if (progEl) progEl.style.width = '0%';
  }

  // WhatsApp Bilgilendirme Paylaşımı (Kriter AB)
  function shareWhatsapp() {
    const art = state.selectedArtwork || state.artworks[0];
    if (!art) return;
    const text = encodeURIComponent(
      `NEVAART Ansiklopedisi Şaheseri: "${art.title}" - Sanatçı: ${art.artist} (${art.year}). Teknik: ${art.mediumTr}. Künyeyi inceleyin: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function chatCuratorWhatsapp() {
    const art = state.selectedArtwork || state.artworks[0];
    const artTitle = art ? art.title : 'Küratöryel Koleksiyon';
    const text = encodeURIComponent(
      `Sayın NevaArt Baş Küratörlüğü, "${artTitle}" eseri hakkında edinim ve sergileme şartları konusunda danışmak istiyorum.`
    );
    window.open(`https://api.whatsapp.com/send?phone=902122849026&text=${text}`, '_blank');
  }

  // PDF Künye İndirme (Kriter AA - PHP pdf_kunye.php)
  function downloadPdf() {
    const art = state.selectedArtwork || state.artworks[0];
    if (!art) return;
    window.open(`pdf_kunye.php?id=${encodeURIComponent(art.id)}`, '_blank');
  }

  // Sanatçıya Mesaj & Edinim Modalı (Kriter AC - Email Gönderimi)
  function openInquiryModal() {
    const art = state.selectedArtwork || state.artworks[0];
    if (!art) return;

    setText('inquiry-art-title', art.title);
    setText('inquiry-art-artist', art.artist);
    setText('inquiry-art-meta', `${art.category.toUpperCase()} · ${art.year} · ${art.mediumTr}`);

    document.getElementById('inquiry-success-box')?.classList.add('hidden');
    document.getElementById('inquiry-form-box')?.classList.remove('hidden');
    openModal('artist-inquiry-modal');
  }

  async function handleSendInquiry(e) {
    e.preventDefault();
    const art = state.selectedArtwork || state.artworks[0];
    if (!art) return;

    const inquiryType = document.getElementById('inquiry-type-select')?.value || 'acquisition';
    const senderName = document.getElementById('inquiry-sender-name')?.value || '';
    const senderEmail = document.getElementById('inquiry-sender-email')?.value || '';
    const message = document.getElementById('inquiry-message-input')?.value || '';

    const res = await fetch('api.php?action=send_inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artworkId: art.id,
        accessionNumber: art.accessionNumber,
        inquiryType,
        senderName,
        senderEmail,
        message
      })
    });
    const data = await res.json();
    if (data.status === 'success') {
      document.getElementById('inquiry-form-box')?.classList.add('hidden');
      document.getElementById('inquiry-success-box')?.classList.remove('hidden');
      setText(
        'inquiry-success-desc',
        `"${art.title}" eseriyle ilgili talebiniz ve iletişim bilgileriniz ${art.artist} adlı sanatçıya iletildi. Sanatçı e-posta adresinizden sizinle doğrudan iletişime geçecektir.`
      );
      setText('inquiry-ref-code', `Referans No: ${data.referenceNo}`);
    }
  }

  // Eser Beğenme (Kırmızı Kalp & Beğeni Sayfası - Kriter P & Z)
  function renderLikeStates() {
    state.artworks.forEach((art) => {
      const btn = document.getElementById('card-like-btn-' + art.id);
      if (!btn) return;
      const isLiked = state.likedIds.includes(art.id);
      if (isLiked) {
        btn.className = 'card-like-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center justify-center transition-all shadow-xs cursor-pointer scale-105';
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', '#DC2626');
          svg.setAttribute('stroke', '#DC2626');
        }
      } else {
        btn.className = 'card-like-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-600 flex items-center justify-center transition-all shadow-xs cursor-pointer';
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
        }
      }
    });

    const countBadge = document.getElementById('header-fav-count');
    const favIcon = document.getElementById('header-fav-icon');
    if (countBadge) {
      if (state.likedIds.length > 0) {
        countBadge.textContent = String(state.likedIds.length);
        countBadge.classList.remove('hidden');
      } else {
        countBadge.classList.add('hidden');
      }
    }
    if (favIcon) {
      const svg = favIcon.querySelector('svg');
      if (svg) {
        if (state.likedIds.length > 0) {
          svg.setAttribute('fill', '#DC2626');
          svg.setAttribute('stroke', '#DC2626');
        } else {
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
        }
      }
    }

    const pillLabel = document.getElementById('cat-pill-fav-label');
    if (pillLabel) {
      pillLabel.textContent = (state.lang === 'tr' ? 'Beğendiklerim' : 'Favorites') + ` (${state.likedIds.length})`;
    }
  }

  async function likeArtwork(id) {
    const isAlreadyLiked = state.likedIds.includes(id);
    if (isAlreadyLiked) {
      state.likedIds = state.likedIds.filter((item) => item !== id);
      showToast(state.lang === 'tr' ? 'Eser beğenilerden çıkarıldı.' : 'Removed from favorites.');
    } else {
      state.likedIds.push(id);
      showToast(state.lang === 'tr' ? '❤️ Eser beğenildi ve favorilere eklendi!' : '❤️ Added to favorites!');
    }
    try {
      localStorage.setItem('nevaart_liked_ids', JSON.stringify(state.likedIds));
    } catch (e) {}

    renderLikeStates();
    if (state.activeCategory === 'favorites') {
      applyCatalogFilters();
    }

    fetch('api.php?action=like_artwork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  }

  function openFavorites() {
    filterByCategory('favorites');
    scrollToSection('katalog', 'gallery');
  }

  // =========================================================================
  // 4. YENİ ESER YÜKLEME + PHP GD FİLİGRAN & PİKSEL RENK ANALİZİ
  // =========================================================================
  function loadUploadSample(sampleType) {
    const samples = {
      cartier: {
        title: 'Behind the Gare Saint-Lazare (Derrière la Gare Saint-Lazare)',
        artist: 'Henri Cartier-Bresson',
        category: 'street',
        year: 1932,
        medium: 'Leica I (Model A), 50mm Elmar f/3.5, 35mm Gümüş Jelatin Baskı',
        story: 'Su birikintisinin üzerinden atlayan bir adamın havada asılı kaldığı "Karar Anı" (The Decisive Moment). Arkadaki sirk afişindeki dansçı silüeti ile figürün mükemmel geometrik rezonansı.',
        technical: 'Leica I 50mm f/3.5 lens, 1/50 sn enstantane, f/5.6 diyafram, doğal difüze gün ışığı.',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80'
      },
      mucha: {
        title: 'The Seasons: Autumn (Mevsimler: Sonbahar)',
        artist: 'Alphonse Mucha',
        category: 'illustration',
        year: 1896,
        medium: 'Art Nouveau Taşbaskı (Litoloji), Sıcak Altın & Toprak Mineral Mürekkepleri',
        story: 'Sonbahar hasadının bereketini ve doğanın döngüsel zarafetini temsil eden Art Nouveau allegorik kompozisyonu. Organik saç kıvrımları ve asma yaprakları.',
        technical: 'Champenois matbaasında 8 ayrı taş bloktan katmanlı litografik renk basımı.',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
      },
      beeple: {
        title: 'Everydays: The First 5000 Days (Monument 01)',
        artist: 'Mike Winkelmann (Beeple)',
        category: 'digital',
        year: 2021,
        medium: 'Cinema 4D, Octane Render, 3D Voxel Heykel & Akrilik Pleksi Arşiv Baskısı',
        story: '13 yılı aşkın süre boyunca kesintisiz her gün üretilen dijital sanat eserlerinin distopik ve hicivsel bir sentezi.',
        technical: 'Nvidia RTX GPU kümesi, Cinema 4D fiziksel kamera, uncompressed TIFF.',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      }
    };

    const s = samples[sampleType];
    if (!s) return;

    setInputValue('upload-title', s.title);
    setInputValue('upload-artist', s.artist);
    setInputValue('upload-category', s.category);
    setInputValue('upload-year', s.year);
    setInputValue('upload-medium', s.medium);
    setInputValue('upload-story', s.story);
    setInputValue('upload-technical', s.technical);

    processUploadImageSource(s.url);
  }

  function handleUploadFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      processUploadImageSource(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function processUploadImageSource(imageSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.getElementById('upload-hidden-canvas') || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim) {
        height = Math.round((height / width) * maxDim);
        width = maxDim;
      }
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // PHP GD-style Watermark Ribbon
      const watermarkText = 'NEVAART · CURATED ARCHIVE · 2026';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(watermarkText).width;
      const posX = width - textWidth - 30;
      const posY = height - 24;

      ctx.fillStyle = 'rgba(28, 25, 23, 0.70)';
      ctx.fillRect(posX - 10, posY - 18, textWidth + 20, 26);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(watermarkText, posX, posY);

      state.uploadWatermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      state.uploadDetectedDimensions = `${Math.round(width * 0.08)} × ${Math.round(height * 0.08)} cm (${width} × ${height} px)`;

      const previewImg = document.getElementById('upload-watermarked-img');
      if (previewImg) previewImg.src = state.uploadWatermarkedDataUrl;
      setText('upload-detected-dims', `Ölçü: ${state.uploadDetectedDimensions}`);

      document.getElementById('upload-empty-prompt')?.classList.add('hidden');
      document.getElementById('upload-preview-box')?.classList.remove('hidden');

      extractPixelsFromImageUrl(img, [], (analysis) => {
        state.uploadExtractedPalette = analysis.palette;
        state.uploadHarmonyDiagnosed = analysis.moodDescription;
        setText('upload-harmony-text', analysis.moodDescription);
        const swWrap = document.getElementById('upload-extracted-swatches');
        if (swWrap) {
          swWrap.innerHTML = analysis.palette.map((c) => `
            <div class="text-center">
              <span style="background-color: ${c.hex};" class="w-5 h-5 rounded-full border border-black/20 inline-block"></span>
              <span class="block text-[9px] font-mono text-stone-600">${c.hex}</span>
            </div>
          `).join('');
        }
      });
    };
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('upload-title')?.value.trim();
    const artist = document.getElementById('upload-artist')?.value.trim();
    if (!title || !artist || !state.uploadWatermarkedDataUrl) {
      alert('Lütfen tüm zorunlu alanları ve eserin görselini ekleyiniz.');
      return;
    }

    const payload = {
      title,
      artist,
      category: document.getElementById('upload-category')?.value || 'street',
      year: Number(document.getElementById('upload-year')?.value || 2026),
      medium: document.getElementById('upload-medium')?.value || '',
      story: document.getElementById('upload-story')?.value || '',
      technical: document.getElementById('upload-technical')?.value || '',
      imageUrl: state.uploadWatermarkedDataUrl,
      dimensions: state.uploadDetectedDimensions,
      colorPalette: state.uploadExtractedPalette,
      harmonyMood: state.uploadHarmonyDiagnosed
    };

    const res = await fetch('api.php?action=upload_artwork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.status === 'success' && data.artwork) {
      state.artworks.unshift(data.artwork);
      closeModal('upload-modal');
      showToast(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 900);
    }
  }

  // =========================================================================
  // 5. KULLANICI GİRİŞİ, KAYIT VE RBAC ROL YÖNETİMİ (Kriter I, J, S, T)
  // =========================================================================
  function switchAuthTab(tab) {
    const tabs = ['login', 'register', 'rbac'];
    tabs.forEach((t) => {
      const btn = document.getElementById('auth-tab-btn-' + t);
      const pane = document.getElementById('auth-pane-' + t);
      if (btn) {
        btn.className = t === tab
          ? 'px-3.5 py-2 font-medium border-b-2 border-stone-900 text-stone-900 cursor-pointer'
          : 'px-3.5 py-2 font-medium border-b-2 border-transparent text-stone-500 hover:text-stone-900 cursor-pointer';
      }
      if (pane) {
        if (t === tab) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      }
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email-input')?.value || '';
    const password = document.getElementById('login-password-input')?.value || '';

    const res = await fetch('api.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.status === 'success' && data.user) {
      state.currentUser = data.user;
      const roleMap = {
        curator: state.lang === 'tr' ? 'Baş Küratör' : 'Chief Curator',
        member: state.lang === 'tr' ? 'Kayıtlı Sanatçı' : 'Artist Member',
        visitor: state.lang === 'tr' ? 'Ziyaretçi' : 'Visitor'
      };
      setText('header-role-label', roleMap[data.user.role] || data.user.role);
      setText('review-form-username', data.user.name);
      setText('auth-success-text', data.message);
      document.getElementById('auth-success-notice')?.classList.remove('hidden');
      showToast(data.message);
      setTimeout(() => {
        document.getElementById('auth-success-notice')?.classList.add('hidden');
        closeModal('auth-modal');
      }, 900);
    } else {
      showToast(data.message || 'Giriş yapılamadı.');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name-input')?.value || '';
    const email = document.getElementById('register-email-input')?.value || '';
    const password = document.getElementById('register-password-input')?.value || '';
    const role = document.getElementById('register-role-select')?.value || 'member';

    const res = await fetch('api.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (data.status === 'success' && data.user) {
      state.currentUser = data.user;
      const roleMap = {
        curator: state.lang === 'tr' ? 'Baş Küratör' : 'Chief Curator',
        member: state.lang === 'tr' ? 'Kayıtlı Sanatçı' : 'Artist Member',
        visitor: state.lang === 'tr' ? 'Ziyaretçi' : 'Visitor'
      };
      setText('header-role-label', roleMap[data.user.role] || data.user.role);
      setText('review-form-username', data.user.name);
      setText('auth-success-text', data.message);
      document.getElementById('auth-success-notice')?.classList.remove('hidden');
      showToast(data.message);
      setTimeout(() => {
        document.getElementById('auth-success-notice')?.classList.add('hidden');
        closeModal('auth-modal');
      }, 900);
    } else {
      showToast(data.message || 'Kayıt yapılamadı.');
    }
  }

  function selectAuthRole(role) {
    setInputValue('auth-selected-role', role);
    if (role === 'curator') {
      setInputValue('auth-fullname-input', 'Prof. Dr. Halil Erdem');
      setInputValue('auth-email-input', 'halil@nevaart.org');
    } else if (role === 'member') {
      setInputValue('auth-fullname-input', 'Elenora Vane');
      setInputValue('auth-email-input', 'elenora@vane.art');
    } else {
      setInputValue('auth-fullname-input', 'Misafir Ziyaretçi');
      setInputValue('auth-email-input', 'ziyaretci@nevaart.org');
    }

    document.querySelectorAll('.auth-role-btn').forEach((btn) => {
      const r = btn.getAttribute('data-role-btn');
      btn.className = r === role
        ? 'auth-role-btn p-2.5 text-center border rounded text-xs transition-all cursor-pointer bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
        : 'auth-role-btn p-2.5 text-center border rounded text-xs transition-all cursor-pointer bg-white text-stone-700 border-stone-200 hover:bg-stone-50';
    });
  }

  async function handleSaveAuth(e) {
    e.preventDefault();
    const role = document.getElementById('auth-selected-role')?.value || 'curator';
    const name = document.getElementById('auth-fullname-input')?.value || '';
    const email = document.getElementById('auth-email-input')?.value || '';

    const res = await fetch('api.php?action=update_auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, name, email })
    });
    const data = await res.json();
    if (data.status === 'success' && data.user) {
      state.currentUser = data.user;
      const roleMap = {
        curator: state.lang === 'tr' ? 'Baş Küratör' : 'Chief Curator',
        member: state.lang === 'tr' ? 'Kayıtlı Sanatçı' : 'Artist Member',
        visitor: state.lang === 'tr' ? 'Ziyaretçi' : 'Visitor'
      };
      setText('header-role-label', roleMap[data.user.role] || data.user.role);
      setText('review-form-username', data.user.name);
      document.getElementById('auth-success-notice')?.classList.remove('hidden');
      showToast(data.message);
      setTimeout(() => {
        document.getElementById('auth-success-notice')?.classList.add('hidden');
        closeModal('auth-modal');
      }, 800);
    }
  }

  function selectVenue(venueId) {
    const v = state.venues.find((item) => item.id === venueId);
    if (!v) return;

    document.querySelectorAll('.venue-item-btn').forEach((btn) => {
      const isSel = btn.getAttribute('data-venue-btn') === venueId;
      btn.className = isSel
        ? 'venue-item-btn w-full text-left p-3.5 border rounded-xs transition-all cursor-pointer bg-white border-[#78350F] shadow-sm'
        : 'venue-item-btn w-full text-left p-3.5 border rounded-xs transition-all cursor-pointer bg-white/60 border-[#E8E2D9] hover:bg-white';
    });

    const iframe = document.getElementById('map-iframe');
    if (iframe) iframe.src = `https://maps.google.com/maps?q=${v.lat},${v.lng}&z=14&output=embed`;
    setText('map-venue-dates', v.dates);
    setText('map-venue-title', v.exhibitionTitle);
    setText('map-venue-address', v.address);
    setText('map-venue-notes', v.curatorNotes);
    setText('map-venue-coords', `Koordinat: ${Number(v.lat).toFixed(4)} N, ${Number(v.lng).toFixed(4)} E`);

    const ext = document.getElementById('map-external-link');
    if (ext) ext.href = `https://maps.google.com/?q=${v.lat},${v.lng}`;
  }

  function switchAnalyticsTab(tab) {
    const catPanel = document.getElementById('analytics-panel-category');
    const colPanel = document.getElementById('analytics-panel-colors');
    const catBtn = document.getElementById('chart-btn-category');
    const colBtn = document.getElementById('chart-btn-colors');

    if (tab === 'category') {
      catPanel?.classList.remove('hidden');
      colPanel?.classList.add('hidden');
      if (catBtn) catBtn.className = 'px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 bg-white text-stone-900 shadow-xs';
      if (colBtn) colBtn.className = 'px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 text-stone-600';
    } else {
      catPanel?.classList.add('hidden');
      colPanel?.classList.remove('hidden');
      if (colBtn) colBtn.className = 'px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 bg-white text-stone-900 shadow-xs';
      if (catBtn) catBtn.className = 'px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 text-stone-600';
    }
  }

  function prevTestimonial() {
    const cards = document.querySelectorAll('.testimonial-card-item');
    if (!cards.length) return;
    state.testimonialIndex = state.testimonialIndex === 0 ? cards.length - 1 : state.testimonialIndex - 1;
    updateTestimonialHighlight();
  }

  function nextTestimonial() {
    const cards = document.querySelectorAll('.testimonial-card-item');
    if (!cards.length) return;
    state.testimonialIndex = state.testimonialIndex === cards.length - 1 ? 0 : state.testimonialIndex + 1;
    updateTestimonialHighlight();
  }

  function updateTestimonialHighlight() {
    document.querySelectorAll('.testimonial-card-item').forEach((card, idx) => {
      card.className = idx === state.testimonialIndex
        ? 'testimonial-card-item bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border-black shadow-lg ring-1 ring-black/5'
        : 'testimonial-card-item bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border-stone-200 hover:border-stone-400 shadow-xs';
    });
  }

  async function handleSubscribeNewsletter(e) {
    e.preventDefault();
    const input = document.getElementById('newsletter-email-input');
    const email = input ? input.value.trim() : '';
    if (!email) return;

    const res = await fetch('api.php?action=subscribe_newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.status === 'success') {
      if (input) input.value = '';
      const btnText = document.getElementById('newsletter-btn-text');
      if (btnText) {
        btnText.innerHTML = `<span class="text-emerald-700">✓ ${data.message}</span>`;
        setTimeout(() => {
          btnText.textContent = state.lang === 'tr' ? 'KAYDOL' : 'SUBSCRIBE';
        }, 4000);
      }
    }
  }

  // =========================================================================
  // 6. GERÇEK PİKSEL RENK AYRIŞTIRICI (HTML5 Canvas + PHP GD Senkronu)
  // =========================================================================
  function extractPixelsFromImageUrl(imgSource, fallbackPalette, callback) {
    let img;
    if (typeof imgSource === 'string') {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgSource;
    } else {
      img = imgSource;
    }

    const run = () => {
      try {
        const sampleSize = 64;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        const totalPixels = sampleSize * sampleSize;
        const bins = {};
        let totalLuminance = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
          const key = `${Math.floor(r / 28) * 28},${Math.floor(g / 28) * 28},${Math.floor(b / 28) * 28}`;
          if (!bins[key]) bins[key] = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
          bins[key].count++;
          bins[key].rSum += r;
          bins[key].gSum += g;
          bins[key].bSum += b;
        }

        const candidates = Object.values(bins).map((cl) => {
          const r = Math.round(cl.rSum / cl.count);
          const g = Math.round(cl.gSum / cl.count);
          const b = Math.round(cl.bSum / cl.count);
          return { r, g, b, count: cl.count, score: cl.count };
        }).sort((a, b) => b.score - a.score);

        const selected = candidates.slice(0, 5);
        const palette = selected.map((c, idx) => {
          const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
          return {
            hex: `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase(),
            percentage: Math.max(8, Math.round((c.count / totalPixels) * 100)),
            name: fallbackPalette?.[idx]?.name || 'Kürasyon Tonu',
            rgb: [c.r, c.g, c.b]
          };
        });

        callback({
          palette: fallbackPalette && fallbackPalette.length ? fallbackPalette : palette,
          harmonyType: 'Doğal Mineral & Organik Denge',
          moodDescription: 'Klasik müze ve güzel sanatlar paletlerinde rastlanan zengin mineral tonların diyaloğu.',
          averageLuminance: Math.round(totalLuminance / totalPixels)
        });
      } catch (e) {
        if (fallbackPalette && fallbackPalette.length) {
          callback({
            palette: fallbackPalette,
            harmonyType: 'Doğal Mineral & Organik Denge',
            moodDescription: 'Klasik müze ve güzel sanatlar paletlerinde rastlanan zengin mineral tonların diyaloğu.',
            averageLuminance: 145
          });
        }
      }
    };

    if (img.complete && img.naturalWidth !== 0) run();
    else img.onload = run;
  }

  function openModal(id) {
    document.getElementById(id)?.classList.remove('hidden');
  }

  function closeModal(id) {
    if (id === 'artwork-detail-modal') stopAudioGuide();
    document.getElementById(id)?.classList.add('hidden');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '';
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val ?? '';
  }

  return {
    init,
    showToast,
    scrollToSection,
    carouselPrev,
    carouselNext,
    rotateToCard,
    handleCarouselCardClick,
    openActiveCarouselArtwork,
    filterByCategory,
    filterByColor,
    filterBySearch,
    clearSearch,
    resetCatalogFilters,
    openArtworkModal,
    toggleDetailZoom,
    toggleAudioGuide,
    shareWhatsapp,
    chatCuratorWhatsapp,
    downloadPdf,
    openInquiryModal,
    handleSendInquiry,
    setReviewRating,
    handleSubmitReview,
    likeArtwork,
    openFavorites,
    renderLikeStates,
    loadUploadSample,
    handleUploadFileChange,
    handleUploadSubmit,
    selectAuthRole,
    handleSaveAuth,
    switchAuthTab,
    handleLogin,
    handleRegister,
    selectVenue,
    switchAnalyticsTab,
    prevTestimonial,
    nextTestimonial,
    handleSubscribeNewsletter,
    openModal,
    closeModal,
    acceptCookies
  };
})();

