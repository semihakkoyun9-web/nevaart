import React, { useState } from 'react';
import { translations } from '../data/i18n';
import { NevaArtLogo } from './NevaArtLogo';
import { Mail, CheckCircle2, Landmark, Download } from 'lucide-react';

interface FooterProps {
  currentLang: 'tr' | 'en';
  onOpenAnalytics: () => void;
  onOpenMap: () => void;
  onOpenUpload?: () => void;
  onOpenPhpCode?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenAnalytics,
  onOpenMap,
  onOpenUpload,
  onOpenPhpCode,
}) => {
  const t = translations[currentLang];
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="footer-contact" className="bg-[#111113] text-stone-300 pt-16 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Subscription Strip */}
        <div className="pb-14 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-mono font-semibold block mb-1">
              {currentLang === 'tr' ? 'SERGİ VE SANATÇI DUYURULARI' : 'GALLERY & ARTIST UPDATES'}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight">
              {currentLang === 'tr' ? 'YENİ ESERLERDEN VE SERGİLERDEN HABERDAR OLUN' : 'STAY UPDATED ON NEW EXHIBITIONS & EMERGING TALENTS'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {currentLang === 'tr'
                ? 'Bağımsız sanatçıların yeni yüklemeleri, derin hikaye analizleri ve özel küratöryel seçkiler.'
                : 'Discover newly uploaded works by community artists, in-depth provenance stories, and curated selections.'}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={currentLang === 'tr' ? 'E-posta adresinizi girin...' : 'Enter your email address...'}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-700 focus:border-white rounded-full text-xs text-white placeholder:text-stone-500 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white hover:bg-stone-200 text-black text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              {subscribed ? (
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentLang === 'tr' ? 'Kayıt Yapıldı' : 'Subscribed'}
                </span>
              ) : (
                currentLang === 'tr' ? 'KAYDOL' : 'SUBSCRIBE'
              )}
            </button>
          </form>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-stone-800 text-xs">

          {/* Column 1: Brand & Manifesto */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <NevaArtLogo theme="dark" size="sm" />
              <span className="font-serif text-2xl font-semibold tracking-[0.1em] text-white uppercase leading-none">
                NevaArt
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-stone-500 font-semibold block mb-4">
              {currentLang === 'tr' ? 'Açık Galeri & Sanat Ansiklopedisi' : 'Open Gallery & Art Encyclopedia'}
            </span>
            <p className="text-stone-400 leading-relaxed text-xs">
              {currentLang === 'tr'
                ? 'İnsanların kendi çizim ve fotoğraflarını özgürce yayınladığı, ölümsüz başyapıtların arkasındaki hikayelerin incelendiği ve sanatseverlerin doğrudan sanatçılarla iletişim kurduğu açık galeri.'
                : 'An open gallery platform where creators publish original art, visitors read the stories behind historic masterpieces, and enthusiasts connect directly with the artists.'}
            </p>
          </div>

          {/* Column 2: Gallery Navigation */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold mb-4">
              {currentLang === 'tr' ? 'GALERİ & KEŞİF' : 'GALLERY & EXPLORE'}
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  {currentLang === 'tr' ? 'Panoramik Galeri' : 'Panoramic Gallery'}
                </a>
              </li>
              <li>
                <a href="#curated-dark-section" className="hover:text-white transition-colors">
                  {currentLang === 'tr' ? 'Eser Hikayeleri' : 'Artwork Stories'}
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  {currentLang === 'tr' ? 'Tüm Eserler Kataloğu' : 'Complete Art Catalog'}
                </a>
              </li>
              <li>
                <button onClick={onOpenUpload} className="hover:text-white transition-colors cursor-pointer text-amber-300 font-medium">
                  {currentLang === 'tr' ? '+ Kendi Eserini Yayınla' : '+ Publish Your Art'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Curation & Exhibitions */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold mb-4">
              {currentLang === 'tr' ? 'KÜRATÖRLÜK & SERGİ' : 'CURATION & EXHIBITIONS'}
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button onClick={onOpenAnalytics} className="hover:text-white transition-colors cursor-pointer">
                  {currentLang === 'tr' ? 'Renk ve Kategori Analitiği' : 'Color & Curation Analytics'}
                </button>
              </li>
              <li>
                <button onClick={onOpenMap} className="hover:text-white transition-colors cursor-pointer">
                  {currentLang === 'tr' ? 'Sergi Salonları & Harita' : 'Exhibitions & Map'}
                </button>
              </li>
              <li>
                <div className="flex items-center gap-2 pt-1">
                  <a href="http://localhost/nevaart/api.php?action=export_json" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors font-mono text-[11px] underline">
                    API (JSON)
                  </a>
                  <span className="text-stone-600">/</span>
                  <a href="http://localhost/nevaart/api.php?action=export_xml" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors font-mono text-[11px] underline">
                    API (XML)
                  </a>
                </div>
              </li>
              <li>
                <a href="http://localhost/nevaart/pdf_kunye.php?report=catalog" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors font-mono text-[11px] underline flex items-center gap-1.5 pt-1">
                  <Download className="w-3 h-3 text-amber-500" />
                  <span>{currentLang === 'tr' ? 'Koleksiyon Envanter Raporu (PDF)' : 'Collection Catalog (PDF)'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Inquiries */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold mb-4">
              {currentLang === 'tr' ? 'İLETİŞİM & EDİNİM' : 'CONTACT & INQUIRIES'}
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <p>Valikonağı Caddesi No: 48, Nişantaşı, İstanbul</p>
              <p className="font-mono text-stone-300">curator@nevaart.org</p>
              <p className="font-mono text-stone-300">+90 (212) 284 90 26</p>
              <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                {currentLang === 'tr'
                  ? 'Beğendiğiniz eserlerin orijinali veya sergileme hakları için eser detayındaki iletişim butonunu kullanabilirsiniz.'
                  : 'To inquire about original artworks or exhibition rights, use the contact button on the artwork detail modal.'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Clean Gallery Copyright & Cultural Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 NevaArt — {currentLang === 'tr' ? 'Açık Sanat Ansiklopedisi ve Küratörlük Galerisi. Tüm hakları saklıdır.' : 'Open Art Encyclopedia & Curation Gallery. All rights reserved.'}
          </div>

          <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentLang === 'tr' ? 'Sanatçılar ve Sanatseverler İçin Bağımsız Sergi Alanı' : 'Independent Exhibition Space for Creators'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
