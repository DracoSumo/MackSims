import type {
  BodyContextId,
  BudgetId,
  DietaryId,
  EquipmentId,
  ExperienceId,
  FoodStapleId,
  GoalId,
  SportGroupId,
  SportId,
  StrengthLiftId,
  TrainingLocationMode,
} from "./types";

export const SPORT_GROUPS: { id: SportGroupId; label: string }[] = [
  { id: "strength-physique", label: "Strength / physique" },
  { id: "endurance", label: "Endurance" },
  { id: "hybrid-combat", label: "Hybrid / combat" },
  { id: "field-court", label: "Field / court" },
  { id: "mobility-other", label: "Mobility / other" },
];

export const SPORTS: {
  id: SportId;
  label: string;
  group: SportGroupId;
  keywords: string;
  blurb: string;
}[] = [
  { id: "strongman", label: "Strongman", group: "strength-physique", keywords: "atlas yoke farmers log", blurb: "Odd objects, carries, and brute strength." },
  { id: "bodybuilding", label: "Bodybuilding", group: "strength-physique", keywords: "physique hypertrophy aesthetic", blurb: "Build muscle with volume and clean form." },
  { id: "powerlifting", label: "Powerlifting", group: "strength-physique", keywords: "squat bench deadlift 1rm", blurb: "Squat, bench, deadlift — get those heavier." },
  { id: "general-strength", label: "General strength", group: "strength-physique", keywords: "gym weights strength", blurb: "Get stronger without a single sport focus." },
  { id: "crossfit", label: "CrossFit / functional", group: "strength-physique", keywords: "wod metcon functional fitness", blurb: "Mixed strength and short hard efforts." },
  { id: "running", label: "Running", group: "endurance", keywords: "jog marathon 5k road", blurb: "Easy miles plus one harder session." },
  { id: "cycling", label: "Cycling", group: "endurance", keywords: "bike road spin zwift", blurb: "Ride volume with a couple of quality days." },
  { id: "swimming", label: "Swimming", group: "endurance", keywords: "pool freestyle laps", blurb: "Technique, aerobic work, and a hard set." },
  { id: "triathlon", label: "Triathlon", group: "endurance", keywords: "swim bike run ironman", blurb: "Swim, bike, run — keep most of it easy." },
  { id: "hyrox", label: "HYROX", group: "hybrid-combat", keywords: "hybrid race stations hyrox", blurb: "Run plus stations. Build the engine first." },
  { id: "combat", label: "Boxing / mixed martial arts", group: "hybrid-combat", keywords: "boxing mma kickboxing striking", blurb: "Strength, cardio, and contact resilience." },
  { id: "wrestling", label: "Wrestling", group: "hybrid-combat", keywords: "grappling folkstyle freestyle", blurb: "Grappling strength, hips, and work capacity." },
  { id: "football", label: "Football", group: "field-court", keywords: "gridiron nfl", blurb: "Power, speed, and contact prep." },
  { id: "basketball", label: "Basketball", group: "field-court", keywords: "hoops nba", blurb: "Jump, cut, and last through games." },
  { id: "soccer", label: "Soccer", group: "field-court", keywords: "football pitch futbol", blurb: "Repeat sprints and change of direction." },
  { id: "baseball", label: "Baseball / softball", group: "field-court", keywords: "softball diamond bat", blurb: "Rotational power and arm care." },
  { id: "tennis", label: "Tennis", group: "field-court", keywords: "racket racquet", blurb: "Lateral speed and durable shoulders." },
  { id: "badminton", label: "Badminton", group: "field-court", keywords: "shuttle shuttlecock racket", blurb: "Quick feet and overhead durability." },
  { id: "volleyball", label: "Volleyball", group: "field-court", keywords: "spike serve beach", blurb: "Jump repeatability and landing control." },
  { id: "golf", label: "Golf", group: "field-court", keywords: "swing links", blurb: "Rotation, posture, and walking miles." },
  { id: "yoga", label: "Yoga / mobility", group: "mobility-other", keywords: "stretch flow breath", blurb: "Move well, breathe, keep joints happy." },
  { id: "general-athleticism", label: "General athleticism", group: "mobility-other", keywords: "athletic all-around", blurb: "A little of everything, nothing fancy." },
  { id: "pilates", label: "Pilates", group: "mobility-other", keywords: "core reformer control", blurb: "Control, core, and long-range strength." },
];

