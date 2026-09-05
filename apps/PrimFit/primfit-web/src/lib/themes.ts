import { loadJson, saveJson } from "@/lib/storage";

export type ThemeId = "sleek" | "hunter" | "dnd" | "ki" | "anime";

export const THEME_IDS: ThemeId[] = ["sleek", "hunter", "dnd", "ki", "anime"];

export type ThemeReceipt = {
  packId: ThemeId;
  unlockedAt: string;
  source: "preview-local";
  note: string;
};

export type ThemeCopy = {
  shop: string;
  shopTitle: string;
  methods: string;
  wearables: string;
  todayEyebrow: string | null;
  weekEyebrow: string | null;
  weekHint: string;
  packShortName: string;
  worldTag: string;
  nav: {
    today: string;
    week: string;
    grocery: string;
    pros: string;
    you: string;
  };
  navIcons: {
    today: string;
    week: string;
    grocery: string;
    pros: string;
    you: string;
  };
  rings: {
    train: string;
    move: string;
    recover: string;
  };
};

export type ThemePack = {
  id: ThemeId;
  name: string;
  pitch: string;
  vibe: string;
  priceCents: number;
  priceLabel: string;
  free: boolean;
  swatches: string[];
};

export const PREVIEW_UNLOCK_NOTE =
  "App Store / Play checkout isn't live yet — unlocks on this device for preview.";

export const THEME_ACTIVE_KEY = "primfit.activeTheme";
export const THEME_OWNED_KEY = "primfit.ownedPacks";
export const THEME_RECEIPTS_KEY = "primfit.packReceipts";

export const PACKS: ThemePack[] = [
  {
    id: "sleek",
    name: "PrimFit Sleek",
    vibe: "Clean athlete",
    pitch: "The default look — purple, black, and silver. Quiet chrome. Same PrimFit.",
    priceCents: 0,
    priceLabel: "Free",
    free: true,
    swatches: ["#7c3aed", "#050508", "#c0c0cc", "#a78bfa"],
  },
  {
    id: "hunter",
    name: "Hunter System",
    vibe: "Awakening / system window",
    pitch:
      "Holographic quest log, hunter ranks, and a daily mission window. Same workouts — they read like a system is assigning them.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#020617", "#0369a1", "#38bdf8", "#e0f2fe"],
  },
  {
    id: "dnd",
    name: "Quest Mode",
    vibe: "Tabletop campaign",
    pitch:
      "Parchment, gold, and a campaign log. Pick a class, roll rest checks, earn XP. Same plan underneath.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#2a1c12", "#8b1e3f", "#c9a227", "#f3e6c8"],
  },
  {
    id: "ki",
    name: "Power Arc",
    vibe: "Martial-arts energy",
    pitch:
      "Gold-on-ember training arc. Power meter, gravity-chamber rest, burst check-offs. Same sets and meals.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#0c0a09", "#ea580c", "#fbbf24", "#fff7ed"],
  },
  {
    id: "anime",
    name: "Shonen Mode",
    vibe: "Daily episode energy",
    pitch: "Magenta and cyan, spark accents, daily-arc titles. Same week — it just plays like an episode.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#0b0614", "#e11d8f", "#22d3ee", "#f4f0ff"],
  },
];

