import type {
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
  emoji: string;
  group: SportGroupId;
  keywords: string;
}[] = [
  // Strength / physique
  { id: "strongman", label: "Strongman", emoji: "🪨", group: "strength-physique", keywords: "atlas yoke farmers log" },
  { id: "bodybuilding", label: "Bodybuilding", emoji: "💪", group: "strength-physique", keywords: "physique hypertrophy aesthetic" },
  { id: "powerlifting", label: "Powerlifting", emoji: "🏋️", group: "strength-physique", keywords: "squat bench deadlift 1rm" },
  { id: "general-strength", label: "General strength", emoji: "🔩", group: "strength-physique", keywords: "gym weights strength" },
  { id: "crossfit", label: "CrossFit / functional", emoji: "⚡", group: "strength-physique", keywords: "wod metcon functional fitness" },
  // Endurance
  { id: "running", label: "Running", emoji: "🏃", group: "endurance", keywords: "jog marathon 5k road" },
  { id: "cycling", label: "Cycling", emoji: "🚴", group: "endurance", keywords: "bike road spin zwift" },
  { id: "swimming", label: "Swimming", emoji: "🏊", group: "endurance", keywords: "pool freestyle laps" },
  { id: "triathlon", label: "Triathlon", emoji: "🏅", group: "endurance", keywords: "swim bike run ironman" },
  // Hybrid / combat
  { id: "hyrox", label: "HYROX (run + station race)", emoji: "🔥", group: "hybrid-combat", keywords: "hybrid race stations hyrox" },
  { id: "combat", label: "Boxing / mixed martial arts", emoji: "🥊", group: "hybrid-combat", keywords: "boxing mma kickboxing striking" },
  { id: "wrestling", label: "Wrestling", emoji: "🤼", group: "hybrid-combat", keywords: "grappling folkstyle freestyle" },
  // Field / court
  { id: "football", label: "Football", emoji: "🏈", group: "field-court", keywords: "gridiron nfl" },
  { id: "basketball", label: "Basketball", emoji: "🏀", group: "field-court", keywords: "hoops nba" },
  { id: "soccer", label: "Soccer", emoji: "⚽", group: "field-court", keywords: "football pitch futbol" },
  { id: "baseball", label: "Baseball / softball", emoji: "⚾", group: "field-court", keywords: "softball diamond bat" },
  { id: "tennis", label: "Tennis", emoji: "🎾", group: "field-court", keywords: "racket racquet" },
  { id: "badminton", label: "Badminton", emoji: "🏸", group: "field-court", keywords: "shuttle shuttlecock racket" },
  { id: "volleyball", label: "Volleyball", emoji: "🏐", group: "field-court", keywords: "spike serve beach" },
  { id: "golf", label: "Golf", emoji: "⛳", group: "field-court", keywords: "swing links" },
  // Mobility / other
  { id: "yoga", label: "Yoga / mobility", emoji: "🧘", group: "mobility-other", keywords: "stretch flow breath" },
  { id: "general-athleticism", label: "General athleticism", emoji: "🎯", group: "mobility-other", keywords: "athletic all-around" },
  { id: "pilates", label: "Pilates", emoji: "🩰", group: "mobility-other", keywords: "core reformer control" },
];

export const GOALS: { id: GoalId; label: string; description: string }[] = [
  { id: "lose-fat", label: "Lose fat", description: "Calorie-aware training + balanced plates" },
  { id: "build-muscle", label: "Build muscle", description: "Progressive strength + protein-forward meals" },
  { id: "performance", label: "Performance", description: "Sport-specific work + fuel for output" },
  { id: "maintain", label: "Maintain", description: "Sustainable routine + steady nutrition" },
];

export const EXPERIENCE: { id: ExperienceId; label: string; description: string }[] = [
  { id: "beginner", label: "Beginner", description: "Newer to structured training — we’ll keep loads moderate and teach positions." },
  { id: "intermediate", label: "Intermediate", description: "You know the main lifts and can add weight over weeks." },
  { id: "advanced", label: "Advanced", description: "You recover well from harder sessions and already track progress." },
];

export const DIETARY: { id: DietaryId; label: string }[] = [
  { id: "none", label: "No preference" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "high-protein", label: "High protein" },
  { id: "gluten-free", label: "Gluten-free" },
];

export const DAYS_OPTIONS = [3, 4, 5, 6] as const;

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
