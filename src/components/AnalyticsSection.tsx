import React, { useState, useMemo } from 'react';
import { Artwork, ArtworkCategory } from '../types';
import { translations } from '../data/i18n';
import { artQuotes } from '../data/artQuotes';
import { EXHIBITION_VENUES } from '../data/exhibitionVenues';
import { BarChart3, PieChart, Layers, Eye, Palette, Award, Quote, MapPin } from 'lucide-react';

interface AnalyticsSectionProps {
  artworks: Artwork[];
  categories: ArtworkCategory[];
  currentLang: 'tr' | 'en';
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  artworks,
  categories,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [activeChartType, setActiveChartType] = useState<'category' | 'colors'>('category');

  // Compute exact telemetry directly from the authentic collection
  const totalArtworksCount = artworks.length;
  const uniqueArtistsCount = useMemo(
    () => new Set(artworks.map((a) => a.artist.trim())).size,
    [artworks]
  );
  const totalQuotesCount = artQuotes.length;
  const totalVenuesCount = EXHIBITION_VENUES.length;
  const uniqueVenueCountriesCount = useMemo(
    () => new Set(EXHIBITION_VENUES.map((v) => v.country)).size,
    []
  );
  const totalViews = useMemo(
    () => artworks.reduce((acc, a) => acc + (a.views || 0), 0),
    [artworks]
  );
  const curatorPicksCount = useMemo(
    () => artworks.filter((a) => a.isCuratorPick).length,
    [artworks]
  );

