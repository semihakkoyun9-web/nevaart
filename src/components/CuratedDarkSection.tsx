import React from 'react';
import { Artwork } from '../types';
import { translations } from '../data/i18n';
import { ArrowUpRight, BookOpen, Eye } from 'lucide-react';

interface CuratedDarkSectionProps {
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
  onBrowseAll: () => void;
}

export const CuratedDarkSection: React.FC<CuratedDarkSectionProps> = ({
  artworks,
  currentLang,
  onSelectArtwork,
  onBrowseAll,
}) => {
  const t = translations[currentLang];
  const darkArtworks = artworks.slice(2, 6);

  return (
    <section id="curated-dark-section" className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <div className="bg-[#121214] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Ambient gradient mesh */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header Row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-px bg-stone-500" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-mono font-semibold">
                {currentLang === 'tr' ? 'HİKAYESİ OLAN ESERLER' : 'STORIES BEHIND THE ART'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase tracking-tight text-white leading-tight">
              {currentLang === 'tr' ? (
                <>
                  BİNLERCE KELİMEYİ ANLATAN <br className="hidden sm:inline" />
                  <span className="font-light text-stone-300">BAŞYAPITLAR VE HİKAYELER</span>
                </>
              ) : (
                <>
                  ARTWORKS THAT SPEAK <br className="hidden sm:inline" />
                  <span className="font-light text-stone-300">A MILLION WORDS</span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
              {currentLang === 'tr' 
                ? 'Her fırça darbesinin, deklanşör anının ve renk seçiminin ardındaki felsefe. Eserleri inceleyin, hikayelerini okuyun ve sanatçısıyla doğrudan iletişim kurun.'
                : 'Every brushstroke, shutter click, and chromatic choice has a philosophy. Examine the artworks, read their stories, and reach out directly to the artist.'}
            </p>
          </div>

          <button
            onClick={onBrowseAll}
            className="self-start md:self-auto px-6 py-2.5 bg-white text-black hover:bg-stone-200 text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>{currentLang === 'tr' ? 'TÜM ARŞİVİ KEŞFET' : 'EXPLORE ALL STORIES'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Artworks Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {darkArtworks.map((art) => {
            return (
              <div
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className="bg-[#1C1C1F] border border-white/10 rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:border-white/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div>
                  {/* Artwork Image */}
                  <div className="aspect-3/4 w-full rounded-xl overflow-hidden bg-stone-900 relative border border-white/5">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/10">
                      {art.year}
                    </div>

                    {/* Views counter */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-stone-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                      <Eye className="w-3 h-3 text-stone-400" />
                      <span>{art.views.toLocaleString()} {currentLang === 'tr' ? 'görüntülenme' : 'views'}</span>
                    </div>
                  </div>

                  {/* Artwork Info */}
                  <div className="pt-3.5">
                    <span className="font-serif font-bold text-white text-base truncate block group-hover:text-amber-400 transition-colors">
                      {art.title}
                    </span>
                    <p className="text-stone-400 text-xs truncate mt-0.5">
                      {art.artist}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono mt-1 truncate">
                      {currentLang === 'tr' ? art.mediumTr : art.mediumEn}
                    </p>
                  </div>
                </div>

                {/* Read Story & Connect Action */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtwork(art);
                    }}
                    className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-[11px] font-semibold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 group-hover:border-white/20"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentLang === 'tr' ? 'HİKAYESİNİ OKU & İLETİŞİM' : 'READ STORY & CONTACT'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
