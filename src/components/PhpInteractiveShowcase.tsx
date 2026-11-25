import React, { useState } from 'react';
import { 
  Calculator, Ticket, Truck, Award, FileCode, CheckCircle2, 
  Terminal, Server, ArrowRight, Play, ExternalLink, Sparkles 
} from 'lucide-react';

interface PhpInteractiveShowcaseProps {
  currentLang: 'tr' | 'en';
  onOpenCodeModal: () => void;
}

export const PhpInteractiveShowcase: React.FC<PhpInteractiveShowcaseProps> = ({
  currentLang,
  onOpenCodeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'hafta1' | 'hafta2' | 'hafta3'>('hafta2');

  // 2. Hafta Sipariş Hesaplama State
  const [siparisUrun, setSiparisUrun] = useState('NevaArt Profesyonel Yağlı Boya & Tuval Seti');
  const [birimFiyat, setBirimFiyat] = useState(250);
  const [adet, setAdet] = useState(3);
  const kdvOrani = 0.20;
  const araToplam = birimFiyat * adet;
  const kdv = araToplam * kdvOrani;
  const genelToplam = araToplam + kdv;

  // 3. Hafta Bilet Hesaplama State
  const [biletYas, setBiletYas] = useState(20);
  const [biletOgrenci, setBiletOgrenci] = useState(true);
  const temelBiletFiyati = 200;
  let hesaplananBilet = temelBiletFiyati;
  let biletTarife = 'Tam Ücret (200 TL)';

  if (biletYas <= 6) {
    hesaplananBilet = 0;
    biletTarife = '0–6 Yaş Çocuk (Ücretsiz)';
  } else if (biletYas <= 17) {
    hesaplananBilet = temelBiletFiyati * 0.50;
    biletTarife = '7–17 Yaş Genç Sanatçı (%50 İndirim)';
  } else if (biletOgrenci) {
    hesaplananBilet = temelBiletFiyati * 0.75;
    biletTarife = 'Üniversite Öğrencisi (%25 İndirim)';
  } else {
    hesaplananBilet = temelBiletFiyati;
    biletTarife = 'Diğer Yetişkin (Tam Ücret)';
  }

  // 3. Hafta Kargo Hesaplama State
  const [kargoSepet, setKargoSepet] = useState(620);
  const [kargoUye, setKargoUye] = useState(true);
  let hesaplananKargo = 50;
  let kargoAciklama = 'Standart Kargo (50 TL)';

  if (kargoSepet >= 750) {
    hesaplananKargo = 0;
    kargoAciklama = '750 TL ve Üzeri (Ücretsiz Kargo)';
  } else if (kargoUye && kargoSepet >= 500) {
    hesaplananKargo = 20;
    kargoAciklama = 'Kulüp Üyesi + 500 TL Üzeri İndirimli (20 TL)';
  } else {
    hesaplananKargo = 50;
    kargoAciklama = 'Standart Teslimat (50 TL)';
  }

  // 3. Hafta Harf Notu & Jüri Puanı State
  const [juriVize, setJuriVize] = useState(75);
  const [juriFinal, setJuriFinal] = useState(85);
  let juriHata = false;
  let juriOrtalama = 0;
  let juriHarf = 'FF';
  let juriDurum = 'Kaldı';

  if (juriVize < 0 || juriVize > 100 || juriFinal < 0 || juriFinal > 100) {
    juriHata = true;
  } else {
    juriOrtalama = Math.round((juriVize * 0.4 + juriFinal * 0.6) * 10) / 10;
    if (juriOrtalama >= 90) {
      juriHarf = 'AA';
      juriDurum = 'Mükemmel (Küratör Onaylı Başyapıt)';
    } else if (juriOrtalama >= 80) {
      juriHarf = 'BA';
      juriDurum = 'Çok İyi';
    } else if (juriOrtalama >= 70) {
      juriHarf = 'BB';
      juriDurum = 'İyi (Sergilemeye Uygun)';
    } else if (juriOrtalama >= 65) {
      juriHarf = 'CB';
      juriDurum = 'Orta Üstü';
    } else if (juriOrtalama >= 60) {
      juriHarf = 'CC';
      juriDurum = 'Geçer';
    } else if (juriOrtalama >= 55) {
      juriHarf = 'DC';
      juriDurum = 'Koşullu Geçer';
    } else if (juriOrtalama >= 50) {
      juriHarf = 'DD';
      juriDurum = 'Koşullu Geçer';
    } else {
      juriHarf = 'FF';
      juriDurum = 'Yetersiz (Kaldı)';
    }
  }

  return (
    <section id="php-curriculum" className="py-16 bg-[#FBF9F5] border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                İnternet Programcılığı II · Dr. Ahmet Akkaya
              </span>
              <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                Bandırma Onyedi Eylül Üni · Gönen MYO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {currentLang === 'tr' ? 'PHP & Sanat Hesaplama Motorları Altyapısı' : 'PHP & Art Computing Engine'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl font-sans">
              {currentLang === 'tr'
                ? 'Ders ve proje kriterlerinde yer alan tüm söz dizimi kuralları, veri tipleri, sipariş hesabı, sergi bilet fiyatı ve harf notu baremleri NevaArt sanat platformuna entegre edilmiştir.'
                : 'Project requirements including PHP data types, order computation, exhibition tickets and grading scale integrated directly into NevaArt.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCodeModal}
              className="h-10 px-4 bg-stone-900 hover:bg-black text-white text-xs font-mono font-semibold rounded-lg flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>{currentLang === 'tr' ? 'Kaynak PHP Kodlarını Aç' : 'View Source PHP Code'}</span>
            </button>
          </div>
        </div>

        {/* Module Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hafta1')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hafta1'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Web Mimarisi & Küratör Tanıtımı</span>
          </button>

          <button
            onClick={() => setActiveTab('hafta2')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hafta2'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sanat Siparişi & KDV Hesap Motoru (siparis.php)</span>
          </button>

          <button
            onClick={() => setActiveTab('hafta3')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hafta3'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-purple-400" />
            <span>Sergi Bileti, Kargo & Jüri Değerlendirmesi</span>
          </button>
        </div>

        {/* TAB 1: 1. HAFTA */}
        {activeTab === 'hafta1' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                1. Hafta Slayt 40–46 Kriterleri
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900 mt-3 mb-2">
                XAMPP Mimarisi & Küratör Tanıtım Kartı (hafta1_ogrencino)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                PHP kodu sunucuda (Apache Port 80) çalışır. Tarayıcı kaynak kodu görmez, yalnızca üretilen HTML çıktısını alır.
              </p>

              <div className="bg-stone-50 border-l-4 border-amber-600 p-4 rounded-r-lg font-mono text-xs text-stone-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
                  TARAYICI ÇIKTISI (BROWSER OUTPUT):
                </span>
                <p>Ad Soyad: Dr. Ahmet Akkaya</p>
                <p>Program: Bilgisayar Programcılığı</p>
                <p>Ünvan: NevaArt Galeri Baş Küratörü & Öğretim Elemanı</p>
                <p>Hafta: 1</p>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-500">
                <span>Dizin: C:\xampp\htdocs\internet2\</span>
                <span className="text-emerald-700 font-semibold">● Apache / PHP 8.2</span>
              </div>
            </div>

            <div className="bg-[#18181B] text-stone-200 p-6 rounded-xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-400">
                <span className="flex items-center gap-1.5 text-white">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  hafta1_ogrencino/index.php
                </span>
                <span className="text-[11px] text-stone-500">PHP 8.2</span>
              </div>
              <pre className="text-emerald-400 leading-relaxed">
{`<?php
// İnternet Programcılığı II - 1. Hafta Ödevi
// C:\\xampp\\htdocs\\internet2\\hafta1_ogrencino\\index.php

echo "Ad Soyad: Dr. Ahmet Akkaya<br>";
echo "Program: Bilgisayar Programcılığı<br>";
echo "Hafta: 1";
?>`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: 2. HAFTA SİPARİŞ HESABI */}
        {activeTab === 'hafta2' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Interactive Form */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  2. Hafta Ders Ürünü (Slayt 40–41)
                </span>
                <span className="text-xs font-mono text-stone-400">siparis.php</span>
              </div>

              <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                Sanat Malzemesi & Sipariş Tutarı Hesabı
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                Değerleri değiştirerek PHP aritmetik operatörlerinin ($araToplam, $kdv, $genelToplam) anlık hesaplamasını test edin.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Sanat Malzemesi / Ürün Adı ($urun)
                  </label>
                  <select
                    value={siparisUrun}
                    onChange={(e) => setSiparisUrun(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium outline-none focus:border-amber-600"
                  >
                    <option value="NevaArt Profesyonel Yağlı Boya & Tuval Seti">NevaArt Profesyonel Yağlı Boya & Tuval Seti</option>
                    <option value="USB Bellek (Sanat Arşivi)">USB Bellek (Sanat Arşivi - Slayt 40 Örneği)</option>
                    <option value="Kolinsky Samur Fırça Takımı">Kolinsky Samur Fırça Takımı</option>
                    <option value="Pamuklu Özel Tuval (50x70 cm)">Pamuklu Özel Tuval (50x70 cm)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Birim Fiyat ($birimFiyat) TL
                    </label>
                    <input
                      type="number"
                      value={birimFiyat}
                      onChange={(e) => setBirimFiyat(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Adet ($adet)
                    </label>
                    <input
                      type="number"
                      value={adet}
                      min="1"
                      max="100"
                      onChange={(e) => setAdet(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* Slayt 41 Birebir Tarayıcı Çıktısı */}
                <div className="bg-[#FAF8F5] border-l-4 border-amber-600 p-4 rounded-r-lg font-mono text-xs text-stone-900 mt-6 shadow-inner">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1.5">
                    TARAYICI ÇIKTISI (BROWSER OUTPUT - SLAYT 41):
                  </span>
                  <p>Ürün: {siparisUrun}</p>
                  <p>Ara toplam: {araToplam} TL</p>
                  <p>KDV: {kdv} TL</p>
                  <p className="font-bold text-amber-900 text-sm mt-1">
                    Toplam: {genelToplam} TL
                  </p>
                </div>
              </div>
            </div>

            {/* PHP Code View */}
            <div className="bg-[#18181B] text-stone-200 p-6 rounded-xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-400">
                <span className="flex items-center gap-1.5 text-white">
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  hafta2/siparis.php
                </span>
                <span className="text-[11px] text-amber-400/80">+= ve .= Operatörleri</span>
              </div>
              <pre className="text-stone-300 leading-relaxed overflow-x-auto">
{`<?php
// PDF 2. Hafta Slayt 40-41 Mantığı
$urun = "${siparisUrun}";
$birimFiyat = ${birimFiyat};
$adet = ${adet};
$kdvOrani = 0.20;

// Hesaplama
$araToplam = $birimFiyat * $adet;
$kdv = $araToplam * $kdvOrani;
$genelToplam = $araToplam + $kdv;

// Çıktı üretme (echo ve <br>)
echo "Ürün: $urun<br>";
echo "Ara toplam: $araToplam TL<br>";
echo "KDV: $kdv TL<br>";
echo "Toplam: $genelToplam TL";
?>`}
              </pre>
            </div>

          </div>
        )}

        {/* TAB 3: 3. HAFTA BİLET, KARGO VE HARF NOTU */}
        {activeTab === 'hafta3' && (
          <div className="space-y-8">
            
            {/* Top Grid: Bilet & Kargo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Bilet Hesaplama (bilet.php) */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200">
                    3. Hafta Ders Ürünü (Slayt 40–41)
                  </span>
                  <span className="text-xs font-mono text-stone-400">bilet.php</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  NevaArt Sergi Giriş Bileti Hesaplayıcı
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  0-6 yaş ücretsiz, 7-17 yaş %50, öğrenci %25, diğer tam ücret ($temelFiyat = 200 TL).
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Ziyaretçi Yaşı ($yas)
                    </label>
                    <input
                      type="number"
                      value={biletYas}
                      min="0"
                      max="110"
                      onChange={(e) => setBiletYas(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Öğrenci mi? ($ogrenci)
                    </label>
                    <select
                      value={biletOgrenci ? '1' : '0'}
                      onChange={(e) => setBiletOgrenci(e.target.value === '1')}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
                    >
                      <option value="1">Evet (Öğrenci)</option>
                      <option value="0">Hayır (Sivil)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border-l-4 border-purple-600 p-3.5 rounded-r-lg font-mono text-xs">
                  <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">
                    TARAYICI ÇIKTISI (SLAYT 41):
                  </span>
                  <p className="text-sm font-bold text-stone-900">Bilet: {hesaplananBilet} TL</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{biletTarife}</p>
                </div>
              </div>

              {/* Kargo Hesaplama (kargo.php) */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    3. Hafta Sınıf İçi Uygulama (Slayt 43)
                  </span>
                  <span className="text-xs font-mono text-stone-400">kargo.php</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  Eser Teslimat & Kargo Ücreti
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Sepet &ge; 750 TL ise ücretsiz, üye && sepet &ge; 500 TL ise 20 TL, diğer 50 TL.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Sepet Tutarı ($sepet) TL
                    </label>
                    <input
                      type="number"
                      value={kargoSepet}
                      step="10"
                      onChange={(e) => setKargoSepet(Number(e.target.value))}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                      Kulüp Üyesi mi? ($uye)
                    </label>
                    <select
                      value={kargoUye ? '1' : '0'}
                      onChange={(e) => setKargoUye(e.target.value === '1')}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
                    >
                      <option value="1">Üye (Evet)</option>
                      <option value="0">Üye Değil (Hayır)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border-l-4 border-amber-600 p-3.5 rounded-r-lg font-mono text-xs">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">
                    TARAYICI ÇIKTISI (SLAYT 43):
                  </span>
                  <p className="text-sm font-bold text-stone-900">Kargo: {hesaplananKargo} TL</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{kargoAciklama}</p>
                </div>
              </div>

            </div>

            {/* Bottom Row: Harf Notu (harf_notu.php) */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold border border-rose-200">
                  3. Hafta Haftalık Ödev (Slayt 46)
                </span>
                <span className="text-xs font-mono text-stone-400">harf_notu.php</span>
              </div>

              <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                Sanat Eseri Jüri Puanı & Üniversite Harf Notu Baremi
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                Vize %40, Final %60 ağırlıkları ile AA, BA, BB, CB, CC, DC, DD, FF hesaplama ve 0-100 sınır kontrolü.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Teknik / Vize Puanı ($vize)
                  </label>
                  <input
                    type="number"
                    value={juriVize}
                    onChange={(e) => setJuriVize(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
                    Estetik / Final Puanı ($final)
                  </label>
                  <input
                    type="number"
                    value={juriFinal}
                    onChange={(e) => setJuriFinal(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="bg-[#FAF8F5] border-l-4 border-rose-600 p-3.5 rounded-r-lg font-mono text-xs">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block mb-1">
                      TARAYICI ÇIKTISI (SLAYT 46):
                    </span>
                    {juriHata ? (
                      <p className="text-rose-600 font-bold">HATA: Notlar 0 ile 100 arasında olmalıdır!</p>
                    ) : (
                      <p>
                        Ortalama: <strong>{juriOrtalama}</strong> | Harf Notu:{' '}
                        <strong className="text-base text-rose-700">{juriHarf}</strong> ({juriDurum})
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
