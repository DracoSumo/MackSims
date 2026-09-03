import type {
  BudgetId,
  FoodStapleId,
  GroceryItem,
  UserProfile,
  WeekDay,
} from "@/data/types";
import { GROCERY_CATALOG, budgetAllows } from "@/data/groceryCatalog";
import { carbEmphasis, proteinTargetGPerKg } from "@/lib/prescriptions";
import { nutritionCoachInsight } from "@/data/coachInfluences";

const STAPLE_TO_CATALOG: Partial<Record<FoodStapleId, string>> = {
  chicken: "chicken-thighs",
  fish: "fish",
  eggs: "eggs",
  "greek-yogurt": "greek-yogurt",
  tofu: "tofu",
  lentils: "lentils",
  beans: "dry-beans",
  whey: "whey",
  rice: "rice",
  oats: "oats",
  potatoes: "potatoes",
  bread: "bread",
  quinoa: "quinoa",
  pasta: "pasta",
  berries: "frozen-berries",
  bananas: "bananas",
  "leafy-greens": "leafy-greens",
  broccoli: "broccoli",
  avocado: "avocado",
  "olive-oil": "olive-oil",
  "nut-butter": "peanut-butter",
  nuts: "nuts",
  milk: "milk",
  cheese: "cheese",
};

function fitsDiet(item: { vegetarianOk: boolean; glutenFreeOk: boolean }, profile: UserProfile): boolean {
  if (profile.dietary === "vegetarian" && !item.vegetarianOk) return false;
  if (profile.dietary === "gluten-free" && !item.glutenFreeOk) return false;
  return true;
}

function inventoryCatalogIds(profile: UserProfile): Set<string> {
  const ids = new Set<string>();
  for (const staple of profile.foodInventory ?? []) {
    const mapped = STAPLE_TO_CATALOG[staple];
    if (mapped) ids.add(mapped);
    ids.add(staple);
  }
  return ids;
}

function toGrocery(
  item: (typeof GROCERY_CATALOG)[number],
  kind: GroceryItem["kind"],
  extraNote?: string,
): GroceryItem {
  return {
    id: `g-${item.id}-${kind}`,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    kind,
    swapFor: item.swapFor,
    note: extraNote ?? item.note,
  };
}

function hardDayCount(days: WeekDay[]): number {
  return days.filter((d) => !d.workout.isRest && !/easy|mobility|restorative/i.test(d.workout.focus)).length;
}

export function buildGroceryList(profile: UserProfile, days: WeekDay[]): GroceryItem[] {
  const budget: BudgetId = profile.budget ?? "moderate";
  const have = inventoryCatalogIds(profile);
  const veg = profile.dietary === "vegetarian";
  const hardDays = hardDayCount(days);
  const proteinCue = proteinTargetGPerKg(profile.goal);
  const items: GroceryItem[] = [];
  const seen = new Set<string>();

  const push = (row: GroceryItem) => {
    const key = row.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push(row);
  };

  for (const food of GROCERY_CATALOG) {
    if (!fitsDiet(food, profile) || !budgetAllows(food, budget)) continue;
    if (have.has(food.id)) {
      push(toGrocery(food, "have", "Already in your pantry — skip unless you’re out."));
      continue;
    }
    if (food.tags.includes("staple") || food.tags.includes("cheap-swap")) {
      const kind: GroceryItem["kind"] = food.swapFor && budget === "tight" ? "swap" : "need";
      push(toGrocery(food, kind));
    }
  }

  for (const food of GROCERY_CATALOG) {
    if (!fitsDiet(food, profile) || !budgetAllows(food, budget)) continue;
    if (have.has(food.id) || seen.has(food.name.toLowerCase())) continue;

    const wantProtein =
      food.tags.includes("protein-spread") &&
      (profile.goal === "build-muscle" || profile.dietary === "high-protein" || profile.goal === "lose-fat");
    const wantProduce = food.tags.includes("produce-habit");
    const wantCarbs = food.tags.includes("hard-day-carb") && hardDays >= 2;

    if (wantProtein) {
      push(
        toGrocery(
          food,
          "extra",
          `Suggested extra: spread protein (~${proteinCue.min}–${proteinCue.max} g/kg/day, 20–40 g meals). Not medical advice.`,
        ),
      );
    } else if (wantProduce) {
      push(toGrocery(food, "extra", "Suggested extra: a produce habit most days (coach-style plate skills)."));
    } else if (wantCarbs) {
      push(
        toGrocery(
          food,
          "extra",
          `${carbEmphasis(profile.goal, true)} You have about ${hardDays} harder sessions this week.`,
        ),
      );
    }
  }

  if (veg) {
    items.forEach((it) => {
      if (it.kind === "need" && /chicken|tuna|turkey|beef|fish|salmon/i.test(it.name)) {
        it.note = "Skipped for vegetarian plans — beans, eggs, tofu, and yogurt cover protein.";
      }
    });
  }

  const order: GroceryItem["kind"][] = ["need", "swap", "extra", "have"];
  items.sort((a, b) => order.indexOf(a.kind ?? "need") - order.indexOf(b.kind ?? "need"));
  return items;
}

