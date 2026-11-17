import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { ExtractedPalette, LoaderConfig } from '../types/loader';
import { AliveLoader } from './AliveLoader';

interface FullscreenSplashProps {
  isOpen: boolean;
  config: LoaderConfig;
  palette: ExtractedPalette;
  autoCloseAfterMs?: number;
  onClose: () => void;
}

export function FullscreenSplash({
  isOpen,
  config,
  palette,
  autoCloseAfterMs,
  onClose,
}: FullscreenSplashProps) {
  const [splashProgress, setSplashProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSplashProgress(8);
    setCompleted(false);

    const start = performance.now();
    const totalDuration = autoCloseAfterMs ? autoCloseAfterMs - 450 : 3200;
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / totalDuration);
      // Ease out cubic for realistic app loading feel
      const eased = 1 - Math.pow(1 - ratio, 3);
      setSplashProgress(Math.round(8 + eased * 92));

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setCompleted(true);
      }
    };

    frameId = requestAnimationFrame(tick);

    let closeTimer: number | undefined;
    if (autoCloseAfterMs) {
      closeTimer = window.setTimeout(() => {
        onClose();
      }, autoCloseAfterMs);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [isOpen, autoCloseAfterMs, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const isLight = config.backdropMode === 'alabaster';
  const bg =
    config.backdropMode === 'alabaster'
      ? '#F5F4EF'
      : config.backdropMode === 'slate'
        ? '#121620'
        : '#090A0E';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
          style={{
            backgroundColor: bg,
            backgroundImage: `radial-gradient(circle at 50% 44%, ${palette.glow} 0%, transparent 62%)`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen splash"
            className={`fixed top-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
              isLight
                ? 'bg-zinc-900/10 hover:bg-zinc-900/15 text-zinc-800'
                : 'bg-white/10 hover:bg-white/15 text-zinc-200'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>{autoCloseAfterMs ? 'Skip Intro' : 'Exit Splash'}</span>
          </button>

          <AliveLoader
            config={config}
            palette={palette}
            progress={splashProgress}
            isPlaying={true}
            isCompleted={completed}
            replayKey={1}
            size="lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
