import { CORE_UI_TEMPLATES } from './coreUiTemplates';

export type LibraryGroupId = 'all' | 'motion' | 'essentials';

export type LibraryCategoryId =
  | 'all'
  | 'loading'
  | 'media'
  | 'states'
  | 'navigation'
  | 'micro'
  | 'layout'
  | 'theme'
  | 'typography'
  | 'components'
  | 'assets'
  | 'sound';

export interface UITemplateItem {
  id: string;
  title: string;
  category: Exclude<LibraryCategoryId, 'all'>;
  categoryLabel: string;
  summary: string;
  motionNote: string;
  code: string;
  prompt: string;
}

export const MOTION_CATEGORIES: { id: LibraryCategoryId; label: string }[] = [
  { id: 'loading', label: 'Loading & Waiting' },
  { id: 'media', label: 'Icon & Media' },
  { id: 'states', label: 'Empty, Error & Offline' },
  { id: 'navigation', label: 'Transitions & Nav' },
  { id: 'micro', label: 'Micro-Interactions' },
];

export const ESSENTIALS_CATEGORIES: { id: LibraryCategoryId; label: string }[] = [
  { id: 'layout', label: 'Layouts & Spacing' },
  { id: 'theme', label: 'Themes & Dark Mode' },
  { id: 'typography', label: 'Typography' },
  { id: 'components', label: 'Complex UI' },
  { id: 'assets', label: 'Assets & Branding' },
  { id: 'sound', label: 'Sound Effects' },
];

export const LIBRARY_CATEGORIES: { id: LibraryCategoryId; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  ...MOTION_CATEGORIES,
  ...ESSENTIALS_CATEGORIES,
];

export function getAllTemplates(): UITemplateItem[] {
  return [...UI_TEMPLATES, ...CORE_UI_TEMPLATES];
}