const COPY: Record<ThemeId, ThemeCopy> = {
  sleek: {
    shop: "Shop",
    shopTitle: "Play styles",
    methods: "Methods",
    wearables: "Wearables",
    todayEyebrow: null,
    weekEyebrow: null,
    weekHint: "This generated week only — other weeks aren’t in the plan yet.",
    packShortName: "Sleek",
    worldTag: "ATHLETE",
    nav: { today: "Today", week: "Week", grocery: "Grocery", pros: "Pros", you: "You" },
    navIcons: { today: "◎", week: "▦", grocery: "☐", pros: "✦", you: "○" },
    rings: { train: "Train", move: "Move", recover: "Recover" },
  },
  hunter: {
    shop: "Shop",
    shopTitle: "System skins",
    methods: "Codex",
    wearables: "Relics",
    todayEyebrow: "Daily Quest",
    weekEyebrow: "Weekly instance",
    weekHint: "This instance only — the system does not invent other weeks.",
    packShortName: "Hunter",
    worldTag: "SYSTEM",
    nav: { today: "Quest", week: "Instance", grocery: "Supply", pros: "Guild", you: "Status" },
    navIcons: { today: "◆", week: "▦", grocery: "⬡", pros: "✦", you: "◎" },
    rings: { train: "STR", move: "AGI", recover: "VIT" },
  },
  dnd: {
    shop: "Armory",
    shopTitle: "Quest skins",
    methods: "Lore",
    wearables: "Relics",
    todayEyebrow: "Today's Quest",
    weekEyebrow: "Campaign week",
    weekHint: "This campaign week only — the quest log doesn’t invent other weeks.",
    packShortName: "Quest",
    worldTag: "CAMPAIGN",
    nav: { today: "Quest", week: "Campaign", grocery: "Rations", pros: "Guild", you: "Hero" },
    navIcons: { today: "⚔", week: "▦", grocery: "🍖", pros: "✦", you: "♔" },
    rings: { train: "Might", move: "March", recover: "Rest" },
  },
  ki: {
    shop: "Shop",
    shopTitle: "Arc skins",
    methods: "Dojo",
    wearables: "Gear",
    todayEyebrow: "Power session",
    weekEyebrow: "Training arc",
    weekHint: "This arc week only — the next saga isn’t generated yet.",
    packShortName: "Power",
    worldTag: "ARC",
    nav: { today: "Train", week: "Arc", grocery: "Fuel", pros: "Masters", you: "You" },
    navIcons: { today: "⚡", week: "▦", grocery: "☀", pros: "✦", you: "○" },
    rings: { train: "Power", move: "Burst", recover: "Calm" },
  },
  anime: {
    shop: "Shop",
    shopTitle: "Style packs",
    methods: "Dojo",
    wearables: "Gear",
    todayEyebrow: "Daily Arc",
    weekEyebrow: "Season week",
    weekHint: "This season week only — next arc isn’t generated yet.",
    packShortName: "Shonen",
    worldTag: "ARC",
    nav: { today: "Daily Arc", week: "Season", grocery: "Fuel", pros: "Sensei", you: "You" },
    navIcons: { today: "★", week: "▦", grocery: "♡", pros: "✦", you: "○" },
    rings: { train: "Train", move: "Burst", recover: "Rest" },
  },
};

export function isThemeId(value: unknown): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId);
}

export function themeCopy(id: ThemeId): ThemeCopy {
  return COPY[id];
}

export function packById(id: ThemeId): ThemePack | undefined {
  return PACKS.find((p) => p.id === id);
}

export function getOwnedPacks(): ThemeId[] {
  const raw = loadJson<ThemeId[]>(THEME_OWNED_KEY, ["sleek"]);
  const owned = new Set<ThemeId>(["sleek"]);
  raw.forEach((id) => {
    if (isThemeId(id)) owned.add(id);
  });
  return Array.from(owned);
}

export function getActiveTheme(): ThemeId {
  const stored = loadJson<ThemeId | null>(THEME_ACTIVE_KEY, null);
  const owned = getOwnedPacks();
  if (isThemeId(stored) && owned.includes(stored)) return stored;
  return "sleek";
}

export function getReceipts(): ThemeReceipt[] {
  return loadJson<ThemeReceipt[]>(THEME_RECEIPTS_KEY, []);
}

export function applyThemeToDocument(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}

export function equipTheme(id: ThemeId): boolean {
  if (!getOwnedPacks().includes(id)) return false;
  saveJson(THEME_ACTIVE_KEY, id);
  applyThemeToDocument(id);
  return true;
}

export function unlockPack(id: ThemeId): ThemeReceipt {
  const owned = getOwnedPacks();
  if (!owned.includes(id)) {
    saveJson(THEME_OWNED_KEY, [...owned, id]);
  }
  const receipts = getReceipts();
  const existing = receipts.find((r) => r.packId === id);
  if (existing) {
    equipTheme(id);
    return existing;
  }
  const receipt: ThemeReceipt = {
    packId: id,
    unlockedAt: new Date().toISOString(),
    source: "preview-local",
    note: PREVIEW_UNLOCK_NOTE,
  };
  saveJson(THEME_RECEIPTS_KEY, [receipt, ...receipts].slice(0, 20));
  equipTheme(id);
  return receipt;
}

export function loadThemeState() {
  const owned = getOwnedPacks();
  const theme = getActiveTheme();
  const receipts = getReceipts();
  applyThemeToDocument(theme);
  return { theme, owned, receipts };
}
