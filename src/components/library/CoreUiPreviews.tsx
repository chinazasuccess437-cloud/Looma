import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Check,
  Copy,
  Download,
  Folder,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Share2,
  Upload,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { ExtractedPalette, LoaderConfig } from '../../types/loader';
import { RibbonSLogo, VectorMonogram } from '../AliveLoader';
import {
  downloadUISoundWav,
  playUISound,
  UI_SOUNDS,
} from '../../utils/soundEffects';

interface CoreUiPreviewProps {
  templateId: string;
  config: LoaderConfig;
  palette: ExtractedPalette;
}

export function CoreUiPreview({ templateId, config, palette }: CoreUiPreviewProps) {
  switch (templateId) {
    case 'responsive-grid-bento':
      return <BentoGridPreview />;
    case 'dashboard-shell':
      return <DashboardShellPreview />;
    case 'spacing-scale-cards':
      return <SpacingRadiusPreview />;
    case 'theme-tokens-switcher':
      return <ThemeTokensPreview />;
    case 'type-scale-pairings':
      return <TypePairingPreview />;
    case 'truncation-wrapping':
      return <TruncationPreview />;
    case 'multi-step-form':
      return <MultiStepFormPreview />;
    case 'inputs-date-picker':
      return <InputsDatePreview />;
    case 'file-dropzone':
      return <FileDropzonePreview />;
    case 'responsive-navbar':
      return <ResponsiveNavbarPreview />;
    case 'responsive-data-table':
      return <ResponsiveTablePreview />;
    case 'uniform-icon-set':
      return <UniformIconPreview />;
    case 'auth-svg-illustration':
      return <AuthIllustrationPreview palette={palette} />;
    case 'app-icon-favicon-kit':
      return <FaviconKitPreview config={config} palette={palette} />;
    case 'micro-sound-pack':
      return <MicroSoundPackPreview />;
    default:
      return null;
  }
}

