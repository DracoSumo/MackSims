"use client";

import type { DaysPerWeek } from "@/data/types";
import { describeSplit, toggleTrainingDay, WEEKDAY_FULL } from "@/lib/trainingDays";
import { WEEKDAY_LABELS, currentPlanWeek } from "@/lib/weekCalendar";

export function WeekDayPicker({
  daysPerWeek,
  selected,
  onChange,
  expert,
}: {
  daysPerWeek: DaysPerWeek;
  selected: number[];
  onChange: (days: number[]) => void;
  expert?: boolean;
}) {
  const week = currentPlanWeek();
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--pf-muted)]">
        {expert
          ? "Pick the exact days. We’ll follow this split instead of guessing."
          : "Tap the days you train. We’ll keep the count you picked."}
      </p>
      <div className="pf-daygrid" role="group" aria-label="Training days">
        {WEEKDAY_LABELS.map((label, i) => {
          const on = selected.includes(i);
          const date = week.dates[i];
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              className={`pf-daycell ${on ? "is-on" : ""}`}
              onClick={() => onChange(toggleTrainingDay(selected, i, daysPerWeek))}
            >
              {label}
              <small>{date.getDate()}</small>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--pf-silver)]">{describeSplit(selected)}</p>
      {selected.length !== daysPerWeek ? (
        <p className="text-xs text-[var(--pf-muted)]">
          Select {daysPerWeek} days — {WEEKDAY_FULL.filter((_, i) => selected.includes(i)).join(", ") || "none"} so far.
        </p>
      ) : null}
    </div>
  );
}