export const UI_TEMPLATES: UITemplateItem[] = [
  // 1. LOADING & WAITING STATES (10)
  {
    id: 'splash-screen',
    title: 'Brand Splash Screen',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Full-screen entrance with breathing logo aura, status text, and smooth reveal.',
    motionNote: 'Spring entrance + radial pulse',
    code: `import { motion } from 'motion/react';

export function SplashScreen({ logoSrc, appName }: { logoSrc: string; appName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#090A0E] text-white"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 rounded-[28%] overflow-hidden shadow-2xl"
        >
          <img src={logoSrc} alt={appName} className="w-full h-full object-cover" />
        </motion.div>
        <p className="mt-5 text-base font-semibold">{appName}</p>
        <p className="mt-1 text-xs text-zinc-400">Preparing your workspace</p>
      </div>
    </motion.div>
  );
}`,
    prompt: `Build a full-screen Brand Splash Screen in React + Motion:
- Center the app logo inside a 96px squircle container on a #090A0E obsidian backdrop with a soft breathing radial glow behind it.
- Animate the logo with a gentle organic pulse (scale 1 -> 1.06 -> 1 over 2.2s infinite ease-in-out).
- Display the app title and muted status text below. When loading finishes, fade out smoothly with a subtle 1.03x scale exit.`,
  },
  {
    id: 'skeleton-shimmer',
    title: 'Pulsing Skeleton Shimmer',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Layout-matched content placeholders with a smooth diagonal light sweep.',
    motionNote: 'Hardware-accelerated shimmer sweep',
    code: `import { motion } from 'motion/react';

export function CardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <ShimmerBlock className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="h-3.5 w-3/4 rounded" />
          <ShimmerBlock className="h-2.5 w-1/2 rounded" />
        </div>
      </div>
      <ShimmerBlock className="h-20 w-full rounded-lg" />
    </div>
  );
}

function ShimmerBlock({ className }: { className: string }) {
  return (
    <div className={\`relative overflow-hidden bg-zinc-800/80 \${className}\`}>
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}`,
    prompt: `Create a Pulsing Skeleton Shimmer card in React + Tailwind + Motion:
- Match the final card geometry exactly (40px circular avatar, two text lines at 75% and 50% width, and an 80px media block) to prevent layout shift.
- Overlay each placeholder block with an overflow-hidden gradient sheen translating from -100% to 200% horizontally over a 1.5s linear infinite loop.`,
  },
  {
    id: 'classic-spinners',
    title: 'Classic Tactile Spinners',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Crisp dual-arc and segmented SVG spinners with smooth rotational easing.',
    motionNote: 'GPU rotation + SVG arc dash',
    code: `import { motion } from 'motion/react';

export function DualArcSpinner({ size = 36 }: { size?: number }) {
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
        <circle
          cx="20" cy="20" r="16" fill="none" stroke="#3B82F6" strokeWidth="3.5"
          strokeLinecap="round" strokeDasharray="34 66"
        />
      </motion.svg>
    </div>
  );
}`,
    prompt: `Build a crisp Classic Dual-Arc SVG Spinner component:
- Render a 40x40 SVG circle track at 12% white opacity with an active 3.5px rounded-cap arc in #3B82F6 (strokeDasharray="34 66").
- Rotate smoothly 360deg over 0.9s linear infinite using transform only, and support reduced-motion by slowing or pausing rotation.`,
  },
  {
    id: 'linear-progress',
    title: 'Linear Progress Bar',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Determinate fluid bar with animated sheen and tabular percentage readout.',
    motionNote: 'Spring width fill + tabular-nums',
    code: `import { motion } from 'motion/react';

export function LinearProgress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between text-xs text-zinc-400 mb-2">
        <span>Uploading assets</span>
        <span className="font-mono tabular-nums text-zinc-200">{Math.round(clamped)}%</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          animate={{ width: \`\${clamped}%\` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}`,
    prompt: `Implement a Linear Progress Bar with percentage readout:
- Display a label on the left and a tabular-nums monospace percentage on the right so digits never jitter.
- Use an 8px rounded track (bg-zinc-800) with a spring-animated fill bar in #3B82F6 (stiffness 120, damping 20).`,
  },
  {
    id: 'circular-ring',
    title: 'Circular Percentage Ring',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Precision SVG radial progress ring with smooth stroke interpolation.',
    motionNote: 'SVG strokeDashoffset easing',
    code: `import { motion } from 'motion/react';

export function CircularProgressRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return (
    <div className="relative w-24 h-24 grid place-items-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <motion.circle
          cx="42" cy="42" r={r} fill="none" stroke="#3B82F6" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-sm font-mono tabular-nums font-semibold text-white">
        {Math.round(value)}%
      </span>
    </div>
  );
}`,
    prompt: `Create a Circular Percentage Ring loader:
- Build a 96x96 SVG rotated -90deg so progress starts at 12 o'clock.
- Animate strokeDashoffset smoothly with easeOut over 0.35s and center a tabular-nums percentage counter inside the ring.`,
  },
  {
    id: 'pull-to-refresh',
    title: 'Pull-to-Refresh Tension',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Elastic pull-down indicator that snaps into a refresh spin and updates feed.',
    motionNote: 'Elastic drag tension + snap',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';

export function PullToRefresh({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [refreshing, setRefreshing] = useState(false);

  const trigger = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div className="w-full max-w-xs rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
      <motion.button
        onClick={trigger}
        whileTap={{ y: 12 }}
        className="inline-flex items-center gap-2 text-xs text-zinc-300"
      >
        <motion.span animate={refreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: refreshing ? Infinity : 0, duration: 0.8, ease: 'linear' }}>
          <RefreshCw className="w-4 h-4 text-blue-400" />
        </motion.span>
        <span>{refreshing ? 'Refreshing feed...' : 'Pull or tap to refresh'}</span>
      </motion.button>
    </div>
  );
}`,
    prompt: `Build an interactive Pull-to-Refresh header indicator:
- Allow vertical elastic pull/drag tension at the top of a scrollable feed container.
- Once released past threshold, snap cleanly to a 44px refresh slot with a continuously rotating refresh icon, fetch fresh data, and collapse smoothly back to 0px.`,
  },
  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll Loader',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Bottom-of-list observer sentinel with breathing dots and smooth item entry.',
    motionNote: 'IntersectionObserver + staggered entry',
    code: `import { motion } from 'motion/react';

export function InfiniteScrollFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="py-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
      <span className="ml-1">Loading more</span>
    </div>
  );
}`,
    prompt: `Build an Infinite Scroll List Loader:
