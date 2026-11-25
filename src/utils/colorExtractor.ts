import { ColorSwatch, ColorAnalysisResult } from '../types';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

// Convert RGB to HEX string
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Name colors accurately based on HSL values
export function describeColorName(r: number, g: number, b: number): string {
  const { h, s, l } = rgbToHsl(r, g, b);

  if (l <= 14) return 'Derin Bazalt Siyahı';
  if (l >= 88 && s <= 18) return 'Lapa Lapa Saf Kar & Alabaster';
  if (s <= 12) {
    if (l < 38) return 'Koyu Kömür Grisi';
    if (l < 68) return 'Pürüzsüz Beton Grisi';
    return 'Açık Kireçtaşı Grisi';
  }

  // Hue based naming with art-historical pigments
  if (h >= 345 || h < 18) {
    return s > 50 ? 'Tapınak Vernik Kırmızısı (Vermilion)' : 'Kızıl Toprak & Kiremit';
  }
  if (h >= 18 && h < 45) {
    return s > 50 ? 'Ateş Turuncusu & Kehribar' : 'Sıcak Ham Ahşap & Sepya';
  }
  if (h >= 45 && h < 70) {
    return s > 50 ? 'Antika Varak Altın & Oksit' : 'Washi Parşömen Sarısı';
  }
  if (h >= 70 && h < 160) {
    return s > 35 ? 'Karlar Altında Çam Yeşili' : 'Doğal Yosun & Adaçayı';
  }
  if (h >= 160 && h < 200) {
    return s > 40 ? 'Turkuaz Mineral & Buzul Grisi' : 'Soluk Sis Mavisi';
  }
  if (h >= 200 && h < 255) {
    return s > 40 ? 'Hakiki Prusya Mavisi & Kobalt' : 'Kış Gecesi Çivit Grisi';
  }
  if (h >= 255 && h < 320) {
    return 'Mor Menekşe & Ametist';
  }
  return 'Gül Kurusu & Karmin';
}

/**
 * Extracts true pixel colors from an image using off-screen HTML5 Canvas
 */
export async function extractColorsFromImage(
  imageSource: string | HTMLImageElement,
  fallbackPalette?: ColorSwatch[]
): Promise<ColorAnalysisResult> {
  return new Promise((resolve) => {
    let img: HTMLImageElement;

    if (typeof imageSource === 'string') {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSource;
    } else {
      img = imageSource;
    }

    const process = () => {
      try {
        const sampleSize = 64;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) throw new Error('No 2D context');

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        const totalPixels = sampleSize * sampleSize;

        // Group colors with color quantization
        const bins: { [key: string]: { count: number; rSum: number; gSum: number; bSum: number } } = {};
        let totalLuminance = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue; // Skip transparency

          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;

          // 24-step color binning for smooth clusters
          const qR = Math.floor(r / 28) * 28;
          const qG = Math.floor(g / 28) * 28;
          const qB = Math.floor(b / 28) * 28;
          const key = `${qR},${qG},${qB}`;

          if (!bins[key]) {
            bins[key] = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
          }
          bins[key].count++;
          bins[key].rSum += r;
          bins[key].gSum += g;
          bins[key].bSum += b;
        }

        // Convert bins to candidate clusters with chroma awareness
        interface CandidateCluster {
          r: number;
          g: number;
          b: number;
          count: number;
          score: number;
        }

        const candidateList: CandidateCluster[] = Object.values(bins).map((cluster) => {
          const r = Math.round(cluster.rSum / cluster.count);
          const g = Math.round(cluster.gSum / cluster.count);
          const b = Math.round(cluster.bSum / cluster.count);
          const { s } = rgbToHsl(r, g, b);

          // Boost colorful / vibrant accent pigments (reds, oranges, warm wood, snow)
          // so vital artistic accents aren't drowned out by massive monochromatic backgrounds
          const chromaBonus = 1 + (s / 100) * 1.6;
          const score = cluster.count * chromaBonus;

          return { r, g, b, count: cluster.count, score };
        });

        // Sort candidates by visual prominence score
        candidateList.sort((a, b) => b.score - a.score);

        // Euclidean color distance in RGB space
        const colorDistance = (
          c1: { r: number; g: number; b: number },
          c2: { r: number; g: number; b: number }
        ) => {
          const dr = c1.r - c2.r;
          const dg = c1.g - c2.g;
          const db = c1.b - c2.b;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        // Select 5 distinct color swatches ensuring color diversity (no duplicate blue shades)
        const selectedClusters: CandidateCluster[] = [];
        const distanceThresholds = [70, 50, 35, 20, 0];

        for (const threshold of distanceThresholds) {
          for (const cand of candidateList) {
            if (selectedClusters.length >= 5) break;

            const isDistinct = selectedClusters.every(
              (sel) => colorDistance(cand, sel) >= threshold
            );

            if (isDistinct) {
              selectedClusters.push(cand);
            }
          }
          if (selectedClusters.length >= 5) break;
        }

        const palette: ColorSwatch[] = selectedClusters.slice(0, 5).map((cluster, idx) => {
          const percentage = Math.max(8, Math.round((cluster.count / totalPixels) * 100));

          return {
            hex: rgbToHex(cluster.r, cluster.g, cluster.b),
            percentage,
            name: describeColorName(cluster.r, cluster.g, cluster.b),
            rgb: [cluster.r, cluster.g, cluster.b],
            isDominant: idx === 0,
          };
        });

        // Normalize percentages to sum to 100
        const totalPct = palette.reduce((acc, c) => acc + c.percentage, 0);
        if (totalPct > 0) {
          palette.forEach((c) => {
            c.percentage = Math.round((c.percentage / totalPct) * 100);
          });
        }

        const avgLum = Math.round(totalLuminance / totalPixels);
        const analysis = computeHarmony(palette, avgLum, true);
        resolve(analysis);
      } catch (err) {
        // In case of CORS or canvas security block, use verified curated fallback
        if (fallbackPalette && fallbackPalette.length > 0) {
          resolve(computeHarmony(fallbackPalette, 128, false));
        } else {
          resolve(getDefaultAnalysis());
        }
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      process();
    } else {
      img.onload = () => process();
      img.onerror = () => {
        if (fallbackPalette && fallbackPalette.length > 0) {
          resolve(computeHarmony(fallbackPalette, 128, false));
        } else {
          resolve(getDefaultAnalysis());
        }
      };
    }
  });
}

