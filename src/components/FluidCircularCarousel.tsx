import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Artwork } from '../types';
import { translations } from '../data/i18n';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Compass, RotateCcw } from 'lucide-react';

interface FluidCircularCarouselProps {
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
}

export const FluidCircularCarousel: React.FC<FluidCircularCarouselProps> = ({
  artworks,
  currentLang,
  onSelectArtwork,
}) => {
  const t = translations[currentLang];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);

  const totalCards = artworks.length;
  const angleStep = 360 / Math.max(1, totalCards);

  // References for physics and high-speed RAF animation
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const activeIndexRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);

  // Responsive radius for the 3D cylinder
  const getRadius = () => {
    if (typeof window === 'undefined') return 480;
    if (window.innerWidth < 640) return 320;
    if (window.innerWidth < 1024) return 420;
    return 520;
  };

  const radiusRef = useRef<number>(480);

  useEffect(() => {
    const handleResize = () => {
      radiusRef.current = getRadius();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update card transform styles directly on the DOM for 120fps hardware-accelerated motion
  const updateCardTransforms = useCallback((angle: number) => {
    const radius = radiusRef.current;
    const cards = cardsRef.current;
    const count = artworks.length;
    if (!count) return;

    // Determine card closest to center front
    const normalized = ((-angle % 360) + 360) % 360;
    const newActive = Math.round(normalized / angleStep) % count;
    if (newActive !== activeIndexRef.current) {
      activeIndexRef.current = newActive;
      setActiveIndex(newActive);
    }

    for (let i = 0; i < count; i++) {
      const el = cards[i];
      if (!el) continue;

      const cardAngle = angle + i * angleStep;
      const rad = (cardAngle * Math.PI) / 180;
      const cosVal = Math.cos(rad);
      const sinVal = Math.sin(rad);

      // Curved cylinder coords
      const x = sinVal * radius;
      const z = (cosVal - 1) * (radius * 0.95);
      const y = (1 - cosVal) * 12; // Natural rotunda curve lift

      // Card rotation angle following the cylindrical curve
      const rotY = -cardAngle * 0.72;

      // Distance ratio (1 at exact front center, 0 at deepest back)
      const distRatio = Math.max(0, (z + 2 * radius) / (2 * radius));
      
      // Scaling & perspective weighting
      const scale = 0.68 + 0.38 * Math.pow(distRatio, 1.4);
      const opacity = Math.max(0.18, Math.pow(distRatio, 1.6));
      const zIndex = Math.round(distRatio * 300);
      
      const isCenter = i === newActive;
      const blurAmount = distRatio < 0.6 ? (0.6 - distRatio) * 3.5 : 0;
      const brightness = 0.75 + 0.3 * distRatio;

      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = `${zIndex}`;
      el.style.filter = `blur(${blurAmount.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;
      
      if (isCenter) {
        el.classList.add('ring-2', 'ring-black', 'shadow-2xl');
      } else {
        el.classList.remove('ring-2', 'ring-black', 'shadow-2xl');
      }
    }
  }, [artworks.length, angleStep]);

  // Main RAF Physics Loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (!isDraggingRef.current) {
        // Friction decay on inertia
        if (Math.abs(velocityRef.current) > 0.02) {
          targetAngleRef.current += velocityRef.current;
          velocityRef.current *= 0.93;
        } else {
          velocityRef.current = 0;
          if (isAutoRotating) {
            const speedFactor = isHoveredRef.current ? 0.3 : 1.0;
            targetAngleRef.current -= 0.13 * speedFactor;
          }
        }
      }

      // Smooth lerp
      const lerpFactor = isDraggingRef.current ? 0.25 : 0.085;
      currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * lerpFactor;

      updateCardTransforms(currentAngleRef.current);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isAutoRotating, updateCardTransforms]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDraggingState(true);
    velocityRef.current = 0;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastPointerTimeRef.current, 8);
    const deltaX = e.clientX - lastPointerXRef.current;

    targetAngleRef.current += deltaX * 0.32;

    const instVelocity = (deltaX / dt) * 14;
    velocityRef.current = velocityRef.current * 0.4 + instVelocity * 0.6;

    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }

    velocityRef.current = Math.max(Math.min(velocityRef.current, 12), -12);
  };

  // Wheel interaction
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 2) {
      targetAngleRef.current -= delta * 0.12;
      velocityRef.current = -delta * 0.03;
    }
  };

  const handlePrev = () => {
    velocityRef.current = 0;
    targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep + angleStep;
  };

  const handleNext = () => {
    velocityRef.current = 0;
    targetAngleRef.current = Math.round(targetAngleRef.current / angleStep) * angleStep - angleStep;
  };

  const rotateToCard = (index: number) => {
    velocityRef.current = 0;
    const diff = index - activeIndexRef.current;
    let shortestDiff = diff;
    if (shortestDiff > totalCards / 2) shortestDiff -= totalCards;
    if (shortestDiff < -totalCards / 2) shortestDiff += totalCards;
    targetAngleRef.current -= shortestDiff * angleStep;
  };

  const currentActiveArtwork = artworks[activeIndex];

  return (
    <section id="hero" className="relative pt-8 pb-16 px-4 overflow-hidden bg-white select-none">
      {/* Target Style Hero Typography: "A JOURNEY THROUGH ARTS" */}
      <div className="max-w-5xl mx-auto text-center mb-6">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-6 h-px bg-stone-400" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-stone-500 font-semibold font-mono">
            {currentLang === 'tr' ? 'AÇIK SERGİ & SANAT ARŞİVİ' : 'OPEN EXHIBITION & ART ARCHIVE'}
          </span>
          <span className="w-6 h-px bg-stone-400" />
        </div>

        {/* Big Bold Headline matching target design */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-black tracking-tight uppercase leading-[0.95]">
          <span className="block">A JOURNEY</span>
          <span className="block font-light text-stone-900 mt-1">THROUGH ARTS</span>
        </h1>

        <p className="text-stone-600 max-w-2xl mx-auto mt-4 text-xs sm:text-sm leading-relaxed">
          {currentLang === 'tr'
            ? 'Sanatçıların kendi çizim ve fotoğraflarını paylaştığı, dünya çapında ikonik başyapıtların yer aldığı dijital sanat galerisi. Eserleri keşfedin, yaratım hikayelerini okuyun ve sanatçılarla doğrudan iletişime geçin.'
            : 'A digital gallery showcasing both independent artists’ original drawings and photography alongside timeless world-famous masterpieces. Discover the stories, analyze the craft, and connect directly with the creators.'}
        </p>

        {/* Rotunda Interactive Hint & Play/Pause */}
        <div className="flex items-center justify-center gap-3 mt-5 text-xs text-stone-500">
          <span className="flex items-center gap-1.5 font-mono text-[11px] bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            <Compass className="w-3.5 h-3.5 text-stone-700 animate-spin-slow" />
            {currentLang === 'tr' ? 'Panoramik eğri için sürükleyin' : 'Drag to rotate the curved gallery arc'}
          </span>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-[11px] font-medium transition-all cursor-pointer"
          >
            {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoRotating ? (currentLang === 'tr' ? 'Durdur' : 'Pause') : (currentLang === 'tr' ? 'Oynat' : 'Play')}</span>
          </button>
          <button
            onClick={() => {
              velocityRef.current = 0;
              targetAngleRef.current = 0;
            }}
            title="Reset"
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3D Curved Panorama Gallery Stage ("Dönemeç Duvarı") */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 45%',
        }}
        className={`relative h-[440px] sm:h-[480px] max-w-7xl mx-auto flex items-center justify-center select-none touch-none ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Gallery Lighting Horizon & Curved Floor Guide */}
        <div 
          className="absolute bottom-4 w-[850px] max-w-[95%] h-[180px] pointer-events-none rounded-[50%] border-b-2 border-stone-200/90 shadow-[0_30px_35px_-12px_rgba(0,0,0,0.06)]"
          style={{
            transform: 'rotateX(78deg) translateZ(-80px)',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        {/* 3D Cards Cylinder Ring */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {artworks.map((art, index) => {
            const isCenter = index === activeIndex;

            return (
              <div
                key={art.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCenter) {
                    onSelectArtwork(art);
                  } else {
                    rotateToCard(index);
                  }
                }}
                className={`absolute w-[260px] sm:w-[310px] md:w-[330px] bg-white border border-stone-200 p-3 rounded-lg cursor-pointer pointer-events-auto group will-change-transform backface-hidden transition-shadow duration-300 ${
                  isCenter ? 'ring-2 ring-black shadow-2xl' : 'hover:border-stone-400 shadow-lg'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Museum Exhibition Frame */}
                <div className="aspect-4/3 w-full bg-[#F2EFE9] overflow-hidden relative rounded border border-stone-200/90">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    draggable={false}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  {art.isCuratorPick && (
                    <div className="absolute top-2.5 left-2.5 bg-black/90 text-white text-[9px] font-mono px-2 py-0.5 tracking-widest uppercase rounded shadow-xs">
                      Curator Pick
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

                {/* Metadata & Title */}
                <div className="pt-3">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono mb-1">
                    <span>{art.accessionNumber}</span>
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">{art.year}</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 truncate group-hover:text-amber-900 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-600 truncate font-medium mt-0.5">
                    {art.artist}
                  </p>
                  
                  {/* Action footer */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-mono text-[11px]">
                      {art.views.toLocaleString()} {currentLang === 'tr' ? 'görüntülenme' : 'views'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtwork(art);
                      }}
                      className="text-stone-900 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer transition-transform group-hover:translate-x-0.5"
                    >
                      <span>{t.viewDetail}</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={handlePrev}
          aria-label="Previous artwork"
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next artwork"
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white border border-stone-200 text-stone-900 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30 cursor-pointer hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Mini Active Artwork Strip & Dots */}
      {currentActiveArtwork && (
        <div className="max-w-lg mx-auto mt-2 px-4">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {artworks.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => rotateToCard(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeIndex
                    ? 'w-6 h-1.5 bg-black'
                    : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 truncate pr-3">
              <img 
                src={currentActiveArtwork.imageUrl} 
                alt="" 
                className="w-7 h-7 rounded-full object-cover border border-stone-300 shrink-0" 
              />
              <div className="truncate">
                <span className="font-semibold text-stone-900 truncate block text-xs">
                  {currentActiveArtwork.title}
                </span>
                <span className="text-[10px] text-stone-500 truncate block">
                  {currentActiveArtwork.artist} · {currentActiveArtwork.year}
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectArtwork(currentActiveArtwork)}
              className="px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white text-[11px] font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.viewDetail} →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
