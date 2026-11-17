import React, { useId, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import type { ExtractedPalette, LoaderConfig, MaskShape } from '../types/loader';

interface AliveLoaderProps {
  config: LoaderConfig;
  palette: ExtractedPalette;
  progress: number;
  isPlaying: boolean;
  isCompleted: boolean;
  replayKey: number;
  size?: 'sm' | 'md' | 'lg';
  interactiveTilt?: boolean;
}

const SHAPE_RADIUS: Record<MaskShape, string> = {
  circle: '9999px',
  squircle: '28%',
  rounded: '18px',
  freeform: '0px',
};

const SIZE_MAP = {
  sm: { box: 64, stage: 120, ring: 88, stroke: 2.5 },
  md: { box: 104, stage: 184, ring: 138, stroke: 3 },
  lg: { box: 132, stage: 230, ring: 174, stroke: 3.5 },
};

export function VectorMonogram({
  color = '#F4F4F5',
  accent = '#60A5FA',
}: {
  color?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" aria-hidden="true">
      <rect width="120" height="120" rx="30" fill="#10131C" />
      <path
        d="M34 84V36C34 33.7909 35.7909 32 38 32H46C48.2091 32 50 33.7909 50 36V72H82C84.2091 72 86 73.7909 86 76V84C86 86.2091 84.2091 88 82 88H38C35.7909 88 34 86.2091 34 84Z"
        fill={color}
      />
      <circle cx="74" cy="46" r="14" fill={accent} />
      <circle cx="74" cy="46" r="6" fill="#10131C" />
    </svg>
  );
}

export function RibbonSLogo({
  animateAction = false,
  duration = 3.4,
  intensity = 1,
}: {
  animateAction?: boolean;
  duration?: number;
  intensity?: number;
}) {
  const glowId = useId();

  const paths = [
    {
      d: 'M 75 34 C 75 20, 42 20, 42 38 C 42 54, 78 58, 78 78 C 78 96, 45 96, 45 82',
      stroke: '#67E8F9',
      delay: 0,
    },
    {
      d: 'M 68 38 C 68 27, 49 27, 49 41 C 49 53, 71 57, 71 75 C 71 89, 52 89, 52 78',
      stroke: '#A78BFA',
      delay: 0.03,
    },
    {
      d: 'M 61 42 C 61 34, 56 34, 56 44 C 56 52, 64 56, 64 72 C 64 82, 59 82, 59 74',
      stroke: '#F472B6',
      delay: 0.06,
    },
  ];

  const mirrorPaths = [
    {
      d: 'M 45 82 C 45 96, 78 96, 78 78 C 78 58, 42 54, 42 38 C 42 20, 75 20, 75 34',
      stroke: '#F472B6',
    },
    {
      d: 'M 52 78 C 52 89, 71 89, 71 75 C 71 57, 49 53, 49 41 C 49 27, 68 27, 68 38',
      stroke: '#A78BFA',
    },
    {
      d: 'M 59 74 C 59 82, 64 82, 64 72 C 64 56, 56 52, 56 44 C 56 34, 61 34, 61 42',
      stroke: '#67E8F9',
    },
  ];

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="120" height="120" rx="28" fill="#1F1F25" />

      <motion.g
        filter={`url(#${glowId})`}
        style={{ originX: '60px', originY: '60px' }}
        animate={
          animateAction
            ? {
                rotate: [0, 0, -180 * intensity, -360, -360],
                scale: [1, 0.92, 0.78, 0.95, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={{
          duration,
          times: [0, 0.16, 0.5, 0.84, 1],
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      >
        {animateAction ? (
          <>
            {paths.map((p, idx) => (
              <motion.path
                key={`a-${idx}`}
                d={p.d}
                stroke={p.stroke}
                strokeWidth="4.4"
                strokeLinecap="round"
                initial={{ pathLength: 1, pathOffset: 0 }}
                animate={{
                  pathLength: [1, 0.02, 0.02, 1, 1],
                  pathOffset: [0, 0.48, 0.48, 0, 0],
                }}
                transition={{
                  duration,
                  times: [0, 0.28, 0.56, 0.86, 1],
                  repeat: Infinity,
                  delay: p.delay,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            ))}
            {mirrorPaths.map((p, idx) => (
              <motion.path
                key={`b-${idx}`}
                d={p.d}
                stroke={p.stroke}
                strokeWidth="4.4"
                strokeLinecap="round"
                initial={{ pathLength: 0.02, opacity: 0 }}
                animate={{
                  pathLength: [0.02, 0.16, 0.02, 0.02, 0.02],
                  pathOffset: [0.12, 0.35, 0.52, 0.12, 0.12],
                  opacity: [0, 0.95, 0.95, 0, 0],
                }}
                transition={{
                  duration,
                  times: [0, 0.26, 0.56, 0.78, 1],
                  repeat: Infinity,
                  delay: idx * 0.03,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
            ))}
          </>
        ) : (
          paths.map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              stroke={p.stroke}
              strokeWidth="4.4"
              strokeLinecap="round"
            />
          ))
        )}
      </motion.g>
    </svg>
  );
}

export function AliveLoader({
  config,
  palette,
  progress,
  isPlaying,
  isCompleted,
  replayKey,
  size = 'lg',
  interactiveTilt = true,
}: AliveLoaderProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const gooFilterId = useId();

  const dims = SIZE_MAP[size];
  const radius = SHAPE_RADIUS[config.maskShape];
  const speed = Math.max(0.4, config.speed);
  const amp = config.intensity;
  const activeMotion = isPlaying && !prefersReduced;
  const auraMixMode = config.auraMixMode ?? 'swirl';
  const uiTextTheme = config.uiTextTheme ?? 'gradient';

  const prevSrcRef = useRef(config.imageSrc);
  if (prevSrcRef.current !== config.imageSrc) {
    prevSrcRef.current = config.imageSrc;
    if (imgError) setImgError(false);
  }

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 180, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 180, damping: 22 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-11, 11]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [11, -11]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveTilt || prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const isLightBackdrop = config.backdropMode === 'alabaster';
  const primaryTextClass = isLightBackdrop ? 'text-zinc-900' : 'text-zinc-100';
  const mutedTextClass = isLightBackdrop ? 'text-zinc-600' : 'text-zinc-400';

  const duration = 2.6 / speed;
  const actionDuration = 3.5 / speed;
  const isNativeRibbonS = config.presetKind === 'ribbon-s' && config.motionStyle === 'ribbon';

  const bodyAnimate = useMemo(() => {
    if (!activeMotion) {
      return {
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        filter: 'blur(0px)',
      };
    }
    if (isCompleted) {
      return {
        scale: [1, 1.09, 1],
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        filter: 'blur(0px)',
      };
    }

    switch (config.motionStyle) {
      case 'ribbon':
        if (config.presetKind === 'ribbon-s') {
          return { scale: [1, 1 + 0.025 * amp, 1] };
        }
        return {
          scale: [1, 0.28, 0.28, 1.04, 1],
          rotate: [0, -85, 95, -4, 0],
          opacity: [1, 0.08, 0.08, 1, 1],
          filter: ['blur(0px)', 'blur(4px)', 'blur(4px)', 'blur(0px)', 'blur(0px)'],
        };
      case 'glue':
        return {
          scale: [0.36, 1.06, 1, 1, 0.36],
          rotate: [-160 * amp, 8, 0, 0, 140 * amp],
          opacity: [0.1, 1, 1, 1, 0.1],
          filter: ['blur(5px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
        };
      case 'cardiac':
        return {
          scale: [1, 1 + 0.085 * amp, 0.985, 1 + 0.055 * amp, 1],
          rotate: [0, -0.8 * amp, 0.6 * amp, 0],
        };
      case 'specular':
        return {
          scale: [1, 1 + 0.03 * amp, 1],
          rotateY: [-6 * amp, 6 * amp, -6 * amp],
          rotateX: [4 * amp, -4 * amp, 4 * amp],
        };
      case 'levitate':
        return {
          y: [0, -12 * amp, 0],
          rotate: [-1.8 * amp, 1.8 * amp, -1.8 * amp],
          scale: [1, 1 + 0.025 * amp, 1],
        };
      case 'elastic':
        return {
          scaleX: [1, 1 + 0.11 * amp, 1 - 0.08 * amp, 1 + 0.03 * amp, 1],
          scaleY: [1, 1 - 0.1 * amp, 1 + 0.11 * amp, 1 - 0.03 * amp, 1],
          y: [0, 4 * amp, -10 * amp, 0],
        };
      case 'aperture':
        return {
          scale: [1 - 0.04 * amp, 1 + 0.03 * amp, 1 - 0.04 * amp],
          filter: ['blur(2.5px)', 'blur(0px)', 'blur(0px)', 'blur(2.5px)'],
        };
      case 'echo':
        return {
          scale: [0.97, 1 + 0.04 * amp, 0.97],
          opacity: [0.92, 1, 0.92],
        };
      case 'pendulum':
        return {
          rotate: [-11 * amp, 11 * amp, -11 * amp],
          x: [-7 * amp, 7 * amp, -7 * amp],
          y: [0, -4 * amp, 0, -4 * amp, 0],
        };
      case 'vortex':
        return {
          rotate: [0, 180, 360],
          scale: [1, 0.84, 1],
        };
      case 'origami':
        return {
          rotateY: [0, 180, 360],
          scale: [1, 0.92, 1],
        };
      case 'ripple':
        return {
          scale: [1, 1 + 0.05 * amp, 1],
          y: [0, -4 * amp, 0],
        };
      case 'neon':
        return {
          scale: [1, 1 + 0.035 * amp, 1],
          filter: [
            `drop-shadow(0 0 8px ${palette.primary})`,
            `drop-shadow(0 0 ${Math.round(24 * amp)}px ${palette.secondary})`,
            `drop-shadow(0 0 8px ${palette.primary})`,
          ],
        };
      case 'prism':
        return {
          x: [0, -2 * amp, 2 * amp, 0],
          scale: [1, 1.02, 0.99, 1],
        };
      case 'satellite':
        return {
          scale: [1, 1 + 0.03 * amp, 1],
          rotate: [-1.5, 1.5, -1.5],
        };
      case 'gravity':
        return {
          y: [-16 * amp, 6 * amp, -6 * amp, 0, -16 * amp],
          scaleY: [1, 0.88, 1.04, 1, 1],
          scaleX: [1, 1.1, 0.96, 1, 1],
        };
      case 'scanner':
        return {
          scale: [1, 1.02, 1],
          opacity: [0.94, 1, 0.94],
        };
      case 'bloom':
        return {
          scale: [0.93, 1 + 0.06 * amp, 0.93],
          rotate: [-2 * amp, 2 * amp, -2 * amp],
        };
      case 'compass':
        return {
          rotate: [0, 90, 90, 180, 180, 270, 270, 360],
          scale: [1, 0.96, 1, 0.96, 1, 0.96, 1, 1],
        };
      case 'warp':
        return {
          scale: [0.58, 1.05, 1, 0.58],
          opacity: [0.22, 1, 1, 0.22],
          filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
        };
      case 'halo':
        return {
          scale: [1, 1 + 0.035 * amp, 1],
        };
      case 'drift':
        return {
          rotateX: [-7 * amp, 7 * amp, -7 * amp],
          rotateY: [7 * amp, -7 * amp, 7 * amp],
          y: [-5 * amp, 5 * amp, -5 * amp],
        };
    }
  }, [activeMotion, isCompleted, config.motionStyle, config.presetKind, amp, palette.primary, palette.secondary]);

  const bodyTransition = useMemo(() => {
    if (isCompleted) {
      return { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };
    }
    switch (config.motionStyle) {
      case 'ribbon':
        if (config.presetKind === 'ribbon-s') {
          return { duration: actionDuration, repeat: Infinity, ease: 'easeInOut' as const };
        }
        return {
          duration: actionDuration,
          times: [0, 0.25, 0.55, 0.84, 1],
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1] as const,
        };
      case 'glue':
        return {
          duration: actionDuration,
          times: [0, 0.36, 0.56, 0.78, 1],
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1] as const,
        };
      case 'cardiac':
        return {
          duration: duration * 0.95,
          times: [0, 0.16, 0.3, 0.44, 1],
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
      case 'elastic':
        return {
          duration: duration * 0.85,
          times: [0, 0.25, 0.52, 0.78, 1],
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
      case 'aperture':
        return {
          duration: duration * 1.15,
          times: [0, 0.35, 0.72, 1],
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
      case 'vortex':
      case 'origami':
        return {
          duration: actionDuration * 0.9,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1] as const,
        };
      case 'compass':
        return {
          duration: actionDuration * 1.25,
          times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 1],
          repeat: Infinity,
          ease: [0.34, 1.56, 0.64, 1] as const,
        };
      case 'gravity':
        return {
          duration: duration * 0.9,
          times: [0, 0.35, 0.6, 0.82, 1],
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
      case 'warp':
        return {
          duration: actionDuration,
          times: [0, 0.4, 0.72, 1],
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1] as const,
        };
      default:
        return {
          duration,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
    }
  }, [config.motionStyle, config.presetKind, duration, actionDuration, isCompleted]);

  const ringRadius = (dims.ring - dims.stroke * 2) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = ringCircumference * (1 - clampedProgress / 100);

  const motes = useMemo(
    () => [
      { x: -64, y: -42, tx: '-10px', ty: '-22px', delay: '0s', size: 5 },
      { x: 68, y: -30, tx: '12px', ty: '-18px', delay: '0.8s', size: 4 },
      { x: -56, y: 48, tx: '-14px', ty: '-16px', delay: '1.4s', size: 3.5 },
      { x: 58, y: 52, tx: '8px', ty: '-24px', delay: '0.4s', size: 4.5 },
      { x: 4, y: -74, tx: '6px', ty: '-16px', delay: '1.9s', size: 3 },
    ],
    []
  );

  const renderMediaContent = () => {
    if (config.presetKind === 'ribbon-s') {
      return (
        <RibbonSLogo
          animateAction={activeMotion && !isCompleted && config.motionStyle === 'ribbon'}
          duration={actionDuration}
          intensity={amp}
        />
      );
    }
    if (config.presetKind === 'vector') {
      return <VectorMonogram color={palette.secondary} accent={palette.primary} />;
    }
    if (imgError) {
      return (
        <div
          className="w-full h-full flex items-center justify-center font-display font-bold text-2xl"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
            color: '#FFFFFF',
          }}
        >
          {config.appName.slice(0, 2).toUpperCase() || 'LM'}
        </div>
      );
    }
    return (
      <img
        src={config.imageSrc}
        alt={`${config.appName} logo`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`w-full h-full ${
          config.maskShape === 'freeform' ? 'object-contain' : 'object-cover'
        }`}
      />
    );
  };

  // Mixed Multi-Color Aura gradient computation (e.g. White + Blue mixed together in one field)
  const mixedAuraStyle = useMemo(() => {
    if (auraMixMode === 'swirl') {
      return {
        background: `conic-gradient(from 0deg, ${palette.primary}66, ${palette.secondary}88, #ffffff55, ${palette.primary}66)`,
      };
    }
    if (auraMixMode === 'mist') {
      return {
        background: `radial-gradient(circle at 32% 32%, ${palette.primary}88 0%, transparent 56%), radial-gradient(circle at 68% 68%, ${palette.secondary}88 0%, transparent 60%), radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 72%)`,
      };
    }
    return {
      background: `radial-gradient(circle at 38% 38%, ${palette.primary}77 0%, ${palette.secondary}55 45%, transparent 74%)`,
    };
  }, [auraMixMode, palette.primary, palette.secondary]);

  const titleClassName = useMemo(() => {
    const baseSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-xl';
    if (uiTextTheme === 'editorial') {
      return `${baseSize} font-serif italic tracking-normal font-semibold ${primaryTextClass}`;
    }
    if (uiTextTheme === 'mono') {
      return `${baseSize} font-mono uppercase tracking-[0.14em] font-medium ${primaryTextClass}`;
    }
    if (uiTextTheme === 'clean') {
      return `${baseSize} font-display tracking-tight font-semibold ${primaryTextClass}`;
    }
    return `${baseSize} font-display tracking-tight font-bold bg-clip-text text-transparent`;
  }, [size, uiTextTheme, primaryTextClass]);

  const titleInlineStyle =
    uiTextTheme === 'gradient'
      ? {
          backgroundImage: isLightBackdrop
            ? `linear-gradient(120deg, #0f172a 15%, ${palette.secondary} 90%)`
            : `linear-gradient(120deg, #ffffff 20%, ${palette.primary} 65%, ${palette.secondary} 100%)`,
        }
      : undefined;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex flex-col items-center justify-center select-none"
      style={{ perspective: 900 }}
    >
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={gooFilterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="7.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Living Stage */}
      <motion.div
        key={replayKey}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.76, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: dims.stage,
          height: dims.stage,
          rotateX: interactiveTilt && !prefersReduced ? rotateX : 0,
          rotateY: interactiveTilt && !prefersReduced ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="relative grid place-items-center"
      >
        {/* 1. Mixed Multi-Color Ambient Aura */}
        <motion.div
          aria-hidden="true"
          animate={
            activeMotion
              ? {
                  scale: [0.94, 1.2 + 0.08 * amp, 0.94],
                  rotate: auraMixMode === 'swirl' ? [0, 360] : [0, 12, 0],
                  opacity: [0.35, 0.72, 0.35],
                }
              : { scale: 1, opacity: 0.4 }
          }
          transition={{ duration: duration * 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: dims.box * 1.52,
            height: dims.box * 1.52,
            ...mixedAuraStyle,
            filter: 'blur(24px)',
          }}
        />

        {/* 2. Liquid Glue Metaball Layer */}
        {config.motionStyle === 'glue' && activeMotion && !isCompleted && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center pointer-events-none"
            style={{ filter: `url(#${gooFilterId})` }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: actionDuration,
              repeat: Infinity,
              ease: [0.55, 0.05, 0.45, 0.95],
            }}
          >
            <motion.div
              animate={{ scale: [0.68, 1.15, 0.92, 0.68] }}
              transition={{
                duration: actionDuration,
                times: [0, 0.36, 0.72, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="rounded-full"
              style={{
                width: dims.box * 0.78,
                height: dims.box * 0.78,
                backgroundColor: palette.primary,
              }}
            />
            {[0, 90, 180, 270].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = dims.box * 0.56 * amp;
              const tx = Math.cos(rad) * dist;
              const ty = Math.sin(rad) * dist;
              const dropSize = dims.box * (i % 2 === 0 ? 0.34 : 0.26);
              return (
                <motion.div
                  key={angle}
                  animate={{
                    x: [tx, 0, 0, tx],
                    y: [ty, 0, 0, ty],
                    scale: [1, 0.65, 0.65, 1],
                  }}
                  transition={{
                    duration: actionDuration,
                    times: [0, 0.36, 0.76, 1],
                    repeat: Infinity,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="absolute rounded-full"
                  style={{
                    width: dropSize,
                    height: dropSize,
                    backgroundColor: i % 2 === 0 ? palette.primary : palette.secondary,
                  }}
                />
              );
            })}
          </motion.div>
        )}

        {/* 3. Ribbon Orbit Layer */}
        {config.motionStyle === 'ribbon' && !isNativeRibbonS && activeMotion && !isCompleted && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center pointer-events-none"
            animate={{
              rotate: [0, -180, -360],
              scale: [0.7, 1.05, 0.7],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: actionDuration,
              times: [0, 0.32, 0.62, 1],
              repeat: Infinity,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            {[-1, 1].map((dir) => (
              <div
                key={dir}
                className="absolute flex items-center gap-1.5"
                style={{ transform: `translateY(${dir * dims.box * 0.28}px)` }}
              >
                {[palette.primary, '#A78BFA', palette.secondary].map((dotColor, idx) => (
                  <span
                    key={idx}
                    className="rounded-full"
                    style={{
                      width: size === 'sm' ? 6 : 9,
                      height: size === 'sm' ? 6 : 9,
                      backgroundColor: dotColor,
                      boxShadow: `0 0 12px ${dotColor}`,
                    }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        )}

        {/* 4. Cardiac & Sonar Ripple Waves */}
        {(config.motionStyle === 'cardiac' || config.motionStyle === 'ripple') &&
          activeMotion &&
          !isCompleted && (
            <>
              {(config.motionStyle === 'ripple' ? [0, 1, 2] : [0, 1]).map((idx) => (
                <motion.div
                  key={idx}
                  aria-hidden="true"
                  initial={{ scale: 0.85, opacity: 0.6 }}
                  animate={{ scale: 1.6 + 0.18 * amp, opacity: 0 }}
                  transition={{
                    duration: duration * (config.motionStyle === 'ripple' ? 1.25 : 0.95),
                    repeat: Infinity,
                    delay: idx * (duration * 0.28),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute pointer-events-none"
                  style={{
                    width: dims.box,
                    height: dims.box,
                    borderRadius:
                      config.motionStyle === 'ripple'
                        ? '9999px'
                        : radius === '0px'
                          ? '9999px'
                          : radius,
                    border: `1.5px solid ${idx % 2 === 0 ? palette.primary : palette.secondary}`,
                  }}
                />
              ))}
            </>
          )}

        {/* 5. Chromatic Echo & Prism Split Silhouettes */}
        {(config.motionStyle === 'echo' || config.motionStyle === 'prism') &&
          activeMotion &&
          !isCompleted && (
            <>
              {[0, 1].map((layer) => (
                <motion.div
                  key={layer}
                  aria-hidden="true"
                  animate={
                    config.motionStyle === 'prism'
                      ? {
                          x: layer === 0 ? [-7 * amp, 3 * amp, 0, -7 * amp] : [7 * amp, -3 * amp, 0, 7 * amp],
                          y: layer === 0 ? [-2 * amp, 2 * amp, 0, -2 * amp] : [2 * amp, -2 * amp, 0, 2 * amp],
                          opacity: [0.45, 0.22, 0.08, 0.45],
                        }
                      : {
                          scale: [1, 1.18 + layer * 0.14 * amp, 1],
                          opacity: [0.34 - layer * 0.12, 0.06, 0.34 - layer * 0.12],
                        }
                  }
                  transition={{
                    duration: duration * 1.1,
                    repeat: Infinity,
                    delay: layer * 0.18,
                    ease: 'easeInOut',
                  }}
                  className="absolute overflow-hidden pointer-events-none"
                  style={{
                    width: dims.box,
                    height: dims.box,
                    borderRadius: radius,
                    filter: config.motionStyle === 'prism' ? 'blur(1px)' : 'blur(2px)',
                    boxShadow:
                      config.motionStyle === 'prism'
                        ? `0 0 0 2px ${layer === 0 ? palette.primary : palette.secondary}`
                        : undefined,
                  }}
                >
                  {renderMediaContent()}
                </motion.div>
              ))}
            </>
          )}

        {/* 6. Petal Bloom & Halo Crown Rings */}
        {config.motionStyle === 'bloom' && activeMotion && !isCompleted && (
          <motion.div
            aria-hidden="true"
            animate={{ rotate: [0, 90], scale: [0.85, 1.14 * amp, 0.85] }}
            transition={{ duration: duration * 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 grid place-items-center pointer-events-none"
          >
            {[0, 45, 90, 135].map((deg, idx) => (
              <div
                key={deg}
                className="absolute rounded-3xl"
                style={{
                  width: dims.box * 1.18,
                  height: dims.box * 1.18,
                  transform: `rotate(${deg}deg)`,
                  border: `1.5px solid ${idx % 2 === 0 ? palette.primary : palette.secondary}`,
                  opacity: 0.35,
                }}
              />
            ))}
          </motion.div>
        )}

        {config.motionStyle === 'halo' && activeMotion && !isCompleted && (
          <motion.div
            aria-hidden="true"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2.2 / speed, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: dims.box + 22,
              height: dims.box + 22,
              padding: 3,
              background: `conic-gradient(from 0deg, ${palette.primary}, ${palette.secondary}, transparent 65%, ${palette.primary})`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}

        {/* 7. Satellite Lock Orbiting Moons */}
        {config.motionStyle === 'satellite' && activeMotion && !isCompleted && (
          <motion.div
            aria-hidden="true"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2.6 / speed, repeat: Infinity, ease: 'linear' }}
            className="absolute pointer-events-none"
            style={{ width: dims.ring + 16, height: dims.ring + 16 }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: size === 'sm' ? 7 : 10,
                height: size === 'sm' ? 7 : 10,
                backgroundColor: palette.primary,
                boxShadow: `0 0 14px ${palette.primary}`,
              }}
            />
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: size === 'sm' ? 6 : 8,
                height: size === 'sm' ? 6 : 8,
                backgroundColor: palette.secondary,
                boxShadow: `0 0 14px ${palette.secondary}`,
              }}
            />
          </motion.div>
        )}

        {/* 8. Aperture / Specular / Vortex Rings */}
        {(config.motionStyle === 'aperture' ||
          config.motionStyle === 'specular' ||
          config.motionStyle === 'vortex') && (
          <svg
            aria-hidden="true"
            width={dims.ring + 18}
            height={dims.ring + 18}
            viewBox="0 0 180 180"
            className={`absolute pointer-events-none ${activeMotion ? 'animate-spin-slow' : ''}`}
            style={{ ['--orbit-duration' as string]: `${(config.motionStyle === 'vortex' ? 4.2 / speed : 10 / speed).toFixed(1)}s` }}
          >
            <circle
              cx="90"
              cy="90"
              r="82"
              fill="none"
              stroke={palette.primary}
              strokeOpacity={config.motionStyle === 'specular' ? 0.35 : 0.6}
              strokeWidth="1.5"
              strokeDasharray={config.motionStyle === 'vortex' ? '26 12 8 12' : config.motionStyle === 'aperture' ? '14 10 4 10' : '42 28'}
              strokeLinecap="round"
            />
            {(config.motionStyle === 'aperture' || config.motionStyle === 'vortex') && (
              <circle
                cx="90"
                cy="90"
                r="72"
                fill="none"
                stroke={palette.secondary}
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeDasharray="8 12"
              />
            )}
          </svg>
        )}

        {/* 9. Levitate / Gravity Floor Shadow & Floating Light Motes */}
        {(config.motionStyle === 'levitate' ||
          config.motionStyle === 'gravity' ||
          config.motionStyle === 'drift') && (
          <>
            <motion.div
              aria-hidden="true"
              animate={
                activeMotion
                  ? { scaleX: [1, 0.7, 1], opacity: [0.45, 0.18, 0.45] }
                  : { scaleX: 0.9, opacity: 0.3 }
              }
              transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute pointer-events-none rounded-full"
              style={{
                bottom: size === 'sm' ? 10 : 18,
                width: dims.box * 0.72,
                height: 12,
                background: isLightBackdrop ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.65)',
                filter: 'blur(7px)',
              }}
            />
            {activeMotion &&
              (config.motionStyle === 'levitate' || config.motionStyle === 'drift') &&
              motes.map((m, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute rounded-full pointer-events-none animate-mote"
                  style={{
                    width: m.size,
                    height: m.size,
                    left: `calc(50% + ${m.x * (size === 'sm' ? 0.55 : 1)}px)`,
                    top: `calc(50% + ${m.y * (size === 'sm' ? 0.55 : 1)}px)`,
                    backgroundColor: i % 2 === 0 ? palette.primary : palette.secondary,
                    boxShadow: `0 0 10px ${palette.primary}`,
                    animationDelay: m.delay,
                    ['--tx' as string]: m.tx,
                    ['--ty' as string]: m.ty,
                    ['--mote-duration' as string]: `${(3.6 / speed).toFixed(2)}s`,
                  }}
                />
              ))}
          </>
        )}

        {/* 10. Orbital Progress Ring */}
        {config.progressStyle === 'ring' && (
          <svg
            width={dims.ring}
            height={dims.ring}
            viewBox={`0 0 ${dims.ring} ${dims.ring}`}
            className="absolute pointer-events-none -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={dims.ring / 2}
              cy={dims.ring / 2}
              r={ringRadius}
              fill="none"
              stroke={isLightBackdrop ? 'rgba(24,24,27,0.1)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={dims.stroke}
            />
            <motion.circle
              cx={dims.ring / 2}
              cy={dims.ring / 2}
              r={ringRadius}
              fill="none"
              stroke={isCompleted ? '#22C55E' : palette.primary}
              strokeWidth={dims.stroke}
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </svg>
        )}

        {/* 11. Core Living Picture / Logo Container */}
        <motion.div
          animate={bodyAnimate}
          transition={bodyTransition}
          className="relative overflow-hidden"
          style={{
            width: dims.box,
            height: dims.box,
            borderRadius: radius,
            boxShadow:
              config.motionStyle === 'neon'
                ? `0 0 28px -4px ${palette.primary}, 0 0 0 1.5px ${palette.secondary}`
                : config.maskShape === 'freeform'
                  ? `0 18px 40px -12px ${palette.glow}`
                  : isLightBackdrop
                    ? '0 20px 44px -14px rgba(15, 23, 42, 0.24), 0 0 0 1px rgba(15, 23, 42, 0.08)'
                    : '0 24px 48px -14px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.14)',
          }}
        >
          {renderMediaContent()}

          {/* Laser Scan Beam */}
          {config.motionStyle === 'scanner' && activeMotion && !isCompleted && (
            <div
              aria-hidden="true"
              className="absolute inset-x-0 h-1/3 pointer-events-none animate-scan-beam"
              style={{
                ['--scan-duration' as string]: `${(2.2 / speed).toFixed(2)}s`,
                background: `linear-gradient(180deg, transparent 0%, ${palette.primary}88 50%, ${palette.secondary}CC 52%, transparent 100%)`,
              }}
            />
          )}

          {/* Diagonal Specular Sheen Overlay */}
          {activeMotion && !isNativeRibbonS && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none animate-sheen"
              style={{
                ['--sheen-duration' as string]: `${(3.1 / speed).toFixed(2)}s`,
                background:
                  config.motionStyle === 'specular'
                    ? 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.42) 48%, transparent 72%)'
                    : 'linear-gradient(105deg, transparent 34%, rgba(255,255,255,0.16) 50%, transparent 66%)',
              }}
            />
          )}

          {config.maskShape !== 'freeform' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: radius,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.24)',
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* 12. App Identity, Loading Copy & Progress */}
      <div className={`${size === 'sm' ? 'mt-3' : 'mt-6'} flex flex-col items-center text-center max-w-xs px-4`}>
        <h3 className={titleClassName} style={titleInlineStyle}>
          {config.appName || 'App Name'}
        </h3>

        <div className={`mt-1 flex items-center gap-2 text-xs ${mutedTextClass}`}>
          <span>{isCompleted ? 'Ready' : config.loadingPhrase || 'Loading experience'}</span>
          {config.showPercentage && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{Math.round(clampedProgress)}%</span>
            </>
          )}
        </div>

        {config.progressStyle === 'bar' && (
          <div
            className={`mt-4 h-1.5 rounded-full overflow-hidden ${
              size === 'sm' ? 'w-32' : 'w-48'
            } ${isLightBackdrop ? 'bg-zinc-900/10' : 'bg-white/10'}`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: isCompleted
                  ? '#22C55E'
                  : `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
              }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        )}

        {config.progressStyle === 'dots' && (
          <div className="mt-4 flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: isCompleted
                    ? '#22C55E'
                    : dot % 2 === 0
                      ? palette.primary
                      : palette.secondary,
                }}
                animate={
                  activeMotion && !isCompleted
                    ? {
                        scale: [0.75, 1.35, 0.75],
                        opacity: [0.35, 1, 0.35],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={{
                  duration: 1.1 / speed,
                  repeat: Infinity,
                  delay: dot * (0.18 / speed),
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
