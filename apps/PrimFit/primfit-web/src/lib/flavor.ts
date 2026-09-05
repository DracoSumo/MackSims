import type { MovementCategory } from "@/data/types";
import { themeCopy, type ThemeId } from "@/lib/themes";

export type PlayClass = {
  id: string;
  label: string;
  blurb: string;
};

export function playClasses(theme: ThemeId): PlayClass[] {
  if (theme === "hunter") {
    return [
      { id: "assassin", label: "Assassin", blurb: "Fast sessions. Precision over grind." },
      { id: "fighter", label: "Fighter", blurb: "Heavy strength. Hold the line." },
      { id: "mage", label: "Mage", blurb: "Long focus. Control the room." },
      { id: "tank", label: "Tank", blurb: "Carry, brace, recover like armor." },
    ];
  }
  if (theme === "dnd") {
    return [
      { id: "warrior", label: "Warrior", blurb: "Front-line strength and grit." },
      { id: "ranger", label: "Ranger", blurb: "Miles, lungs, and outdoor work." },
      { id: "rogue", label: "Rogue", blurb: "Short bursts. Quiet, sharp sets." },
      { id: "cleric", label: "Cleric", blurb: "Recovery, meals, and keeping the party up." },
    ];
  }
  if (theme === "ki") {
    return [
      { id: "striker", label: "Striker", blurb: "Explosives and fight-style work." },
      { id: "anchor", label: "Anchor", blurb: "Heavy gravity. Slow, ugly strength." },
      { id: "flash", label: "Flash", blurb: "Speed, intervals, no wasted rest." },
      { id: "keeper", label: "Keeper", blurb: "Fuel, calm, and staying in the fight." },
    ];
  }
  if (theme === "anime") {
    return [
      { id: "lead", label: "Lead", blurb: "Main-character volume. Show up." },
      { id: "rival", label: "Rival", blurb: "Chase the number. Extra set energy." },
      { id: "mentor", label: "Mentor", blurb: "Cues, form, teach-the-body days." },
      { id: "wildcard", label: "Wildcard", blurb: "Swap freely. Keep it interesting." },
    ];
  }
  return [
    { id: "athlete", label: "Athlete", blurb: "Straight training. No costume required." },
  ];
}

const CATEGORY_FLAVOR: Record<ThemeId, Partial<Record<MovementCategory, string>>> = {
  sleek: {},
  hunter: {
    squat: "Lower-body protocol",
    hinge: "Posterior protocol",
    push: "Press protocol",
    pull: "Pull protocol",
    carry: "Load protocol",
    run: "Cardio protocol",
    mobility: "Mobility protocol",
    "meal-prep": "Fuel protocol",
    conditioning: "Endurance protocol",
    core: "Core protocol",
    power: "Explosive protocol",
    "warm-up": "Activation protocol",
  },
  dnd: {
    squat: "Leg siege",
    hinge: "Ground lift",
    push: "Tower press",
    pull: "Draw the gate",
    carry: "Supply haul",
    run: "Forced march",
    mobility: "Temple stretch",
    "meal-prep": "Ration craft",
    conditioning: "Dungeon circuit",
    core: "Shield brace",
    power: "Warhammer burst",
    "warm-up": "Session zero",
  },
  ki: {
    squat: "Gravity squat",
    hinge: "Earth pull",
    push: "Ki press",
    pull: "Draw-in",
    carry: "Weighted walk",
    run: "Burst run",
    mobility: "Flow restore",
    "meal-prep": "Charge meal",
    conditioning: "Chamber circuit",
    core: "Center hold",
    power: "Spark strike",
    "warm-up": "Warm the core",
  },
  anime: {
    squat: "Arc squat",
    hinge: "Rival pull",
    push: "Clash press",
    pull: "Comeback row",
    carry: "Carry the team",
    run: "Chase scene",
    mobility: "Cool-down beat",
    "meal-prep": "Power lunch",
    conditioning: "Filler-arc grind",
    core: "Hero brace",
    power: "Finale burst",
    "warm-up": "Opening theme",
  },
};

export function flavorBlockName(theme: ThemeId, name: string, category: MovementCategory): string {
  const overlay = CATEGORY_FLAVOR[theme][category];
  if (!overlay || theme === "sleek") return name;
  return overlay;
}

