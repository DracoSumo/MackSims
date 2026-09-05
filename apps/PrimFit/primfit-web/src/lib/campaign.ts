import { loadJson, saveJson } from "@/lib/storage";
import { playClasses, type PlayClass } from "@/lib/flavor";
import { type ThemeId } from "@/lib/themes";
import {
  checkinToast,
  critToast,
  dailyEvent,
  dateKey,
  daysBetween,
  type DailyEvent,
} from "@/lib/world";

export const CAMPAIGN_KEY = "primfit.campaign";

export type CampaignState = {
  xp: number;
  classByTheme: Partial<Record<ThemeId, string>>;
  awarded: string[];
  streak: number;
  bestStreak: number;
  lastOpen: string | null;
  lastEventId: string | null;
  missedNotice: { days: number; shownOn: string } | null;
};

export type RankInfo = {
  index: number;
  label: string;
  nextLabel: string | null;
  xpInto: number;
  xpNeed: number;
  progress: number;
};

export type FlavorEvent = {
  toast: string;
  xpGain: number;
  xp: number;
  rank: RankInfo;
  rankedUp: boolean;
  roll?: number;
  crit?: boolean;
  combo?: number;
  kind?: "block" | "meal" | "session" | "rest" | "login" | "crit";
};

const THRESHOLDS = [0, 40, 100, 180, 280, 420, 600, 820, 1100, 1450];

const RANK_LABELS: Record<ThemeId, string[]> = {
  sleek: ["Athlete I", "Athlete II", "Athlete III", "Athlete IV", "Athlete V", "Veteran", "Captain", "Elite", "Ace", "Legend"],
  hunter: ["E-Rank", "D-Rank", "C-Rank", "B-Rank", "A-Rank", "S-Rank", "Elite", "Apex", "World", "Legend"],
  dnd: ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"],
  ki: ["Spark", "Surge", "Peak", "Apex", "Overdrive", "Limit Break", "Orbit", "Nova", "Eclipse", "Legend"],
  anime: ["Extra", "Side cast", "Lead", "Rival", "Ace", "Champion", "Finalist", "Arc boss", "Season lead", "Legend"],
};

function emptyState(): CampaignState {
  return {
    xp: 0,
    classByTheme: {},
    awarded: [],
    streak: 0,
    bestStreak: 0,
    lastOpen: null,
    lastEventId: null,
    missedNotice: null,
  };
}

export function getCampaign(): CampaignState {
  const raw = loadJson<CampaignState>(CAMPAIGN_KEY, emptyState());
  return {
    xp: typeof raw.xp === "number" ? raw.xp : 0,
    classByTheme: raw.classByTheme ?? {},
    awarded: Array.isArray(raw.awarded) ? raw.awarded.slice(-500) : [],
    streak: typeof raw.streak === "number" ? raw.streak : 0,
    bestStreak: typeof raw.bestStreak === "number" ? raw.bestStreak : 0,
    lastOpen: raw.lastOpen ?? null,
    lastEventId: raw.lastEventId ?? null,
    missedNotice: raw.missedNotice ?? null,
  };
}

function saveCampaign(state: CampaignState) {
  saveJson(CAMPAIGN_KEY, { ...state, awarded: state.awarded.slice(-500) });
}

export function rankFor(theme: ThemeId, xp = getCampaign().xp): RankInfo {
  const labels = RANK_LABELS[theme];
  let index = 0;
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) {
      index = i;
      break;
    }
  }
  const floor = THRESHOLDS[index];
  const ceil = THRESHOLDS[index + 1] ?? THRESHOLDS[index] + 400;
  const xpInto = xp - floor;
  const xpNeed = Math.max(1, ceil - floor);
  return {
    index,
    label: labels[index] ?? labels[labels.length - 1],
    nextLabel: labels[index + 1] ?? null,
    xpInto,
    xpNeed,
    progress: Math.min(1, xpInto / xpNeed),
  };
}

export function getPlayClass(theme: ThemeId): PlayClass | null {
  const id = getCampaign().classByTheme[theme];
  if (!id) return null;
  return playClasses(theme).find((c) => c.id === id) ?? null;
}

export function setPlayClass(theme: ThemeId, classId: string) {
  const state = getCampaign();
  state.classByTheme = { ...state.classByTheme, [theme]: classId };
  saveCampaign(state);
  pingCampaign();
}

function toastFor(
  theme: ThemeId,
  kind: FlavorEvent["kind"],
  xpGain: number,
  roll?: number,
): string {
  if (kind === "login") return checkinToast(theme, xpGain, getCampaign().streak);
  if (kind === "crit") return critToast(theme, xpGain);
  if (kind === "session") {
    if (theme === "hunter") return `Daily quest complete · +${xpGain} XP`;
    if (theme === "dnd") return `Session clear · chest +${xpGain} XP`;
    if (theme === "ki") return `Power banked · +${xpGain}`;
    if (theme === "anime") return `Episode clear · +${xpGain} XP`;
    return `Session complete · +${xpGain} XP`;
  }
  if (kind === "rest") {
    if (theme === "dnd" && roll != null) {
      if (roll === 20) return `NAT 20 · short rest explodes · +${xpGain}`;
      if (roll === 1) return `Nat 1. The goblin laughs. You still took the rest.`;
      return `Short rest · you rolled ${roll}`;
    }
    if (theme === "hunter") return "Cooldown complete";
    if (theme === "ki") return "Charge ready";
    if (theme === "anime") return "Back from break";
    return "Rest done";
  }
  if (kind === "meal") {
    if (theme === "hunter") return `Fuel logged · +${xpGain} XP`;
    if (theme === "dnd") return `Rations taken · +${xpGain} XP`;
    if (theme === "ki") return `Charge meal · +${xpGain}`;
    if (theme === "anime") return `Food scene · +${xpGain} XP`;
    return `+${xpGain} XP`;
  }
  if (theme === "hunter") return `Protocol clear · STR +${xpGain}`;
  if (theme === "dnd") return `Encounter clear · +${xpGain} XP`;
  if (theme === "ki") return `Power up · +${xpGain}`;
  if (theme === "anime") return `Beat clear · +${xpGain} XP`;
  return `+${xpGain} XP`;
}

