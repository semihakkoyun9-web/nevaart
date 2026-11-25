<?php
/**
 * NEVAART - PHP GD Resim İşleme ve Yapay Zeka Gerçek Piksel Renk Analiz Motoru
 * Kriter L (PHP resim işleme kütüphaneleri - GD) & Kriter M (Yapay zeka tabanlı özellik)
 */

function rgbToHexPhp(int $r, int $g, int $b): string {
    $r = max(0, min(255, $r));
    $g = max(0, min(255, $g));
    $b = max(0, min(255, $b));
    return strtoupper(sprintf('#%02x%02x%02x', $r, $g, $b));
}

function rgbToHslPhp(int $r, int $g, int $b): array {
    $rf = $r / 255.0;
    $gf = $g / 255.0;
    $bf = $b / 255.0;

    $max = max($rf, $gf, $bf);
    $min = min($rf, $gf, $bf);
    $h = 0.0;
    $s = 0.0;
    $l = ($max + $min) / 2.0;

    if ($max !== $min) {
        $d = $max - $min;
        $s = $l > 0.5 ? $d / (2.0 - $max - $min) : $d / ($max + $min);
        if ($max === $rf) {
            $h = ($gf - $bf) / $d + ($gf < $bf ? 6.0 : 0.0);
        } elseif ($max === $gf) {
            $h = ($bf - $rf) / $d + 2.0;
        } else {
            $h = ($rf - $gf) / $d + 4.0;
        }
        $h /= 6.0;
    }

    return [
        'h' => (int)round($h * 360),
        's' => (int)round($s * 100),
        'l' => (int)round($l * 100)
    ];
}

function describeColorNamePhp(int $r, int $g, int $b): string {
    $hsl = rgbToHslPhp($r, $g, $b);
    $h = $hsl['h'];
    $s = $hsl['s'];
    $l = $hsl['l'];

    if ($l <= 14) return 'Derin Bazalt Siyahı';
    if ($l >= 88 && $s <= 18) return 'Lapa Lapa Saf Kar & Alabaster';
    if ($s <= 12) {
        if ($l < 38) return 'Koyu Kömür Grisi';
        if ($l < 68) return 'Pürüzsüz Beton Grisi';
        return 'Açık Kireçtaşı Grisi';
    }

    if ($h >= 345 || $h < 18) {
        return $s > 50 ? 'Tapınak Vernik Kırmızısı (Vermilion)' : 'Kızıl Toprak & Kiremit';
    }
    if ($h >= 18 && $h < 45) {
        return $s > 50 ? 'Ateş Turuncusu & Kehribar' : 'Sıcak Ham Ahşap & Sepya';
    }
    if ($h >= 45 && $h < 70) {
        return $s > 50 ? 'Antika Varak Altın & Oksit' : 'Washi Parşömen Sarısı';
    }
    if ($h >= 70 && $h < 160) {
        return $s > 35 ? 'Karlar Altında Çam Yeşili' : 'Doğal Yosun & Adaçayı';
    }
    if ($h >= 160 && $h < 200) {
        return $s > 40 ? 'Turkuaz Mineral & Buzul Grisi' : 'Soluk Sis Mavisi';
    }
    if ($h >= 200 && $h < 255) {
        return $s > 40 ? 'Hakiki Prusya Mavisi & Kobalt' : 'Kış Gecesi Çivit Grisi';
    }
    if ($h >= 255 && $h < 320) {
        return 'Mor Menekşe & Ametist';
    }
    return 'Gül Kurusu & Karmin';
}

