<?php
/**
 * NEVAART - İnternet Programcılığı II (1, 2 ve 3. Hafta) Müfredat Kod Dosyaları
 * Dr. Ahmet Akkaya | Bandırma Onyedi Eylül Üniversitesi · Gönen MYO
 */

$phpCurriculumFiles = [
    [
        'name' => 'index.php',
        'category' => '1. Hafta: İlk PHP Dosyası & Dinamik Çıktı',
        'week' => 1,
        'path' => 'C:/xampp/htdocs/internet2/index.php',
        'description' => 'İlk PHP kodu, echo komutu ile tarayıcıya dinamik çıktı üretimi (Slayt 01, 20, 41-43)',
        'expectedOutput' => 'Merhaba Dünya!<br>Merhaba Ahmet!',
        'code' => <<<'PHP'
<?php
/**
 * İnternet Programcılığı II - 1. Hafta
 * Dr. Ahmet Akkaya | Bandırma Onyedi Eylül Üniversitesi Gönen MYO
 * Dosya Yolu: C:\xampp\htdocs\internet2\index.php
 */

echo "Merhaba Dünya!<br>";
echo "Merhaba Ahmet!";
?>
PHP
    ],
    [
        'name' => 'hafta1_odev.php',
        'category' => '1. Hafta: Öğrenci & Küratör Tanıtım Kartı',
        'week' => 1,
        'path' => 'C:/xampp/htdocs/internet2/hafta1_ogrencino/index.php',
        'description' => 'Öğrenci tanıtım sayfası ödevi (Slayt 46)',
        'expectedOutput' => 'Ad Soyad: Dr. Ahmet Akkaya<br>Program: Bilgisayar Programcılığı<br>Hafta: 1',
        'code' => <<<'PHP'
<?php
/**
 * İnternet Programcılığı II - 1. Hafta Uygulama Ödevi
 * Klasör Adı: hafta1_ogrencino/index.php
 */

echo "Ad Soyad: Dr. Ahmet Akkaya<br>";
echo "Program: Bilgisayar Programcılığı<br>";
echo "Hafta: 1";
?>
PHP
    ],
    [
        'name' => 'siparis.php',
        'category' => '2. Hafta: Sanat Siparişi & KDV Hesabı',
        'week' => 2,
        'path' => 'C:/xampp/htdocs/internet2/hafta2/siparis.php',
        'description' => 'Değişkenler, veri tipleri, KDV hesabı, nokta (.) birleştirme ve aritmetik operatörler (Slayt 40-41)',
        'expectedOutput' => 'Ürün: NevaArt Profesyonel Yağlı Boya & Tuval Seti<br>Ara toplam: 750 TL<br>KDV: 150 TL<br><strong>Toplam: 900 TL</strong>',
        'code' => <<<'PHP'
<?php
// PDF 2. Hafta Slayt 40-41 Mantığı
$urun = "NevaArt Profesyonel Yağlı Boya & Tuval Seti";
$birimFiyat = 250;
$adet = 3;
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
?>
PHP
    ],
    [
        'name' => 'not_karti.php',
        'category' => '2. Hafta: Öğrenci & Sanatçı Puan Kartı',
        'week' => 2,
        'path' => 'C:/xampp/htdocs/internet2/hafta2/not_karti.php',
        'description' => 'Aritmetik operatörler, ortalama hesabı ve bileşik atama (+=, .=) kullanımı',
        'expectedOutput' => 'Öğrenci: Semih | Vize: 80 | Final: 90 | Ortalama: 86',
        'code' => <<<'PHP'
<?php
$ogrenci = "Semih";
$vize = 80;
$final = 90;
$ortalama = ($vize * 0.40) + ($final * 0.60);

$mesaj = "Öğrenci: " . $ogrenci;
$mesaj .= " | Vize: $vize | Final: $final | Ortalama: $ortalama";
echo $mesaj;
?>
PHP
    ],
    [
        'name' => 'bilet.php',
        'category' => '3. Hafta: Sergi Giriş Bileti Hesaplayıcı',
        'week' => 3,
        'path' => 'C:/xampp/htdocs/internet2/hafta3/bilet.php',
        'description' => 'if - elseif - else karar yapıları ile yaş ve öğrenci indirimli sergi bileti (Slayt 40-41)',
        'expectedOutput' => 'Bilet: 150 TL (Üniversite Öğrencisi - %25 İndirim)',
        'code' => <<<'PHP'
<?php
$yas = 20;
$ogrenci = true;
$temelFiyat = 200;

if ($yas <= 6) {
    $fiyat = 0;
    $tarife = "0-6 Yaş Çocuk (Ücretsiz)";
} elseif ($yas <= 17) {
    $fiyat = $temelFiyat * 0.50;
    $tarife = "7-17 Yaş Genç Sanatçı (%50 İndirim)";
} elseif ($ogrenci) {
    $fiyat = $temelFiyat * 0.75;
    $tarife = "Üniversite Öğrencisi (%25 İndirim)";
} else {
    $fiyat = $temelFiyat;
    $tarife = "Tam Ücret";
}

echo "Bilet: $fiyat TL ($tarife)";
?>
PHP
    ],
    [
        'name' => 'kargo.php',
        'category' => '3. Hafta: Eser Teslimat & Kargo Ücreti',
        'week' => 3,
        'path' => 'C:/xampp/htdocs/internet2/hafta3/kargo.php',
        'description' => 'Mantıksal operatörler (&&, ||) ile sepet tutarı ve üyelik bazlı kargo hesabı (Slayt 43)',
        'expectedOutput' => 'Kargo: 20 TL (Kulüp Üyesi + 500 TL Üzeri İndirimli)',
        'code' => <<<'PHP'
<?php
$sepet = 620;
$uye = true;

if ($sepet >= 750) {
    $kargo = 0;
} elseif ($uye && $sepet >= 500) {
    $kargo = 20;
} else {
    $kargo = 50;
}

echo "Kargo: $kargo TL";
?>
PHP
    ],
    [
        'name' => 'harf_notu.php',
        'category' => '3. Hafta: Jüri Puanı & Harf Notu Baremi',
        'week' => 3,
        'path' => 'C:/xampp/htdocs/internet2/hafta3/harf_notu.php',
        'description' => '0-100 sınır kontrolü, AA-FF harf notu baremi ve PHP 8 match ifadesi (Slayt 46)',
        'expectedOutput' => 'Ortalama: 81 | Harf Notu: BA (Çok İyi)',
        'code' => <<<'PHP'
<?php
$vize = 75;
$final = 85;

if ($vize < 0 || $vize > 100 || $final < 0 || $final > 100) {
    echo "HATA: Notlar 0 ile 100 arasında olmalıdır!";
} else {
    $ortalama = ($vize * 0.40) + ($final * 0.60);
    if ($ortalama >= 90) $harf = "AA";
    elseif ($ortalama >= 80) $harf = "BA";
    elseif ($ortalama >= 70) $harf = "BB";
    elseif ($ortalama >= 65) $harf = "CB";
    elseif ($ortalama >= 60) $harf = "CC";
    elseif ($ortalama >= 55) $harf = "DC";
    elseif ($ortalama >= 50) $harf = "DD";
    else $harf = "FF";

    echo "Ortalama: $ortalama | Harf Notu: $harf";
}
?>
PHP
    ]
];

