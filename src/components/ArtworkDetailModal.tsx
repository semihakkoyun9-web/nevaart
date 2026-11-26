import React, { useState, useEffect, useRef } from 'react';
import { Artwork, CuratorReview, User, ColorSwatch, ColorAnalysisResult, PrintOption } from '../types';
import { translations } from '../data/i18n';
import { extractColorsFromImage } from '../utils/colorExtractor';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  MapPin,
  Sparkles,
  ExternalLink,
  Star,
  Send,
  MessageSquare,
  MessageCircle,
  ZoomIn,
  ShoppingBag,
  Volume2,
  VolumeX,
  Award,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface ArtworkDetailModalProps {
  artwork: Artwork;
  allArtworks: Artwork[];
  reviews: CuratorReview[];
  currentUser: User;
  currentLang: 'tr' | 'en';
  onClose: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onAddReview: (review: Omit<CuratorReview, 'id' | 'date'>) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  allArtworks,
  reviews,
  currentUser,
  currentLang,
  onClose,
  onSelectArtwork,
  onAddReview,
}) => {
  const t = translations[currentLang];
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Dynamic Pixel Color Extraction State
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysisResult | null>(null);
  const [isAnalyzingColors, setIsAnalyzingColors] = useState(true);
  const [selectedColorDetail, setSelectedColorDetail] = useState<ColorSwatch | null>(null);

  // Product Purchase / Archival Print State
  const [selectedPrintSize, setSelectedPrintSize] = useState<string>(
    artwork.printOptions?.[0]?.size || '60 × 90 cm Standart Arşiv Baskısı'
  );
  const [selectedFrame, setSelectedFrame] = useState<'none' | 'oak' | 'black'>('oak');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Audio Guide State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioIntervalRef = useRef<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);

  // Extract true pixel colors when artwork changes
  useEffect(() => {
    setIsAnalyzingColors(true);
    extractColorsFromImage(artwork.imageUrl, artwork.colorPalette).then((res) => {
      setColorAnalysis(res);
      setSelectedColorDetail(res.palette[0] || null);
      setIsAnalyzingColors(false);
    });
  }, [artwork]);

  // Gerçek Sesli Eser Anlatımı (Web Speech API — Tarayıcıda Gerçek Ses Çalar)
  useEffect(() => {
    const stopSpeech = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };

    if (isPlayingAudio) {
      stopSpeech();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const textToSpeak = currentLang === 'tr'
          ? `${artwork.title}. Sanatçı: ${artwork.artist}, ${artwork.year}. ${artwork.storyTr}`
          : `${artwork.title}, by ${artwork.artist}, ${artwork.year}. ${artwork.storyEn}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLang === 'tr' ? 'tr-TR' : 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setAudioProgress(100);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        };
        setAudioProgress(5);
        window.speechSynthesis.speak(utterance);

        audioIntervalRef.current = window.setInterval(() => {
          setAudioProgress((prev) => (prev < 95 ? prev + 2 : 95));
        }, 400);
      }
    } else {
      stopSpeech();
      setAudioProgress(0);
    }

    return () => {
      stopSpeech();
    };
  }, [isPlayingAudio, artwork, currentLang]);

  const activePalette = colorAnalysis?.palette || artwork.colorPalette;
  const currentPrintOption =
    artwork.printOptions?.find((p) => p.size === selectedPrintSize) ||
    artwork.printOptions?.[0] || {
      size: '60 × 90 cm Standart Arşiv Baskısı',
      paperType: 'Hahnemühle Photo Rag 308 gsm',
      priceTl: 7500,
      priceEur: 210,
      editionTotal: 50,
      editionRemaining: 12,
    };

  const framePriceTl = selectedFrame === 'none' ? 0 : selectedFrame === 'oak' ? 2400 : 1900;
  const totalPriceTl = currentPrintOption.priceTl + framePriceTl;

  const artworkReviews = reviews.filter((r) => r.artworkId === artwork.id);

  const similarArtworks = allArtworks
    .filter((a) => a.id !== artwork.id && a.category === artwork.category)
    .slice(0, 3);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `NEVAART Ansiklopedisi Şaheseri: "${artwork.title}" - Sanatçı: ${artwork.artist} (${artwork.year}). Teknik: ${artwork.mediumTr}. Künyeyi inceleyin: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleChatCuratorWhatsapp = () => {
    const text = encodeURIComponent(
      `Sayın NevaArt Baş Küratörlüğü, "${artwork.title}" eseri hakkında edinim ve sergileme şartları konusunda danışmak istiyorum.`
    );
    window.open(`https://api.whatsapp.com/send?phone=902122849026&text=${text}`, '_blank');
  };

  const handleDownloadPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>NEVAART - ${artwork.accessionNumber} - ${artwork.title}</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; color: #1C1917; background: #FAF8F5; line-height: 1.6; }
              .header { border-bottom: 2px solid #1C1917; padding-bottom: 16px; margin-bottom: 24px; }
              .title { font-size: 32px; font-weight: bold; margin: 0; }
              .meta { font-family: monospace; font-size: 13px; color: #666; margin-top: 6px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
              .row { border-bottom: 1px solid #E8E2D9; padding: 8px 0; font-size: 13px; }
              .story { margin-top: 24px; font-size: 14px; }
              .palette { display: flex; gap: 10px; margin: 16px 0; }
              .color-box { width: 60px; height: 60px; border: 1px solid #ccc; text-align: center; font-size: 10px; font-family: monospace; padding-top: 65px; }
            </style>
          </head>
          <body onload="window.print()">
            <div class="header">
              <h1 class="title">NEVAART KÜRATÖRYEL ARŞİV KÜNYESİ</h1>
              <div class="meta">Envanter No: ${artwork.accessionNumber} · Sanatçı: ${artwork.artist} (${artwork.year})</div>
            </div>
            <h2>${artwork.title}</h2>
            <div class="grid">
              <div class="row"><strong>Teknik & Materyal:</strong> ${artwork.mediumTr}</div>
              <div class="row"><strong>Ebatlar:</strong> ${artwork.dimensions}</div>
              <div class="row"><strong>Çözünürlük Standardı:</strong> ${artwork.resolution}</div>
              <div class="row"><strong>Sergi Konumu:</strong> ${artwork.exhibitionLocation.venue} (${artwork.exhibitionLocation.city})</div>
            </div>
            <div class="story">
              <h3>Yaratım Hikayesi & Küratör Değerlendirmesi:</h3>
              <p>${artwork.storyTr}</p>
            </div>
            <div class="story">
              <h3>Teknik Parametreler & Teori:</h3>
              <p>${artwork.technicalDetailsTr}</p>
            </div>
            <h3>Yapay Zeka Gerçek Piksel Renk Paleti:</h3>
            <div class="palette">
              ${activePalette.map((c) => `
                <div class="color-box" style="background-color: ${c.hex};">${c.hex}<br>${c.percentage}%<br>${c.name}</div>
              `).join('')}
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
      setPdfGenerating(false);
    }, 600);
  };

  const handleOrderPrint = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 2500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddReview({
      artworkId: artwork.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      rating,
      comment: newComment.trim(),
    });

    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl rounded-xs">

        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#78350F] font-semibold">
              {artwork.accessionNumber}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs uppercase tracking-widest text-stone-600 font-medium">
              {artwork.artist}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={
                artwork.exhibitionLocation.city === 'Cleveland'
                  ? `https://www.clevelandart.org/art/${encodeURIComponent(artwork.accessionNumber)}`
                  : `https://www.metmuseum.org/art/collection/search?q=${encodeURIComponent(artwork.accessionNumber)}`
              }
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{currentLang === 'tr' ? 'Resmi Müze Kaynağı' : 'Official Museum Record'}</span>
            </a>
            <button
              onClick={handleShareWhatsapp}
              className="p-2 text-[#25D366] hover:bg-[#25D366]/10 rounded transition-colors cursor-pointer"
              title="WhatsApp ile Paylaş"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfGenerating}
              className="p-2 text-stone-700 hover:text-black hover:bg-stone-100 rounded transition-colors cursor-pointer"
              title="Küratör Künyesini İndir (PDF)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left 7 Columns: Real High-Res Visual & Pixel Color Extraction */}
            <div className="lg:col-span-7">
              {/* Image Frame with Zoom */}
              <div className="bg-white border border-[#E8E2D9] p-3 shadow-xs">
                <div
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`overflow-hidden bg-stone-100 cursor-zoom-in relative ${isZoomed
                    ? 'fixed inset-4 z-50 bg-black/95 p-4 flex items-center justify-center cursor-zoom-out'
                    : 'aspect-4/3'
                    }`}
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full transition-all duration-300 ${isZoomed ? 'object-contain max-h-[90vh]' : 'object-cover'
                      }`}
                  />
                  {!isZoomed && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 backdrop-blur-xs">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Tam Ekran Büyüt</span>
                    </div>
                  )}
                  {isZoomed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(false);
                      }}
                      className="absolute top-4 right-4 bg-white text-black p-2 rounded-full cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Sub-image technical ribbon */}
                <div className="mt-3 pt-3 border-t border-[#F5EFEB] flex items-center justify-between text-xs">
                  <span className="text-[#78716C] font-mono text-[11px]">
                    {artwork.dimensions} · {artwork.resolution}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono text-stone-600">
                      Geniş Renk Gamı (sRGB / DCI-P3)
                    </span>
                  </div>
                </div>
              </div>

              {/* COLOR PALETTE & HARMONY ANALYSIS */}
              <div className="mt-6 bg-white border border-[#E8E2D9] p-5 shadow-xs rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                    {currentLang === 'tr' ? 'Renk Paleti ve Armoni Analizi' : 'Color Palette & Harmony Analysis'}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                    {isAnalyzingColors ? 'Pikseller Taranıyor...' : '✓ Piksel Analizi'}
                  </span>
                </div>

                {/* Dynamic Harmony Diagnosis */}
                <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded mb-4 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-stone-900 font-serif text-sm">
                      {colorAnalysis?.harmonyType || artwork.harmonyMoodTr}
                    </strong>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                      Işık Skalası: %{colorAnalysis?.averageLuminance ? Math.round((colorAnalysis.averageLuminance / 255) * 100) : 58}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {colorAnalysis?.moodDescription || artwork.harmonyMoodTr}
                  </p>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-5 gap-3">
                  {activePalette.map((color, i) => {
                    const isSelected = selectedColorDetail?.hex === color.hex;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColorDetail(color);
                          handleCopyHex(color.hex);
                        }}
                        className={`text-center p-2 rounded transition-all border cursor-pointer ${isSelected
                          ? 'bg-stone-50 border-[#78350F] shadow-sm ring-1 ring-[#78350F]'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                          }`}
                        title="Detay ve kopyalamak için tıkla"
                      >
                        <div
                          className="h-12 w-full rounded border border-black/10 shadow-inner mb-1.5"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="block text-[11px] font-mono font-semibold text-stone-800">
                          {copiedHex === color.hex ? (
                            <span className="text-emerald-700 flex items-center justify-center gap-0.5">
                              <Check className="w-3 h-3" /> Kopyalandı
                            </span>
                          ) : (
                            color.hex
                          )}
                        </span>
                        <span className="block text-[10px] text-stone-500 font-mono">
                          %{color.percentage} Dağılım
                        </span>
                        <span className="block text-[9px] text-stone-600 truncate mt-0.5">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Swatch Inspector Detail */}
                {selectedColorDetail && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-stone-600">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: selectedColorDetail.hex }}
                      />
                      <span><strong>{selectedColorDetail.name}:</strong> {selectedColorDetail.hex}</span>
                    </div>
                    <div>RGB: {selectedColorDetail.rgb ? selectedColorDetail.rgb.join(', ') : 'Hesaplandı'}</div>
                    <div className="text-[11px] text-stone-400">Piksel Frekansı: %{selectedColorDetail.percentage}</div>
                  </div>
                )}
              </div>

              {/* CURATORIAL AUDIO GUIDE PLAYER */}
              {artwork.audioGuide && (
                <div className="mt-6 bg-[#F4EFEB] border border-[#E8E2D9] p-4 rounded-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#78350F] block">
                          {currentLang === 'tr' ? 'Gerçek Sesli Eser Anlatımı (Canlı Ses)' : 'Live Spoken Artwork Audio Guide'}
                        </span>
                        <strong className="text-xs text-stone-900">
                          {artwork.title} · {artwork.artist}
                        </strong>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500">
                      {isPlayingAudio
                        ? (currentLang === 'tr' ? '🔊 Sesli Okunuyor...' : '🔊 Speaking...')
                        : (currentLang === 'tr' ? '▶ Dinlemek İçin Tıklayın' : '▶ Click to Listen')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-300 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-[#78350F] transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-600 mt-2 font-serif italic">
                    &ldquo;{currentLang === 'tr' ? artwork.storyTr.slice(0, 140) : artwork.storyEn.slice(0, 140)}...&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Historical Provenance, Technical Details & Physical Edition */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Title & Artist Block */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#78350F] font-semibold">
                    {artwork.accessionNumber} · {artwork.category}
                  </span>
                  <h1 className="text-3xl font-serif text-[#1C1917] mt-1 font-medium leading-snug">
                    {artwork.title}
                  </h1>
                  <p className="text-stone-700 text-sm font-semibold mt-1">
                    {artwork.artist} ({artwork.year})
                  </p>
                </div>

                {/* Metadata List */}
                <dl className="mt-5 border-t border-b border-[#E8E2D9] divide-y divide-[#F5EFEB] text-xs">
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-stone-500 font-sans">Teknik & Malzeme</dt>
                    <dd className="text-stone-900 font-medium text-right">{artwork.mediumTr}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-stone-500 font-sans">Ebatlar</dt>
                    <dd className="text-stone-900 font-medium">{artwork.dimensions}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-stone-500 font-sans">Çözünürlük Standardı</dt>
                    <dd className="text-stone-900 font-mono text-[11px]">{artwork.resolution}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-stone-500 font-sans">Sergilendiği Galeri</dt>
                    <dd className="text-stone-900 font-medium">{artwork.exhibitionLocation.venue} ({artwork.exhibitionLocation.city})</dd>
                  </div>
                </dl>

                {/* Deep Creation Story & Curatorial Review */}
                <div className="mt-6">
                  <h4 className="font-serif text-lg text-stone-900 mb-2 font-medium">
                    Yaratım Hikayesi ve Küratör İncelemesi
                  </h4>
                  <div className="text-stone-700 text-xs leading-relaxed space-y-3 font-sans">
                    <p className="first-letter:text-3xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-2">
                      {artwork.storyTr}
                    </p>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-5 pt-4 border-t border-[#E8E2D9]">
                  <h4 className="font-serif text-base text-stone-900 mb-1.5 font-medium">
                    Teknik Detaylar ve Teori
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans">
                    {artwork.technicalDetailsTr}
                  </p>
                </div>

                {/* Artist Bio */}
                <div className="mt-5 pt-4 border-t border-[#E8E2D9]">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] mb-1">
                    Sanatçı Biyografisi
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans">
                    {artwork.artistBioTr}
                  </p>
                </div>

                {/* OFFICIAL MUSEUM ARCHIVE & ACADEMIC RESEARCH LINKS (Replacing fake artist contact) */}
                <div className="mt-6 p-4 bg-white border border-[#E8E2D9] rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="w-4 h-4 text-amber-800" />
                      <span className="text-xs uppercase font-mono font-bold text-stone-900">
                        {currentLang === 'tr' ? 'Resmi Müze Arşivi & Daha Fazla Bilgi' : 'Official Museum Archive & Research'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      CC0 Open Access
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                    {currentLang === 'tr'
                      ? `Bu eser resmi müze açık erişim koleksiyonuna aittir. Sergi geçmişini, yüksek çözünürlüklü envanter kaydını ve sanat tarihi kaynaklarını aşağıdan inceleyebilirsiniz.`
                      : `This masterpiece belongs to an official public-domain museum archive. Explore its provenance, high-resolution record, and art history references below.`}
                  </p>

                  <div className="pt-3 border-t border-stone-100 space-y-3">
                    <a
                      href={
                        artwork.exhibitionLocation.city === 'Cleveland'
                          ? `https://www.clevelandart.org/art/${encodeURIComponent(artwork.accessionNumber)}`
                          : `https://www.metmuseum.org/art/collection/search?q=${encodeURIComponent(artwork.accessionNumber)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 bg-black hover:bg-stone-800 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{currentLang === 'tr' ? 'Resmi Müze Sayfasında İncele' : 'View Official Museum Record'}</span>
                    </a>

                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-stone-600 font-medium">
                      <a
                        href={`https://${currentLang === 'tr' ? 'tr' : 'en'}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(`${artwork.artist} ${artwork.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-black hover:underline transition-colors"
                      >
                        {currentLang === 'tr' ? 'Wikipedia ↗' : 'Wikipedia ↗'}
                      </a>
                      <span className="text-stone-300">·</span>
                      <a
                        href={`https://artsandculture.google.com/search?q=${encodeURIComponent(`${artwork.artist} ${artwork.title}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-black hover:underline transition-colors"
                      >
                        Google Arts &amp; Culture ↗
                      </a>
                      <span className="text-stone-300">·</span>
                      <button
                        onClick={() => setOrderModalOpen(true)}
                        className="hover:text-black hover:underline transition-colors cursor-pointer"
                      >
                        {currentLang === 'tr' ? 'Künyeyi E-Posta Gönder' : 'Email Provenance'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Artworks */}
          <section className="mt-12 pt-8 border-t border-[#E8E2D9]">
            <div className="mb-6">
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                {currentLang === 'tr' ? 'Benzer Başyapıtlar' : 'Similar Masterpieces'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarArtworks.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => onSelectArtwork(sim)}
                  className="group bg-white border border-[#E8E2D9] p-3 hover:border-stone-400 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="aspect-4/3 w-full bg-stone-100 overflow-hidden mb-2.5">
                    <img
                      src={sim.imageUrl}
                      alt={sim.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 block mb-0.5">
                    {sim.accessionNumber}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-stone-900 group-hover:text-[#78350F] truncate">
                    {sim.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">{sim.artist}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Real Curator Reviews & Appraisals */}
          <section className="mt-12 pt-8 border-t border-[#E8E2D9]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-stone-700" />
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  {t.curatorReviews} ({artworkReviews.length})
                </h3>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {artworkReviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic">Bu eser için henüz küratör incelemesi eklenmedi.</p>
              ) : (
                artworkReviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-[#E8E2D9] p-4 rounded-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-stone-900">{rev.userName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF8F5] border border-stone-200 text-stone-600 uppercase">
                          {rev.userRole}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-stone-400 font-mono block mt-2">{rev.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Submit New Appraisal Form */}
            <form onSubmit={handleSubmitReview} className="bg-white border border-[#E8E2D9] p-5 rounded-xs">
              <h4 className="text-xs uppercase font-mono tracking-wider text-stone-700 font-semibold mb-3">
                {t.addReview} ({currentUser.name})
              </h4>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-stone-500">Puan:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Eser hakkında küratöryel değerlendirmeniz, teknik gözlemleriniz..."
                rows={3}
                required
                className="w-full p-3 border border-stone-200 text-xs text-stone-900 rounded outline-none focus:border-stone-900"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.submitReview}</span>
                </button>
              </div>
            </form>
          </section>

        </div>

      </div>

      {/* Direct Artist Inquiry & Acquisition Form Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-lg p-6 rounded-2xl shadow-2xl relative">
            <button
              onClick={() => {
                setOrderModalOpen(false);
                setOrderSuccess(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-amber-800" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {currentLang === 'tr' ? 'Eser Sahibiyle İletişim & Teklif' : 'Contact Artist for Inquiries'}
              </h3>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-semibold text-stone-900">
                  {currentLang === 'tr' ? 'Mesajınız Sanatçıya İletildi!' : 'Your Message Has Been Sent!'}
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  {currentLang === 'tr'
                    ? `"${artwork.title}" eseriyle ilgili talebiniz ve iletişim bilgileriniz ${artwork.artist} adlı sanatçıya iletildi. Sanatçı e-posta adresinizden sizinle doğrudan iletişime geçecektir.`
                    : `Your inquiry regarding "${artwork.title}" was forwarded to ${artwork.artist}. The creator will reply directly to your email.`}
                </p>
                <div className="p-3 bg-white border border-stone-200 rounded-lg font-mono text-xs text-stone-500">
                  Referans No: INQ-2026-{artwork.accessionNumber.replace('ACC.', '')}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderModalOpen(false);
                    setOrderSuccess(false);
                  }}
                  className="mt-2 px-5 py-2 bg-black text-white text-xs font-semibold rounded-full hover:bg-stone-800 cursor-pointer"
                >
                  {currentLang === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderPrint} className="space-y-4 text-xs">
                <div className="p-3 bg-white border border-[#E8E2D9] rounded-xl">
                  <div className="flex justify-between font-serif text-sm font-semibold text-stone-900 mb-1">
                    <span>{artwork.title}</span>
                    <span className="text-amber-900">{artwork.artist}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    {artwork.category.toUpperCase()} · {artwork.year} · {artwork.mediumTr}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {currentLang === 'tr' ? 'Talep / İletişim Konusu:' : 'Inquiry Type:'}
                  </label>
                  <select
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg outline-none text-xs"
                    defaultValue="acquisition"
                  >
                    <option value="acquisition">
                      {currentLang === 'tr' ? 'Orijinal Eseri Edinme / Satın Alma Teklifi' : 'Original Artwork Acquisition / Purchase Offer'}
                    </option>
                    <option value="exhibition">
                      {currentLang === 'tr' ? 'Sergi veya Galeriye Dahil Etme Teklifi' : 'Gallery Exhibition Invitation'}
                    </option>
                    <option value="print">
                      {currentLang === 'tr' ? 'Sanatçı İmzalı Özel Baskı Talebi' : 'Signed Archival Print Request'}
                    </option>
                    <option value="collaboration">
                      {currentLang === 'tr' ? 'Özel Proje / Komisyon Çizim Teklifi' : 'Custom Commission / Collaboration'}
                    </option>
                    <option value="question">
                      {currentLang === 'tr' ? 'Sanatçıya Soru & Tebrik' : 'General Question to Artist'}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      {currentLang === 'tr' ? 'Adınız Soyadınız:' : 'Your Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={currentUser.name}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      {currentLang === 'tr' ? 'E-Posta Adresiniz:' : 'Your Email:'}
                    </label>
                    <input
                      type="email"
                      required
                      defaultValue={currentUser.email}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {currentLang === 'tr' ? 'Sanatçıya İleteceğiniz Mesajınız & Teklifiniz:' : 'Your Message or Proposal:'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={
                      currentLang === 'tr'
                        ? `Merhaba ${artwork.artist}, eserinizi NevaArt galerisinde inceledim ve hikayesinden çok etkilendim. Orijinali veya sergileme şartları hakkında bilgi almak istiyorum...`
                        : `Hello ${artwork.artist}, I discovered your work on NevaArt and would like to discuss...`
                    }
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg outline-none text-xs"
                  />
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                  {currentLang === 'tr'
                    ? '💡 NevaArt açık bir sergileme platformudur. Eser edinimleri ve teklifler doğrudan sanatçı ve alıcı arasında gerçekleşir; komisyon kesilmez.'
                    : '💡 NevaArt is an open exhibition platform. Inquiries and acquisitions take place directly between the creator and the collector.'}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    {currentLang === 'tr' ? 'İptal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-black hover:bg-stone-800 text-white font-medium rounded-full transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{currentLang === 'tr' ? 'Mesajı Sanatçıya İlet' : 'Send Message to Artist'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
