import React from 'react';
import { User as UserType } from '../types';
import { translations } from '../data/i18n';
import { NevaArtLogo } from './NevaArtLogo';
import {
  Heart,
  Plus,
  User as UserIcon,
  MapPin,
  Compass,
  LayoutGrid,
  Quote,
} from 'lucide-react';

export type ActivePage = 'home' | 'collection' | 'quotes' | 'favorites' | 'admin';

interface HeaderProps {
  activePage: ActivePage;
  currentLang: 'tr' | 'en';
  onToggleLang: () => void;
  currentUser: UserType | null;
  onNavigate: (page: ActivePage) => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onOpenMap: () => void;
  favoritesCount?: number;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  currentLang,
  onToggleLang,
  currentUser,
  onNavigate,
  onOpenUpload,
  onOpenAuth,
  onOpenMap,
  favoritesCount = 0,
  pendingCount = 0,
}) => {
  const t = translations[currentLang];

  const navItems: {
    id: ActivePage;
    labelTr: string;
    labelEn: string;
    Icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', labelTr: 'Keşfet', labelEn: 'Explore', Icon: Compass },
    { id: 'collection', labelTr: 'Koleksiyon', labelEn: 'Collection', Icon: LayoutGrid },
    { id: 'quotes', labelTr: 'Sözler', labelEn: 'Quotes', Icon: Quote },
  ];

  const isCurator = currentUser?.role === 'curator';
  const isMember = currentUser?.role === 'member';

  const roleBadge = !currentUser
    ? currentLang === 'tr'
      ? 'Ziyaretçi · Giriş Yap'
      : 'Visitor · Sign In'
    : currentUser.role === 'curator'
    ? t.roleCurator
    : currentUser.role === 'member'
    ? t.roleMember
    : t.roleVisitor;

  // Mücevher çerçeveli rol halkası: Baş Küratör = Yakut Kırmızı, Ziyaretçi = Zümrüt Yeşil, Sanatçı = Altın Amber
  const profileOuterBezel = isCurator
    ? 'bg-gradient-to-tr from-red-700 via-rose-500 to-amber-400 shadow-[0_0_16px_rgba(220,38,38,0.4)]'
    : isMember
    ? 'bg-gradient-to-tr from-amber-600 via-[#C59B5F] to-yellow-300 shadow-[0_0_14px_rgba(197,155,95,0.35)]'
    : 'bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_14px_rgba(16,185,129,0.32)]';

  const profileInnerMedallion = isCurator
    ? 'bg-[#161415] text-rose-200 group-hover:bg-[#1f1719]'
    : isMember
    ? 'bg-[#FAF8F5] text-amber-800 group-hover:bg-white'
    : 'bg-[#FAF8F5] text-emerald-700 group-hover:bg-white';

  const profileTooltip = currentUser
    ? `${currentUser.name} · ${roleBadge}`
    : roleBadge;

  return (
    <>
      {/* TOP FLOATING GLASS PILL BAR */}
      <header className="fixed top-2.5 sm:top-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto max-w-6xl mx-auto rounded-full bg-white/58 backdrop-blur-2xl backdrop-saturate-150 border border-white/65 shadow-[0_12px_38px_-10px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300">
          <div className="px-3.5 sm:px-5 h-14 sm:h-[62px] flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Bespoke Museum Crest & Wordmark */}
            <button
              onClick={() => onNavigate('home')}
              className="shrink-0 flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <NevaArtLogo theme="light" size="sm" />
              <div className="flex flex-col">
                <span className="font-serif text-[18px] sm:text-[20px] font-semibold tracking-[0.14em] text-[#111113] leading-none uppercase">
                  NevaArt
                </span>
                <span className="hidden xl:block text-[8px] uppercase tracking-[0.24em] font-mono text-stone-600 font-medium mt-1 whitespace-nowrap leading-none">
                  {currentLang === 'tr' ? 'Dijital Sanat Müzesi' : 'Digital Art Museum'}
                </span>
              </div>
            </button>

            {/* Center: Integrated Animated Glass Navigation (Desktop Only) */}
            <nav
              aria-label={currentLang === 'tr' ? 'Ana Müze Navigasyonu' : 'Primary Museum Navigation'}
              className="hidden lg:flex items-center gap-1.5 xl:gap-2.5"
            >
              {navItems.map(({ id, labelTr, labelEn, Icon }) => {
                const isActive = activePage === id;
                return (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
                    className={`group relative px-3.5 py-2 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#111113] text-white shadow-sm'
                        : 'text-stone-800 hover:text-[#111113] hover:bg-white/75'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 ${
                        isActive
                          ? 'text-[#E3C289]'
                          : 'text-stone-600 group-hover:text-[#9A7137]'
                      }`}
                    />
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                      {currentLang === 'tr' ? labelTr : labelEn}
                    </span>
                    {!isActive && (
                      <span className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-[#C59B5F] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={onOpenMap}
                className="group relative px-3.5 py-2 rounded-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-stone-800 hover:text-[#111113] hover:bg-white/75 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-[#9A7137] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  {currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map'}
                </span>
                <span className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-[#C59B5F] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </button>
            </nav>

            {/* Right: Heart · Single Lang Toggle · Circular "+" · Role-Ring Profile */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Favorites Heart Trigger */}
              <button
                onClick={() => onNavigate('favorites')}
                aria-label={currentLang === 'tr' ? 'Beğenilen Eserler ve Sözler' : 'Favorites'}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  activePage === 'favorites'
                    ? 'text-red-600 bg-red-50/90'
                    : 'text-stone-800 hover:text-[#111113] hover:bg-white/75'
                }`}
                title={
                  currentLang === 'tr'
                    ? `Favorilerim (${favoritesCount})`
                    : `Favorites (${favoritesCount})`
                }
              >
                <Heart
                  className={`w-[17px] h-[17px] transition-colors ${
                    favoritesCount > 0 || activePage === 'favorites'
                      ? 'text-red-600 fill-red-600'
                      : ''
                  }`}
                />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Single-Code Language Toggle (TR or EN) */}
              <button
                onClick={onToggleLang}
                aria-label={currentLang === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
                title={currentLang === 'tr' ? 'İngilizceye Geç (EN)' : 'Switch to Turkish (TR)'}
                className="w-9 h-9 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-stone-900 bg-white/55 hover:bg-white/85 border border-white/70 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs"
              >
                {currentLang.toUpperCase()}
              </button>

              <span className="hidden sm:block w-px h-5 bg-stone-400/40" />

              {/* Prominent Circular Black "+" Submit Artwork Button */}
              <button
                onClick={onOpenUpload}
                aria-label={currentLang === 'tr' ? 'Eser Gönder' : 'Submit Artwork'}
                title={currentLang === 'tr' ? 'Eser Gönder' : 'Submit Artwork'}
                className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full bg-[#111113] hover:bg-stone-800 text-white border border-[#C59B5F]/65 hover:border-[#C59B5F] shadow-md shadow-black/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0 group"
              >
                <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.5] text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Far-Right Circular Profile Button with Luxury Gradient Role Bezel */}
              <button
                onClick={onOpenAuth}
                aria-label={profileTooltip}
                title={profileTooltip}
                className={`group relative p-[2.5px] rounded-full transition-all duration-250 hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${profileOuterBezel}`}
              >
                <span
                  className={`w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center border border-white/85 transition-colors ${profileInnerMedallion}`}
                >
                  <UserIcon className="w-4 h-4 sm:w-[17px] sm:h-[17px] stroke-[2.1]" />
                </span>
                {isCurator && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING BOTTOM ICON-ONLY GLASS BAR */}
      <nav
        aria-label={currentLang === 'tr' ? 'Mobil Alt Navigasyon' : 'Mobile Bottom Navigation'}
        className="lg:hidden fixed bottom-3 inset-x-0 z-40 px-4 pointer-events-none"
      >
        <div className="pointer-events-auto max-w-[300px] mx-auto rounded-full bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/75 shadow-[0_14px_38px_-8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.85)] px-2.5 py-1.5 flex items-center justify-between gap-1">
          {navItems.map(({ id, labelTr, labelEn, Icon }) => {
            const isActive = activePage === id;
            const label = currentLang === 'tr' ? labelTr : labelEn;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                aria-label={label}
                title={label}
                className={`w-12 h-11 rounded-full flex items-center justify-center transition-all duration-250 cursor-pointer active:scale-90 ${
                  isActive
                    ? 'bg-[#111113] text-[#E3C289] shadow-md scale-105'
                    : 'text-stone-700 hover:text-[#111113] hover:bg-white/80'
                }`}
              >
                <Icon className="w-[19px] h-[19px]" />
              </button>
            );
          })}

          <button
            onClick={onOpenMap}
            aria-label={currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map'}
            title={currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map'}
            className="w-12 h-11 rounded-full flex items-center justify-center text-stone-700 hover:text-[#111113] hover:bg-white/80 transition-all duration-250 cursor-pointer active:scale-90"
          >
            <MapPin className="w-[19px] h-[19px] text-[#9A7137]" />
          </button>
        </div>
      </nav>
    </>
  );
};
