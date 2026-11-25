import React from 'react';
import { Artwork } from '../types';
import { translations } from '../data/i18n';
import { ArrowRight, Palette, BookOpen, Landmark, MessageSquareText } from 'lucide-react';

interface FeatureBannersSectionProps {
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (artwork: Artwork) => void;
  onOpenUpload?: () => void;
  onBrowseCategory: (cat: string) => void;
}

export const FeatureBannersSection: React.FC<FeatureBannersSectionProps> = ({
  artworks,
  currentLang,
  onSelectArtwork,
  onOpenUpload,
  onBrowseCategory,
}) => {
  const t = translations[currentLang];

  const banner1Art = artworks.find((a) => a.category === 'concept' || a.category === 'digital') || artworks[0];
  const banner2Art = artworks.find((a) => a.category === 'architecture' || a.category === 'illustration') || artworks[1];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 2 Feature Banners: "Kendi Eserini Yayınla" & "Başyapıtların Hikayesi" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        
        {/* Banner 1: Publish Your Art */}
        <div 
          onClick={onOpenUpload}
          className="relative h-[290px] sm:h-[350px] rounded-3xl overflow-hidden shadow-lg group cursor-pointer border border-stone-200"
        >
          <img 
            src={banner1Art.imageUrl} 
            alt="Kendi Eserini Yayınla" 
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-8 sm:p-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-mono mb-1 font-semibold">
              {currentLang === 'tr' ? 'SANATÇI AÇIK ALANI' : 'OPEN ARTIST SUBMISSION'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight leading-tight">
              {currentLang === 'tr' ? 'Kendi Eserini' : 'Publish Your'} <br />
              <span className="font-light text-stone-200">{currentLang === 'tr' ? 'Yayınla & Paylaş' : 'Art & Vision'}</span>
            </h3>
            <p className="text-xs text-stone-300 mt-2 max-w-sm">
              {currentLang === 'tr' 
                ? 'Çizimlerinizi, fotoğraflarınızı ve dijital işlerinizi arşive ekleyin; hikayenizi küratörlere ve sanatseverlere duyurun.'
                : 'Upload your original illustrations, photographs, and digital creations. Share your story with curators worldwide.'}
            </p>
            <div className="mt-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenUpload?.();
                }}
                className="px-5 py-2 bg-white hover:bg-stone-100 text-black text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer inline-flex items-center gap-2 group-hover:scale-105"
              >
                <span>{currentLang === 'tr' ? 'ESERİNİ ŞİMDİ YÜKLE' : 'SUBMIT YOUR ART'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner 2: Read Masterpiece Stories */}
        <div 
          onClick={() => onSelectArtwork(banner2Art)}
          className="relative h-[290px] sm:h-[350px] rounded-3xl overflow-hidden shadow-lg group cursor-pointer border border-stone-200"
        >
          <img 
            src={banner2Art.imageUrl} 
            alt="Başyapıtların Hikayesi" 
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-8 sm:p-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 font-mono mb-1 font-semibold">
              {currentLang === 'tr' ? 'KÜRATÖR & FELSEFE NOTLARI' : 'CURATORIAL PROVENANCE'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight leading-tight">
              {currentLang === 'tr' ? 'Eserlerin Gizli' : 'Stories Behind'} <br />
              <span className="font-light text-stone-200">{currentLang === 'tr' ? 'Hikayesini Oku' : 'The Masterpieces'}</span>
            </h3>
            <p className="text-xs text-stone-300 mt-2 max-w-sm">
              {currentLang === 'tr'
                ? 'Renk teorisi, sanatçının ruh hali ve eserin yaratım sürecindeki gizli detayları keşfedin.'
                : 'Uncover the chromatic theory, artist emotions, and historical provenance behind each masterpiece.'}
            </p>
            <div className="mt-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectArtwork(banner2Art);
                }}
                className="px-5 py-2 bg-white hover:bg-stone-100 text-black text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer inline-flex items-center gap-2 group-hover:scale-105"
              >
                <span>{currentLang === 'tr' ? 'HİKAYEYİ İNCELE' : 'READ STORY'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Open Gallery Value Badges (Focus on exhibition, stories, masters & direct artist contact) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-stone-200">
        <div className="flex flex-col items-center text-center p-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-3 shadow-xs">
            <Palette className="w-5 h-5 text-amber-800" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {currentLang === 'tr' ? 'Açık Sanatçı Alanı' : 'Open Artist Platform'}
          </h4>
          <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
            {currentLang === 'tr' ? 'Kendi çizim ve fotoğraflarınızı özgürce yayınlayın' : 'Publish your drawings and photography freely'}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-3 shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-800" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {currentLang === 'tr' ? 'Derin Yaratım Hikayeleri' : 'Creation Stories'}
          </h4>
          <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
            {currentLang === 'tr' ? 'Her eserin felsefesini, tekniğini ve renk teorisini öğrenin' : 'Discover the philosophy, technique, and color harmony'}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-3 shadow-xs">
            <Landmark className="w-5 h-5 text-amber-800" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {currentLang === 'tr' ? 'İkonik Başyapıtlar' : 'Historic Masterpieces'}
          </h4>
          <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
            {currentLang === 'tr' ? 'Dünya sanat tarihine damga vuran eserlerle bir arada' : 'Curated alongside legendary art historical masterworks'}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 mb-3 shadow-xs">
            <MessageSquareText className="w-5 h-5 text-amber-800" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            {currentLang === 'tr' ? 'Doğrudan Sanatçı İletişimi' : 'Direct Artist Contact'}
          </h4>
          <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
            {currentLang === 'tr' ? 'Beğendiğiniz eserin sahibiyle aracısız iletişime geçin' : 'Connect directly with the creator for inquiries or acquisition'}
          </p>
        </div>
      </div>
    </div>
  );
};
