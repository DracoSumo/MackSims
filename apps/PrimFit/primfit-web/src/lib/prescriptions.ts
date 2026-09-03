import type { ExperienceId, GoalId } from "@/data/types";

/** ACSM/NSCA-informed set·rep·rest prescriptions (educational templates). */
export type LiftPrescription = {
  sets: number;
  reps: string;
  restSec: number;
  intensityCue: string;
  rpe: string;
};

function effort(n: string, leftover: string): string {
  return `Effort ${n}/10 — ${leftover}`;
}

export function mainLiftRx(goal: GoalId, exp: ExperienceId): LiftPrescription {
  if (goal === "build-muscle") {
    if (exp === "beginner")
      return {
        sets: 3,
        reps: "8–12",
        restSec: 90,
        intensityCue: "About 60–70% effort / leave 2–3 reps in the tank",
        rpe: effort("7", "about 2–3 reps left"),
      };
    if (exp === "intermediate")
      return {
        sets: 4,
        reps: "8–12",
        restSec: 90,
        intensityCue: "Near your limit on the last set; aim toward ~10 hard sets per muscle this week",
        rpe: effort("8", "about 1–2 reps left"),
      };
    return {
      sets: 4,
      reps: "6–12",
      restSec: 75,
      intensityCue: "Higher-volume days; track weekly sets per muscle",
      rpe: effort("8–9", "last set is very hard, still clean"),
    };
  }
  if (goal === "performance" || goal === "maintain") {
    if (exp === "beginner")
      return {
        sets: 3,
        reps: "6–10",
        restSec: 120,
        intensityCue: "Learn positions; stop with 2–3 reps left",
        rpe: effort("6–7", "learning speed — never a grind"),
      };
    if (exp === "intermediate")
      return {
        sets: 4,
        reps: "4–8",
        restSec: 150,
        intensityCue: "Heavier compounds; do jumps/throws before you get tired",
        rpe: effort("7–8", "heavy but crisp"),
      };
    return {
      sets: 5,
      reps: "3–6",
      restSec: 180,
      intensityCue: "Strength emphasis — hard, but you could still grind 1–2 more if you had to",
      rpe: effort("8", "about 1–2 reps left"),
    };
  }
  if (exp === "beginner")
    return {
      sets: 3,
      reps: "8–12",
      restSec: 75,
      intensityCue: "Full-body compounds; keep form crisp",
      rpe: effort("7", "about 2–3 reps left"),
    };
  if (exp === "intermediate")
    return {
      sets: 3,
      reps: "6–10",
      restSec: 90,
      intensityCue: "Protect strength while eating a little less",
      rpe: effort("7–8", "solid, not sloppy"),
    };
  return {
    sets: 4,
    reps: "5–10",
    restSec: 90,
    intensityCue: "Keep intensity; cut filler sets first",
    rpe: effort("8", "about 1–2 reps left"),
  };
}

export function accessoryRx(exp: ExperienceId): LiftPrescription {
  if (exp === "beginner")
    return {
      sets: 2,
      reps: "10–15",
      restSec: 60,
      intensityCue: "Controlled tempo; full range you can own",
      rpe: effort("7", "smooth reps, slight burn"),
    };
  if (exp === "intermediate")
    return {
      sets: 3,
      reps: "8–15",
      restSec: 60,
      intensityCue: "Single-leg + backside (hamstrings/glutes) first",
      rpe: effort("7–8", "controlled, last reps honest"),
    };
  return {
    sets: 3,
    reps: "8–12",
    restSec: 60,
    intensityCue: "Quality over ego load",
    rpe: effort("8", "hard, still pretty"),
  };
}

export function powerRx(exp: ExperienceId): LiftPrescription | null {
  if (exp === "beginner") return null;
  if (exp === "intermediate")
    return {
      sets: 3,
      reps: "3–5",
      restSec: 120,
      intensityCue: "Moderate load, stand up / jump fast — full rest between sets",
      rpe: effort("6–7", "fast, not a grind"),
    };
  return {
    sets: 4,
    reps: "2–4",
    restSec: 150,
    intensityCue: "Explosive intent; full recovery between sets",
    rpe: effort("6–7", "fast, not a grind"),
  };
}

export function formatRx(rx: LiftPrescription): string {
  return `${rx.sets} × ${rx.reps} · rest ${rx.restSec}s · ${rx.rpe} · ${rx.intensityCue}`;
}

/** Daily protein band (g/kg) by goal — templates only. */
export function proteinTargetGPerKg(goal: GoalId): { min: number; max: number; note: string } {
  if (goal === "lose-fat")
    return {
      min: 1.8,
      max: 2.4,
      note: "Use the higher end when eating less, to help keep muscle (sports-nutrition position stand).",
    };
  if (goal === "build-muscle")
    return { min: 1.6, max: 2.2, note: "Spread 20–40 g protein every 3–4 hours." };
  if (goal === "performance")
    return { min: 1.4, max: 2.0, note: "Fuel sessions with carbs; protein for repair." };
  return { min: 1.4, max: 1.8, note: "Steady intake beats perfect timing." };
}

export function carbEmphasis(goal: GoalId, hardDay: boolean): string {
  if (hardDay && (goal === "performance" || goal === "build-muscle"))
    return "Put most of today’s carbs around this session (before/after) so you have fuel in the tank.";
  if (goal === "lose-fat")
    return "Keep protein high; put most carbs near training; veggies + fiber the rest of the day.";
  return "Balanced plate: protein + carb + produce + healthy fat.";
}
