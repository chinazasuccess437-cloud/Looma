import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import { trackEvent } from '../utils/analytics';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // Hide install button once Looma is running inside an installed standalone window
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      trackEvent(accepted ? 'pwa_install_accepted' : 'pwa_install_dismissed');
      return;
    }
    trackEvent('pwa_install_guide_opened', { platform: isIOS ? 'ios' : 'desktop' });
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={isInstallable ? 'Install Looma as a desktop or mobile app' : 'How to install Looma'}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-700/90 bg-zinc-900/90 text-zinc-200 hover:text-white hover:border-zinc-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-blue-400" />
        <span>Install App</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#12141B] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  {isIOS ? 'Install Looma on iPhone / iPad' : 'Install Looma in Chrome'}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Save Looma to your desktop or home screen for instant launch and offline access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install instructions"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-4 space-y-2 text-xs text-zinc-300 leading-relaxed list-decimal list-inside">
                <li>
                  Tap the <strong className="text-white">Share</strong> icon in Safari’s toolbar.
                </li>
                <li>
                  Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-white">Add</strong> to launch Looma as its own app.
                </li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-2 text-xs text-zinc-300 leading-relaxed list-decimal list-inside">
                <li>
                  Open Looma in its own Chrome tab (if viewing inside an embedded preview frame).
                </li>
                <li>
                  Click the <strong className="text-white">Install Looma</strong> icon in the right side of Chrome’s address bar—or open{' '}
                  <strong className="text-white">Chrome Menu (⋮) → Cast, save, and share → Install Looma</strong>.
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2 text-xs font-medium text-white cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/90 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md">
      <span>Offline Mode — Cached studio &amp; templates available</span>
    </div>
  );
}
