import React, { useState, useMemo } from 'react';
import { Artwork, ArtworkCategory } from '../types';
import { translations } from '../data/i18n';
import { Search, Heart, ArrowUpRight, Palette, Award, BookOpen } from 'lucide-react';

interface ArtworkGridProps {
  artworks: Artwork[];
  categories: ArtworkCategory[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
  onLikeArtwork: (id: number) => void;
  likedIds?: number[];
  showOnlyFavorites?: boolean;
  onResetFavoriteFilter?: () => void;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  categories,
  currentLang,
  onSelectArtwork,
  onLikeArtwork,
  likedIds = [],
  showOnlyFavorites = false,
  onResetFavoriteFilter,
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>(showOnlyFavorites ? 'favorites' : 'all');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    if (showOnlyFavorites) {
      setSelectedCategory('favorites');
    }
  }, [showOnlyFavorites]);

  const categoryLabels: Record<string, { tr: string; en: string }> = {
    digital: { tr: 'DİJİTAL SANAT', en: 'DIGITAL ART' },
    street: { tr: 'SOKAK FOTOĞRAFI', en: 'STREET PHOTO' },
    illustration: { tr: 'İLLÜSTRASYON', en: 'ILLUSTRATION' },
    architecture: { tr: 'MİMARİ', en: 'ARCHITECTURE' },
    concept: { tr: 'KONSEPT TASARIM', en: 'CONCEPT DESIGN' },
  };

  const COLOR_FAMILIES = [
    { id: 'all', name: currentLang === 'tr' ? 'Tüm Spektrum' : 'All Spectrum', dot: '#D6CEBE' },
    { id: 'blue', name: currentLang === 'tr' ? 'Prusya & Lapis' : 'Prussian & Lapis', dot: '#183661' },
    { id: 'mono', name: currentLang === 'tr' ? 'Monokrom Noir' : 'Monochrome Noir', dot: '#0D0D0D' },
    { id: 'red', name: currentLang === 'tr' ? 'Vermilion & Oksit' : 'Vermilion & Oxide', dot: '#9E2A2B' },
    { id: 'alabaster', name: currentLang === 'tr' ? 'Alabaster & Beton' : 'Alabaster & Concrete', dot: '#858380' },
  ];

  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      let matchesCategory = false;
      if (selectedCategory === 'favorites') {
        matchesCategory = likedIds.includes(art.id);
      } else if (selectedCategory === 'all') {
        matchesCategory = true;
      } else {
        matchesCategory = art.category === selectedCategory;
      }

      let matchesColor = true;
      if (selectedColorFamily === 'blue') {
        matchesColor = art.colorPalette.some(c => ['#183661', '#284878', '#5D8AA8', '#1B3B6F'].includes(c.hex));
      } else if (selectedColorFamily === 'mono') {
        matchesColor = art.colorPalette.some(c => ['#0D0D0D', '#0A0A0A', '#121212', '#2F2E2D'].includes(c.hex));
      } else if (selectedColorFamily === 'red') {
        matchesColor = art.colorPalette.some(c => ['#9E2A2B', '#C87D55', '#D00000', '#540B0E'].includes(c.hex));
      } else if (selectedColorFamily === 'alabaster') {
        matchesColor = art.colorPalette.some(c => ['#F5F3EF', '#F7F4EE', '#858380', '#AFAEA9'].includes(c.hex));
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.artist.toLowerCase().includes(q) ||
        art.accessionNumber.toLowerCase().includes(q) ||
        art.mediumTr.toLowerCase().includes(q) ||
        art.mediumEn.toLowerCase().includes(q) ||
        art.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesColor && matchesSearch;
    });
  }, [artworks, selectedCategory, selectedColorFamily, searchQuery]);

  return (
    <section id="katalog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-px bg-stone-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-mono font-semibold">
              {currentLang === 'tr' ? 'YENİ — KOLEKSİYON' : 'NEW — ARTWORKS'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
            {currentLang === 'tr' ? (
              <>
                ÇAĞDAŞ SANATÇILAR <br />
                <span className="font-light text-stone-700">MODERN GALERİ</span>
              </>
            ) : (
              <>
                DRAMATIC ARTIST <br />
                <span className="font-light text-stone-700">MODERN GALLERY</span>
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl">
            {currentLang === 'tr'
              ? 'Küratör onaylı başyapıtlar, bağımsız sanatçı çizimleri ve derin renk teorisi analitiği.'
              : 'Curator-approved masterpieces, independent artist submissions, and deep chromatic spectrum analytics.'}
          </p>
        </div>

        <div className="text-xs text-stone-500 font-mono self-start md:self-auto">
          <span className="text-black font-bold text-sm">{filteredArtworks.length}</span> {currentLang === 'tr' ? 'eser sergileniyor' : 'artworks displayed'}
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/90 rounded-full border border-stone-200/80">
            <button
              onClick={() => {
                setSelectedCategory('all');
                onResetFavoriteFilter?.();
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${selectedCategory === 'all'
                  ? 'bg-black text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
                }`}
            >
              {t.allCategories}
            </button>

            {/* Dedicated Favorites Tab */}
            <button
              onClick={() => setSelectedCategory('favorites')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${selectedCategory === 'favorites'
                  ? 'bg-red-600 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-red-600 hover:bg-stone-200/60'
                }`}
            >
              <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'favorites' ? 'fill-white text-white' : (likedIds.length > 0 ? 'fill-red-500 text-red-500' : 'text-stone-400')}`} />
              <span>{currentLang === 'tr' ? `Beğendiklerim (${likedIds.length})` : `Favorites (${likedIds.length})`}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat.id
                    ? 'bg-black text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
                  }`}
              >
                {currentLang === 'tr' ? cat.nameTr : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Live Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'tr' ? 'Sanatçı, eser veya teknik ara...' : 'Search artist, artwork or medium...'}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 focus:border-black rounded-full text-xs text-stone-900 placeholder:text-stone-400 outline-none transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dominant Color Spectrum Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-stone-700 font-mono text-[11px] font-semibold flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-800" />
            {currentLang === 'tr' ? 'Renk Filtresi:' : 'Color Palette:'}
          </span>
          {COLOR_FAMILIES.map((cf) => (
            <button
              key={cf.id}
              onClick={() => setSelectedColorFamily(cf.id)}
              className={`px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all cursor-pointer ${selectedColorFamily === cf.id
                  ? 'bg-black border-black text-white font-semibold shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                style={{ backgroundColor: cf.dot }}
              />
              <span>{cf.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Artworks Catalog Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 bg-white rounded-2xl p-6">
          <p className="font-serif text-2xl text-stone-700">
            {selectedCategory === 'favorites'
              ? (currentLang === 'tr' ? '❤️ Henüz beğenilen eseriniz bulunmuyor.' : '❤️ No favorite artworks yet.')
              : (currentLang === 'tr' ? 'Aradığınız kriterlere uygun eser bulunamadı.' : 'No artworks found matching your criteria.')}
          </p>
          <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
            {selectedCategory === 'favorites'
              ? (currentLang === 'tr' ? 'Katalogdaki eserlerin sağ üst köşesindeki kalp ikonuna tıklayarak beğendiğiniz şaheserleri bu alanda toplayabilirsiniz.' : 'Click the heart icon on any artwork to add it to your personal curation list.')
              : (currentLang === 'tr' ? 'Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayabilirsiniz.' : 'Try different keywords or clear the filters.')}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedColorFamily('all');
              setSearchQuery('');
              onResetFavoriteFilter?.();
            }}
            className="mt-5 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
          >
            {currentLang === 'tr' ? 'Tüm Kataloğu Göster' : 'Browse All Artworks'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((art) => {
            return (
              <article
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className="group bg-white border border-stone-200 hover:border-black transition-all duration-300 rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image slot */}
                <div className="aspect-4/3 w-full bg-[#F4EFEB] relative overflow-hidden border-b border-stone-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Curator Pick Label */}
                  {art.isCuratorPick && (
                    <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-xs text-white text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded shadow-xs">
                      {currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Pick'}
                    </span>
                  )}

                  {/* Quick Like Action Button (Kırmızı Kalp Durumu) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeArtwork(art.id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${likedIds.includes(art.id)
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 scale-105'
                        : 'bg-white/90 hover:bg-white text-stone-700 hover:text-red-600'
                      }`}
                    title={likedIds.includes(art.id) ? (currentLang === 'tr' ? 'Beğeniden Çıkar' : 'Unlike') : (currentLang === 'tr' ? 'Beğen' : 'Like')}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${likedIds.includes(art.id) ? 'fill-red-600 text-red-600' : ''}`} />
                  </button>

                  {/* Discipline / Year indicator */}
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>{categoryLabels[art.category]?.[currentLang] || art.category.toUpperCase()} · {art.year}</span>
                  </div>

                  {/* Color bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex">
                    {art.colorPalette.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: color.hex,
                          width: `${color.percentage}%`,
                        }}
                        className="h-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono mb-1.5">
                      <span>{art.accessionNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{categoryLabels[art.category]?.[currentLang] || art.category}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5 font-medium">
                      {art.artist}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {currentLang === 'tr' ? art.storyTr : art.storyEn}
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {art.colorPalette.slice(0, 4).map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>

                    <span className="text-black font-semibold group-hover:text-amber-900 flex items-center gap-1">
                      <span>{currentLang === 'tr' ? 'Hikayesini Oku & İncele' : 'Read Story & Inspect'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
