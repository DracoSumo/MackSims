"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMeasurableGoals, huntSnapshot, type HuntStage } from "@/lib/goals";
import { celebrateHunt } from "@/lib/loadLog";
import { huntCopy } from "@/lib/world";
import { useTheme } from "@/components/ThemeProvider";

export function GoalHuntCard() {
  const { theme } = useTheme();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onGoals = () => setTick((n) => n + 1);
    window.addEventListener("primfit-goals", onGoals);
    return () => window.removeEventListener("primfit-goals", onGoals);
  }, []);

  useEffect(() => {
    celebrateHunt();
  }, [tick]);

  const snap = huntSnapshot(getMeasurableGoals());
  const copy = huntCopy(theme, snap.stage);
  const pct = snap.featured?.pct ?? snap.overall;
  const stageClass: Record<HuntStage, string> = {
    empty: "",
    hunt: "",
    boss: "is-boss",
    clear: "is-clear",
  };

  return (
    <section className={`pf-hunt pf-system-card space-y-3 p-4 ${stageClass[snap.stage]}`} data-tick={tick}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--pf-silver)]">{copy.kicker}</p>
      {snap.stage === "empty" ? (
        <>
          <h2 className="pf-display text-xl font-semibold">Overall goal</h2>
          <p className="text-sm text-[var(--pf-muted)]">{copy.empty}</p>
          <Link href="/app/profile/#goals" className="pf-btn-primary inline-flex text-sm">
            Set a number in You
          </Link>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="pf-display text-xl font-semibold">
                {snap.featured?.label ?? "Overall goal"}
              </h2>
              <p className="mt-1 text-sm text-[var(--pf-muted)]">{snap.featured?.detail}</p>
            </div>
            {pct != null ? (
              <p className="shrink-0 tabular-nums text-lg font-semibold text-[var(--pf-purple-bright)]">{pct}%</p>
            ) : null}
          </div>
          {pct != null ? (
            <div className="pf-hunt-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${pct}%` }} />
            </div>
          ) : null}
          {snap.overall != null && snap.featured && snap.items.length > 1 ? (
            <p className="text-[11px] text-[var(--pf-muted)]">All numbers: {snap.overall}% toward the set you picked.</p>
          ) : null}
          <Link href="/app/profile/#goals" className="pf-linkish px-0 text-sm">
            Edit in You
          </Link>
        </>
      )}
    </section>
  );
}
