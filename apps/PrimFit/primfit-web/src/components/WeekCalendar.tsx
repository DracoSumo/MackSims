"use client";

import { DayBoard, mealCount } from "@/components/DayBoard";
import { getDayProgress } from "@/lib/storage";
import { cellFocus, formatSheetDate, WEEKDAY_LABELS } from "@/lib/weekCalendar";
import type { WeekDay, WeekPlan } from "@/data/types";

export function WeekCalendar({
  days,
  dates,
  planId,
  todayIndex,
  selectedIndex,
  onSelect,
}: {
  days: WeekDay[];
  dates: Date[];
  planId: string;
  todayIndex: number;
  selectedIndex: number | null;
  onSelect: (dayIndex: number) => void;
}) {
  return (
    <div className="pf-cal">
      <div className="pf-cal-weekdays" aria-hidden>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="pf-cal-wd">
            {label}
          </div>
        ))}
      </div>
      <div className="pf-cal-grid" role="grid" aria-label="This week">
        {days.map((day, i) => {
          const date = dates[i] ?? new Date();
          const p = getDayProgress(planId, day.dayIndex);
          const meals = mealCount(day);
          const total = day.workout.blocks.length + meals;
          const done = p.blocks.length + p.meals.length;
          const complete = total > 0 && done >= total;
          const isToday = day.dayIndex === todayIndex;
          const isSelected = selectedIndex === day.dayIndex;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <button
              key={day.dayIndex}
              type="button"
              role="gridcell"
              aria-current={isToday ? "date" : undefined}
              aria-pressed={isSelected}
              aria-label={`${WEEKDAY_LABELS[i]} ${date.getDate()}, ${cellFocus(day)}${complete ? ", done" : ""}`}
              className={`pf-cal-cell pf-press ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${
                complete ? "is-done" : ""
              } ${day.workout.isRest ? "is-rest" : ""}`}
              onClick={() => onSelect(day.dayIndex)}
            >
              <span className="pf-cal-date">{date.getDate()}</span>
              {complete ? (
                <span className="pf-cal-check" aria-hidden>
                  ✓
                </span>
              ) : null}
              <span className="pf-cal-focus">{cellFocus(day)}</span>
              <span className="pf-cal-meta">{meals} meals</span>
              <span className="pf-mini-bar pf-cal-bar" role="presentation">
                <i style={{ width: `${pct}%` }} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DaySheet({
  day,
  date,
  plan,
  isToday,
  onClose,
  onPlanChange,
  onProgressChange,
  tick,
}: {
  day: WeekDay;
  date: Date;
  plan: WeekPlan;
  isToday: boolean;
  onClose: () => void;
  onPlanChange: (plan: WeekPlan) => void;
  onProgressChange: () => void;
  tick: number;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pf-day-sheet-title"
      onClick={onClose}
    >
      <div
        className="pf-day-sheet pf-card flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--pf-line)] px-4 py-3">
          <div className="min-w-0">
            <p id="pf-day-sheet-title" className="pf-display text-lg font-semibold">
              {day.dayName}
              {isToday ? (
                <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--pf-purple-bright)]">
                  Today
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-xs text-[var(--pf-muted)]">{formatSheetDate(date)}</p>
            <p className="mt-1 text-sm text-[var(--pf-silver)]">{day.workout.focus}</p>
          </div>
          <button type="button" className="pf-btn-ghost shrink-0 px-3" onClick={onClose} aria-label="Close day">
            Close
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4">
          {day.workout.whyThisDay ? (
            <p className="mb-4 text-sm text-[var(--pf-muted)]">{day.workout.whyThisDay}</p>
          ) : null}
          <DayBoard
            key={`${plan.id}-${day.dayIndex}-${tick}`}
            day={day}
            plan={plan}
            compact
            onPlanChange={onPlanChange}
            onProgressChange={onProgressChange}
          />
        </div>
      </div>
    </div>
  );
}