export const GOALS: { id: GoalId; label: string; description: string }[] = [
  { id: "lose-fat", label: "Lose fat", description: "Train, keep protein high, eat a little less." },
  { id: "build-muscle", label: "Build muscle", description: "Add size overall with progressive strength." },
  { id: "grow-glutes", label: "Grow glutes", description: "Extra squat and hinge work for your butt." },
  { id: "grow-upper", label: "Grow upper body", description: "Chest, back, shoulders, and arms get the volume." },
  { id: "get-stronger", label: "Get stronger", description: "Add weight on the main lifts." },
  { id: "go-longer", label: "Last longer", description: "More easy work so you can go farther or longer." },
  { id: "performance", label: "Sport performance", description: "Train for the sport you picked." },
  { id: "feel-better", label: "Feel better", description: "Move, sleep, and keep it simple." },
  { id: "come-back", label: "Coming back", description: "Ease in after time off." },
  { id: "maintain", label: "Maintain", description: "Keep what you have with a steady week." },
  { id: "something-else", label: "Something else", description: "Tell us in plain words — we’ll still build a simple week." },
];

export const BODY_CONTEXTS: { id: BodyContextId; label: string }[] = [
  { id: "unspecified", label: "Skip" },
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "nonbinary", label: "Nonbinary" },
  { id: "self-describe", label: "Other" },
];

export const EXPERIENCE: { id: ExperienceId; label: string; description: string }[] = [
  { id: "beginner", label: "Beginner", description: "Newer to structured training — we’ll keep loads moderate and teach positions." },
  { id: "intermediate", label: "Intermediate", description: "You know the main lifts and can add weight over weeks." },
  { id: "advanced", label: "Advanced", description: "You already know your split. We’ll follow your days and stay out of the way." },
];