export type BuiltMeal = {
  name: string;
  items: string[];
  note: string;
};

export function mealsFromInventory(profile: UserProfile): BuiltMeal[] {
  const inv = new Set(profile.foodInventory ?? []);
  const veg = profile.dietary === "vegetarian";
  const gf = profile.dietary === "gluten-free";
  const budget = profile.budget ?? "moderate";

  const protein = veg
    ? (["eggs", "tofu", "lentils", "beans", "greek-yogurt", "whey"] as FoodStapleId[]).filter((id) => inv.has(id))
    : (["chicken", "eggs", "fish", "greek-yogurt", "whey", "tofu"] as FoodStapleId[]).filter((id) => inv.has(id));
  const carbs = (["rice", "potatoes", "oats", "pasta", "bread", "quinoa"] as FoodStapleId[]).filter((id) => {
    if (!inv.has(id)) return false;
    if (gf && (id === "pasta" || id === "bread")) return false;
    return true;
  });
  const produce = (["leafy-greens", "broccoli", "bananas", "berries"] as FoodStapleId[]).filter((id) => inv.has(id));
  const fats = (["olive-oil", "avocado", "nut-butter", "nuts"] as FoodStapleId[]).filter((id) => inv.has(id));

  const label = (id: string) => id.replace(/-/g, " ");
  const p = protein[0] ? label(protein[0]) : veg ? "tofu or beans (add on grocery)" : "eggs or chicken thighs (add on grocery)";
  const c = carbs[0] ? label(carbs[0]) : gf ? "rice or potatoes (add on grocery)" : "rice or oats (add on grocery)";
  const v = produce[0] ? label(produce[0]) : "frozen mixed vegetables (add on grocery)";
  const f = fats[0] ? label(fats[0]) : budget === "tight" ? "peanut butter or oil (add on grocery)" : "olive oil";

  return [
    {
      name: "Pantry plate",
      items: [p, c, v, f],
      note: `${nutritionCoachInsight(false)} Cook with what you have, then fill gaps from grocery.`,
    },
    {
      name: "Protein-forward bowl",
      items: [protein[1] ? label(protein[1]) : p, produce[1] ? label(produce[1]) : v, "optional leftover carbs"],
      note: "Palm of protein, produce, then carbs around training. Not medical advice.",
    },
    {
      name: hardDayTitle(profile),
      items: [p, carbs[1] ? label(carbs[1]) : c, v],
      note: carbEmphasis(profile.goal, true),
    },
  ];
}

function hardDayTitle(profile: UserProfile): string {
  if (profile.goal === "lose-fat") return "Training-day plate (protein high, carbs near the session)";
  if (profile.goal === "performance") return "Hard-day fuel plate";
  return "Bigger-carb training plate";
}

export function groceryScienceBlurb(profile: UserProfile, days: WeekDay[]): string {
  const hardDays = hardDayCount(days);
  const band = proteinTargetGPerKg(profile.goal);
  return `Bigger on purpose: staples for new meals, cheaper swaps on a ${profile.budget ?? "moderate"} budget, extras for protein (~${band.min}–${band.max} g per kg a day) and carbs on about ${hardDays} harder days. Not medical advice.`;
}
