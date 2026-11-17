import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeLoaderProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function WelcomeLoader({ isOpen, onComplete }: WelcomeLoaderProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      onComplete();
    }, 1750);
    return () => window.clearTimeout(timer);
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#090B10]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 44%, rgba(59, 130, 246, 0.22) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 66%)',
          }}
          role="status"
          aria-live="polite"
          aria-label="Welcome to Looma"
        >
          <div className="flex flex-col items-center text-center">
            {/* Looma Logo with Soft Living Aura */}
            <div className="relative grid place-items-center">
              <motion.div
                animate={{ scale: [0.94, 1.14, 0.94], opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(59,130,246,0.45) 60%, transparent 100%)',
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                transition={{
                  opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative w-24 h-24 rounded-[26px] shadow-2xl overflow-hidden border border-white/15"
              >
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="welcome-looma-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#171A24" />
                      <stop offset="100%" stopColor="#090B10" />
                    </linearGradient>
                    <linearGradient id="welcome-looma-strand" x1="36" y1="24" x2="84" y2="96" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="55%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <rect width="120" height="120" rx="28" fill="url(#welcome-looma-bg)" />
                  <path
                    d="M 75 34 C 75 20, 42 20, 42 38 C 42 54, 78 58, 78 78 C 78 96, 45 96, 45 82"
                    stroke="url(#welcome-looma-strand)"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 68 38 C 68 27, 49 27, 49 41 C 49 53, 71 57, 71 75 C 71 89, 52 89, 52 78"
                    stroke="#93C5FD"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 61 42 C 61 34, 56 34, 56 44 C 56 52, 64 56, 64 72 C 64 82, 59 82, 59 74"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Brand Name & Welcome Copy */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display text-3xl font-bold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(120deg, #FFFFFF 25%, #93C5FD 70%, #3B82F6 100%)',
              }}
            >
              Looma
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1.5 text-sm font-medium text-zinc-300"
            >
              Welcome to Looma
            </motion.p>

            {/* Clean Normal Progress Bar (no percentage numbers) */}
            <div className="mt-6 w-44 h-1 rounded-full bg-zinc-800/90 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.55, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #60A5FA 55%, #3B82F6 100%)',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
