export interface PhpFileItem {
  name: string;
  category: string;
  week: number;
  path: string;
  language: string;
  description: string;
  expectedOutput?: string;
  code: string;
}

export const PHP_PROJECT_FILES: PhpFileItem[] = [
  // ==========================================
  // 1. HAFTA: GİRİŞ, WEB MİMARİSİ VE XAMPP KURULUMU
  // ==========================================
  {
    name: 'index.php',
    category: '1. Hafta: İlk PHP Dosyası',
    week: 1,
    path: 'C:/xampp/htdocs/internet2/index.php',
    language: 'php',
    description: 'İlk PHP kodu, echo komutu ile tarayıcıya dinamik çıktı üretimi (Slayt 01, 20, 41-43)',
    expectedOutput: 'Merhaba Dünya!<br>Merhaba Ahmet!',
    code: `<?php
/**
 * İnternet Programcılığı II - 1. Hafta
 * Dr. Ahmet Akkaya | Bandırma Onyedi Eylül Üniversitesi Gönen MYO
 * Dosya Yolu: C:\\xampp\\htdocs\\internet2\\index.php
 * Tarayıcı Adresi: http://localhost/internet2/
 */

// Tarayıcıya ilk metin çıktımızı gönderiyoruz
echo "Merhaba Dünya!<br>";

// Sınıf içi uygulama: Kendi adınızla deneme
echo "Merhaba Ahmet!";
`
  },
  {
    name: 'hafta1_odev.php',
    category: '1. Hafta: Haftalık Uygulama Ödevi',
    week: 1,
    path: 'C:/xampp/htdocs/internet2/hafta1_ogrencino/index.php',
    language: 'php',
    description: 'Öğrenci tanıtım sayfası ödevi (Slayt 46)',
    expectedOutput: 'Ad Soyad: Ahmet Akkaya<br>Program: Bilgisayar Programcılığı<br>Hafta: 1',
    code: `<?php
/**
 * İnternet Programcılığı II - 1. Hafta Uygulama Ödevi
 * Klasör Adı: hafta1_ogrencino
 * Dosya Adı: index.php
 * Teslim Ölçütü: Ad, soyad ve program ekranda <br> ile görünmeli
 */

echo "Ad Soyad: Ahmet Akkaya<br>";
echo "Program: Bilgisayar Programcılığı<br>";
echo "Hafta: 1";
`
  },
  {
    name: 'xampp_mimarisi.txt',
    category: '1. Hafta: Web Mimarisi & XAMPP Notları',
    week: 1,
    path: 'C:/xampp/htdocs/internet2/docs/xampp_rehberi.txt',
    language: 'plaintext',
    description: 'İstemci-Sunucu, HTTP/HTTPS portları (80/443), MariaDB (3306) ve XAMPP mimarisi özeti (Slayt 04-18, 38-39)',
    expectedOutput: 'İstemci -> Apache (Port 80) -> PHP Yorumlayıcı -> HTML Çıktısı -> Tarayıcı',
    code: `========================================================================
İNTERNET PROGRAMCILIĞI II - 1. HAFTA: WEB MİMARİSİ VE XAMPP NOTLARI
Dr. Ahmet Akkaya | Bandırma Onyedi Eylül Üniversitesi · Gönen MYO
========================================================================

1. İSTEMCİ - SUNUCU (CLIENT - SERVER) ÇALIŞMA SÜRECİ:
   Tarayıcı (URL Yazar) -> DNS (IP Çözümler) -> Apache Sunucusu (Port 80/443) 
   -> PHP Kodu Çalıştırılır -> Üretilen HTML İstemciye İletilir -> Tarayıcı Render Eder.
   * DİKKAT: Tarayıcı asla PHP kaynak kodunu görmez; yalnızca PHP'nin ürettiği çıktıyı alır.

2. STATİK VS DİNAMİK WEB SİTELERİ:
   - Statik: Dosyadaki içerik her kullanıcıya aynıdır (küçük tanıtım sayfaları).
   - Dinamik: Kullanıcıya, zamana veya veritabanına göre PHP tarafından anlık üretilir (ÖBS, E-ticaret).

3. XAMPP BİLEŞENLERİ:
   - Apache: Web sunucusu (Port 80, 443)
   - PHP: Sunucu tarafı programlama dili ve yorumlayıcısı (PHP 8.2.12)
   - MariaDB/MySQL: İlişkisel veritabanı (Port 3306)
   - phpMyAdmin: Web tabanlı veritabanı yönetim arayüzü (http://localhost/phpmyadmin)

4. ÇALIŞMA DİZİNİ:
   C:\\xampp\\htdocs\\internet2\\
   Tarayıcıdan erişim: http://localhost/internet2/
   * Asla PHP dosyasına çift tıklanarak açılmaz; Apache üzerinden http://localhost/ ile çağrılır.

5. PORT ÇAKIŞMASI VE ÇÖZÜMLERİ:
   - Port 80/443 meşgulse: XAMPP Config -> httpd.conf dosyasından 'Listen 8080' yapılabilir.
   - Alternatif URL: http://localhost:8080/internet2/
`
  },

  // ==========================================
  // 2. HAFTA: PHP TEMELLERİ (SÖZ DİZİMİ, DEĞİŞKENLER, VERİ TİPLERİ, OPERATÖRLER)
  // ==========================================
  {
    name: 'hafta2_index.php',
    category: '2. Hafta: Temel Söz Dizimi & HTML Etkileşimi',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/index.php',
    language: 'php',
    description: 'PHP etiketleri, noktalı virgül kuralı, tek ve çok satırlı yorumlar, karışık HTML+PHP yapısı (Slayt 06-09)',
    expectedOutput: 'Ders sayfası\nPHP çalıştı\nHTML devam ediyor.\nMerhaba Ahmet',
    code: `<?php
/**
 * İnternet Programcılığı II - 2. Hafta
 * Dr. Ahmet Akkaya | Gönen MYO
 * Dosya Yolu: C:\\xampp\\htdocs\\internet2\\hafta2\\index.php
 * Adres: http://localhost/internet2/hafta2/
 */

// Tek satırlık yorum
# Bu da tek satırlık alternatif yorumdur

/*
 Birden fazla satır için
 blok yorum kullanılır.
 İyi yorum: Kodun ne yaptığını değil, neden o şekilde yazıldığını açıklar.
*/
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>PHP Etiketi ve HTML Birlikteliği</title>
</head>
<body>

    <!-- KARIŞIK HTML + PHP KULLANIMI (Slayt 07) -->
    <h1>Ders sayfası</h1>

    <?php
        // PHP etiketleri içindeki bölüm sunucuda çalışır.
        // Etiketlerin dışındaki HTML doğrudan yanıta eklenir.
        echo "PHP çalıştı";
    ?>

    <p>HTML devam ediyor.</p>

    <?php
        // İfadeler ve noktalı virgül kuralı (Slayt 08):
        // PHP ifadeleri noktalı virgül (;) ile sonlandırılır.
        $ad = "Ahmet";
        $not = 85;
        echo $ad . ": " . $not;
    ?>

</body>
</html>
`
  },
  {
    name: 'hafta2_degiskenler.php',
    category: '2. Hafta: Değişkenler & Metin Enterpolasyonu',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/degiskenler.php',
    language: 'php',
    description: 'Değişken adlandırma kuralları, harf büyüklüğü duyarlılığı, çift tırnak vs tek tırnak farkı (Slayt 13-20)',
    expectedOutput: 'Ali<br>Zeynep<br><br>60<br>85<br><br>Merhaba Selin<br>Yaş: 20<br><br>Can Demir',
    code: `<?php
/**
 * Değişken Tanımlama ve Kuralları (Slayt 13-20)
 * 1. $ işaretiyle başlar
 * 2. İlk karakter harf veya alt çizgi (_) olmalıdır, rakamla başlayamaz ($2sinav geçersizdir)
 * 3. Boşluk ve tire (-) içeremez ($ad soyad, $urun-fiyati geçersizdir)
 * 4. Büyük ve küçük harfe duyarlıdır ($ad ile $Ad farklı değişkenlerdir)
 */

// Büyük ve küçük harf duyarlılığı örneği (Slayt 16)
$ad = "Ali";
$Ad = "Zeynep";
echo $ad;
echo "<br>";
echo $Ad;
echo "<br><br>";

// Atama ve değer değiştirme (Slayt 17)
$puan = 60; // İlk değer
echo $puan;
$puan = 85; // Yeni değer
echo "<br>";
echo $puan;
echo "<br><br>";

// Çift tırnak içinde değişken yerleştirme (Interpolation) (Slayt 18)
$ogrenciAdi = "Selin";
$yas = 20;
echo "Merhaba $ogrenciAdi";
echo "<br>Yaş: $yas";
echo "<br><br>";

// Metin birleştirme operatörü: Nokta (.) (Slayt 19)
$isim = "Can";
$soyad = "Demir";
$tamAd = $isim . " " . $soyad;
echo $tamAd;

// Tek tırnak ve çift tırnak farkı (Slayt 20):
// echo "Merhaba $ad"; -> Değişken işlenir -> Merhaba Ali
// echo 'Merhaba $ad'; -> Değişken metin olarak kalır -> Merhaba $ad
// echo "Satır\\n";    -> Kaçış dizisi işlenir
// echo 'Satır\\n';    -> \\n düz metin olarak kalır
`
  },
  {
    name: 'hafta2_veri_tipleri.php',
    category: '2. Hafta: Veri Tipleri & Tip Dönüştürme',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/veri_tipleri.php',
    language: 'php',
    description: 'string, int, float, bool, null tipleri, var_dump() hata ayıklama, tip dönüşümü ve casting (Slayt 22-29)',
    expectedOutput: 'string(3) "Ece"\nint(20)\nfloat(84.5)\nbool(true)\nNULL',
    code: `<?php
/**
 * PHP Veri Tipleri ve Tip İnceleme (Slayt 22-29)
 * string, int, float, bool, null
 */

// 1. Temel Veri Tipleri
$ogrenci = "Ece";      // string
$yas = 20;             // int
$ortalama = 84.5;      // float
$aktif = true;         // bool (true / false)
$telefon = null;       // null (değer yok)

// 2. var_dump() ile Değer ve Tip İnceleme (Slayt 26)
// echo false veya null değerini görünür biçimde yazmaz; var_dump geliştirme sırasında tipi ve değeri gösterir.
var_dump($ogrenci);
echo "<br>";
var_dump($yas);
echo "<br>";
var_dump($ortalama);
echo "<br>";
var_dump($aktif);
echo "<br>";
var_dump($telefon);
echo "<br><br>";

// 3. Dinamik Tip Sistemi (Slayt 27)
$deger = 25;           // int(25)
var_dump($deger);
$deger = "yirmi beş";  // string(10)
var_dump($deger);
echo "<br><br>";

// 4. Tip Dönüştürme (Casting) (Slayt 28)
$metin = "25";
$sayi = (int) $metin;  // int'e dönüştürüldü
var_dump($sayi);
echo "<br><br>";

// 5. Otomatik Tip Dönüşümü (Type Juggling) (Slayt 29)
$adet = "3";
$fiyat = 50;
$toplam = $adet * $fiyat; // "3" sayısal metin olduğu için çarpma işleminde otomatik sayıya dönüşür
var_dump($toplam);        // int(150)
`
  },
  {
    name: 'hafta2_operatorler.php',
    category: '2. Hafta: Operatörler & Karşılaştırmalar',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/operatorler.php',
    language: 'php',
    description: 'Aritmetik, bileşik atama, metin, karşılaştırma (== vs ===), mantıksal ve artırma operatörleri (Slayt 30-39)',
    expectedOutput: 'Toplama: 13 | Mod: 1 | Üs: 8<br>Ortalama: 76<br>==: true | ===: false',
    code: `<?php
/**
 * PHP Operatörleri (Slayt 30-39)
 */

// 1. Aritmetik Operatörler (+ - * / % **)
$a = 10;
$b = 3;
echo "Toplama: " . ($a + $b) . "<br>"; // 13
echo "Çıkarma: " . ($a - $b) . "<br>"; // 7
echo "Çarpma: " . ($a * $b) . "<br>";  // 30
echo "Bölme: " . ($a / 4) . "<br>";    // 2.5
echo "Kalan (% mod): " . ($a % $b) . "<br>"; // 1 (tek/çift kontrolü için kullanılır)
echo "Üs alma (**): " . (2 ** 3) . "<br><br>"; // 8

// Aritmetik işlem örneği: Not hesaplama (Slayt 32)
$vize = 70;
$final = 80;
$ortalama = $vize * 0.4 + $final * 0.6; // 28 + 48 = 76
echo "Ortalama: " . $ortalama . "<br><br>";

// 2. Bileşik Atama Operatörleri (+= -= *= /= .=) (Slayt 34)
$stok = 10;
$stok += 5; // 15
$stok -= 1; // 14
$mesaj = "Merhaba";
$mesaj .= " ";
$mesaj .= "Dünya"; // Merhaba Dünya (Slayt 35)
echo "Metin birleştirme: " . $mesaj . "<br><br>";

// 3. Karşılaştırma Operatörleri: == ve === Farkı (Slayt 36-37)
$sayi = 5;
$metinSayi = "5";
echo "Değer karşılaştırma ($sayi == '$metinSayi'): ";
var_dump($sayi == $metinSayi);  // bool(true)
echo "<br>Değer ve tip karşılaştırma ($sayi === '$metinSayi'): ";
var_dump($sayi === $metinSayi); // bool(false) - biri int, diğeri string!
echo "<br><br>";

// 4. Artırma ve Azaltma Operatörleri (++ --) (Slayt 39)
$sayac = 5;
$sayac++; // 6
echo "Sayac++ : " . $sayac . "<br>";
$sayac--; // 5
echo "Sayac-- : " . $sayac . "<br>";
`
  },
  {
    name: 'siparis.php',
    category: '2. Hafta: Dersin Ürünü (Sipariş Tutarı)',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/siparis.php',
    language: 'php',
    description: 'Birim fiyat, adet ve KDV oranından ara toplam ve genel toplam hesaplama (Slayt 40-41)',
    expectedOutput: 'Ürün: USB Bellek<br>Ara toplam: 750 TL<br>KDV: 150 TL<br>Toplam: 900 TL',
    code: `<?php
/**
 * İnternet Programcılığı II - 2. Hafta Dersin Ürünü
 * Dosya Adı: siparis.php (Slayt 40-41)
 * Konular: Değişken, string, int, float, çarpma, toplama ve metin birleştirme
 */

// Girdiler
$urun = "USB Bellek";
$birimFiyat = 250;
$adet = 3;
$kdvOrani = 0.20;

// Hesaplama
$araToplam = $birimFiyat * $adet;
$kdv = $araToplam * $kdvOrani;
$genelToplam = $araToplam + $kdv;

// Çıktı
echo "Ürün: $urun<br>";
echo "Ara toplam: $araToplam TL<br>";
echo "KDV: $kdv TL<br>";
echo "Toplam: $genelToplam TL";
`
  },
  {
    name: 'not_karti.php',
    category: '2. Hafta: Sınıf İçi Uygulama',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/not_karti.php',
    language: 'php',
    description: 'Vize %40 ve Final %60 ağırlıkları ile öğrenci ortalama not kartı (Slayt 43)',
    expectedOutput: 'Öğrenci: Deniz<br>Vize: 65<br>Final: 80<br>Ortalama: 74',
    code: `<?php
/**
 * İnternet Programcılığı II - 2. Hafta Sınıf İçi Uygulama
 * Dosya Adı: not_karti.php (Slayt 43)
 */

// Veriler
$ad = "Deniz";
$vize = 65;
$final = 80;

// Ağırlıklı ortalama hesabı
$ortalama = $vize * 0.4 + $final * 0.6;

// Düzenli çıktı
echo "Öğrenci: $ad<br>";
echo "Vize: $vize<br>";
echo "Final: $final<br>";
echo "Ortalama: $ortalama";
`
  },
  {
    name: 'alisveris.php',
    category: '2. Hafta: Haftalık Uygulama Ödevi',
    week: 2,
    path: 'C:/xampp/htdocs/internet2/hafta2/alisveris.php',
    language: 'php',
    description: 'Bileşik atama operatörü kullanan KDV alışveriş özeti ödevi (Slayt 46)',
    expectedOutput: '=== KDV\'li Alışveriş Özeti ===<br>Ürün: Kablosuz Mouse<br>Birim Fiyat: 450 TL<br>Adet: 2<br>Ara Toplam: 900 TL<br>KDV (%20): 180 TL<br>Genel Toplam: 1080 TL',
    code: `<?php
/**
 * İnternet Programcılığı II - 2. Hafta Haftalık Uygulama Ödevi
 * Dosya Adı: alisveris.php (Slayt 46)
 * Teslim Ölçütleri:
 * - Ara toplam, KDV ve genel toplam hesaplanmalı
 * - Ürün adı ve tüm tutarlar ekranda görünmeli
 * - En az bir bileşik atama operatörü kullanılmalı (+=, .= vb.)
 */

$urun = "Kablosuz Mouse";
$birimFiyat = 450;
$adet = 2;
$kdvOrani = 0.20;

$araToplam = $birimFiyat * $adet;
$kdv = $araToplam * $kdvOrani;

// Bileşik atama operatörü kullanımı:
$genelToplam = $araToplam;
$genelToplam += $kdv; // += bileşik atama operatörü

// Metin birleştirme bileşik atama operatörü (.=) ile çıktı oluşturma:
$ozet = "=== KDV'li Alışveriş Özeti ===<br>";
$ozet .= "Ürün: $urun<br>";
$ozet .= "Birim Fiyat: $birimFiyat TL<br>";
$ozet .= "Adet: $adet<br>";
$ozet .= "Ara Toplam: $araToplam TL<br>";
$ozet .= "KDV (%20): $kdv TL<br>";
$ozet .= "Genel Toplam: $genelToplam TL";

echo $ozet;
`
  },

  // ==========================================
  // 3. HAFTA: PHP KARAR YAPILARI (IF, ELSEIF, ELSE, SWITCH, MATCH)
  // ==========================================
  {
    name: 'hafta3_index.php',
    category: '3. Hafta: Temel if / else & Mantıksal Koşullar',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/index.php',
    language: 'php',
    description: 'if, if-else, süslü parantez kuralı, tek/çift sayı kontrolü ve mantıksal operatörler (Slayt 06-19, 24-26)',
    expectedOutput: 'Reşitsiniz.<br>14 bir Çift sayıdır.<br>Geçerli not<br>Hafta sonu',
    code: `<?php
/**
 * İnternet Programcılığı II - 3. Hafta: PHP Karar Yapıları
 * Dr. Ahmet Akkaya | Bandırma Onyedi Eylül Üniversitesi Gönen MYO
 * Dosya Yolu: C:\\xampp\\htdocs\\internet2\\hafta3\\index.php
 * Adres: http://localhost/internet2/hafta3/
 */

// 1. Temel if Söz Dizimi ve Süslü Parantez İlkesi (Slayt 11, 13, 15)
$yas = 20;
if ($yas >= 18) {
    echo "Reşitsiniz.<br>";
}

// 2. if-else ile İki Dallı Karar: Tek veya Çift Sayı Kontrolü (Slayt 18)
$sayi = 14;
if ($sayi % 2 === 0) {
    echo "$sayi bir Çift sayıdır.<br>";
} else {
    echo "$sayi bir Tek sayıdır.<br>";
}

// 3. AND (&&) ile Aralık Kontrolü (Slayt 24)
$not = 78;
if ($not >= 0 && $not <= 100) {
    echo "Geçerli not<br>";
} else {
    echo "Hatalı not<br>";
}

// 4. OR (||) ile Alternatif Koşullar (Slayt 25)
$gun = "Cumartesi";
if ($gun === "Cumartesi" || $gun === "Pazar") {
    echo "Hafta sonu<br>";
} else {
    echo "Hafta içi<br>";
}

// 5. NOT (!) Operatörü (Slayt 26)
$girisYapti = false;
if (!$girisYapti) {
    echo "Lütfen sisteme giriş yapın.<br>";
}
`
  },
  {
    name: 'not_siniflandirma.php',
    category: '3. Hafta: elseif Zinciri & Sınır Değerleri',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/not_siniflandirma.php',
    language: 'php',
    description: 'Doğru koşul sırası kuralı, not derecelendirme ve sınır değer testleri (Slayt 21-23)',
    expectedOutput: 'Not: 78 -> Sonuç: İyi\nSınır Testleri Başarılı: 85 (Pekiyi), 70 (İyi), 50 (Geçer), 49 (Kaldı)',
    code: `<?php
/**
 * elseif Zinciri ve Koşul Sırası Kuralı (Slayt 21-23)
 * ÖNEMLİ KURAL:
 * elseif zincirinde İLK TRUE OLAN dal çalışır.
 * Geniş aralığı (örn. $not >= 50) en başa yazmak, daha özel koşulları ($not >= 85) erişilemez yapar!
 */

$not = 78;

// DOĞRU SIRALAMA: Özelden genele doğru (büyük değerden küçüğe)
if ($not >= 85) {
    echo "Pekiyi";
} elseif ($not >= 70) {
    echo "İyi";      // 78 için burası çalışır
} elseif ($not >= 50) {
    echo "Geçer";
} else {
    echo "Kaldı";
}

echo "<br><br>--- Sınır Değerleri Test Yaklaşımı (Slayt 23) ---<br>";
$testNotlari = [85, 84, 70, 69, 50, 49];

foreach ($testNotlari as $test) {
    if ($test >= 85) {
        $sonuc = "Pekiyi";
    } elseif ($test >= 70) {
        $sonuc = "İyi";
    } elseif ($test >= 50) {
        $sonuc = "Geçer";
    } else {
        $sonuc = "Kaldı";
    }
    echo "Not: $test -> Sonuç: $sonuc<br>";
}
`
  },
  {
    name: 'switch_match.php',
    category: '3. Hafta: switch & Modern PHP 8 match',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/switch_match.php',
    language: 'php',
    description: 'switch/case/break/default vs modern PHP 8+ match ifadesi karşılaştırması (Slayt 32-39)',
    expectedOutput: 'switch rol: Tam yetki | match gun: Hafta sonu | ternary: Geçti',
    code: `<?php
/**
 * switch Yapısı ve PHP 8+ match İfadesi (Slayt 32-39)
 */

// 1. switch Yapısı (Slayt 32, 33, 35)
$rol = "admin";

switch ($rol) {
    case "admin":
        echo "Tam yetki<br>";
        break; // break unutulursa alt satırlara taşar (fall-through)!
    case "uye":
        echo "Üye yetkisi<br>";
        break;
    default:
        echo "Bilinmeyen rol<br>";
}

// 2. Modern PHP 8+ match İfadesi (Slayt 37-39)
// Özellikleri:
// - Değer döndürür (ifadedir)
// - === ile sıkı (strict) tip karşılaştırması yapar
// - break gerektirmez
// - Virgülle birden fazla durum gruplanabilir (6, 7 => "Hafta sonu")
$gun = 6;
$gunAdi = match ($gun) {
    1 => "Pazartesi",
    2 => "Salı",
    6, 7 => "Hafta sonu",
    default => "Diğer gün",
};

echo "Gün Sonucu: $gunAdi<br><br>";

// 3. Üçlü Koşul Operatörü (Ternary Operator) (Slayt 30-31)
$puan = 65;
$durum = ($puan >= 50) ? "Geçti" : "Kaldı";
echo "Ternary Durum: $durum";
`
  },
  {
    name: 'bilet.php',
    category: '3. Hafta: Dersin Ürünü (Bilet Fiyatı)',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/bilet.php',
    language: 'php',
    description: 'Yaş ve öğrenci durumuna göre dinamik indirimli bilet fiyatı hesaplama (Slayt 40-41)',
    expectedOutput: 'Bilet: 150 TL',
    code: `<?php
/**
 * İnternet Programcılığı II - 3. Hafta Dersin Ürünü
 * Dosya Adı: bilet.php (Slayt 40-41)
 *
 * Kurallar:
 * - Temel fiyat: 200 TL
 * - 0–6 yaş: ücretsiz (0 TL)
 * - 7–17 yaş: %50 indirim
 * - Öğrenci yetişkin: %25 indirim
 * - Diğer yetişkin: tam ücret (200 TL)
 *
 * Karar Sırası: Önce yaş aralıkları, sonra öğrenci durumu kontrol edilir.
 */

// Girdiler
$yas = 20;
$ogrenci = true;
$temelFiyat = 200;

if ($yas <= 6) {
    $fiyat = 0;
} elseif ($yas <= 17) {
    $fiyat = $temelFiyat * 0.50;
} elseif ($ogrenci) {
    $fiyat = $temelFiyat * 0.75;
} else {
    $fiyat = $temelFiyat;
}

echo "Bilet: $fiyat TL";
`
  },
  {
    name: 'kargo.php',
    category: '3. Hafta: Sınıf İçi Uygulama (Kargo Ücreti)',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/kargo.php',
    language: 'php',
    description: 'Sepet tutarı ve üyelik şartlarına göre kademeli kargo ücreti (Slayt 43)',
    expectedOutput: 'Kargo: 20 TL',
    code: `<?php
/**
 * İnternet Programcılığı II - 3. Hafta Sınıf İçi Uygulama
 * Konu: Kargo ücreti hesaplama (Slayt 43)
 *
 * Kurallar:
 * - Sepet en az 750 TL ise ücretsiz (0 TL)
 * - Üye ve sepet en az 500 TL ise 20 TL
 * - Diğer durumlarda 50 TL
 */

$sepet = 620;
$uye = true;

if ($sepet >= 750) {
    $kargoUcreti = 0;
} elseif ($uye && $sepet >= 500) {
    $kargoUcreti = 20;
} else {
    $kargoUcreti = 50;
}

echo "Kargo: $kargoUcreti TL";
`
  },
  {
    name: 'harf_notu.php',
    category: '3. Hafta: Haftalık Uygulama Ödevi',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/harf_notu.php',
    language: 'php',
    description: 'Vize %40, Final %60 ile AA-FF aralıkları ve 0-100 sınır denetimli harf notu ödevi (Slayt 46)',
    expectedOutput: 'Vize: 75 | Final: 85 | Ortalama: 81 -> Harf Notu: BA (Başarılı)',
    code: `<?php
/**
 * İnternet Programcılığı II - 3. Hafta Haftalık Ödev
 * Dosya Adı: harf_notu.php (Slayt 46)
 *
 * Teslim Ölçütleri:
 * - Ortalama doğru hesaplanmalı ($ortalama = $vize * 0.4 + $final * 0.6)
 * - AA, BA, BB, CB, CC, DC, DD ve FF aralıkları yazılmalı
 * - 0–100 dışındaki not için hata mesajı gösterilmeli
 * - Sınır değerlerinden en az dördü test edilmeli
 */

function hesaplaHarfNotu($vize, $final) {
    // 0-100 dışındaki girişler için hata kontrolü
    if ($vize < 0 || $vize > 100 || $final < 0 || $final > 100) {
        return "HATA: Vize ve final notları 0 ile 100 aralığında olmalıdır!";
    }

    $ortalama = $vize * 0.4 + $final * 0.6;

    // Üniversite Harf Notu Kademeleri
    if ($ortalama >= 90) {
        $harf = "AA";
        $durum = "Mükemmel";
    } elseif ($ortalama >= 80) {
        $harf = "BA";
        $durum = "Çok İyi";
    } elseif ($ortalama >= 70) {
        $harf = "BB";
        $durum = "İyi";
    } elseif ($ortalama >= 65) {
        $harf = "CB";
        $durum = "Orta Üstü";
    } elseif ($ortalama >= 60) {
        $harf = "CC";
        $durum = "Orta (Geçer)";
    } elseif ($ortalama >= 55) {
        $harf = "DC";
        $durum = "Koşullu Geçer";
    } elseif ($ortalama >= 50) {
        $harf = "DD";
        $durum = "Koşullu Geçer";
    } else {
        $harf = "FF";
        $durum = "Kaldı";
    }

    return "Vize: $vize | Final: $final | Ortalama: $ortalama -> Harf Notu: $harf ($durum)";
}

// Ana Örnek Testi:
echo hesaplaHarfNotu(75, 85) . "<br><br>";

// Sınır Değerleri Testi (En az 4 sınır değeri):
echo "<strong>--- Sınır Değer Testleri ---</strong><br>";
echo hesaplaHarfNotu(90, 90) . "<br>";   // AA Sınırı
echo hesaplaHarfNotu(80, 80) . "<br>";   // BA Sınırı
echo hesaplaHarfNotu(60, 60) . "<br>";   // CC Sınırı
echo hesaplaHarfNotu(49, 49) . "<br>";   // FF Sınırı
echo hesaplaHarfNotu(110, 80) . "<br>";  // 0-100 dışı hata testi
`
  },
  {
    name: 'alternatif_if.php',
    category: '3. Hafta: HTML İçi Alternatif Söz Dizimi',
    week: 3,
    path: 'C:/xampp/htdocs/internet2/hafta3/alternatif_if.php',
    language: 'php',
    description: 'HTML içinde <?php if ($kosul): ?> ... <?php else: ?> ... <?php endif; ?> yapısı (Slayt 29)',
    expectedOutput: 'Giriş Başarılı: Hoş geldiniz, Sayın Ahmet Akkaya!',
    code: `<?php
/**
 * Alternatif if Söz Dizimi (Slayt 29)
 * HTML ile PHP sık sık iç içe geçiyorsa süslü parantez yerine
 * if (...): / elseif (...): / else: / endif; yazımı çok daha temiz ve okunabilirdir.
 */

$girisYapti = true;
$kullaniciAdi = "Ahmet Akkaya";
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Alternatif if Söz Dizimi</title>
</head>
<body>

    <?php if ($girisYapti): ?>
        <h2>Hoş geldiniz, Sayın <?php echo $kullaniciAdi; ?>!</h2>
        <p>Gönen MYO İnternet Programcılığı II sistemine başarılı giriş yaptınız.</p>
        <a href="cikis.php">Güvenli Çıkış</a>
    <?php else: ?>
        <h2>Lütfen Giriş Yapın</h2>
        <a href="giris.php">Giriş Yap</a>
    <?php endif; ?>

</body>
</html>
`
  }
];
