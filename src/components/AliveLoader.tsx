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

/**
 * High-craft 3-ribbon intertwined "S" mark inspired by the reference video.
 * Retracts along its curves into 2x3 orbiting glowing beads, rotates, and draws back out.
 */
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

  // Three parallel intertwined S-ribbons (outer, middle, inner)
  const paths = [
    {
      d: 'M 75 34 C 75 20, 42 20, 42 38 C 42 54, 78 58, 78 78 C 78 96, 45 96, 45 82',
      stroke: '#67E8F9', // cyan
      delay: 0,
    },
    {
      d: 'M 68 38 C 68 27, 49 27, 49 41 C 49 53, 71 57, 71 75 C 71 89, 52 89, 52 78',
      stroke: '#A78BFA', // lavender
      delay: 0.03,
    },
    {
      d: 'M 61 42 C 61 34, 56 34, 56 44 C 56 52, 64 56, 64 72 C 64 82, 59 82, 59 74',
      stroke: '#F472B6', // coral pink
      delay: 0.06,
    },
  ];

  // Reverse half-paths so each ribbon leaves a symmetric pair of glowing beads when retracted
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
            {/* Primary retracting & drawing S-strands */}
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

            {/* Counter-cluster beads emerging during the orbit phase */}
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

  // Reset image error when src changes
  const prevSrcRef = useRef(config.imageSrc);
  if (prevSrcRef.current !== config.imageSrc) {
    prevSrcRef.current = config.imageSrc;
    if (imgError) setImgError(false);
  }

  // Magnetic 3D pointer parallax without causing React re-renders
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

  // Is the active visual the bespoke Ribbon S SVG with ribbon choreography?
  const isNativeRibbonS = config.presetKind === 'ribbon-s' && config.motionStyle === 'ribbon';

  // Compute main body animation keyframes per choreography style
  const bodyAnimate = useMemo(() => {
    if (!activeMotion) {
      return {
        scale: 1,
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
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        filter: 'blur(0px)',
      };
    }

    switch (config.motionStyle) {
      case 'ribbon':
        if (config.presetKind === 'ribbon-s') {
          // Ribbon S handles its own internal SVG stroke morphing, container subtly breathes
          return {
            scale: [1, 1 + 0.025 * amp, 1],
          };
        }
        // For uploaded pictures & other logos: collapse cleanly while orbiting beads spin, then emerge!
        return {
          scale: [1, 0.28, 0.28, 1.04, 1],
          rotate: [0, -85, 95, -4, 0],
          opacity: [1, 0.08, 0.08, 1, 1],
          filter: ['blur(0px)', 'blur(4px)', 'blur(4px)', 'blur(0px)', 'blur(0px)'],
        };

      case 'glue':
        // Viscous liquid-glue spin: picture pulls into the rotating core and stretches/emerges out cleanly
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
    }
  }, [activeMotion, isCompleted, config.motionStyle, config.presetKind, amp]);

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
      default:
        return {
          duration,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        };
    }
  }, [config.motionStyle, config.presetKind, duration, actionDuration, isCompleted]);

  // Orbital progress ring geometry
  const ringRadius = (dims.ring - dims.stroke * 2) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = ringCircumference * (1 - clampedProgress / 100);

  // Floating particles for Levitation
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

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="flex flex-col items-center justify-center select-none"
      style={{ perspective: 900 }}
    >
      {/* Hidden SVG Metaball Goo Filter for Liquid Glue Choreography */}
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
        {/* 1. Ambient Adaptive Aura */}
        <motion.div
          aria-hidden="true"
          animate={
            activeMotion
              ? {
                  scale: [0.92, 1.18 + 0.08 * amp, 0.92],
                  opacity: [0.28, 0.62, 0.28],
                }
              : { scale: 1, opacity: 0.35 }
          }
          transition={{ duration: duration * 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: dims.box * 1.45,
            height: dims.box * 1.45,
            background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
            filter: 'blur(22px)',
          }}
        />

        {/* 2. Liquid Glue Metaball Layer ("rotate like glue and bring out the logo picture") */}
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
            {/* Central glue nucleus */}
            <motion.div
              animate={{
                scale: [0.68, 1.15, 0.92, 0.68],
              }}
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

            {/* Orbiting sticky glue droplets that pull out and snap back into the core */}
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

        {/* 3. Ribbon Orbit Layer for Custom Pictures & Logos (matching video's orbiting 2x3 glowing beads) */}
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
            {/* Two symmetric clusters of 3 glowing beads */}
            {[-1, 1].map((dir) => (
              <div
                key={dir}
                className="absolute flex items-center gap-1.5"
                style={{
                  transform: `translateY(${dir * dims.box * 0.28}px)`,
                }}
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

        {/* 4. Cardiac Acoustic Ripple Waves */}
        {config.motionStyle === 'cardiac' && activeMotion && !isCompleted && (
          <>
            {[0, 1].map((idx) => (
              <motion.div
                key={idx}
                aria-hidden="true"
                initial={{ scale: 0.85, opacity: 0.55 }}
                animate={{ scale: 1.55 + 0.15 * amp, opacity: 0 }}
                transition={{
                  duration: duration * 0.95,
                  repeat: Infinity,
                  delay: idx * (duration * 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute pointer-events-none"
                style={{
                  width: dims.box,
                  height: dims.box,
                  borderRadius: radius === '0px' ? '9999px' : radius,
                  border: `1.5px solid ${palette.primary}`,
                }}
              />
            ))}
          </>
        )}

        {/* 5. Chromatic Echo Silhouette Layers */}
        {config.motionStyle === 'echo' && activeMotion && !isCompleted && (
          <>
            {[0, 1].map((layer) => (
              <motion.div
                key={layer}
                aria-hidden="true"
                animate={{
                  scale: [1, 1.18 + layer * 0.14 * amp, 1],
                  opacity: [0.34 - layer * 0.12, 0.06, 0.34 - layer * 0.12],
                }}
                transition={{
                  duration: duration * 1.2,
                  repeat: Infinity,
                  delay: layer * 0.22,
                  ease: 'easeInOut',
                }}
                className="absolute overflow-hidden pointer-events-none"
                style={{
                  width: dims.box,
                  height: dims.box,
                  borderRadius: radius,
                  filter: 'blur(2px)',
                }}
              >
                {renderMediaContent()}
              </motion.div>
            ))}
          </>
        )}

        {/* 6. Aperture Rotating Shutter / Specular Orbital Frame */}
        {(config.motionStyle === 'aperture' || config.motionStyle === 'specular') && (
          <svg
            aria-hidden="true"
            width={dims.ring + 18}
            height={dims.ring + 18}
            viewBox="0 0 180 180"
            className={`absolute pointer-events-none ${activeMotion ? 'animate-spin-slow' : ''}`}
            style={{ ['--orbit-duration' as string]: `${(10 / speed).toFixed(1)}s` }}
          >
            <circle
              cx="90"
              cy="90"
              r="82"
              fill="none"
              stroke={palette.primary}
              strokeOpacity={config.motionStyle === 'aperture' ? 0.55 : 0.35}
              strokeWidth="1.5"
              strokeDasharray={config.motionStyle === 'aperture' ? '14 10 4 10' : '42 28'}
              strokeLinecap="round"
            />
            {config.motionStyle === 'aperture' && (
              <circle
                cx="90"
                cy="90"
                r="73"
                fill="none"
                stroke={palette.secondary}
                strokeOpacity="0.28"
                strokeWidth="1"
                strokeDasharray="6 14"
              />
            )}
          </svg>
        )}

        {/* 7. Zero-G Levitation Floor Shadow & Floating Light Motes */}
        {config.motionStyle === 'levitate' && (
          <>
            <motion.div
              aria-hidden="true"
              animate={
                activeMotion
                  ? {
                      scaleX: [1, 0.72, 1],
                      opacity: [0.42, 0.18, 0.42],
                    }
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

        {/* 8. Orbital Progress Ring */}
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

        {/* 9. Core Living Picture / Logo Container */}
        <motion.div
          animate={bodyAnimate}
          transition={bodyTransition}
          className="relative overflow-hidden"
          style={{
            width: dims.box,
            height: dims.box,
            borderRadius: radius,
            boxShadow:
              config.maskShape === 'freeform'
                ? `0 18px 40px -12px ${palette.glow}`
                : isLightBackdrop
                  ? '0 20px 44px -14px rgba(15, 23, 42, 0.24), 0 0 0 1px rgba(15, 23, 42, 0.08)'
                  : '0 24px 48px -14px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)',
          }}
        >
          {renderMediaContent()}

          {/* Diagonal Specular Sheen Overlay */}
          {activeMotion && !isNativeRibbonS && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none animate-sheen"
              style={{
                ['--sheen-duration' as string]: `${(3.1 / speed).toFixed(2)}s`,
                background:
                  config.motionStyle === 'specular'
                    ? 'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.38) 48%, transparent 72%)'
                    : 'linear-gradient(105deg, transparent 34%, rgba(255,255,255,0.16) 50%, transparent 66%)',
              }}
            />
          )}

          {/* Subtle Inner Edge Highlight */}
          {config.maskShape !== 'freeform' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: radius,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.22)',
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* 10. App Identity, Loading Copy & Non-Ring Progress Indicators */}
      <div className={`${size === 'sm' ? 'mt-3' : 'mt-6'} flex flex-col items-center text-center max-w-xs px-4`}>
        <h3
          className={`font-display font-semibold tracking-tight ${
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          } ${primaryTextClass}`}
        >
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

        {/* Fluid Linear Progress Bar */}
        {config.progressStyle === 'bar' && (
          <div
            className={`mt-4 h-1.5 rounded-full overflow-hidden ${
              size === 'sm' ? 'w-32' : 'w-48'
            } ${isLightBackdrop ? 'bg-zinc-900/10' : 'bg-white/10'}`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: isCompleted ? '#22C55E' : palette.primary }}
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Harmonic Breathing Dots */}
        {config.progressStyle === 'dots' && (
          <div className="mt-4 flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isCompleted ? '#22C55E' : palette.primary }}
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