function computeHarmonyPhp(array $palette, int $avgLuminance = 135): array {
    $hslList = [];
    foreach ($palette as $c) {
        if (!empty($c['rgb']) && count($c['rgb']) === 3) {
            [$r, $g, $b] = $c['rgb'];
        } else {
            $clean = ltrim($c['hex'] ?? '#CCCCCC', '#');
            $r = hexdec(substr($clean, 0, 2) ?: 'CC');
            $g = hexdec(substr($clean, 2, 2) ?: 'CC');
            $b = hexdec(substr($clean, 4, 2) ?: 'CC');
        }
        $hslList[] = rgbToHslPhp((int)$r, (int)$g, (int)$b);
    }

    $count = max(1, count($hslList));
    $avgSat = array_sum(array_column($hslList, 's')) / $count;
    $hues = array_column($hslList, 'h');
    $minHue = !empty($hues) ? min($hues) : 0;
    $maxHue = !empty($hues) ? max($hues) : 0;
    $hueSpread = $maxHue - $minHue;

    if ($avgSat <= 16) {
        $harmonyType = 'Monokromatik Yüksek Kontrast Noir / Chiaroscuro';
        $moodDesc = 'Dramatik gölge geçişleri, gümüş gren ve ışık-karanlık geriliminin şiirsel ifadesi.';
    } elseif ($hueSpread <= 45) {
        $harmonyType = 'Analog / Benzeşik Tonal Denge';
        $moodDesc = 'Renk skalasında birbirine komşu yumuşak geçişler, dingin ve gözü yormayan görsel ritim.';
    } elseif ($hueSpread >= 140 && $hueSpread <= 220) {
        $harmonyType = 'Tamamlayıcı (Komplementer) Zıtlık';
        $moodDesc = 'Karşıt renk kutuplarının yarattığı yüksek enerjili görsel odak ve optik canlılık.';
    } else {
        $harmonyType = 'Doğal Mineral & Organik Denge';
        $moodDesc = 'Klasik müze ve güzel sanatlar paletlerinde rastlanan zengin mineral tonların diyaloğu.';
    }

    return [
        'palette' => $palette,
        'harmonyType' => $harmonyType,
        'moodDescription' => $moodDesc,
        'averageLuminance' => $avgLuminance,
        'luminancePercent' => (int)round(($avgLuminance / 255) * 100)
    ];
}

/**
 * PHP GD kütüphanesi ile görseli yeniden boyutlandırır, sağ altına NEVAART filigranı basar
 * ve piksellerini tarayarak 5 baskın rengi çıkarır (Kriter L & Kriter M).
 */