  // Accurate category counts and dynamic percentages
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const count = artworks.filter((a) => a.category === cat.id).length;
      const percentage = totalArtworksCount > 0 ? Math.round((count / totalArtworksCount) * 100) : 0;
      return {
        id: cat.id,
        name: currentLang === 'tr' ? cat.nameTr : cat.nameEn,
        count,
        percentage,
      };
    });
  }, [artworks, categories, currentLang, totalArtworksCount]);

  // Dynamic ranking for editorial summary
  const sortedCategories = useMemo(() => {
    return [...categoryStats].sort((a, b) => b.count - a.count);
  }, [categoryStats]);

  const topCategory = sortedCategories[0];
  const secondCategory = sortedCategories[1];

  // Dynamic tonal harmonies extracted from actual artwork color palettes
  const tonalStats = useMemo(() => {
    const colorMap: Record<string, { name: string; hex: string; totalWeight: number }> = {};
    artworks.forEach((art) => {
      art.colorPalette?.forEach((c) => {
        const key = c.hex.toLowerCase();
        if (!colorMap[key]) {
          colorMap[key] = { name: c.name, hex: c.hex, totalWeight: 0 };
        }
        colorMap[key].totalWeight += c.percentage || 10;
      });
    });
    const sorted = Object.values(colorMap)
      .sort((a, b) => b.totalWeight - a.totalWeight)
      .slice(0, 5);
    const sumWeight = sorted.reduce((sum, item) => sum + item.totalWeight, 0) || 1;
    return sorted.map((item) => ({
      name: item.name,
      hex: item.hex,
      score: Math.round((item.totalWeight / sumWeight) * 100),
    }));
  }, [artworks]);

  const chartColors = ['#1C3144', '#777572', '#C59B67', '#0B2545', '#8C8A85'];

  return (
    <section id="analitik" className="py-16 px-6 max-w-7xl mx-auto border-t border-[#E8E2D9]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] uppercase tracking-widest text-[#78350F] font-semibold font-mono block">
          {t.navAnalytics}
        </span>
        <h2 className="text-3xl lg:text-4xl font-serif text-[#1C1917] mt-1 font-medium">
          {t.statsTitle}
        </h2>
        <p className="text-stone-500 text-xs md:text-sm mt-2 font-sans">
          {t.statsDesc}
        </p>
      </div>

      {/* 6 Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {t.totalArtworks}
            </span>
            <Layers className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {totalArtworksCount}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {categories.length} {currentLang === 'tr' ? 'Küratöryel Disiplin' : 'Disciplines'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {t.totalArtists}
            </span>
            <Award className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {uniqueArtistsCount}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {currentLang === 'tr' ? 'Usta & Bağımsız Sanatçı' : 'Master & Independent Artists'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {currentLang === 'tr' ? 'Sanat Sözleri' : 'Art Quotes'}
            </span>
            <Quote className="w-4 h-4 text-[#9A7137]" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {totalQuotesCount}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {currentLang === 'tr' ? 'Tarihçi & Usta Alıntısı' : 'Verified Master Quotes'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {currentLang === 'tr' ? 'Müze & Harita' : 'Museum Map'}
            </span>
            <MapPin className="w-4 h-4 text-[#9A7137]" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {totalVenuesCount}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {uniqueVenueCountriesCount} {currentLang === 'tr' ? 'Ülkeden Müze' : 'Countries Mapped'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {t.totalViews}
            </span>
            <Eye className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {currentLang === 'tr' ? 'Sanatsal İnceleme' : 'Curatorial Views'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D9] p-5 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-stone-500">
              {currentLang === 'tr' ? 'Küratör Seçkisi' : 'Curator Picks'}
            </span>
            <Palette className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
            {curatorPicksCount}
          </div>
          <span className="text-[11px] text-stone-400 font-mono mt-1 block">
            {currentLang === 'tr' ? 'Öne Çıkarılan Başyapıt' : 'Highlighted Masterpieces'}
          </span>
        </div>
      </div>

      {/* Graphic Container */}
      <div className="bg-white border border-[#E8E2D9] p-6 lg:p-8 rounded-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F5EFEB]">
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900">
              {currentLang === 'tr'
                ? 'Kürasyon ve Arşiv Envanter Dağılımı'
                : 'Curatorial & Archival Inventory Breakdown'}
            </h3>
            <span className="text-xs text-stone-500 font-sans">
              {currentLang === 'tr'
                ? 'Koleksiyonda yer alan eserlerin disiplinlere göre güncel oranları'
                : 'Current distribution of cataloged artworks across curatorial disciplines'}
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F4EFEB] rounded border border-stone-200">
            <button
              onClick={() => setActiveChartType('category')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartType === 'category' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>{currentLang === 'tr' ? 'Kategori Dağılımı' : 'Category Distribution'}</span>
            </button>
            <button
              onClick={() => setActiveChartType('colors')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartType === 'colors' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{currentLang === 'tr' ? 'Tonal Harmoniler' : 'Tonal Harmonies'}</span>
            </button>
          </div>
        </div>

        {/* Visual Chart Bars & Legends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Chart Graphic Area (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {activeChartType === 'category' ? (
              <div className="space-y-4">
                {categoryStats.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between text-xs mb-1 font-sans">
                      <span className="font-medium text-stone-800 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        {item.name}
                      </span>
                      <span className="font-mono text-stone-500 tabular-nums">
                        {item.count} {currentLang === 'tr' ? 'Eser' : 'Works'} (%{item.percentage})
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#F4EFEB] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: chartColors[index % chartColors.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tonalStats.map((color) => (
                  <div key={color.name}>
                    <div className="flex justify-between text-xs mb-1 font-sans">
                      <span className="font-medium text-stone-800 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-xs border border-stone-300 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </span>
                      <span className="font-mono text-stone-500 tabular-nums">
                        %{color.score} {currentLang === 'tr' ? 'Frekans' : 'Frequency'}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#F4EFEB] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${color.score}%`,
                          backgroundColor: color.hex.toLowerCase() === '#ffffff' ? '#C59B67' : color.hex
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descriptive Information (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-5 border border-[#E8E2D9] rounded-xs text-xs space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78350F] font-semibold">
              {currentLang === 'tr' ? 'Kürasyon Raporu Özeti' : 'Curatorial Report Summary'}
            </span>
            <h4 className="font-serif text-lg font-semibold text-stone-900">
              {currentLang === 'tr' ? 'Koleksiyon Çeşitliliği ve Sanatsal Denge' : 'Collection Diversity & Curatorial Balance'}
            </h4>
            <p className="text-stone-600 leading-relaxed font-sans">
              {currentLang === 'tr'
                ? `NEVAART arşivinde yer alan ${totalArtworksCount} eserin %${topCategory?.percentage || 0}’i ${topCategory?.name || ''} disiplininde yer alırken; onu %${secondCategory?.percentage || 0} ile ${secondCategory?.name || ''} alanı izlemektedir. Arşiv ayrıca ${totalQuotesCount} doğrulanmış sanat sözü ve ${uniqueVenueCountriesCount} ülkeden ${totalVenuesCount} haritalı müzeyi kapsamaktadır.`
                : `Across the ${totalArtworksCount} cataloged works in the NEVAART archive, ${topCategory?.percentage || 0}% belong to ${topCategory?.name || ''}, closely accompanied by ${secondCategory?.name || ''} at ${secondCategory?.percentage || 0}%. The archive also curates ${totalQuotesCount} verified art quotes and ${totalVenuesCount} mapped museums across ${uniqueVenueCountriesCount} countries.`}
            </p>
            <p className="text-stone-600 leading-relaxed font-sans">
              {currentLang === 'tr'
                ? 'Renk ve doku analitiği, arşivdeki eserlerin sanatçıların özgün renk paletleri ve mimari-belgesel ışık dengeleriyle zenginleştiğini teyit etmektedir.'
                : 'Chromatic frequency analytics demonstrate authentic tonal harmony between natural pigments and spatial daylight spectrums across the collection.'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
