import type { ThemeId } from "@/lib/themes";

export type DailyEvent = {
  id: string;
  title: string;
  body: string;
  bonusKind: "block" | "meal" | "session" | "login" | null;
  bonusXp: number;
};

const RIVALS = ["Vale", "Rook", "Nyx", "Kite", "Ash", "Wren", "Sol"];

export function dateKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseDateKey(key: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function daysBetween(a: string, b: string): number {
  const da = parseDateKey(a);
  const db = parseDateKey(b);
  if (!da || !db) return 0;
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

export function msUntilMidnight(now = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

export function formatWindowClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function hash(input: string): number {
  let n = 2166136261;
  for (let i = 0; i < input.length; i++) {
    n ^= input.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}

function pick<T>(list: T[], seed: string): T {
  return list[hash(seed) % list.length];
}

const EVENTS: Record<ThemeId, DailyEvent[]> = {
  sleek: [
    { id: "clean-1", title: "Quiet grind", body: "No costume. Still counts. Log it before the day dies.", bonusKind: "session", bonusXp: 4 },
    { id: "clean-2", title: "Silver hour", body: "Meals logged today hit a little harder.", bonusKind: "meal", bonusXp: 2 },
    { id: "clean-3", title: "Chrome streak", body: "First check-in of the day is worth extra.", bonusKind: "login", bonusXp: 3 },
    { id: "clean-4", title: "Last set lights", body: "Training checks glow. Don’t ghost them.", bonusKind: "block", bonusXp: 3 },
    { id: "clean-5", title: "Midnight cut", body: "Whatever you skip after 12 is gone. That’s the deal.", bonusKind: null, bonusXp: 0 },
    { id: "clean-6", title: "Captain’s notice", body: "Session clear pays extra today. Show up ugly.", bonusKind: "session", bonusXp: 6 },
    { id: "clean-7", title: "No-excuse window", body: "Short day. Same XP. Window still closes.", bonusKind: "login", bonusXp: 2 },
  ],
  hunter: [
    { id: "h-1", title: "Double-drop window", body: "Fuel protocols grant extra XP until midnight. Miss it, it’s gone.", bonusKind: "meal", bonusXp: 3 },
    { id: "h-2", title: "Gate spike", body: "Assigned training is paying out. Clear protocols while the gate is thin.", bonusKind: "block", bonusXp: 4 },
    { id: "h-3", title: "Emergency quest", body: "Daily claim is boosted. The system noticed you yesterday — or didn’t.", bonusKind: "login", bonusXp: 5 },
    { id: "h-4", title: "Red gate", body: "Session clear is an elite payout. Don’t leave it unclaimed.", bonusKind: "session", bonusXp: 8 },
    { id: "h-5", title: "Shadow harvest", body: "Someone already ran this instance. Your log is still empty.", bonusKind: "block", bonusXp: 2 },
    { id: "h-6", title: "Mana tide", body: "Rest and fuel both count. The window does not extend.", bonusKind: "meal", bonusXp: 2 },
    { id: "h-7", title: "S-notice", body: "Rare drop day. First login is the claim. Everything else is extra.", bonusKind: "login", bonusXp: 6 },
  ],
  dnd: [
    { id: "d-1", title: "Blood moon", body: "Encounters pay extra XP. The dungeon does not wait for a long rest.", bonusKind: "block", bonusXp: 4 },
    { id: "d-2", title: "Festival night", body: "Rations are blessed. Log them before the hearth dies.", bonusKind: "meal", bonusXp: 3 },
    { id: "d-3", title: "Wandering merchant", body: "Session clear is a chest. Leave it unopened and it despawns.", bonusKind: "session", bonusXp: 8 },
    { id: "d-4", title: "Omen at dawn", body: "Daily claim is doubled-feeling. The party already left camp.", bonusKind: "login", bonusXp: 5 },
    { id: "d-5", title: "Dragon overhead", body: "Everyone saw it. Your quest log is still blank.", bonusKind: "block", bonusXp: 3 },
    { id: "d-6", title: "Tavern rumor", body: "Trail food is the cheap XP. Still expires at midnight.", bonusKind: "meal", bonusXp: 2 },
    { id: "d-7", title: "Critical hour", body: "Nat-feeling payouts on today’s claim. Don’t sleep on it.", bonusKind: "login", bonusXp: 6 },
  ],
  ki: [
    { id: "k-1", title: "Gravity spike", body: "Heavy day. Training checks bank extra charge until midnight.", bonusKind: "block", bonusXp: 4 },
    { id: "k-2", title: "Tournament arc", body: "Session clear is a title fight. Forfeit if you don’t show.", bonusKind: "session", bonusXp: 8 },
    { id: "k-3", title: "Eclipse", body: "Night training energy. First open of the day is the spark.", bonusKind: "login", bonusXp: 5 },
    { id: "k-4", title: "Overdrive leak", body: "Charge meals leak extra. Drink it or lose it.", bonusKind: "meal", bonusXp: 3 },
    { id: "k-5", title: "Rival already warmed up", body: "They hit the chamber at dawn. Your meter is still cold.", bonusKind: "block", bonusXp: 3 },
    { id: "k-6", title: "Limit crack", body: "One session. Extra burst. Window snaps shut at 12.", bonusKind: "session", bonusXp: 6 },
    { id: "k-7", title: "World games whisper", body: "Daily claim is loud today. Silence means you weren’t here.", bonusKind: "login", bonusXp: 6 },
  ],
  anime: [
    { id: "a-1", title: "Rival episode", body: "They already trained. This episode still airs — with or without you.", bonusKind: "block", bonusXp: 4 },
    { id: "a-2", title: "Filler cancelled", body: "Main-arc day. Session clear is the cliffhanger payout.", bonusKind: "session", bonusXp: 8 },
    { id: "a-3", title: "Movie special", body: "First check-in is a ticket. Miss the showing, it’s gone.", bonusKind: "login", bonusXp: 5 },
    { id: "a-4", title: "Food-scene week", body: "Fuel scenes grant extra XP. Don’t skip the lunch cut.", bonusKind: "meal", bonusXp: 3 },
    { id: "a-5", title: "Opening theme hit", body: "Warm-up energy. Training beats pay extra until midnight.", bonusKind: "block", bonusXp: 3 },
    { id: "a-6", title: "End-card leak", body: "Someone already saw next week’s preview. You haven’t logged today.", bonusKind: "login", bonusXp: 4 },
    { id: "a-7", title: "Season finale rumor", body: "Session XP is juiced. This airs once.", bonusKind: "session", bonusXp: 7 },
  ],
};

export function dailyEvent(theme: ThemeId, key = dateKey()): DailyEvent {
  const list = EVENTS[theme];
  return pick(list, `${theme}:${key}`);
}

export function rivalName(key = dateKey()): string {
  return pick(RIVALS, `rival:${key}`);
}

export function rivalLine(theme: ThemeId, key = dateKey()): string {
  const who = rivalName(key);
  const hour = new Date().getHours();
  if (theme === "hunter") {
    if (hour < 10) return `${who} (A-Rank) already cleared the AM window.`;
    if (hour < 17) return `${who} pinged the gate at noon. Your log is still open.`;
    return `${who} closed their daily quest. Yours expires with the clock.`;
  }
  if (theme === "dnd") {
    if (hour < 10) return `${who} left camp at first light. The map is already marked.`;
    if (hour < 17) return `${who} took the side quest. Your slot is still empty.`;
    return `${who} is at the tavern bragging. You haven’t rolled today.`;
  }
  if (theme === "ki") {
    if (hour < 10) return `${who} was in the chamber at dawn. Your meter hasn’t moved.`;
    if (hour < 17) return `${who} already stacked a surge. You’re still Spark-quiet.`;
    return `${who} banked the day. Night doesn’t extend your claim.`;
  }
  if (theme === "anime") {
    if (hour < 10) return `${who} already dropped this morning’s episode. You’re behind.`;
    if (hour < 17) return `${who} posted a training cut. Your beat list is untouched.`;
    return `${who} watched the end card. You still haven’t pressed play.`;
  }
  if (hour < 10) return `${who} already trained. You’re still on the lock screen.`;
  if (hour < 17) return `${who} logged lunch. Your day is still a blank.`;
  return `${who} is done. Midnight still eats whatever you skip.`;
}

export function missedLine(theme: ThemeId, missedDays: number, yesterday: DailyEvent): string | null {
  if (missedDays <= 0) return null;
  const gap = missedDays === 1 ? "1 window" : `${missedDays} windows`;
  if (theme === "hunter") {
    return `You were gone ${gap}. Rank held. Yesterday’s “${yesterday.title}” despawned.`;
  }
  if (theme === "dnd") {
    return `${gap} closed while you were away. The party moved. Missed event: ${yesterday.title}.`;
  }
  if (theme === "ki") {
    return `${gap} unclaimed. The charge leaked. You missed ${yesterday.title}.`;
  }
  if (theme === "anime") {
    return `You skipped ${gap}. The arc kept going. Missed: ${yesterday.title}.`;
  }
  return `${gap} gone. Yesterday’s drop (“${yesterday.title}”) expired.`;
}

export function streakLine(theme: ThemeId, streak: number, best: number): string {
  if (streak <= 0) {
    if (theme === "hunter") return "No chain. Open the window or it stays dead.";
    if (theme === "dnd") return "No streak. The campaign forgets quiet heroes.";
    if (theme === "ki") return "Meter cold. A chain starts the second you claim.";
    if (theme === "anime") return "Zero-episode streak. The season doesn’t pause.";
    return "No chain yet. Checking in starts one.";
  }
  if (streak === 1) {
    if (theme === "hunter") return "1-day chain. Break it tomorrow and the bonus dies.";
    if (theme === "dnd") return "Day 1. Miss tomorrow and the fire goes out.";
    if (theme === "ki") return "Spark lit. Come back tomorrow or it goes dark.";
    if (theme === "anime") return "Episode 1 logged. Skip tomorrow and the arc stalls.";
    return "Chain started. Tomorrow is the one that hurts to miss.";
  }
  const bestBit = best > streak ? ` Best ${best}.` : "";
  if (theme === "hunter") return `${streak}-day chain. Don’t let the system mark you inactive.${bestBit}`;
  if (theme === "dnd") return `${streak}-session streak. The table notices empty chairs.${bestBit}`;
  if (theme === "ki") return `${streak}-day fire. Let it go out and you start from Spark.${bestBit}`;
  if (theme === "anime") return `${streak}-episode streak. Drop it and you’re filler again.${bestBit}`;
  return `${streak}-day chain. Miss tomorrow and it resets.${bestBit}`;
}

export function windowLabel(theme: ThemeId, urgent: boolean): string {
  if (urgent) {
    if (theme === "hunter") return "GATE CLOSING";
    if (theme === "dnd") return "LAST CALL";
    if (theme === "ki") return "CHARGE LEAKING";
    if (theme === "anime") return "CREDITS SOON";
    return "LAST CALL";
  }
  if (theme === "hunter") return "WINDOW";
  if (theme === "dnd") return "UNTIL MIDNIGHT";
  if (theme === "ki") return "UNTIL RESET";
  if (theme === "anime") return "UNTIL AIRTIME ENDS";
  return "UNTIL MIDNIGHT";
}

export function checkinToast(theme: ThemeId, xp: number, streak: number): string {
  if (theme === "hunter") return `Daily claim · +${xp} XP · ${streak}-day chain`;
  if (theme === "dnd") return `You sit down at the table · +${xp} XP · day ${streak}`;
  if (theme === "ki") return `Spark claimed · +${xp} · chain ${streak}`;
  if (theme === "anime") return `Episode started · +${xp} XP · ${streak} in a row`;
  return `Checked in · +${xp} XP · ${streak}-day chain`;
}

export function critToast(theme: ThemeId, extra: number): string {
  if (theme === "hunter") return `CRITICAL CLEAR · bonus +${extra}`;
  if (theme === "dnd") return `Natural 20 energy · +${extra} XP`;
  if (theme === "ki") return `BREAKER · extra +${extra}`;
  if (theme === "anime") return `CLUTCH FRAME · +${extra} XP`;
  return `Clutch · +${extra} XP`;
}

export function comboToast(n: number): string {
  return `x${n} chain`;
}

export function ceremonyCopy(theme: ThemeId, rankLabel: string): { kicker: string; title: string; body: string } {
  if (theme === "hunter") {
    return {
      kicker: "SYSTEM NOTICE",
      title: rankLabel,
      body: "The window updated your rank. People who skipped today didn’t see this.",
    };
  }
  if (theme === "dnd") {
    return {
      kicker: "LEVEL UP",
      title: rankLabel,
      body: "Mark it in the book. Empty chairs don’t get this page.",
    };
  }
  if (theme === "ki") {
    return {
      kicker: "POWER SURGE",
      title: rankLabel,
      body: "The meter jumped. Anyone still asleep missed the flash.",
    };
  }
  if (theme === "anime") {
    return {
      kicker: "NEW FORM",
      title: rankLabel,
      body: "This scene only airs if you’re watching.",
    };
  }
  return {
    kicker: "RANK UP",
    title: rankLabel,
    body: "Logged. The ones who skipped don’t get the bump.",
  };
}

export function milestoneCopy(
  theme: ThemeId,
  opts: { label: string; cleared: boolean },
): { kicker: string; title: string; body: string } {
  if (opts.cleared) {
    if (theme === "hunter") {
      return {
        kicker: "SYSTEM CLEAR",
        title: "Gate down",
        body: `${opts.label} — the number you set is logged.`,
      };
    }
    if (theme === "dnd") {
      return {
        kicker: "CHAPTER CLOSED",
        title: "The chamber is yours",
        body: `You hit the mark for ${opts.label}. Mark it in the book.`,
      };
    }
    if (theme === "ki") {
      return {
        kicker: "POWER PEAK",
        title: "The meter maxed",
        body: `${opts.label} is in. The spark held.`,
      };
    }
    if (theme === "anime") {
      return {
        kicker: "ARC CLEAR",
        title: "This episode aired",
        body: `You closed the ${opts.label} arc.`,
      };
    }
    return {
      kicker: "MILESTONE",
      title: "Locked in",
      body: `You hit the number you set for ${opts.label}.`,
    };
  }
  if (theme === "hunter") {
    return {
      kicker: "BOSS NOTICE",
      title: "The gate is thin",
      body: `${opts.label} is in range. Log the work.`,
    };
  }
  if (theme === "dnd") {
    return {
      kicker: "BOSS BATTLE",
      title: "The doors are open",
      body: `${opts.label} is close. Step in.`,
    };
  }
  if (theme === "ki") {
    return {
      kicker: "FINAL SPARK",
      title: "The meter is climbing",
      body: `${opts.label} is almost yours.`,
    };
  }
  if (theme === "anime") {
    return {
      kicker: "FINAL ARC",
      title: "The last scene is next",
      body: `${opts.label} is in range.`,
    };
  }
  return {
    kicker: "CLOSE",
    title: "Almost there",
    body: `${opts.label} is in range. Log the work.`,
  };
}

export function huntCopy(theme: ThemeId, stage: "empty" | "hunt" | "boss" | "clear"): {
  kicker: string;
  empty: string;
} {
  if (theme === "hunter") {
    return {
      kicker: stage === "boss" ? "BOSS WINDOW" : stage === "clear" ? "RAID CLEAR" : "HUNT METER",
      empty: "Set a number in You — scale, a lift, or a date. The window tracks it.",
    };
  }
  if (theme === "dnd") {
    return {
      kicker: stage === "boss" ? "BOSS GATE" : stage === "clear" ? "QUEST CLEAR" : "THE HUNT",
      empty: "Set a number in You. The book tracks the approach.",
    };
  }
  if (theme === "ki") {
    return {
      kicker: stage === "boss" ? "FINAL SPARK" : stage === "clear" ? "PEAK" : "POWER METER",
      empty: "Set a number in You. The meter fills as you close in.",
    };
  }
  if (theme === "anime") {
    return {
      kicker: stage === "boss" ? "FINAL ARC" : stage === "clear" ? "ARC CLEAR" : "THE ARC",
      empty: "Set a number in You. The arc fills as you close in.",
    };
  }
  return {
    kicker: stage === "boss" ? "CLOSE" : stage === "clear" ? "MILESTONE" : "OVERALL GOAL",
    empty: "Set a number in You — bench, scale, or a date — and this meter fills as you close in.",
  };
}

export function returningCopy(
  theme: ThemeId,
  name: string,
  hasEmail: boolean,
): { kicker: string; title: string; body: string; cta: string } {
  if (theme === "hunter") {
    return {
      kicker: "HUNTER RECOGNIZED",
      title: `Welcome back, ${name}`,
      body: hasEmail
        ? "The window still has your week. Email on this device is how we know it’s you — restore on a new phone comes later."
        : "The window still has your week. Add an email so we can remember you when accounts go live.",
      cta: "Open today’s quest",
    };
  }
  if (theme === "dnd") {
    return {
      kicker: "THE BOOK IS OPEN",
      title: `Back at the table, ${name}`,
      body: hasEmail
        ? "Your page is still marked. Email on this device is the name on the sheet — a later version can carry it to a new book."
        : "Your page is still marked. Add an email so the sheet knows it’s you next time.",
      cta: "Continue the session",
    };
  }
  if (theme === "ki") {
    return {
      kicker: "SPARK HELD",
      title: `The meter remembers, ${name}`,
      body: hasEmail
        ? "Charge is still on this device. Email is the tag for later restore — not a cloud login yet."
        : "Charge is still on this device. Add an email so we can tag this spark as yours.",
      cta: "Enter the chamber",
    };
  }
  if (theme === "anime") {
    return {
      kicker: "PREVIOUSLY ON",
      title: `You’re still in the arc, ${name}`,
      body: hasEmail
        ? "This episode picks up where you left it. Email on this device is the cast list — a later version can restore across screens."
        : "This episode picks up where you left it. Add an email so the next airing knows it’s you.",
      cta: "Play today’s episode",
    };
  }
  return {
    kicker: "WELCOME BACK",
    title: `Your week is here, ${name}`,
    body: hasEmail
      ? "Signed in on this device. Email stays here for now — later it will restore your week on a new phone."
      : "You’re back on this device. Add an email so we can remember you when accounts go live.",
    cta: "Continue today",
  };
}

export function classPerkLine(theme: ThemeId, classId: string | null): string | null {
  if (!classId) return null;
  const map: Record<string, string> = {
    assassin: "Assassin perk: first protocol of the day hits extra.",
    fighter: "Fighter perk: session clear pays a little more.",
    mage: "Mage perk: fuel logs stack bonus XP.",
    tank: "Tank perk: showing up is the armor. Claim still matters.",
    warrior: "Warrior perk: encounters drop extra.",
    ranger: "Ranger perk: the march still counts if you log it.",
    rogue: "Rogue perk: first strike of the day is juiced.",
    cleric: "Cleric perk: rations keep the party up — extra XP.",
    striker: "Striker perk: burst checks bank extra charge.",
    anchor: "Anchor perk: session clear is heavy payout.",
    flash: "Flash perk: first check of the day is a gap-closer.",
    keeper: "Keeper perk: meals keep the fire. Extra today.",
    lead: "Lead perk: main-character sessions pay extra.",
    rival: "Rival perk: every check is a scoreboard. Bonus on hits.",
    mentor: "Mentor perk: logging the work teaches the body — extra XP.",
    wildcard: "Wildcard perk: swaps still count. Claim is the real move.",
    athlete: "Athlete perk: no costume. The chain still dies if you ghost.",
  };
  return map[classId] ?? null;
}
