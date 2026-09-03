"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ActivityRings } from "@/components/ActivityRings";
import { useTheme } from "@/components/ThemeProvider";
import {
  computeRingScores,
  formatSleep,
  getTodayMetrics,
  lastNDaysMetrics,
  VENDOR_SYNC_NOTE,
  weekdayShort,
  type DailyMetrics,
  type RingScores,
} from "@/lib/wearables";

export function WearablesGlance() {
  const { copy } = useTheme();
  const [today, setToday] = useState<DailyMetrics | null>(null);
  const [scores, setScores] = useState<RingScores>({ train: 0, move: 0, recover: 0 });
  const [week, setWeek] = useState<{ date: string; metrics: DailyMetrics | null }[]>([]);

  useEffect(() => {
    setToday(getTodayMetrics());
    setScores(computeRingScores());
    setWeek(lastNDaysMetrics(7));
  }, []);
  const bits = [
    today?.steps != null ? `${today.steps.toLocaleString()} steps` : null,
    today?.restingHr != null ? `${today.restingHr} rHR` : null,
    today?.sleepMinutes != null ? formatSleep(today.sleepMinutes) : null,
  ].filter(Boolean);

  return (
    <section className="pf-card space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-muted)]">
            {copy.wearables}
          </p>
          <p className="mt-1 text-sm text-[var(--pf-muted)]">
            {bits.length ? bits.join(" · ") : "No body metrics yet — log on this device."}
          </p>
        </div>
        <Link href="/app/wearables/" className="pf-linkish shrink-0">
          Open →
        </Link>
      </div>
      <ActivityRings scores={scores} compact />
      <div className="flex justify-between gap-1">
        {week.map((d) => {
          const pct = d.metrics?.steps ? Math.min(1, d.metrics.steps / 8000) : 0;
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-8 w-full items-end justify-center">
                <span
                  className="block w-1.5 rounded-full bg-[var(--pf-purple-bright)]"
                  style={{ height: `${Math.max(4, pct * 32)}px`, opacity: d.metrics ? 1 : 0.25 }}
                />
              </div>
              <span className="text-[9px] uppercase tracking-wide text-[var(--pf-muted)]">
                {weekdayShort(d.date).slice(0, 2)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] leading-snug text-[var(--pf-muted)]">{VENDOR_SYNC_NOTE}</p>
    </section>
  );
}
