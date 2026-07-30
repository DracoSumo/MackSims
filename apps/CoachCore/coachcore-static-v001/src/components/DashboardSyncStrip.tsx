"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/config/backend";
import { getSyncDashboard, syncStatusLabel } from "@/services/supabaseSync";

export function DashboardSyncStrip({ compact = false }: { compact?: boolean }) {
  const [label, setLabel] = useState("Checking sync…");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getSyncDashboard().then((dash) => {
      if (cancelled) return;
      setLabel(syncStatusLabel(dash.meta.lastResult));
      if (dash.signedIn) {
        const parts = [
          `Check-ins: ${dash.local.checkIns} local`,
          dash.remote?.checkIns != null ? `${dash.remote.checkIns} cloud` : null,
          dash.meta.lastSyncedAt ? `Last sync ${new Date(dash.meta.lastSyncedAt).toLocaleTimeString()}` : null,
        ].filter(Boolean);
        setDetail(parts.join(" · "));
      } else if (isSupabaseConfigured) {
        setDetail("Sign in on Profile to merge local check-ins and action log with Supabase.");
      } else {
        setDetail("Demo mode — data stays on this device.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (compact) {
    return (
      <details className="group rounded-[12px] border border-white/10 bg-slate-950/50 text-sm">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 truncate">
            <span className="font-bold text-sky-200">Sync</span>
            <span className="ml-2 text-slate-200">{label}</span>
          </span>
          <span className="shrink-0 text-xs font-bold text-sky-200 group-open:hidden">Details +</span>
          <span className="hidden shrink-0 text-xs font-bold text-sky-200 group-open:inline">Close −</span>
        </summary>
        <div className="border-t border-white/10 px-4 pb-3 pt-2">
          {detail ? <p className="text-xs leading-5 text-slate-300">{detail}</p> : null}
          <Link href="/app/status" className="mt-2 inline-flex min-h-[44px] items-center text-sm font-bold text-sky-200 hover:text-white">
            Full status →
          </Link>
        </div>
      </details>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Sync status</p>
        <p className="mt-1 text-sm font-semibold text-white">{label}</p>
        {detail ? <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p> : null}
      </div>
      <Link
        href="/app/status"
        className="mt-3 inline-flex min-h-[44px] shrink-0 items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-sky-200 hover:bg-white/10 sm:mt-0"
      >
        Full status →
      </Link>
    </div>
  );
}
