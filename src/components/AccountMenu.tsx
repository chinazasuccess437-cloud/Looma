import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, LogOut } from 'lucide-react';
import { GoogleMark, useAuth } from '../hooks/useAuth';

export function AccountMenu() {
  const { user, authReady, authBusy, signInWithGoogle, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgFailed(false);
  }, [user?.photoURL]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, [menuOpen]);

  if (!authReady) {
    return (
      <div className="w-24 h-8 rounded-lg bg-zinc-900 border border-zinc-800 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        disabled={authBusy}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {authBusy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <GoogleMark />
        )}
        <span>{authBusy ? 'Signing in...' : 'Sign in'}</span>
      </button>
    );
  }

  const displayName = user.displayName || 'Looma Member';
  const firstName = displayName.split(' ')[0];
  const initial = displayName.trim().charAt(0).toUpperCase() || 'L';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-label={`Signed in as ${displayName}`}
        className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-zinc-700/90 bg-zinc-900/90 hover:border-zinc-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-blue-600/30 border border-white/20 grid place-items-center shrink-0">
          {user.photoURL && !imgFailed ? (
            <img
              src={user.photoURL}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-white">{initial}</span>
          )}
          <span
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-900"
            title="Signed in to Looma"
          />
        </div>
        <span className="text-xs font-medium text-zinc-100 max-w-[96px] truncate hidden sm:inline">
          {firstName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-[#12141B] p-3.5 shadow-2xl z-50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600/30 border border-white/20 grid place-items-center shrink-0">
              {user.photoURL && !imgFailed ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">{initial}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[11px] text-emerald-400">Signed in to Looma</p>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-2.5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                void signOutUser();
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
