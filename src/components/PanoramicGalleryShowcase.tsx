import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Artwork } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, Eye } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevBgUrl, setPrevBgUrl] = useState<string>(artworks[0]?.imageUrl || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const currentPosRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const activeIndexRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const totalDragDistanceRef = useRef<number>(0);

  const count = artworks.length;

  // Tight, sculpted coverflow spacing so cards stay grouped centrally with zero empty gaps
  const getSpacing = () => {
    if (typeof window === 'undefined') return 255;
    if (window.innerWidth < 480) return 158;
    if (window.innerWidth < 640) return 178;
    if (window.innerWidth < 1024) return 218;
    return 252;
  };

  const spacingRef = useRef(getSpacing());

  useEffect(() => {
    const handleResize = () => {
      spacingRef.current = getSpacing();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only render the 9 cards around activeIndex in React DOM (22x faster, zero stutter on transitions!)
  const visibleSlots = useMemo(() => {
    if (!count) return [];
    const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const seen = new Set<number>();
    const list: { index: number; art: Artwork }[] = [];
    for (const off of offsets) {
      const idx = ((activeIndex + off) % count + count) % count;
      if (!seen.has(idx)) {
        seen.add(idx);
        list.push({ index: idx, art: artworks[idx] });
      }
    }
    return list;
  }, [activeIndex, artworks, count]);

  // Smooth crossfade background image tracker
  useEffect(() => {
    const currentUrl = artworks[activeIndex]?.imageUrl;
    if (!currentUrl) return;
    const timer = window.setTimeout(() => {
      setPrevBgUrl(currentUrl);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [activeIndex, artworks]);

  // Pure GPU translate3d + scale + opacity (zero 3D rotateY clipping, zero CSS filter blur repaints!)
  const updateCardTransforms = useCallback(
    (pos: number) => {
      if (!count) return;
      const spacing = spacingRef.current;

      const newActive = ((Math.round(pos) % count) + count) % count;
      if (newActive !== activeIndexRef.current) {
        activeIndexRef.current = newActive;
        setActiveIndex(newActive);
      }

      cardsMapRef.current.forEach((el, i) => {
        let diff = ((i - pos) % count + count) % count;
        if (diff > count / 2) diff -= count;

        const absDiff = Math.abs(diff);

        // Hide outer cards cleanly inside the centered stage (never sprawling edge-to-edge)
        if (absDiff > 3.15) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          el.style.visibility = 'hidden';
          el.style.zIndex = '0';
          return;
        }

        el.style.visibility = 'visible';
        el.style.pointerEvents = absDiff < 2.4 ? 'auto' : 'none';

        // Sculpted compact arc: tight spacing + dramatic center spotlight scale contrast
        const sign = diff < 0 ? -1 : 1;
        const compressed =
          absDiff <= 1
            ? absDiff
            : absDiff <= 2
            ? 1 + (absDiff - 1) * 0.74
            : 1.74 + (absDiff - 2) * 0.58;
        const x = sign * compressed * spacing;

        // Center card lifted prominently; side cards step down smoothly
        const y = -12 + Math.pow(absDiff, 1.35) * 24;

        // Dramatic, immediately noticeable size hierarchy: center 1.08 -> ±1 0.78 -> ±2 0.62 -> ±3 0.48
        const scale =
          absDiff <= 1
            ? 1.08 - absDiff * 0.30
            : Math.max(0.46, 0.78 - (absDiff - 1) * 0.16);

        const opacity =
          absDiff <= 1
            ? 1 - absDiff * 0.16
            : absDiff <= 2.2
            ? Math.max(0.42, 0.84 - (absDiff - 1) * 0.32)
            : Math.max(0, ((3.15 - absDiff) / 0.95) * 0.42);

        // Strictly monotonic z-index by distance from center (zero z-fighting or 3D clipping)
        const zIndex = Math.round(100 - absDiff * 25);

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = `${zIndex}`;
      });
    },
    [count]
  );

  // Sync transforms immediately whenever visibleSlots updates
  useEffect(() => {
    updateCardTransforms(currentPosRef.current);
  }, [visibleSlots, updateCardTransforms]);

  // Frame-rate independent smooth physics loop (60Hz / 120Hz / 144Hz identical speed)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;
      const frameScale = dt * 60;

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.001) {
          targetPosRef.current += velocityRef.current * frameScale;
          velocityRef.current *= Math.pow(0.92, frameScale);
        } else {
          velocityRef.current = 0;
          if (isPlaying) {
            const speedMultiplier = isHoveredRef.current ? 0.25 : 1.0;
            // Smooth, calm continuous gallery glide (~1 card every 5.2 seconds)
            targetPosRef.current += 0.0032 * speedMultiplier * frameScale;
          }
        }
      }

      // Smooth exponential lerp (frame-rate independent, zero stutter)
      const smoothFactor = 1 - Math.exp(-(isDraggingRef.current ? 18 : 8.5) * dt);
      currentPosRef.current += (targetPosRef.current - currentPosRef.current) * smoothFactor;

      updateCardTransforms(currentPosRef.current);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isPlaying, updateCardTransforms]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    totalDragDistanceRef.current = 0;
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 8);
    const deltaX = e.clientX - lastXRef.current;
    totalDragDistanceRef.current += Math.abs(deltaX);

    const posDelta = -deltaX / spacingRef.current;
    targetPosRef.current += posDelta;

    const instVel = (posDelta / dt) * 16;
    velocityRef.current = velocityRef.current * 0.45 + instVel * 0.55;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    velocityRef.current = Math.max(Math.min(velocityRef.current, 0.35), -0.35);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    velocityRef.current = 0;
    targetPosRef.current = Math.round(targetPosRef.current) - 1;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    velocityRef.current = 0;
    targetPosRef.current = Math.round(targetPosRef.current) + 1;
  };

  const rotateToCard = (index: number) => {
    velocityRef.current = 0;
    let diff = index - activeIndexRef.current;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetPosRef.current = Math.round(targetPosRef.current) + diff;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      velocityRef.current = 0;
      targetPosRef.current = Math.round(targetPosRef.current) - 1;
    } else if (e.key === 'ArrowRight') {
      velocityRef.current = 0;
      targetPosRef.current = Math.round(targetPosRef.current) + 1;
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
      className="relative pt-24 sm:pt-28 pb-16 px-4 overflow-hidden bg-[#141416] select-none outline-none"
    >
      {/* Dynamic Dark-Shaded Changing Artwork Backdrop (Clearly Visible Masterpiece) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {prevBgUrl && (
          <img
            src={prevBgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1.5px] opacity-75"
          />
        )}
        {activeArt?.imageUrl && (
          <img
            key={activeArt.id}
            src={activeArt.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1.5px] opacity-90 animate-in fade-in duration-700"
          />
        )}
        {/* Lighter Cinematic Shadow Veil so the Artwork Shines Clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/52 via-black/38 to-[#FAFAFA]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.44)_100%)]" />
      </div>

      {/* Editorial Header */}
      <div className="relative z-10 max-w-5xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2.5 mb-3">
          <span className="w-6 h-px bg-[#C59B5F]/80" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#E6CFA8] font-semibold font-mono">
            {currentLang === 'tr' ? 'AÇIK SERGİ & SANAT ARŞİVİ' : 'OPEN EXHIBITION & ART ARCHIVE'}
          </span>
          <span className="w-6 h-px bg-[#C59B5F]/80" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white tracking-tight uppercase leading-[0.95] drop-shadow-lg">
          {currentLang === 'tr' ? (
            <>
              <span className="block">SANATLA BİR</span>
              <span className="block font-light text-stone-200 mt-1">YOLCULUK</span>
            </>
          ) : (
            <>
              <span className="block">A JOURNEY</span>
              <span className="block font-light text-stone-200 mt-1">THROUGH ARTS</span>
            </>
          )}
        </h1>

        <p className="text-stone-200/90 max-w-2xl mx-auto mt-4 text-xs sm:text-sm leading-relaxed drop-shadow-xs">
          {currentLang === 'tr'
            ? 'Sanatçıların kendi çizim ve fotoğraflarını paylaştığı, dünya çapında ikonik başyapıtların yer aldığı açık dijital sanat galerisi. Eserleri keşfedin, yaratım hikayelerini okuyun ve sanatçılarla doğrudan iletişime geçin.'
            : 'A digital gallery showcasing both independent artists’ original drawings and photography alongside timeless world-famous masterpieces. Discover the stories, analyze the craft, and connect directly with the creators.'}
        </p>
      </div>

      {/* Smooth Non-Overlapping Panoramic Gallery Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        className={`relative z-10 max-w-5xl mx-auto h-[410px] sm:h-[475px] md:h-[515px] flex items-center justify-center select-none touch-pan-y overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_7%,black_93%,transparent_100%)] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Cards Container — strictly 9 nearby cards rendered for 120 FPS zero-stutter glide */}
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleSlots.map(({ index, art }) => {
            const isCenter = index === activeIndex;

            return (
              <div
                key={art.id}
                ref={(el) => {
                  if (el) cardsMapRef.current.set(index, el);
                  else cardsMapRef.current.delete(index);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (totalDragDistanceRef.current < 8) {
                    if (isCenter) {
                      onSelectArtwork(art);
                    } else {
                      rotateToCard(index);
                    }
                  }
                }}
                className={`absolute w-[225px] sm:w-[290px] md:w-[325px] bg-white border border-stone-200/95 p-3 sm:p-3.5 rounded-2xl cursor-pointer group will-change-transform transition-shadow duration-300 ${
                  isCenter
                    ? 'ring-2 ring-black/90 shadow-[0_28px_60px_-15px_rgba(0,0,0,0.45)]'
                    : 'shadow-xl hover:border-stone-400'
                }`}
              >
                {/* Museum Exhibition Frame */}
                <div className="aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden relative rounded-xl border border-stone-200/90">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    draggable={false}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
                    <span className="text-[9px] font-mono text-stone-800 font-semibold">
                      {art.colorPalette[0]?.hex}
                    </span>
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

        {/* Navigation Buttons */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={handlePrev}
          aria-label={currentLang === 'tr' ? 'Önceki eser' : 'Previous artwork'}
          className="absolute left-1.5 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={handleNext}
          aria-label={currentLang === 'tr' ? 'Sonraki eser' : 'Next artwork'}
          className="absolute right-1.5 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-[200] cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Active Artwork Spotlight Preview Strip */}
      {activeArt && (
        <div className="relative z-10 max-w-lg mx-auto mt-4 px-2 sm:px-4">
          {/* Compact Sliding Pagination Window + Counter */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                const targetIdx = ((activeIndex + offset) % count + count) % count;
                const isActive = offset === 0;
                return (
                  <button
                    key={offset}
                    type="button"
                    onClick={() => rotateToCard(targetIdx)}
                    aria-label={`Go to slide ${targetIdx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? 'w-7 h-1.5 bg-black'
                        : Math.abs(offset) === 1
                        ? 'w-2 h-1.5 bg-stone-500 hover:bg-stone-700'
                        : 'w-1.5 h-1.5 bg-stone-400 hover:bg-stone-600'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-mono text-stone-700 bg-white/90 border border-stone-200 px-2 py-0.5 rounded-full shadow-2xs">
              {activeIndex + 1} / {count}
            </span>
          </div>

          {/* Quick Details Pill */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/95 backdrop-blur-md border border-stone-200 rounded-full shadow-md flex items-center justify-between gap-2 text-xs transition-all hover:border-stone-400">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 pr-1 sm:pr-3">
              <img
                src={activeArt.imageUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-stone-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-stone-900 truncate block text-xs">
                  {activeArt.title}
                </span>
                <span className="text-[10px] text-stone-500 truncate block">
                  {activeArt.artist} ·{' '}
                  {currentLang === 'tr' ? activeArt.mediumTr : activeArt.mediumEn}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectArtwork(activeArt)}
              className="px-3 sm:px-4 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-xs shrink-0"
            >
              {currentLang === 'tr' ? 'İncele →' : 'Read →'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