export function pingCampaign() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("primfit-campaign"));
}

function pingRankUp(event: FlavorEvent) {
  if (typeof window === "undefined" || !event.rankedUp) return;
  window.dispatchEvent(new CustomEvent("primfit-rankup", { detail: event }));
}

function classBonus(theme: ThemeId, kind: NonNullable<FlavorEvent["kind"]>): number {
  const id = getCampaign().classByTheme[theme];
  if (!id) return 0;
  if (kind === "block" && ["assassin", "rogue", "flash", "rival"].includes(id)) return 2;
  if (kind === "session" && ["fighter", "warrior", "anchor", "lead"].includes(id)) return 5;
  if (kind === "meal" && ["mage", "cleric", "keeper", "mentor"].includes(id)) return 2;
  if (kind === "block" && ["striker", "wildcard"].includes(id)) return 2;
  return 0;
}

function eventBonus(theme: ThemeId, kind: NonNullable<FlavorEvent["kind"]>): number {
  const evt = dailyEvent(theme);
  if (!evt.bonusKind || evt.bonusKind !== kind) return 0;
  return evt.bonusXp;
}

export function todaysEvent(theme: ThemeId): DailyEvent {
  return dailyEvent(theme);
}

export function awardOnce(opts: {
  key: string;
  theme: ThemeId;
  kind: NonNullable<FlavorEvent["kind"]>;
  xp: number;
  roll?: boolean;
  combo?: number;
  critChance?: boolean;
}): FlavorEvent | null {
  const state = getCampaign();
  if (state.awarded.includes(opts.key)) return null;
  const before = rankFor(opts.theme, state.xp);
  let xpGain = opts.xp;
  if (opts.kind !== "crit" && opts.kind !== "login") {
    xpGain += classBonus(opts.theme, opts.kind);
    xpGain += eventBonus(opts.theme, opts.kind);
    if (opts.combo && opts.combo >= 3) xpGain += Math.min(6, opts.combo);
  }
  let roll: number | undefined;
  if (opts.roll) {
    roll = 1 + Math.floor(Math.random() * 20);
    if (opts.kind === "rest" && roll === 20) xpGain += 8;
  }
  state.xp += xpGain;
  state.awarded = [...state.awarded, opts.key];
  saveCampaign(state);
  pingCampaign();
  const after = rankFor(opts.theme, state.xp);
  const event: FlavorEvent = {
    toast: toastFor(opts.theme, opts.kind, xpGain, roll),
    xpGain,
    xp: state.xp,
    rank: after,
    rankedUp: after.index > before.index,
    roll,
    combo: opts.combo,
    kind: opts.kind,
    crit: opts.kind === "crit",
  };
  pingRankUp(event);
  return event;
}

export function tryCrit(theme: ThemeId, parentKey: string): FlavorEvent | null {
  if (Math.random() > 0.14) return null;
  return awardOnce({
    key: `${parentKey}:crit`,
    theme,
    kind: "crit",
    xp: 6,
  });
}

export function claimDailyCheckin(theme: ThemeId): FlavorEvent | null {
  const today = dateKey();
  const state = getCampaign();
  if (state.lastOpen === today) return null;
  const gap = state.lastOpen ? daysBetween(state.lastOpen, today) : 1;
  if (!state.lastOpen || gap <= 0) {
    state.streak = Math.max(1, state.streak || 1);
  } else if (gap === 1) {
    state.streak = (state.streak || 0) + 1;
  } else {
    state.streak = 1;
  }
  state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
  if (gap > 1) {
    state.missedNotice = { days: gap - 1, shownOn: today };
  } else if (state.missedNotice?.shownOn !== today) {
    state.missedNotice = null;
  }
  state.lastOpen = today;
  state.lastEventId = dailyEvent(theme, today).id;
  saveCampaign(state);
  const bonus = eventBonus(theme, "login");
  const xp = 6 + Math.min(10, state.streak) + bonus;
  return awardOnce({ key: `login:${today}`, theme, kind: "login", xp });
}

export function missedDays(): number {
  const state = getCampaign();
  const today = dateKey();
  if (state.missedNotice?.shownOn === today) return state.missedNotice.days;
  if (!state.lastOpen) return 0;
  const gap = daysBetween(state.lastOpen, today);
  return Math.max(0, gap - 1);
}

export function revokeAward(key: string, xp: number) {
  const state = getCampaign();
  if (!state.awarded.includes(key)) return;
  state.awarded = state.awarded.filter((k) => k !== key);
  state.xp = Math.max(0, state.xp - xp);
  saveCampaign(state);
  pingCampaign();
}