function computeHarmony(palette: ColorSwatch[], avgLuminance: number, fromPixels: boolean): ColorAnalysisResult {
  const hslList = palette.map((c) => {
    let r = 200, g = 200, b = 200;
    if (c.rgb) {
      [r, g, b] = c.rgb;
    } else {
      // Parse hex
      const clean = c.hex.replace('#', '');
      r = parseInt(clean.substring(0, 2), 16) || 200;
      g = parseInt(clean.substring(2, 4), 16) || 200;
      b = parseInt(clean.substring(4, 6), 16) || 200;
    }
    return rgbToHsl(r, g, b);
  });

  const avgSaturation = hslList.reduce((acc, c) => acc + c.s, 0) / hslList.length;
  const hues = hslList.map((c) => c.h);
  const minHue = Math.min(...hues);
  const maxHue = Math.max(...hues);
  const hueSpread = maxHue - minHue;

  let harmonyType = 'Dengeli Polikromatik Armoni';
  let moodDescription = 'Görsel öğeler arasında doğal bir ton dengesi ve mekansal derinlik.';
  let warmthIndex: 'Warm' | 'Cool' | 'Neutral' | 'High-Contrast' = 'Neutral';

  if (avgSaturation <= 16) {
    harmonyType = 'Monokromatik Yüksek Kontrast Noir / Chiaroscuro';
    moodDescription = 'Dramatik gölge geçişleri, gümüş gren ve ışık-karanlık geriliminin şiirsel ifadesi.';
    warmthIndex = 'High-Contrast';
  } else if (hueSpread <= 45) {
    harmonyType = 'Analog / Benzeşik Tonal Denge';
    moodDescription = 'Renk skalasında birbirine komşu yumuşak geçişler, dingin ve gözü yormayan görsel ritim.';
    warmthIndex = minHue >= 10 && maxHue <= 70 ? 'Warm' : 'Cool';
  } else if (hueSpread >= 140 && hueSpread <= 220) {
    harmonyType = 'Tamamlayıcı (Komplementer) Zıtlık';
    moodDescription = 'Karşıt renk kutuplarının yarattığı yüksek enerjili görsel odak ve optik canlılık.';
    warmthIndex = 'High-Contrast';
  } else {
    harmonyType = 'Doğal Mineral & Organik Denge';
    moodDescription = 'Klasik müze ve güzel sanatlar paletlerinde rastlanan zengin mineral tonların diyaloğu.';
    warmthIndex = avgLuminance > 140 ? 'Warm' : 'Cool';
  }

  return {
    palette,
    harmonyType,
    moodDescription,
    warmthIndex,
    averageLuminance: avgLuminance,
    extractedFromPixels: fromPixels,
  };
}

function getDefaultAnalysis(): ColorAnalysisResult {
  return {
    palette: [
      { hex: '#F7F4EE', percentage: 40, name: 'Sıcak Alabaster', rgb: [247, 244, 238] },
      { hex: '#DFD8CC', percentage: 25, name: 'Kireçtaşı Grisi', rgb: [223, 216, 204] },
      { hex: '#1C3144', percentage: 15, name: 'Lapis Lazuli', rgb: [28, 49, 68] },
      { hex: '#8C8A85', percentage: 12, name: 'Brütalist Beton', rgb: [140, 138, 133] },
      { hex: '#1C1917', percentage: 8, name: 'Kömür Siyahı', rgb: [28, 25, 23] },
    ],
    harmonyType: 'Klasik Arşiv Paleti',
    moodDescription: 'Müze koleksiyonu standartlarında doğal alabaster ve mineral taş harmonisi.',
    warmthIndex: 'Warm',
    averageLuminance: 145,
    extractedFromPixels: false,
  };
}
