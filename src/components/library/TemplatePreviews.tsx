import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Download,
  Heart,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import type { ExtractedPalette, LoaderConfig } from '../../types/loader';
import { RibbonSLogo, VectorMonogram } from '../AliveLoader';
import { CoreUiPreview } from './CoreUiPreviews';

interface PreviewProps {
  templateId: string;
  config: LoaderConfig;
  palette: ExtractedPalette;
  onLaunchSplash?: () => void;
}

export function TemplatePreview({
  templateId,
  config,
  palette,
  onLaunchSplash,
}: PreviewProps) {
  switch (templateId) {
    case 'splash-screen':
      return <SplashPreview config={config} palette={palette} onLaunchSplash={onLaunchSplash} />;
    case 'skeleton-shimmer':
      return <SkeletonPreview />;
    case 'classic-spinners':
      return <SpinnerPreview palette={palette} />;
    case 'linear-progress':
      return <LinearProgressPreview palette={palette} />;
    case 'circular-ring':
      return <CircularRingPreview palette={palette} />;
    case 'pull-to-refresh':
      return <PullToRefreshPreview />;
    case 'infinite-scroll':
      return <InfiniteScrollPreview />;
    case 'button-loading':
      return <ButtonLoadingPreview />;
    case 'brand-mascot-loader':
      return <MascotBouncePreview config={config} palette={palette} />;
    case 'optimistic-ui':
      return <OptimisticUIPreview />;
    case 'morphing-icons':
      return <MorphingIconsPreview />;
    case 'blur-up-image':
      return <BlurUpPreview config={config} />;
    case 'avatar-fallback':
      return <AvatarFallbackPreview config={config} />;
    case 'media-buffering':
      return <MediaBufferingPreview />;
    case 'empty-first-time':
      return <EmptyFirstTimePreview />;
    case 'no-search-results':
      return <NoSearchResultsPreview />;
    case 'offline-banner':
      return <OfflineBannerPreview />;
    case 'error-404-screen':
      return <Error404Preview />;
    case 'form-validation-shake':
      return <FormShakePreview />;
    case 'page-transitions':
      return <PageTransitionsPreview />;
    case 'bottom-sheet':
      return <BottomSheetPreview />;
    case 'modal-popup':
      return <ModalPopupPreview />;
    case 'animated-tabs':
      return <AnimatedTabsPreview />;
    case 'onboarding-carousel':
      return <OnboardingCarouselPreview />;
    case 'toast-notifications':
      return <ToastPreview />;
    case 'animated-toggles':
      return <TogglesCheckboxesPreview />;
    case 'press-hover-states':
      return <PressHoverPreview />;
    case 'celebration-success':
      return <CelebrationPreview />;
    default:
      return <CoreUiPreview templateId={templateId} config={config} palette={palette} />;
  }
}

function ActiveLogoMini({
  config,
  palette,
}: {
  config: LoaderConfig;
  palette: ExtractedPalette;
}) {
  if (config.presetKind === 'ribbon-s') {
    return <RibbonSLogo animateAction duration={3.2} intensity={1} />;
  }
  if (config.presetKind === 'vector') {
    return <VectorMonogram color={palette.secondary} accent={palette.primary} />;
  }
  return (
    <img
      src={config.imageSrc}
      alt={config.appName}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover"
    />
  );
}

