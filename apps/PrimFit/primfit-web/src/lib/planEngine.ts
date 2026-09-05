import type {
  DayMeals,
  DayWorkout,
  EquipmentId,
  MealItem,
  MovementCategory,
  SportId,
  TrainingLocationMode,
  UserProfile,
  WeekDay,
  WeekPlan,
  WorkoutBlock,
} from "@/data/types";
import { primfitConfig } from "@/config/primfit";
import { COACH_INFLUENCES } from "@/data/coachInfluences";
import { FORM_CUES } from "@/data/formCues";
import { videoFor } from "@/data/videoLibrary";
import { mealFamilyOf, pickExerciseOption, pickMealOption } from "@/data/alternatives";
import { buildGroceryList } from "@/lib/grocery";
import {
  accessoryRx,
  carbEmphasis,
  goalLane,
  mainLiftRx,
  powerRx,
  proteinTargetGPerKg,
} from "@/lib/prescriptions";
import { dietFlags } from "@/lib/diet";
import { hasAim, profileAims, representativeGoal } from "@/lib/aims";
import { isDaysPerWeek, normalizeTrainingDays } from "@/lib/trainingDays";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function primaryGoal(profile: UserProfile) {
  return representativeGoal(profileAims(profile));
}

type SessionKind = "strength" | "endurance" | "hybrid" | "field" | "mobility" | "rest";

type SessionTemplate = {
  focus: string;
  kind: SessionKind;
  theme: string;
  why: string;
  phaseLabel?: string;
};

/** Map every sport into a programming family. */
function sportFamily(sport: SportId): "strength" | "endurance" | "hybrid" | "field" | "mobility" {
  switch (sport) {
    case "strongman":
    case "bodybuilding":
    case "powerlifting":
    case "general-strength":
    case "crossfit":
      return "strength";
    case "running":
    case "cycling":
    case "swimming":
    case "triathlon":
      return "endurance";
    case "hyrox":
    case "combat":
    case "wrestling":
      return "hybrid";
    case "football":
    case "basketball":
    case "soccer":
    case "baseball":
    case "tennis":
    case "badminton":
    case "volleyball":
    case "golf":
    case "general-athleticism":
      return "field";
    case "yoga":
    case "pilates":
      return "mobility";
    default:
      return "strength";
  }
}

