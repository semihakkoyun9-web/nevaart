import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, ArrowUpRight } from 'lucide-react';
import { artQuotes } from '../data/artQuotes';

interface TestimonialsSectionProps {
  currentLang: 'tr' | 'en';
  onOpenAllQuotes?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  currentLang,
  onOpenAllQuotes,
}) => {
  const [pageStart, setPageStart] = useState(0);
  const pageSize = 3;
  const total = artQuotes.length;

  const prev = () => {
    setPageStart((p) => (p - pageSize + total) % total);
  };

  const next = () => {
    setPageStart((p) => (p + pageSize) % total);
  };

  const visibleQuotes = [0, 1, 2].map((offset) => artQuotes[(pageStart + offset) % total]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-px bg-stone-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-mono font-semibold">
              {currentLang === 'tr' ? `GERÇEK SANAT TARİHİ ARŞİVİ · ${total} SÖZ` : `HISTORICAL ART CRITICISM · ${total} QUOTES`}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
            {currentLang === 'tr' ? (
              <>
                SANAT TARİHÇİLERİ VE USTALAR <br className="hidden sm:inline" />
                <span className="font-light text-stone-700">NE DİYOR?</span>
              </>
            ) : (
              <>
                WHAT ART HISTORIANS &amp; MASTERS <br className="hidden sm:inline" />
                <span className="font-light text-stone-700">SAID</span>
              </>
            )}
          </h2>
        </div>

        {/* Controls + View All Page Button */}
        <div className="flex items-center gap-2.5">
          {onOpenAllQuotes && (
            <button
              onClick={onOpenAllQuotes}
              className="px-4 py-2 bg-stone-100 hover:bg-black hover:text-white text-stone-900 border border-stone-200 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentLang === 'tr' ? `Tüm ${total} Sözü Gör` : `View All ${total} Quotes`}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={prev}
            aria-label={currentLang === 'tr' ? 'Önceki sözler' : 'Previous quotes'}
            className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-black flex items-center justify-center text-stone-800 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label={currentLang === 'tr' ? 'Sonraki sözler' : 'Next quotes'}
            className="w-10 h-10 rounded-full bg-black hover:bg-stone-800 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quotes Grid (3 visible at a time, cycling through all 18) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleQuotes.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              idx === 0
                ? 'border-black shadow-lg ring-1 ring-black/5'
                : 'border-stone-200 hover:border-stone-400 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-5 h-5 text-amber-700" />
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                  {item.source} · {item.year}
                </span>
              </div>

              <p className="text-stone-700 text-sm leading-relaxed italic font-serif">
                &ldquo;{currentLang === 'tr' ? item.commentTr : item.commentEn}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-stone-700">
                {item.initials}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-black">
                  {item.name}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {currentLang === 'tr' ? item.roleTr : item.roleEn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
