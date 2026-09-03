import type { WeekDay } from "@/data/types";

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type WeekMeta = {
  monthTitle: string;
  rangeLabel: string;
  dates: Date[];
};

function startOfMondayWeek(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const js = start.getDay();
  const diff = js === 0 ? -6 : 1 - js;
  start.setDate(start.getDate() + diff);
  return start;
}

function monthDay(d: Date) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric" });
}

export function currentPlanWeek(now = new Date()): WeekMeta {
  const start = startOfMondayWeek(now);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const end = dates[6];
  const monthTitle =
    start.getMonth() === end.getMonth()
      ? start.toLocaleString("en-US", { month: "long", year: "numeric" })
      : `${start.toLocaleString("en-US", { month: "long" })}–${end.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}`;
  const rangeLabel =
    start.getMonth() === end.getMonth() ? `${monthDay(start)}–${end.getDate()}` : `${monthDay(start)} – ${monthDay(end)}`;
  return { monthTitle, rangeLabel, dates };
}

export function sameCalendarDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Short cell line — not the full workout blurb. */
export function cellFocus(day: WeekDay): string {
  if (day.workout.isRest) return "Rest";
  const label = day.workout.phaseLabel?.trim() || day.workout.focus.trim();
  const first = label.split(/[·,]/)[0]?.trim() || "Train";
  return first.length > 14 ? `${first.slice(0, 13)}…` : first;
}

export function formatSheetDate(d: Date) {
  return d.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