function familySchedule(family: ReturnType<typeof sportFamily>, sport: SportId): SessionTemplate[] {
  const rest: SessionTemplate = {
    focus: "Full rest / easy walk",
    kind: "rest",
    theme: "rest",
    why: "Adaptation happens between hard sessions. Keep today truly easy.",
    phaseLabel: "Recovery",
  };

  if (family === "endurance") {
    const mode =
      sport === "cycling" ? "bike" : sport === "swimming" ? "swim" : sport === "triathlon" ? "tri" : "run";
    return [
      {
        focus: mode === "swim" ? "Easy technique set" : mode === "bike" ? "Easy ride (you can talk)" : "Easy run (you can talk in full sentences)",
        kind: "endurance",
        theme: `easy-${mode}`,
        why: "Most of your weekly cardio should feel easy — about 80%. If you can talk in full sentences, you’re in the right place.",
        phaseLabel: "Easy cardio",
      },
      {
        focus: "Strength support",
        kind: "strength",
        theme: "runner-strength",
        why: "2×/week strength protects endurance athletes and builds force.",
        phaseLabel: "Support",
      },
      {
        focus: mode === "swim" ? "Sustainable hard swim pace" : "Comfortably hard (short sentences only)",
        kind: "endurance",
        theme: `tempo-${mode}`,
        why: "One purposeful harder session — a pace you could hold in a race, not an all-out sprint.",
        phaseLabel: "Quality",
      },
      {
        focus: "Easy recovery aerobic",
        kind: "endurance",
        theme: `easy-${mode}`,
        why: "Keep today truly easy after yesterday’s harder work. Medium-hard “gray zone” days add fatigue without much payoff.",
        phaseLabel: "Aerobic",
      },
      {
        focus: mode === "tri" ? "Brick or short hard repeats" : "Short hard repeats (hills or speed)",
        kind: "endurance",
        theme: `intervals-${mode}`,
        why: "A small slice of truly hard work to raise your ceiling. Full recoveries between reps.",
        phaseLabel: "Hard repeats",
      },
      {
        focus: mode === "swim" ? "Long easy continuous" : "Long easy session",
        kind: "endurance",
        theme: `long-${mode}`,
        why: "Long aerobic stimulus — still mostly easy.",
        phaseLabel: "Long",
      },
      rest,
    ];
  }

  if (family === "hybrid") {
    return [
      {
        focus: sport === "hyrox" ? "Easy run (you can talk)" : "Easy cardio + shadow / flow",
        kind: "endurance",
        theme: "easy-run",
        why: sport === "hyrox" ? "HYROX is a fitness race (8 runs + 8 stations). Running is most of the clock — build that engine." : "Easy cardio underpins combat output.",
        phaseLabel: "Cardio",
      },
      {
        focus: sport === "hyrox" ? "Station strength (legs + grip)" : "Strength + neck/core resilience",
        kind: "strength",
        theme: sport === "hyrox" ? "hyrox-lower" : "combat-strength",
        why: "Posterior chain, grip, and contact resilience.",
        phaseLabel: "Strength",
      },
      {
        focus: sport === "hyrox" ? "Tired-legs practice: station then run" : "Sport skill + conditioning",
        kind: "hybrid",
        theme: sport === "hyrox" ? "compromised" : "combat-cond",
        why: "Practice the exact skill you need while already a bit tired.",
        phaseLabel: "Specific",
      },
      {
        focus: sport === "hyrox" ? "Upper / ski-row pull" : "Pull + hinge strength",
        kind: "strength",
        theme: sport === "hyrox" ? "hyrox-upper" : "hinge-pull",
        why: "Pulling durability and upper-back strength.",
        phaseLabel: "Strength",
      },
      {
        focus: "Hard cardio (short sentences only)",
        kind: "endurance",
        theme: "tempo-run",
        why: "Raise sustainable pace without every day redline.",
        phaseLabel: "Quality",
      },
      {
        focus: sport === "hyrox" ? "Partial race simulation" : "Live rounds / sparring prep density",
        kind: "hybrid",
        theme: sport === "hyrox" ? "simulation" : "combat-sim",
        why: "Practice transitions and pacing — not a full peaking session every week.",
        phaseLabel: "Peak practice",
      },
      rest,
    ];
  }

  if (family === "field") {
    const golfish = sport === "golf";
    return [
      {
        focus: golfish ? "Rotational power + mobility" : "Power + lower strength",
        kind: golfish ? "mobility" : "field",
        theme: golfish ? "rotational" : "power-lower",
        why: golfish
          ? "Torso rotation and anti-rotation for a stable swing."
          : "Field S&C: power while fresh (Pfaff), then strength (Boyle patterns).",
        phaseLabel: golfish ? "Mobility/power" : "Power",
      },
      {
        focus: golfish ? "Full-body strength" : "Speed / acceleration",
        kind: golfish ? "strength" : "field",
        theme: golfish ? "golf-strength" : "speed",
        why: golfish ? "Strength without junk volume." : "Quality sprints with full rest.",
        phaseLabel: golfish ? "Strength" : "Speed",
      },
      {
        focus: golfish ? "Easy walk (you can talk)" : "Upper + core",
        kind: golfish ? "endurance" : "strength",
        theme: golfish ? "easy-run" : "upper",
        why: golfish ? "Course fitness for 18 holes." : "Contact resilience / torso stiffness.",
        phaseLabel: "Support",
      },
      {
        focus: golfish ? "Stability + single-leg" : "Change-of-direction + single-leg strength",
        kind: golfish ? "strength" : "field",
        theme: golfish ? "stability" : "agility",
        why: "Balance, deceleration, and joint resilience.",
        phaseLabel: "Stability",
      },
      {
        focus: golfish ? "Yoga / thoracic flow" : "Hinge / posterior + controlled conditioning",
        kind: golfish ? "mobility" : "strength",
        theme: golfish ? "mobility" : "hinge-pull",
        why: golfish ? "Restore range." : "Hamstring-dominant work + energy system.",
        phaseLabel: "Recovery work",
      },
      {
        focus: golfish ? "Med-ball power" : "Active recovery / mobility",
        kind: golfish ? "field" : "mobility",
        theme: golfish ? "power-upper" : "mobility",
        why: golfish ? "Intentional rotational power while fresh." : "Flush and restore hips and upper back.",
        phaseLabel: golfish ? "Power" : "Mobility",
      },
      rest,
    ];
  }

  if (family === "mobility") {
    return [
      {
        focus: sport === "pilates" ? "Pilates strength series" : "Strength-oriented flow",
        kind: "mobility",
        theme: "strength-flow",
        why: "Build strength within controlled patterns — showing up beats a complicated flow.",
        phaseLabel: "Strength mobility",
      },
      {
        focus: "Easy walk or cycle (you can talk)",
        kind: "endurance",
        theme: "easy-run",
        why: "Cardio health alongside mobility practice.",
        phaseLabel: "Aerobic",
      },
      {
        focus: "Deep hip & spine mobility",
        kind: "mobility",
        theme: "mobility",
        why: "Hit the big tight spots (hips, hamstrings, upper back) at least 2–3 times this week.",
        phaseLabel: "Flexibility",
      },
      {
        focus: "Balance & body awareness",
        kind: "mobility",
        theme: "balance",
        why: "Balance practice supports longevity and sport landings.",
        phaseLabel: "Balance",
      },
      {
        focus: "Light progressive strength",
        kind: "strength",
        theme: "bands",
        why: "Complement mobility with simple progressive overload.",
        phaseLabel: "Strength",
      },
      {
        focus: "Restorative + breath",
        kind: "mobility",
        theme: "restorative",
        why: "Downshift nervous system — recovery is training.",
        phaseLabel: "Restore",
      },
      rest,
    ];
  }

  // strength family — sport-flavored
  const isPL = sport === "powerlifting";
  const isBB = sport === "bodybuilding";
  const isSM = sport === "strongman";
  const isCF = sport === "crossfit";
  return [
    {
      focus: isPL ? "Squat emphasis" : isSM ? "Squat / yoke pattern" : isBB ? "Push hypertrophy" : isCF ? "Strength + skill" : "Full-body strength A",
      kind: "strength",
      theme: isBB ? "push-hyper" : "squat-push",
        why: "Sports-medicine guidelines: train each major muscle group at least twice a week. Adding a little over time beats a complicated program.",
      phaseLabel: isBB ? "Hypertrophy" : "Strength",
    },
    {
      focus: isCF ? "Mixed cardio work" : "Easy cardio (you can talk)",
      kind: isCF ? "hybrid" : "endurance",
      theme: isCF ? "finisher" : "easy-run",
        why: isCF ? "Work capacity without destroying tomorrow’s lifts." : "Easy cardio supports recovery.",
      phaseLabel: "Cardio",
    },
    {
      focus: isPL ? "Bench emphasis" : isSM ? "Press / log pattern" : isBB ? "Pull hypertrophy" : "Full-body strength B",
      kind: "strength",
      theme: isBB ? "pull-hyper" : "hinge-pull",
      why: "Balanced weekly volume; hinge/pull or press specialty.",
      phaseLabel: isBB ? "Hypertrophy" : "Strength",
    },
    {
      focus: isPL ? "Deadlift / posterior" : isSM ? "Carry & events" : isBB ? "Legs hypertrophy" : "Upper volume",
      kind: isSM ? "hybrid" : "strength",
      theme: isSM ? "strongman-events" : isBB ? "legs-hyper" : isPL ? "hinge-pull" : "upper",
      why: isSM ? "Event practice: carries, holds, odd objects." : "Accessory volume toward weekly set targets.",
      phaseLabel: isBB ? "Volume" : "Specialty",
    },
    {
      focus: isBB ? "Arms / delts" : "Lower strength + core",
      kind: "strength",
      theme: isBB ? "arms" : "lower",
      why: "Second lower or isolation stimulus for progressive overload.",
      phaseLabel: "Strength",
    },
    {
      focus: isCF ? "Mixed modal conditioning" : "Conditioning finisher",
      kind: "hybrid",
      theme: "finisher",
      why: "Short dense work; keep quality high.",
      phaseLabel: "Conditioning",
    },
    rest,
  ];
}

