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
import { mealTextFitsDiet } from "@/lib/diet";
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
  /** Hard training days lean carb-forward; easy/rest days prefer lighter plates. */
  bias?: "hard" | "easy";
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
  {
    key: "step-up",
    name: "Step-up",
    detail: "Drive through the whole foot; stand tall at the top. Alternate legs.",
    category: "squat",
    needs: ["bodyweight"],
  },
  {
    key: "reverse-lunge",
    name: "Reverse lunge",
    detail: "Step back, drop the back knee, stand up without crashing forward.",
    category: "squat",
    needs: ["bodyweight"],
  },
  {
    key: "db-squat",
    name: "Dumbbell squat",
    detail: "Dumbbells at the sides or on the shoulders; sit between the heels.",
    category: "squat",
    needs: ["dumbbells"],
  },
  {
    key: "leg-press",
    name: "Leg press",
    detail: "Full range you can control; don’t bounce the sled.",
    category: "squat",
    needs: ["full-gym"],
  },
  {
    key: "sl-rdl",
    name: "Single-leg Romanian deadlift",
    detail: "Hinge on one leg, hips square, a soft knee. Use a wall if balance is noisy.",
    category: "hinge",
    needs: ["bodyweight"],
  },
  {
    key: "db-rdl",
    name: "Dumbbell Romanian deadlift",
    detail: "Soft knees, hips back, bells close to the legs.",
    category: "hinge",
    needs: ["dumbbells"],
  },
  {
    key: "good-morning",
    name: "Good morning / hip hinge",
    detail: "Hands behind the head or a light pack; hinge until the hamstrings talk.",
    category: "hinge",
    needs: ["bodyweight"],
  },
  {
    key: "incline-push",
    name: "Incline push-up",
    detail: "Hands on a bench, couch, or wall. One long line; chest to the edge.",
    category: "push",
    needs: ["bodyweight"],
  },
  {
    key: "db-ohp",
    name: "Dumbbell overhead press",
    detail: "Ribs down, press to a stacked lockout. Seated if the low back wants to cheat.",
    category: "push",
    needs: ["dumbbells"],
  },
  {
    key: "floor-press",
    name: "Dumbbell floor press",
    detail: "Upper arms tap the floor; press without bouncing.",
    category: "push",
    needs: ["dumbbells"],
  },
  {
    key: "cable-press",
    name: "Cable / machine press",
    detail: "Chest press or cable press — same effort as a dumbbell set.",
    category: "push",
    needs: ["full-gym"],
  },
  {
    key: "renegade-row",
    name: "Renegade row",
    detail: "Plank on dumbbells, row one side without the hips spinning.",
    category: "pull",
    needs: ["dumbbells"],
  },
  {
    key: "lat-pulldown",
    name: "Lat pulldown",
    detail: "Pull the bar to the collarbones; don’t lean back into a kip.",
    category: "pull",
    needs: ["full-gym"],
  },
  {
    key: "cable-row",
    name: "Seated / cable row",
    detail: "Elbows to the ribs, pause, control the return.",
    category: "pull",
    needs: ["full-gym"],
  },
  {
    key: "goblet-carry",
    name: "Goblet carry",
    detail: "Hold a dumbbell at the chest and walk tall. Don’t lean on the bell.",
    category: "carry",
    needs: ["dumbbells"],
  },
  {
    key: "dead-bug",
    name: "Dead bug",
    detail: "Low back glued down; opposite arm and leg reach. Slow.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "side-plank",
    name: "Side plank",
    detail: "Hips stacked, ribs down. Drop to a knee if the set falls apart.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "hollow-hold",
    name: "Hollow hold",
    detail: "Lower back pressed down, legs and shoulders off the floor. Short quality holds.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "face-pull",
    name: "Band / cable face pull",
    detail: "Pull to the face, elbows high — rear shoulders, not a shrug.",
    category: "pull",
    needs: ["bands"],
  },
  {
    key: "kb-deadlift",
    name: "Kettlebell deadlift",
    detail: "Bell between the feet, hinge, stand tall. Same hip pattern as a barbell pull.",
    category: "hinge",
    needs: ["kettlebell"],
  },
  {
    key: "burpee",
    name: "Burpee / down-up",
    detail: "Step or jump back, chest toward the floor, stand. Smooth, not frantic.",
    category: "conditioning",
    needs: ["bodyweight"],
  },
  {
    key: "mtn-climber",
    name: "Mountain climber",
    detail: "Plank, knees drive without the hips pike. Quiet feet.",
    category: "conditioning",
    needs: ["bodyweight"],
  },
  {
    key: "jump-rope",
    name: "Easy skip / march",
    detail: "Jump rope if you have one, otherwise a light march in place to raise temperature.",
    category: "warm-up",
    needs: ["bodyweight"],
  },
  {
    key: "worlds-greatest",
    name: "World’s greatest stretch",
    detail: "Lunge, twist, hamstring — both sides. Then two light sets of the first lift.",
    category: "warm-up",
    needs: ["bodyweight"],
  },
  {
    key: "calf-raise",
    name: "Calf raise",
    detail: "Full stretch at the bottom, pause at the top. Single-leg if easy.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "pogo",
    name: "Pogo jumps",
    detail: "Short, springy hops. Quiet feet, stiff-ish ankles — not a squat bounce.",
    category: "power",
    needs: ["bodyweight"],
  },
  {
    key: "mb-slam",
    name: "Med-ball slam / throw",
    detail: "Athletic stance, slam or chest-pass hard, pick it up on purpose. Light ball if you’re learning.",
    category: "power",
    needs: ["full-gym"],
  },
  {
    key: "jump-squat",
    name: "Jump squat",
    detail: "Sit, jump, land quietly, reset. Stop while landings stay crisp.",
    category: "power",
    needs: ["bodyweight"],
  },
  {
    key: "inchworm",
    name: "Inchworm",
    detail: "Walk the hands out to a plank, then the feet back up. Soft knees.",
    category: "warm-up",
    needs: ["bodyweight"],
  },
  {
    key: "cat-camel",
    name: "Cat-camel + open book",
    detail: "Slow spinal waves, then side-lying open-books for the upper back.",
    category: "warm-up",
    needs: ["bodyweight"],
  },
  {
    key: "hip-90",
    name: "90/90 hip openers",
    detail: "Both sitting angles, tall chest, easy breathing. Then two light sets of the first lift.",
    category: "warm-up",
    needs: ["bodyweight"],
  },
  {
    key: "band-pull-apart",
    name: "Band pull-apart + raise",
    detail: "Light band: pull-aparts and a few easy raises to wake the shoulders.",
    category: "warm-up",
    needs: ["bands"],
  },
  {
    key: "walk-stretch",
    name: "Walk + stretch",
    detail: "Easy walk, then 2–3 stretches for what you just trained — tightness, not pain.",
    category: "mobility",
    needs: ["bodyweight"],
  },
  {
    key: "hip-ham",
    name: "Hip + hamstring reset",
    detail: "Long easy holds: hip flexor, hamstring, pigeon-ish. Breathe into it.",
    category: "mobility",
    needs: ["bodyweight"],
  },
  {
    key: "downshift",
    name: "Breathing downshift",
    detail: "Legs-up-wall or easy floor breathing, 4–6 slow breaths, then a short stroll.",
    category: "mobility",
    needs: ["bodyweight"],
  },
  {
    key: "bird-dog",
    name: "Bird dog",
    detail: "Opposite arm and leg, hips quiet, pause at the long position.",
    category: "core",
    needs: ["bodyweight"],
  },
  {
    key: "glute-bridge-hold",
    name: "Glute bridge hold",
    detail: "Heels down, ribs quiet, squeeze at the top. Short quality holds.",
    category: "core",
    needs: ["bodyweight"],
  },
];

