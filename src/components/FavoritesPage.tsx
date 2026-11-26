import React, { useState } from 'react';
import { Artwork } from '../types';
import { artQuotes, ArtQuote } from '../data/artQuotes';
import { Heart, Quote, ArrowUpRight, Volume2, VolumeX, Copy, Check, Sparkles, Compass } from 'lucide-react';

interface FavoritesPageProps {
  artworks: Artwork[];
  likedArtworkIds: number[];
  likedQuoteIds: number[];
  currentLang: 'tr' | 'en';
  onSelectArtwork: (art: Artwork) => void;
  onToggleLikeArtwork: (id: number) => void;
  onToggleLikeQuote: (id: number) => void;
  onGoToCollection: () => void;
  onGoToQuotes: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  artworks,
  likedArtworkIds,
  likedQuoteIds,
  currentLang,
  onSelectArtwork,
  onToggleLikeArtwork,
  onToggleLikeQuote,
  onGoToCollection,
  onGoToQuotes,
}) => {
  const [activeTab, setActiveTab] = useState<'artworks' | 'quotes'>('artworks');
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const likedArtworks = artworks.filter((a) => likedArtworkIds.includes(a.id));
  const likedQuotes = artQuotes.filter((q) => likedQuoteIds.includes(q.id));

  const handleSpeak = (item: ArtQuote) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === item.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `${item.name}: ${currentLang === 'tr' ? item.commentTr : item.commentEn}`
    );
    utter.lang = currentLang === 'tr' ? 'tr-TR' : 'en-US';
    utter.rate = 0.95;
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(item.id);
    window.speechSynthesis.speak(utter);
  };

  const handleCopy = (item: ArtQuote) => {
    navigator.clipboard.writeText(
      `"${currentLang === 'tr' ? item.commentTr : item.commentEn}" — ${item.name} (${item.source}, ${item.year})`
    );
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Luxury Editorial Hero Banner */}
      <div className="bg-[#111113] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-stone-400 font-mono font-semibold">
                  {currentLang === 'tr' ? 'KİŞİSEL KÜRASYON ARŞİVİNİZ' : 'YOUR PERSONAL CURATION'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-semibold tracking-tight text-white">
                {currentLang === 'tr' ? 'Beğenilen Eserler & Sözler' : 'Saved Artworks & Quotes'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-3 max-w-xl leading-relaxed">
                {currentLang === 'tr'
                  ? 'Kalp ikonuyla seçtiğiniz başyapıtlar ve favori sanat tarihçisi alıntılarınız burada kişisel müze seçkiniz olarak saklanır.'
                  : 'Masterpieces and historical art quotes you have favorited are preserved here as your personal museum collection.'}
              </p>
            </div>

            {/* Clean Segmented Tabs */}
            <div className="inline-flex p-1.5 bg-stone-900 border border-stone-800 rounded-full self-start md:self-end">
              <button
                onClick={() => setActiveTab('artworks')}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'artworks'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTab === 'artworks' ? 'fill-red-600 text-red-600' : ''}`} />
                <span>
                  {currentLang === 'tr' ? 'Beğenilen Eserler' : 'Saved Artworks'} ({likedArtworks.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'quotes'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'tr' ? 'Beğenilen Sözler' : 'Saved Quotes'} ({likedQuotes.length})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'artworks' ? (
          likedArtworks.length === 0 ? (
            <div className="py-24 text-center bg-white border border-[#E8E2D9] rounded-2xl max-w-2xl mx-auto px-6 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-stone-900 font-semibold">
                {currentLang === 'tr' ? 'Henüz Beğendiğiniz Bir Eser Yok' : 'No Saved Artworks Yet'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                {currentLang === 'tr'
                  ? 'Koleksiyon sayfasındaki 60+ gerçek müze başyapıtını gezerken sağ üstteki kalp ikonuna basarak kendi özel seçkinizi oluşturabilirsiniz.'
                  : 'Explore over 60 authentic museum masterpieces in the Collection and click the heart icon to curate your personal gallery.'}
              </p>
              <button
                onClick={onGoToCollection}
                className="mt-6 px-7 py-3 bg-black hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>{currentLang === 'tr' ? 'Koleksiyonu Keşfet' : 'Explore Collection'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {likedArtworks.map((art) => (
                <article
                  key={art.id}
                  onClick={() => onSelectArtwork(art)}
                  className="group bg-white border border-[#E8E2D9] hover:border-black rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="aspect-4/3 w-full bg-[#F4EFEB] relative overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLikeArtwork(art.id);
                      }}
                      title={currentLang === 'tr' ? 'Favorilerden Çıkar' : 'Remove from Favorites'}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                      {art.colorPalette.slice(0, 5).map((c, i) => (
                        <div key={i} style={{ backgroundColor: c.hex, width: `${c.percentage}%` }} className="h-full" />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                        {art.accessionNumber} · {art.year}
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium mt-1">{art.artist}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-mono text-[11px]">{art.exhibitionLocation.city}</span>
                      <span className="font-semibold text-black flex items-center gap-1">
                        <span>{currentLang === 'tr' ? 'Eseri İncele' : 'Inspect'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : likedQuotes.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#E8E2D9] rounded-2xl max-w-2xl mx-auto px-6 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-5">
              <Quote className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 font-semibold">
              {currentLang === 'tr' ? 'Henüz Kaydedilmiş Bir Söz Yok' : 'No Saved Quotes Yet'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
              {currentLang === 'tr'
                ? 'Sanat Sözleri sayfasındaki 18 tarihsel alıntı arasından beğendiklerinizi kalp ikonuyla kaydedebilirsiniz.'
                : 'Browse 18 verified historical art quotes and click the heart icon to save your favorites here.'}
            </p>
            <button
              onClick={onGoToQuotes}
              className="mt-6 px-7 py-3 bg-black hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentLang === 'tr' ? 'Sanat Sözlerini Oku' : 'Browse Art Quotes'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {likedQuotes.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-[#E8E2D9] hover:border-stone-900 rounded-2xl p-7 flex flex-col justify-between transition-all shadow-xs hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-semibold">
                      {item.source} · {item.year}
                    </span>
                    <button
                      onClick={() => onToggleLikeQuote(item.id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center cursor-pointer hover:bg-red-100"
                      title={currentLang === 'tr' ? 'Favorilerden Çıkar' : 'Remove'}
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                    </button>
                  </div>
                  <p className="font-serif text-lg text-stone-800 italic leading-relaxed">
                    &ldquo;{currentLang === 'tr' ? item.commentTr : item.commentEn}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-xs flex items-center justify-center">
                      {item.initials}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-black">{item.name}</h4>
                      <p className="text-[11px] text-stone-500">{currentLang === 'tr' ? item.roleTr : item.roleEn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                        speakingId === item.id ? 'bg-amber-700 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {speakingId === item.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
