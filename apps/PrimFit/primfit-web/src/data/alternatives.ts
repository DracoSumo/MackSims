import type {
  EquipmentId,
  FoodStapleId,
  MealItem,
  MealSlot,
  MovementCategory,
  TrainingLocationMode,
  UserProfile,
  WeekPlan,
  WorkoutBlock,
} from "./types";
import { FORM_CUES } from "./formCues";
import { videoFor } from "./videoLibrary";

export type ExerciseOption = {
  key: string;
  name: string;
  detail: string;
  category: MovementCategory;
  /** Empty / bodyweight-only = always available. */
  needs: EquipmentId[];
  cueSteps?: string[];
};

export type MealOption = {
  key: string;
  name: string;
  items: string[];
  slot: MealSlot;
  vegetarianOk: boolean;
  glutenFreeOk: boolean;
  prefers: FoodStapleId[];
  fuelingTip?: string;
};

const EXERCISES: ExerciseOption[] = [
  {
    key: "air-squat",
    name: "Bodyweight squat",
    detail: "Air squats or tempo squats — full depth you can control.",
    category: "squat",
    needs: ["bodyweight"],
  },
  {
    key: "goblet",
    name: "Goblet squat",
    detail: "Hold a dumbbell or kettlebell at your chest; sit between your heels.",
    category: "squat",
    needs: ["dumbbells"],
  },
  {
    key: "split-squat",
    name: "Split squat / lunge",
    detail: "Stationary split squat, walking lunge, or step-up.",
    category: "squat",
    needs: ["bodyweight"],
  },
  {
    key: "back-squat",
    name: "Barbell squat",
    detail: "Back squat or front squat — full range you can control.",
    category: "squat",
    needs: ["barbell"],
  },
  {
    key: "rdl",
    name: "Romanian deadlift (hip hinge)",
    detail: "Soft knees, hips back, weight close to the legs.",
    category: "hinge",
    needs: ["dumbbells"],
  },
  {
    key: "kb-swing",
    name: "Kettlebell swing",
    detail: "Hinge, snap hips, arms stay long — power from the hips, not a squat-yank.",
    category: "hinge",
    needs: ["kettlebell"],
  },
  {
    key: "hip-thrust",
    name: "Hip thrust / glute bridge",
    detail: "Shoulders on a bench or floor; drive through the heels.",
    category: "hinge",
    needs: ["bodyweight"],
  },
  {
    key: "band-pull-through",
    name: "Band pull-through",
    detail: "Face away from the anchor; hinge and snap the hips.",
    category: "hinge",
    needs: ["bands"],
  },
  {
    key: "trap-bar",
    name: "Trap-bar / conventional deadlift",
    detail: "Stand tall with a braced midsection; don’t yank with the low back.",
    category: "hinge",
    needs: ["barbell"],
  },
  {
    key: "push-up",
    name: "Push-up",
    detail: "Floor, incline, or knee push-ups — one long line from head to heels.",
    category: "push",
    needs: ["bodyweight"],
  },
  {
    key: "db-press",
    name: "Dumbbell press",
    detail: "Floor press or bench press with dumbbells.",
    category: "push",
    needs: ["dumbbells"],
  },
  {
    key: "bb-press",
    name: "Barbell press",
    detail: "Bench press or overhead press.",
    category: "push",
    needs: ["barbell"],
  },
  {
    key: "band-press",
    name: "Band press",
    detail: "Press against a band — match the same effort as a dumbbell set.",
    category: "push",
    needs: ["bands"],
  },
  {
    key: "table-row",
    name: "Table / inverted row",
    detail: "Rows under a sturdy table, rings, or a low bar.",
    category: "pull",
    needs: ["bodyweight"],
  },
  {
    key: "db-row",
    name: "Dumbbell row",
    detail: "Supported or two-arm rows; squeeze the armpit at the top.",
    category: "pull",
    needs: ["dumbbells"],
  },
  {
    key: "pull-up",
    name: "Pull-up / chin-up",
    detail: "Full hang to chin over the bar, or jump-and-lower if you’re building there.",
    category: "pull",
    needs: ["pull-up-bar"],
  },
  {
    key: "band-row",
    name: "Band row",
    detail: "Anchor a band at chest height; row elbows to the ribs.",
    category: "pull",
    needs: ["bands"],
  },
  {
    key: "farmer",
    name: "Farmer carry",
    detail: "Heavy dumbbells or kettlebells at your sides; walk tall.",
    category: "carry",
    needs: ["dumbbells"],
  },
  {
    key: "suitcase-bag",
    name: "Suitcase carry (backpack / bags)",
    detail: "One heavy bag per hand (or one side); don’t lean.",
    category: "carry",
    needs: ["bodyweight"],
  },
  {
    key: "sled",
    name: "Sled push / drag",
    detail: "Forward push or backward drag — short, hard trips.",
    category: "carry",
    needs: ["sled"],
  },
  {
    key: "easy-run",
    name: "Easy run / walk",
    detail: "Conversational pace — you can talk in full sentences.",
    category: "run",
    needs: ["bodyweight"],
  },
  {
    key: "bike",
    name: "Easy bike",
    detail: "Conversational spin — same “can talk” rule as easy running.",
    category: "run",
    needs: ["bike"],
  },
  {
    key: "row",
    name: "Easy row",
    detail: "Smooth strokes, conversational effort.",
    category: "conditioning",
    needs: ["rower"],
  },
  {
    key: "plank",
    name: "Plank / Pallof hold",
    detail: "Ribs down, glutes on. Anti-rotation or front plank.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "box-jump",
    name: "Box jump / squat jump",
    detail: "Jump, stick the landing quietly. Step down. Or squat jumps if no box.",
    category: "power",
    needs: ["bodyweight"],
  },
  {
    key: "flow",
    name: "Mobility flow",
    detail: "Hips, hamstrings, and upper-back rotations — tightness, not pain.",
    category: "mobility",
    needs: ["bodyweight"],
  },
];

