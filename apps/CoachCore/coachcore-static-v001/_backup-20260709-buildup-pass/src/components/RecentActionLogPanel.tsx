"use client";

import { useEffect, useMemo, useState } from "react";
import { formatActionTime, listActionLog } from "@/services/actionLogStore";
import { onLocalDataChanged } from "@/services/localDataEvents";
import { getSyncMeta } from "@/services/supabaseSync";
import { isSupabaseConfigured } from "@/config/backend";

export function RecentActionLogPanel() {
  const [tick, setTick] = useState(0);
  const syncMeta = getSyncMeta();

  useEffect(() => {
    const onStorage = () => setTick((n) => n + 1);
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "actionLog") setTick((n) => n + 1);
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  const actions = useMemo(() => listActionLog().slice(0, 5), [tick]);

  if (actions.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
        <h2 className="text-2xl font-black">Coach action log</h2>
        <p className="mt-2 text-sm text-slate-400">
          Mock coach actions (check-ins, nudges, playbook views) log here on this device and sync when signed in.
        </p>
      </div>
    );
  }

  const syncLabel =
    syncMeta.lastResult === "ok"
      ? "Synced"
      : syncMeta.lastResult === "error"
        ? "Local only (sync error)"
        : isSupabaseConfigured
          ? "Local + cloud when signed in"
          : "Local on this device";

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black">Coach action log</h2>
        <span className="w-fit rounded-full bg-sky-300/15 px-3 py-1 text-xs font-bold text-sky-200">{syncLabel}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {actions.map((item) => (
          <li key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
            <strong>{item.label}</strong>
            {item.detail ? <p className="mt-1 text-slate-400">{item.detail}</p> : null}
            <p className="text-xs text-slate-500">{formatActionTime(item.loggedAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