export function flavorMealSlot(theme: ThemeId, slot: string): string {
  if (theme === "hunter") {
    if (slot === "breakfast") return "AM fuel";
    if (slot === "lunch") return "Mid fuel";
    if (slot === "dinner") return "PM fuel";
    return "Snack protocol";
  }
  if (theme === "dnd") {
    if (slot === "breakfast") return "Dawn rations";
    if (slot === "lunch") return "Trail lunch";
    if (slot === "dinner") return "Camp supper";
    return "Trail bite";
  }
  if (theme === "ki") {
    if (slot === "breakfast") return "Charge breakfast";
    if (slot === "lunch") return "Midday fuel";
    if (slot === "dinner") return "Recovery dinner";
    return "Spark snack";
  }
  if (theme === "anime") {
    if (slot === "breakfast") return "Episode 1 meal";
    if (slot === "lunch") return "Mid-arc meal";
    if (slot === "dinner") return "End-card dinner";
    return "Eyecatch snack";
  }
  return slot;
}

export function flavorGreeting(theme: ThemeId, name: string): string {
  const h = new Date().getHours();
  if (theme === "hunter") {
    if (h < 10) return `System ping, ${name}. AM window is live. Claim it.`;
    if (h < 17) return `${name} — mid-window. The gate does not stay open.`;
    if (h < 21) return `Night instance, ${name}. Close the quest before it despawns.`;
    return `Last minutes, ${name}. Midnight wipes the unclaimed log.`;
  }
  if (theme === "dnd") {
    if (h < 10) return `First light, ${name}. The party is already rolling.`;
    if (h < 17) return `High sun, ${name}. Empty chairs don’t get loot.`;
    if (h < 21) return `Hearth hour, ${name}. Finish the page or lose the night.`;
    return `Last call, ${name}. The innkeeper is stacking chairs.`;
  }
  if (theme === "ki") {
    if (h < 10) return `Dawn charge, ${name}. Hit it before they do.`;
    if (h < 17) return `Keep the fire, ${name}. Cold meters don’t scare anyone.`;
    if (h < 21) return `Night chamber, ${name}. Bank it or leak it.`;
    return `Charge leaking, ${name}. Midnight resets the spark.`;
  }
  if (theme === "anime") {
    if (h < 10) return `New episode, ${name}. Don’t miss the opening.`;
    if (h < 17) return `Mid-arc, ${name}. Your rival already dropped a scene.`;
    if (h < 21) return `End card soon, ${name}. Log the fight.`;
    return `Credits rolling, ${name}. This airing doesn’t repeat.`;
  }
  if (h < 10) return `Morning, ${name}. The day already started without you.`;
  if (h < 17) return `${name} — still time. Not infinite time.`;
  if (h < 21) return `Evening, ${name}. Close it out.`;
  return `Late, ${name}. Midnight still counts this as a miss.`;
}

export function flavorSessionTitle(theme: ThemeId, isRest: boolean): string {
  if (isRest) {
    if (theme === "hunter") return "Recovery window";
    if (theme === "dnd") return "Downtime";
    if (theme === "ki") return "Calm chamber";
    if (theme === "anime") return "Recap episode";
    return "Recovery";
  }
  if (theme === "hunter") return "Assigned training";
  if (theme === "dnd") return "Today’s encounters";
  if (theme === "ki") return "Power session";
  if (theme === "anime") return "Today’s beats";
  return "Today’s session";
}

export function flavorMealsTitle(theme: ThemeId): string {
  if (theme === "hunter") return "Fuel protocols";
  if (theme === "dnd") return "Rations";
  if (theme === "ki") return "Charge meals";
  if (theme === "anime") return "Fuel scenes";
  return "Meals";
}

export function dailyMission(theme: ThemeId, focus: string, isRest: boolean): string {
  if (isRest) {
    if (theme === "hunter") return "Recovery window still counts as showing up. Claim the day. Don’t force work.";
    if (theme === "dnd") return "Downtime is still a session in the book. Stretch, eat, stay at the table.";
    if (theme === "ki") return "Bank the energy. Light flow. Missing the claim still resets the chain.";
    if (theme === "anime") return "Recap episode. Recover. Skipping it still skips the streak.";
    return "Rest day — keep it easy, but check in so the chain lives.";
  }
  if (theme === "hunter") return `Urgent quest: clear “${focus}”. Reward drops until midnight. Then it’s gone.`;
  if (theme === "dnd") return `Today’s dungeon: “${focus}”. Leave it half-mapped and the loot despawns.`;
  if (theme === "ki") return `Today’s fight: ${focus}. Raise the meter or watch it leak.`;
  if (theme === "anime") return `This episode’s fight: ${focus}. Skip it and you’re filler.`;
  return `Today’s focus: ${focus}. Log it before the day dies.`;
}