function processImageWithPhpGd(string $rawImageBinary, string $uploadDir): ?array {
    if (!extension_loaded('gd') || !function_exists('imagecreatefromstring')) {
        return null;
    }

    $srcImg = @imagecreatefromstring($rawImageBinary);
    if (!$srcImg) {
        return null;
    }

    $origW = imagesx($srcImg);
    $origH = imagesy($srcImg);
    $maxDim = 1200;
    $newW = $origW;
    $newH = $origH;

    if ($newW > $maxDim) {
        $newH = (int)round(($origH / $origW) * $maxDim);
        $newW = $maxDim;
    }

    // 1. Yeniden boyutlandırma (Resampling)
    $canvas = imagecreatetruecolor($newW, $newH);
    imagecopyresampled($canvas, $srcImg, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

    // 2. PHP GD Filigran (Watermark) Uygulaması: "NEVAART · CURATED ARCHIVE · 2026"
    $watermarkText = 'NEVAART - CURATED ARCHIVE - 2026';
    $font = 4; // GD yerleşik font
    $textWidth = imagefontwidth($font) * strlen($watermarkText);
    $textHeight = imagefontheight($font);

    $posX = max(10, $newW - $textWidth - 28);
    $posY = max(10, $newH - $textHeight - 18);

    $bgBox = imagecolorallocatealpha($canvas, 28, 25, 23, 35);
    imagefilledrectangle($canvas, $posX - 10, $posY - 6, $posX + $textWidth + 10, $posY + $textHeight + 6, $bgBox);

    $white = imagecolorallocate($canvas, 250, 248, 245);
    imagestring($canvas, $font, $posX, $posY, $watermarkText, $white);

    // 3. 64x64 Küçültülmüş Örneklem Üzerinden Gerçek Piksel Renk Analizi (imagecolorat)
    $sampleSize = 64;
    $sampleImg = imagecreatetruecolor($sampleSize, $sampleSize);
    imagecopyresampled($sampleImg, $srcImg, 0, 0, 0, 0, $sampleSize, $sampleSize, $origW, $origH);

    $bins = [];
    $totalLuminance = 0.0;
    $totalPixels = $sampleSize * $sampleSize;

    for ($y = 0; $y < $sampleSize; $y++) {
        for ($x = 0; $x < $sampleSize; $x++) {
            $rgbIndex = imagecolorat($sampleImg, $x, $y);
            $r = ($rgbIndex >> 16) & 0xFF;
            $g = ($rgbIndex >> 8) & 0xFF;
            $b = $rgbIndex & 0xFF;

            $totalLuminance += (0.299 * $r + 0.587 * $g + 0.114 * $b);

            $qR = (int)floor($r / 28) * 28;
            $qG = (int)floor($g / 28) * 28;
            $qB = (int)floor($b / 28) * 28;
            $key = "$qR,$qG,$qB";

            if (!isset($bins[$key])) {
                $bins[$key] = ['count' => 0, 'rSum' => 0, 'gSum' => 0, 'bSum' => 0];
            }
            $bins[$key]['count']++;
            $bins[$key]['rSum'] += $r;
            $bins[$key]['gSum'] += $g;
            $bins[$key]['bSum'] += $b;
        }
    }

    $candidates = [];
    foreach ($bins as $cluster) {
        $c = $cluster['count'];
        $r = (int)round($cluster['rSum'] / $c);
        $g = (int)round($cluster['gSum'] / $c);
        $b = (int)round($cluster['bSum'] / $c);
        $hsl = rgbToHslPhp($r, $g, $b);
        $chromaBonus = 1.0 + ($hsl['s'] / 100.0) * 1.6;
        $candidates[] = [
            'r' => $r, 'g' => $g, 'b' => $b,
            'count' => $c,
            'score' => $c * $chromaBonus
        ];
    }

    usort($candidates, fn($a, $b) => $b['score'] <=> $a['score']);

    $selected = [];
    foreach ([70, 50, 35, 20, 0] as $threshold) {
        foreach ($candidates as $cand) {
            if (count($selected) >= 5) break;
            $distinct = true;
            foreach ($selected as $sel) {
                $dist = sqrt(pow($cand['r'] - $sel['r'], 2) + pow($cand['g'] - $sel['g'], 2) + pow($cand['b'] - $sel['b'], 2));
                if ($dist < $threshold) {
                    $distinct = false;
                    break;
                }
            }
            if ($distinct) {
                $selected[] = $cand;
            }
        }
        if (count($selected) >= 5) break;
    }

    $palette = [];
    foreach (array_slice($selected, 0, 5) as $idx => $cl) {
        $pct = max(8, (int)round(($cl['count'] / $totalPixels) * 100));
        $palette[] = [
            'hex' => rgbToHexPhp($cl['r'], $cl['g'], $cl['b']),
            'percentage' => $pct,
            'name' => describeColorNamePhp($cl['r'], $cl['g'], $cl['b']),
            'rgb' => [$cl['r'], $cl['g'], $cl['b']],
            'isDominant' => $idx === 0
        ];
    }

    $totalPct = array_sum(array_column($palette, 'percentage')) ?: 1;
    foreach ($palette as &$sw) {
        $sw['percentage'] = (int)round(($sw['percentage'] / $totalPct) * 100);
    }
    unset($sw);

    // 4. Filigranlı görseli diske kaydet
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }
    $filename = 'nevaart_gd_' . time() . '_' . random_int(100, 999) . '.jpg';
    $filePath = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $filename;
    imagejpeg($canvas, $filePath, 88);

    imagedestroy($srcImg);
    imagedestroy($canvas);
    imagedestroy($sampleImg);

    $avgLum = (int)round($totalLuminance / $totalPixels);
    $harmony = computeHarmonyPhp($palette, $avgLum);

    return [
        'imageUrl' => 'assets/uploads/' . $filename,
        'dimensions' => round($newW * 0.08) . ' × ' . round($newH * 0.08) . " cm ({$newW} × {$newH} px)",
        'palette' => $harmony['palette'],
        'harmonyType' => $harmony['harmonyType'],
        'moodDescription' => $harmony['moodDescription'],
        'averageLuminance' => $avgLum
    ];
}

