import React, { useState, useMemo } from 'react';
import { artQuotes, ArtQuote } from '../data/artQuotes';
import { Quote, Search, Volume2, VolumeX, Copy, Check, Heart } from 'lucide-react';

interface ArtQuotesPageProps {
  currentLang: 'tr' | 'en';
  likedQuoteIds: number[];
  onToggleLikeQuote: (id: number) => void;
  onBack: () => void;
}

export const ArtQuotesPage: React.FC<ArtQuotesPageProps> = ({
  currentLang,
  likedQuoteIds,
  onToggleLikeQuote,
}) => {
  const [selectedEra, setSelectedEra] = useState<'all' | ArtQuote['era']>('all');
  const [search, setSearch] = useState('');
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const eraTabs: { id: 'all' | ArtQuote['era']; labelTr: string; labelEn: string }[] = [
    { id: 'all', labelTr: `Tümü (${artQuotes.length})`, labelEn: `All (${artQuotes.length})` },
    { id: 'historians', labelTr: 'Sanat Tarihçileri', labelEn: 'Art Historians' },
    { id: 'impressionism', labelTr: 'Empresyonizm & Ukiyo-e', labelEn: 'Impressionism & Ukiyo-e' },
    { id: 'renaissance', labelTr: 'Rönesans & Barok', labelEn: 'Renaissance & Baroque' },
    { id: 'modern', labelTr: 'Modern Ustalar', labelEn: 'Modern Masters' },
  ];

  const featuredQuote = artQuotes[0];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return artQuotes.filter((item) => {
      const matchEra = selectedEra === 'all' || item.era === selectedEra;
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.commentTr.toLowerCase().includes(q) ||
        item.commentEn.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      return matchEra && matchQ;
    });
  }, [selectedEra, search]);

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
    utter.onerror = () => setSpeakingId(null);
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
      {/* Dark Onyx Luxury Editorial Banner */}
      <div className="bg-[#111113] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <span className="w-6 h-px bg-amber-500" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-amber-400 font-mono font-semibold">
                  {currentLang === 'tr' ? 'DOĞRULANMIŞ SANAT TARİHİ MANİFESTOLARI' : 'VERIFIED ART HISTORY ARCHIVE'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-semibold tracking-tight leading-[1.08] text-white">
                {currentLang === 'tr' ? 'Sanat Tarihçileri ve Ustalardan Sözler' : 'Words of Art Historians & Masters'}
              </h1>
              <p className="text-sm text-stone-400 mt-4 max-w-xl leading-relaxed">
                {currentLang === 'tr'
                  ? 'Rönesans’tan Modern Sanat’a kadar büyük ressamların mektuplarından, defterlerinden ve temel sanat tarihi kitaplarından derlenmiş kaynakçalı arşiv.'
                  : 'Curated historical quotes from letters, notebooks, and treatises of master artists and art historians.'}
              </p>
            </div>

            {/* Featured Quote Highlight Box */}
            <div className="lg:col-span-5 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-400">
                  {currentLang === 'tr' ? 'GÜNÜN MANİFESTOSU' : 'FEATURED QUOTE'}
                </span>
                <span className="text-[10px] font-mono text-stone-500">{featuredQuote.year}</span>
              </div>
              <p className="font-serif text-lg italic text-stone-100 leading-relaxed">
                &ldquo;{currentLang === 'tr' ? featuredQuote.commentTr : featuredQuote.commentEn}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{featuredQuote.name}</span>
                <span className="text-stone-400 font-mono text-[10px]">{featuredQuote.source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Clean Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#E8E2D9]">
          <div className="flex flex-wrap items-center gap-2">
            {eraTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedEra(tab.id)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border ${
                  selectedEra === tab.id
                    ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-xs'
                    : 'bg-white text-stone-700 border-[#E8E2D9] hover:border-stone-900'
                }`}
              >
                {currentLang === 'tr' ? tab.labelTr : tab.labelEn}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-auto lg:min-w-[270px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={currentLang === 'tr' ? 'Sanatçı, söz veya kaynak ara...' : 'Search artist, quote or source...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D9] focus:border-stone-900 rounded-full text-xs outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* Luxury Editorial Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {filtered.map((item) => {
            const isLiked = likedQuoteIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="group bg-white border border-[#E8E2D9] hover:border-stone-900 rounded-2xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider truncate">
                      {item.source} · {item.year}
                    </span>

                    <button
                      onClick={() => onToggleLikeQuote(item.id)}
                      title={isLiked ? (currentLang === 'tr' ? 'Favorilerden Çıkar' : 'Unlike') : (currentLang === 'tr' ? 'Sözü Beğen' : 'Save Quote')}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isLiked
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-stone-50 text-stone-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    </button>
                  </div>

                  <Quote className="w-5 h-5 text-stone-300 mb-3" />

                  <p className="font-serif text-[17px] text-stone-800 leading-relaxed italic">
                    &ldquo;{currentLang === 'tr' ? item.commentTr : item.commentEn}&rdquo;
                  </p>
                </div>

                <div className="mt-7 pt-5 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1C1917] text-amber-100 font-serif font-semibold text-sm flex items-center justify-center shrink-0">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 truncate">
                        {currentLang === 'tr' ? item.roleTr : item.roleEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleSpeak(item)}
                      title={currentLang === 'tr' ? 'Sesli Dinle' : 'Listen'}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        speakingId === item.id
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {speakingId === item.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      title={currentLang === 'tr' ? 'Sözü Kopyala' : 'Copy Quote'}
                      className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
