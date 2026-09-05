import type { GoalId, UserProfile } from "@/data/types";
import { GOALS, labelGoal } from "@/data/options";
import { goalLane, type GoalLane } from "@/lib/prescriptions";

const KNOWN = new Set<GoalId>(GOALS.map((g) => g.id));

export function profileAims(profile: Pick<UserProfile, "goal" | "aims">): GoalId[] {
  const fallback: GoalId[] = ["maintain"];
  const raw: GoalId[] = profile.aims?.length ? profile.aims : profile.goal ? [profile.goal] : fallback;
  const unique = Array.from(new Set(raw.filter((id) => KNOWN.has(id))));
  return unique.length ? unique : fallback;
}

export function hasAim(profile: Pick<UserProfile, "goal" | "aims">, id: GoalId): boolean {
  return profileAims(profile).includes(id);
}

export function aimsLane(aims: GoalId[]): GoalLane {
  const set = new Set(aims.map(goalLane));
  if (set.has("cut") && (set.has("hypertrophy") || set.has("strength"))) return "hypertrophy";
  if (set.has("hypertrophy")) return "hypertrophy";
  if (set.has("cut")) return "cut";
  if (set.has("strength")) return "strength";
  return "steady";
}

export function representativeGoal(aims: GoalId[]): GoalId {
  const lane = aimsLane(aims);
  return aims.find((id) => goalLane(id) === lane) ?? aims[0] ?? "maintain";
}

export function labelAims(aims: GoalId[]): string {
  return aims.map((id) => labelGoal(id)).join(" · ");
}

export function toggleAim(current: GoalId[], id: GoalId): GoalId[] {
  if (current.includes(id)) {
    const next = current.filter((x) => x !== id);
    return next.length ? next : current;
  }
  return [...current, id];
}
