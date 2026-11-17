import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Monitor,
  Smartphone,
  Maximize2,
  Square,
} from 'lucide-react';
import type { ExtractedPalette, LoaderConfig, PreviewContext } from '../types/loader';
import { AliveLoader } from './AliveLoader';

interface StagePreviewProps {
  config: LoaderConfig;
  palette: ExtractedPalette;
  previewContext: PreviewContext;
  onChangeContext: (ctx: PreviewContext) => void;
  progress: number;
  isPlaying: boolean;
  isCompleted: boolean;
  replayKey: number;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSimulateFinish: () => void;
}

function getBackdropStyle(config: LoaderConfig, palette: ExtractedPalette): React.CSSProperties {
  switch (config.backdropMode) {
    case 'obsidian':
      return {
        backgroundColor: '#090A0E',
        backgroundImage: `radial-gradient(circle at 50% 42%, ${palette.glow} 0%, rgba(9,10,14,0) 64%)`,
      };
    case 'alabaster':
      return {
        backgroundColor: '#F5F4EF',
        backgroundImage: `radial-gradient(circle at 50% 42%, ${palette.glow} 0%, rgba(245,244,239,0) 66%)`,
      };
    case 'slate':
      return {
        backgroundColor: '#121620',
        backgroundImage: `radial-gradient(circle at 50% 42%, ${palette.glow} 0%, rgba(18,22,32,0) 66%)`,
      };
    case 'adaptive':
      return {
        backgroundColor: '#0B0D14',
        backgroundImage: `radial-gradient(circle at 50% 40%, ${palette.glow} 0%, rgba(11,13,20,0.92) 70%)`,
      };
  }
}

const CONTEXT_OPTIONS: { id: PreviewContext; label: string; icon: React.ReactNode }[] = [
  { id: 'ambient', label: 'Ambient', icon: <Maximize2 className="w-3.5 h-3.5" /> },
  { id: 'mobile', label: 'Mobile App', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'desktop', label: 'Desktop App', icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: 'inline', label: 'Inline Card', icon: <Square className="w-3.5 h-3.5" /> },
];

export function StagePreview({
  config,
  palette,
  previewContext,
  onChangeContext,
  progress,
  isPlaying,
  isCompleted,
  replayKey,
  onTogglePlay,
  onReplay,
  onSimulateFinish,
}: StagePreviewProps) {
  const backdropStyle = getBackdropStyle(config, palette);
  const isLight = config.backdropMode === 'alabaster';

  return (
    <section id="stage" className="flex flex-col gap-4">
      {/* Workspace Stage Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#13151D] border border-zinc-800/90"
          role="tablist"
          aria-label="Preview framing mode"
        >
          {CONTEXT_OPTIONS.map((opt) => {
            const active = previewContext === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeContext(opt.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  active
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#13151D] border border-zinc-800 text-zinc-200 hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#13151D] border border-zinc-800 text-zinc-200 hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={onSimulateFinish}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete Load</span>
          </button>
        </div>
      </div>

      {/* Interactive Stage Container */}
      <div className="relative rounded-2xl border border-zinc-800/90 bg-[#0D0F14] overflow-hidden min-h-[540px] lg:min-h-[600px] flex items-center justify-center p-6 sm:p-10">
        {/* Subtle dot-matrix studio floor */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <AnimatePresence mode="wait">
          {previewContext === 'ambient' && (
            <motion.div
              key="ambient"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              style={backdropStyle}
              className="relative w-full h-[460px] lg:h-[520px] rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl"
            >
              <AliveLoader
                config={config}
                palette={palette}
                progress={progress}
                isPlaying={isPlaying}
                isCompleted={isCompleted}
                replayKey={replayKey}
                size="lg"
              />
              <p
                className={`absolute bottom-5 text-xs ${
                  isLight ? 'text-zinc-500' : 'text-zinc-500'
                }`}
              >
                Move pointer for 3D tilt · Space Play/Pause · R Replay · C Copy Code · F Splash
              </p>
            </motion.div>
          )}

          {previewContext === 'mobile' && (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="relative w-[290px] h-[560px] rounded-[42px] p-2.5 bg-zinc-900 border border-zinc-700/70 shadow-[0_32px_70px_-15px_rgba(0,0,0,0.8)]"
            >
              <div
                style={backdropStyle}
                className="relative w-full h-full rounded-[32px] overflow-hidden flex flex-col items-center justify-center"
              >
                {/* Realistic Dynamic Island / Speaker notch */}
                <div
                  aria-hidden="true"
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/90 border border-white/10"
                />

                <AliveLoader
                  config={config}
                  palette={palette}
                  progress={progress}
                  isPlaying={isPlaying}
                  isCompleted={isCompleted}
                  replayKey={replayKey}
                  size="md"
                />

                {/* Home indicator bar */}
                <div
                  aria-hidden="true"
                  className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full ${
                    isLight ? 'bg-zinc-900/25' : 'bg-white/25'
                  }`}
                />
              </div>
            </motion.div>
          )}

          {previewContext === 'desktop' && (
            <motion.div
              key="desktop"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl h-[460px] rounded-xl overflow-hidden border border-zinc-700/70 shadow-[0_32px_70px_-15px_rgba(0,0,0,0.75)] flex flex-col bg-zinc-900"
            >
              {/* Window Chrome */}
              <div className="h-9 px-4 bg-[#161821] border-b border-zinc-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs text-zinc-400 font-medium truncate max-w-[180px]">
                  {config.appName || 'Desktop App'}
                </span>
                <div className="w-10" />
              </div>

              <div
                style={backdropStyle}
                className="flex-1 flex items-center justify-center p-6"
              >
                <AliveLoader
                  config={config}
                  palette={palette}
                  progress={progress}
                  isPlaying={isPlaying}
                  isCompleted={isCompleted}
                  replayKey={replayKey}
                  size="lg"
                />
              </div>
            </motion.div>
          )}

          {previewContext === 'inline' && (
            <motion.div
              key="inline"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#12151E] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">Workspace Sync</h4>
                  <p className="text-xs text-zinc-400">Inline module state</p>
                </div>
                <span className="text-xs font-mono tabular-nums text-zinc-400">
                  {Math.round(progress)}%
                </span>
              </div>

              <div
                style={backdropStyle}
                className="mt-4 rounded-xl py-10 px-4 flex items-center justify-center border border-white/5"
              >
                <AliveLoader
                  config={config}
                  palette={palette}
                  progress={progress}
                  isPlaying={isPlaying}
                  isCompleted={isCompleted}
                  replayKey={replayKey}
                  size="sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
