"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/backend";
import { getCurrentUser } from "@/lib/auth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [demoBypass, setDemoBypass] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }

    let active = true;
    getCurrentUser()
      .then((next) => {
        if (active) setUser(next);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isSupabaseConfigured || demoBypass || user) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6 text-slate-300">
        Checking coach session…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-white">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Coach sign-in</p>
      <h1 className="mt-3 text-3xl font-black">Sign in to open the coach workspace</h1>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Supabase auth is configured for this build. Sign in with Google or GitHub, or continue in demo mode.
      </p>
      <div className="mt-6">
        <OAuthButtons />
      </div>
      <button
        type="button"
        onClick={() => setDemoBypass(true)}
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