export const DIETARY: { id: DietaryId; label: string }[] = [
  { id: "none", label: "No restrictions" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "high-protein", label: "High protein" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "nut-free", label: "Nut-free" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
];

export const DAYS_OPTIONS = [2, 3, 4, 5, 6, 7] as const;

export const BUDGETS: { id: BudgetId; label: string; description: string }[] = [
  {
    id: "tight",
    label: "Tight",
    description: "Stretch the dollar — beans, eggs, frozen veg, rice, cheaper cuts",
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Mix of staples and a few nicer proteins or fresh produce",
  },
  {
    id: "flexible",
    label: "Flexible",
    description: "Room for salmon, berries, and convenience items when they help",
  },
];

export const STRENGTH_LIFTS: {
  id: StrengthLiftId;
  label: string;
  hint: string;
}[] = [
  { id: "squat", label: "Squat", hint: "Bar on your back or goblet squat" },
  { id: "bench", label: "Bench press", hint: "Lie-down press" },
  { id: "deadlift", label: "Deadlift", hint: "Pick a bar up from the floor" },
  { id: "ohp", label: "Overhead press", hint: "Press a bar or dumbbells overhead" },
  { id: "trap-bar", label: "Trap-bar deadlift", hint: "Hex bar — often easier on the back" },
];

export const EQUIPMENT_OPTIONS: { id: EquipmentId; label: string; group: string }[] = [
  { id: "bodyweight", label: "Bodyweight only", group: "Basics" },
  { id: "dumbbells", label: "Dumbbells", group: "Free weights" },
  { id: "kettlebell", label: "Kettlebell", group: "Free weights" },
  { id: "barbell", label: "Barbell + rack", group: "Free weights" },
  { id: "bands", label: "Resistance bands", group: "Accessories" },
  { id: "pull-up-bar", label: "Pull-up bar", group: "Accessories" },
  { id: "bike", label: "Bike / assault bike", group: "Cardio" },
  { id: "rower", label: "Rower", group: "Cardio" },
  { id: "sled", label: "Sled / prowler", group: "Specialty" },
  { id: "full-gym", label: "Full gym", group: "Facility" },
];

export const FOOD_STAPLES: { id: FoodStapleId; label: string; group: string }[] = [
  { id: "chicken", label: "Chicken", group: "Protein" },
  { id: "fish", label: "Fish", group: "Protein" },
  { id: "eggs", label: "Eggs", group: "Protein" },
  { id: "greek-yogurt", label: "Greek yogurt", group: "Protein" },
  { id: "tofu", label: "Tofu / tempeh", group: "Protein" },
  { id: "lentils", label: "Lentils", group: "Protein" },
  { id: "beans", label: "Beans", group: "Protein" },
  { id: "whey", label: "Protein powder", group: "Protein" },
  { id: "rice", label: "Rice", group: "Carbs" },
  { id: "oats", label: "Oats", group: "Carbs" },
  { id: "potatoes", label: "Potatoes", group: "Carbs" },
  { id: "bread", label: "Bread", group: "Carbs" },
  { id: "quinoa", label: "Quinoa", group: "Carbs" },
  { id: "pasta", label: "Pasta", group: "Carbs" },
  { id: "berries", label: "Berries", group: "Produce" },
  { id: "bananas", label: "Bananas", group: "Produce" },
  { id: "leafy-greens", label: "Leafy greens", group: "Produce" },
  { id: "broccoli", label: "Broccoli / crucifers", group: "Produce" },
  { id: "avocado", label: "Avocado", group: "Fats" },
  { id: "olive-oil", label: "Olive oil", group: "Fats" },
  { id: "nut-butter", label: "Nut butter", group: "Fats" },
  { id: "nuts", label: "Nuts", group: "Fats" },
  { id: "milk", label: "Milk / alt milk", group: "Dairy" },
  { id: "cheese", label: "Cheese", group: "Dairy" },
];

export const LOCATION_MODES: {
  id: TrainingLocationMode;
  label: string;
  description: string;
}[] = [
  {
    id: "home",
    label: "Home",
    description: "Workouts match the gear you pick next",
  },
  {
    id: "commercial-gym",
    label: "Gym",
    description: "Full gym — machines, racks, and cables are fair game",
  },
  {
    id: "outdoor",
    label: "Outdoor / park",
    description: "Running, bodyweight, and park-style sessions — optional GPS from this device",
  },
  {
    id: "travel-hotel",
    label: "Travel / hotel",
    description: "Short sessions you can do with almost nothing",
  },
];

export const DEFAULT_EQUIPMENT: EquipmentId[] = ["bodyweight", "dumbbells"];
export const DEFAULT_FOOD: FoodStapleId[] = [
  "eggs",
  "chicken",
  "rice",
  "oats",
  "leafy-greens",
  "bananas",
  "olive-oil",
];

export function labelSport(id: SportId): string {
  return SPORTS.find((s) => s.id === id)?.label ?? id;
}

export function labelGoal(id: GoalId): string {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}

export function labelExperience(id: ExperienceId): string {
  return EXPERIENCE.find((e) => e.id === id)?.label ?? id;
}

export function labelDietary(id: DietaryId): string {
  return DIETARY.find((d) => d.id === id)?.label ?? id;
}

export function labelBudget(id: BudgetId): string {
  return BUDGETS.find((b) => b.id === id)?.label ?? id;
}

export function labelLift(id: StrengthLiftId): string {
  return STRENGTH_LIFTS.find((l) => l.id === id)?.label ?? id;
}

export function labelLocation(id: TrainingLocationMode): string {
  return LOCATION_MODES.find((m) => m.id === id)?.label ?? id;
}

export function filterSports(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return SPORTS;
  return SPORTS.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.id.includes(q) ||
      s.keywords.includes(q) ||
      SPORT_GROUPS.find((g) => g.id === s.group)?.label.toLowerCase().includes(q),
  );
}
