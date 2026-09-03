export type SportGroupId =
  | "strength-physique"
  | "endurance"
  | "hybrid-combat"
  | "field-court"
  | "mobility-other";

export type SportId =
  // Strength / physique
  | "strongman"
  | "bodybuilding"
  | "powerlifting"
  | "general-strength"
  | "crossfit"
  // Endurance
  | "running"
  | "cycling"
  | "swimming"
  | "triathlon"
  // Hybrid / combat
  | "hyrox"
  | "combat"
  | "wrestling"
  // Field / court
  | "football"
  | "basketball"
  | "soccer"
  | "baseball"
  | "tennis"
  | "badminton"
  | "volleyball"
  | "golf"
  // Mobility / other
  | "yoga"
  | "general-athleticism"
  | "pilates";

export type GoalId = "lose-fat" | "build-muscle" | "performance" | "maintain";

export type ExperienceId = "beginner" | "intermediate" | "advanced";

export type DietaryId = "none" | "vegetarian" | "high-protein" | "gluten-free";

export type BudgetId = "tight" | "moderate" | "flexible";

export type WeightUnit = "lb" | "kg";

export type StrengthTrackMode = "estimated-single" | "five-rep";

export type StrengthLiftId = "squat" | "bench" | "deadlift" | "ohp" | "trap-bar";

export type WeightGoal = {
  current?: number;
  target?: number;
  start?: number;
  unit: WeightUnit;
};

export type StrengthGoal = {
  liftId: StrengthLiftId;
  current?: number;
  target?: number;
  unit: WeightUnit;
  mode: StrengthTrackMode;
};

export type ChallengeGoal = {
  id: string;
  name: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: string;
};

export type MeasurableGoals = {
  weight?: WeightGoal;
  lifts: StrengthGoal[];
  challenges: ChallengeGoal[];
  updatedAt: string;
};

export type ProType = "trainer" | "nutritionist";

export type MovementCategory =
  | "squat"
  | "hinge"
  | "push"
  | "pull"
  | "carry"
  | "run"
  | "mobility"
  | "meal-prep"
  | "conditioning"
  | "core"
  | "power"
  | "warm-up";

export type EquipmentId =
  | "bodyweight"
  | "dumbbells"
  | "kettlebell"
  | "barbell"
  | "bands"
  | "pull-up-bar"
  | "bike"
  | "rower"
  | "sled"
  | "full-gym";

export type FoodStapleId =
  | "chicken"
  | "fish"
  | "eggs"
  | "greek-yogurt"
  | "tofu"
  | "lentils"
  | "beans"
  | "whey"
  | "rice"
  | "oats"
  | "potatoes"
  | "bread"
  | "quinoa"
  | "pasta"
  | "berries"
  | "bananas"
  | "leafy-greens"
  | "broccoli"
  | "avocado"
  | "olive-oil"
  | "nut-butter"
  | "nuts"
  | "milk"
  | "cheese";

export type TrainingLocationMode = "home" | "commercial-gym" | "outdoor" | "travel-hotel";

export type SavedPlace = {
  label: string;
  lat?: number;
  lng?: number;
};

export type UserProfile = {
  sport: SportId;
  goal: GoalId;
  experience: ExperienceId;
  daysPerWeek: 3 | 4 | 5 | 6;
  dietary: DietaryId;
  budget: BudgetId;
  displayName: string;
  onboardedAt: string;
  /** Declared home/travel gear — commercial gym mode unlocks full template. */
  equipment: EquipmentId[];
  /** Pantry/fridge staples the user already has. */
  foodInventory: FoodStapleId[];
  locationMode: TrainingLocationMode;
  savedPlace?: SavedPlace;
};

export type WorkoutBlock = {
  id: string;
  name: string;
  detail: string;
  durationMin?: number;
  coachingCues?: string[];
  /** Plain-language effort line, e.g. "Effort 7/10 — about 2–3 reps left". */
  rpe?: string;
  setsReps?: string;
  restSec?: number;
  videoUrl: string;
  videoTitle?: string;
  movementCategory: MovementCategory;
  coachInsight?: string;
  /** Illustrated / step-list form cues (shown even if video fails). */
  cueSteps?: string[];
};

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export type DayWorkout = {
  label: string;
  isRest: boolean;
  focus: string;
  phaseLabel?: string;
  whyThisDay?: string;
  progressionNote?: string;
  fuelingTip?: string;
  coachInsight?: string;
  blocks: WorkoutBlock[];
};

export type MealItem = {
  id: string;
  name: string;
  items: string[];
  prepNote?: string;
  fuelingTip?: string;
  videoUrl: string;
  videoTitle?: string;
  coachInsight?: string;
  cueSteps?: string[];
};

export type DayMeals = {
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snack?: MealItem;
};

export type WeekDay = {
  dayIndex: number;
  dayName: string;
  workout: DayWorkout;
  meals: DayMeals;
};

export type WeekPlan = {
  id: string;
  generatedAt: string;
  /** Bump with app version so existing devices pick up copy/video upgrades. */
  engineVersion?: string;
  profile: UserProfile;
  days: WeekDay[];
  grocery: GroceryItem[];
  scienceNotes?: string[];
};

export type GroceryKind = "need" | "swap" | "extra" | "have";

export type GroceryItem = {
  id: string;
  name: string;
  category: "produce" | "protein" | "dairy" | "pantry" | "other";
  quantity?: string;
  note?: string;
  kind?: GroceryKind;
  swapFor?: string;
};

export type IntroRequest = {
  id: string;
  proId: string;
  proName: string;
  proType: ProType;
  athleteName: string;
  athleteEmail: string;
  note: string;
  createdAt: string;
  status: "pending";
};

export type ProListing = {
  id: string;
  name: string;
  type: ProType;
  location: string;
  specialties: string[];
  bio: string;
};
