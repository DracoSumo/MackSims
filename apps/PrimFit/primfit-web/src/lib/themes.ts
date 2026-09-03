import { loadJson, saveJson } from "@/lib/storage";

export type ThemeId = "sleek" | "dnd" | "anime";

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
  nav: {
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
    pitch: "The default look — purple, black, and silver. Glass chrome, quieter type, same PrimFit.",
    priceCents: 0,
    priceLabel: "Free",
    free: true,
    swatches: ["#7c3aed", "#050508", "#c0c0cc", "#a78bfa"],
  },
  {
    id: "dnd",
    name: "Quest Mode (D&D)",
    pitch: "Parchment and ink. Gold on burgundy. Your week reads like a campaign — same workouts underneath.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#2a1c12", "#8b1e3f", "#c9a227", "#f3e6c8"],
  },
  {
    id: "anime",
    name: "Shonen Mode (Anime)",
    pitch: "Magenta and cyan, rounded chrome, spark accents. Daily-arc energy — same plan underneath.",
    priceCents: 299,
    priceLabel: "$2.99",
    free: false,
    swatches: ["#0b0614", "#e11d8f", "#22d3ee", "#f4f0ff"],
  },
];

const COPY: Record<ThemeId, ThemeCopy> = {
  sleek: {
    shop: "Shop",
    shopTitle: "UI packs",
    methods: "Methods",
    wearables: "Wearables",
    todayEyebrow: null,
    weekEyebrow: null,
    weekHint: "This generated week only — other weeks aren’t in the plan yet.",
    packShortName: "Sleek",
    nav: { today: "Today", week: "Week", grocery: "Grocery", pros: "Pros", you: "You" },
    rings: { train: "Train", move: "Move", recover: "Recover" },
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
    nav: { today: "Quest", week: "Campaign", grocery: "Rations", pros: "Guild", you: "Hero" },
    rings: { train: "Quest", move: "March", recover: "Rest" },
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
    nav: { today: "Daily Arc", week: "Season", grocery: "Fuel", pros: "Sensei", you: "You" },
    rings: { train: "Train", move: "Burst", recover: "Rest" },
  },
};

function isThemeId(value: unknown): value is ThemeId {
  return value === "sleek" || value === "dnd" || value === "anime";
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
