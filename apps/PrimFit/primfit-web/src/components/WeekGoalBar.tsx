"use client";

import type { WeekPlan } from "@/data/types";
import { goalReminder, motivationLine, streakDays } from "@/lib/progress";

export function WeekGoalBar({
  plan,
  completedTrainingDays,
  todayDone,
  compact,
}: {
  plan: WeekPlan;
  completedTrainingDays: number;
  todayDone: boolean;
  compact?: boolean;
}) {
  const goalDays = plan.profile.daysPerWeek;
  const pct = goalDays > 0 ? Math.min(100, Math.round((completedTrainingDays / goalDays) * 100)) : 0;
  const streak = streakDays();
  return (
    <section className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={compact ? "text-sm font-medium" : "font-semibold"}>This week</p>
        <p className="text-sm tabular-nums text-[var(--pf-silver)]">
          {completedTrainingDays} of {goalDays} days
        </p>
      </div>
      <div
        className="pf-bar mt-0"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goalDays}
        aria-valuenow={completedTrainingDays}
        aria-label="Training days this week"
      >
        <div className="pf-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-[var(--pf-muted)]">
        {motivationLine({ todayDone, completedTrainingDays, goalDays, streak })}
      </p>
      {compact ? null : <p className="text-xs text-[var(--pf-muted)]">{goalReminder(plan)}</p>}
    </section>
  );
}
