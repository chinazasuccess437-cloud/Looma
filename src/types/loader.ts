export type MotionStyleId =
  | 'ribbon'
  | 'glue'
  | 'cardiac'
  | 'specular'
  | 'levitate'
  | 'elastic'
  | 'aperture'
  | 'echo'
  | 'pendulum'
  | 'vortex'
  | 'origami'
  | 'ripple'
  | 'neon'
  | 'prism'
  | 'satellite'
  | 'gravity'
  | 'scanner'
  | 'bloom'
  | 'compass'
  | 'warp'
  | 'halo'
  | 'drift';

export type MotionCategory = 'All' | 'Orbital' | 'Liquid' | 'Pulse' | 'Spatial' | 'Optics';

export type MaskShape = 'squircle' | 'circle' | 'rounded' | 'freeform';

export type BackdropMode = 'obsidian' | 'alabaster' | 'slate' | 'adaptive';

export type ProgressStyle = 'ring' | 'bar' | 'dots' | 'none';

export type PreviewContext = 'ambient' | 'mobile' | 'desktop' | 'inline';

export type AuraMixMode = 'swirl' | 'dual' | 'mist';

export type UiTextTheme = 'gradient' | 'editorial' | 'mono' | 'clean';

export interface ExtractedPalette {
  primary: string;
  secondary: string;
  glow: string;
  contrastText: 'light' | 'dark';
}

export interface PresetAsset {
  id: string;
  name: string;
  kind: 'logo' | 'picture' | 'vector' | 'ribbon-s';
  src: string;
  defaultBackdrop: BackdropMode;
  defaultShape: MaskShape;
  defaultMotion: MotionStyleId;
  defaultAppName: string;
  defaultPhrase: string;
  fallbackPalette: ExtractedPalette;
}

export interface LoaderConfig {
  imageSrc: string;
  imageName: string;
  presetKind: 'logo' | 'picture' | 'vector' | 'ribbon-s';
  motionStyle: MotionStyleId;
  maskShape: MaskShape;
  backdropMode: BackdropMode;
  progressStyle: ProgressStyle;
  auraMixMode?: AuraMixMode;
  uiTextTheme?: UiTextTheme;
  speed: number; // 0.5 to 2.0
  intensity: number; // 0.4 to 1.6
  appName: string;
  loadingPhrase: string;
  showPercentage: boolean;
}