function hasEquip(profile: UserProfile, ids: EquipmentId[]): boolean {
  if (profile.locationMode === "commercial-gym" || profile.equipment.includes("full-gym")) return true;
  return ids.some((id) => profile.equipment.includes(id));
}

function adaptForLocation(detail: string, profile: UserProfile, category: MovementCategory): string {
  const mode: TrainingLocationMode = profile.locationMode;
  if (mode === "commercial-gym" || profile.equipment.includes("full-gym")) return detail;
  if (mode === "travel-hotel" || mode === "home") {
    if (category === "squat" && !hasEquip(profile, ["barbell", "dumbbells", "kettlebell"]))
      return "Bodyweight squat variations, split squats, or backpack goblet squat.";
    if (category === "hinge" && !hasEquip(profile, ["barbell", "dumbbells", "kettlebell"]))
      return "Single-leg Romanian deadlift (hip hinge) with a backpack, or a band pull-through.";
    if (category === "push" && !hasEquip(profile, ["barbell", "dumbbells"]))
      return "Push-up progressions or band press.";
    if (category === "pull" && !hasEquip(profile, ["pull-up-bar", "bands", "dumbbells"]))
      return "Band rows or towel rows under a sturdy table.";
    if (category === "carry" && !hasEquip(profile, ["dumbbells", "kettlebell", "sled"]))
      return "Suitcase carry with backpack / grocery bags — own your posture.";
  }
  if (mode === "outdoor") {
    if (category === "conditioning" || category === "run") return detail;
    if (!hasEquip(profile, ["dumbbells", "kettlebell", "barbell"]))
      return `${detail} (outdoor: prefer hills, parks, bodyweight + whatever you brought).`;
  }
  return detail;
}

