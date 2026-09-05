import type { DaysPerWeek } from "@/data/types";

export const WEEKDAY_FULL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PRESETS: Record<DaysPerWeek, number[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

export function isDaysPerWeek(value: unknown): value is DaysPerWeek {
  return value === 2 || value === 3 || value === 4 || value === 5 || value === 6 || value === 7;
}

export function defaultTrainingDays(count: DaysPerWeek): number[] {
  return [...PRESETS[count]];
}

export function normalizeTrainingDays(days: number[] | undefined, count: DaysPerWeek): number[] {
  const unique = Array.from(new Set((days ?? []).filter((d) => d >= 0 && d <= 6))).sort((a, b) => a - b);
  if (unique.length === count) return unique;
  if (unique.length > count) return unique.slice(0, count);
  if (!unique.length) return defaultTrainingDays(count);
  const padded = [...unique];
  for (let i = 0; i < 7 && padded.length < count; i++) {
    if (!padded.includes(i)) padded.push(i);
  }
  return padded.sort((a, b) => a - b);
}

export function toggleTrainingDay(current: number[], dayIndex: number, count: DaysPerWeek): number[] {
  const set = new Set(current);
  if (set.has(dayIndex)) {
    if (set.size <= 1) return current;
    set.delete(dayIndex);
  } else if (set.size < count) {
    set.add(dayIndex);
  } else {
    const sorted = Array.from(set).sort((a, b) => a - b);
    set.delete(sorted[sorted.length - 1]);
    set.add(dayIndex);
  }
  return Array.from(set).sort((a, b) => a - b);
}

/** Plain read of a Mon–Sun on/off pattern, e.g. "3 on, 1 off, 2 on, 1 off". */
export function describeSplit(days: number[]): string {
  const train = new Set(days);
  const runs: string[] = [];
  let i = 0;
  while (i < 7) {
    const on = train.has(i);
    let len = 0;
    while (i + len < 7 && train.has(i + len) === on) len += 1;
    runs.push(`${len} ${on ? "on" : "off"}`);
    i += len;
  }
  const names = days.map((d) => WEEKDAY_FULL[d]).join(" · ");
  return names ? `${names}. ${runs.join(", ")}.` : runs.join(", ");
}
