import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PRESET_ASSETS,
  type ExtractedPalette,
  type LoaderConfig,
  type PresetAsset,
  type PreviewContext,
} from './types/loader';
import { extractPaletteFromImage } from './utils/colorExtractor';
import {
  generateBuildPrompt,
  generateReactLoaderSnippet,
  imageUrlToDataUrl,
} from './utils/codeGenerator';
import { UI_TEMPLATES } from './data/uiTemplates';
import { CORE_UI_TEMPLATES } from './data/coreUiTemplates';
import { StagePreview } from './components/StagePreview';
import { ControlPanel } from './components/ControlPanel';
import { CodeExportModal } from './components/CodeExportModal';
import { FullscreenSplash } from './components/FullscreenSplash';
import { UIStateLibrary } from './components/library/UIStateLibrary';

const INITIAL_PRESET = PRESET_ASSETS[0];

const INITIAL_CONFIG: LoaderConfig = {
  imageSrc: INITIAL_PRESET.src,
  imageName: INITIAL_PRESET.name,
  presetKind: INITIAL_PRESET.kind,
  motionStyle: INITIAL_PRESET.defaultMotion,
  maskShape: INITIAL_PRESET.defaultShape,
  backdropMode: INITIAL_PRESET.defaultBackdrop,
  progressStyle: 'none',
  speed: 1.0,
  intensity: 1.0,
  appName: INITIAL_PRESET.defaultAppName,
  loadingPhrase: INITIAL_PRESET.defaultPhrase,
  showPercentage: true,
};

type WorkspaceMode = 'logo' | 'states' | 'kit';

const STORAGE_STATE_KEY = 'looma_workspace_state_v1';
const STORAGE_INTRO_SEEN_KEY = 'looma_intro_seen_v1';
const STORAGE_SCROLL_KEY = 'looma_scroll_y_v1';

interface PersistedWorkspace {
  workspaceMode: WorkspaceMode;
  config: LoaderConfig;
  activePresetId: string | null;
  colorOverride: { primary?: string; secondary?: string };
  previewContext: PreviewContext;
}

function normalizeWorkspaceMode(raw: unknown): WorkspaceMode {
  if (raw === 'states' || raw === 'library') return 'states';
  if (raw === 'kit') return 'kit';
  return 'logo';
}

function loadSavedWorkspace(): PersistedWorkspace | null {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedWorkspace> & { workspaceMode?: string };
    if (!parsed || !parsed.config) return null;
    return {
      workspaceMode: normalizeWorkspaceMode(parsed.workspaceMode),
      config: { ...INITIAL_CONFIG, ...parsed.config },
      activePresetId:
        parsed.activePresetId === undefined ? INITIAL_PRESET.id : parsed.activePresetId,
      colorOverride: parsed.colorOverride ?? {},
      previewContext: parsed.previewContext ?? 'ambient',
    };
  } catch {
    return null;
  }
}

