"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { exchangeAuthCallbackCode, getCurrentUser } from "@/lib/auth";
import { mergeOnSignIn } from "@/services/supabaseSync";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    exchangeAuthCallbackCode().then(async (message) => {
      if (!active) return;
      if (message) {
        setError(message);
        return;
      }
      const user = await getCurrentUser();
      if (user) {
        const syncErr = await mergeOnSignIn(user);
        if (syncErr) {
          setError(syncErr);
          return;
        }
      }
      router.replace("/app");
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black">Sign-in failed</h1>
          <p className="mt-3 text-slate-400">{error}</p>
          <Link href="/login" className="mt-6 inline-block font-bold text-sky-300">
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <p className="text-slate-300">Signing you in…</p>
    </main>
  );
}
