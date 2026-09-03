import type { BudgetId, GroceryItem } from "./types";

export type CatalogFood = {
  id: string;
  name: string;
  category: GroceryItem["category"];
  /** Lowest budget this item is suggested at. */
  minBudget: BudgetId;
  vegetarianOk: boolean;
  glutenFreeOk: boolean;
  quantity?: string;
  note?: string;
  /** If this is a cheaper stand-in, what it replaces. */
  swapFor?: string;
  tags: Array<"protein-spread" | "produce-habit" | "hard-day-carb" | "cheap-swap" | "staple">;
};

const RANK: Record<BudgetId, number> = { tight: 0, moderate: 1, flexible: 2 };

export const GROCERY_CATALOG: CatalogFood[] = [
  // Protein — cheap first
  { id: "eggs", name: "Eggs", category: "protein", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1–2 dozen", note: "Cheap complete protein for any meal", tags: ["protein-spread", "staple", "cheap-swap"] },
  { id: "dry-beans", name: "Dry or canned beans", category: "protein", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "4 cans or 1 lb dry", note: "Budget protein + fiber", swapFor: "pricey meat cuts", tags: ["protein-spread", "cheap-swap", "staple"] },
  { id: "lentils", name: "Lentils", category: "protein", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 lb dry", note: "Cooks fast; protein + carbs", swapFor: "ground meat", tags: ["protein-spread", "cheap-swap"] },
  { id: "chickpeas", name: "Canned chickpeas", category: "protein", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "3 cans", swapFor: "deli meat", tags: ["cheap-swap"] },
  { id: "canned-tuna", name: "Canned tuna", category: "protein", minBudget: "tight", vegetarianOk: false, glutenFreeOk: true, quantity: "4–6 cans", note: "Shelf-stable protein", swapFor: "fresh fish", tags: ["protein-spread", "cheap-swap"] },
  { id: "tofu", name: "Tofu or tempeh", category: "protein", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "2 packs", tags: ["protein-spread", "staple"] },
  { id: "chicken-thighs", name: "Chicken thighs", category: "protein", minBudget: "tight", vegetarianOk: false, glutenFreeOk: true, quantity: "2–3 lb", note: "Usually cheaper than breast", swapFor: "chicken breast", tags: ["protein-spread", "cheap-swap", "staple"] },
  { id: "peanut-butter", name: "Peanut butter", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 jar", note: "Protein + fat on oats or bananas", tags: ["protein-spread", "cheap-swap", "staple"] },
  { id: "cottage-cheese", name: "Cottage cheese", category: "dairy", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "16 oz", note: "Easy 20–40 g protein snack", tags: ["protein-spread"] },
  { id: "greek-yogurt", name: "Plain Greek yogurt", category: "dairy", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "32 oz", tags: ["protein-spread", "staple"] },
  { id: "chicken-breast", name: "Chicken breast", category: "protein", minBudget: "moderate", vegetarianOk: false, glutenFreeOk: true, quantity: "2 lb", tags: ["protein-spread"] },
  { id: "turkey", name: "Ground turkey", category: "protein", minBudget: "moderate", vegetarianOk: false, glutenFreeOk: true, quantity: "1–2 lb", tags: ["protein-spread"] },
  { id: "whey", name: "Protein powder", category: "protein", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "1 tub (optional)", note: "Handy when meals are short", tags: ["protein-spread"] },
  { id: "canned-salmon", name: "Canned salmon", category: "protein", minBudget: "moderate", vegetarianOk: false, glutenFreeOk: true, quantity: "2–3 cans", swapFor: "fresh salmon", tags: ["cheap-swap"] },
  { id: "fish", name: "Fresh or frozen fish", category: "protein", minBudget: "flexible", vegetarianOk: false, glutenFreeOk: true, quantity: "1–2 lb", tags: ["protein-spread"] },
  { id: "lean-beef", name: "Lean ground beef", category: "protein", minBudget: "flexible", vegetarianOk: false, glutenFreeOk: true, quantity: "1 lb", tags: [] },

  // Carbs / pantry
  { id: "rice", name: "Rice", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "2–5 lb bag", note: "Cheap carbs for harder training days", swapFor: "quinoa", tags: ["hard-day-carb", "staple", "cheap-swap"] },
  { id: "oats", name: "Oats", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 large canister", note: "Breakfast + snack carbs", tags: ["hard-day-carb", "staple"] },
  { id: "potatoes", name: "Potatoes or sweet potatoes", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "5 lb bag", tags: ["hard-day-carb", "staple", "cheap-swap"] },
  { id: "pasta", name: "Pasta", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: false, quantity: "2 boxes", tags: ["hard-day-carb", "cheap-swap"] },
  { id: "bread", name: "Bread or tortillas", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: false, quantity: "1 loaf or pack", tags: ["hard-day-carb"] },
  { id: "canned-tomatoes", name: "Canned tomatoes", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "3 cans", tags: ["staple"] },
  { id: "quinoa", name: "Quinoa", category: "pantry", minBudget: "flexible", vegetarianOk: true, glutenFreeOk: true, quantity: "1 box", tags: ["hard-day-carb"] },

  // Produce
  { id: "bananas", name: "Bananas", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 bunch", note: "Cheap fruit + easy carbs", tags: ["produce-habit", "hard-day-carb", "staple"] },
  { id: "apples", name: "Apples", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "6–8", tags: ["produce-habit"] },
  { id: "frozen-veg", name: "Frozen mixed vegetables", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "2 bags", note: "Often cheaper than fresh; lasts all week", swapFor: "pre-cut fresh veg", tags: ["produce-habit", "cheap-swap", "staple"] },
  { id: "carrots", name: "Carrots", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 bag", tags: ["produce-habit", "cheap-swap"] },
  { id: "cabbage", name: "Cabbage", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 head", note: "Huge volume for little money", tags: ["produce-habit", "cheap-swap"] },
  { id: "onions", name: "Onions", category: "produce", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "3–4", tags: ["staple"] },
  { id: "frozen-berries", name: "Frozen berries", category: "produce", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "1–2 bags", swapFor: "fresh berries", tags: ["produce-habit", "cheap-swap"] },
  { id: "leafy-greens", name: "Leafy greens (spinach / bagged salad)", category: "produce", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "2 bags", tags: ["produce-habit", "staple"] },
  { id: "broccoli", name: "Broccoli / frozen crucifers", category: "produce", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "2 bags or bunches", tags: ["produce-habit"] },
  { id: "berries", name: "Fresh berries", category: "produce", minBudget: "flexible", vegetarianOk: true, glutenFreeOk: true, quantity: "1–2 pints", tags: ["produce-habit"] },
  { id: "avocado", name: "Avocados", category: "produce", minBudget: "flexible", vegetarianOk: true, glutenFreeOk: true, quantity: "3–4", tags: [] },

  // Fats / dairy / other
  { id: "milk", name: "Milk or fortified alt-milk", category: "dairy", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "½–1 gallon", tags: ["protein-spread", "staple"] },
  { id: "cheese", name: "Cheese", category: "dairy", minBudget: "moderate", vegetarianOk: true, glutenFreeOk: true, quantity: "8 oz", tags: [] },
  { id: "olive-oil", name: "Olive or canola oil", category: "pantry", minBudget: "tight", vegetarianOk: true, glutenFreeOk: true, quantity: "1 bottle", note: "Canola is often the tighter-budget pick", tags: ["staple"] },
  { id: "nuts", name: "Nuts or seeds", category: "pantry", minBudget: "flexible", vegetarianOk: true, glutenFreeOk: true, quantity: "1 bag", tags: [] },
];

export function budgetAllows(item: CatalogFood, budget: BudgetId): boolean {
  return RANK[item.minBudget] <= RANK[budget];
}
