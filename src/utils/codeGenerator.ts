import type { ExtractedPalette, LoaderConfig } from '../types/loader';

export type ExportFormat = 'react' | 'html';

const RADIUS_MAP: Record<LoaderConfig['maskShape'], string> = {
  circle: '9999px',
  squircle: '28%',
  rounded: '18px',
  freeform: '0px',
};

const BG_MAP: Record<LoaderConfig['backdropMode'], string> = {
  obsidian: '#090A0E',
  alabaster: '#F5F4EF',
  slate: '#121620',
  adaptive: '#0B0D14',
};

export async function imageUrlToDataUrl(src: string): Promise<string | null> {
  if (!src || src.startsWith('vector:')) return null;
  if (src.startsWith('data:')) return src;

  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        typeof reader.result === 'string' ? resolve(reader.result) : reject();
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function getInlineSvgMarkup(config: LoaderConfig, palette: ExtractedPalette): string | null {
  if (config.presetKind === 'ribbon-s') {
    return `<svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="120" height="120" rx="28" fill="#1F1F25" />
      <path d="M 75 34 C 75 20, 42 20, 42 38 C 42 54, 78 58, 78 78 C 78 96, 45 96, 45 82" stroke="#67E8F9" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M 68 38 C 68 27, 49 27, 49 41 C 49 53, 71 57, 71 75 C 71 89, 52 89, 52 78" stroke="#A78BFA" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M 61 42 C 61 34, 56 34, 56 44 C 56 52, 64 56, 64 72 C 64 82, 59 82, 59 74" stroke="#F472B6" strokeWidth="4.4" strokeLinecap="round" />
    </svg>`;
  }

  if (config.presetKind === 'vector') {
    return `<svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="120" height="120" rx="30" fill="#10131C" />
      <path d="M34 84V36C34 33.7909 35.7909 32 38 32H46C48.2091 32 50 33.7909 50 36V72H82C84.2091 72 86 73.7909 86 76V84C86 86.2091 84.2091 88 82 88H38C35.7909 88 34 86.2091 34 84Z" fill="${palette.secondary}" />
      <circle cx="74" cy="46" r="14" fill="${palette.primary}" />
      <circle cx="74" cy="46" r="6" fill="#10131C" />
    </svg>`;
  }

  return null;
}

function getMotionAnimateSnippet(config: LoaderConfig): string {
  const amp = config.intensity;
  switch (config.motionStyle) {
    case 'ribbon':
      return `{ scale: [1, 0.28, 0.28, 1.04, 1], rotate: [0, -85, 95, -4, 0], opacity: [1, 0.08, 0.08, 1, 1] }`;
    case 'glue':
      return `{ scale: [0.36, 1.06, 1, 1, 0.36], rotate: [${Math.round(-160 * amp)}, 8, 0, 0, ${Math.round(140 * amp)}], opacity: [0.1, 1, 1, 1, 0.1] }`;
    case 'cardiac':
      return `{ scale: [1, ${(1 + 0.085 * amp).toFixed(2)}, 0.985, ${(1 + 0.055 * amp).toFixed(2)}, 1] }`;
    case 'specular':
      return `{ rotateY: [-6, 6, -6], rotateX: [4, -4, 4], scale: [1, 1.03, 1] }`;
    case 'levitate':
      return `{ y: [0, ${(-12 * amp).toFixed(0)}, 0], rotate: [-1.5, 1.5, -1.5] }`;
    case 'elastic':
      return `{ scaleX: [1, ${(1 + 0.11 * amp).toFixed(2)}, ${(1 - 0.08 * amp).toFixed(2)}, 1], scaleY: [1, ${(1 - 0.1 * amp).toFixed(2)}, ${(1 + 0.11 * amp).toFixed(2)}, 1] }`;
    case 'aperture':
      return `{ scale: [0.95, 1.03, 0.95], filter: ['blur(2.5px)', 'blur(0px)', 'blur(2.5px)'] }`;
    case 'echo':
      return `{ scale: [0.97, ${(1 + 0.04 * amp).toFixed(2)}, 0.97], opacity: [0.92, 1, 0.92] }`;
  }
}

export function generateReactLoaderSnippet(
  config: LoaderConfig,
  palette: ExtractedPalette,
  embeddedDataUrl?: string | null
): string {
  const radius = RADIUS_MAP[config.maskShape];
  const bg = BG_MAP[config.backdropMode];
  const textColor = config.backdropMode === 'alabaster' ? '#18181B' : '#F4F4F5';
  const duration = (3.4 / config.speed).toFixed(2);
  const amp = config.intensity;
  const inlineSvg = getInlineSvgMarkup(config, palette);

  const resolvedLogoDefault = inlineSvg
    ? ''
    : embeddedDataUrl
      ? embeddedDataUrl
      : '/your-logo.png';

  const glueLayer =
    config.motionStyle === 'glue'
      ? `
        {/* Liquid Glue Metaball Layer */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="looma-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7.5" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: ${duration}, repeat: Infinity, ease: [0.55, 0.05, 0.45, 0.95] }}
          style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', filter: 'url(#looma-goo)', pointerEvents: 'none' }}
        >
          <motion.div
            animate={{ scale: [0.68, 1.15, 0.92, 0.68] }}
            transition={{ duration: ${duration}, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 92, height: 92, borderRadius: '9999px', backgroundColor: '${palette.primary}' }}
          />
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const tx = Math.round(Math.cos(rad) * ${Math.round(68 * amp)});
            const ty = Math.round(Math.sin(rad) * ${Math.round(68 * amp)});
            return (
              <motion.div
                key={angle}
                animate={{ x: [tx, 0, 0, tx], y: [ty, 0, 0, ty], scale: [1, 0.65, 0.65, 1] }}
                transition={{ duration: ${duration}, times: [0, 0.36, 0.76, 1], repeat: Infinity, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ position: 'absolute', width: i % 2 === 0 ? 40 : 30, height: i % 2 === 0 ? 40 : 30, borderRadius: '9999px', backgroundColor: i % 2 === 0 ? '${palette.primary}' : '${palette.secondary}' }}
              />
            );
          })}
        </motion.div>`
      : '';

  const ribbonLayer =
    config.motionStyle === 'ribbon' && !inlineSvg
      ? `
        {/* Orbiting Ribbon Beads */}
        <motion.div
          animate={{ rotate: [0, -180, -360], scale: [0.7, 1.05, 0.7], opacity: [0, 1, 1, 0] }}
          transition={{ duration: ${duration}, times: [0, 0.32, 0.62, 1], repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}
        >
          {[-1, 1].map((dir) => (
            <div key={dir} style={{ position: 'absolute', display: 'flex', gap: 6, transform: \`translateY(\${dir * 34}px)\` }}>
              {['${palette.primary}', '#A78BFA', '${palette.secondary}'].map((c, idx) => (
                <span key={idx} style={{ width: 9, height: 9, borderRadius: '9999px', backgroundColor: c, boxShadow: \`0 0 12px \${c}\` }} />
              ))}
            </div>
          ))}
        </motion.div>`
      : '';

  const cardiacLayer =
    config.motionStyle === 'cardiac'
      ? `
        {[0, 1].map((idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.85, opacity: 0.55 }}
            animate={{ scale: ${(1.55 + 0.15 * amp).toFixed(2)}, opacity: 0 }}
            transition={{ duration: ${(2.4 / config.speed).toFixed(2)}, repeat: Infinity, delay: idx * ${(0.6 / config.speed).toFixed(2)} }}
            style={{ position: 'absolute', width: 120, height: 120, borderRadius: '${radius === '0px' ? '9999px' : radius}', border: '1.5px solid ${palette.primary}', pointerEvents: 'none' }}
          />
        ))}`
      : '';

  const progressMarkup =
    config.progressStyle === 'bar'
      ? `
        <div style={{ marginTop: 16, width: 192, height: 6, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
          <motion.div animate={{ width: \`\${progress}%\` }} style={{ height: '100%', backgroundColor: '${palette.primary}', borderRadius: 9999 }} />
        </div>`
      : config.progressStyle === 'dots'
        ? `
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [0.75, 1.35, 0.75], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: ${(1.1 / config.speed).toFixed(2)}, repeat: Infinity, delay: i * 0.18 }}
              style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: '${palette.primary}' }}
            />
          ))}
        </div>`
        : '';

  const mediaElement = inlineSvg
    ? inlineSvg
    : `<img src={logoSrc} alt={appName} style={{ width: '100%', height: '100%', objectFit: '${config.maskShape === 'freeform' ? 'contain' : 'cover'}' }} />`;

  const propsSignature = inlineSvg
    ? `export function AliveAppLoader({
  appName = '${config.appName.replace(/'/g, "\\'")}',
  statusText = '${config.loadingPhrase.replace(/'/g, "\\'")}',
  progress = 68,
}: { appName?: string; statusText?: string; progress?: number })`
    : `const DEFAULT_LOGO = '${resolvedLogoDefault}';

export function AliveAppLoader({
  logoSrc = DEFAULT_LOGO,
  appName = '${config.appName.replace(/'/g, "\\'")}',
  statusText = '${config.loadingPhrase.replace(/'/g, "\\'")}',
  progress = 68,
}: { logoSrc?: string; appName?: string; statusText?: string; progress?: number })`;

  return `import React from 'react';
import { motion } from 'motion/react';

${propsSignature} {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '${bg}',
        backgroundImage: 'radial-gradient(circle at 50% 44%, ${palette.glow} 0%, transparent 64%)',
        color: '${textColor}',
      }}
    >
      <div style={{ position: 'relative', width: 210, height: 210, display: 'grid', placeItems: 'center' }}>
        <motion.div
          animate={{ scale: [0.92, 1.2, 0.92], opacity: [0.28, 0.62, 0.28] }}
          transition={{ duration: ${duration}, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: '9999px',
            background: 'radial-gradient(circle, ${palette.glow} 0%, transparent 70%)',
            filter: 'blur(22px)',
            pointerEvents: 'none',
          }}
        />${glueLayer}${ribbonLayer}${cardiacLayer}

        <motion.div
          animate={${getMotionAnimateSnippet(config)}}
          transition={{ duration: ${duration}, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            width: 124,
            height: 124,
            borderRadius: '${radius}',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -14px rgba(0,0,0,0.6)',
          }}
        >
          ${mediaElement}
        </motion.div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{appName}</p>
        <p style={{ fontSize: 13, opacity: 0.68, marginTop: 6 }}>
          {statusText}${config.showPercentage ? ' · {Math.round(progress)}%' : ''}
        </p>${progressMarkup}
      </div>
    </div>
  );
}`;
}

export function generateHtmlCssSnippet(
  config: LoaderConfig,
  palette: ExtractedPalette,
  embeddedDataUrl?: string | null
): string {
  const radius = RADIUS_MAP[config.maskShape];
  const bg = BG_MAP[config.backdropMode];
  const textColor = config.backdropMode === 'alabaster' ? '#18181B' : '#F4F4F5';
  const duration = (3.4 / config.speed).toFixed(2);
  const imgSrc =
    config.presetKind === 'ribbon-s' || config.presetKind === 'vector'
      ? null
      : embeddedDataUrl || '/your-logo.png';

  const mediaHtml =
    config.presetKind === 'ribbon-s'
      ? `<svg viewBox="0 0 120 120" width="100%" height="100%" fill="none">
          <rect width="120" height="120" rx="28" fill="#1F1F25" />
          <path class="strand" d="M 75 34 C 75 20, 42 20, 42 38 C 42 54, 78 58, 78 78 C 78 96, 45 96, 45 82" stroke="#67E8F9" stroke-width="4.4" stroke-linecap="round" />
          <path class="strand" d="M 68 38 C 68 27, 49 27, 49 41 C 49 53, 71 57, 71 75 C 71 89, 52 89, 52 78" stroke="#A78BFA" stroke-width="4.4" stroke-linecap="round" />
          <path class="strand" d="M 61 42 C 61 34, 56 34, 56 44 C 56 52, 64 56, 64 72 C 64 82, 59 82, 59 74" stroke="#F472B6" stroke-width="4.4" stroke-linecap="round" />
        </svg>`
      : config.presetKind === 'vector'
        ? `<svg viewBox="0 0 120 120" width="100%" height="100%" fill="none">
            <rect width="120" height="120" rx="30" fill="#10131C" />
            <path d="M34 84V36C34 33.7909 35.7909 32 38 32H46C48.2091 32 50 33.7909 50 36V72H82C84.2091 72 86 73.7909 86 76V84C86 86.2091 84.2091 88 82 88H38C35.7909 88 34 86.2091 34 84Z" fill="${palette.secondary}" />
            <circle cx="74" cy="46" r="14" fill="${palette.primary}" />
          </svg>`
        : `<img src="${imgSrc}" alt="${config.appName}" />`;

  const animKeyframes =
    config.motionStyle === 'glue'
      ? `@keyframes alive-motion {
    0%, 100% { transform: scale(0.42) rotate(-140deg); opacity: 0.2; }
    38%, 74% { transform: scale(1) rotate(0deg); opacity: 1; }
  }`
      : config.motionStyle === 'ribbon'
        ? `@keyframes alive-motion {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
    30%, 55% { transform: scale(0.32) rotate(-95deg); opacity: 0.12; }
    82% { transform: scale(1.04) rotate(0deg); opacity: 1; }
  }`
        : `@keyframes alive-motion {
    0%, 100% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.06) translateY(-6px); }
  }`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${config.appName}</title>
<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 50% 44%, ${palette.glow} 0%, transparent 64%), ${bg};
    color: ${textColor};
    font-family: system-ui, -apple-system, sans-serif;
  }
  .loader-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .stage {
    position: relative;
    width: 210px;
    height: 210px;
    display: grid;
    place-items: center;
  }
  .aura {
    position: absolute;
    inset: 14px;
    border-radius: 9999px;
    background: radial-gradient(circle, ${palette.glow} 0%, transparent 70%);
    filter: blur(22px);
    animation: aura-pulse ${duration}s ease-in-out infinite;
  }
  .logo-box {
    position: relative;
    width: 124px;
    height: 124px;
    border-radius: ${radius};
    overflow: hidden;
    box-shadow: 0 24px 48px -14px rgba(0,0,0,0.6);
    animation: alive-motion ${duration}s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .logo-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .glue-orbit {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    filter: url(#looma-goo);
    animation: spin-glue ${duration}s ease-in-out infinite;
  }
  .glue-core {
    width: 88px;
    height: 88px;
    border-radius: 9999px;
    background: ${palette.primary};
  }
  .glue-drop {
    position: absolute;
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background: ${palette.secondary};
  }
  .d1 { transform: translate(56px, 0); }
  .d2 { transform: translate(-56px, 0); }
  .d3 { transform: translate(0, 56px); }
  .d4 { transform: translate(0, -56px); }
  .title { margin: 18px 0 4px; font-size: 18px; font-weight: 600; }
  .sub { margin: 0; font-size: 13px; opacity: 0.68; }
  @keyframes aura-pulse {
    0%, 100% { transform: scale(0.92); opacity: 0.35; }
    50% { transform: scale(1.18); opacity: 0.7; }
  }
  @keyframes spin-glue {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  ${animKeyframes}
</style>
</head>
<body>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <filter id="looma-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7.5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
  <div class="loader-wrap">
    <div class="stage">
      <div class="aura"></div>
      ${
        config.motionStyle === 'glue'
          ? `<div class="glue-orbit"><div class="glue-core"></div><div class="glue-drop d1"></div><div class="glue-drop d2"></div><div class="glue-drop d3"></div><div class="glue-drop d4"></div></div>`
          : ''
      }
      <div class="logo-box">${mediaHtml}</div>
    </div>
    <p class="title">${config.appName}</p>
    <p class="sub">${config.loadingPhrase}</p>
  </div>
</body>
</html>`;
}

export function generateBuildPrompt(
  config: LoaderConfig,
  palette: ExtractedPalette
): string {
  const radiusDesc: Record<LoaderConfig['maskShape'], string> = {
    circle: 'a crisp circle (border-radius: 9999px)',
    squircle: 'an iOS-style squircle (border-radius: 28%)',
    rounded: 'a rounded square (border-radius: 18px)',
    freeform: 'its original uncropped transparent silhouette',
  };

  const backdropDesc: Record<LoaderConfig['backdropMode'], string> = {
    obsidian: 'deep obsidian (#090A0E)',
    alabaster: 'warm alabaster paper (#F5F4EF)',
    slate: 'dark slate (#121620)',
    adaptive: 'adaptive deep charcoal (#0B0D14)',
  };

  const progressDesc: Record<LoaderConfig['progressStyle'], string> = {
    ring: 'a circular SVG orbital progress ring around the logo that fills smoothly in ' + palette.primary,
    bar: 'a sleek 192px linear progress bar beneath the loading message filled with ' + palette.primary,
    dots: 'three harmonic breathing dots beneath the text pulsing in ' + palette.primary,
    none: 'no secondary progress bar or ring—let the logo animation carry the entire screen cleanly',
  };

  const cycleSec = (
    (config.motionStyle === 'ribbon' || config.motionStyle === 'glue' ? 3.5 : 2.6) /
    config.speed
  ).toFixed(2);
  const energyPct = Math.round(config.intensity * 100);

  const motionCommand: Record<LoaderConfig['motionStyle'], string> = {
    ribbon:
      config.presetKind === 'ribbon-s'
        ? `Animate the 3-strand intertwined "S" SVG ribbons (#67E8F9 cyan, #A78BFA violet, #F472B6 pink) inside a #1F1F25 dark tile: hold the full mark briefly, retract the stroke pathLengths down to two symmetric 3-dot clusters, rotate them 360deg smoothly around the center, and draw the strokes back out into the full glowing S-mark over a ${cycleSec}s loop.`
        : `Choreograph a Ribbon Orbit reveal: contract and spin the logo inward while 2 symmetric clusters of 3 glowing beads (${palette.primary}, #A78BFA, ${palette.secondary}) orbit around the center for half the cycle, then sweep back outward to unveil the crisp logo at 100% scale over a ${cycleSec}s loop.`,
    glue: `Build a Liquid Glue Spin & Reveal using an SVG metaball goo filter (feGaussianBlur stdDeviation 7.5 + feColorMatrix alpha contrast "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"). Rotate a central droplet (${palette.primary}) and 4 satellite blobs (${palette.primary} and ${palette.secondary}) at 360deg while pulling them radially outward and snapping them back together like thick glue. As the blobs fuse at the core, rotate and expand the picture/logo cleanly out of the center (${energyPct}% motion energy) over a ${cycleSec}s loop.`,
    cardiac: `Apply an organic dual-beat cardiac pulse ("lub-dub" asymmetric scale curve with ${energyPct}% energy) paired with two staggered concentric ripple rings in ${palette.primary} expanding outward and fading cleanly over a ${cycleSec}s loop.`,
    specular: `Apply a continuous 3D perspective micro-tilt (with interactive pointer magnetic parallax), a diagonal glossy light sheen sweeping across the logo surface, and a thin rotating orbital arc in ${palette.primary} over a ${cycleSec}s loop.`,
    levitate: `Float the logo smoothly on a sinusoidal vertical drift with a subtle tilt, pair it with an inversely scaling ground blur shadow underneath, and float 5 glowing micro-motes (${palette.primary} & ${palette.secondary}) around it over a ${cycleSec}s loop.`,
    elastic: `Animate the logo with volume-preserving elastic squash-and-stretch (scaleX/scaleY inverse bounce) and spring overshoot settle (${energyPct}% energy) over a ${cycleSec}s loop.`,
    aperture: `Create an optical lens focus pull transitioning from a soft 2.5px blur into razor-sharp clarity with subtle zoom, framed by a counter-rotating segmented shutter ring in ${palette.primary} over a ${cycleSec}s loop.`,
    echo: `Render two translucent, slightly blurred silhouette echo layers behind the logo that breathe outward in staggered harmonic phase while the primary logo pulses gently over a ${cycleSec}s loop.`,
  };

  const subjectLine =
    config.presetKind === 'ribbon-s'
      ? 'Use a custom 3-ribbon glowing "S" vector emblem inside a #1F1F25 squircle tile.'
      : config.presetKind === 'vector'
        ? `Use a clean geometric monogram emblem in ${palette.secondary} and ${palette.primary} on a #10131C tile.`
        : `Use the "${config.imageName}" picture/logo masked as ${radiusDesc[config.maskShape]} (132px stage core) with a subtle 1px inner edge highlight and soft elevation shadow.`;

  return `Build an alive, full-screen app loading splash screen for "${config.appName}" in React + Motion (or pure CSS/SVG). Follow these exact specifications:

1. Visual Subject & Framing
- ${subjectLine}
- Place it centered on a ${backdropDesc[config.backdropMode]} background with a soft breathing radial ambient aura using ${palette.glow}.
- Add a diagonal specular sheen sweep across the logo surface so it feels dimensional and alive.

2. Exact Action Choreography
- ${motionCommand[config.motionStyle]}
- Support subtle interactive 3D pointer tilt on hover/move, plus a crisp entrance spring (scale 0.76 -> 1, blur 8px -> 0px) when the loader mounts.

3. Typography & Progress State
- Display the title "${config.appName}" directly below the logo, followed by the status line "${config.loadingPhrase}"${config.showPercentage ? ' with a tabular-nums percentage counter (e.g., "· 68%")' : ''}.
- Include ${progressDesc[config.progressStyle]}.
- When loading reaches 100%, change the status text to "Ready", settle the logo with a clean 1.09x -> 1.0 spring pop, and fade out smoothly into the main app.

4. Performance & Accessibility
- Animate only GPU-composited properties (transform, opacity, filter, SVG stroke-dashoffset/pathLength).
- Respect prefers-reduced-motion by disabling continuous loops while keeping the logo and status cleanly visible.`;
}

export function generateThemeCssVariables(
  config: LoaderConfig,
  palette: ExtractedPalette
): string {
  const isLight = config.backdropMode === 'alabaster';
  const bg = BG_MAP[config.backdropMode];
  const surface = isLight ? '#FFFFFF' : '#12141B';
  const border = isLight ? '#E4E4E7' : '#27272A';
  const text = isLight ? '#18181B' : '#F4F4F5';
  const mutedText = isLight ? '#52525B' : '#A1A1AA';
  const radius = RADIUS_MAP[config.maskShape];

  return `:root {
  --color-background: ${bg};
  --color-surface: ${surface};
  --color-border: ${border};
  --color-text: ${text};
  --color-text-muted: ${mutedText};
  --color-primary: ${palette.primary};
  --color-secondary: ${palette.secondary};
  --color-glow: ${palette.glow};
  --loader-radius: ${radius};
}`;
}


