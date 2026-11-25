import React, { useState, useRef } from 'react';
import { Artwork, ArtworkCategory, ColorSwatch, User } from '../types';
import { translations } from '../data/i18n';
import { extractColorsFromImage } from '../utils/colorExtractor';
import { X, Upload, Sparkles, Check, Image as ImageIcon, Sliders, ShieldCheck } from 'lucide-react';

interface UploadModalProps {
  categories: ArtworkCategory[];
  currentUser: User;
  currentLang: 'tr' | 'en';
  onClose: () => void;
  onArtworkUploaded: (newArtwork: Artwork) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  categories,
  currentUser,
  currentLang,
  onClose,
  onArtworkUploaded,
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(currentUser.name || 'Henri Cartier-Bresson');
  const [category, setCategory] = useState<Artwork['category']>('street');
  const [year, setYear] = useState<number>(2025);
  const [medium, setMedium] = useState('35mm Leica M, Baryta Gümüş Jelatin Baskı');
  const [story, setStory] = useState('');
  const [technical, setTechnical] = useState('');
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPalette, setExtractedPalette] = useState<ColorSwatch[]>([]);
  const [detectedDimensions, setDetectedDimensions] = useState('60 × 90 cm');
  const [harmonyDiagnosed, setHarmonyDiagnosed] = useState('Görsel piksellerinden çıkarılan tonal harmoni.');

  // Process image with HTML5 Canvas (simulating PHP GD watermark and true pixel color quantization)
  const processImageCanvas = (imageSrc: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim) {
        height = Math.round((height / width) * maxDim);
        width = maxDim;
      }
      canvas.width = width;
      canvas.height = height;

      // Draw base image
      ctx.drawImage(img, 0, 0, width, height);

      // Apply PHP GD-style Watermark Ribbon
      const watermarkText = 'NEVAART · CURATED ARCHIVE · 2026';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      const textMetrics = ctx.measureText(watermarkText);
      const textWidth = textMetrics.width;
      const posX = width - textWidth - 30;
      const posY = height - 24;

      ctx.fillStyle = 'rgba(28, 25, 23, 0.70)';
      ctx.fillRect(posX - 10, posY - 18, textWidth + 20, 26);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(watermarkText, posX, posY);

      const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setWatermarkedImage(watermarkedDataUrl);
      setDetectedDimensions(`${Math.round(width * 0.08)} × ${Math.round(height * 0.08)} cm (${width} × ${height} px)`);

      // Run genuine pixel color extractor
      extractColorsFromImage(img).then((res) => {
        setExtractedPalette(res.palette);
        setHarmonyDiagnosed(res.moodDescription);
        setIsProcessing(false);
      });
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPreviewImage(url);
        processImageCanvas(url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Real world art sample pre-fill
  const handleLoadSample = (sampleType: 'cartier' | 'mucha' | 'beeple') => {
    const samples = {
      cartier: {
        title: 'Behind the Gare Saint-Lazare (Derrière la Gare Saint-Lazare)',
        artist: 'Henri Cartier-Bresson',
        category: 'street' as const,
        year: 1932,
        medium: 'Leica I (Model A), 50mm Elmar f/3.5, 35mm Gümüş Jelatin Baskı',
        story: 'Su birikintisinin üzerinden atlayan bir adamın havada asılı kaldığı "Karar Anı" (The Decisive Moment). Arkadaki sirk afişindeki dansçı silüeti ile figürün mükemmel geometrik rezonansı.',
        technical: 'Leica I 50mm f/3.5 lens, 1/50 sn enstantane, f/5.6 diyafram, doğal difüze gün ışığı.',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80'
      },
      mucha: {
        title: 'The Seasons: Autumn (Mevsimler: Sonbahar)',
        artist: 'Alphonse Mucha',
        category: 'illustration' as const,
        year: 1896,
        medium: 'Art Nouveau Taşbaskı (Litoloji), Sıcak Altın & Toprak Mineral Mürekkepleri',
        story: 'Sonbahar hasadının bereketini ve doğanın döngüsel zarafetini temsil eden Art Nouveau allegorik kompozisyonu. Organik saç kıvrımları ve asma yaprakları.',
        technical: 'Champenois matbaasında 8 ayrı taş bloktan katmanlı litografik renk basımı.',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
      },
      beeple: {
        title: 'Everydays: The First 5000 Days (Monument 01)',
        artist: 'Mike Winkelmann (Beeple)',
        category: 'digital' as const,
        year: 2021,
        medium: 'Cinema 4D, Octane Render, 3D Voxel Heykel & Akrilik Pleksi Arşiv Baskısı',
        story: '13 yılı aşkın süre boyunca kesintisiz her gün üretilen dijital sanat eserlerinin distopik ve hicivsel bir sentezi.',
        technical: 'Nvidia RTX GPU kümesi, Cinema 4D fiziksel kamera, uncompressed TIFF.',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      }
    };

    const s = samples[sampleType];
    setTitle(s.title);
    setArtist(s.artist);
    setCategory(s.category);
    setYear(s.year);
    setMedium(s.medium);
    setStory(s.story);
    setTechnical(s.technical);
    setPreviewImage(s.url);
    processImageCanvas(s.url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !watermarkedImage) {
      alert('Lütfen tüm zorunlu alanları ve eserin görselini ekleyiniz.');
      return;
    }

    const accessionNumber = `ACC.2026.0${Math.floor(100 + Math.random() * 899)}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 99);

    const newArtwork: Artwork = {
      id: Date.now(),
      slug,
      accessionNumber,
      title,
      artist,
      artistBioTr: `${artist}, görsel sanatlar tarihine geçmiş ve NEVAART küresel kürasyon arşivinde yer alan usta bir yaratıcıdır.`,
      artistBioEn: `${artist} is a recognized master whose works are preserved in the NEVAART global curation encyclopedia.`,
      category,
      year,
      mediumTr: medium,
      mediumEn: medium,
      dimensions: detectedDimensions,
      resolution: 'Archival Fine Art Scan (300 DPI)',
      storyTr: story,
      storyEn: story,
      technicalDetailsTr: technical,
      technicalDetailsEn: technical,
      imageUrl: watermarkedImage,
      colorPalette: extractedPalette.length > 0 ? extractedPalette : [
        { hex: '#1C1917', percentage: 40, name: 'Derin Kömür Siyahı' },
        { hex: '#8C8A85', percentage: 30, name: 'Doğal Gri' },
        { hex: '#FAF8F5', percentage: 30, name: 'Sıcak Alabaster' }
      ],
      harmonyMoodTr: harmonyDiagnosed,
      harmonyMoodEn: 'Algorithmic tonal equilibrium verified via pixel analysis.',
      views: 12,
      likes: 4,
      isCuratorPick: currentUser.role === 'curator',
      exhibitionLocation: {
        city: 'İstanbul',
        venue: 'NEVAART Kürasyon ve Arşiv Pavyonu',
        lat: 41.0256,
        lng: 28.9839
      },
      tags: [category, 'yeni eser', 'orijinal kürasyon'],
      printOptions: [
        { size: '50 × 70 cm Arşiv Baskısı', paperType: 'Hahnemühle Photo Rag 308 gsm', priceTl: 5900, priceEur: 160, editionTotal: 50, editionRemaining: 15 },
        { size: '70 × 100 cm Master Format', paperType: 'Canson Infinity Arches 310 gsm', priceTl: 9800, priceEur: 265, editionTotal: 25, editionRemaining: 6 }
      ]
    };

    onArtworkUploaded(newArtwork);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl rounded-xs">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D9] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#78350F]" />
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Yeni Bir Eseri Ansiklopediye Dahil Et
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Canvas for Image Processing */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="p-6 md:p-8">
          {/* Quick Real Masterpiece Presets */}
          <div className="mb-6 p-3 bg-stone-100/80 border border-stone-200 rounded text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="text-stone-700 font-semibold">⚡ Hızlı Test İçin Gerçek Başyapıt Yükle:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('cartier')}
                className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
              >
                Cartier-Bresson (Sokak)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('mucha')}
                className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
              >
                Alphonse Mucha (İllüstrasyon)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('beeple')}
                className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded hover:bg-stone-50 cursor-pointer font-medium"
              >
                Beeple (Dijital)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Image Upload Drag & Drop Box */}
            <div className="border-2 border-dashed border-[#D6CEBE] p-6 text-center bg-white rounded hover:border-stone-500 transition-colors">
              {watermarkedImage ? (
                <div>
                  <div className="max-h-64 overflow-hidden rounded mb-3 mx-auto max-w-md border border-stone-200 relative">
                    <img
                      src={watermarkedImage}
                      alt="Watermarked preview"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-800 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                      ✓ PHP GD Filigranı & Boyutlandırma Tamamlandı
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 font-mono">
                    Ölçü: {detectedDimensions}
                  </p>
                  
                  {/* Extracted Palette on the fly */}
                  {extractedPalette.length > 0 && (
                    <div className="mt-3 inline-flex flex-col items-center gap-1.5 p-2 bg-stone-50 border border-stone-200 rounded">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#78350F]" />
                        <span className="text-[11px] text-stone-800 font-semibold">Piksellerden Ayrıştırılan Gerçek Renkler:</span>
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {extractedPalette.map((c, i) => (
                          <div key={i} className="text-center">
                            <span
                              style={{ backgroundColor: c.hex }}
                              className="w-5 h-5 rounded-full border border-black/20 inline-block"
                            />
                            <span className="block text-[9px] font-mono text-stone-600">{c.hex}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-500 font-serif italic">{harmonyDiagnosed}</span>
                    </div>
                  )}

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#78350F] hover:underline font-semibold cursor-pointer"
                    >
                      Farklı bir görsel dosyası seç →
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer py-4"
                >
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-800">
                    Cihazınızdan Eser Görseli Seçin veya Sürükleyin
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1 font-mono">
                    PNG, JPG, WEBP (Otomatik filigran basılacak ve renk spektrumu piksellerden taranacaktır)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Eser Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Behind the Gare Saint-Lazare"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Sanatçı Adı *
                </label>
                <input
                  type="text"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Sanatçı adı"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Kategori *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Artwork['category'])}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {currentLang === 'tr' ? c.nameTr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Üretim Yılı
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                Teknik & Malzeme *
              </label>
              <input
                type="text"
                required
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="Örn: 35mm Leica M3, Gümüş Jelatin Baskı"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                Eserin Yaratım Hikayesi & Konsepti *
              </label>
              <textarea
                required
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Eserin arkasındaki estetik motivasyon, tarihi bağlam ve kavramsal boyutu..."
                className="w-full p-3 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                Teknik Parametreler (Lens, Işık, Yazılım vb.)
              </label>
              <input
                type="text"
                value={technical}
                onChange={(e) => setTechnical(e.target.value)}
                placeholder="Örn: 50mm f/3.5 lens, 1/50 sn, Kodak Tri-X 400"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8E2D9] focus:border-stone-900 rounded outline-none"
              />
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                {t.close}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Görsel İşleniyor...' : 'Eseri Arşive Kaydet'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