function BentoGridPreview() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  return (
    <div className="w-full max-w-[260px] space-y-2.5">
      <div className="flex justify-center gap-1">
        {(['desktop', 'mobile'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setViewport(v)}
            className={`px-2.5 py-1 rounded text-[11px] capitalize cursor-pointer ${
              viewport === v ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div
        className={`mx-auto grid gap-1.5 transition-all ${
          viewport === 'desktop' ? 'w-full grid-cols-3' : 'w-32 grid-cols-1'
        }`}
      >
        <div
          className={`rounded-lg bg-zinc-800/90 border border-zinc-700/70 p-2 text-[10px] text-zinc-200 ${
            viewport === 'desktop' ? 'col-span-2' : ''
          }`}
        >
          Hero Feature
        </div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-[10px] text-zinc-400">
          Stat
        </div>
        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-[10px] text-zinc-400">
          Card A
        </div>
        <div
          className={`rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-[10px] text-zinc-400 ${
            viewport === 'desktop' ? 'col-span-2' : ''
          }`}
        >
          Card B
        </div>
      </div>
    </div>
  );
}

function DashboardShellPreview() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState<'Overview' | 'Analytics' | 'Settings'>('Overview');
  return (
    <div className="w-full max-w-[260px] h-36 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex">
      <div
        className={`bg-zinc-900 border-r border-zinc-800 p-2 transition-all shrink-0 flex flex-col ${
          collapsed ? 'w-11' : 'w-24'
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="text-[10px] text-blue-400 hover:text-blue-300 text-left cursor-pointer"
        >
          {collapsed ? '→' : '← Fold'}
        </button>
        <nav className="mt-2.5 space-y-1">
          {(['Overview', 'Analytics', 'Settings'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              className={`w-full text-left px-1.5 py-1 rounded text-[10px] truncate cursor-pointer ${
                page === item
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {collapsed ? item[0] : item}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-8 px-3 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-200 font-medium">
          <span>{page}</span>
        </div>
        <div className="flex-1 p-2.5 text-[11px] text-zinc-400">
          {page === 'Overview' && 'Active sessions & key metrics'}
          {page === 'Analytics' && 'Conversion rate: 4.8% (+0.6%)'}
          {page === 'Settings' && 'Workspace permissions & theme'}
        </div>
      </div>
    </div>
  );
}

function SpacingRadiusPreview() {
  const [tier, setTier] = useState<'compact' | 'balanced' | 'airy'>('balanced');
  const pad = tier === 'compact' ? 6 : tier === 'balanced' ? 12 : 18;
  const outer = 22;
  const inner = outer - pad;
  return (
    <div className="w-full max-w-[240px] space-y-2.5">
      <div className="flex justify-center gap-1">
        {(['compact', 'balanced', 'airy'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={`px-2 py-1 rounded text-[11px] capitalize cursor-pointer ${
              tier === t ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div
        className="border border-zinc-700 bg-zinc-900 transition-all"
        style={{ borderRadius: outer, padding: pad }}
      >
        <div
          className="bg-zinc-950 border border-zinc-800 p-2.5 text-center transition-all"
          style={{ borderRadius: Math.max(4, inner) }}
        >
          <span className="text-[11px] font-mono tabular-nums text-zinc-300">
            r_in = {outer} - {pad} = {inner}px
          </span>
        </div>
      </div>
    </div>
  );
}

function ThemeTokensPreview() {
  const [dark, setDark] = useState(true);
  const [accent, setAccent] = useState('#3B82F6');
  const [copied, setCopied] = useState(false);

  const copyCssTokens = async () => {
    const css = `:root {\n  --bg: ${dark ? '#090A0E' : '#F6F5F1'};\n  --surface: ${dark ? '#12141B' : '#FFFFFF'};\n  --border: ${dark ? '#27272A' : '#E4E4E7'};\n  --text: ${dark ? '#F4F4F5' : '#18181B'};\n  --accent: ${accent};\n}`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <div
      className={`w-full max-w-[250px] rounded-xl p-3 border transition-colors ${
        dark
          ? 'bg-[#090A0E] border-zinc-800 text-zinc-100'
          : 'bg-[#F6F5F1] border-zinc-300 text-zinc-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {['#3B82F6', '#10B981', '#D97706'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setAccent(c)}
              aria-label={`Select accent ${c}`}
              className={`w-4 h-4 rounded-full cursor-pointer ${
                accent === c ? 'ring-2 ring-white/80' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white cursor-pointer"
          style={{ backgroundColor: accent }}
        >
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div
        className={`mt-2.5 p-2.5 rounded-lg border text-[11px] flex items-center justify-between gap-2 ${
          dark
            ? 'bg-[#12141B] border-zinc-800 text-zinc-300'
            : 'bg-white border-zinc-200 text-zinc-700'
        }`}
      >
        <span>Contrast verified</span>
        <button
          type="button"
          onClick={copyCssTokens}
          className="inline-flex items-center gap-1 underline cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'CSS'}</span>
        </button>
      </div>
    </div>
  );
}

function TypePairingPreview() {
  const [scale, setScale] = useState<'editorial' | 'product'>('product');
  const [heading, setHeading] = useState('Balanced Heading Scale');
  return (
    <div className="w-full max-w-[250px] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {(['product', 'editorial'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={`px-2 py-0.5 rounded text-[11px] capitalize cursor-pointer ${
                scale === s ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          aria-label="Edit preview heading"
          className="w-28 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
        <p
          className={`text-sm font-semibold text-white tracking-tight truncate ${
            scale === 'editorial' ? 'font-serif italic' : 'font-display'
          }`}
        >
          {heading || 'Balanced Heading Scale'}
        </p>
        <p className="mt-1 text-[11px] text-zinc-400 leading-snug">
          Readable body copy + <span className="font-mono tabular-nums text-blue-400">99.9%</span> mono metrics.
        </p>
      </div>
    </div>
  );
}

function TruncationPreview() {
  const [name, setName] = useState('Alexandria-Maximilian-Von-Schwarzenberg');
  const bio =
    'https://example.com/workspaces/super-long-unbroken-deployment-url-string-that-could-overflow';
  return (
    <div className="w-full max-w-[250px] space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type any long name..."
        aria-label="Test username truncation"
        className="w-full px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none focus:border-blue-500"
      />
      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 grid place-items-center text-[11px] font-semibold text-white">
          {(name || 'U').slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white truncate">{name || 'User'}</p>
          <p className="text-[11px] text-zinc-400 line-clamp-2 break-words">{bio}</p>
        </div>
      </div>
    </div>
  );
}

function MultiStepFormPreview() {
  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState('Looma Studio');
  const [email, setEmail] = useState('team@looma.app');
  const [err, setErr] = useState('');

  const handleNext = () => {
    if (step === 1 && !workspace.trim()) {
      setErr('Enter workspace name');
      return;
    }
    if (step === 2 && !email.includes('@')) {
      setErr('Enter valid email');
      return;
    }
    setErr('');
    setStep((s) => (s === 3 ? 1 : s + 1));
  };

  return (
    <div className="w-full max-w-[240px] rounded-xl bg-zinc-900 border border-zinc-800 p-3">
      <div className="flex justify-between text-[11px] text-zinc-400 mb-2">
        <span>Step {step} of 3</span>
        <span className="font-mono tabular-nums text-zinc-200">
          {Math.round((step / 3) * 100)}%
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.16 }}
        >
          {step === 1 && (
            <input
              type="text"
              value={workspace}
              onChange={(e) => {
                setWorkspace(e.target.value);
                setErr('');
              }}
              placeholder="Workspace name"
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          )}
          {step === 2 && (
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr('');
              }}
              placeholder="you@company.com"
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          )}
          {step === 3 && (
            <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 truncate">
              Ready: {workspace} · {email}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {err && <p className="mt-1 text-[10px] text-rose-400">{err}</p>}
      <div className="mt-2.5 flex justify-between">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => {
            setErr('');
            setStep((s) => s - 1);
          }}
          className="text-[11px] text-zinc-400 disabled:opacity-35 cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-2.5 py-1 rounded-md bg-blue-600 text-[11px] text-white cursor-pointer"
        >
          {step === 3 ? 'Restart' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function InputsDatePreview() {
  const [title, setTitle] = useState('Looma v2');
  const [date, setDate] = useState('2026-11-20');
  return (
    <div className="w-full max-w-[220px] space-y-2">
      <div>
        <label className="block text-[11px] text-zinc-400 mb-1">Release Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-[11px] text-zinc-400 mb-1">Launch Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}

function FileDropzonePreview() {
  const [fileInfo, setFileInfo] = useState<{ name: string; sizeKb: number; previewUrl?: string } | null>(null);
  const [dragging, setDragging] = useState(false);

  const readPickedFile = (file: File | undefined) => {
    if (!file) return;
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileInfo({
          name: file.name,
          sizeKb,
          previewUrl: typeof reader.result === 'string' ? reader.result : undefined,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFileInfo({ name: file.name, sizeKb });
    }
  };

  return (
    <div className="w-full max-w-[235px]">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          readPickedFile(e.dataTransfer.files?.[0]);
        }}
        className={`block rounded-xl border border-dashed p-3 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-700 hover:border-blue-500 bg-zinc-900/60'
        }`}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => readPickedFile(e.target.files?.[0])}
        />
        {fileInfo?.previewUrl ? (
          <div className="flex items-center gap-2.5 text-left">
            <img
              src={fileInfo.previewUrl}
              alt={fileInfo.name}
              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-100 truncate">{fileInfo.name}</p>
              <p className="text-[10px] font-mono tabular-nums text-zinc-400">{fileInfo.sizeKb} KB</p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-4 h-4 mx-auto text-zinc-400" />
            <p className="mt-1.5 text-xs text-zinc-200 truncate">
              {fileInfo ? `${fileInfo.name} (${fileInfo.sizeKb} KB)` : 'Drop picture or file'}
            </p>
          </>
        )}
      </label>
      {fileInfo && (
        <button
          type="button"
          onClick={() => setFileInfo(null)}
          className="mt-1.5 block mx-auto text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          Clear file
        </button>
      )}
    </div>
  );
}

function ResponsiveNavbarPreview() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeRoute, setActiveRoute] = useState('Features');
  return (
    <div className="w-full max-w-[250px] rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="px-3 h-10 border-b border-zinc-800 flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-white">Looma</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveRoute('Started')}
            className="px-2 py-0.5 rounded bg-white text-zinc-900 text-[10px] font-medium cursor-pointer"
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => setMobileMenu((o) => !o)}
            className="text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenu ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {mobileMenu ? (
        <div className="p-2 space-y-1 text-[11px] bg-zinc-900">
          {['Features', 'Pricing', 'Docs'].map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => {
                setActiveRoute(link);
                setMobileMenu(false);
              }}
              className={`block w-full text-left px-2 py-1 rounded cursor-pointer ${
                activeRoute === link ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-3 text-[11px] text-zinc-400 text-center">
          Viewing: <span className="text-zinc-200 font-medium">{activeRoute}</span>
        </div>
      )}
    </div>
  );
}

function ResponsiveTablePreview() {
  const [mobileMode, setMobileMode] = useState(false);
  const [rows, setRows] = useState([
    { name: 'Starter', mrr: 1240 },
    { name: 'Studio', mrr: 4820 },
  ]);

  const addRow = () => {
    setRows((prev) =>
      prev.length >= 4
        ? [
            { name: 'Starter', mrr: 1240 },
            { name: 'Studio', mrr: 4820 },
          ]
        : [...prev, { name: `Scale ${prev.length}`, mrr: 6400 }]
    );
  };

  return (
    <div className="w-full max-w-[250px] space-y-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addRow}
          className="text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          {rows.length >= 4 ? 'Reset rows' : '+ Add Row'}
        </button>
        <button
          type="button"
          onClick={() => setMobileMode((m) => !m)}
          className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          {mobileMode ? 'Desktop Table' : 'Mobile Cards'}
        </button>
      </div>
      {mobileMode ? (
        <div className="space-y-1.5 max-h-24 overflow-y-auto">
          {rows.map((r) => (
            <div
              key={r.name}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex justify-between text-xs"
            >
              <span className="text-white">{r.name}</span>
              <span className="font-mono tabular-nums text-zinc-300">
                ${r.mrr.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-h-24 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="py-1">Tier</th>
                <th className="py-1 text-right">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="py-1.5 text-zinc-200">{r.name}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-zinc-300">
                    ${r.mrr.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UniformIconPreview() {
  const [stroke, setStroke] = useState(1.75);
  const icons = [Home, Search, Folder, Bell, Share2, Plus, User, Settings];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
        {icons.map((Icon, idx) => (
          <Icon key={idx} className="w-4 h-4 text-zinc-200" strokeWidth={stroke} />
        ))}
      </div>
      <div className="flex gap-1.5">
        {[1.25, 1.75, 2.25].map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setStroke(w)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono tabular-nums cursor-pointer ${
              stroke === w ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            {w}px
          </button>
        ))}
      </div>
    </div>
  );
}

function AuthIllustrationPreview({ palette }: { palette: ExtractedPalette }) {
  const [accent, setAccent] = useState(palette.primary);
  return (
    <div className="flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 180 100" className="w-44 h-24 rounded-xl border border-zinc-800" fill="none">
        <rect width="180" height="100" fill="#10131C" />
        <circle cx="72" cy="50" r="28" stroke={accent} strokeWidth="2" strokeOpacity="0.65" />
        <rect
          x="84"
          y="26"
          width="48"
          height="48"
          rx="14"
          fill={accent}
          fillOpacity="0.2"
          stroke={accent}
          strokeWidth="2"
        />
        <circle cx="108" cy="50" r="9" fill={accent} />
      </svg>
      <div className="flex gap-1.5">
        {[palette.primary, '#10B981', '#F472B6'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setAccent(c)}
            aria-label={`Set illustration accent ${c}`}
            className={`w-4 h-4 rounded-full cursor-pointer ${
              accent === c ? 'ring-2 ring-white/80' : ''
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

function FaviconKitPreview({
  config,
  palette,
}: {
  config: LoaderConfig;
  palette: ExtractedPalette;
}) {
  const [customSrc, setCustomSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setCustomSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const activeSrc = customSrc ?? config.imageSrc;
  const isRaster = Boolean(customSrc) || (config.presetKind !== 'ribbon-s' && config.presetKind !== 'vector');

  const downloadPngIcon = () => {
    if (!isRaster) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 180;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.roundRect(0, 0, 180, 180, 44);
      ctx.clip();
      ctx.drawImage(img, 0, 0, 180, 180);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'app-icon-180.png';
      a.click();
    };
    img.src = activeSrc;
  };

  const renderMark = () => {
    if (!customSrc && config.presetKind === 'ribbon-s') {
      return <RibbonSLogo animateAction={false} />;
    }
    if (!customSrc && config.presetKind === 'vector') {
      return <VectorMonogram color={palette.secondary} accent={palette.primary} />;
    }
    return (
      <img
        src={activeSrc}
        alt={config.appName}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handlePick(e.target.files?.[0])}
      />
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded overflow-hidden border border-white/15">{renderMark()}</div>
          <span className="text-[10px] font-mono tabular-nums text-zinc-500">16px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/15">{renderMark()}</div>
          <span className="text-[10px] font-mono tabular-nums text-zinc-500">32px</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-[26%] overflow-hidden border border-white/15 shadow-lg">
            {renderMark()}
          </div>
          <span className="text-[10px] font-mono tabular-nums text-zinc-500">64px</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          Pick Picture
        </button>
        {isRaster && (
          <button
            type="button"
            onClick={downloadPngIcon}
            className="text-zinc-300 hover:text-white cursor-pointer"
          >
            Download PNG
          </button>
        )}
      </div>
    </div>
  );
}

function MicroSoundPackPreview() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="w-full max-w-[250px] space-y-2.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSoundEnabled((e) => !e)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-colors ${
            soundEnabled
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{soundEnabled ? 'Sound On' : 'Muted (Enable)'}</span>
        </button>
        <span className="text-[10px] text-zinc-500">Web Audio</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {UI_SOUNDS.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1.5"
          >
            <button
              type="button"
              onClick={() => {
                if (!soundEnabled) setSoundEnabled(true);
                playUISound(s.id);
              }}
              className="text-[11px] text-zinc-200 hover:text-white truncate cursor-pointer text-left"
              title={`Preview ${s.label}`}
            >
              {s.label}
            </button>
            <button
              type="button"
              onClick={() => downloadUISoundWav(s.id)}
              aria-label={`Download ${s.label} WAV`}
              title="Download .wav"
              className="text-zinc-400 hover:text-blue-400 shrink-0 ml-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
