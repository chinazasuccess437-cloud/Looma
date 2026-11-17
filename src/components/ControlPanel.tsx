import React, { useRef, useState } from 'react';
import { Code2, FolderOpen, RotateCcw, Save, Upload } from 'lucide-react';
import {
  MOTION_STYLES,
  PRESET_ASSETS,
  type BackdropMode,
  type ExtractedPalette,
  type LoaderConfig,
  type MaskShape,
  type MotionStyleId,
  type PresetAsset,
  type ProgressStyle,
} from '../types/loader';
import { RibbonSLogo, VectorMonogram } from './AliveLoader';

interface ControlPanelProps {
  config: LoaderConfig;
  palette: ExtractedPalette;
  hasColorOverride: boolean;
  activePresetId: string | null;
  onSelectPreset: (preset: PresetAsset) => void;
  onUploadFile: (dataUrl: string, fileName: string) => void;
  onUpdate: (patch: Partial<LoaderConfig>) => void;
  onColorOverride: (patch: { primary?: string; secondary?: string }) => void;
  onResetColors: () => void;
  onSavePreset: () => void;
  onImportPreset: (jsonText: string) => boolean;
  onOpenExport: () => void;
}

type InspectorTab = 'picture' | 'action' | 'style';

const MASK_SHAPES: { id: MaskShape; label: string }[] = [
  { id: 'squircle', label: 'Squircle' },
  { id: 'circle', label: 'Circle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'freeform', label: 'Original' },
];

const BACKDROP_MODES: { id: BackdropMode; label: string }[] = [
  { id: 'obsidian', label: 'Obsidian' },
  { id: 'alabaster', label: 'Alabaster' },
  { id: 'slate', label: 'Slate' },
  { id: 'adaptive', label: 'Adaptive' },
];

const PROGRESS_STYLES: { id: ProgressStyle; label: string }[] = [
  { id: 'ring', label: 'Ring' },
  { id: 'bar', label: 'Bar' },
  { id: 'dots', label: 'Dots' },
  { id: 'none', label: 'Pure' },
];

export function ControlPanel({
  config,
  palette,
  hasColorOverride,
  activePresetId,
  onSelectPreset,
  onUploadFile,
  onUpdate,
  onColorOverride,
  onResetColors,
  onSavePreset,
  onImportPreset,
  onOpenExport,
}: ControlPanelProps) {
  const [tab, setTab] = useState<InspectorTab>('picture');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [presetMsg, setPresetMsg] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a PNG, JPG, SVG, or WebP image.');
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        onUploadFile(reader.result, cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeMotion =
    MOTION_STYLES.find((m) => m.id === config.motionStyle) ?? MOTION_STYLES[0];

  return (
    <aside
      id="choreography"
      className="rounded-2xl border border-zinc-800/90 bg-[#12141B] p-5 flex flex-col gap-5"
    >
      {/* Clean 3-Step Tab Switcher */}
      <div
        className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800"
        role="tablist"
        aria-label="Loader customization steps"
      >
        {(
          [
            { id: 'picture', label: '1. Picture' },
            { id: 'action', label: '2. Action' },
            { id: 'style', label: '3. Style' },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PICTURE OR LOGO */}
      {tab === 'picture' && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Choose Your Picture or Logo</h2>
            <p className="mt-1 text-xs text-zinc-400">
              Upload your own PNG, SVG, or photo—colors are sampled automatically for the glow.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`mt-3 w-full rounded-xl border border-dashed px-4 py-4 flex items-center justify-center gap-2.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 text-zinc-200'
              }`}
            >
              <Upload className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="truncate">
                {activePresetId
                  ? 'Upload your picture or logo'
                  : `Uploaded: ${config.imageName}`}
              </span>
            </button>

            {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
          </div>

          <div>
            <span className="block text-xs font-medium text-zinc-400 mb-2">
              Or test with a sample mark
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_ASSETS.map((preset) => {
                const active = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                      {preset.kind === 'ribbon-s' ? (
                        <RibbonSLogo animateAction={false} />
                      ) : preset.kind === 'vector' ? (
                        <VectorMonogram />
                      ) : (
                        <img
                          src={preset.src}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] leading-tight truncate w-full text-center ${
                        active ? 'text-zinc-100 font-medium' : 'text-zinc-400'
                      }`}
                    >
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-zinc-400 mb-2">Frame Shape</span>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900/70 border border-zinc-800/90">
              {MASK_SHAPES.map((shape) => {
                const active = config.maskShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => onUpdate({ maskShape: shape.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {shape.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTION CHOREOGRAPHY */}
      {tab === 'action' && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Pick Living Motion</h2>
            <p className="mt-1 text-xs text-zinc-400">{activeMotion.physicsNote}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {MOTION_STYLES.map((style) => {
                const active = config.motionStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onUpdate({ motionStyle: style.id as MotionStyleId })}
                    className={`text-left p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-500 bg-blue-500/10 text-zinc-100'
                        : 'border-zinc-800/90 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-medium truncate">{style.name}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2 leading-snug">
                      {style.summary}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="speed-slider" className="font-medium text-zinc-400">
                  Tempo
                </label>
                <span className="font-mono tabular-nums text-zinc-200">
                  {config.speed.toFixed(1)}x
                </span>
              </div>
              <input
                id="speed-slider"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.speed}
                onChange={(e) => onUpdate({ speed: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="energy-slider" className="font-medium text-zinc-400">
                  Motion Energy
                </label>
                <span className="font-mono tabular-nums text-zinc-200">
                  {Math.round(config.intensity * 100)}%
                </span>
              </div>
              <input
                id="energy-slider"
                type="range"
                min="0.4"
                max="1.6"
                step="0.1"
                value={config.intensity}
                onChange={(e) => onUpdate({ intensity: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STYLE, COLORS & PRESETS */}
      {tab === 'style' && (
        <div className="flex flex-col gap-4">
          <div>
            <span className="block text-xs font-medium text-zinc-400 mb-2">Backdrop Surface</span>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900/70 border border-zinc-800/90">
              {BACKDROP_MODES.map((mode) => {
                const active = config.backdropMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onUpdate({ backdropMode: mode.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-zinc-400 mb-2">
              Progress Indicator
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900/70 border border-zinc-800/90">
              {PROGRESS_STYLES.map((prog) => {
                const active = config.progressStyle === prog.id;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => onUpdate({ progressStyle: prog.id })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {prog.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400">Brand Aura Colors</span>
              {hasColorOverride ? (
                <button
                  type="button"
                  onClick={onResetColors}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Auto</span>
                </button>
              ) : (
                <span className="text-[11px] text-zinc-500">Auto-extracted</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800/90 cursor-pointer hover:border-zinc-700">
                <input
                  type="color"
                  value={palette.primary}
                  onChange={(e) => onColorOverride({ primary: e.target.value })}
                  aria-label="Primary aura color"
                  className="w-6 h-6 rounded-md bg-transparent border-0 p-0 cursor-pointer shrink-0"
                />
                <div className="min-w-0">
                  <span className="block text-[10px] text-zinc-400">Primary</span>
                  <span className="block text-xs font-mono tabular-nums text-zinc-200 truncate">
                    {palette.primary.toUpperCase()}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-zinc-900/70 border border-zinc-800/90 cursor-pointer hover:border-zinc-700">
                <input
                  type="color"
                  value={palette.secondary}
                  onChange={(e) => onColorOverride({ secondary: e.target.value })}
                  aria-label="Secondary aura color"
                  className="w-6 h-6 rounded-md bg-transparent border-0 p-0 cursor-pointer shrink-0"
                />
                <div className="min-w-0">
                  <span className="block text-[10px] text-zinc-400">Secondary</span>
                  <span className="block text-xs font-mono tabular-nums text-zinc-200 truncate">
                    {palette.secondary.toUpperCase()}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="app-name-input" className="block text-xs font-medium text-zinc-400 mb-1">
                App Title
              </label>
              <input
                id="app-name-input"
                type="text"
                maxLength={32}
                value={config.appName}
                onChange={(e) => onUpdate({ appName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phrase-input" className="block text-xs font-medium text-zinc-400 mb-1">
                Status Copy
              </label>
              <input
                id="phrase-input"
                type="text"
                maxLength={48}
                value={config.loadingPhrase}
                onChange={(e) => onUpdate({ loadingPhrase: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-zinc-300">Show percentage counter</span>
            <input
              type="checkbox"
              checked={config.showPercentage}
              onChange={(e) => onUpdate({ showPercentage: e.target.checked })}
              className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
            />
          </label>

          <div className="pt-2 border-t border-zinc-800/80">
            <input
              ref={presetInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    const ok = onImportPreset(reader.result);
                    setPresetMsg(ok ? 'Preset restored' : 'Invalid preset JSON');
                    window.setTimeout(() => setPresetMsg(null), 2200);
                  }
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSavePreset();
                  setPresetMsg('Saved preset .json');
                  window.setTimeout(() => setPresetMsg(null), 2200);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preset</span>
              </button>
              <button
                type="button"
                onClick={() => presetInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>
            </div>
            {presetMsg && <p className="mt-1.5 text-[11px] text-blue-400">{presetMsg}</p>}
          </div>
        </div>
      )}

      {/* Clear Export Trigger */}
      <div className="pt-3 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={onOpenExport}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          <Code2 className="w-4 h-4" />
          <span>Get Code &amp; AI Prompt</span>
        </button>
        <p className="mt-1.5 text-[11px] text-zinc-500 text-center">
          Exports React TSX, HTML/CSS, AI Prompt &amp; :root theme variables
        </p>
      </div>
    </aside>
  );
}
