import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Loader2, LogIn, X } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { trackEvent } from '../utils/analytics';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  requireSignIn: (actionDescription: string, onAuthenticated: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [gateReason, setGateReason] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      trackEvent('google_sign_in');
      const signedInUser = credential.user;
      setUser(signedInUser);
      setGateReason(null);
      const pending = pendingActionRef.current;
      pendingActionRef.current = null;
      if (pending) {
        window.setTimeout(pending, 50);
      }
      return signedInUser;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was cancelled.';
      if (!msg.includes('popup-closed-by-user') && !msg.includes('cancelled-popup-request')) {
        if (msg.includes('auth/unauthorized-domain')) {
          const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
          setAuthError(
            `Google Sign-In is not authorized on "${host}" yet. Add "${host}" in Firebase Console → Authentication → Settings → Authorized domains.`
          );
        } else {
          setAuthError(msg);
        }
      }
      return null;
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
    pendingActionRef.current = null;
    setGateReason(null);
    trackEvent('google_sign_out');
  }, []);

  const requireSignIn = useCallback(
    (actionDescription: string, onAuthenticated: () => void) => {
      if (auth.currentUser) {
        onAuthenticated();
        return;
      }
      pendingActionRef.current = onAuthenticated;
      setAuthError(null);
      setGateReason(actionDescription);
      trackEvent('auth_gate_shown', { action: actionDescription });
    },
    []
  );

  const closeGate = useCallback(() => {
    pendingActionRef.current = null;
    setGateReason(null);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        authBusy,
        authError,
        signInWithGoogle,
        signOutUser,
        requireSignIn,
      }}
    >
      {children}

      {/* Friendly Tour -> Sign-In Prompt Modal */}
      <AnimatePresence>
        {gateReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeGate}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#12141B] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 grid place-items-center text-blue-400 shrink-0">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">
                      Sign in with Google to continue
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Tour freely anytime—sign in when ready to build.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeGate}
                  aria-label="Close sign in prompt"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Please sign in with Google to <span className="text-white font-medium">{gateReason}</span>.
                Your profile photo will show in Looma, and your requested action will run right away.
              </p>

              {authError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
                  {authError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => void signInWithGoogle()}
                  disabled={authBusy}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {authBusy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <GoogleMark />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeGate}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Keep Touring</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Surface sign-in errors (e.g. auth/unauthorized-domain) when triggered directly from header */}
      <AnimatePresence>
        {authError && !gateReason && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-5 right-5 sm:left-auto sm:max-w-md z-50 rounded-2xl border border-rose-500/40 bg-[#181217] px-4 py-3 text-xs text-rose-200 shadow-2xl flex items-start justify-between gap-3"
          >
            <span className="leading-relaxed">{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              aria-label="Dismiss sign-in error"
              className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/20 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}
