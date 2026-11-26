import React, { useMemo, useState } from 'react';
import { translations } from '../data/i18n';
import { EXHIBITION_VENUES, ExhibitionVenue } from '../data/exhibitionVenues';
import {
  X,
  MapPin,
  ExternalLink,
  Calendar,
  Building2,
  Navigation,
  Search,
  Globe,
} from 'lucide-react';

interface ExhibitionMapModalProps {
  currentLang: 'tr' | 'en';
  onClose: () => void;
}

type RegionFilter = 'all' | 'turkey' | 'europe' | 'america';

export const ExhibitionMapModal: React.FC<ExhibitionMapModalProps> = ({
  currentLang,
  onClose,
}) => {
  const t = translations[currentLang];
  const [selectedVenue, setSelectedVenue] = useState<ExhibitionVenue>(EXHIBITION_VENUES[0]);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const regionCounts = useMemo(
    () => ({
      all: EXHIBITION_VENUES.length,
      turkey: EXHIBITION_VENUES.filter((v) => v.region === 'turkey').length,
      europe: EXHIBITION_VENUES.filter((v) => v.region === 'europe').length,
      america: EXHIBITION_VENUES.filter((v) => v.region === 'america').length,
    }),
    []
  );

  const filteredVenues = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EXHIBITION_VENUES.filter((v) => {
      if (regionFilter !== 'all' && v.region !== regionFilter) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.exhibitionTitle.toLowerCase().includes(q) ||
        v.exhibitionTitleEn.toLowerCase().includes(q)
      );
    });
  }, [regionFilter, searchQuery]);

  const regionTabs: { id: RegionFilter; labelTr: string; labelEn: string }[] = [
    { id: 'all', labelTr: `Tümü (${regionCounts.all})`, labelEn: `All (${regionCounts.all})` },
    { id: 'turkey', labelTr: `Türkiye (${regionCounts.turkey})`, labelEn: `Turkey (${regionCounts.turkey})` },
    { id: 'europe', labelTr: `Avrupa (${regionCounts.europe})`, labelEn: `Europe (${regionCounts.europe})` },
    { id: 'america', labelTr: `Amerika (${regionCounts.america})`, labelEn: `Americas (${regionCounts.america})` },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl rounded-xs">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#78350F]" />
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                {t.navExhibitions} & Google Maps
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-900 text-amber-200 font-semibold">
              <Globe className="w-3 h-3" />
              {EXHIBITION_VENUES.length}{' '}
              {currentLang === 'tr' ? 'Dünya Müzesi' : 'World Museums'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={currentLang === 'tr' ? 'Kapat' : 'Close'}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left list of venues (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              {/* Region filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {regionTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRegionFilter(tab.id)}
                    className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                      regionFilter === tab.id
                        ? 'bg-[#111113] text-white border-[#111113]'
                        : 'bg-white text-stone-600 border-[#E8E2D9] hover:border-stone-400'
                    }`}
                  >
                    {currentLang === 'tr' ? tab.labelTr : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* Compact search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    currentLang === 'tr'
                      ? 'Müze, şehir veya ülke ara...'
                      : 'Search museum, city, or country...'
                  }
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none transition-colors"
                />
              </div>

              {/* Scrollable museum list */}
              <div className="max-h-[220px] md:max-h-[440px] overflow-y-auto pr-1 space-y-2.5">
                {filteredVenues.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500 bg-white border border-[#E8E2D9] rounded-xs">
                    {currentLang === 'tr'
                      ? 'Aramanızla eşleşen müze bulunamadı.'
                      : 'No museums matched your search.'}
                  </div>
                ) : (
                  filteredVenues.map((v) => {
                    const isActive = selectedVenue.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVenue(v)}
                        className={`w-full text-left p-3.5 border rounded-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white border-[#78350F] shadow-sm ring-1 ring-[#78350F]/15'
                            : 'bg-white/60 border-[#E8E2D9] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono mb-1">
                          <span>
                            {v.city}, {v.country}
                          </span>
                          {v.featuredCount ? (
                            <span className="text-[10px] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-amber-900 font-semibold">
                              {v.featuredCount} {currentLang === 'tr' ? 'Eser' : 'Works'}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                              {currentLang === 'tr' ? 'Kalıcı' : 'Permanent'}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-[15px] font-semibold text-stone-900 leading-snug">
                          {v.name}
                        </h4>
                        <p className="text-xs text-[#78350F] font-medium mt-1 truncate">
                          {currentLang === 'tr' ? v.exhibitionTitle : v.exhibitionTitleEn}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Map Canvas & Details (7 cols) */}
            <div className="md:col-span-7 bg-white border border-[#E8E2D9] p-5 flex flex-col justify-between shadow-xs">
              <div>
                {/* Embedded Google Maps Iframe */}
                <div className="w-full h-48 sm:h-60 bg-stone-200 border border-stone-300 rounded overflow-hidden relative mb-4">
                  <iframe
                    key={selectedVenue.id}
                    title={selectedVenue.name}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${selectedVenue.lat},${selectedVenue.lng}&z=15&output=embed`}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-[#78350F] font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'tr' ? selectedVenue.dates : selectedVenue.datesEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {selectedVenue.city} · {selectedVenue.country}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-stone-900 font-semibold leading-tight">
                      {selectedVenue.name}
                    </h3>
                    <p className="text-sm text-[#78350F] font-medium mt-1">
                      {currentLang === 'tr'
                        ? selectedVenue.exhibitionTitle
                        : selectedVenue.exhibitionTitleEn}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-stone-600">
                    <Building2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedVenue.address}</span>
                  </div>

                  <div className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded text-xs text-stone-700 leading-relaxed">
                    <strong className="block text-stone-900 mb-1">
                      {currentLang === 'tr' ? 'Müze & Koleksiyon Notu:' : 'Museum & Collection Note:'}
                    </strong>
                    {currentLang === 'tr'
                      ? selectedVenue.curatorNotes
                      : selectedVenue.curatorNotesEn}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-stone-500">
                  {currentLang === 'tr' ? 'Koordinat' : 'Coordinates'}:{' '}
                  {selectedVenue.lat.toFixed(4)}°, {selectedVenue.lng.toFixed(4)}°
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    href={selectedVenue.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{currentLang === 'tr' ? 'Resmi Müze Sitesi' : 'Official Website'}</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${selectedVenue.lat},${selectedVenue.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2 bg-[#111113] hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>
                      {currentLang === 'tr' ? "Google Maps'te Aç" : 'Open in Google Maps'}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
