"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { athletes } from "@/data/mock";
import { listCheckIns } from "@/services/checkInStore";
import { onLocalDataChanged } from "@/services/localDataEvents";
import { StatusPill } from "@/components/ui/CoachCards";

function athleteTone(status: string) {
  if (status === "Locked in") return "green";
  if (status === "Needs nudge") return "amber";
  return "red";
}

export function AthleteAccountabilityPanel() {
  const [checkIns, setCheckIns] = useState<ReturnType<typeof listCheckIns>>([]);

  useEffect(() => {
    setCheckIns(listCheckIns());
    const onStorage = () => setCheckIns(listCheckIns());
    window.addEventListener("storage", onStorage);
    const offLocal = onLocalDataChanged((scope) => {
      if (scope === "all" || scope === "checkIns") setCheckIns(listCheckIns());
    });
    return () => {
      window.removeEventListener("storage", onStorage);
      offLocal();
    };
  }, []);

  const todayCheckInIds = useMemo(() => {
    const today = new Date().toDateString();
    return new Set(
      checkIns
        .filter((item) => new Date(item.checkedInAt).toDateString() === today)
        .map((item) => item.athleteId),
    );
  }, [checkIns]);

  return (
    <div className="rounded-[18px] border border-[var(--ms-line-warm)] bg-[var(--ms-card)] p-5 ms-glass-panel">
      <h2 className="text-2xl font-black tracking-tight">Who is locked in?</h2>
      <p className="mt-2 text-sm text-slate-400">
        Film, workouts, fueling, and readiness in one view — tap an athlete for detail. Green badge =
        checked in today (this device).
      </p>

      <div className="mt-5 space-y-3">
        {athletes.map((athlete) => {
          const checkedInToday = todayCheckInIds.has(athlete.id);
          return (
            <Link
              key={athlete.id}
              href={`/app/athletes/${athlete.id}`}
              className="block rounded-2xl border border-white/10 bg-[var(--ms-surface)] p-4 transition hover:border-emerald-400/35"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black">{athlete.name}</p>
                  <p className="text-sm text-slate-400">
                    {athlete.role} • Last active: {athlete.lastActive}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {checkedInToday && <StatusPill tone="green">Checked in today</StatusPill>}
                  <StatusPill tone={athleteTone(athlete.status)}>{athlete.status}</StatusPill>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Film</p>
                  <p className="font-black">{athlete.film}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Workouts</p>
                  <p className="font-black">{athlete.workouts}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Fueling</p>
                  <p className="font-black">{athlete.meals}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-slate-400">Readiness</p>
                  <p className="font-black">{athlete.readiness}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
