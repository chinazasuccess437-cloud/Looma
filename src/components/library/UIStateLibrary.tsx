import React, { useEffect, useMemo, useState } from 'react';
import { Check, Code2, Copy, Maximize2, Search } from 'lucide-react';
import type { ExtractedPalette, LoaderConfig } from '../../types/loader';
import {
  ESSENTIALS_CATEGORIES,
  MOTION_CATEGORIES,
  UI_TEMPLATES,
  type LibraryCategoryId,
  type UITemplateItem,
} from '../../data/uiTemplates';
import { CORE_UI_TEMPLATES } from '../../data/coreUiTemplates';
import { TemplatePreview } from './TemplatePreviews';
import { TemplateInspectModal } from './TemplateInspectModal';
import { useAuth } from '../../hooks/useAuth';

export type LibrarySection = 'motion' | 'essentials';

interface UIStateLibraryProps {
  section: LibrarySection;
  config: LoaderConfig;
  palette: ExtractedPalette;
}

export function UIStateLibrary({
  section,
  config,
  palette,
}: UIStateLibraryProps) {
  const { requireSignIn } = useAuth();
  const [category, setCategory] = useState<LibraryCategoryId>('all');
  const [query, setQuery] = useState('');
  const [inspected, setInspected] = useState<UITemplateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setCategory('all');
    setQuery('');
  }, [section]);

  const visibleCategories = useMemo(() => {
    return section === 'motion'
      ? [{ id: 'all' as const, label: 'All States' }, ...MOTION_CATEGORIES]
      : [{ id: 'all' as const, label: 'All Layouts & UI' }, ...ESSENTIALS_CATEGORIES];
  }, [section]);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = section === 'motion' ? UI_TEMPLATES : CORE_UI_TEMPLATES;

    return base.filter((item) => {
      const matchesCat = category === 'all' || item.category === category;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [section, category, query]);

  const handleQuickCopy = (id: string, kind: 'code' | 'prompt', text: string) => {
    requireSignIn('copy production TSX code & AI build prompts', async () => {
      try {
        await navigator.clipboard.writeText(text);
        const token = `${id}:${kind}`;
        setCopiedId(token);
        window.setTimeout(() => {
          setCopiedId((curr) => (curr === token ? null : curr));
        }, 1700);
      } catch {
        // Clipboard blocked cleanly
      }
    });
  };

  return (
    <section id="ui-library" className="space-y-5">
      {/* Single Clean Category Row + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Template categories"
        >
          {visibleCategories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-[#12141B] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              section === 'motion'
                ? 'Search splash, skeleton, toast, error...'
                : 'Search grid, dark mode, table, sound...'
            }
            aria-label="Search templates"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#12141B] border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Clear Export Orientation Line */}
      <p className="text-xs text-zinc-400">
        Interact with any live preview below.{' '}
        <span className="text-zinc-200 font-medium">Copy TSX</span> copies ready-to-paste React component code;{' '}
        <span className="text-zinc-200 font-medium">Copy AI Prompt</span> copies plain-English build instructions you can paste into any AI tool.
      </p>

      {/* Empty Search Results */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#12141B]/60 py-14 px-6 text-center">
          <p className="text-sm font-medium text-zinc-200">
            No templates match &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Try another keyword or reset the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-100 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((item) => {
            const codeCopied = copiedId === `${item.id}:code`;
            const promptCopied = copiedId === `${item.id}:prompt`;

            return (
              <article
                key={item.id}
                className="looma-floating-card rounded-2xl border border-zinc-800/90 p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span className="truncate">{item.categoryLabel}</span>
                    <button
                      type="button"
                      onClick={() => setInspected(item)}
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                      aria-label={`Inspect ${item.title} code and prompt`}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Preview &amp; Code</span>
                    </button>
                  </div>

                  <h3 className="mt-1.5 font-display text-base font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed min-h-[34px]">
                    {item.summary}
                  </p>

                  <div className="mt-4 h-48 rounded-xl border border-zinc-800/80 bg-[#0B0D12] p-4 grid place-items-center overflow-hidden">
                    <TemplatePreview
                      templateId={item.id}
                      config={config}
                      palette={palette}
                    />
                  </div>
                </div>

                <div className="pt-1 space-y-2">
                  <p className="text-[11px] text-zinc-500 truncate">
                    Exports: React TSX component or AI build prompt
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Copy self-contained React + Tailwind TSX component code"
                      onClick={() => handleQuickCopy(item.id, 'code', item.code)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      {codeCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Code2 className="w-3.5 h-3.5" />
                      )}
                      <span>{codeCopied ? 'Copied TSX' : 'Copy TSX'}</span>
                    </button>

                    <button
                      type="button"
                      title="Copy plain-English design & behavior prompt for AI coding tools"
                      onClick={() => handleQuickCopy(item.id, 'prompt', item.prompt)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                    >
                      {promptCopied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{promptCopied ? 'Copied Prompt' : 'Copy AI Prompt'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <TemplateInspectModal
        template={inspected}
        config={config}
        palette={palette}
        onClose={() => setInspected(null)}
      />
    </section>
  );
}
