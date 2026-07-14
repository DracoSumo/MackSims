"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/backend";
import { getCurrentUser } from "@/lib/auth";
import { localGet, localSet } from "@/lib/safeStorage";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

const DEMO_KEY = "coachcore.continueDemoMode";
const SESSION_CHECK_MS = 2500;

function isNativeShell(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cap = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    return Boolean(cap?.isNativePlatform?.());
  } catch {
    return false;
  }
}

/**
 * Soft gate for /app when Supabase is configured.
 * Fail-open: never replace the workspace with an empty dark "checking" screen
 * (that reads as a black screen of death on OLED phones / Capacitor WebViews).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }

    // Native hybrid builds and returning demo users skip the hard gate.
    if (localGet(DEMO_KEY) === "1" || isNativeShell()) {
      setDemoMode(true);
      setReady(true);
      return;
    }

    let cancelled = false;
    setChecking(true);

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      // Timed out — open demo rather than leaving a blank dark screen.
      setDemoMode(true);
      localSet(DEMO_KEY, "1");
      setChecking(false);
      setReady(true);
    }, SESSION_CHECK_MS);

    void getCurrentUser()
      .then((next) => {
        if (cancelled) return;
        setUser(next);
      })
      .catch(() => {
        /* network / storage failures → demo */
      })
      .finally(() => {
        if (cancelled) return;
        window.clearTimeout(timeout);
        setChecking(false);
        setReady(true);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  function continueDemo() {
    localSet(DEMO_KEY, "1");
    setDemoMode(true);
  }

  // Always paint children once ready, or while still checking (SSR / first paint).
  // Only show the sign-in card after we know there is no session and demo was not chosen.
  const showSignIn =
    isSupabaseConfigured && ready && !checking && !demoMode && !user;

  if (showSignIn) {
    return (
      <div className="mx-auto min-h-screen max-w-lg px-6 py-16 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Coach sign-in</p>
        <h1 className="mt-3 text-3xl font-black">Sign in to open the coach workspace</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Supabase auth is configured for this build. Sign in with Google or GitHub, or continue in
          demo mode.
        </p>
        <div className="mt-6">
          <OAuthButtons />
        </div>
        <button
          type="button"
          onClick={continueDemo}
          className="mt-4 w-full rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-black text-amber-100 hover:bg-amber-300/20"
        >
          Continue in demo mode
        </button>
        <p className="mt-6 text-sm text-slate-500">
          Need an account?{" "}
          <Link href="/signup" className="font-bold text-sky-300">
            View signup
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      {checking ? (
        <div
          className="border-b border-white/10 bg-slate-950/80 px-4 py-2 text-center text-xs text-slate-400"
          role="status"
        >
          Checking coach session…
        </div>
      ) : null}
      {children}
    </>
  );
}
