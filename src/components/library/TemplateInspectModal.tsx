import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, X } from 'lucide-react';
import type { ExtractedPalette, LoaderConfig } from '../../types/loader';
import type { UITemplateItem } from '../../data/uiTemplates';
import { TemplatePreview } from './TemplatePreviews';
import { useAuth } from '../../hooks/useAuth';

interface TemplateInspectModalProps {
  template: UITemplateItem | null;
  config: LoaderConfig;
  palette: ExtractedPalette;
  onClose: () => void;
}

export function TemplateInspectModal({
  template,
  config,
  palette,
  onClose,
}: TemplateInspectModalProps) {
  const { requireSignIn } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    if (!template) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [template, onClose]);

  const copyText = (text: string, which: 'code' | 'prompt') => {
    requireSignIn('copy template code or AI prompt', async () => {
      try {
        await navigator.clipboard.writeText(text);
        if (which === 'code') {
          setCopiedCode(true);
          window.setTimeout(() => setCopiedCode(false), 1800);
        } else {
          setCopiedPrompt(true);
          window.setTimeout(() => setCopiedPrompt(false), 1800);
        }
      } catch {
        // Ignore clipboard permission errors cleanly
      }
    });
  };

  return (
    <AnimatePresence>
      {template && (
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
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#12141B] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800/90 flex items-center justify-between gap-4 sticky top-0 bg-[#12141B] z-10">
              <div>
                <p className="text-xs text-zinc-400">
                  <span>{template.categoryLabel}</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>{template.motionNote}</span>
                </p>
                <h2 className="mt-0.5 font-display text-lg font-semibold text-white">
                  {template.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close template inspector"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Preview Stage */}
            <div className="p-6 border-b border-zinc-800/80 bg-[#0B0D12] min-h-[210px] grid place-items-center">
              <TemplatePreview
                templateId={template.id}
                config={config}
                palette={palette}
              />
            </div>

            {/* Dual Export: Code + AI Prompt */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80">
              <div className="flex flex-col min-w-0">
                <div className="px-6 py-3 bg-[#101218] border-b border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">React TSX Code</span>
                  <button
                    type="button"
                    onClick={() => copyText(template.code, 'code')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-900 hover:bg-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode ? 'Copied TSX' : 'Copy TSX Code'}</span>
                  </button>
                </div>
                <div className="px-6 py-2.5 bg-[#0D0F15] border-b border-zinc-800/70 text-[11px] text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200 font-medium">What this copies:</strong>{' '}
                  Self-contained React + Tailwind + Motion component—paste directly into your component file.
                </div>
                <div className="p-5 bg-[#090B10] overflow-x-auto max-h-72 overflow-y-auto">
                  <pre className="text-xs leading-relaxed text-zinc-300 font-mono">
                    <code>{template.code}</code>
                  </pre>
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="px-6 py-3 bg-[#101218] border-b border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">AI Build Prompt</span>
                  <button
                    type="button"
                    onClick={() => copyText(template.prompt, 'prompt')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied Prompt' : 'Copy AI Prompt'}</span>
                  </button>
                </div>
                <div className="px-6 py-2.5 bg-[#0D0F15] border-b border-zinc-800/70 text-[11px] text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200 font-medium">What this copies:</strong>{' '}
                  Plain-English design &amp; behavior instructions—paste into an AI coding assistant to build this exact state.
                </div>
                <div className="p-5 bg-[#090B10] max-h-72 overflow-y-auto">
                  <pre className="text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                    {template.prompt}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