- Place an IntersectionObserver sentinel at the bottom of the list that triggers pagination automatically.
- Show 3 staggered pulsing dots next to "Loading more", and animate newly appended rows in with a subtle 8px slide-up + opacity fade.`,
  },
  {
    id: 'button-loading',
    title: 'Button Loading States',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Action button transitioning from idle to inline spinner to crisp confirmation.',
    motionNote: 'Layout-stable state swap',
    code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Check } from 'lucide-react';

export function AsyncActionButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1600);
    }, 1200);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="h-10 px-5 rounded-lg bg-blue-600 text-white text-xs font-medium inline-flex items-center gap-2"
    >
      <AnimatePresence mode="wait">
        {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {status === 'done' && <Check className="w-3.5 h-3.5" />}
      </AnimatePresence>
      <span>{status === 'idle' ? 'Save Changes' : status === 'loading' ? 'Saving...' : 'Saved'}</span>
    </motion.button>
  );
}`,
    prompt: `Build an Async Button Loading State component:
- Lock button height and prevent double-clicks while pending.
- Transition smoothly from Idle ("Save Changes") -> Pending (inline spinning icon + "Saving...") -> Done (checkmark + "Saved") with tactile press feedback (scale 0.97).`,
  },
  {
    id: 'brand-mascot-loader',
    title: 'Brand Mascot Bounce',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Custom brand mark floating and squashing elastically over a reactive shadow.',
    motionNote: 'Volume-preserving squash + shadow',
    code: `import { motion } from 'motion/react';

export function BrandMascotLoader({ logoSrc }: { logoSrc: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          y: [0, -14, 0],
          scaleX: [1, 0.95, 1.08, 1],
          scaleY: [1, 1.06, 0.92, 1],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl"
      >
        <img src={logoSrc} alt="Brand mark" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div
        animate={{ scaleX: [1, 0.65, 1], opacity: [0.4, 0.15, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-3 w-12 h-2 rounded-full bg-black/60 blur-sm"
      />
    </div>
  );
}`,
    prompt: `Build a Custom Brand / Mascot Loader:
- Animate the brand emblem with a buoyant 14px bounce and subtle volume-preserving squash-and-stretch on impact (scaleX: 1.08, scaleY: 0.92).
- Pair it with a blurred ground shadow underneath that shrinks and fades inversely as the mark rises.`,
  },
  {
    id: 'optimistic-ui',
    title: 'Optimistic UI Sync',
    category: 'loading',
    categoryLabel: 'Loading & Waiting',
    summary: 'Instant heart/bookmark state update before server response, with safe rollback.',
    motionNote: 'Immediate feedback + background sync',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function OptimisticLikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs"
    >
      <motion.span animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
        <Heart className={\`w-4 h-4 \${liked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'}\`} />
      </motion.span>
      <span className="font-mono tabular-nums text-zinc-200">{count}</span>
    </motion.button>
  );
}`,
    prompt: `Implement an Optimistic UI action pattern:
- Update the UI immediately on tap (flip icon fill + increment tabular-nums count with a 1.35x spring pop) without blocking on network latency.
- Sync the mutation asynchronously in the background and cleanly roll back state with a non-intrusive error notice if the request fails.`,
  },

  // 2. ICON & MEDIA LOADING (4)
  {
    id: 'morphing-icons',
    title: 'Morphing Action Icons',
    category: 'media',
    categoryLabel: 'Icon & Media',
    summary: 'Download-to-progress-to-checkmark icon state machine with crisp spring swaps.',
    motionNote: 'AnimatePresence popLayout swap',
    code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Check, Loader2 } from 'lucide-react';

export function MorphDownloadIcon() {
  const [step, setStep] = useState<'ready' | 'busy' | 'done'>('ready');
  const start = () => {
    if (step !== 'ready') return;
    setStep('busy');
    setTimeout(() => {
      setStep('done');
      setTimeout(() => setStep('ready'), 1600);
    }, 1000);
  };
  return (
    <button onClick={start} className="w-11 h-11 rounded-xl bg-zinc-800 grid place-items-center text-white">
      <AnimatePresence mode="wait">
        {step === 'ready' && <motion.span key="r" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Download className="w-4 h-4" /></motion.span>}
        {step === 'busy' && <motion.span key="b" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Loader2 className="w-4 h-4 animate-spin text-blue-400" /></motion.span>}
        {step === 'done' && <motion.span key="d" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Check className="w-4 h-4 text-emerald-400" /></motion.span>}
      </AnimatePresence>
    </button>
  );
}`,
    prompt: `Build a Morphing Icon button (Download -> Spinner -> Checkmark):
- Keep a fixed 44x44 touch target container and use AnimatePresence mode="wait" to scale/fade smoothly between Download, spinning progress, and emerald Checkmark states.`,
  },
  {
    id: 'blur-up-image',
    title: 'Blur-Up Image Placeholder',
    category: 'media',
    categoryLabel: 'Icon & Media',
    summary: 'Progressive optical transition from blurred low-res preview to sharp photo.',
    motionNote: 'Filter blur(18px) -> blur(0px)',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';

export function BlurUpImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl bg-zinc-800 aspect-[4/3]">
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        initial={{ filter: 'blur(18px)', scale: 1.08, opacity: 0.6 }}
        animate={loaded ? { filter: 'blur(0px)', scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}`,
    prompt: `Create a Blur-Up Progressive Image Placeholder:
- Render the container at its exact final aspect ratio to prevent layout shift.
- Start the image at scale 1.08, blur(18px), and 0.6 opacity, then animate smoothly to scale 1, blur(0px), and 1.0 opacity over 0.65s once onLoad fires.`,
  },
  {
    id: 'avatar-fallback',
    title: 'Avatar & Media Fallbacks',
    category: 'media',
    categoryLabel: 'Icon & Media',
    summary: 'Zero-broken-image policy with monogram initials and gradient fallback surfaces.',
    motionNote: 'Resilient onError boundary',
    code: `import { useState } from 'react';

export function ResilientAvatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  if (failed || !src) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 grid place-items-center text-xs font-semibold text-white">
        {initials}
      </div>
    );
  }
  return <img src={src} alt={name} onError={() => setFailed(true)} className="w-12 h-12 rounded-full object-cover" />;
}`,
    prompt: `Build a Resilient Avatar & Media Fallback component:
- Always attach an onError handler to <img> elements so failed or missing URLs never render broken image icons.
- Fall back gracefully to a styled gradient surface displaying the user's two-letter initials or a centered domain icon.`,
  },
  {
    id: 'media-buffering',
    title: 'Video / Audio Buffering',
    category: 'media',
    categoryLabel: 'Icon & Media',
    summary: 'Measured translucent scrim with orbiting buffer ring and equalizer bars.',
    motionNote: 'Backdrop blur + staggered equalizer',
    code: `import { motion } from 'motion/react';

export function MediaBufferingOverlay({ isBuffering }: { isBuffering: boolean }) {
  if (!isBuffering) return null;
  return (
    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm grid place-items-center">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white"
        />
        <span className="text-[11px] font-medium text-white/90">Buffering stream</span>
      </div>
    </div>
  );
}`,
    prompt: `Create a Video / Audio Buffering Overlay:
- Place a measured bg-black/55 backdrop-blur-sm scrim over the media frame while buffering.
- Center a clean 32px white spinner ring and concise "Buffering stream" label with >=4.5:1 contrast.`,
  },

  // 3. EMPTY, ERROR & OFFLINE STATES (5)
  {
    id: 'empty-first-time',
    title: 'First-Time Empty State',
    category: 'states',
    categoryLabel: 'Empty, Error & Offline',
    summary: 'Welcoming zero-state with clear purpose copy and a single primary CTA.',
    motionNote: 'Subtle entrance + primary action',
    code: `export function FirstTimeEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center flex flex-col items-center">
      <h3 className="text-sm font-semibold text-zinc-100">No projects yet</h3>
      <p className="mt-1.5 text-xs text-zinc-400 max-w-xs">
        Create your first workspace to organize assets, previews, and live components.
      </p>
      <button onClick={onCreate} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500">
        Create First Project
      </button>
    </div>
  );
}`,
    prompt: `Design a First-Time User Empty State:
- Use a calm dashed-border container with generous padding, a concise title ("No projects yet"), one sentence explaining what will appear here, and one high-contrast primary CTA ("Create First Project").`,
  },
  {
    id: 'no-search-results',
    title: 'No Search Results',
    category: 'states',
    categoryLabel: 'Empty, Error & Offline',
    summary: 'Helpful zero-match state echoing the query and offering a one-click reset.',
    motionNote: 'Instant filter feedback',
    code: `export function NoSearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-10 text-center flex flex-col items-center">
      <p className="text-sm font-medium text-zinc-200">No matches for "{query}"</p>
      <p className="mt-1 text-xs text-zinc-400">Try a different keyword or clear active filters.</p>
      <button onClick={onClear} className="mt-4 px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700">
        Clear search
      </button>
    </div>
  );
}`,
    prompt: `Build a No Search Results state:
- Echo the user's exact search query so they know why the list is empty, suggest broadening terms, and provide a single-click "Clear search" reset button.`,
  },
  {
    id: 'offline-banner',
    title: 'Offline Connection Banner',
    category: 'states',
    categoryLabel: 'Empty, Error & Offline',
    summary: 'Non-intrusive top notice preserving cached UI with a manual retry button.',
    motionNote: 'Slide-down AnimatePresence bar',
    code: `import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner({ isOffline, onRetry }: { isOffline: boolean; onRetry: () => void }) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3"
        >
          <span className="inline-flex items-center gap-2"><WifiOff className="w-3.5 h-3.5" /> You are offline. Changes are saved locally.</span>
          <button onClick={onRetry} className="font-medium underline hover:text-white">Retry</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`,
    prompt: `Build a Non-Intrusive Offline Banner:
- Slide a slim amber warning bar in smoothly from the top when offline without blocking read access to cached content.
- Pair the WifiOff icon with explicit text ("You are offline. Changes are saved locally.") and a functional "Retry" button.`,
  },
  {
    id: 'error-404-screen',
    title: 'Full-Screen Error / 404',
    category: 'states',
    categoryLabel: 'Empty, Error & Offline',
    summary: 'Calm, structured error recovery view with retry and safe home navigation.',
    motionNote: 'Clean entrance + clear recovery',
    code: `export function ErrorRecoveryView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[320px] grid place-items-center text-center p-6">
      <div className="max-w-sm">
        <p className="text-xs font-mono text-rose-400">Error 404</p>
        <h2 className="mt-2 text-lg font-semibold text-white">We couldn't find that page</h2>
        <p className="mt-1.5 text-xs text-zinc-400">The link may have expired or moved. Try refreshing or head back home.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button onClick={onRetry} className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium">Retry</button>
          <a href="/" className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-medium">Go Home</a>
        </div>
      </div>
    </div>
  );
}`,
    prompt: `Build a Full-Screen Error / 404 Recovery View:
- Display a restrained error code ("Error 404"), clear human-friendly headline, short explanation, and two unambiguous recovery buttons ("Retry" and "Go Home").`,
  },
  {
    id: 'form-validation-shake',
    title: 'Form Validation + Shake',
    category: 'states',
    categoryLabel: 'Empty, Error & Offline',
    summary: 'Inline input validation featuring a crisp horizontal shake on invalid submit.',
    motionNote: 'Damped horizontal keyframe shake',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';

export function ValidatedEmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      setShakeKey((k) => k + 1);
      return;
    }
    setError('');
  };

  return (
    <form onSubmit={submit} className="w-full max-w-xs space-y-2">
      <motion.input
        key={shakeKey}
        animate={error ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.36 }}
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(''); }}
        placeholder="you@company.com"
        className={\`w-full px-3 py-2 rounded-lg bg-zinc-900 border text-xs text-white \${error ? 'border-rose-500' : 'border-zinc-700'}\`}
      />
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </form>
  );
}`,
    prompt: `Build an Inline Form Validation input with Shake Animation:
- On invalid submit, highlight the input border in rose-500, display an explicit inline error message below, and trigger a crisp 0.36s horizontal shake ([0, -8, 8, -5, 5, 0]) keyed to each error attempt.`,
  },

  // 4. SCREEN TRANSITIONS & NAVIGATION (5)
  {
    id: 'page-transitions',
    title: 'Page-to-Page Transitions',
    category: 'navigation',
    categoryLabel: 'Transitions & Nav',
    summary: 'Switch smoothly between Slide, Fade, and Shared-Element view transitions.',
    motionNote: 'AnimatePresence + layoutId',
    code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PageTransitionDemo() {
  const [page, setPage] = useState<'list' | 'detail'>('list');
  return (
    <AnimatePresence mode="wait">
      {page === 'list' ? (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          onClick={() => setPage('detail')}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
        >
          Open Project Details ->
        </motion.div>
      ) : (
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          onClick={() => setPage('list')}
          className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 cursor-pointer"
        >
          <- Back to Projects
        </motion.div>
      )}
    </AnimatePresence>
  );
}`,
    prompt: `Implement Smooth Page-to-Page Transitions (Slide, Fade, and Shared-Element):
- Wrap route/view switches in AnimatePresence mode="wait" with directional 16px horizontal slide + opacity fade.
- Support shared-element continuity using matching layoutId props on persistent headers or cards.`,
  },
  {
    id: 'bottom-sheet',
    title: 'Bottom Sheet / Drawer',
    category: 'navigation',
    categoryLabel: 'Transitions & Nav',
    summary: 'Tactile slide-up mobile/panel sheet with dimmed backdrop and drag handle.',
    motionNote: 'Spring slide-up + backdrop fade',
    code: `import { motion, AnimatePresence } from 'motion/react';

export function BottomSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md rounded-t-2xl bg-zinc-900 border-t border-zinc-800 p-6"
          >
            <div className="mx-auto mb-4 w-10 h-1 rounded-full bg-zinc-700" />
            <h4 className="text-sm font-semibold text-white">Share Workspace</h4>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}`,
    prompt: `Build a Bottom Sheet Drawer component:
