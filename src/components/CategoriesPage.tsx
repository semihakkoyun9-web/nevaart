import React, { useState, useMemo } from 'react';
import { Artwork, ArtworkCategory } from '../types';
import { COLOR_FAMILIES, computeArtworkColorDensity } from '../utils/colorSearch';
import { ArrowLeft, Palette, Search, Heart, ArrowUpRight, SlidersHorizontal, Landmark, Calendar } from 'lucide-react';

interface CategoriesPageProps {
  artworks: Artwork[];
  categories: ArtworkCategory[];
  currentLang: 'tr' | 'en';
  likedIds: number[];
  onSelectArtwork: (art: Artwork) => void;
  onLikeArtwork: (id: number) => void;
  onBack: () => void;
  onLoadMoreFromMuseum?: (searchTerm?: string) => void;
  isLoadingMoreMuseum?: boolean;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  artworks,
  categories,
  currentLang,
  likedIds,
  onSelectArtwork,
  onLikeArtwork,
  onBack,
  onLoadMoreFromMuseum,
  isLoadingMoreMuseum = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [customHex, setCustomHex] = useState<string>('#204E8A');
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [selectedMuseum, setSelectedMuseum] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'color' | 'year_asc' | 'year_desc' | 'title'>('color');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 24;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedColor, customHex, selectedCentury, selectedMuseum, sortBy, searchQuery]);

  const colorCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cf of COLOR_FAMILIES) {
      map[cf.id] = cf.id === 'all'
        ? artworks.length
        : artworks.filter((a) => computeArtworkColorDensity(a, cf.id) >= 8).length;
    }
    return map;
  }, [artworks]);

  const rankedArtworks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = artworks
      .map((art) => ({
        art,
        colorDensity: computeArtworkColorDensity(art, selectedColor, customHex),
      }))
      .filter(({ art, colorDensity }) => {
        if (selectedCategory === 'favorites' && !likedIds.includes(art.id)) return false;
        if (selectedCategory !== 'all' && selectedCategory !== 'favorites' && art.category !== selectedCategory) return false;

        if (selectedColor !== 'all' && colorDensity < 8) return false;

        if (selectedCentury === 'pre1700' && art.year >= 1700) return false;
        if (selectedCentury === '1700s' && (art.year < 1700 || art.year >= 1800)) return false;
        if (selectedCentury === '1800s' && (art.year < 1800 || art.year >= 1900)) return false;
        if (selectedCentury === '1900s' && art.year < 1900) return false;

        if (selectedMuseum === 'met' && art.exhibitionLocation.city !== 'New York') return false;
        if (selectedMuseum === 'cma' && art.exhibitionLocation.city !== 'Cleveland') return false;

        if (q) {
          const blob = `${art.title} ${art.artist} ${art.accessionNumber} ${art.mediumTr} ${art.year}`.toLowerCase();
          if (!blob.includes(q)) return false;
        }
        return true;
      });

    list.sort((a, b) => {
      if (selectedColor !== 'all' && sortBy === 'color') {
        return b.colorDensity - a.colorDensity;
      }
      if (sortBy === 'year_asc') return a.art.year - b.art.year;
      if (sortBy === 'year_desc') return b.art.year - a.art.year;
      if (sortBy === 'title') return a.art.title.localeCompare(b.art.title, 'tr');
      return b.colorDensity - a.colorDensity || a.art.id - b.art.id;
    });

    return list;
  }, [artworks, selectedCategory, selectedColor, customHex, selectedCentury, selectedMuseum, sortBy, searchQuery, likedIds]);

  const activeColorLabel =
    selectedColor === 'custom'
      ? customHex.toUpperCase()
      : COLOR_FAMILIES.find((c) => c.id === selectedColor)?.[currentLang === 'tr' ? 'nameTr' : 'nameEn'] || '';

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-stone-200 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-black mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentLang === 'tr' ? 'Ana Galeriye Dön' : 'Back to Gallery'}</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-px bg-amber-700" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-mono font-semibold">
              {currentLang === 'tr' ? 'GELİŞMİŞ KATEGORİ & RENK SPEKTRUMU KEŞFİ' : 'ADVANCED CATEGORY & COLOR EXPLORER'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
            {currentLang === 'tr' ? (
              <>
                KATEGORİLER &amp; <span className="font-light text-stone-600">RENK YOĞUNLUĞU</span>
              </>
            ) : (
              <>
                CATEGORIES &amp; <span className="font-light text-stone-600">COLOR DENSITY</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-2xl">
            {currentLang === 'tr'
              ? 'Bir disiplin, yüzyıl, müze veya renk seçin — seçtiğiniz rengin piksel yoğunluğu en yüksek olan başyapıtlar otomatik olarak en üstte sıralanır.'
              : 'Select a discipline, century, museum, or color — artworks with the highest pixel density of that color are automatically ranked first.'}
          </p>
        </div>

        <div className="text-xs font-mono text-stone-500">
          <span className="text-black font-bold text-xl">{rankedArtworks.length}</span>{' '}
          {currentLang === 'tr' ? 'eşleşen başyapıt' : 'matching works'}
        </div>
      </div>

      {/* 5 Visual Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((cat) => {
          const sample = artworks.find((a) => a.category === cat.id);
          const count = artworks.filter((a) => a.category === cat.id).length;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? 'all' : cat.id)}
              className={`group text-left rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                isActive
                  ? 'border-black ring-2 ring-black shadow-lg bg-stone-900 text-white'
                  : 'border-stone-200 hover:border-stone-500 bg-white text-stone-900 shadow-xs'
              }`}
            >
              <div className="h-24 w-full overflow-hidden relative bg-stone-200">
                {sample && (
                  <img
                    src={sample.imageUrl}
                    alt={cat.nameTr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <span className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                  {count} {currentLang === 'tr' ? 'Eser' : 'Works'}
                </span>
              </div>
              <div className="p-3.5">
                <h3 className="font-display font-bold text-xs uppercase tracking-wide leading-snug">
                  {currentLang === 'tr' ? cat.nameTr : cat.nameEn}
                </h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                  {currentLang === 'tr' ? cat.descriptionTr : cat.descriptionEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Color Spectrum & Density Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-800" />
            <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-stone-900">
              {currentLang === 'tr'
                ? 'Renk Spektrumu Filtresi (Seçilen Rengin En Yoğun Olduğu Eserler Üstte Sıralanır)'
                : 'Color Spectrum Filter (Sorted by Highest Color Density)'}
            </h2>
          </div>

          {/* Custom Color Picker */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full text-xs cursor-pointer">
            <span className="font-mono text-[11px] text-stone-600">
              {currentLang === 'tr' ? 'Özel HEX Seç:' : 'Custom HEX:'}
            </span>
            <input
              type="color"
              value={customHex}
              onChange={(e) => {
                setCustomHex(e.target.value);
                setSelectedColor('custom');
                setSortBy('color');
              }}
              className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
            />
            <span className="font-mono text-[11px] font-bold text-stone-900">{customHex.toUpperCase()}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {COLOR_FAMILIES.map((cf) => {
            const isSel = selectedColor === cf.id;
            return (
              <button
                key={cf.id}
                onClick={() => {
                  setSelectedColor(cf.id);
                  if (cf.id !== 'all') setSortBy('color');
                }}
                className={`px-3.5 py-2 rounded-full text-xs flex items-center gap-2 transition-all cursor-pointer border ${
                  isSel
                    ? 'bg-black text-white border-black font-semibold shadow-sm scale-105'
                    : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-500'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: cf.dot }}
                />
                <span>{currentLang === 'tr' ? cf.nameTr : cf.nameEn}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${isSel ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {colorCounts[cf.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Detailed Filters Row: Century, Museum, Sort, Search */}
        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
            <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <select
              value={selectedCentury}
              onChange={(e) => setSelectedCentury(e.target.value)}
              className="bg-transparent text-xs text-stone-800 outline-none w-full cursor-pointer"
            >
              <option value="all">{currentLang === 'tr' ? 'Tüm Yüzyıllar' : 'All Centuries'}</option>
              <option value="pre1700">{currentLang === 'tr' ? '15.–17. Yüzyıl (Rönesans & Barok)' : 'Pre-1700 (Renaissance & Baroque)'}</option>
              <option value="1700s">{currentLang === 'tr' ? '18. Yüzyıl (Neoklasik)' : '18th Century'}</option>
              <option value="1800s">{currentLang === 'tr' ? '19. Yüzyıl (Empresyonizm)' : '19th Century'}</option>
              <option value="1900s">{currentLang === 'tr' ? '20. Yüzyıl (Modern)' : '20th Century'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
            <Landmark className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <select
              value={selectedMuseum}
              onChange={(e) => setSelectedMuseum(e.target.value)}
              className="bg-transparent text-xs text-stone-800 outline-none w-full cursor-pointer"
            >
              <option value="all">{currentLang === 'tr' ? 'Tüm Müzeler' : 'All Museums'}</option>
              <option value="met">The Metropolitan Museum of Art (NY)</option>
              <option value="cma">The Cleveland Museum of Art (Ohio)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 outline-none w-full cursor-pointer"
            >
              <option value="color">{currentLang === 'tr' ? 'Sırala: Renk Yoğunluğu (En Yüksek)' : 'Sort: Color Intensity'}</option>
              <option value="year_asc">{currentLang === 'tr' ? 'Kronolojik (Eskiden Yeniye)' : 'Year (Oldest First)'}</option>
              <option value="year_desc">{currentLang === 'tr' ? 'Kronolojik (Yeniden Eskiye)' : 'Year (Newest First)'}</option>
              <option value="title">{currentLang === 'tr' ? 'Alfabetik (A–Z)' : 'Alphabetical (A–Z)'}</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'tr' ? 'Eser, sanatçı, teknik...' : 'Artwork, artist, medium...'}
              className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 focus:border-black rounded-xl text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {rankedArtworks.length === 0 ? (
        <div className="py-16 text-center bg-white border border-dashed border-stone-300 rounded-2xl">
          <p className="font-serif text-xl text-stone-700">
            {currentLang === 'tr' ? 'Bu filtre kombinasyonunda eser bulunamadı.' : 'No artworks match these filters.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedColor('all');
              setSelectedCentury('all');
              setSelectedMuseum('all');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 bg-black text-white text-xs rounded-full cursor-pointer"
          >
            {currentLang === 'tr' ? 'Tüm Filtreleri Sıfırla' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {rankedArtworks
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map(({ art, colorDensity }, localIdx) => {
              const rankIdx = (currentPage - 1) * pageSize + localIdx;
              return (
            <article
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className="group bg-white border border-stone-200 hover:border-black rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-4/3 w-full bg-[#F4EFEB] relative overflow-hidden border-b border-stone-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Color Intensity Rank Badge when a color is selected */}
                {selectedColor !== 'all' && (
                  <span className="absolute top-3 left-3 bg-black/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{
                        backgroundColor:
                          selectedColor === 'custom'
                            ? customHex
                            : COLOR_FAMILIES.find((c) => c.id === selectedColor)?.dot,
                      }}
                    />
                    <span>
                      #{rankIdx + 1} · %{colorDensity} {activeColorLabel}
                    </span>
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeArtwork(art.id);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                    likedIds.includes(art.id)
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-white/90 text-stone-700 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedIds.includes(art.id) ? 'fill-red-600 text-red-600' : ''}`} />
                </button>

                {/* Real 5-Color Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                  {art.colorPalette.slice(0, 5).map((c, i) => (
                    <div key={i} style={{ backgroundColor: c.hex, width: `${c.percentage}%` }} className="h-full" />
                  ))}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                    {art.accessionNumber} · {art.year} · {art.exhibitionLocation.city}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium mt-0.5">{art.artist}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {art.colorPalette.slice(0, 5).map((c, i) => (
                      <span
                        key={i}
                        title={`${c.name} (${c.hex}) · %${c.percentage}`}
                        className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-black flex items-center gap-1">
                    <span>{currentLang === 'tr' ? 'İncele' : 'Inspect'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
              );
            })}
        </div>
      )}

      {/* Clean Museum Pagination (24 artworks per page across all 200+ works) */}
      {rankedArtworks.length > pageSize && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 320, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-medium bg-white border border-stone-200 hover:border-black disabled:opacity-40 rounded-md cursor-pointer"
          >
            ← {currentLang === 'tr' ? 'Önceki' : 'Prev'}
          </button>

          {Array.from({ length: Math.ceil(rankedArtworks.length / pageSize) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              className={`w-9 h-9 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#111113] text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-black'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={currentPage >= Math.ceil(rankedArtworks.length / pageSize)}
            onClick={() => {
              setCurrentPage((p) => Math.min(Math.ceil(rankedArtworks.length / pageSize), p + 1));
              window.scrollTo({ top: 320, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-medium bg-white border border-stone-200 hover:border-black disabled:opacity-40 rounded-md cursor-pointer"
          >
            {currentLang === 'tr' ? 'Sonraki' : 'Next'} →
          </button>
        </div>
      )}
    </div>
  );
};
