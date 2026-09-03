import type {
  ChallengeGoal,
  MeasurableGoals,
  StrengthGoal,
  StrengthLiftId,
  WeightGoal,
} from "@/data/types";
import { loadJson, saveJson } from "@/lib/storage";
import { labelLift } from "@/data/options";

const GOALS_KEY = "primfit.goals";

export function emptyGoals(): MeasurableGoals {
  return { lifts: [], challenges: [], updatedAt: new Date().toISOString() };
}

export function getMeasurableGoals(): MeasurableGoals {
  const raw = loadJson<MeasurableGoals | null>(GOALS_KEY, null);
  if (!raw) return emptyGoals();
  return {
    weight: raw.weight,
    lifts: Array.isArray(raw.lifts) ? raw.lifts : [],
    challenges: Array.isArray(raw.challenges) ? raw.challenges : [],
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export function saveMeasurableGoals(goals: MeasurableGoals) {
  saveJson(GOALS_KEY, { ...goals, updatedAt: new Date().toISOString() });
}

export function progressPct(current?: number, target?: number, start?: number): number | null {
  if (current == null || target == null || !Number.isFinite(current) || !Number.isFinite(target)) return null;
  if (current === target) return 100;
  const origin = start != null && Number.isFinite(start) ? start : current;
  const span = Math.abs(origin - target);
  if (span < 0.001) return 100;
  const remaining = Math.abs(current - target);
  return Math.max(0, Math.min(100, Math.round((1 - remaining / span) * 100)));
}

export function liftProgressPct(lift: StrengthGoal): number | null {
  if (lift.current == null || lift.target == null) return null;
  if (lift.target <= 0) return null;
  return Math.max(0, Math.min(100, Math.round((lift.current / lift.target) * 100)));
}

export function daysUntil(isoDate?: string): number | null {
  if (!isoDate) return null;
  const target = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - today.getTime()) / 86400000);
}

export function challengeCountdown(ch: ChallengeGoal): string {
  if (ch.completed) return "Done.";
  const days = daysUntil(ch.targetDate);
  if (days == null) return "No date set.";
  if (days === 0) return "That’s today.";
  if (days === 1) return "1 day to go.";
  if (days > 1) return `${days} days to go.`;
  if (days === -1) return "Date was yesterday — check it off when you’re ready.";
  return `Date was ${Math.abs(days)} days ago — check it off when you’re ready.`;
}

export function suggestedChallenge(sport: string): string {
  if (sport === "running" || sport === "triathlon") return "First 5K";
  if (sport === "hyrox") return "HYROX race";
  if (sport === "cycling") return "First long ride";
  if (sport === "swimming") return "Continuous 500m";
  if (sport === "bodybuilding" || sport === "general-strength") return "First unassisted pull-up";
  return "30-day consistency";
}

export function suggestedLift(sport: string): StrengthLiftId {
  if (sport === "strongman" || sport === "hyrox" || sport === "crossfit") return "trap-bar";
  if (sport === "powerlifting") return "squat";
  if (sport === "bodybuilding") return "bench";
  return "squat";
}

export function weightCopy(w: WeightGoal): string {
  if (w.current == null || w.target == null) return "Add current and target when you want a number to aim at.";
  const unit = w.unit;
  if (w.target < w.current) return `Now ${w.current} ${unit} · aiming for ${w.target} ${unit}. Scale weight fluctuates day to day — not medical advice.`;
  if (w.target > w.current) return `Now ${w.current} ${unit} · aiming for ${w.target} ${unit}. Scale weight fluctuates — not medical advice.`;
  return `Holding around ${w.current} ${unit}. Scale weight fluctuates — not medical advice.`;
}

export function liftCopy(lift: StrengthGoal): string {
  const name = labelLift(lift.liftId);
  const mode =
    lift.mode === "five-rep"
      ? "heaviest 5-rep set (good form)"
      : "estimated heaviest single (good form — not a max-out test)";
  const unit = lift.unit;
  if (lift.current == null && lift.target == null) return `${name} — ${mode}`;
  if (lift.current != null && lift.target != null)
    return `${name}: ${lift.current} → ${lift.target} ${unit} (${mode})`;
  if (lift.current != null) return `${name}: ${lift.current} ${unit} now (${mode})`;
  return `${name}: goal ${lift.target} ${unit} (${mode})`;
}

export const GOALS_STORAGE_KEY = GOALS_KEY;
