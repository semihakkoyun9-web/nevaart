import { Artwork, ColorSwatch } from '../types';

export interface ColorFamilyDef {
  id: string;
  nameTr: string;
  nameEn: string;
  dot: string;
  targetRgb: [number, number, number];
}

export const COLOR_FAMILIES: ColorFamilyDef[] = [
  { id: 'all',   nameTr: 'Tüm Spektrum',       nameEn: 'All Spectrum',        dot: '#D6CEBE', targetRgb: [180, 175, 165] },
  { id: 'blue',  nameTr: 'Prusya & Kobalt',    nameEn: 'Prussian & Cobalt',   dot: '#204E8A', targetRgb: [32, 78, 138] },
  { id: 'red',   nameTr: 'Vermilion & Kızıl',  nameEn: 'Vermilion & Crimson', dot: '#AF3026', targetRgb: [175, 48, 38] },
  { id: 'gold',  nameTr: 'Altın & Okre Sarı',  nameEn: 'Gold & Ochre',        dot: '#D4A53A', targetRgb: [212, 165, 58] },
  { id: 'green', nameTr: 'Zümrüt & Doğa',      nameEn: 'Emerald & Nature',    dot: '#3A7044', targetRgb: [58, 112, 68] },
  { id: 'earth', nameTr: 'Toprak & Sienna',    nameEn: 'Earth & Sienna',      dot: '#7A4E30', targetRgb: [122, 78, 48] },
  { id: 'dark',  nameTr: 'Kömür & Chiaroscuro',nameEn: 'Charcoal & Noir',     dot: '#181818', targetRgb: [24, 24, 24] },
  { id: 'light', nameTr: 'Alabaster & Işık',   nameEn: 'Alabaster & Light',   dot: '#EAE6DE', targetRgb: [234, 230, 222] },
];

export function hexToRgb(hex: string): [number, number, number] {
  const clean = (hex || '#000000').replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rf) h = (gf - bf) / d + (gf < bf ? 6 : 0);
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function swatchMatchWeight(swatch: ColorSwatch, familyId: string, customHex?: string): number {
  const [r, g, b] = swatch.rgb || hexToRgb(swatch.hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  if (familyId === 'custom' && customHex) {
    const [tr, tg, tb] = hexToRgb(customHex);
    const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
    // Max meaningful distance = 145
    return Math.max(0, 1 - dist / 145);
  }

  switch (familyId) {
    case 'blue': {
      // Hue 185-260 with noticeable saturation, or b clearly dominating r
      if (h >= 185 && h <= 265 && s >= 14 && l >= 10 && l <= 85) {
        const satBoost = Math.min(1, s / 40);
        return 0.55 + 0.45 * satBoost;
      }
      if (b > r + 18 && b > g + 5) return 0.5;
      return 0;
    }
    case 'red': {
      if ((h <= 22 || h >= 335) && s >= 22 && l >= 12 && l <= 75 && r > g + 22) {
        return 0.6 + 0.4 * Math.min(1, s / 50);
      }
      return 0;
    }
    case 'gold': {
      if (h >= 30 && h <= 66 && s >= 24 && l >= 28 && l <= 82) {
        return 0.6 + 0.4 * Math.min(1, s / 50);
      }
      return 0;
    }
    case 'green': {
      if (h >= 68 && h <= 172 && s >= 14 && l >= 12 && l <= 78) {
        return 0.6 + 0.4 * Math.min(1, s / 45);
      }
      return 0;
    }
    case 'earth': {
      if (h >= 15 && h <= 45 && s >= 14 && s <= 65 && l >= 16 && l <= 55) {
        return 0.65 + 0.35 * (1 - Math.abs(l - 34) / 30);
      }
      return 0;
    }
    case 'dark': {
      if (l <= 26) return 0.6 + 0.4 * (1 - l / 26);
      return 0;
    }
    case 'light': {
      if (l >= 68) return 0.55 + 0.45 * Math.min(1, (l - 68) / 28);
      return 0;
    }
    default:
      return 1;
  }
}

/**
 * Computes the real percentage density (0..100) of a selected color family or custom HEX in an artwork.
 */
export function computeArtworkColorDensity(
  artwork: Artwork,
  familyId: string,
  customHex?: string
): number {
  if (familyId === 'all') return 100;
  let score = 0;
  for (const sw of artwork.colorPalette) {
    const w = swatchMatchWeight(sw, familyId, customHex);
    if (w > 0) {
      score += sw.percentage * w;
    }
  }
  return Math.min(100, Math.round(score));
}
