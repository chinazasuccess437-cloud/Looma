import React, { useRef, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  FileText,
  ImagePlus,
  Loader2,
  Maximize2,
  Minimize2,
  Monitor,
  Palette,
  RefreshCw,
  Smartphone,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import { MOTION_STYLES, type ExtractedPalette, type LoaderConfig } from '../types/loader';
import { useAuth } from '../hooks/useAuth';
import { trackEvent } from '../utils/analytics';

interface GeneratedDesignResponse {
  designName: string;
  styleSummary: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  recommendedMotion: string;
  previewHtml: string;
  reactCode: string;
  aiPrompt: string;
}

interface CustomDesignStudioProps {
  config: LoaderConfig;
  palette: ExtractedPalette;
  onAcceptCurrentStyle: () => void;
  onApplyGeneratedPalette: (primary: string, secondary: string) => void;
}

export function CustomDesignStudio({
  config,
  palette,
  onAcceptCurrentStyle,
  onApplyGeneratedPalette,
}: CustomDesignStudioProps) {
  const { user, requireSignIn } = useAuth();
  const [decision, setDecision] = useState<'ask' | 'describe'>('describe');
  const [description, setDescription] = useState('');
  const [refineText, setRefineText] = useState('');
  const [uploadedUiImage, setUploadedUiImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedDesignResponse | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'preview' | 'code' | 'prompt'>('preview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [paletteApplied, setPaletteApplied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeMotion =
    MOTION_STYLES.find((m) => m.id === config.motionStyle) ?? MOTION_STYLES[0];

  const compressImageIfNeeded = (dataUrl: string, mimeType: string): Promise<string> => {
    if (mimeType === 'image/svg+xml' && dataUrl.length < 250_000) {
      return Promise.resolve(dataUrl);
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 1280;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          const ratio = Math.min(maxSide / width, maxSide / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleImagePick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a PNG, JPG, SVG, or WebP screenshot or logo.');
      return;
    }
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const optimized = await compressImageIfNeeded(reader.result, file.type);
        setUploadedUiImage(optimized);
        setUploadedFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const runGeneration = async (promptToSend: string, isRefinement = false) => {
    if (!promptToSend.trim() && !uploadedUiImage) {
      setErrorMsg('Describe the style you want or upload a UI screenshot to modify.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const currentStyleContext = `App Name: ${config.appName}, Motion: ${activeMotion.name}, Colors: Primary ${palette.primary} + Secondary ${palette.secondary}, Backdrop: ${config.backdropMode}, Text Theme: ${config.uiTextTheme ?? 'gradient'}`;
      const previousDesignSummary =
        isRefinement && result
          ? `Previous design "${result.designName}": ${result.styleSummary}. Colors: primary ${result.palette.primary}, secondary ${result.palette.secondary}, background ${result.palette.background}. Prompt used: ${result.aiPrompt.slice(0, 600)}`
          : undefined;

      const res = await fetch('/api/ai/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: promptToSend.trim(),
          currentStyleContext,
          imageDataUrl: uploadedUiImage || undefined,
          previousDesignSummary,
        }),
      });

      const rawText = await res.text();
      let data: (GeneratedDesignResponse & { error?: string }) | null = null;

      try {
        data = JSON.parse(rawText) as GeneratedDesignResponse & { error?: string };
      } catch {
        const trimmed = rawText.trim().toLowerCase();
        if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
          throw new Error(
            res.status === 413
              ? 'Uploaded image exceeded server size limits. Please choose a smaller screenshot.'
              : 'The AI backend endpoint returned an HTML page instead of JSON. Please try again.'
          );
        }
        throw new Error(rawText.slice(0, 180) || 'Invalid response received from AI design service.');
      }

      if (!res.ok || !data) {
        throw new Error(data?.error || `Request failed (${res.status}).`);
      }

      setResult(data);
      trackEvent('ai_design_generate', {
        is_refinement: isRefinement,
        has_image: Boolean(uploadedUiImage),
      });
      setActiveOutputTab('preview');
      setPaletteApplied(false);
      if (isRefinement) setRefineText('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong while generating your design.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    requireSignIn('generate a custom AI design, code & prompt', () => {
      void runGeneration(description, false);
    });
  };

  const handleRefine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    requireSignIn('refine your AI design', () => {
      void runGeneration(
        `Keep the core structure and refine it with these changes: ${refineText.trim()}`,
        true
      );
    });
  };

  const copyText = (key: string, text: string) => {
    requireSignIn('copy your generated code or AI prompt', async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 1800);
      } catch {
        // Ignore clipboard errors cleanly
      }
    });
  };

  return (
    <section className="space-y-6">
      {/* Choice Header — Confirm Current Style vs Describe Custom Vision */}
      <div className="looma-floating-card rounded-2xl border border-zinc-800/90 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-lg font-semibold text-white">
              Do you like your studio style, or want Looma AI to build what you picture?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Current studio: <span className="text-zinc-200 font-medium">{activeMotion.name}</span>{' '}
              ({palette.primary.toUpperCase()} + {palette.secondary.toUpperCase()}). Export it now,
              or upload a UI screenshot and describe the exact design you want created.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onAcceptCurrentStyle}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-900 hover:bg-white transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Yes, proceed &amp; export</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision('describe')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                decision === 'describe'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600/20 border border-blue-500/50 text-blue-200 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>No — describe my design</span>
            </button>
          </div>
        </div>
      </div>

      {decision === 'describe' && (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left Builder Controls */}
          <form
            onSubmit={handleGenerate}
            className="looma-floating-card rounded-2xl border border-zinc-800/90 p-5 space-y-5"
          >
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                Describe What You Want Built
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Upload a screenshot of your current UI (optional) and describe the layout, colors, motion, or changes you want.
              </p>
            </div>

            <div>
              <span className="block text-xs font-medium text-zinc-300 mb-2">
                1. Optional: Upload UI screenshot or logo
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImagePick(e.target.files?.[0])}
              />

              {uploadedUiImage ? (
                <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 flex items-center gap-3">
                  <img
                    src={uploadedUiImage}
                    alt="Uploaded UI reference"
                    className="w-14 h-14 rounded-lg object-cover border border-zinc-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-100 truncate">
                      {uploadedFileName}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Ready for AI vision analysis
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedUiImage(null);
                      setUploadedFileName('');
                    }}
                    aria-label="Remove uploaded image"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border border-dashed border-zinc-700 hover:border-blue-500 bg-zinc-900/50 px-4 py-3.5 flex items-center justify-center gap-2 text-xs text-zinc-300 transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4 text-blue-400" />
                  <span>Upload UI screenshot, sketch, or logo</span>
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor="custom-style-prompt"
                className="block text-xs font-medium text-zinc-300 mb-2"
              >
                2. Describe the exact style or changes
              </label>
              <textarea
                id="custom-style-prompt"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Keep my uploaded layout structure, make every card float on dark obsidian glass with a soft White + Blue glowing aura, crisp gradient headings, interactive working tabs, and smooth hover lift..."
                className="w-full rounded-xl bg-[#0B0D12] border border-zinc-800 px-3.5 py-3 text-xs text-zinc-100 placeholder:text-zinc-500 leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {!user && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/25 px-3.5 py-2.5 text-xs text-blue-200 flex items-center justify-between gap-2">
                <span>You&apos;re touring Looma. Sign in with Google when ready to generate a design.</span>
                <button
                  type="button"
                  onClick={() => requireSignIn('generate custom AI designs', () => {})}
                  className="shrink-0 font-semibold text-white underline underline-offset-2 cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white transition-colors cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Designing live UI, TSX &amp; prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {user ? 'Generate Design, Prompt & Code' : 'Sign in & Generate Design'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Right Live Output Stage */}
          <div
            className={`looma-floating-card rounded-2xl border border-zinc-800/90 overflow-hidden flex flex-col ${
              expandedPreview ? 'fixed inset-4 z-50 bg-[#0B0D14]' : 'min-h-[580px]'
            }`}
          >
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 grid place-items-center mb-4">
                  <Wand2 className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="font-display text-base font-semibold text-white">
                  Full Interactive UI Preview Appears Here
                </h4>
                <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed">
                  Looma AI analyzes any screenshot you upload plus your exact words to generate a full interactive preview, production React TSX code, color tokens, and an AI build prompt.
                </p>
              </div>
            ) : (
              <>
                <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-[#101218]/95 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-display text-sm font-semibold text-white truncate">
                        {result.designName}
                      </h4>
                      {/* Color tokens preview */}
                      <div className="hidden sm:flex items-center gap-1" aria-label="Generated colors">
                        {[
                          result.palette.background,
                          result.palette.surface,
                          result.palette.primary,
                          result.palette.secondary,
                        ].map((hex, idx) => (
                          <span
                            key={idx}
                            title={hex}
                            className="w-3.5 h-3.5 rounded-full border border-white/25"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400 truncate">
                      {result.styleSummary} · {result.recommendedMotion}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyGeneratedPalette(result.palette.primary, result.palette.secondary);
                        setPaletteApplied(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5 text-blue-400" />
                      <span>{paletteApplied ? 'Colors Applied!' : 'Use Colors in Studio'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedPreview((v) => !v)}
                      aria-label={expandedPreview ? 'Exit fullscreen preview' : 'Expand preview'}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      {expandedPreview ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Mode Tabs + Viewport Toggle */}
                <div className="px-5 py-2.5 border-b border-zinc-800/80 bg-[#0D0F15] flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setActiveOutputTab('preview')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeOutputTab === 'preview'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Live Interactive Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveOutputTab('code')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeOutputTab === 'code'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>React TSX Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveOutputTab('prompt')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeOutputTab === 'prompt'
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>AI Build Prompt</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeOutputTab === 'preview' && (
                      <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setViewportMode('desktop')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
                            viewportMode === 'desktop'
                              ? 'bg-zinc-800 text-white'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportMode('mobile')}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer ${
                            viewportMode === 'mobile'
                              ? 'bg-zinc-800 text-white'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Mobile</span>
                        </button>
                      </div>
                    )}

                    {activeOutputTab === 'code' && (
                      <button
                        type="button"
                        onClick={() => copyText('code', result.reactCode)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-900 hover:bg-white cursor-pointer"
                      >
                        {copiedKey === 'code' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedKey === 'code' ? 'Copied TSX' : 'Copy TSX Code'}</span>
                      </button>
                    )}

                    {activeOutputTab === 'prompt' && (
                      <button
                        type="button"
                        onClick={() => copyText('prompt', result.aiPrompt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                      >
                        {copiedKey === 'prompt' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedKey === 'prompt' ? 'Copied Prompt' : 'Copy AI Prompt'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {activeOutputTab !== 'preview' && (
                  <div className="px-5 py-2.5 bg-[#0A0C12] border-b border-zinc-800/70 text-[11px] text-zinc-400">
                    <strong className="text-zinc-200 font-medium">What this copies:</strong>{' '}
                    {activeOutputTab === 'code'
                      ? 'Complete React + Tailwind TSX component matching your generated design.'
                      : 'Plain-English layout, color, typography, and motion specification—paste into any AI coding tool.'}
                  </div>
                )}

                {/* Stage Content */}
                <div className="flex-1 bg-[#07080C] flex items-center justify-center overflow-hidden">
                  {activeOutputTab === 'preview' && (
                    <div
                      className={`h-full transition-all duration-300 ${
                        viewportMode === 'mobile'
                          ? 'w-[390px] max-w-full my-4 rounded-3xl border border-zinc-700 overflow-hidden shadow-2xl'
                          : 'w-full'
                      }`}
                    >
                      <iframe
                        title={result.designName}
                        srcDoc={result.previewHtml}
                        sandbox="allow-scripts"
                        className={`w-full border-0 bg-transparent ${
                          expandedPreview ? 'h-[calc(100vh-210px)]' : 'h-[500px]'
                        }`}
                      />
                    </div>
                  )}

                  {activeOutputTab === 'code' && (
                    <pre className="w-full h-[500px] p-5 text-xs leading-relaxed text-zinc-300 font-mono overflow-auto">
                      <code>{result.reactCode}</code>
                    </pre>
                  )}

                  {activeOutputTab === 'prompt' && (
                    <pre className="w-full h-[500px] p-5 text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans overflow-auto">
                      {result.aiPrompt}
                    </pre>
                  )}
                </div>

                {/* Iterative Follow-Up Refinement Bar */}
                <form
                  onSubmit={handleRefine}
                  className="px-4 py-3 border-t border-zinc-800/80 bg-[#0D0F15] flex items-center gap-2.5"
                >
                  <input
                    type="text"
                    value={refineText}
                    onChange={(e) => setRefineText(e.target.value)}
                    placeholder="Want to tweak this design? e.g. Make buttons brighter blue, add a pricing toggle, soften the shadows..."
                    className="flex-1 rounded-xl bg-[#090B10] border border-zinc-800 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !refineText.trim()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Refine</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
