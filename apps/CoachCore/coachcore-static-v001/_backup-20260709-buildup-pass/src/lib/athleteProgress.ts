/** Parse mock percentage strings like "94%" into 0–100. */
export function parsePercent(value: string): number {
  const n = Number.parseInt(value.replace(/%/g, ""), 10);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

export type AthletePillar = "film" | "workout" | "meal" | "message";

export type PillarStatus = {
  key: AthletePillar;
  label: string;
  percent: number;
  complete: boolean;
  href: string;
};

export function athletePillars(input: {
  film: string;
  workouts: string;
  meals: string;
  readiness: string;
  messagesComplete?: boolean;
}): PillarStatus[] {
  const film = parsePercent(input.film);
  const workout = parsePercent(input.workouts);
  const meal = parsePercent(input.meals);
  const message = input.messagesComplete ? 100 : 0;

  return [
    { key: "film", label: "Film", percent: film, complete: film >= 80, href: "/app/video" },
    { key: "workout", label: "Workout", percent: workout, complete: workout >= 80, href: "/app/training" },
    { key: "meal", label: "Fueling", percent: meal, complete: meal >= 80, href: "/app/nutrition" },
    { key: "message", label: "Messages", percent: message, complete: message >= 80, href: "/app/chat" },
  ];
}

export function overallProgress(pillars: PillarStatus[]): number {
  if (pillars.length === 0) return 0;
  const sum = pillars.reduce((acc, p) => acc + p.percent, 0);
  return Math.round(sum / pillars.length);
}
