import type { ExtractedPalette } from '../types/loader';

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function colorSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export async function extractPaletteFromImage(
  src: string,
  fallback: ExtractedPalette
): Promise<ExtractedPalette> {
  if (!src || src.startsWith('vector:')) {
    return fallback;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(fallback);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const buckets = new Map<
          string,
          { r: number; g: number; b: number; count: number; score: number }
        >();

        let totalLum = 0;
        let opaquePixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 120) continue;

          const lum = luminance(r, g, b);
          totalLum += lum;
          opaquePixels++;

          // Quantize into 24-step color buckets
          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;

          const sat = colorSaturation(r, g, b);
          // Favor vibrant mid-tone pixels for accent extraction
          const midBonus = 1 - Math.abs(lum - 0.52);
          const pixelScore = 0.25 + sat * 2.4 + midBonus * 0.6;

          const existing = buckets.get(key);
          if (existing) {
            existing.r += r;
            existing.g += g;
            existing.b += b;
            existing.count += 1;
            existing.score += pixelScore;
          } else {
            buckets.set(key, { r, g, b, count: 1, score: pixelScore });
          }
        }

        if (buckets.size === 0 || opaquePixels === 0) {
          resolve(fallback);
          return;
        }

        const sorted = Array.from(buckets.values()).sort((a, b) => b.score - a.score);
        const top = sorted[0];
        const second = sorted.find((c) => {
          const dr = c.r / c.count - top.r / top.count;
          const dg = c.g / c.count - top.g / top.count;
          const db = c.b / c.count - top.b / top.count;
          return Math.sqrt(dr * dr + dg * dg + db * db) > 48;
        }) ?? top;

        const pr = top.r / top.count;
        const pg = top.g / top.count;
        const pb = top.b / top.count;

        const sr = second.r / second.count;
        const sg = second.g / second.count;
        const sb = second.b / second.count;

        const avgLum = totalLum / opaquePixels;

        resolve({
          primary: rgbToHex(pr, pg, pb),
          secondary: rgbToHex(sr, sg, sb),
          glow: `rgba(${Math.round(pr)}, ${Math.round(pg)}, ${Math.round(pb)}, 0.42)`,
          contrastText: avgLum > 0.58 ? 'dark' : 'light',
        });
      } catch {
        resolve(fallback);
      }
    };

    img.onerror = () => resolve(fallback);
    img.src = src;
  });
}
