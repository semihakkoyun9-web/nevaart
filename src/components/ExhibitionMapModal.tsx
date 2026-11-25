import React, { useState } from 'react';
import { translations } from '../data/i18n';
import { X, MapPin, ExternalLink, Calendar, Building2, Navigation } from 'lucide-react';

interface ExhibitionMapModalProps {
  currentLang: 'tr' | 'en';
  onClose: () => void;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  exhibitionTitle: string;
  dates: string;
  lat: number;
  lng: number;
  address: string;
  curatorNotes: string;
}

const VENUES: Venue[] = [
  {
    id: 'ist-modern',
    name: 'İstanbul Modern Sanat Müzesi',
    city: 'İstanbul',
    country: 'Türkiye',
    exhibitionTitle: 'Işık ve Gölgenin Şehri: Kentsel Monokrom Retrospektifi',
    dates: '15 Mart - 30 Haziran 2026',
    lat: 41.0256,
    lng: 28.9839,
    address: 'Kılıçali Paşa Mah. Tophane İskele Cad. No:1/1 Beyoğlu, İstanbul',
    curatorNotes: 'Kaan Demir’in Galata Nocturne serisinin orijinal gümüş jelatin baskıları sergilenmektedir.'
  },
  {
    id: 'palais-tokyo',
    name: 'Palais de Tokyo · Galerie Contemporaine',
    city: 'Paris',
    country: 'Fransa',
    exhibitionTitle: 'Parametric Echoes in Alabaster',
    dates: '01 Nisan - 15 Temmuz 2026',
    lat: 48.8643,
    lng: 2.2974,
    address: '13 Avenue du Président Wilson, 75116 Paris',
    curatorNotes: 'Elenora Vane’in 12K dijital parametrik heykelleri ve özel aydınlatma enstalasyonu.'
  },
  {
    id: 'bauhaus-berlin',
    name: 'Bauhaus-Archiv / Museum für Gestaltung',
    city: 'Berlin',
    country: 'Almanya',
    exhibitionTitle: 'Hyperion: Brutalist Sanctuaries & Light Cavities',
    dates: '20 Şubat - 28 Mayıs 2026',
    lat: 52.5058,
    lng: 13.3533,
    address: 'Klingelhöferstraße 14, 10785 Berlin',
    curatorNotes: 'Marcus Thorne’un brütalist kütle kalıpları ve 1:20 ölçekli monolitik beton strüktürleri.'
  },
  {
    id: 'kyoto-museum',
    name: 'Kyoto Museum of Contemporary Art',
    city: 'Kyoto',
    country: 'Japonya',
    exhibitionTitle: 'Dialogues in Lapis & Mulberry Washi',
    dates: '10 Mayıs - 20 Ağustos 2026',
    lat: 35.0116,
    lng: 135.7681,
    address: 'Okazaki Enshojicho, Sakyo Ward, Kyoto',
    curatorNotes: 'Aoi Takahashi’nin doğal mineral lapis lazuli ve altın varak botanik illüstrasyonları.'
  }
];

export const ExhibitionMapModal: React.FC<ExhibitionMapModalProps> = ({
  currentLang,
  onClose,
}) => {
  const t = translations[currentLang];
  const [selectedVenue, setSelectedVenue] = useState<Venue>(VENUES[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xs">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#78350F]" />
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              {t.navExhibitions} & Google Maps Entegrasyonu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left list of venues (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78350F] font-semibold block mb-2">
                Aktif Sergi Salonları
              </span>
              
              {VENUES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVenue(v)}
                  className={`w-full text-left p-3.5 border rounded-xs transition-all cursor-pointer ${
                    selectedVenue.id === v.id
                      ? 'bg-white border-[#78350F] shadow-sm'
                      : 'bg-white/60 border-[#E8E2D9] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1">
                    <span>{v.city}, {v.country}</span>
                    <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">2026</span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-stone-900">
                    {v.name}
                  </h4>
                  <p className="text-xs text-[#78350F] font-medium mt-1 truncate">
                    {v.exhibitionTitle}
                  </p>
                </button>
              ))}
            </div>

            {/* Right Map Canvas & Details (7 cols) */}
            <div className="md:col-span-7 bg-white border border-[#E8E2D9] p-5 flex flex-col justify-between shadow-xs">
              <div>
                {/* Simulated Google Maps Iframe */}
                <div className="w-full h-56 bg-stone-200 border border-stone-300 rounded overflow-hidden relative mb-4">
                  <iframe
                    title="Exhibition Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${selectedVenue.lat},${selectedVenue.lng}&z=14&output=embed`}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#78350F] font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedVenue.dates}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-stone-900 font-medium">
                    {selectedVenue.exhibitionTitle}
                  </h3>

                  <div className="flex items-start gap-2 text-xs text-stone-600">
                    <Building2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedVenue.address}</span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] border border-stone-200 rounded text-xs text-stone-700">
                    <strong className="block text-stone-900 mb-1">Küratör Açıklaması:</strong>
                    {selectedVenue.curatorNotes}
                  </div>
                </div>
              </div>

              {/* Action Link to Google Maps External */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <span className="font-mono text-[11px] text-stone-500">
                  Koordinat: {selectedVenue.lat.toFixed(4)} N, {selectedVenue.lng.toFixed(4)} E
                </span>
                <a
                  href={`https://maps.google.com/?q=${selectedVenue.lat},${selectedVenue.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps'te Yol Tarifi Al</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