function hasSeenIntro(): boolean {
  try {
    return localStorage.getItem(STORAGE_INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function hexToGlow(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 'rgba(59, 130, 246, 0.4)';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.42)`;
}

export default function App() {
  const [saved] = useState<PersistedWorkspace | null>(() => loadSavedWorkspace());

  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(
    saved?.workspaceMode ?? 'logo'
  );
  const [config, setConfig] = useState<LoaderConfig>(saved?.config ?? INITIAL_CONFIG);
  const [activePresetId, setActivePresetId] = useState<string | null>(
    saved ? saved.activePresetId : INITIAL_PRESET.id
  );
  const [autoPalette, setAutoPalette] = useState<ExtractedPalette>(INITIAL_PRESET.fallbackPalette);
  const [colorOverride, setColorOverride] = useState<{ primary?: string; secondary?: string }>(
    saved?.colorOverride ?? {}
  );
  const [previewContext, setPreviewContext] = useState<PreviewContext>(
    saved?.previewContext ?? 'ambient'
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [isCompleted, setIsCompleted] = useState(false);
  const [replayKey, setReplayKey] = useState(1);

  // Only show onboarding splash on first-ever visit; never replay on minimize/reopen
  const [showIntroSplash, setShowIntroSplash] = useState<boolean>(() => !hasSeenIntro());
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  const dismissIntro = useCallback(() => {
    setShowIntroSplash(false);
    try {
      localStorage.setItem(STORAGE_INTRO_SEEN_KEY, '1');
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  // Mark intro seen immediately once it begins so minimizing mid-session won't restart onboarding
  useEffect(() => {
    if (showIntroSplash) {
      try {
        localStorage.setItem(STORAGE_INTRO_SEEN_KEY, '1');
      } catch {
        // Ignore storage errors
      }
    }
  }, [showIntroSplash]);

  // Persist workspace state automatically so user always stays right where they left off
  useEffect(() => {
    const stateToPersist: PersistedWorkspace = {
      workspaceMode,
      config,
      activePresetId,
      colorOverride,
      previewContext,
    };
    try {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(stateToPersist));
    } catch {
      try {
        localStorage.setItem(
          STORAGE_STATE_KEY,
          JSON.stringify({
            ...stateToPersist,
            config: {
              ...config,
              imageSrc: config.imageSrc.startsWith('data:') ? INITIAL_PRESET.src : config.imageSrc,
            },
          })
        );
      } catch {
        // Ignore
      }
    }
  }, [workspaceMode, config, activePresetId, colorOverride, previewContext]);

  // Restore & persist scroll position when minimizing/backgrounding or returning
  useEffect(() => {
    try {
      const savedY = localStorage.getItem(STORAGE_SCROLL_KEY);
      if (savedY) {
        const y = parseInt(savedY, 10);
        if (!Number.isNaN(y) && y > 0) {
          window.requestAnimationFrame(() => window.scrollTo(0, y));
        }
      }
    } catch {
      // Ignore
    }

    const saveScroll = () => {
      try {
        localStorage.setItem(STORAGE_SCROLL_KEY, String(window.scrollY));
      } catch {
        // Ignore
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        saveScroll();
      }
    };

    window.addEventListener('scroll', saveScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', saveScroll);
    return () => {
      window.removeEventListener('scroll', saveScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', saveScroll);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setShortcutToast(message);
    window.setTimeout(() => {
      setShortcutToast((curr) => (curr === message ? null : curr));
    }, 1800);
  }, []);

  // Sample colors directly from the active picture or logo
  useEffect(() => {
    let active = true;
    const presetFallback =
      PRESET_ASSETS.find((p) => p.id === activePresetId)?.fallbackPalette ??
      INITIAL_PRESET.fallbackPalette;

    extractPaletteFromImage(config.imageSrc, presetFallback).then((extracted) => {
      if (active) setAutoPalette(extracted);
    });

    return () => {
      active = false;
    };
  }, [config.imageSrc, activePresetId]);

  const effectivePalette = useMemo<ExtractedPalette>(() => {
    const primary = colorOverride.primary ?? autoPalette.primary;
    const secondary = colorOverride.secondary ?? autoPalette.secondary;
    return {
      ...autoPalette,
      primary,
      secondary,
      glow: colorOverride.primary ? hexToGlow(colorOverride.primary) : autoPalette.glow,
    };
  }, [autoPalette, colorOverride]);

  const hasColorOverride = Boolean(colorOverride.primary || colorOverride.secondary);

  // Smooth organic progress loop while previewing
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 14;
        const step = prev < 55 ? 1.8 : prev < 80 ? 1.1 : 0.45;
        return Math.min(94, prev + step * config.speed);
      });
    }, 90);

    return () => clearInterval(timer);
  }, [isPlaying, isCompleted, config.speed]);

  const handleUpdateConfig = useCallback((patch: Partial<LoaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSelectPreset = useCallback((preset: PresetAsset) => {
    setActivePresetId(preset.id);
    setColorOverride({});
    setIsCompleted(false);
    setProgress(24);
    setReplayKey((k) => k + 1);
    setConfig((prev) => ({
      ...prev,
      imageSrc: preset.src,
      imageName: preset.name,
      presetKind: preset.kind,
      motionStyle: preset.defaultMotion,
      maskShape: preset.defaultShape,
      backdropMode: preset.defaultBackdrop,
      appName: preset.defaultAppName,
      loadingPhrase: preset.defaultPhrase,
    }));
  }, []);

  const handleUploadFile = useCallback((dataUrl: string, fileName: string) => {
    setActivePresetId(null);
    setColorOverride({});
    setIsCompleted(false);
    setProgress(28);
    setReplayKey((k) => k + 1);
    setConfig((prev) => ({
      ...prev,
      imageSrc: dataUrl,
      imageName: fileName,
      presetKind: 'logo',
      appName: fileName || 'Your App',
    }));
  }, []);

  const handleSavePreset = useCallback(() => {
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      config,
      activePresetId,
      colorOverride,
      previewContext,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = (config.appName || 'looma-preset').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `${slug}-preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config, activePresetId, colorOverride, previewContext]);

  const handleImportPreset = useCallback((jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<PersistedWorkspace>;
      if (!parsed || !parsed.config || typeof parsed.config.motionStyle !== 'string') {
        return false;
      }
      setConfig({ ...INITIAL_CONFIG, ...parsed.config });
      setActivePresetId(parsed.activePresetId ?? null);
      setColorOverride(parsed.colorOverride ?? {});
      if (parsed.previewContext) setPreviewContext(parsed.previewContext);
      setIsCompleted(false);
      setReplayKey((k) => k + 1);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleReplay = useCallback(() => {
    setIsCompleted(false);
    setProgress(12);
    setIsPlaying(true);
    setReplayKey((k) => k + 1);
  }, []);

  const handleSimulateFinish = useCallback(() => {
    setIsPlaying(true);
    setProgress(100);
    setIsCompleted(true);
    window.setTimeout(() => {
      setIsCompleted(false);
      setProgress(18);
      setReplayKey((k) => k + 1);
    }, 2200);
  }, []);

  // Global keyboard shortcuts (Space: Play/Pause, R: Replay, C: Copy Code, P: Copy Prompt, F: Splash)
  useEffect(() => {
    const onKeyDown = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => {
          showToast(prev ? 'Animation paused (Space)' : 'Animation resumed (Space)');
          return !prev;
        });
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReplay();
        showToast('Replayed entrance (R)');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setShowFullscreenPreview((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const embedded =
          config.presetKind === 'logo' || config.presetKind === 'picture'
            ? await imageUrlToDataUrl(config.imageSrc)
            : null;
        const snippet = generateReactLoaderSnippet(config, effectivePalette, embedded);
        try {
          await navigator.clipboard.writeText(snippet);
          showToast('Copied React TSX code (C)');
        } catch {
          showToast('Open Export Code to copy');
        }
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const prompt = generateBuildPrompt(config, effectivePalette);
        try {
          await navigator.clipboard.writeText(prompt);
          showToast('Copied AI Build Prompt (P)');
        } catch {
          showToast('Open Export Code to copy');
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [config, effectivePalette, handleReplay, showToast]);

  const headerTitle =
    workspaceMode === 'logo'
      ? 'Turn your logo or picture into a living loader.'
      : workspaceMode === 'states'
        ? 'Pick & test every loading, empty, error, and nav state.'
        : 'Pick responsive layouts, dark mode tokens, forms & branding kits.';

  const headerSubtitle =
    workspaceMode === 'logo'
      ? 'Upload your own mark or test a sample, customize motion and brand colors, then open Export to copy clean code or an AI build prompt.'
      : workspaceMode === 'states'
        ? 'Nothing is locked in for you—try each interactive state, inspect how it works, and copy either React TSX code or plain-English AI instructions.'
        : 'Browse ready-to-use grids, theme variables, typography scales, multi-step forms, icons, and optional Web Audio sounds with one-click Code & Prompt export.';

  return (
    <div className="min-h-screen bg-[#0B0C10] text-zinc-100 flex flex-col">
      {/* First-Visit Onboarding Splash (never replays on minimize/reopen) */}
      <FullscreenSplash
        isOpen={showIntroSplash}
        config={config}
        palette={effectivePalette}
        autoCloseAfterMs={2400}
        onClose={dismissIntro}
      />

      {/* User-Triggered Fullscreen Preview */}
      <FullscreenSplash
        isOpen={showFullscreenPreview}
        config={config}
        palette={effectivePalette}
        onClose={() => setShowFullscreenPreview(false)}
      />

      {/* Clean Code, Prompt & Theme Export Modal */}
      <CodeExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        config={config}
        palette={effectivePalette}
      />

      {/* Shortcut Feedback Toast */}
      <AnimatePresence>
        {shortcutToast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-100 shadow-2xl"
          >
            {shortcutToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="border-b border-zinc-800/80 bg-[#0B0C10]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setWorkspaceMode('logo');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Looma
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            <button
              type="button"
              onClick={() => setWorkspaceMode('logo')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'logo' ? 'text-white' : ''
              }`}
            >
              Logo Loader
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('states')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'states' ? 'text-white' : ''
              }`}
            >
              States &amp; Motion
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('kit')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'kit' ? 'text-white' : ''
              }`}
            >
              Layouts &amp; UI Kit
            </button>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Export Code
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowFullscreenPreview(true)}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Launch Splash
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main id="top" className="flex-1 max-w-[1320px] w-full mx-auto px-6 py-8 lg:py-10">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1
              className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              {headerTitle}
            </h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {headerSubtitle}
            </p>
          </div>

          {/* Clean 3-Tab Workspace Switcher */}
          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#12141B] border border-zinc-800/90 self-start shrink-0"
            role="tablist"
            aria-label="Workspace section"
          >
            <button
              type="button"
              role="tab"
              aria-selected={workspaceMode === 'logo'}
              onClick={() => setWorkspaceMode('logo')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'logo'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Logo Loader
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceMode === 'states'}
              onClick={() => setWorkspaceMode('states')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'states'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              States &amp; Motion ({UI_TEMPLATES.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceMode === 'kit'}
              onClick={() => setWorkspaceMode('kit')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'kit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Layouts &amp; UI Kit ({CORE_UI_TEMPLATES.length})
            </button>
          </div>
        </div>

        {workspaceMode === 'logo' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            <StagePreview
              config={config}
              palette={effectivePalette}
              previewContext={previewContext}
              onChangeContext={setPreviewContext}
              progress={progress}
              isPlaying={isPlaying}
              isCompleted={isCompleted}
              replayKey={replayKey}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onReplay={handleReplay}
              onSimulateFinish={handleSimulateFinish}
            />

            <ControlPanel
              config={config}
              palette={effectivePalette}
              hasColorOverride={hasColorOverride}
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
              onUploadFile={handleUploadFile}
              onUpdate={handleUpdateConfig}
              onColorOverride={(patch) =>
                setColorOverride((prev) => ({ ...prev, ...patch }))
              }
              onResetColors={() => setColorOverride({})}
              onSavePreset={handleSavePreset}
              onImportPreset={handleImportPreset}
              onOpenExport={() => setShowExportModal(true)}
            />
          </div>
        ) : (
          <UIStateLibrary
            section={workspaceMode === 'states' ? 'motion' : 'essentials'}
            config={config}
            palette={effectivePalette}
            onLaunchSplash={() => setShowFullscreenPreview(true)}
          />
        )}
      </main>

      <footer className="border-t border-zinc-800/70 mt-12">
        <div className="max-w-[1320px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
          <span>Looma · 100% client-side UI &amp; motion studio</span>
          <span>Shortcuts: Space Play/Pause · R Replay · C Copy Code · P Copy Prompt · F Splash</span>
        </div>
      </footer>
    </div>
  );
}
