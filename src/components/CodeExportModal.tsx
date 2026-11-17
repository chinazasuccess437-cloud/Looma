import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Code2, Copy, Download, FileText, Palette, X } from 'lucide-react';
import { MOTION_STYLES, type ExtractedPalette, type LoaderConfig } from '../types/loader';
import {
  generateBuildPrompt,
  generateHtmlCssSnippet,
  generateReactLoaderSnippet,
  generateThemeCssVariables,
  imageUrlToDataUrl,
  type ExportFormat,
} from '../utils/codeGenerator';
import { trackEvent } from '../utils/analytics';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoaderConfig;
  palette: ExtractedPalette;
}

type ExportTab = 'code' | 'prompt' | 'tokens';

export function CodeExportModal({
  isOpen,
  onClose,
  config,
  palette,
}: CodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>('code');
  const [format, setFormat] = useState<ExportFormat>('react');
  const [embedImage, setEmbedImage] = useState(true);
  const [embeddedDataUrl, setEmbeddedDataUrl] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isRasterImage = config.presetKind === 'logo' || config.presetKind === 'picture';

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    let active = true;
    if (!embedImage || !isRasterImage) {
      setEmbeddedDataUrl(null);
      return;
    }
    imageUrlToDataUrl(config.imageSrc).then((dataUrl) => {
      if (active) setEmbeddedDataUrl(dataUrl);
    });
    return () => {
      active = false;
    };
  }, [embedImage, isRasterImage, config.imageSrc]);

  const activeStyle = MOTION_STYLES.find((m) => m.id === config.motionStyle) ?? MOTION_STYLES[0];
  const code =
    format === 'react'
      ? generateReactLoaderSnippet(config, palette, embedImage ? embeddedDataUrl : null)
      : generateHtmlCssSnippet(config, palette, embedImage ? embeddedDataUrl : null);
  const promptText = generateBuildPrompt(config, palette);
  const themeCssText = generateThemeCssVariables(config, palette);

  const copyWithFeedback = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      trackEvent('export_copy', { export_type: key, motion_style: config.motionStyle });
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 2000);
    } catch {
      // Clipboard blocked cleanly
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    trackEvent('export_download', { filename, motion_style: config.motionStyle });
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const slug = (config.appName || 'alive-loader').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-[#12141B] shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800/90 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Export Your {config.appName || 'App'} Loader
                </h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  <span>{activeStyle.name}</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>{activeStyle.physicsNote}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close export modal"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Export Type Selector */}
            <div className="px-6 pt-4 pb-3 border-b border-zinc-800/80 bg-[#101218] flex flex-wrap items-center justify-between gap-3">
              <div
                className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800"
                role="tablist"
                aria-label="Export output type"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'code'}
                  onClick={() => setActiveTab('code')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Component Code</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'prompt'}
                  onClick={() => setActiveTab('prompt')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'prompt' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>AI Build Prompt</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'tokens'}
                  onClick={() => setActiveTab('tokens')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'tokens' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>CSS Theme Colors</span>
                </button>
              </div>

              {activeTab === 'code' && (
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setFormat('react')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                        format === 'react' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      React TSX
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat('html')}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                        format === 'html' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      HTML + CSS
                    </button>
                  </div>

                  {isRasterImage && (
                    <label className="inline-flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={embedImage}
                        onChange={(e) => setEmbedImage(e.target.checked)}
                        className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer"
                      />
                      <span className="whitespace-nowrap">Embed picture</span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Plain-English Explanation of What You Are Copying */}
            <div className="px-6 py-3 bg-[#0E1016] border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-zinc-300">
                {activeTab === 'code' && (
                  <>
                    <strong className="text-white font-medium">What this copies:</strong>{' '}
                    {format === 'react'
                      ? 'A self-contained React + Motion TSX component with your chosen animation, colors, and picture.'
                      : 'A complete zero-dependency HTML + CSS file you can open directly in any browser or project.'}
                  </>
                )}
                {activeTab === 'prompt' && (
                  <>
                    <strong className="text-white font-medium">What this copies:</strong>{' '}
                    A step-by-step plain-English command prompt describing your exact logo, motion physics, colors, and timing—paste into any AI coding tool.
                  </>
                )}
                {activeTab === 'tokens' && (
                  <>
                    <strong className="text-white font-medium">What this copies:</strong>{' '}
                    A ready-to-use <code className="text-blue-300">:root</code> CSS variables block for your background, surface, border, and brand aura colors—paste into your stylesheet.
                  </>
                )}
              </p>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'code') {
                      const ext = format === 'react' ? 'tsx' : 'html';
                      const mime =
                        format === 'react' ? 'text/plain;charset=utf-8' : 'text/html;charset=utf-8';
                      downloadFile(code, `${slug}-loader.${ext}`, mime);
                    } else if (activeTab === 'prompt') {
                      downloadFile(promptText, `${slug}-prompt.txt`, 'text/plain;charset=utf-8');
                    } else {
                      downloadFile(themeCssText, `${slug}-theme.css`, 'text/css;charset=utf-8');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'code') copyWithFeedback('code', code);
                    else if (activeTab === 'prompt') copyWithFeedback('prompt', promptText);
                    else copyWithFeedback('tokens', themeCssText);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                >
                  {copiedKey === activeTab ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedKey === activeTab
                      ? 'Copied!'
                      : activeTab === 'code'
                        ? 'Copy Code'
                        : activeTab === 'prompt'
                          ? 'Copy AI Prompt'
                          : 'Copy :root CSS'}
                  </span>
                </button>
              </div>
            </div>

            {/* Code / Prompt / Tokens Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#090B10]">
              {activeTab === 'code' && (
                <pre className="text-xs leading-relaxed text-zinc-300 font-mono overflow-x-auto">
                  <code>{code}</code>
                </pre>
              )}
              {activeTab === 'prompt' && (
                <pre className="text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                  {promptText}
                </pre>
              )}
              {activeTab === 'tokens' && (
                <pre className="text-xs leading-relaxed text-blue-300 font-mono overflow-x-auto">
                  <code>{themeCssText}</code>
                </pre>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
