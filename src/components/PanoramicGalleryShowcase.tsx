import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Artwork } from '../types';
import { translations } from '../data/i18n';
import { ChevronLeft, ChevronRight, BookOpen, Eye, Heart, Sparkles } from 'lucide-react';

interface PanoramicGalleryShowcaseProps {
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
}

export const PanoramicGalleryShowcase: React.FC<PanoramicGalleryShowcaseProps> = ({
  artworks,
  currentLang,
  onSelectArtwork,
}) => {
  const t = translations[currentLang];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const activeIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const count = artworks.length;
  // Sabit görsel aralık (26°): Ekranda her zaman maksimum 6-7 eser görünür (ortada 1 + solda 3 + sağda 3), tüm 60+ eser sırayla döner!
  const angleStep = 26;

  // Responsive radius for the panoramic gallery curve
  const getRadii = () => {
    if (typeof window === 'undefined') return { rx: 460, rz: 320 };
    if (window.innerWidth < 640) return { rx: 270, rz: 190 };
    if (window.innerWidth < 1024) return { rx: 380, rz: 260 };
    return { rx: 490, rz: 320 };
  };

  const radiiRef = useRef(getRadii());

  useEffect(() => {
    const handleResize = () => {
      radiiRef.current = getRadii();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update card transform styles directly on the DOM for 120fps hardware-accelerated motion
  // FIX: Cards are rendered as flat 2D elements with 3D-looking transforms applied via CSS.
  // We do NOT use transformStyle: preserve-3d on cards themselves — this prevents real 3D
  // intersection. Instead we simulate depth with scale, opacity and z-index ordering.
  const updateCardTransforms = useCallback((angle: number) => {
    const { rx, rz } = radiiRef.current;
    const cards = cardsRef.current;
    if (!count) return;

    // Sürekli sanal kart pozisyonu (tüm 60+ eser arasında sonsuz döngü)
    const pos = -angle / angleStep;
    const newActive = ((Math.round(pos) % count) + count) % count;
    if (newActive !== activeIndexRef.current) {
      activeIndexRef.current = newActive;
      setActiveIndex(newActive);
    }

    for (let i = 0; i < count; i++) {
      const el = cards[i];
      if (!el) continue;

      // En kısa dairesel kart uzaklığı [-count/2, +count/2]
      let diff = ((i - pos) % count + count) % count;
      if (diff > count / 2) diff -= count;

      // Ekranda maksimum 6-7 kart (ortadaki + sağda 3 + solda 3) görünsün; gerisi tamamen gizli
      if (Math.abs(diff) > 3.25) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
        el.style.zIndex = '0';
        continue;
      }

      el.style.visibility = 'visible';
      const relAngle = diff * angleStep;
      const rad = (relAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad);
      const sinVal = Math.sin(rad);

      if (cosVal < 0.05) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
        el.style.zIndex = '0';
        continue;
      }

      el.style.pointerEvents = 'auto';

      // Panoramic curved coordinates
      const x = sinVal * rx;
      const y = (1 - cosVal) * 8; // subtle vertical arc lift

      // Distance ratio (1 at exact front center, 0 at cosVal=0.05 edge)
      const distRatio = Math.max(0, (cosVal - 0.05) / 0.95);

      // Scale: front center card is full size, outer cards shrink proportionally
      const scale = 0.72 + 0.31 * Math.pow(distRatio, 1.3);

      // Opacity: smooth fade towards edges
      const opacity = Math.min(1, Math.max(0.08, Math.pow(distRatio, 1.5)));

      // Z-INDEX is purely cosVal-based (higher cosVal = closer to front = higher z-index)
      // This is the KEY FIX: z-index determines render order so cards never visually intersect
      const zIndex = Math.round(cosVal * 200);

      // Subtle rotation along the curve — capped to avoid extreme perspective distortion
      const rotY = -relAngle * 0.6;

      // Atmospheric blur for deep side cards
      const blurAmount = distRatio < 0.55 ? (0.55 - distRatio) * 2.5 : 0;
      const brightness = 0.78 + 0.25 * distRatio;

      // Use translate2d + rotateY for the panoramic look, NO z-axis translate
      // (z-axis translate in 2D stacking context causes the intersection because
      // browser blends 3D transforms across sibling elements)
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = `${zIndex}`;
      el.style.filter = `blur(${blurAmount.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;

      const isCenter = i === newActive;
      if (isCenter) {
        el.classList.add('ring-2', 'ring-black', 'shadow-2xl');
      } else {
        el.classList.remove('ring-2', 'ring-black', 'shadow-2xl');
      }
    }
  }, [count, angleStep]);

  // Main high-performance Animation Frame Physics Loop (Akıcı Orta Hızlı Dönme)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.02) {
          targetAngleRef.current += velocityRef.current;
          velocityRef.current *= 0.93; // Inertia friction
        } else {
          velocityRef.current = 0;
          // Akıcı orta hızda dönme animasyonu
          if (isPlaying) {
            const speedMultiplier = isHoveredRef.current ? 0.3 : 1.0;
            targetAngleRef.current -= 0.16 * speedMultiplier;
          }
        }
      }

      // Smooth lerp easing
      const lerp = isDraggingRef.current ? 0.25 : 0.085;
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * lerp;

      updateCardTransforms(currentAngleRef.current);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isPlaying, updateCardTransforms]);

  const startXRef = useRef<number>(0);
  const totalDragDistanceRef = useRef<number>(0);

  // Pointer drag events (Unified mouse & touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    startXRef.current = e.clientX;
    totalDragDistanceRef.current = 0;
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 8);
    const deltaX = e.clientX - lastXRef.current;
    totalDragDistanceRef.current += Math.abs(deltaX);

    targetAngleRef.current += deltaX * 0.35;

    // Instant velocity for flick momentum
    const instVel = (deltaX / dt) * 14;
    velocityRef.current = velocityRef.current * 0.4 + instVel * 0.6;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    velocityRef.current = Math.max(Math.min(velocityRef.current, 10), -10);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    velocityRef.current = 0;
    targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep + angleStep;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    velocityRef.current = 0;
    targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep - angleStep;
  };

  const rotateToCard = (index: number) => {
    velocityRef.current = 0;
    let diff = index - activeIndexRef.current;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetAngleRef.current -= diff * angleStep;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      velocityRef.current = 0;
      targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep + angleStep;
    } else if (e.key === 'ArrowRight') {
      velocityRef.current = 0;
      targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep - angleStep;
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const activeArt = artworks[activeIndex] || artworks[0];

  return (
    <section 
      id="hero"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative pt-8 pb-16 px-4 overflow-hidden bg-white select-none outline-none"
    >
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto text-center mb-6">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-stone-400" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-stone-500 font-semibold font-mono">
            {currentLang === 'tr' ? 'AÇIK SERGİ & SANAT ARŞİVİ' : 'OPEN EXHIBITION & ART ARCHIVE'}
          </span>
          <span className="w-6 h-px bg-stone-400" />
        </div>

        {/* Big Bold Headline strictly localized */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-black tracking-tight uppercase leading-[0.95]">
          {currentLang === 'tr' ? (
            <>
              <span className="block">SANATLA BİR</span>
              <span className="block font-light text-stone-900 mt-1">YOLCULUK</span>
            </>
          ) : (
            <>
              <span className="block">A JOURNEY</span>
              <span className="block font-light text-stone-900 mt-1">THROUGH ARTS</span>
            </>
          )}
        </h1>

        <p className="text-stone-600 max-w-2xl mx-auto mt-4 text-xs sm:text-sm leading-relaxed">
          {currentLang === 'tr'
            ? 'Sanatçıların kendi çizim ve fotoğraflarını paylaştığı, dünya çapında ikonik başyapıtların yer aldığı açık dijital sanat galerisi. Eserleri keşfedin, yaratım hikayelerini okuyun ve sanatçılarla doğrudan iletişime geçin.'
            : 'A digital gallery showcasing both independent artists\u2019 original drawings and photography alongside timeless world-famous masterpieces. Discover the stories, analyze the craft, and connect directly with the creators.'}
        </p>
      </div>

      {/* 3D Panoramic Curved Gallery Stage */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        className={`relative max-w-7xl mx-auto h-[440px] sm:h-[480px] md:h-[510px] flex items-center justify-center select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 42%',
        }}
      >
        {/* Subtle Ambient Curved Guide Shadow */}
        <div 
          className="absolute bottom-4 w-[700px] max-w-[88%] h-[100px] pointer-events-none rounded-[50%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(120,53,15,0.07) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotateX(80deg)',
          }}
        />

        {/* Cards Container — flat stacking context, no preserve-3d to avoid real 3D intersection */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'flat' }}
        >
          {artworks.map((art, index) => {
            const isCenter = index === activeIndex;

            return (
              <div
                key={art.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Sadece küçük bir tıklama ise modalı aç (sürükleme sırasında açılmasın)
                  if (totalDragDistanceRef.current < 8) {
                    onSelectArtwork(art);
                  }
                }}
                className={`absolute w-[260px] sm:w-[310px] md:w-[340px] bg-white border border-stone-200/90 p-3 sm:p-3.5 rounded-2xl cursor-pointer pointer-events-auto group will-change-transform transition-shadow duration-300 ${
                  isCenter 
                    ? 'ring-2 ring-black shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]' 
                    : 'hover:border-stone-400 shadow-md'
                }`}
              >
                {/* Museum Exhibition Frame */}
                <div className="aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden relative rounded-xl border border-stone-200/90">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    draggable={false}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />

                  {art.isCuratorPick && (
                    <div className="absolute top-2.5 left-2.5 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 tracking-widest uppercase rounded shadow-xs">
                      {currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Pick'}
                    </div>
                  )}

                  {isCenter && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-800 text-white text-[9px] font-mono px-2 py-0.5 tracking-wider uppercase rounded flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                      {currentLang === 'tr' ? 'Öne Çıkan' : 'Featured'}
                    </div>
                  )}

                  {/* Dominant Color Swatch Badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-stone-200 shadow-xs">
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/10" 
                      style={{ backgroundColor: art.colorPalette[0]?.hex || '#FAF8F5' }} 
                    />
                    <span className="text-[9px] font-mono text-stone-800 font-semibold">{art.colorPalette[0]?.hex}</span>
                  </div>
                </div>

                {/* Artwork Metadata & Title */}
                <div className="pt-3">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono mb-1">
                    <span>{art.accessionNumber}</span>
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">
                      {art.category.toUpperCase()} · {art.year}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 truncate group-hover:text-amber-900 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-600 truncate font-medium mt-0.5">
                    {art.artist}
                  </p>

                  {/* Card Action footer */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-mono text-[11px] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-stone-400" />
                      <span>{art.views.toLocaleString()}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtwork(art);
                      }}
                      className="text-stone-900 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer transition-transform group-hover:translate-x-0.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                      <span>{currentLang === 'tr' ? 'Hikayesini Oku' : 'Read Story'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons — outside pointer capture zone via stopPropagation */}
        <button
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); }}
          onClick={handlePrev}
          aria-label={currentLang === 'tr' ? 'Önceki eser' : 'Previous artwork'}
          className="absolute left-2 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); }}
          onClick={handleNext}
          aria-label={currentLang === 'tr' ? 'Sonraki eser' : 'Next artwork'}
          className="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Active Artwork Spotlight Preview Strip */}
      {activeArt && (
        <div className="max-w-lg mx-auto mt-4 px-4">
          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {artworks.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => rotateToCard(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeIndex
                    ? 'w-7 h-1.5 bg-black'
                    : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          {/* Quick Details Pill */}
          <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full shadow-xs flex items-center justify-between text-xs transition-all hover:border-stone-400">
            <div className="flex items-center gap-2.5 truncate pr-3">
              <img 
                src={activeArt.imageUrl} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border border-stone-300 shrink-0" 
              />
              <div className="truncate">
                <span className="font-semibold text-stone-900 truncate block text-xs">
                  {activeArt.title}
                </span>
                <span className="text-[10px] text-stone-500 truncate block">
                  {activeArt.artist} · {currentLang === 'tr' ? activeArt.mediumTr : activeArt.mediumEn}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectArtwork(activeArt)}
              className="px-4 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              {currentLang === 'tr' ? 'Hikayesini Oku →' : 'Read Story →'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
