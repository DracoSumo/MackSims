"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/config/backend";
import { getSyncDashboard, syncStatusLabel } from "@/services/supabaseSync";

export function DashboardSyncStrip() {
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
