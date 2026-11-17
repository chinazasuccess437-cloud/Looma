import React from 'react';
import { Play, Pause, RotateCcw, Sparkles, Monitor, Smartphone, LayoutGrid, Maximize2 } from 'lucide-react';
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

const CONTEXT_OPTIONS: { id: PreviewContext; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'ambient', label: 'Ambient', icon: Maximize2 },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'desktop', label: 'Desktop App', icon: Monitor },
  { id: 'inline', label: 'Inline Card', icon: LayoutGrid },
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
  const getStageBackground = () => {
    const mixBg = `radial-gradient(circle at 38% 36%, ${palette.primary}30 0%, transparent 56%), radial-gradient(circle at 64% 64%, ${palette.secondary}33 0%, transparent 60%)`;
    switch (config.backdropMode) {
      case 'alabaster':
        return {
          backgroundColor: '#F5F4EF',
          backgroundImage: `radial-gradient(circle at 50% 42%, ${palette.glow} 0%, transparent 68%)`,
        };
      case 'slate':
        return {
          backgroundColor: '#121620',
          backgroundImage: mixBg,
        };
      case 'adaptive':
        return {
          backgroundColor: '#0B0D14',
          backgroundImage: mixBg,
        };
      case 'obsidian':
      default:
        return {
          backgroundColor: '#090A0E',
          backgroundImage: mixBg,
        };
    }
  };

  const stageStyle = getStageBackground();
  const isLight = config.backdropMode === 'alabaster';

  return (
    <section
      id="stage"
      className="looma-floating-card rounded-2xl border border-zinc-800/90 overflow-hidden flex flex-col"
    >
      {/* Stage Header Controls */}
      <div className="px-4 py-3 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#101218]/90">
        <div className="flex items-center gap-1" role="tablist" aria-label="Preview device context">
          {CONTEXT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
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
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={onSimulateFinish}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finish State</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Stage */}
      <div
        className="relative min-h-[460px] lg:min-h-[540px] flex items-center justify-center p-6 sm:p-10 transition-colors duration-500"
        style={stageStyle}
      >
        {/* Subtle mixed gradient swatches display */}
        <div
          className={`absolute top-4 left-4 flex items-center gap-2 text-[11px] font-mono ${
            isLight ? 'text-zinc-700' : 'text-zinc-400'
          }`}
        >
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/25"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
            }}
            title="Mixed Primary & Secondary Aura"
          />
          <span>
            {palette.primary.toUpperCase()} + {palette.secondary.toUpperCase()}
          </span>
        </div>

        {previewContext === 'ambient' && (
          <AliveLoader
            config={config}
            palette={palette}
            progress={progress}
            isPlaying={isPlaying}
            isCompleted={isCompleted}
            replayKey={replayKey}
            size="lg"
          />
        )}

        {previewContext === 'mobile' && (
          <div
            className={`w-[270px] h-[480px] rounded-[38px] p-4 flex flex-col justify-between shadow-2xl border ${
              isLight ? 'border-zinc-300 bg-[#F5F4EF]' : 'border-zinc-700/80 bg-[#0A0B0F]'
            }`}
            style={{
              backgroundImage: `radial-gradient(circle at 50% 44%, ${palette.primary}22 0%, ${palette.secondary}18 42%, transparent 72%)`,
            }}
          >
            <div className="mx-auto w-20 h-4 rounded-full bg-zinc-800/80 mt-1" />
            <div className="my-auto">
              <AliveLoader
                config={config}
                palette={palette}
                progress={progress}
                isPlaying={isPlaying}
                isCompleted={isCompleted}
                replayKey={replayKey}
                size="md"
              />
            </div>
            <div
              className={`mx-auto w-24 h-1 rounded-full mb-1 ${
                isLight ? 'bg-zinc-900/20' : 'bg-white/20'
              }`}
            />
          </div>
        )}

        {previewContext === 'desktop' && (
          <div
            className={`w-full max-w-[540px] h-[360px] rounded-xl overflow-hidden shadow-2xl border flex flex-col ${
              isLight ? 'border-zinc-300 bg-[#F5F4EF]' : 'border-zinc-700/80 bg-[#0D0F14]'
            }`}
          >
            <div
              className={`h-9 px-3.5 flex items-center gap-2 border-b ${
                isLight ? 'border-zinc-200 bg-white/80' : 'border-zinc-800 bg-[#141720]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600/60" />
              <span
                className={`ml-3 text-[11px] font-mono ${
                  isLight ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                app.{(config.appName || 'looma').toLowerCase().replace(/\s+/g, '')}.io
              </span>
            </div>
            <div
              className="flex-1 grid place-items-center p-4"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 45%, ${palette.primary}22 0%, ${palette.secondary}1A 45%, transparent 72%)`,
              }}
            >
              <AliveLoader
                config={config}
                palette={palette}
                progress={progress}
                isPlaying={isPlaying}
                isCompleted={isCompleted}
                replayKey={replayKey}
                size="md"
              />
            </div>
          </div>
        )}

        {previewContext === 'inline' && (
          <div
            className={`w-full max-w-[380px] rounded-2xl p-7 shadow-xl border ${
              isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-[#13161F]'
            }`}
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
        )}
      </div>
    </section>
  );
}