function SplashPreview({
  config,
  palette,
  onLaunchSplash,
}: {
  config: LoaderConfig;
  palette: ExtractedPalette;
  onLaunchSplash?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative grid place-items-center">
        <motion.div
          animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-24 h-24 rounded-full blur-xl pointer-events-none"
          style={{ background: palette.glow }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-16 h-16 rounded-[28%] overflow-hidden border border-white/15 shadow-xl"
        >
          <ActiveLogoMini config={config} palette={palette} />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-zinc-100">{config.appName}</p>
        {onLaunchSplash && (
          <button
            type="button"
            onClick={onLaunchSplash}
            className="mt-1.5 text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            Preview Fullscreen
          </button>
        )}
      </div>
    </div>
  );
}

function SkeletonPreview() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full max-w-[260px] space-y-2.5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setLoaded((v) => !v)}
          className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          {loaded ? 'Show Skeleton' : 'Simulate Load'}
        </button>
      </div>
      {loaded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 flex items-center gap-3"
        >
          <img
            src="/src/assets/images/picture_studio_portrait_1794879331632.jpg"
            alt="Elena"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-100 truncate">Elena Vance</p>
            <p className="text-[11px] text-zinc-400 truncate">Design Systems · Updated now</p>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
            <ShimmerSweep />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative h-3 w-3/4 rounded bg-zinc-800 overflow-hidden">
              <ShimmerSweep />
            </div>
            <div className="relative h-2.5 w-1/2 rounded bg-zinc-800 overflow-hidden">
              <ShimmerSweep />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShimmerSweep() {
  return (
    <motion.div
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
    />
  );
}

function SpinnerPreview({ palette }: { palette: ExtractedPalette }) {
  return (
    <div className="flex items-center gap-6">
      <motion.svg
        viewBox="0 0 40 40"
        className="w-10 h-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke={palette.primary}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="34 64"
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 40 40"
        className="w-8 h-8"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke={palette.secondary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="12 10"
        />
      </motion.svg>
    </div>
  );
}

function LinearProgressPreview({ palette }: { palette: ExtractedPalette }) {
  const [val, setVal] = useState(68);
  return (
    <div className="w-full max-w-[240px] space-y-3">
      <div>
        <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
          <span>Uploading assets</span>
          <span className="font-mono tabular-nums text-zinc-200">{val}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: palette.primary }}
            animate={{ width: `${val}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {[25, 68, 100].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setVal(step)}
            className={`px-2 py-1 rounded text-[11px] font-mono tabular-nums cursor-pointer ${
              val === step ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {step}%
          </button>
        ))}
      </div>
    </div>
  );
}

function CircularRingPreview({ palette }: { palette: ExtractedPalette }) {
  const [val, setVal] = useState(74);
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-20 h-20 grid place-items-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <motion.circle
            cx="38"
            cy="38"
            r={r}
            fill="none"
            stroke={palette.primary}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: c * (1 - val / 100) }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </svg>
        <span className="absolute text-xs font-mono tabular-nums font-semibold text-white">
          {val}%
        </span>
      </div>
      <button
        type="button"
        onClick={() => setVal((v) => (v >= 100 ? 32 : Math.min(100, v + 22)))}
        className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
      >
        Step Progress
      </button>
    </div>
  );
}

function PullToRefreshPreview() {
  const [refreshing, setRefreshing] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(1);

  const handlePull = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setUpdatedCount((n) => n + 1);
    }, 1000);
  };

  return (
    <div className="w-full max-w-[240px] rounded-xl border border-zinc-800 bg-zinc-900/70 overflow-hidden">
      <button
        type="button"
        onClick={handlePull}
        className="w-full py-2.5 px-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-300 hover:bg-zinc-800/70 cursor-pointer"
      >
        <motion.span
          animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: refreshing ? Infinity : 0, duration: 0.75, ease: 'linear' }}
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
        </motion.span>
        <span>{refreshing ? 'Refreshing...' : 'Tap or pull to refresh'}</span>
      </button>
      <div className="p-3 text-xs text-zinc-400 flex justify-between">
        <span>Feed snapshot</span>
        <span className="font-mono tabular-nums text-zinc-200">v{updatedCount}</span>
      </div>
    </div>
  );
}

function InfiniteScrollPreview() {
  const [items, setItems] = useState([1, 2]);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setItems((prev) => (prev.length >= 5 ? [1, 2] : [...prev, prev.length + 1]));
      setLoadingMore(false);
    }, 900);
  };

  return (
    <div className="w-full max-w-[240px] space-y-2">
      <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
        {items.map((n) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex justify-between"
          >
            <span>Release item</span>
            <span className="font-mono tabular-nums text-zinc-500">#{n}</span>
          </motion.div>
        ))}
      </div>
      <button
        type="button"
        onClick={loadMore}
        className="w-full py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-[11px] text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {loadingMore ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span>Loading batch...</span>
          </>
        ) : (
          <span>{items.length >= 5 ? 'Reset list' : 'Trigger scroll load'}</span>
        )}
      </button>
    </div>
  );
}

