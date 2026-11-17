import type { UITemplateItem } from './uiTemplates';

export const CORE_UI_TEMPLATES: UITemplateItem[] = [
  // 1. RESPONSIVE LAYOUT & SPACING (3)
  {
    id: 'responsive-grid-bento',
    title: 'Adaptive Bento Grid',
    category: 'layout',
    categoryLabel: 'Layouts & Spacing',
    summary: 'Auto-adapting 1/2/3-column grid with consistent gaps from mobile to 1440px.',
    motionNote: 'Responsive CSS Grid + single elevation',
    code: `export function ResponsiveBentoGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h3 className="text-base font-semibold text-white">Primary Feature</h3>
        <p className="mt-1 text-sm text-zinc-400">Spans 2 columns on tablet & desktop, stacks cleanly on mobile.</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h3 className="text-base font-semibold text-white">Secondary Metric</h3>
        <p className="mt-1 text-sm text-zinc-400">Equal height card with 24px outer padding.</p>
      </div>
    </div>
  );
}`,
    prompt: `Build a Responsive Bento Grid layout in React + Tailwind CSS:
- Wrap inside a max-w-6xl centered container with px-4 sm:px-6 horizontal padding.
- Use grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with consistent gap-6 (24px), single-elevation border-zinc-800 cards, and p-6 container padding so outer padding >= inner element spacing.`,
  },
  {
    id: 'dashboard-shell',
    title: 'Responsive App Shell',
    category: 'layout',
    categoryLabel: 'Layouts & Spacing',
    summary: 'Sidebar + sticky top bar + fluid workspace that collapses cleanly on mobile.',
    motionNote: 'Collapsible drawer + sticky header',
    code: `import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B0C10] text-zinc-100 flex">
      <aside className={\`fixed inset-y-0 left-0 z-40 w-64 bg-[#12141B] border-r border-zinc-800 p-5 transition-transform md:static md:translate-x-0 \${drawerOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <div className="flex items-center justify-between mb-6">
          <span className="font-semibold">Workspace</span>
          <button onClick={() => setDrawerOpen(false)} className="md:hidden"><X className="w-4 h-4" /></button>
        </div>
        <nav className="space-y-1 text-sm text-zinc-400">
          <a href="#overview" className="block px-3 py-2 rounded-lg bg-zinc-800 text-white">Overview</a>
          <a href="#analytics" className="block px-3 py-2 rounded-lg hover:text-white">Analytics</a>
          <a href="#settings" className="block px-3 py-2 rounded-lg hover:text-white">Settings</a>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 px-6 border-b border-zinc-800 flex items-center gap-4">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden"><Menu className="w-4 h-4" /></button>
          <span className="text-sm font-medium">Overview</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}`,
    prompt: `Create a Responsive App Dashboard Shell:
- Render a fixed 256px sidebar on desktop that automatically collapses into a slide-in drawer toggled by a hamburger button below md breakpoint.
- Pair with a 56px sticky top bar and a min-w-0 main viewport so tables and cards never overflow horizontally.`,
  },
  {
    id: 'spacing-scale-cards',
    title: 'Spacing & Radius Presets',
    category: 'layout',
    categoryLabel: 'Layouts & Spacing',
    summary: 'Nested radius math (r_inner = r_outer - padding) and balanced spacing tiers.',
    motionNote: 'Consistent spatial proportions',
    code: `export function BalancedCard() {
  // Outer radius 20px (rounded-[20px]) - 12px padding = 8px inner radius (rounded-lg)
  return (
    <div className="rounded-[20px] border border-zinc-800 bg-zinc-900 p-3 space-y-3">
      <div className="rounded-lg bg-zinc-950 border border-zinc-800/80 p-4">
        <p className="text-sm font-medium text-white">Aligned Nested Radius</p>
        <p className="mt-1 text-xs text-zinc-400">Outer 20px minus 12px padding equals 8px inner radius.</p>
      </div>
    </div>
  );
}`,
    prompt: `Apply disciplined Spatial & Nested Radius Math across cards:
- Keep outer container padding (e.g., 12px–24px) >= inner gap between child items.
- Match inner child corner radius using r_inner = r_outer - padding (e.g., 20px outer card with 12px padding uses 8px inner radius) for optical alignment.`,
  },

  // 2. COLOR PALETTES & DARK MODE (1)
  {
    id: 'theme-tokens-switcher',
    title: 'Color Tokens & Dark Mode',
    category: 'theme',
    categoryLabel: 'Themes & Dark Mode',
    summary: 'Curated Light/Dark semantic palettes with background, surface, border, and accent tokens.',
    motionNote: '60-30-10 semantic CSS tokens',
    code: `import { useState } from 'react';

export function ThemeTokenPreview() {
  const [dark, setDark] = useState(true);
  return (
    <div className={\`rounded-2xl p-5 border transition-colors \${dark ? 'bg-[#0B0C10] border-zinc-800 text-zinc-100' : 'bg-[#F8F9FA] border-zinc-200 text-zinc-900'}\`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Semantic Surface</span>
        <button onClick={() => setDark(!dark)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white">
          {dark ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>
      <div className={\`mt-4 p-4 rounded-xl border \${dark ? 'bg-[#12141B] border-zinc-800' : 'bg-white border-zinc-200'}\`}>
        <p className="text-xs opacity-75">WCAG AA contrast preserved across both modes.</p>
      </div>
    </div>
  );
}`,
    prompt: `Implement a Dual-Theme Color Token System (Light & Dark Mode):
- Follow 60-30-10 color distribution: 60% neutral canvas (#0B0C10 dark / #F8F9FA light), 30% elevated surfaces (#12141B / #FFFFFF) with 1px borders, and 10% primary accent (#2563EB).
- Pair every background, surface, border, and text utility with both light and dark tokens so switching modes never causes contrast failures.`,
  },

  // 3. TYPOGRAPHY & TEXT HANDLING (2)
  {
    id: 'type-scale-pairings',
    title: 'Font Pairings & Scale',
    category: 'typography',
    categoryLabel: 'Typography',
    summary: 'Curated display, body, and tabular-numeral mono scales with balanced line wrapping.',
    motionNote: '2+1 Font Rule + text-wrap: balance',
    code: `export function TypographyHierarchy() {
  return (
    <div className="space-y-2 max-w-md">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-white" style={{ textWrap: 'balance' }}>
        Clear editorial hierarchy at every screen size
      </h2>
      <p className="text-sm leading-relaxed text-zinc-400">
        Body prose stays at 14px–16px with 1.6 line-height and 65ch max measure for effortless scanning.
      </p>
      <p className="font-mono tabular-nums text-xs text-blue-400">$14,280.00 · 99.94% uptime</p>
    </div>
  );
}`,
    prompt: `Set up a clean 2+1 Typography Scale:
- Pair Plus Jakarta Sans (SemiBold 600, tracking-tight, text-wrap: balance) for display headings with DM Sans (15px, line-height 1.6) for body copy and JetBrains Mono (tabular-nums) for numbers and metrics.
- Never use Inter or Roboto as defaults, and avoid orphan trailing headline words.`,
  },
  {
    id: 'truncation-wrapping',
    title: 'Safe Truncation & Wrapping',
    category: 'typography',
    categoryLabel: 'Typography',
    summary: 'Bulletproof truncate, line-clamp, and min-w-0 rules for messy usernames & URLs.',
    motionNote: 'Flex min-w-0 + line-clamp',
    code: `export function SafeUserRow({ name, bio }: { name: string; bio: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900 max-w-xs">
      <div className="w-9 h-9 rounded-full bg-blue-600 shrink-0 grid place-items-center text-xs font-semibold text-white">
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{name}</p>
        <p className="text-[11px] text-zinc-400 line-clamp-2 break-words">{bio}</p>
      </div>
    </div>
  );
}`,
    prompt: `Enforce Bulletproof Text Truncation & Wrapping:
- Always apply min-w-0 to flex/grid text wrappers next to shrink-0 avatars or buttons.
- Use truncate on single-line titles/controls and line-clamp-2 break-words on user-generated descriptions or long URLs so messy strings never break layout.`,
  },

  // 4. COMPLEX UI COMPONENTS (5)
  {
    id: 'multi-step-form',
    title: 'Multi-Step Wizard Form',
    category: 'components',
    categoryLabel: 'Complex UI',
    summary: '3-step guided form with step progress, validation, and smooth slide transitions.',
    motionNote: 'Directional step transitions',
    code: `import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex justify-between text-xs text-zinc-400 mb-4">
        <span>Step {step} of 3</span>
        <span className="font-mono tabular-nums">{Math.round((step / 3) * 100)}%</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <input placeholder={step === 1 ? 'Workspace name' : step === 2 ? 'Team email' : 'Ready to launch'} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white" />
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex justify-between">
        <button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="text-xs text-zinc-400 disabled:opacity-40">Back</button>
        <button onClick={() => setStep((s) => (s === 3 ? 1 : s + 1))} className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs text-white">
          {step === 3 ? 'Finish' : 'Continue'}
        </button>
      </div>
    </div>
  );
}`,
    prompt: `Build a 3-Step Multi-Step Wizard Form:
- Show explicit step counter ("Step 1 of 3") and tabular-nums completion percentage at the top.
- Animate transitions between steps horizontally via AnimatePresence mode="wait" with Back and Continue/Finish buttons.`,
  },
  {
    id: 'inputs-date-picker',
    title: 'Inputs & Date Picker',
    category: 'components',
    categoryLabel: 'Complex UI',
    summary: 'Accessible labeled input fields and styled date selector with clear focus rings.',
    motionNote: 'WCAG focus-visible states',
    code: `import { useState } from 'react';

export function LabeledInputGroup() {
  const [date, setDate] = useState('2026-11-20');
  return (
    <div className="w-full max-w-xs space-y-3">
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">Project Name</label>
        <input type="text" placeholder="Looma Launch" className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">Target Release</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500" />
      </div>
    </div>
  );
}`,
    prompt: `Build Clean Labeled Input Fields & Date Picker:
- Pair every input with an explicit <label> above, 40px minimum touch height, subtle border-zinc-700, and high-contrast focus:border-blue-500 focus rings.`,
  },
  {
    id: 'file-dropzone',
    title: 'File Upload Dropzone',
    category: 'components',
    categoryLabel: 'Complex UI',
    summary: 'Drag-and-drop file selector displaying filename, size, and clear/replace controls.',
    motionNote: 'Active drag highlight',
    code: `import { useState } from 'react';
import { Upload } from 'lucide-react';

export function FileDropzone() {
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <label className="block w-full max-w-xs rounded-xl border border-dashed border-zinc-700 hover:border-blue-500 bg-zinc-900/60 p-5 text-center cursor-pointer transition-colors">
      <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      <Upload className="w-5 h-5 mx-auto text-zinc-400" />
      <p className="mt-2 text-xs text-zinc-200 truncate">{fileName ?? 'Drop file or click to upload'}</p>
    </label>
  );
}`,
    prompt: `Create an Interactive File Upload Dropzone:
- Style a dashed-border drop area that highlights on drag-over and accepts click-to-browse via a hidden <input type="file">.
- Display the selected file name and allow instant removal or replacement.`,
  },
  {
    id: 'responsive-navbar',
    title: 'Responsive Navbar & Menu',
    category: 'components',
    categoryLabel: 'Complex UI',
    summary: 'Clean 3-zone header (Brand — Single-line links — 1 CTA) with mobile menu drawer.',
    motionNote: '3-Zone Top Bar Contract',
    code: `import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-zinc-800 bg-[#0B0C10]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        <a href="/" className="font-bold text-white whitespace-nowrap shrink-0">Looma</a>
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a href="#features" className="hover:text-white whitespace-nowrap">Features</a>
          <a href="#pricing" className="hover:text-white whitespace-nowrap">Pricing</a>
          <a href="#docs" className="hover:text-white whitespace-nowrap">Docs</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-medium whitespace-nowrap">Get Started</button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-1.5 text-zinc-300">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}`,
    prompt: `Build a Responsive 3-Zone Top Navigation Bar:
- Left: single-line Brand wordmark. Center: 3-4 concise single-line text links (whitespace-nowrap). Right: 1 primary CTA button plus a mobile menu toggle below md.
- Never place pills, badges, or stacked text inside the top bar.`,
  },
  {
    id: 'responsive-data-table',
    title: 'Mobile-Friendly Data Table',
    category: 'components',
    categoryLabel: 'Complex UI',
    summary: 'Tabular-nums data table on desktop that adapts into clean stacked cards on mobile.',
    motionNote: 'Desktop table <-> Mobile cards',
    code: `const ROWS = [
  { name: 'Starter Plan', users: '1,240', mrr: '$12,400' },
  { name: 'Pro Studio', users: '482', mrr: '$19,280' },
];

export function ResponsiveDataTable() {
  return (
    <div className="w-full">
      <table className="hidden sm:table w-full text-left text-xs">
        <thead className="text-zinc-400 border-b border-zinc-800">
          <tr><th className="py-2">Plan</th><th className="py-2 text-right">Users</th><th className="py-2 text-right">MRR</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/70">
          {ROWS.map((r) => (
            <tr key={r.name}>
              <td className="py-2.5 font-medium text-white">{r.name}</td>
              <td className="py-2.5 text-right font-mono tabular-nums text-zinc-300">{r.users}</td>
              <td className="py-2.5 text-right font-mono tabular-nums text-zinc-200">{r.mrr}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sm:hidden space-y-2">
        {ROWS.map((r) => (
          <div key={r.name} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 flex justify-between text-xs">
            <span className="font-medium text-white">{r.name}</span>
            <span className="font-mono tabular-nums text-zinc-300">{r.mrr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    prompt: `Build a Mobile-Friendly Data Table:
- On sm+ viewports, render a clean hairline-divided table with left-aligned text and right-aligned tabular-nums numeric columns.
- On narrow mobile viewports, automatically swap to stacked key-value cards so columns never squish or clip.`,
  },

  // 5. CONSISTENT ASSETS & BRANDING KITS (3)
  {
    id: 'uniform-icon-set',
    title: 'Uniform Stroke Icon Kit',
    category: 'assets',
    categoryLabel: 'Assets & Branding',
    summary: 'Cohesive navigation & action icon set sharing identical strokeWeight and sizing.',
    motionNote: 'Uniform 1.75px stroke geometry',
    code: `import { Home, Search, Bell, Settings, User, Folder, Plus, Share2 } from 'lucide-react';

export function UniformIconBar({ strokeWidth = 1.75 }: { strokeWidth?: number }) {
  const icons = [Home, Search, Folder, Bell, Share2, Plus, User, Settings];
  return (
    <div className="inline-flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900">
      {icons.map((Icon, i) => (
        <Icon key={i} className="w-4 h-4 text-zinc-300" strokeWidth={strokeWidth} />
      ))}
    </div>
  );
}`,
    prompt: `Standardize a Uniform Stroke Icon Kit across the app:
- Use a single icon family (Lucide) with consistent 16px–20px sizing and identical strokeWidth (e.g., 1.75px) across navigation, toolbars, and cards.
- Reserve icons strictly for functional affordances rather than decorative clutter.`,
  },
  {
    id: 'auth-svg-illustration',
    title: 'Auth SVG Illustration',
    category: 'assets',
    categoryLabel: 'Assets & Branding',
    summary: 'Customizable geometric vector artwork for sign-in, onboarding, and welcome panels.',
    motionNote: 'Scalable crisp SVG vector',
    code: `export function AuthGeometricIllustration({ accent = '#3B82F6' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[240px]" fill="none">
      <rect width="240" height="160" rx="16" fill="#10131C" />
      <circle cx="96" cy="80" r="42" stroke={accent} strokeWidth="2" strokeOpacity="0.6" />
      <rect x="112" y="46" width="68" height="68" rx="18" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="2" />
      <circle cx="146" cy="80" r="12" fill={accent} />
    </svg>
  );
}`,
    prompt: `Create a Customizable SVG Auth / Onboarding Illustration:
- Build crisp geometric SVG artwork styled with the app's primary accent token so it adapts dynamically across Light/Dark themes and loads with zero network latency.`,
  },
  {
    id: 'app-icon-favicon-kit',
    title: 'Favicon & App-Icon Kit',
    category: 'assets',
    categoryLabel: 'Assets & Branding',
    summary: 'Preview your active picture/logo across 16px tab favicon, 32px icon, and 64px tile.',
    motionNote: 'Multi-scale optical legibility',
    code: `<!-- Place in index.html <head> -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`,
    prompt: `Configure a Multi-Scale Favicon & App-Icon Kit:
- Verify the brand mark stays legible at 16px (browser tab), 32px (bookmark bar), and 64px–180px (mobile home screen squircle) with clean contrast and safe margin padding.`,
  },

  // 6. OPTIONAL MICRO-SOUND EFFECTS (1)
  {
    id: 'micro-sound-pack',
    title: 'Micro-Sound Effects Pack',
    category: 'sound',
    categoryLabel: 'Audio Feedback',
    summary: 'Optional, muted-by-default Web Audio UI sounds (click, pop, chime, buzz) + WAV download.',
    motionNote: 'Muted by default · Web Audio API',
    code: `export function playSoftClick(enabled: boolean) {
  if (!enabled) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(920, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.025);
  gain.gain.setValueAtTime(0.16, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.028);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
}`,
    prompt: `Add Optional Micro-Sound UI Feedback (Muted by Default):
- Keep audio strictly disabled by default until the user toggles Sound Effects On.
- Synthesize subtle, non-fatiguing feedback via Web Audio API (soft 25ms click, upward bubble pop, gentle 2-note success chime, muted error buzz) without external MP3 dependencies.`,
  },
];
