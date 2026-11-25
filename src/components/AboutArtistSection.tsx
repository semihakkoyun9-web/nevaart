import React from 'react';
import { Artwork } from '../types';
import { translations } from '../data/i18n';
import { ArrowRight } from 'lucide-react';

interface AboutArtistSectionProps {
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
  onExploreMore: () => void;
}

export const AboutArtistSection: React.FC<AboutArtistSectionProps> = ({
  artworks,
  currentLang,
  onSelectArtwork,
  onExploreMore,
}) => {
  const t = translations[currentLang];
  const fannedCards = artworks.slice(0, 3);

  const categoryLabels: Record<string, { tr: string; en: string }> = {
    digital: { tr: 'DİJİTAL SANAT', en: 'DIGITAL ART' },
    street: { tr: 'SOKAK FOTOĞRAFI', en: 'STREET PHOTO' },
    illustration: { tr: 'İLLÜSTRASYON', en: 'ILLUSTRATION' },
    architecture: { tr: 'MİMARİ', en: 'ARCHITECTURE' },
    concept: { tr: 'KONSEPT TASARIM', en: 'CONCEPT DESIGN' },
  };

  return (
    <section id="about-artist" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-14">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-5 h-px bg-stone-300" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold font-mono">
            {currentLang === 'tr' ? 'BAĞIMSIZ SANATÇILAR VE USTALAR' : 'COMMUNITY ARTISTS & MASTERS'}
          </span>
          <span className="w-5 h-px bg-stone-300" />
        </div>

        {/* Title strictly localized */}
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
          {currentLang === 'tr' ? (
            <>
              SANATIN DEHASI VE <br className="hidden sm:inline" />
              <span className="font-light text-stone-800">YETENEĞİN BULUŞMASI</span>
            </>
          ) : (
            <>
              A BLEND OF TALENTED <br className="hidden sm:inline" />
              <span className="font-light text-stone-800">GENIUS IN ART</span>
            </>
          )}
        </h2>

        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {currentLang === 'tr'
            ? 'Fotoğrafçıların, illüstratörlerin ve dijital sanatçıların kendi eserlerini paylaştığı; aynı zamanda dünya sanat tarihine damga vurmuş ikonik başyapıtların yer aldığı açık galeri. Eserleri inceleyin, hikayelerini okuyun ve sanatçılarla doğrudan bağ kurun.'
            : 'An open gallery where independent photographers, illustrators, and visual artists publish their works alongside world-renowned historic masterpieces. Examine the art, read the behind-the-scenes stories, and connect directly with the creators.'}
        </p>

        <div className="mt-6">
          <button
            onClick={onExploreMore}
            className="px-6 py-2.5 bg-black hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <span>{currentLang === 'tr' ? 'ESERLERİ VE HİKAYELERİ KEŞFET' : 'EXPLORE ARTWORKS & STORIES'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The 3 Fanned-Out Cards Showcase */}
      <div className="relative max-w-4xl mx-auto h-[380px] sm:h-[430px] flex items-center justify-center select-none pt-4">
        <div className="absolute w-[450px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {fannedCards.map((art, idx) => {
          let transformStyle = '';
          let zIndex = 10;
          let extraClasses = '';

          if (idx === 0) {
            transformStyle = 'rotate(-10deg) translate(-70px, 15px)';
            zIndex = 10;
            extraClasses = 'hover:rotate-0 hover:-translate-y-4 hover:z-30';
          } else if (idx === 1) {
            transformStyle = 'rotate(0deg) translate(0px, -10px) scale(1.04)';
            zIndex = 20;
            extraClasses = 'hover:-translate-y-4 hover:z-30 ring-2 ring-black/10';
          } else if (idx === 2) {
            transformStyle = 'rotate(10deg) translate(70px, 15px)';
            zIndex = 10;
            extraClasses = 'hover:rotate-0 hover:-translate-y-4 hover:z-30';
          }

          return (
            <div
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              style={{
                transform: transformStyle,
                zIndex,
              }}
              className={`absolute w-[220px] sm:w-[260px] md:w-[280px] bg-white p-3 rounded-xl shadow-xl border border-stone-200 cursor-pointer transition-all duration-500 ease-out group ${extraClasses}`}
            >
              <div className="aspect-3/4 w-full rounded-lg overflow-hidden bg-stone-100 relative border border-stone-200/80">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                  {art.year}
                </div>
              </div>

              <div className="pt-3 text-center">
                <h4 className="font-serif font-bold text-base text-stone-900 truncate group-hover:text-amber-900 transition-colors">
                  {art.title}
                </h4>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {art.artist}
                </p>
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span>{categoryLabels[art.category]?.[currentLang] || art.category.toUpperCase()}</span>
                  <span className="text-stone-900 font-semibold">{currentLang === 'tr' ? 'Hikayeyi Oku →' : 'Read Story →'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