function ButtonLoadingPreview() {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const trigger = () => {
    if (state !== 'idle') return;
    setState('loading');
    window.setTimeout(() => {
      setState('done');
      window.setTimeout(() => setState('idle'), 1400);
    }, 1000);
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={trigger}
      className={`h-10 px-5 rounded-xl text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer ${
        state === 'done'
          ? 'bg-emerald-600 text-white'
          : 'bg-blue-600 hover:bg-blue-500 text-white'
      }`}
    >
      {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {state === 'done' && <Check className="w-3.5 h-3.5" />}
      <span>{state === 'idle' ? 'Save Changes' : state === 'loading' ? 'Saving...' : 'Saved'}</span>
    </motion.button>
  );
}

function MascotBouncePreview({
  config,
  palette,
}: {
  config: LoaderConfig;
  palette: ExtractedPalette;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          y: [0, -14, 0],
          scaleX: [1, 0.94, 1.09, 1],
          scaleY: [1, 1.07, 0.91, 1],
        }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-white/10"
      >
        <ActiveLogoMini config={config} palette={palette} />
      </motion.div>
      <motion.div
        animate={{ scaleX: [1, 0.62, 1], opacity: [0.45, 0.16, 0.45] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-3 w-12 h-2 rounded-full bg-black/70 blur-xs"
      />
    </div>
  );
}

function OptimisticUIPreview() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(42);
  const [syncing, setSyncing] = useState(false);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 600);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={toggle}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs cursor-pointer hover:border-zinc-700"
      >
        <motion.span animate={liked ? { scale: [1, 1.38, 1] } : { scale: 1 }} transition={{ duration: 0.28 }}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'}`} />
        </motion.span>
        <span className="font-mono tabular-nums text-zinc-100">{count}</span>
      </motion.button>
      <span className="text-[11px] text-zinc-500">
        {syncing ? 'Syncing in background...' : 'Instant UI update'}
      </span>
    </div>
  );
}

