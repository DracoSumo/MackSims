import type { WeekDay, WeekPlan } from "@/data/types";
import { getDayProgress, loadJson, saveJson } from "@/lib/storage";
import { GOALS, labelGoal, labelSport } from "@/data/options";

const WEEK_STATS_KEY = "primfit.weekStats";
const DAY_STAMPS_KEY = "primfit.dayStamps";

export type WeekStat = {
  weekKey: string;
  goalDays: number;
  completedTrainingDays: number;
  updatedAt: string;
};

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function mondayKey(d = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return localDateKey(copy);
}

export function trainingDayComplete(day: WeekDay, planId: string): boolean {
  if (day.workout.isRest) return false;
  const p = getDayProgress(planId, day.dayIndex);
  return day.workout.blocks.length > 0 && day.workout.blocks.every((b) => p.blocks.includes(b.id));
}

export function todaySessionComplete(day: WeekDay, planId: string): boolean {
  const p = getDayProgress(planId, day.dayIndex);
  const meals = [day.meals.breakfast, day.meals.lunch, day.meals.dinner, day.meals.snack].filter(Boolean);
  const total = day.workout.blocks.length + meals.length;
  if (total === 0) return false;
  return p.blocks.length + p.meals.length >= total;
}

export function syncWeekProgress(plan: WeekPlan): WeekStat {
  const weekKey = mondayKey();
  const completed = plan.days.filter((d) => trainingDayComplete(d, plan.id)).length;
  const entry: WeekStat = {
    weekKey,
    goalDays: plan.profile.daysPerWeek,
    completedTrainingDays: completed,
    updatedAt: new Date().toISOString(),
  };
  const all = loadJson<WeekStat[]>(WEEK_STATS_KEY, []);
  const idx = all.findIndex((w) => w.weekKey === weekKey);
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  saveJson(WEEK_STATS_KEY, all.slice(-8));

  const stamps = loadJson<Record<string, boolean>>(DAY_STAMPS_KEY, {});
  const today = localDateKey();
  const todayDay = plan.days.find((d) => d.dayIndex === todayJsToPlanIndex());
  if (todayDay && trainingDayComplete(todayDay, plan.id)) stamps[today] = true;
  else if (todayDay && !todayDay.workout.isRest) delete stamps[today];
  saveJson(DAY_STAMPS_KEY, stamps);

  return entry;
}

function todayJsToPlanIndex(): number {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}

export function getWeekStat(plan?: WeekPlan | null): WeekStat {
  const weekKey = mondayKey();
  const all = loadJson<WeekStat[]>(WEEK_STATS_KEY, []);
  const hit = all.find((w) => w.weekKey === weekKey);
  if (hit) return hit;
  if (plan) return syncWeekProgress(plan);
  return { weekKey, goalDays: 4, completedTrainingDays: 0, updatedAt: new Date().toISOString() };
}

export function lastWeekStats(limit = 4): WeekStat[] {
  const all = loadJson<WeekStat[]>(WEEK_STATS_KEY, []);
  return all.slice(-limit);
}

export function streakDays(): number {
  const stamps = loadJson<Record<string, boolean>>(DAY_STAMPS_KEY, {});
  let n = 0;
  const d = new Date();
  for (let i = 0; i < 30; i++) {
    const key = localDateKey(d);
    if (!stamps[key]) break;
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function motivationLine(opts: {
  todayDone: boolean;
  completedTrainingDays: number;
  goalDays: number;
  streak: number;
}): string {
  if (opts.todayDone) return "Today is done.";
  const remaining = Math.max(0, opts.goalDays - opts.completedTrainingDays);
  if (remaining === 0) return "Weekly training goal met — extra sessions are optional.";
  if (remaining === 1) return "You’re 1 session from your weekly goal.";
  const base = `You’re ${remaining} sessions from your weekly goal.`;
  if (opts.streak >= 2) return `${base} ${opts.streak}-day streak.`;
  return base;
}

export function goalReminder(plan: WeekPlan): string {
  const g = GOALS.find((x) => x.id === plan.profile.goal);
  return `You’re training ${labelSport(plan.profile.sport)} toward ${labelGoal(plan.profile.goal).toLowerCase()} — ${g?.description ?? "a steady routine"}. ${plan.profile.daysPerWeek} training days this week.`;
}

export function weekProgressKeys(): { statsKey: string; stampsKey: string } {
  return { statsKey: WEEK_STATS_KEY, stampsKey: DAY_STAMPS_KEY };
}
