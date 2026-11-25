import React, { useState } from 'react';
import { User } from '../types';
import { translations } from '../data/i18n';
import { Search, Heart, Globe, Plus, UserCheck, FileCode } from 'lucide-react';

interface HeaderProps {
  currentLang: 'tr' | 'en';
  onToggleLang: () => void;
  currentUser: User;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onOpenMap: () => void;
  onOpenAnalytics: () => void;
  onOpenPhpCode?: () => void;
  onSearchClick?: () => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  currentUser,
  onOpenUpload,
  onOpenAuth,
  onOpenMap,
  onOpenAnalytics,
  onOpenPhpCode,
  onSearchClick,
  favoritesCount = 0,
  onOpenFavorites,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'home' | 'stories' | 'gallery' | 'map'>('home');

  const scrollToSection = (id: string, tab: 'home' | 'stories' | 'gallery' | 'map') => {
    setActiveTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Refined Brand Logo */}
        <div className="shrink-0 flex items-center">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); scrollToSection('hero', 'home'); }}
            className="flex flex-col group cursor-pointer"
          >
            <span className="font-serif italic text-2xl font-bold tracking-tight text-black group-hover:text-amber-900 transition-colors leading-none">
              NevaArt
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] font-mono text-stone-400 font-semibold mt-1">
              {currentLang === 'tr' ? 'Açık Sanat Galerisi' : 'Open Art Gallery'}
            </span>
          </a>
        </div>

        {/* Center: Clean & Balanced Floating Pill Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F3F0] p-1.5 rounded-full border border-stone-200 shadow-xs">
          <button
            onClick={() => scrollToSection('hero', 'home')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-black text-white shadow-xs'
                : 'text-stone-700 hover:text-black hover:bg-stone-200/50'
            }`}
          >
            {currentLang === 'tr' ? 'Galeri' : 'Gallery'}
          </button>

          <button
            onClick={() => scrollToSection('curated-dark-section', 'stories')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-black text-white shadow-xs'
                : 'text-stone-700 hover:text-black hover:bg-stone-200/50'
            }`}
          >
            {currentLang === 'tr' ? 'Hikayeler' : 'Stories'}
          </button>

          <button
            onClick={() => scrollToSection('katalog', 'gallery')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-black text-white shadow-xs'
                : 'text-stone-700 hover:text-black hover:bg-stone-200/50'
            }`}
          >
            {currentLang === 'tr' ? 'Eser Kataloğu' : 'Catalog'}
          </button>

          <button
            onClick={onOpenMap}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
          >
            {currentLang === 'tr' ? 'Sergi Haritası' : 'Exhibitions'}
          </button>

          <button
            onClick={onOpenAnalytics}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-black hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
          >
            {currentLang === 'tr' ? 'Analitik' : 'Analytics'}
          </button>
        </nav>

        {/* Right: Perfectly Proportioned Actions Group */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Circular Search Button */}
          <button
            onClick={onSearchClick || (() => scrollToSection('katalog', 'gallery'))}
            aria-label={currentLang === 'tr' ? 'Eser Ara' : 'Search Artworks'}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 flex items-center justify-center transition-all cursor-pointer"
            title={currentLang === 'tr' ? 'Eser veya Sanatçı Ara' : 'Search Artworks'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites Button (Beğeni Sayfası / Filtresi - Kriter P & Z) */}
          <button
            onClick={onOpenFavorites || (() => scrollToSection('katalog', 'gallery'))}
            aria-label={currentLang === 'tr' ? 'Beğenilenler' : 'Favorites'}
            className="relative w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 flex items-center justify-center transition-all cursor-pointer group"
            title={currentLang === 'tr' ? `Beğenilen Eserler (${favoritesCount})` : `Favorites (${favoritesCount})`}
          >
            <Heart className={`w-4 h-4 transition-colors ${favoritesCount > 0 ? 'text-red-500 fill-red-500' : 'text-stone-700 group-hover:text-red-500'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="h-9 px-3 text-xs text-stone-700 hover:text-black border border-stone-200 hover:border-stone-400 rounded-full transition-all flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs"
            title={currentLang === 'tr' ? 'Dili Değiştir / Switch Language' : 'Switch Language'}
          >
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-mono uppercase font-semibold text-[11px]">{currentLang}</span>
          </button>

          {/* PHP Codebase Modal Trigger */}
          {onOpenPhpCode && (
            <button
              onClick={onOpenPhpCode}
              aria-label="PHP Kod Altyapısı"
              className="lg:hidden h-9 px-3 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-full flex items-center gap-1 font-mono font-medium"
              title="İnternet Programcılığı II PHP Kodları"
            >
              <FileCode className="w-4 h-4 text-amber-700" />
              <span>PHP</span>
            </button>
          )}

          {/* User Profile / Auth / Register Button (Kriter I & J) */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 h-9 px-3 sm:px-3.5 text-xs border border-stone-200 hover:border-black text-stone-800 rounded-full transition-all cursor-pointer bg-white shadow-2xs hover:bg-stone-50"
            title={currentLang === 'tr' ? 'Kullanıcı Oturum Açma, Kayıt ve Rol Yönetimi (Kriter I & J)' : 'User Login & Registration'}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-800" />
            <span className="font-medium text-[11px]">
              {currentLang === 'tr' ? 'Giriş / Kayıt' : 'Login / Register'}
            </span>
            <span className="hidden md:inline-block text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium border border-stone-200 truncate max-w-[100px]">
              {currentUser.role === 'curator' ? t.roleCurator : currentUser.role === 'member' ? t.roleMember : t.roleVisitor}
            </span>
          </button>

          {/* Primary Action Button: Eserini Yayınla */}
          <button
            onClick={onOpenUpload}
            className="h-9 px-4 bg-black hover:bg-stone-800 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="tracking-wide">
              {currentLang === 'tr' ? 'Eserini Yayınla' : 'Publish Art'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