- Animate a dimmed backdrop fade behind a rounded-t-2xl sheet sliding smoothly up from y: 100% with spring physics (stiffness 280, damping 28).
- Include a top drag handle bar and close cleanly on backdrop tap or Escape key.`,
  },
  {
    id: 'modal-popup',
    title: 'Modal / Dialog Popup',
    category: 'navigation',
    categoryLabel: 'Transitions & Nav',
    summary: 'Focused confirmation dialog with spring scale entrance and keyboard escape.',
    motionNote: 'Scale 0.94 -> 1 + scrim blur',
    code: `import { motion, AnimatePresence } from 'motion/react';

export function ConfirmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 grid place-items-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/65 backdrop-blur-xs" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl"
          >
            <h3 className="text-base font-semibold text-white">Publish release?</h3>
            <p className="mt-1.5 text-xs text-zinc-400">Your updated loader will go live immediately.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}`,
    prompt: `Build an accessible Modal / Dialog Popup:
- Fade in a backdrop-blur scrim behind a centered dialog entering from scale 0.94, y: 8px, opacity 0 with a 180ms settle.
- Support closing via Escape key, close button, and outside backdrop click.`,
  },
  {
    id: 'animated-tabs',
    title: 'Animated Tab Bar',
    category: 'navigation',
    categoryLabel: 'Transitions & Nav',
    summary: 'Segmented navigation with a shared sliding active indicator using layoutId.',
    motionNote: 'Shared layoutId spring indicator',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';

const TABS = ['Overview', 'Activity', 'Settings'];

export function AnimatedTabs() {
  const [active, setActive] = useState(TABS[0]);
  return (
    <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
      {TABS.map((tab) => (
        <button key={tab} onClick={() => setActive(tab)} className="relative px-3.5 py-1.5 text-xs font-medium text-zinc-200">
          {active === tab && (
            <motion.span layoutId="active-tab-bg" className="absolute inset-0 rounded-lg bg-zinc-800" transition={{ type: 'spring', stiffness: 360, damping: 30 }} />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}`,
    prompt: `Build an Animated Tab Bar using Motion layoutId:
- Render single-line tab buttons inside a segmented container.
- Attach layoutId="active-tab-bg" to the active tab's background layer with a crisp spring transition (stiffness 360, damping 30) so it glides smoothly between tabs.`,
  },
  {
    id: 'onboarding-carousel',
    title: 'Onboarding Carousel',
    category: 'navigation',
    categoryLabel: 'Transitions & Nav',
    summary: 'Multi-step directional slide onboarding deck with indicator dots and step controls.',
    motionNote: 'Directional slide + dot morph',
    code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = ['Upload any logo', 'Choose living physics', 'Export code & prompt'];

export function OnboardingCarousel() {
  const [idx, setIdx] = useState(0);
  return (
    <div className="w-full max-w-xs rounded-xl bg-zinc-900 border border-zinc-800 p-5 text-center">
      <div className="h-14 grid place-items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p key={idx} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} className="text-sm font-medium text-white">
            {SLIDES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button onClick={() => setIdx((i) => (i + 1) % SLIDES.length)} className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-xs text-white">
        Next Step
      </button>
    </div>
  );
}`,
    prompt: `Build a Swipeable Onboarding Carousel:
- Animate slides cleanly left/right with AnimatePresence mode="wait" and directional opacity fade.
- Render animated width-expanding indicator dots below and Next / Back controls.`,
  },

  // 5. MICRO-INTERACTIONS & FEEDBACK (4)
  {
    id: 'toast-notifications',
    title: 'Toast Notifications',
    category: 'micro',
    categoryLabel: 'Micro-Interactions',
    summary: 'Stackable success, info, and error snackbars with auto-dismiss and close.',
    motionNote: 'Layout pop + slide-up stack',
    code: `import { motion, AnimatePresence } from 'motion/react';

export function ToastStack({ toasts, onDismiss }: { toasts: { id: number; text: string }[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            onClick={() => onDismiss(t.id)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 shadow-xl cursor-pointer"
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}`,
    prompt: `Build a Stackable Toast Notification system:
- Position fixed at bottom-right; animate new toasts in from y: 16px, scale: 0.96, opacity: 0 with layout reflow when older toasts dismiss.
- Include explicit icon + text labeling for success/info/error and auto-dismiss after 3 seconds.`,
  },
  {
    id: 'animated-toggles',
    title: 'Toggles & Checkboxes',
    category: 'micro',
    categoryLabel: 'Micro-Interactions',
    summary: 'Spring-loaded switch thumb and SVG stroke-draw animated checkboxes.',
    motionNote: 'Spring thumb + SVG pathLength',
    code: `import { useState } from 'react';
import { motion } from 'motion/react';

export function SpringSwitch() {
  const [on, setOn] = useState(true);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={\`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors \${on ? 'bg-blue-600 justify-end' : 'bg-zinc-700 justify-start'}\`}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} className="w-5 h-5 rounded-full bg-white shadow" />
    </button>
  );
}`,
    prompt: `Build Spring-Animated Toggles & Checkboxes:
- Use Motion layout on the switch thumb (stiffness 500, damping 32) for snappy physical travel between off and on states.
- For checkboxes, animate the checkmark SVG pathLength from 0 to 1 over 180ms when checked.`,
  },
  {
    id: 'press-hover-states',
    title: 'Button & Card Press States',
    category: 'micro',
    categoryLabel: 'Micro-Interactions',
    summary: 'Tactile hover elevation and responsive spring press-down feedback.',
    motionNote: 'whileHover lift + whileTap press',
    code: `import { motion } from 'motion/react';

export function TactileCard() {
  return (
    <motion.button
      whileHover={{ y: -3, borderColor: 'rgba(59,130,246,0.5)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="w-full text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800"
    >
      <div className="text-sm font-medium text-white">Interactive Surface</div>
      <div className="mt-1 text-xs text-zinc-400">Settles within 160ms on hover & press</div>
    </motion.button>
  );
}`,
    prompt: `Design Tactile Button & Card Hover/Press States:
- Lift cards gently by -3px on hover with subtle border highlight using cubic-bezier(0.16, 1, 0.3, 1) settling in <= 160ms.
- Scale down to 0.97 on active press (whileTap) so every click feels physical and responsive.`,
  },
  {
    id: 'celebration-success',
    title: 'Success & Celebration',
    category: 'micro',
    categoryLabel: 'Micro-Interactions',
    summary: 'SVG checkmark path-draw paired with a clean celebratory particle burst.',
    motionNote: 'SVG draw + radial particle burst',
    code: `import { motion } from 'motion/react';

export function CelebrationCheck() {
  return (
    <div className="relative w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 grid place-items-center">
      <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
        <motion.path
          d="M9 18.5 L15 24.5 L27 12"
          stroke="#34D399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}`,
    prompt: `Build a Success & Celebration State:
- Draw an emerald SVG checkmark (pathLength 0 -> 1 over 0.45s) inside a soft glowing circle.
- Trigger 12 lightweight radial confetti particles bursting outward and fading over 0.9s with a "Replay Celebration" action.`,
  },
];
