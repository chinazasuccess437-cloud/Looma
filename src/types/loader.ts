export type MotionStyleId =
  | 'ribbon'
  | 'glue'
  | 'cardiac'
  | 'specular'
  | 'levitate'
  | 'elastic'
  | 'aperture'
  | 'echo';

export type MaskShape = 'squircle' | 'circle' | 'rounded' | 'freeform';

export type BackdropMode = 'obsidian' | 'alabaster' | 'slate' | 'adaptive';

export type ProgressStyle = 'ring' | 'bar' | 'dots' | 'none';

export type PreviewContext = 'ambient' | 'mobile' | 'desktop' | 'inline';

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
  speed: number; // 0.5 to 2.0
  intensity: number; // 0.4 to 1.6
  appName: string;
  loadingPhrase: string;
  showPercentage: boolean;
}

export interface MotionStyleMeta {
  id: MotionStyleId;
  name: string;
  summary: string;
  physicsNote: string;
}

export const MOTION_STYLES: MotionStyleMeta[] = [
  {
    id: 'ribbon',
    name: 'Ribbon Orbit',
    summary: 'Swirls into glowing beads, orbits, and draws out the logo',
    physicsNote: 'Path retraction -> dual-cluster orbit -> luminous unveil',
  },
  {
    id: 'glue',
    name: 'Liquid Glue',
    summary: 'Viscous droplets rotate, fuse like glue, and reveal the mark',
    physicsNote: 'SVG metaball goo fusion -> rotational snap -> picture emerge',
  },
  {
    id: 'cardiac',
    name: 'Cardiac Pulse',
    summary: 'Dual-beat organic pulse with expanding acoustic ripples',
    physicsNote: 'Asymmetric lub-dub scale curve + radial wave decay',
  },
  {
    id: 'specular',
    name: 'Specular Sweep',
    summary: 'Diagonal light sheen with orbital arc and 3D tilt',
    physicsNote: 'Masked glass reflection + dual-axis perspective drift',
  },
  {
    id: 'levitate',
    name: 'Zero-G Float',
    summary: 'Buoyant vertical drift with dynamic shadow and light motes',
    physicsNote: 'Sinusoidal levitation + inverse ground shadow scaling',
  },
  {
    id: 'elastic',
    name: 'Elastic Squish',
    summary: 'Playful squash-and-stretch bounce with spring settle',
    physicsNote: 'Volume-preserving X/Y deformation + spring overshoot',
  },
  {
    id: 'aperture',
    name: 'Aperture Focus',
    summary: 'Optical lens focus pull framed by a rotating shutter',
    physicsNote: 'Focal blur pull + counter-rotating segmented iris ring',
  },
  {
    id: 'echo',
    name: 'Chromatic Echo',
    summary: 'Layered translucent silhouettes breathing in harmonic phase',
    physicsNote: 'Staggered phase-shifted scale ghosts + soft bloom',
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
    defaultAppName: 'Swirl Studio',
    defaultPhrase: 'Weaving your workspace',
    fallbackPalette: {
      primary: '#5EEAD4',
      secondary: '#F472B6',
      glow: 'rgba(167, 139, 250, 0.36)',
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
      secondary: '#93C5FD',
      glow: 'rgba(59, 130, 246, 0.38)',
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
      primary: '#64748B',
      secondary: '#E2E8F0',
      glow: 'rgba(148, 163, 184, 0.32)',
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
      glow: 'rgba(96, 165, 250, 0.4)',
      contrastText: 'light',
    },
  },
];
