"use client";

import { useEffect, useState } from "react";
import { supabaseStatusLabel } from "@/config/backend";
import { authAvailable, getCurrentUser } from "@/lib/auth";
import { checkSupabaseConnection, type SupabaseConnectionState } from "@/lib/supabaseClient";
import {
  getSyncDashboard,
  syncNow,
  syncStatusLabel,
  type SyncMeta,
} from "@/services/supabaseSync";

type SyncCounts = {
  local: {
    checkIns: number;
    actionLog: number;
    roster: number;
    assignments: number;
    mealLogs: number;
    coachNotes: number;
  };
  remote: {
    checkIns: number | null;
    actionLog: number | null;
    roster: number | null;
    assignments: number | null;
    mealLogs: number | null;
    coachNotes: number | null;
  } | null;
  signedIn: boolean;
  teamId: string | null;
};

function countLine(label: string, local: number, remote: number | null | undefined) {
  const cloud =
    remote !== null && remote !== undefined ? ` · Supabase: ${remote}` : "";
  return `${label} — local: ${local}${cloud}`;
}

export function SupabaseStatusPanel() {
  const [state, setState] = useState<SupabaseConnectionState>("checking");
  const [detail, setDetail] = useState(supabaseStatusLabel());
  const [syncMeta, setSyncMeta] = useState<SyncMeta | null>(null);
  const [counts, setCounts] = useState<SyncCounts | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

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
      setCounts({
        local: dash.local,
        remote: dash.remote,
        signedIn: dash.signedIn,
        teamId: dash.team?.teamId ?? null,
      });
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
                Team context:{" "}
                {counts.teamId ? (
                  <span className="text-emerald-200">{counts.teamId.slice(0, 8)}…</span>
                ) : (
                  <span className="text-amber-200">not bootstrapped</span>
                )}
              </p>
              <p className="mt-2 text-slate-300">
                {countLine("Roster", counts.local.roster, counts.remote?.roster)}
              </p>
              <p className="mt-1 text-slate-300">
                {countLine("Check-ins", counts.local.checkIns, counts.remote?.checkIns)}
              </p>
              <p className="mt-1 text-slate-300">
                {countLine("Assignments", counts.local.assignments, counts.remote?.assignments)}
              </p>
              <p className="mt-1 text-slate-300">
                {countLine("Meal logs", counts.local.mealLogs, counts.remote?.mealLogs)}
              </p>
              <p className="mt-1 text-slate-300">
                {countLine("Coach notes", counts.local.coachNotes, counts.remote?.coachNotes)}
              </p>
              <p className="mt-1 text-slate-300">
                {countLine("Action log", counts.local.actionLog, counts.remote?.actionLog)}
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
              <p className="mt-2 text-xs text-slate-500">
                Apply migrations{" "}
                <code className="text-slate-300">20260731210000_coach_scoped_roster_sync.sql</code> and{" "}
                <code className="text-slate-300">20260731220000_org_team_bootstrap.sql</code> if cloud
                counts or team context stay blank.
              </p>
              <button
                type="button"
                disabled={syncing}
                onClick={async () => {
                  setSyncing(true);
                  const err = await syncNow();
                  const dash = await getSyncDashboard();
                  setSyncMeta(dash.meta);
                  setCounts({
                    local: dash.local,
                    remote: dash.remote,
                    signedIn: dash.signedIn,
                    teamId: dash.team?.teamId ?? null,
                  });
                  setSyncMessage(err ?? "Sync complete.");
                  setSyncing(false);
                }}
                className="mt-4 rounded-xl bg-sky-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-sky-300 disabled:opacity-60"
              >
                {syncing ? "Syncing…" : "Sync now"}
              </button>
              {syncMessage && <p className="mt-2 text-xs text-slate-400">{syncMessage}</p>}
            </>
          ) : (
            <p className="mt-2 text-slate-400">
              Sign in to merge local roster, assignments, meals, and notes with Supabase. Until then,
              localStorage wins.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