export function flavorCompleteBanner(theme: ThemeId): string {
  if (theme === "hunter") return "Daily quest complete. You were here. They’ll see the log.";
  if (theme === "dnd") return "Session in the book. Long rest earned. Empty chairs don’t.";
  if (theme === "ki") return "Meter stacked. Anyone who skipped is still Spark.";
  if (theme === "anime") return "Episode clear. Your rival has to catch this one.";
  return "Day closed. The ones who ghosted don’t get this.";
}

export function flavorProgressLabel(theme: ThemeId, complete: boolean, done: number, total: number): string {
  if (complete) {
    if (theme === "hunter") return "Quest cleared";
    if (theme === "dnd") return "Encounters done";
    if (theme === "ki") return "Meter maxed";
    if (theme === "anime") return "Arc beat done";
    return "Today is done";
  }
  if (theme === "hunter") return `${done} / ${total} protocols`;
  if (theme === "dnd") return `${done} of ${total} checked`;
  if (theme === "ki") return `Power ${done}/${total}`;
  if (theme === "anime") return `${done} of ${total} beats`;
  return `${done} of ${total} checked`;
}

export function flavorProgressHint(theme: ThemeId, complete: boolean, isRest = false): string {
  if (complete) {
    if (theme === "hunter") return "Log closed. Eat. Sleep. Rank holds.";
    if (theme === "dnd") return "Hit a long rest. Tomorrow’s map is already drawn.";
    if (theme === "ki") return "Let the charge settle. Don’t dump it.";
    if (theme === "anime") return "End card. Recover before the next fight.";
    return "Nice work — recover and eat.";
  }
  if (isRest) {
    if (theme === "hunter") return "Optional protocol. Fuel still grants XP.";
    if (theme === "dnd") return "Downtime. Rations still count.";
    if (theme === "ki") return "Keep it light. Meals still bank charge.";
    if (theme === "anime") return "Recap day. Food scenes still count.";
    return "Rest day — keep it easy, still log meals.";
  }
  if (theme === "hunter") return "Clear training first. Fuel is optional XP.";
  if (theme === "dnd") return "Encounters first, then rations.";
  if (theme === "ki") return "Training raises the meter. Meals keep it.";
  if (theme === "anime") return "Fight scenes first, then food scenes.";
  return "Session first, then meals.";
}

export function restIdleLabel(theme: ThemeId, clock: string): string {
  if (theme === "hunter") return `Cooldown ${clock}`;
  if (theme === "dnd") return `Short rest ${clock}`;
  if (theme === "ki") return `Charge ${clock}`;
  if (theme === "anime") return `Eyecatch ${clock}`;
  return `Rest ${clock}`;
}

export function restRunningHint(theme: ThemeId, done: boolean): string {
  if (done) {
    if (theme === "hunter") return "Cooldown complete — next protocol.";
    if (theme === "dnd") return "Short rest done. Roll into the next set.";
    if (theme === "ki") return "Charge ready. Hit it.";
    if (theme === "anime") return "Back from break. Next beat.";
    return "Rest done — next set. Screen can sleep again.";
  }
  if (theme === "hunter") return "Cooldown · screen stays awake";
  if (theme === "dnd") return "Short rest · stay at the table";
  if (theme === "ki") return "Hold the charge · screen stays on";
  if (theme === "anime") return "Commercial break · screen stays on";
  return "Rest · screen stays awake";
}

export function restDoneTitle(theme: ThemeId): string {
  if (theme === "hunter") return "GO";
  if (theme === "dnd") return "Roll";
  if (theme === "ki") return "Burst";
  if (theme === "anime") return "Go";
  return "Go";
}

export function flavorSwapTitle(theme: ThemeId, kind: "exercise" | "meal"): string {
  if (kind === "meal") {
    if (theme === "hunter") return "Swap fuel";
    if (theme === "dnd") return "Swap rations";
    if (theme === "ki") return "Swap charge meal";
    if (theme === "anime") return "Swap food scene";
    return "Swap meal";
  }
  if (theme === "hunter") return "Swap protocol";
  if (theme === "dnd") return "Rewrite encounter";
  if (theme === "ki") return "Swap drill";
  if (theme === "anime") return "Rewrite beat";
  return "Swap exercise";
}

export function flavorRankUpLabel(theme: ThemeId): string {
  if (theme === "hunter") return "Rank up";
  if (theme === "dnd") return "Level up";
  if (theme === "ki") return "Power surge";
  if (theme === "anime") return "Power-up";
  return "Rank up";
}

export function worldBadge(theme: ThemeId): string {
  return themeCopy(theme).worldTag;
}