function MorphingIconsPreview() {
  const [step, setStep] = useState<'ready' | 'busy' | 'done'>('ready');
  const start = () => {
    if (step !== 'ready') return;
    setStep('busy');
    window.setTimeout(() => {
      setStep('done');
      window.setTimeout(() => setStep('ready'), 1400);
    }, 900);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={start}
        aria-label="Test download morph"
        className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 grid place-items-center text-white cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {step === 'ready' && (
            <motion.span
              key="r"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <Download className="w-5 h-5" />
            </motion.span>
          )}
          {step === 'busy' && (
            <motion.span
              key="b"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </motion.span>
          )}
          {step === 'done' && (
            <motion.span
              key="d"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <Check className="w-5 h-5 text-emerald-400" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className="text-[11px] text-zinc-400">Click icon to morph</span>
    </div>
  );
}

function BlurUpPreview({ config }: { config: LoaderConfig }) {
  const [sharp, setSharp] = useState(true);
  const [localPic, setLocalPic] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const src =
    localPic ??
    (config.presetKind !== 'ribbon-s' && config.presetKind !== 'vector'
      ? config.imageSrc
      : '/src/assets/images/picture_studio_portrait_1794879331632.jpg');

  const replay = () => {
    setSharp(false);
    window.setTimeout(() => setSharp(true), 450);
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLocalPic(reader.result);
        replay();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="w-32 h-24 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
        <motion.img
          src={src}
          alt="Progressive preview"
          referrerPolicy="no-referrer"
          animate={
            sharp
              ? { filter: 'blur(0px)', scale: 1, opacity: 1 }
              : { filter: 'blur(16px)', scale: 1.1, opacity: 0.55 }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <button
          type="button"
          onClick={replay}
          className="text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          Replay Blur-Up
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-zinc-300 hover:text-white cursor-pointer"
        >
          Open Picture
        </button>
      </div>
    </div>
  );
}

function AvatarFallbackPreview({ config }: { config: LoaderConfig }) {
  const [broken, setBroken] = useState(true);
  const [name, setName] = useState('Elena Vance');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EV';

  const avatarSrc =
    customAvatar ??
    (config.presetKind !== 'ribbon-s' && config.presetKind !== 'vector'
      ? config.imageSrc
      : '/src/assets/images/picture_studio_portrait_1794879331632.jpg');

  const handlePick = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomAvatar(reader.result);
        setBroken(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[220px]">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
      <div className="flex items-center gap-3">
        {broken ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/15 grid place-items-center text-xs font-semibold text-white shrink-0">
            {initials}
          </div>
        ) : (
          <img
            src={avatarSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-white/15 shrink-0"
          />
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Avatar display name"
          className="w-28 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <button
          type="button"
          onClick={() => setBroken((b) => !b)}
          className="text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          {broken ? 'Show Photo' : 'Test Fallback'}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-zinc-300 hover:text-white cursor-pointer"
        >
          Open Photo
        </button>
      </div>
    </div>
  );
}

function MediaBufferingPreview() {
  const [buffering, setBuffering] = useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-24 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <img
          src="/src/assets/images/logo_origami_bird_1794879331312.jpg"
          alt="Media frame"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-70"
        />
        {buffering ? (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs grid place-items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 rounded-full border-2 border-white/25 border-t-white"
              />
              <span className="text-[10px] text-white/90">Buffering...</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-black/25">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setBuffering((b) => !b)}
        className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
      >
        {buffering ? 'Resume Playback' : 'Simulate Buffer'}
      </button>
    </div>
  );
}

function EmptyFirstTimePreview() {
  const [created, setCreated] = useState(false);
  return created ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[240px] rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-medium text-white">Launch Deck</p>
        <p className="text-[11px] text-zinc-400">Created just now</p>
      </div>
      <button
        type="button"
        onClick={() => setCreated(false)}
        className="text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
      >
        Reset
      </button>
    </motion.div>
  ) : (
    <div className="w-full max-w-[240px] rounded-xl border border-dashed border-zinc-700 p-4 text-center">
      <p className="text-xs font-semibold text-zinc-100">No projects yet</p>
      <p className="mt-1 text-[11px] text-zinc-400">Start by creating your first workspace.</p>
      <button
        type="button"
        onClick={() => setCreated(true)}
        className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium cursor-pointer"
      >
        Create First Project
      </button>
    </div>
  );
}

function NoSearchResultsPreview() {
  const [query, setQuery] = useState('zxq-missing');
  return (
    <div className="w-full max-w-[240px] space-y-2.5">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
        />
      </div>
      {query.trim() ? (
        <div className="text-center py-2">
          <p className="text-xs text-zinc-300 truncate">No matches for "{query}"</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-1.5 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-emerald-400">Showing all 12 items</div>
      )}
    </div>
  );
}

function OfflineBannerPreview() {
  const [offline, setOffline] = useState(true);
  return (
    <div className="w-full max-w-[250px] space-y-3">
      <AnimatePresence mode="wait">
        {offline ? (
          <motion.div
            key="off"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px] flex items-center justify-between gap-2"
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>Offline mode</span>
            </span>
            <button
              type="button"
              onClick={() => setOffline(false)}
              className="underline font-medium shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="on"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-[11px] flex items-center justify-between"
          >
            <span className="inline-flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span>Back online</span>
            </span>
            <button
              type="button"
              onClick={() => setOffline(true)}
              className="underline cursor-pointer"
            >
              Test Offline
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Error404Preview() {
  const [retried, setRetried] = useState(false);
  return (
    <div className="text-center max-w-[220px]">
      <p className="text-[11px] font-mono text-rose-400">Error 404</p>
      <p className="mt-1 text-xs font-semibold text-zinc-100">
        {retried ? 'Still unreachable' : 'Page not found'}
      </p>
      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setRetried((r) => !r)}
          className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-900 text-[11px] font-medium cursor-pointer"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={() => setRetried(false)}
          className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-[11px] cursor-pointer"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

function FormShakePreview() {
  const [val, setVal] = useState('invalid-email');
  const [error, setError] = useState('Enter a valid email');
  const [shakeKey, setShakeKey] = useState(0);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.includes('@')) {
      setError('Enter a valid email');
      setShakeKey((k) => k + 1);
    } else {
      setError('');
    }
  };

  return (
    <form onSubmit={check} className="w-full max-w-[230px] space-y-2">
      <div className="flex gap-1.5">
        <motion.input
          key={shakeKey}
          animate={error ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.34 }}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setError('');
          }}
          className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-zinc-900 border text-xs text-zinc-100 focus:outline-none ${
            error ? 'border-rose-500' : 'border-zinc-700'
          }`}
        />
        <button
          type="submit"
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 shrink-0 cursor-pointer"
        >
          Check
        </button>
      </div>
      {error ? (
        <p className="text-[11px] text-rose-400">{error}</p>
      ) : (
        <p className="text-[11px] text-emerald-400">Looks valid</p>
      )}
    </form>
  );
}

function PageTransitionsPreview() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  return (
    <div className="w-full max-w-[220px] overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.button
            key="list"
            type="button"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            onClick={() => setView('detail')}
            className="w-full text-left p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
          >
            <p className="text-xs font-medium text-zinc-100">Project Alpha</p>
            <p className="text-[11px] text-blue-400 mt-1">Tap to slide in detail →</p>
          </motion.button>
        ) : (
          <motion.button
            key="detail"
            type="button"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}
            onClick={() => setView('list')}
            className="w-full text-left p-3.5 rounded-xl bg-zinc-800 border border-zinc-700 cursor-pointer"
          >
            <p className="text-xs font-medium text-white">Detail View</p>
            <p className="text-[11px] text-zinc-300 mt-1">← Tap to return</p>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full h-36 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden grid place-items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-100 cursor-pointer"
      >
        Open Sheet
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/55"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="absolute bottom-0 inset-x-0 rounded-t-2xl bg-zinc-800 border-t border-zinc-700 p-3 text-center"
            >
              <div className="mx-auto w-8 h-1 rounded-full bg-zinc-600 mb-2" />
              <p className="text-xs font-medium text-white">Quick Actions</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-1.5 text-[11px] text-blue-400 cursor-pointer"
              >
                Close Sheet
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalPopupPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full h-36 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden grid place-items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-100 cursor-pointer"
      >
        Open Modal
      </button>
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0 grid place-items-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-[190px] rounded-xl bg-zinc-800 border border-zinc-700 p-3 text-center shadow-xl"
            >
              <p className="text-xs font-semibold text-white">Confirm Action</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 px-3 py-1 rounded-lg bg-blue-600 text-[11px] text-white cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimatedTabsPreview() {
  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'Motion', 'Code'];
  return (
    <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTab(t)}
          className="relative px-3 py-1.5 text-xs font-medium text-zinc-200 cursor-pointer"
        >
          {tab === t && (
            <motion.span
              layoutId="lib-tab-pill"
              className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700/70"
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            />
          )}
          <span className="relative z-10">{t}</span>
        </button>
      ))}
    </div>
  );
}

function OnboardingCarouselPreview() {
  const [idx, setIdx] = useState(0);
  const slides = ['Upload logo', 'Pick physics', 'Copy code'];
  return (
    <div className="w-full max-w-[220px] rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 text-center">
      <div className="h-9 grid place-items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium text-white"
          >
            0{idx + 1}. {slides[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-4 bg-blue-500' : 'w-1.5 bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIdx((i) => (i + 1) % slides.length)}
          className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function ToastPreview() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  const push = (text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-1), { id, text }]);
  };

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = window.setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2400);
    return () => clearTimeout(t);
  }, [toasts]);

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <button
        type="button"
        onClick={() => push('Changes published')}
        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-100 cursor-pointer"
      >
        Trigger Toast
      </button>
      <div className="h-9 flex items-center justify-center">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] text-emerald-300 inline-flex items-center gap-2 shadow-lg"
            >
              <Check className="w-3 h-3" />
              <span>{t.text}</span>
              <button
                type="button"
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TogglesCheckboxesPreview() {
  const [on, setOn] = useState(true);
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center gap-6">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${
          on ? 'bg-blue-600 justify-end' : 'bg-zinc-700 justify-start'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="w-5 h-5 rounded-full bg-white shadow"
        />
      </button>

      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={`w-6 h-6 rounded-lg border grid place-items-center transition-colors cursor-pointer ${
          checked ? 'bg-blue-600 border-blue-500' : 'bg-zinc-900 border-zinc-700'
        }`}
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
          <motion.path
            d="M4.5 10.5 L8.5 14.5 L15.5 6.5"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          />
        </svg>
      </button>
    </div>
  );
}

function PressHoverPreview() {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, borderColor: 'rgba(59,130,246,0.55)' }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="w-48 text-left p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
    >
      <p className="text-xs font-semibold text-white">Interactive Card</p>
      <p className="mt-1 text-[11px] text-zinc-400">Hover &amp; press for spring feel</p>
    </motion.button>
  );
}

function CelebrationPreview() {
  const [burstKey, setBurstKey] = useState(1);
  const particles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 grid place-items-center">
        {particles.map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <motion.span
              key={`${burstKey}-${deg}`}
              initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
              animate={{
                x: Math.cos(rad) * 34,
                y: Math.sin(rad) * 34,
                scale: [1, 0],
                opacity: [1, 0],
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                backgroundColor: idx % 2 === 0 ? '#34D399' : '#60A5FA',
              }}
            />
          );
        })}
        <svg key={burstKey} viewBox="0 0 36 36" className="w-7 h-7" fill="none">
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
      <button
        type="button"
        onClick={() => setBurstKey((k) => k + 1)}
        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Celebrate</span>
      </button>
    </div>
  );
}
