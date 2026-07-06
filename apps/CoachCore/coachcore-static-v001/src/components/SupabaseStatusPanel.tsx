"use client";

import { useEffect, useState } from "react";
import { supabaseStatusLabel } from "@/config/backend";
import { authAvailable, getCurrentUser } from "@/lib/auth";
import { checkSupabaseConnection, type SupabaseConnectionState } from "@/lib/supabaseClient";
import { getSyncDashboard, syncStatusLabel, type SyncMeta } from "@/services/supabaseSync";

export function SupabaseStatusPanel() {
  const [state, setState] = useState<SupabaseConnectionState>("checking");
  const [detail, setDetail] = useState(supabaseStatusLabel());
  const [syncMeta, setSyncMeta] = useState<SyncMeta | null>(null);
  const [counts, setCounts] = useState<{
    local: { checkIns: number; actionLog: number };
    remote: { checkIns: number | null; actionLog: number | null } | null;
    signedIn: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState("checking");
    checkSupabaseConnection().then((result) => {
      if (cancelled) return;
      setState(result.state);
      setDetail(result.detail);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authAvailable()) return;

    async function refresh() {
      const dash = await getSyncDashboard();
      setSyncMeta(dash.meta);
      setCounts({ local: dash.local, remote: dash.remote, signedIn: dash.signedIn });
    }

    refresh();
    getCurrentUser().then((user) => {
      if (user) refresh();
    });

    const interval = window.setInterval(refresh, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const tone =
    state === "connected" ? "text-emerald-300" : state === "checking" ? "text-slate-400" : "text-amber-300";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Supabase</p>
      <h2 className="mt-3 text-2xl font-black">Backend connection</h2>
      <p className={`mt-3 text-sm leading-6 ${tone}`}>
        {state === "checking" ? "Checking connection…" : detail}
      </p>
      <p className="mt-3 text-xs text-slate-500">{supabaseStatusLabel()}</p>

      {counts && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Sync state</p>
          {counts.signedIn ? (
            <>
              <p className="mt-2 text-slate-300">
                Check-ins — local: {counts.local.checkIns}
                {counts.remote?.checkIns !== null && counts.remote?.checkIns !== undefined
                  ? ` · Supabase: ${counts.remote.checkIns}`
                  : ""}
              </p>
              <p className="mt-1 text-slate-300">
                Action log — local: {counts.local.actionLog}
                {counts.remote?.actionLog !== null && counts.remote?.actionLog !== undefined
                  ? ` · Supabase: ${counts.remote.actionLog}`
                  : ""}
              </p>
              {syncMeta?.lastSyncedAt && (
                <p className="mt-2 text-xs text-slate-500">
                  Last merged: {new Date(syncMeta.lastSyncedAt).toLocaleString()}
                </p>
              )}
              {syncMeta?.lastError && (
                <p className="mt-1 text-xs text-amber-300">{syncMeta.lastError}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">{syncStatusLabel(syncMeta?.lastResult ?? null)}</p>
            </>
          ) : (
            <p className="mt-2 text-slate-400">
              Sign in to merge local data with Supabase. Until then, localStorage wins.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