export interface MotionStyleMeta {
  id: MotionStyleId;
  name: string;
  category: Exclude<MotionCategory, 'All'>;
  summary: string;
  physicsNote: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface AuraMixPreset {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  mixMode: AuraMixMode;
}

export const AURA_SWATCHES: ColorSwatch[] = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Ice Blue', hex: '#93C5FD' },
  { name: 'Cobalt Blue', hex: '#3B82F6' },
  { name: 'Electric Cyan', hex: '#22D3EE' },
  { name: 'Mint Teal', hex: '#2DD4BF' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Violet', hex: '#A78BFA' },
  { name: 'Neon Rose', hex: '#EC4899' },
  { name: 'Warm Coral', hex: '#F97316' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Crimson', hex: '#EF4444' },
  { name: 'Midnight Ink', hex: '#1E293B' },
];

export const AURA_MIX_PRESETS: AuraMixPreset[] = [
  { id: 'white-blue', label: 'White + Blue', primary: '#FFFFFF', secondary: '#3B82F6', mixMode: 'swirl' },
  { id: 'ice-cobalt', label: 'Ice + Cobalt', primary: '#93C5FD', secondary: '#2563EB', mixMode: 'mist' },
  { id: 'cyan-violet', label: 'Cyan + Violet', primary: '#22D3EE', secondary: '#A78BFA', mixMode: 'swirl' },
  { id: 'white-emerald', label: 'White + Emerald', primary: '#FFFFFF', secondary: '#10B981', mixMode: 'mist' },
  { id: 'pink-gold', label: 'Rose + Gold', primary: '#EC4899', secondary: '#F59E0B', mixMode: 'swirl' },
  { id: 'coral-rose', label: 'Coral + Pink', primary: '#F97316', secondary: '#F472B6', mixMode: 'dual' },
  { id: 'teal-indigo', label: 'Teal + Indigo', primary: '#2DD4BF', secondary: '#6366F1', mixMode: 'swirl' },
  { id: 'white-crimson', label: 'White + Crimson', primary: '#FFFFFF', secondary: '#EF4444', mixMode: 'mist' },
];

export const MOTION_CATEGORIES: MotionCategory[] = [
  'All',
  'Orbital',
  'Liquid',
  'Pulse',
  'Spatial',
  'Optics',
];

export const MOTION_STYLES: MotionStyleMeta[] = [
  {
    id: 'ribbon',
    name: 'Ribbon Orbit',
    category: 'Orbital',
    summary: 'Swirls into glowing beads, orbits, and draws out the logo',
    physicsNote: 'Path retraction -> dual-cluster orbit -> luminous unveil',
  },
  {
    id: 'glue',
    name: 'Liquid Glue',
    category: 'Liquid',
    summary: 'Viscous droplets rotate, fuse like glue, and reveal the mark',
    physicsNote: 'SVG metaball goo fusion -> rotational snap -> picture emerge',
  },
  {
    id: 'cardiac',
    name: 'Cardiac Pulse',
    category: 'Pulse',
    summary: 'Dual-beat organic pulse with expanding acoustic ripples',
    physicsNote: 'Asymmetric lub-dub scale curve + radial wave decay',
  },
  {
    id: 'specular',
    name: 'Specular Sweep',
    category: 'Optics',
    summary: 'Diagonal light sheen with orbital arc and 3D tilt',
    physicsNote: 'Masked glass reflection + dual-axis perspective drift',
  },
  {
    id: 'levitate',
    name: 'Zero-G Float',
    category: 'Spatial',
    summary: 'Buoyant vertical drift with dynamic shadow and light motes',
    physicsNote: 'Sinusoidal levitation + inverse ground shadow scaling',
  },
  {
    id: 'elastic',
    name: 'Elastic Squish',
    category: 'Liquid',
    summary: 'Playful squash-and-stretch bounce with spring settle',
    physicsNote: 'Volume-preserving X/Y deformation + spring overshoot',
  },
  {
    id: 'aperture',
    name: 'Aperture Focus',
    category: 'Optics',
    summary: 'Optical lens focus pull framed by a rotating shutter',
    physicsNote: 'Focal blur pull + counter-rotating segmented iris ring',
  },
  {
    id: 'echo',
    name: 'Chromatic Echo',
    category: 'Optics',
    summary: 'Layered translucent silhouettes breathing in harmonic phase',
    physicsNote: 'Staggered phase-shifted scale ghosts + soft bloom',
  },
  {
    id: 'pendulum',
    name: 'Pendulum Swing',
    category: 'Spatial',
    summary: 'Weighted smooth pendulum arc swaying with gentle inertia',
    physicsNote: 'Harmonic rotational arc + counter-weighted ease',
  },
  {
    id: 'vortex',
    name: 'Vortex Spin',
    category: 'Orbital',
    summary: 'Gyroscopic spiral twist pulling inward then snapping crisp',
    physicsNote: 'Dual-ring counter rotation + inward vortex settle',
  },
  {
    id: 'origami',
    name: '3D Flip Fold',
    category: 'Spatial',
    summary: 'Crisp 3D card turn along perspective axis with depth catchlight',
    physicsNote: 'Perspective 180deg axis flip + specular depth peak',
  },
  {
    id: 'ripple',
    name: 'Sonar Ripple',
    category: 'Pulse',
    summary: 'Concentric dual-color water waves radiating smoothly outward',
    physicsNote: 'Dual-tone harmonic rings + buoyant core float',
  },
  {
    id: 'neon',
    name: 'Neon Breathe',
    category: 'Pulse',
    summary: 'Electric contour glow surging around the frame with crisp bloom',
    physicsNote: 'Luminous drop-shadow surge + high-contrast rim pulse',
  },
  {
    id: 'prism',
    name: 'Prism Split',
    category: 'Optics',
    summary: 'Chromatic cyan/pink spectral layers separating and locking crisp',
    physicsNote: 'Dual-channel X/Y dispersion + razor-sharp snap lock',
  },
  {
    id: 'satellite',
    name: 'Satellite Lock',
    category: 'Orbital',
    summary: 'Twin luminous moons orbiting diagonally across foreground & back',
    physicsNote: 'Elliptical tilted orbit + depth-crossing glow spheres',
  },
  {
    id: 'gravity',
    name: 'Gravity Drop',
    category: 'Spatial',
    summary: 'Weighted fall into floor compression shadow with crisp rebound',
    physicsNote: 'Accelerating drop curve + cushioned ground rebound',
  },
  {
    id: 'scanner',
    name: 'Laser Scan',
    category: 'Optics',
    summary: 'Precision glowing light beam sweeping vertically across the mark',
    physicsNote: 'Vertical luminous beam pass + subtle depth shimmer',
  },
  {
    id: 'bloom',
    name: 'Petal Bloom',
    category: 'Pulse',
    summary: 'Radial translucent halo petals unfolding gently behind the mark',
    physicsNote: '4-petal radial rotation + staggered aura unfold',
  },
  {
    id: 'compass',
    name: 'Magnetic Snap',
    category: 'Orbital',
    summary: 'Precision 90-degree detent turns with tactile spring overshoot',
    physicsNote: 'Stepped quadrant rotation + crisp mechanical settle',
  },
  {
    id: 'warp',
    name: 'Horizon Warp',
    category: 'Spatial',
    summary: 'Deep Z-axis approach emerging from soft mist into sharp focus',
    physicsNote: 'Scale depth pull + trailing motion-blur mist',
  },
  {
    id: 'halo',
    name: 'Halo Crown',
    category: 'Orbital',
    summary: 'Mixed primary + secondary conic gradient ring spinning smoothly',
    physicsNote: 'Conic multi-color aura rim + centered micro-breathe',
  },
  {
    id: 'drift',
    name: 'Alive Hover Tilt',
    category: 'Liquid',
    summary: 'Organic figure-eight liquid tilt with floating ambient sparkles',
    physicsNote: 'Continuous Lissajous micro-tilt + soft floating motes',
  },
];

export const PRESET_ASSETS: PresetAsset[] = [
  {
    id: 'ribbon-s',
    name: 'Ribbon S',
    kind: 'ribbon-s',
    src: 'vector:ribbon-s',
    defaultBackdrop: 'obsidian',
    defaultShape: 'squircle',
    defaultMotion: 'ribbon',
    defaultAppName: 'Looma',
    defaultPhrase: 'Welcome to Looma',
    fallbackPalette: {
      primary: '#FFFFFF',
      secondary: '#3B82F6',
      glow: 'rgba(96, 165, 250, 0.42)',
      contrastText: 'light',
    },
  },
  {
    id: 'origami',
    name: 'Origami Crane',
    kind: 'logo',
    src: '/src/assets/images/logo_origami_bird_1794879331312.jpg',
    defaultBackdrop: 'obsidian',
    defaultShape: 'squircle',
    defaultMotion: 'glue',
    defaultAppName: 'Origami Studio',
    defaultPhrase: 'Preparing your canvas',
    fallbackPalette: {
      primary: '#3B82F6',
      secondary: '#FFFFFF',
      glow: 'rgba(59, 130, 246, 0.42)',
      contrastText: 'light',
    },
  },
  {
    id: 'botanical',
    name: 'Botanical Seal',
    kind: 'logo',
    src: '/src/assets/images/logo_botanical_crest_1794879330911.jpg',
    defaultBackdrop: 'alabaster',
    defaultShape: 'circle',
    defaultMotion: 'cardiac',
    defaultAppName: 'Veranda Roasters',
    defaultPhrase: 'Brewing today’s roast notes',
    fallbackPalette: {
      primary: '#B4823A',
      secondary: '#5E4427',
      glow: 'rgba(180, 130, 58, 0.34)',
      contrastText: 'dark',
    },
  },
  {
    id: 'portrait',
    name: 'Studio Portrait',
    kind: 'picture',
    src: '/src/assets/images/picture_studio_portrait_1794879331632.jpg',
    defaultBackdrop: 'slate',
    defaultShape: 'circle',
    defaultMotion: 'glue',
    defaultAppName: 'Atelier Profile',
    defaultPhrase: 'Opening Elena’s workspace',
    fallbackPalette: {
      primary: '#93C5FD',
      secondary: '#FFFFFF',
      glow: 'rgba(147, 197, 253, 0.38)',
      contrastText: 'light',
    },
  },
  {
    id: 'vector',
    name: 'Vector Mark',
    kind: 'vector',
    src: 'vector:kinetix',
    defaultBackdrop: 'obsidian',
    defaultShape: 'squircle',
    defaultMotion: 'specular',
    defaultAppName: 'Looma',
    defaultPhrase: 'Synchronizing motion layers',
    fallbackPalette: {
      primary: '#60A5FA',
      secondary: '#F4F4F5',
      glow: 'rgba(96, 165, 250, 0.42)',
      contrastText: 'light',
    },
  },
];
