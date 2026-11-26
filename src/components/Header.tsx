import React from 'react';
import { User } from '../types';
import { translations } from '../data/i18n';
import { NevaArtLogo } from './NevaArtLogo';
import { Heart, Plus, UserCheck, MapPin, ShieldCheck, LogIn } from 'lucide-react';

export type ActivePage = 'home' | 'collection' | 'quotes' | 'favorites' | 'admin';

interface HeaderProps {
  activePage: ActivePage;
  currentLang: 'tr' | 'en';
  onToggleLang: () => void;
  currentUser: User | null;
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

  const navItems: { id: ActivePage; labelTr: string; labelEn: string }[] = [
    { id: 'home', labelTr: 'Keşfet', labelEn: 'Explore' },
    { id: 'collection', labelTr: 'Koleksiyon', labelEn: 'Collection' },
    { id: 'quotes', labelTr: 'Sözler', labelEn: 'Quotes' },
  ];

  const isCurator = currentUser?.role === 'curator';

  const roleBadge = !currentUser
    ? ''
    : currentUser.role === 'curator'
    ? t.roleCurator
    : currentUser.role === 'member'
    ? t.roleMember
    : t.roleVisitor;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] shadow-2xs transition-all">
      {/* Tier 1: Museum Masthead & Spacious Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Bespoke Museum Crest & Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="shrink-0 flex items-center gap-3.5 text-left group cursor-pointer"
        >
          <NevaArtLogo theme="light" size="md" />
          <div className="flex flex-col">
            <span className="font-serif text-[21px] sm:text-[23px] font-semibold tracking-[0.14em] text-[#111113] leading-none uppercase">
              NevaArt
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-3 h-px bg-[#C59B5F]" />
              <span className="text-[9px] uppercase tracking-[0.26em] font-mono text-stone-500 font-medium whitespace-nowrap leading-none">
                {currentLang === 'tr' ? 'Dijital Sanat Müzesi' : 'Digital Art Museum'}
              </span>
            </div>
          </div>
        </button>

        {/* Right: Clean Museum Utility Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Favorites Heart Trigger */}
          <button
            onClick={() => onNavigate('favorites')}
            aria-label={currentLang === 'tr' ? 'Beğenilen Eserler ve Sözler' : 'Favorites'}
            className={`relative p-2 rounded-md transition-colors cursor-pointer ${
              activePage === 'favorites'
                ? 'text-red-600 bg-red-50'
                : 'text-stone-600 hover:text-[#111113] hover:bg-stone-100'
            }`}
            title={currentLang === 'tr' ? `Favorilerim (${favoritesCount})` : `Favorites (${favoritesCount})`}
          >
            <Heart
              className={`w-[18px] h-[18px] transition-colors ${
                favoritesCount > 0 || activePage === 'favorites' ? 'text-red-600 fill-red-600' : ''
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Subtle Language Switch */}
          <button
            onClick={onToggleLang}
            className="text-[11px] font-mono font-semibold uppercase tracking-widest text-stone-500 hover:text-[#111113] px-1.5 py-1 transition-colors cursor-pointer"
            title={currentLang === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
          >
            <span className={currentLang === 'tr' ? 'text-[#111113] underline underline-offset-4' : ''}>TR</span>
            <span className="mx-1 text-stone-300">/</span>
            <span className={currentLang === 'en' ? 'text-[#111113] underline underline-offset-4' : ''}>EN</span>
          </button>

          <span className="hidden sm:block w-px h-5 bg-stone-200" />

          {/* Real Auth Account Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 text-xs font-medium text-stone-700 hover:text-[#111113] px-2.5 py-1.5 rounded-md border border-transparent hover:border-stone-200 hover:bg-[#FAF8F5] transition-all cursor-pointer whitespace-nowrap"
          >
            {currentUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-[#9A7137]" />
                <span className="font-semibold text-[11px] max-w-[120px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider bg-[#FAF8F5] text-stone-700 px-2 py-0.5 rounded border border-[#E8E2D9]">
                  {roleBadge}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-[11px] uppercase tracking-[0.12em] font-semibold">
                  {currentLang === 'tr' ? 'Giriş' : 'Sign In'}
                </span>
              </>
            )}
          </button>

          {/* Architectural Primary CTA */}
          <button
            onClick={onOpenUpload}
            className="h-9 px-3.5 sm:px-4 bg-[#111113] hover:bg-stone-800 border border-[#111113] text-white text-[11px] uppercase tracking-[0.14em] font-semibold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59B5F]" />
            <span className="hidden sm:inline">{currentLang === 'tr' ? 'Eser Gönder' : 'Submit'}</span>
            <span className="sm:hidden">{currentLang === 'tr' ? 'Ekle' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Spacious Architectural Navigation Ribbon */}
      <nav
        aria-label={currentLang === 'tr' ? 'Ana Müze Navigasyonu' : 'Primary Museum Navigation'}
        className="h-11 bg-[#FAF8F5]/95 border-t border-[#E8E2D9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center sm:justify-center gap-7 sm:gap-10 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative h-full flex items-center text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#111113]'
                    : 'text-stone-500 hover:text-[#111113]'
                }`}
              >
                <span>{currentLang === 'tr' ? item.labelTr : item.labelEn}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111113]" />
                )}
              </button>
            );
          })}

          <button
            onClick={onOpenMap}
            className="relative h-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 hover:text-[#111113] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#9A7137]" />
            <span>{currentLang === 'tr' ? 'Müze Haritası' : 'Museum Map'}</span>
          </button>

          {isCurator && (
            <>
              <span className="w-px h-3.5 bg-stone-300 shrink-0" />
              <button
                onClick={() => onNavigate('admin')}
                className={`relative h-full flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activePage === 'admin'
                    ? 'text-amber-950'
                    : 'text-amber-900/85 hover:text-amber-950'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#9A7137]" />
                <span>{currentLang === 'tr' ? 'Küratör Paneli' : 'Curator Panel'}</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-700 text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    {pendingCount}
                  </span>
                )}
                {activePage === 'admin' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-800" />
                )}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