const MEALS: MealOption[] = [
  {
    key: "egg-oats",
    name: "Eggs + oats",
    items: ["eggs", "oats", "berries or banana", "water"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["eggs", "oats", "berries", "bananas"],
  },
  {
    key: "yogurt-bowl",
    name: "Yogurt bowl",
    items: ["greek yogurt", "berries or banana", "nuts or nut butter"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["greek-yogurt", "berries", "bananas", "nuts", "nut-butter"],
  },
  {
    key: "tofu-scramble",
    name: "Tofu scramble plate",
    items: ["tofu", "leafy greens", "potatoes or rice"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["tofu", "leafy-greens", "potatoes", "rice"],
  },
  {
    key: "chicken-rice",
    name: "Chicken + rice bowl",
    items: ["chicken", "rice", "broccoli or greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "rice", "broccoli", "leafy-greens", "olive-oil"],
  },
  {
    key: "fish-potato",
    name: "Fish + potatoes",
    items: ["fish", "potatoes", "leafy greens"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["fish", "potatoes", "leafy-greens"],
  },
  {
    key: "lentil-bowl",
    name: "Lentil grain bowl",
    items: ["lentils or beans", "rice or quinoa", "greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["lentils", "beans", "rice", "quinoa", "leafy-greens", "olive-oil"],
  },
  {
    key: "pasta-protein",
    name: "Pasta + protein",
    items: ["pasta", "chicken or tofu", "broccoli", "olive oil"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["pasta", "chicken", "tofu", "broccoli", "olive-oil"],
  },
  {
    key: "recovery-plate",
    name: "Recovery plate",
    items: ["chicken or fish or tofu", "rice or potatoes", "mixed vegetables"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["chicken", "fish", "tofu", "rice", "potatoes", "broccoli"],
  },
  {
    key: "bean-chili",
    name: "Bean chili bowl",
    items: ["beans or lentils", "rice", "greens or broccoli"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["beans", "lentils", "rice", "broccoli", "leafy-greens"],
  },
  {
    key: "shake",
    name: "Protein snack",
    items: ["protein shake or yogurt", "banana or berries"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["whey", "greek-yogurt", "bananas", "berries"],
  },
  {
    key: "nuts-fruit",
    name: "Nuts + fruit",
    items: ["nuts or nut butter", "banana or berries"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["nuts", "nut-butter", "bananas", "berries"],
  },
];

function hasFullGym(profile: UserProfile): boolean {
  return profile.locationMode === "commercial-gym" || profile.equipment.includes("full-gym");
}

function hasGear(profile: UserProfile, needs: EquipmentId[]): boolean {
  if (needs.length === 0 || needs.every((n) => n === "bodyweight")) return true;
  if (hasFullGym(profile)) return true;
  const eq = new Set(profile.equipment);
  return needs.every((n) => n === "bodyweight" || eq.has(n));
}

export function exerciseOptionsFor(
  category: MovementCategory,
  profile: UserProfile,
): ExerciseOption[] {
  const loc: TrainingLocationMode = profile.locationMode;
  return EXERCISES.filter((ex) => {
    if (ex.category !== category) {
      if (category === "conditioning" && (ex.category === "run" || ex.category === "carry")) return true;
      if (category === "warm-up") return false;
      return false;
    }
    if (loc === "travel-hotel" && ex.needs.some((n) => n === "barbell" || n === "sled")) return false;
    return hasGear(profile, ex.needs);
  });
}

export function mealOptionsFor(slot: MealSlot, profile: UserProfile): MealOption[] {
  const veg = profile.dietary === "vegetarian";
  const gf = profile.dietary === "gluten-free";
  const inv = new Set(profile.foodInventory ?? []);
  return MEALS.filter((m) => {
    if (m.slot !== slot) return false;
    if (veg && !m.vegetarianOk) return false;
    if (gf && !m.glutenFreeOk) return false;
    return true;
  }).sort((a, b) => {
    const as = a.prefers.filter((p) => inv.has(p)).length;
    const bs = b.prefers.filter((p) => inv.has(p)).length;
    return bs - as;
  });
}

export function applyExerciseSwap(
  plan: WeekPlan,
  dayIndex: number,
  blockId: string,
  option: ExerciseOption,
): WeekPlan {
  const v = videoFor(option.category);
  const days = plan.days.map((day) => {
    if (day.dayIndex !== dayIndex) return day;
    return {
      ...day,
      workout: {
        ...day.workout,
        blocks: day.workout.blocks.map((b) => {
          if (b.id !== blockId) return b;
          const next: WorkoutBlock = {
            ...b,
            name: option.name,
            detail: option.detail,
            movementCategory: option.category,
            videoUrl: v.url,
            videoTitle: v.title,
            cueSteps: option.cueSteps ?? FORM_CUES[option.category],
          };
          return next;
        }),
      },
    };
  });
  return { ...plan, days };
}

export function applyMealSwap(
  plan: WeekPlan,
  dayIndex: number,
  slot: MealSlot,
  option: MealOption,
): WeekPlan {
  const v = videoFor("meal-prep");
  const days = plan.days.map((day) => {
    if (day.dayIndex !== dayIndex) return day;
    const nextMeal: MealItem = {
      id: day.meals[slot]?.id ?? `d${dayIndex}-${slot}`,
      name: option.name,
      items: option.items,
      fuelingTip: option.fuelingTip ?? day.meals[slot]?.fuelingTip,
      videoUrl: v.url,
      videoTitle: v.title,
      cueSteps: FORM_CUES["meal-prep"],
      coachInsight: day.meals[slot]?.coachInsight,
      prepNote: day.meals[slot]?.prepNote,
    };
    return { ...day, meals: { ...day.meals, [slot]: nextMeal } };
  });
  return { ...plan, days };
}
