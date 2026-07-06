"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "@/config/backend";
import { formatCheckInTime, listCheckIns } from "@/services/checkInStore";
import { onLocalDataChanged } from "@/services/localDataEvents";
import { getSyncMeta } from "@/services/supabaseSync";

export function RecentCheckInsPanel() {
  const [tick, setTick] = useState(0);
  const syncMeta = getSyncMeta();

  useEffect(() => {
    const onStorage = () => setTick((n) => n + 1);
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "checkIns") setTick((n) => n + 1);
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  const checkIns = useMemo(() => listCheckIns().slice(0, 4), [tick]);

  if (checkIns.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
        <h2 className="text-2xl font-black">Session check-ins</h2>
        <p className="mt-2 text-sm text-slate-400">
          No local check-ins yet. Athletes can use the check-in action to stage readiness on this device.
        </p>
        <Link
          href="/app/actions/athlete-check-in"
          className="mt-4 inline-block rounded-2xl bg-sky-400 px-4 py-2 text-sm font-black text-slate-950"
        >
          Open check-in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black">Session check-ins</h2>
        <span className="w-fit rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-200">
          {checkIns.length} check-in{checkIns.length === 1 ? "" : "s"}
          {syncMeta.lastResult === "ok" ? " · synced" : isSupabaseConfigured ? " · local-first" : " · local only"}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {checkIns.map((item) => (
          <li key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
            <strong>{item.athleteName}</strong>
            <span className="text-slate-400"> — {item.readiness}</span>
            <p className="text-xs text-slate-500">{formatCheckInTime(item.checkedInAt)}</p>
          </li>
        ))}
      </ul>
      <Link href="/app/actions/athlete-check-in" className="mt-4 inline-block text-sm font-bold text-sky-300">
        New check-in →
      </Link>
    </div>
  );
}