const MEALS: MealOption[] = [
  {
    key: "egg-oats",
    name: "Eggs + oats",
    items: ["scrambled or boiled eggs", "oats", "banana", "water"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["eggs", "oats", "bananas"],
    bias: "hard",
  },
  {
    key: "savory-oats",
    name: "Savory egg oats",
    items: ["oats cooked in water or milk", "fried egg on top", "wilted leafy greens", "olive oil drizzle"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["oats", "eggs", "leafy-greens", "olive-oil", "milk"],
    bias: "hard",
  },
  {
    key: "breakfast-fried-rice",
    name: "Breakfast fried rice",
    items: ["leftover rice", "scrambled eggs", "leafy greens", "olive oil"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["rice", "eggs", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "greens-omelette",
    name: "Greens omelette",
    items: ["eggs", "leafy greens", "olive oil", "banana on the side"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "leafy-greens", "olive-oil", "bananas"],
    bias: "easy",
  },
  {
    key: "chicken-egg-bfast",
    name: "Chicken scramble",
    items: ["eggs", "leftover chicken", "leafy greens", "olive oil"],
    slot: "breakfast",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["eggs", "chicken", "leafy-greens", "olive-oil"],
    bias: "easy",
  },
  {
    key: "banana-eggs-bfast",
    name: "Eggs + banana plate",
    items: ["boiled or fried eggs", "banana", "olive oil pinch of salt"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "bananas", "olive-oil"],
    bias: "easy",
  },
  {
    key: "banana-oat-bowl",
    name: "Banana oat bowl",
    items: ["oats", "sliced banana", "optional egg whites or a boiled egg"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["oats", "bananas", "eggs"],
    bias: "hard",
  },
  {
    key: "chicken-hash-bfast",
    name: "Chicken rice hash",
    items: ["leftover chicken", "rice", "eggs", "leafy greens"],
    slot: "breakfast",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "rice", "eggs", "leafy-greens"],
    bias: "hard",
  },
  {
    key: "egg-rice-skillet",
    name: "Egg rice skillet",
    items: ["rice", "fried eggs", "olive oil", "banana"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["rice", "eggs", "olive-oil", "bananas"],
    bias: "hard",
  },
  {
    key: "yogurt-bowl",
    name: "Yogurt bowl",
    items: ["greek yogurt", "banana or berries", "nuts or nut butter"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["greek-yogurt", "berries", "bananas", "nuts", "nut-butter"],
    bias: "easy",
  },
  {
    key: "yogurt-oats",
    name: "Overnight oats",
    items: ["oats soaked in yogurt or milk", "banana", "optional nut butter"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["oats", "greek-yogurt", "milk", "bananas", "nut-butter"],
    bias: "hard",
  },
  {
    key: "tofu-scramble",
    name: "Tofu scramble plate",
    items: ["tofu", "leafy greens", "potatoes or rice", "olive oil"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["tofu", "leafy-greens", "potatoes", "rice", "olive-oil"],
    bias: "hard",
  },
  {
    key: "toast-eggs",
    name: "Eggs on toast",
    items: ["eggs", "bread", "banana or greens on the side"],
    slot: "breakfast",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["eggs", "bread", "bananas", "leafy-greens"],
    bias: "hard",
  },
  {
    key: "chicken-rice",
    name: "Chicken rice bowl",
    items: ["chicken", "rice", "leafy greens or broccoli", "olive oil"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "rice", "broccoli", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "egg-fried-rice-lunch",
    name: "Egg fried rice",
    items: ["rice", "eggs", "leafy greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["rice", "eggs", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "chicken-skillet-lunch",
    name: "Chicken greens skillet",
    items: ["chicken", "leafy greens", "olive oil", "rice on the side"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "leafy-greens", "olive-oil", "rice"],
    bias: "hard",
  },
  {
    key: "chicken-olive-plate",
    name: "Chicken + greens plate",
    items: ["chicken", "big leafy salad", "olive oil", "banana"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "leafy-greens", "olive-oil", "bananas"],
    bias: "easy",
  },
  {
    key: "egg-greens-lunch",
    name: "Egg greens plate",
    items: ["boiled eggs", "leafy greens", "olive oil", "banana"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "leafy-greens", "olive-oil", "bananas"],
    bias: "easy",
  },
  {
    key: "egg-greens-rice",
    name: "Egg and greens rice",
    items: ["fried or boiled eggs", "rice", "sautéed greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "rice", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "oat-chicken-lunch",
    name: "Savory oats + chicken",
    items: ["oats", "leftover chicken", "leafy greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: false,
    prefers: ["oats", "chicken", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "fish-potato",
    name: "Fish + potatoes",
    items: ["fish", "potatoes", "leafy greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["fish", "potatoes", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "lentil-bowl",
    name: "Lentil grain bowl",
    items: ["lentils or beans", "rice or quinoa", "greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["lentils", "beans", "rice", "quinoa", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "yogurt-rice-lunch",
    name: "Yogurt rice bowl",
    items: ["greek yogurt", "warm rice", "banana", "olive oil or nuts"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["greek-yogurt", "rice", "bananas", "olive-oil", "nuts"],
    bias: "easy",
  },
  {
    key: "pasta-lunch",
    name: "Pasta lunch bowl",
    items: ["pasta", "chicken or eggs or tofu", "greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["pasta", "chicken", "eggs", "tofu", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "tofu-rice-lunch",
    name: "Tofu rice bowl",
    items: ["tofu", "rice", "leafy greens", "olive oil"],
    slot: "lunch",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["tofu", "rice", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "chicken-stir-fry",
    name: "Chicken stir-fry",
    items: ["chicken", "leafy greens or broccoli", "olive oil", "lighter rice"],
    slot: "dinner",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "leafy-greens", "broccoli", "olive-oil", "rice"],
    bias: "easy",
  },
  {
    key: "egg-fried-rice-dinner",
    name: "Egg fried rice dinner",
    items: ["rice", "eggs", "leafy greens", "olive oil"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["rice", "eggs", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "olive-chicken-greens",
    name: "Olive-oil chicken + greens",
    items: ["chicken", "big pile of greens", "olive oil", "optional rice"],
    slot: "dinner",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "leafy-greens", "olive-oil", "rice"],
    bias: "easy",
  },
  {
    key: "chicken-rice-skillet",
    name: "Chicken & rice skillet",
    items: ["chicken", "rice", "leafy greens", "olive oil"],
    slot: "dinner",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "rice", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "egg-greens-dinner",
    name: "Greens omelette dinner",
    items: ["eggs", "leafy greens", "olive oil", "rice or banana"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "leafy-greens", "olive-oil", "rice", "bananas"],
    bias: "easy",
  },
  {
    key: "pasta-protein",
    name: "Pasta + protein",
    items: ["pasta", "chicken or tofu or eggs", "broccoli or greens", "olive oil"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["pasta", "chicken", "tofu", "eggs", "broccoli", "olive-oil"],
    bias: "hard",
  },
  {
    key: "recovery-plate",
    name: "Recovery plate",
    items: ["chicken or fish or tofu", "rice or potatoes", "mixed vegetables"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["chicken", "fish", "tofu", "rice", "potatoes", "broccoli"],
    bias: "hard",
  },
  {
    key: "bean-chili",
    name: "Bean chili bowl",
    items: ["beans or lentils", "rice", "greens or broccoli"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["beans", "lentils", "rice", "broccoli", "leafy-greens"],
    bias: "hard",
  },
  {
    key: "fish-rice-dinner",
    name: "Fish rice bowl",
    items: ["fish", "rice", "leafy greens", "olive oil"],
    slot: "dinner",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["fish", "rice", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "potato-chicken-dinner",
    name: "Chicken + potatoes",
    items: ["chicken", "potatoes", "greens", "olive oil"],
    slot: "dinner",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "potatoes", "leafy-greens", "olive-oil"],
    bias: "hard",
  },
  {
    key: "tofu-stir-fry",
    name: "Tofu stir-fry",
    items: ["tofu", "leafy greens", "rice", "olive oil"],
    slot: "dinner",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["tofu", "leafy-greens", "rice", "olive-oil"],
    bias: "easy",
  },
  {
    key: "shake",
    name: "Protein snack",
    items: ["protein shake or yogurt", "banana or berries"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["whey", "greek-yogurt", "bananas", "berries"],
    bias: "easy",
  },
  {
    key: "nuts-fruit",
    name: "Nuts + fruit",
    items: ["nuts or nut butter", "banana"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["nuts", "nut-butter", "bananas"],
    bias: "easy",
  },
  {
    key: "banana-oats-snack",
    name: "Banana oat mug",
    items: ["quick oats", "banana", "water or milk"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: false,
    prefers: ["oats", "bananas", "milk"],
    bias: "hard",
  },
  {
    key: "eggs-banana",
    name: "Eggs + banana",
    items: ["hard-boiled eggs", "banana"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "bananas"],
    bias: "easy",
  },
  {
    key: "leftover-chicken-snack",
    name: "Leftover chicken + banana",
    items: ["cold chicken", "banana", "optional olive oil pinch of salt"],
    slot: "snack",
    vegetarianOk: false,
    glutenFreeOk: true,
    prefers: ["chicken", "bananas", "olive-oil"],
    bias: "easy",
  },
  {
    key: "rice-egg-snack",
    name: "Rice + egg snack",
    items: ["small rice bowl", "fried or boiled egg", "olive oil"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["rice", "eggs", "olive-oil"],
    bias: "hard",
  },
  {
    key: "yogurt-banana",
    name: "Yogurt + banana",
    items: ["greek yogurt", "banana"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["greek-yogurt", "bananas"],
    bias: "easy",
  },
  {
    key: "greens-egg-snack",
    name: "Egg + greens",
    items: ["boiled eggs", "handful of greens", "olive oil"],
    slot: "snack",
    vegetarianOk: true,
    glutenFreeOk: true,
    prefers: ["eggs", "leafy-greens", "olive-oil"],
    bias: "easy",
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
  const inv = new Set(profile.foodInventory ?? []);
  return MEALS.filter((m) => {
    if (m.slot !== slot) return false;
    if (!mealTextFitsDiet(m, profile)) return false;
    return true;
  }).sort((a, b) => {
    const as = a.prefers.filter((p) => inv.has(p)).length;
    const bs = b.prefers.filter((p) => inv.has(p)).length;
    return bs - as;
  });
}

function hashPick(seed: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % modulo;
}

function pantryScore(option: MealOption, inv: Set<FoodStapleId>): number {
  return option.prefers.filter((p) => inv.has(p)).length;
}

const PROTEIN_STAPLES: FoodStapleId[] = [
  "chicken",
  "fish",
  "eggs",
  "greek-yogurt",
  "tofu",
  "lentils",
  "beans",
  "whey",
];

function proteinFits(option: MealOption, inv: Set<FoodStapleId>): boolean {
  const needed = option.prefers.filter((p) => PROTEIN_STAPLES.includes(p));
  if (!needed.length) return true;
  return needed.some((p) => inv.has(p));
}

function namedStapleFits(option: MealOption, inv: Set<FoodStapleId>): boolean {
  const n = option.name.toLowerCase();
  const checks: [string, FoodStapleId[]][] = [
    ["pasta", ["pasta"]],
    ["fish", ["fish"]],
    ["tofu", ["tofu"]],
    ["yogurt", ["greek-yogurt"]],
    ["potato", ["potatoes"]],
    ["toast", ["bread"]],
    ["lentil", ["lentils", "beans"]],
    ["bean", ["beans", "lentils"]],
    ["chili", ["beans", "lentils"]],
  ];
  for (const [word, staples] of checks) {
    if (n.includes(word) && !staples.some((s) => inv.has(s))) return false;
  }
  return true;
}

function rankMeals(list: MealOption[], inv: Set<FoodStapleId>): MealOption[] {
  const fits = list.filter((m) => proteinFits(m, inv) && namedStapleFits(m, inv));
  const source = fits.length ? fits : list;
  const maxScore = source.reduce((n, m) => Math.max(n, pantryScore(m, inv)), 0);
  const floor = Math.max(1, maxScore - 1);
  const pantryOk = source.filter((m) => pantryScore(m, inv) >= floor);
  return pantryOk.length ? pantryOk : source;
}

function unusedPool(
  list: MealOption[],
  avoidKeys: ReadonlySet<string>,
  avoidFamilies: ReadonlySet<string>,
): MealOption[] {
  const notRepeat = list.filter((m) => !avoidKeys.has(m.key));
  const fresh = notRepeat.filter((m) => !avoidFamilies.has(mealFamily(m)));
  if (fresh.length) return fresh;
  return [];
}

function mealFamily(option: MealOption): string {
  const n = `${option.key} ${option.name}`.toLowerCase();
  if (n.includes("fried rice")) return "fried-rice";
  if (n.includes("omelette")) return "omelette";
  if (n.includes("oat")) return "oats";
  if (n.includes("yogurt") || n.includes("shake")) return "yogurt";
  if (n.includes("pasta")) return "pasta";
  if (n.includes("chili") || n.includes("lentil") || n.includes("bean")) return "legume";
  if (n.includes("tofu")) return "tofu";
  if (n.includes("fish")) return "fish";
  if (n.includes("hash")) return "hash";
  if (n.includes("toast")) return "toast";
  if (n.includes("potato")) return "potato";
  if (n.includes("chicken") && n.includes("green")) return "chicken-greens";
  if (n.includes("chicken")) return "chicken-carb";
  if (n.includes("egg")) return "eggs";
  return option.key;
}

export function pickMealOption(
  slot: MealSlot,
  profile: UserProfile,
  seed: string,
  avoidKeys: ReadonlySet<string>,
  hardDay: boolean,
  avoidFamilies: ReadonlySet<string> = new Set(),
): MealOption {
  const all = mealOptionsFor(slot, profile);
  const fallback = all[0] ?? MEALS.find((m) => m.slot === slot) ?? MEALS[0];
  const inv = new Set(profile.foodInventory ?? []);
  const biased = all.filter((m) => (hardDay ? m.bias !== "easy" : m.bias !== "hard"));
  const preferred = rankMeals(biased.length ? biased : all, inv);
  const general = rankMeals(all, inv);
  const fromPreferred = unusedPool(preferred, avoidKeys, avoidFamilies);
  const fromGeneral = unusedPool(general, avoidKeys, avoidFamilies);
  const leftover = all.filter(
    (m) => !avoidKeys.has(m.key) && proteinFits(m, inv) && namedStapleFits(m, inv) && !avoidFamilies.has(mealFamily(m)),
  );
  const leftoverAny = all.filter((m) => !avoidKeys.has(m.key) && proteinFits(m, inv) && namedStapleFits(m, inv));
  const pool = fromPreferred.length
    ? fromPreferred
    : fromGeneral.length
      ? fromGeneral
      : leftover.length
        ? leftover
        : leftoverAny.length
          ? leftoverAny
          : preferred.length
            ? preferred
            : general;
  if (!pool.length) return fallback;
  return pool[hashPick(seed, pool.length)] ?? fallback;
}

export function mealFamilyOf(option: MealOption): string {
  return mealFamily(option);
}

export function pickExerciseOption(
  category: MovementCategory,
  profile: UserProfile,
  seed: string,
  avoidKeys: ReadonlySet<string>,
): ExerciseOption | undefined {
  const all = exerciseOptionsFor(category, profile);
  const fresh = all.filter((ex) => !avoidKeys.has(ex.key));
  const pool = fresh.length ? fresh : all;
  if (!pool.length) return undefined;
  return pool[hashPick(seed, pool.length)];
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
