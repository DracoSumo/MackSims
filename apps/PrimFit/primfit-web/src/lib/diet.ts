import type { DietaryId, UserProfile } from "@/data/types";
import { DIETARY, labelDietary } from "@/data/options";

export function dietFlags(profile: Pick<UserProfile, "dietary" | "dietaryFlags">): DietaryId[] {
  const raw = profile.dietaryFlags?.length
    ? profile.dietaryFlags
    : profile.dietary && profile.dietary !== "none"
      ? [profile.dietary]
      : [];
  return raw.filter((id): id is DietaryId => Boolean(id) && id !== "none");
}

export function hasDiet(profile: Pick<UserProfile, "dietary" | "dietaryFlags">, id: DietaryId): boolean {
  return dietFlags(profile).includes(id);
}

export function primaryDietary(flags: DietaryId[]): DietaryId {
  return flags[0] ?? "none";
}

export function dietSummary(profile: Pick<UserProfile, "dietary" | "dietaryFlags">): string {
  const flags = dietFlags(profile);
  if (!flags.length) return labelDietary("none");
  return flags.map((id) => DIETARY.find((d) => d.id === id)?.label ?? id).join(" · ");
}

export function catalogFitsDiet(
  item: { id: string; name: string; category: string; vegetarianOk: boolean; glutenFreeOk: boolean },
  profile: Pick<UserProfile, "dietary" | "dietaryFlags">,
): boolean {
  const flags = dietFlags(profile);
  const vegLike = flags.includes("vegetarian") || flags.includes("vegan");
  const fishIds = new Set(["fish", "canned-tuna", "canned-salmon"]);
  if (vegLike && !item.vegetarianOk) return false;
  if (flags.includes("pescatarian") && !item.vegetarianOk && !fishIds.has(item.id)) return false;
  if (flags.includes("gluten-free") && !item.glutenFreeOk) return false;
  if ((flags.includes("vegan") || flags.includes("dairy-free")) && item.category === "dairy") return false;
  if (flags.includes("vegan") && item.id === "whey") return false;
  if (flags.includes("nut-free") && (item.id === "nuts" || item.id === "peanut-butter")) return false;
  return true;
}

export function mealTextFitsDiet(
  meal: { name: string; items: string[]; vegetarianOk: boolean; glutenFreeOk: boolean },
  profile: Pick<UserProfile, "dietary" | "dietaryFlags">,
): boolean {
  const flags = dietFlags(profile);
  const blob = `${meal.name} ${meal.items.join(" ")}`.toLowerCase();
  if ((flags.includes("vegetarian") || flags.includes("vegan")) && !meal.vegetarianOk) return false;
  if (flags.includes("pescatarian") && !meal.vegetarianOk && !/fish|tuna|salmon|shrimp/.test(blob)) return false;
  if (flags.includes("gluten-free") && !meal.glutenFreeOk) return false;
  if ((flags.includes("vegan") || flags.includes("dairy-free")) && /yogurt|milk|cheese|whey|cottage|butter/.test(blob))
    return false;
  if (flags.includes("nut-free") && /peanut|almond|cashew|nut butter|nuts/.test(blob)) return false;
  return true;
}