function block(
  name: string,
  category: MovementCategory,
  detail: string,
  profile: UserProfile,
  opts: {
    durationMin?: number;
    setsReps?: string;
    restSec?: number;
    rpe?: string;
    cues?: string[];
    coachInsight?: string;
  } = {},
): WorkoutBlock {
  const v = videoFor(category);
  const adapted = adaptForLocation(detail, profile, category);
  return {
    id: `${category}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    detail: adapted,
    durationMin: opts.durationMin,
    setsReps: opts.setsReps,
    restSec: opts.restSec,
    rpe: opts.rpe,
    coachingCues: opts.cues,
    movementCategory: category,
    videoUrl: v.url,
    videoTitle: v.title,
    coachInsight: opts.coachInsight,
    cueSteps: FORM_CUES[category],
  };
}

function coachCard(ids: string[]): string {
  const hit = COACH_INFLUENCES.find((c) => ids.includes(c.id));
  return hit?.cardInsight ?? COACH_INFLUENCES[0].cardInsight;
}

function buildBlocks(session: SessionTemplate, profile: UserProfile, dayIndex: number, usedLifts: Set<string>): WorkoutBlock[] {
  const used = new Set(usedLifts);
  const seed = (label: string) =>
    `${profile.sport}|${profileAims(profile).join(",")}|${profile.locationMode}|d${dayIndex}|${session.theme}|${label}`;

  const named = (
    category: MovementCategory,
    label: string,
    fallbackName: string,
    fallbackDetail: string,
    opts: {
      durationMin?: number;
      setsReps?: string;
      restSec?: number;
      rpe?: string;
      cues?: string[];
      coachInsight?: string;
    } = {},
  ) => {
    const opt = pickExerciseOption(category, profile, seed(label), used);
    if (opt) {
      used.add(opt.key);
      usedLifts.add(opt.key);
    }
    return block(opt?.name ?? fallbackName, opt?.category ?? category, opt?.detail ?? fallbackDetail, profile, opts);
  };

  if (session.kind === "rest") {
    const rests = [
      {
        name: "Easy walk",
        detail: "20–30 min easy walk. Sleep 7–9 hours. If sore: protein, carbs, and sleep beat another hard session.",
      },
      {
        name: "Full rest",
        detail: "Off the training floor. Light stretch only if you want it. Sleep 7–9 hours.",
      },
      {
        name: "Stretch + stroll",
        detail: "10 min easy stretch, then an optional 15 min walk. Tightness, not pain.",
      },
      {
        name: "Easy mobility",
        detail: "Hips, hamstrings, and upper back — long easy holds, no straining.",
      },
    ];
    const pick = rests[dayIndex % rests.length];
    return [
      block(pick.name, "mobility", pick.detail, profile, {
        durationMin: 20,
        cues: ["If sore: protein, carbs, and sleep beat another hard session."],
        coachInsight: coachCard(["sims", "daniels"]),
      }),
    ];
  }

  const main = mainLiftRx(primaryGoal(profile), profile.experience);
  const acc = accessoryRx(profile.experience);
  const power = powerRx(profile.experience);
  const sets = (rx: typeof main) => `${rx.sets} × ${rx.reps}`;
  const blocks: WorkoutBlock[] = [
    named("warm-up", "warmup", "Warm-up", "5–8 min easy cardio + hip, ankle, and upper-back openers.", {
      durationMin: 8,
      cues: ["Raise temperature before power or heavy strength."],
      coachInsight: coachCard(["boyle"]),
    }),
  ];

  const addStrength = (theme: string) => {
    if (power && (theme.includes("power") || theme === "squat-push" || theme === "lower" || theme === "power-lower")) {
      blocks.push(
        named("power", "power", "Box jump / squat jump", "Box jump, med-ball throw, or jump squat — explosive intent.", {
          durationMin: 12,
          setsReps: sets(power),
          restSec: power.restSec,
          rpe: power.rpe,
          cues: [power.intensityCue, "Use a moderate weight and move explosively on the way up."],
          coachInsight: coachCard(["pfaff"]),
        }),
      );
    }

    if (theme === "squat-push" || theme === "lower" || theme === "power-lower" || theme === "legs-hyper") {
      blocks.push(
        named("squat", "main-squat", "Goblet squat", "Sit between the heels; full range you can control.", {
          durationMin: 20,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue, "If the last set is easy by 2+ reps two sessions in a row, add a little weight next time."],
          coachInsight: coachCard(["boyle"]),
        }),
      );
      if (theme !== "legs-hyper") {
        blocks.push(
          named("push", "main-push", "Push-up", "Floor, incline, or dumbbell press — one long line.", {
            durationMin: 15,
            setsReps: sets(main),
            restSec: main.restSec,
            rpe: main.rpe,
            cues: [main.intensityCue],
          }),
        );
      }
    } else if (theme === "hinge-pull" || theme === "pull-hyper") {
      blocks.push(
        named("hinge", "main-hinge", "Romanian deadlift (hip hinge)", "Soft knees, hips back, weight close to the legs.", {
          durationMin: 20,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue, "Brace hard — no low-back rounding."],
          coachInsight: coachCard(["boyle"]),
        }),
      );
      blocks.push(
        named("pull", "main-pull", "Dumbbell row", "Rows or pull-ups — squeeze the armpit at the top.", {
          durationMin: 15,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
        }),
      );
    } else if (theme === "push-hyper" || theme === "upper" || theme === "arms" || theme === "power-upper") {
      blocks.push(
        named("push", "upper-push", "Dumbbell press", "Press with a braced midsection — same effort as the main set.", {
          durationMin: 15,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
        }),
      );
      blocks.push(
        named("pull", "upper-pull", "Dumbbell row", "Row elbows to the ribs; don’t shrug the weight up.", {
          durationMin: 15,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
        }),
      );
      if (theme === "arms") {
        blocks.push(
          named("push", "arms", "Dumbbell floor press", "Curls, laterals, or another press — controlled, no swinging.", {
            durationMin: 15,
            setsReps: sets(acc),
            restSec: acc.restSec,
            rpe: acc.rpe,
          }),
        );
      }
    } else if (theme === "runner-strength" || theme === "stability" || theme === "bands" || theme === "golf-strength") {
      blocks.push(
        named("squat", "single-leg", "Split squat / lunge", "Split squat, reverse lunge, or step-up — own the back knee.", {
          durationMin: 18,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
          coachInsight: coachCard(["boyle", "gambetta"]),
        }),
      );
      blocks.push(
        named("hinge", "runner-hinge", "Romanian deadlift (hip hinge)", "Hinge until the hamstrings talk; calves after if you have time.", {
          durationMin: 12,
          setsReps: sets(acc),
          restSec: acc.restSec,
          rpe: acc.rpe,
        }),
      );
    } else if (theme === "hyrox-lower" || theme === "combat-strength") {
      blocks.push(
        named("squat", "hyrox-squat", "Reverse lunge", "Lunges or a squat you can stand up from after a run.", {
          durationMin: 18,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
          coachInsight: coachCard(["gambetta"]),
        }),
      );
      blocks.push(
        named("carry", "hyrox-carry", "Farmer carry", "4–6 farmer carries or suitcase carries — walk tall.", {
          durationMin: 15,
          cues: ["Strong legs + grip beat endless fast mixed workouts alone."],
        }),
      );
    } else if (theme === "hyrox-upper") {
      blocks.push(
        named("pull", "hyrox-pull", "Pull-up / chin-up", "Pull-ups or rows — keep a few reps in reserve.", {
          durationMin: 20,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
        }),
      );
      blocks.push(
        named("carry", "hyrox-grip", "Farmer carry", "Farmer holds + a short carry. Grip first, then put it down on purpose.", {
          durationMin: 12,
        }),
      );
    } else {
      blocks.push(
        named("squat", "primary", "Bodyweight squat", "A compound lift that matches today’s focus.", {
          durationMin: 20,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
          cues: [main.intensityCue],
        }),
      );
    }

    blocks.push(
      named("core", "core", "Plank / Pallof hold", "Anti-rotation hold or plank + a single-leg or backside accessory.", {
        durationMin: 12,
        setsReps: sets(acc),
        restSec: acc.restSec,
        rpe: acc.rpe,
        cues: [acc.intensityCue, "If building muscle is the goal, aim toward about 10 hard sets per muscle this week."],
        coachInsight: coachCard(["boyle"]),
      }),
    );
  };

  if (session.kind === "strength" || session.kind === "field") {
    if (session.theme === "speed") {
      blocks.push(
        block("Sprint mechanics", "run", "Drills then 6–10 × 10–30m accelerations. Full rest (1:5+).", profile, {
          durationMin: 25,
          cues: ["Speed dies when you're fried — quality reps only."],
          coachInsight: coachCard(["pfaff"]),
        }),
      );
      blocks.push(
        named("hinge", "speed-support", "Romanian deadlift (hip hinge)", "Split squats or a light hinge — modest volume.", {
          durationMin: 15,
          setsReps: sets(acc),
          restSec: acc.restSec,
          rpe: acc.rpe,
        }),
      );
    } else if (session.theme === "agility") {
      blocks.push(
        block("Change-of-direction / agility", "conditioning", "Cone cuts, shuffle, plant-and-go — quality only.", profile, {
          durationMin: 20,
          cues: ["Decelerate on purpose; soft landings."],
          coachInsight: coachCard(["gambetta"]),
        }),
      );
      blocks.push(
        named("squat", "agility-sl", "Split squat / lunge", "Rear-foot elevated split squat or reverse lunge — own the knee.", {
          durationMin: 18,
          setsReps: sets(main),
          restSec: main.restSec,
          rpe: main.rpe,
        }),
      );
    } else {
      addStrength(session.theme);
    }
  } else if (session.kind === "endurance") {
    const isBike = session.theme.includes("bike");
    const isSwim = session.theme.includes("swim");
    const isLong = session.theme.startsWith("long");
    const isTempo = session.theme.startsWith("tempo");
    const isInt = session.theme.startsWith("intervals");
    let detail = "30–45 min easy. Talk test: you should be able to speak in full sentences.";
    if (isTempo) detail = "20–30 min tempo after warm-up, or 4–5 × 5 min hard / 1 min easy.";
    if (isInt) detail = "5–6 × 3 min hard / 2–3 min easy. Stop if form collapses.";
    if (isLong) detail = "45–75+ min easy continuous. Don't race the long day.";
    if (isBike) detail = detail.replace("run", "ride").replace("Talk test", "Nasal or chat pace on the bike.");
    if (isSwim) detail = isTempo
      ? "Sustainable hard swim pace with plenty of rest — smooth technique first."
      : isInt
        ? "Hard swim repeats (for example 8×100) with full recovery."
        : isLong
          ? "Continuous easy swim focusing on smooth stroke."
          : "Easy technique swim — drills + continuous.";
    blocks.push(
      block(session.focus, isSwim ? "conditioning" : "run", detail, profile, {
        durationMin: isLong ? 60 : isTempo || isInt ? 45 : 40,
        cues: ["About 80% of weekly endurance work should feel easy — you can talk."],
        coachInsight: coachCard(["daniels"]),
      }),
    );
  } else if (session.kind === "hybrid") {
    if (session.theme === "compromised" || session.theme === "simulation") {
      blocks.push(
        block(
          "Compromised repeats",
          "conditioning",
          "3–5 rounds: 1 station (sled / wall balls / lunges / row 500m) then 600–1000m run.",
          profile,
          {
            durationMin: 40,
            cues: ["HYROX race skill: practice running while your legs are already tired from a station."],
            coachInsight: coachCard(["gambetta"]),
          },
        ),
      );
    } else if (session.theme === "combat-cond" || session.theme === "combat-sim") {
      blocks.push(
        block(
          "Skill + density",
          "conditioning",
          "Shadow / bag / pads intervals (rounds) or wrestling-density circuits. Leave 1–2 rounds in reserve.",
          profile,
          { durationMin: 35, coachInsight: coachCard(["gambetta", "pfaff"]) },
        ),
      );
    } else if (session.theme === "strongman-events") {
      blocks.push(
        block("Event practice", "carry", "Farmers, yoke walk, or sandbag loading — short dense sets.", profile, {
          durationMin: 30,
          cues: ["Quality positions under odd loads."],
        }),
      );
      addStrength("hinge-pull");
    } else {
      blocks.push(
        block("Dense finisher", "conditioning", "12–15 min carry/bike/row intervals — leave reps in reserve.", profile, {
          durationMin: 15,
        }),
      );
    }
  } else if (session.kind === "mobility") {
    const detail =
      session.theme === "restorative"
        ? "Breath work, long holds, legs-up-wall. 20–30 min downshift."
        : session.theme === "rotational"
          ? "Med-ball rotational throws (if available) + open-book stretches, 90/90 hips, upper-back rotations."
          : session.theme === "balance"
            ? "Single-leg stands, slow step-downs, balance flows."
            : session.theme === "strength-flow"
              ? "Sun salutations / Pilates series with longer holds; optional push-up finishers."
              : "Hip flexors, pigeons, hamstrings, upper back — deliberate mobility.";
    blocks.push(
      block(session.focus, "mobility", detail, profile, {
        durationMin: 30,
        cues: ["A little mobility most days works; daily is even better."],
        coachInsight: coachCard(["boyle"]),
      }),
    );
  }

  if (hasAim(profile, "grow-glutes") && /squat|lower|hinge|legs|power-lower/.test(session.theme)) {
      blocks.push(
        named(
          "hinge",
          "glute-bias",
          "Hip thrust or glute bridge",
          "Shoulders on a bench or floor. Drive through heels. Pause at the top.",
          {
            durationMin: 12,
            setsReps: `${acc.sets} × ${acc.reps}`,
            restSec: acc.restSec,
            rpe: acc.rpe,
            cues: ["Extra glute work for your aim — clean reps, not sloppy load."],
          },
        ),
      );
    }
    if (hasAim(profile, "grow-upper") && /push|pull|upper|arms|power-upper/.test(session.theme)) {
      blocks.push(
        named(
          "pull",
          "upper-bias",
          "Extra back or arm set",
          "Rows, pulldowns, or curls — pick the gap you want to grow.",
          {
            durationMin: 10,
            setsReps: `${acc.sets} × ${acc.reps}`,
            restSec: acc.restSec,
            rpe: acc.rpe,
          },
        ),
      );
    }

  blocks.push(
    named("mobility", "cooldown", "Walk + stretch", "Easy walk + 2–3 stretches for worked areas (tightness, not pain).", {
      durationMin: 5,
    }),
  );

  return blocks;
}

function meal(
  name: string,
  items: string[],
  fuelingTip: string,
  coachInsight?: string,
  prepNote?: string,
): MealItem {
  const v = videoFor("meal-prep");
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    items,
    prepNote,
    fuelingTip,
    videoUrl: v.url,
    videoTitle: v.title,
    coachInsight,
    cueSteps: FORM_CUES["meal-prep"],
  };
}

function buildMeals(profile: UserProfile, hardDay: boolean, dayIndex: number, usedKeys: Set<string>): DayMeals {
  const tip = carbEmphasis(primaryGoal(profile), hardDay);
  const band = proteinTargetGPerKg(primaryGoal(profile));
  const proteinCue = `Aim ~20–40 g protein per meal · about ${band.min}–${band.max} grams per kilogram of body weight per day`;
  const snackTip = "Spread protein through the day, about every 3–4 hours — the daily total matters most.";
  const dayFamilies = new Set<string>();

  const take = (slot: "breakfast" | "lunch" | "dinner" | "snack", insight: string, fuel = tip) => {
    const option = pickMealOption(
      slot,
      profile,
      `${profile.sport}|${profileAims(profile).join(",")}|${dietFlags(profile).join(",")}|d${dayIndex}|${slot}`,
      usedKeys,
      hardDay,
      dayFamilies,
    );
    usedKeys.add(option.key);
    dayFamilies.add(mealFamilyOf(option));
    return meal(option.name, option.items, option.fuelingTip ?? fuel, insight, proteinCue);
  };

  return {
    breakfast: take("breakfast", coachCard(["sims", "pn-style"])),
    lunch: take("lunch", coachCard(["pn-style"])),
    dinner: take("dinner", coachCard(["sims", "jeukendrup"])),
    snack: take("snack", coachCard(["pn-style"]), snackTip),
  };
}

function scienceNotes(profile: UserProfile): string[] {
  const notes = [
    "Train each major muscle group at least twice a week. Showing up beats a fancy periodization spreadsheet.",
    "Progression: if the last set is easy by 2+ reps for two sessions in a row, add a little weight next time.",
    `Protein: about ${proteinTargetGPerKg(primaryGoal(profile)).min}–${proteinTargetGPerKg(primaryGoal(profile)).max} grams per kilogram of body weight per day, in 20–40 g meals every 3–4 hours.`,
  ];
  const fam = sportFamily(profile.sport);
  if (fam === "endurance")
    notes.push("Most miles/minutes stay easy. Hard days are planned (comfortably hard or short repeats) — not accidentally medium.");
  if (profile.sport === "hyrox")
    notes.push("HYROX (fitness race): easy running engine + station strength + practice running after stations.");
  if (profile.experience === "beginner")
    notes.push("Keep jumps and throws light until squat/hinge positions look solid.");
  const lane = goalLane(primaryGoal(profile));
  if (lane === "hypertrophy")
    notes.push("Building muscle: chase weekly set volume (~10 hard sets per muscle) more than max singles.");
  if (hasAim(profile, "grow-glutes"))
    notes.push("Glute aim: extra hinge/squat volume on lower days. Same plan — more work where you asked.");
  if (hasAim(profile, "grow-upper"))
    notes.push("Upper aim: extra pulling/pushing on those days. Keep lower-body days honest too.");
  if (lane === "cut")
    notes.push("Eating a little less: keep protein high, protect strength effort, cut filler sets first.");
  if (profile.experience === "advanced")
    notes.push("Advanced: we follow the days you picked. Adjust loads yourself; we won’t over-coach the session.");
  return notes;
}

export function buildWeekPlan(profile: UserProfile): WeekPlan {
  const family = sportFamily(profile.sport);
  const full = familySchedule(family, profile.sport);
  const rest = full[full.length - 1];
  const pool = full.filter((s) => s.kind !== "rest");
  const dayCount = isDaysPerWeek(profile.daysPerWeek) ? profile.daysPerWeek : 4;
  const trainingDays = normalizeTrainingDays(profile.trainingDays, dayCount);
  const assigned: SessionTemplate[] = [];
  for (let i = 0; i < dayCount; i++) assigned.push(pool[i % Math.max(pool.length, 1)] ?? rest);
  const schedule: SessionTemplate[] = Array.from({ length: 7 }, () => rest);
  trainingDays.forEach((dayIdx, i) => {
    schedule[dayIdx] = assigned[i] ?? rest;
  });

  const usedMeals = new Set<string>();
  const usedLifts = new Set<string>();
  const days: WeekDay[] = DAY_NAMES.map((dayName, dayIndex) => {
    const session = schedule[dayIndex];
    const hardDay = session.kind !== "rest" && !session.theme.includes("easy") && session.theme !== "mobility" && session.theme !== "restorative" && session.theme !== "rest";
    const blocks = buildBlocks(session, profile, dayIndex, usedLifts);
    const meals = buildMeals(profile, hardDay, dayIndex, usedMeals);
    const workout: DayWorkout = {
      label: dayName,
      isRest: session.kind === "rest",
      focus: session.focus,
      phaseLabel: session.phaseLabel,
      whyThisDay:
        profile.experience === "advanced"
          ? `${session.focus}. Your split — change loads as you see fit.`
          : session.why,
      progressionNote:
        profile.experience === "advanced"
          ? "You know the rule: add load when the last set is easy by 2+ reps twice in a row."
          : "If you beat the target by 2+ reps on the last set for two sessions in a row, add a little weight next time.",
      fuelingTip: carbEmphasis(primaryGoal(profile), hardDay),
      coachInsight: coachCard(
        family === "endurance" ? ["daniels"] : family === "field" ? ["gambetta", "pfaff"] : ["boyle", "olympic-sc"],
      ),
      blocks: blocks.map((b, i) => ({ ...b, id: `d${dayIndex}-b${i}` })),
    };
    return {
      dayIndex,
      dayName,
      workout,
      meals: {
        breakfast: { ...meals.breakfast, id: `d${dayIndex}-breakfast` },
        lunch: { ...meals.lunch, id: `d${dayIndex}-lunch` },
        dinner: { ...meals.dinner, id: `d${dayIndex}-dinner` },
        snack: meals.snack ? { ...meals.snack, id: `d${dayIndex}-snack` } : undefined,
      },
    };
  });

  return {
    id: `plan-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    engineVersion: primfitConfig.version,
    profile: { ...profile, daysPerWeek: dayCount, trainingDays },
    days,
    grocery: buildGroceryList(profile, days),
    scienceNotes: scienceNotes(profile),
  };
}

export function todayDayIndex(): number {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}
