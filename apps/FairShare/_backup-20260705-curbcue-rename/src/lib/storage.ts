import type { RecentSearch, SavedPlace } from "../data/types";

/**
 * localStorage persistence for beta testing: saved places, recent searches,
 * and the one-time beta disclaimer acknowledgement. All reads are guarded so
 * corrupted or blocked storage degrades to empty state instead of crashing.
 */

const SAVED_PLACES_KEY = "fairshare.savedPlaces.v1";
const RECENT_SEARCHES_KEY = "fairshare.recentSearches.v1";
const BETA_ACK_KEY = "fairshare.betaAcknowledged.v1";
const SAVED_COMPARISONS_KEY = "fairshare.savedComparisons.v1";
const USER_SETTINGS_KEY = "fairshare.userSettings.v1";
const CROWD_POLLS_KEY = "fairshare.crowdPolls.v1";

export type UserSettings = {
  name: string;
  role: string;
  homeMarketId: string;
};

export type SavedComparison = {
  id: string;
  label: string;
  pickup: string;
  dropoff: string;
  zoneId: string;
  estimateId: string;
  savedAt: number;
};

export type CrowdPoll = {
  id: string;
  locationName: string;
  level: "Low" | "Medium" | "High";
  note: string;
  submittedAt: number;
};

const MAX_RECENT_SEARCHES = 6;
const MAX_SAVED_PLACES = 8;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode / quota); persistence is best-effort.
  }
}

export function loadSavedPlaces(): SavedPlace[] {
  const places = readJson<SavedPlace[]>(SAVED_PLACES_KEY, []);
  return Array.isArray(places) ? places : [];
}

export function saveSavedPlace(place: Omit<SavedPlace, "id" | "savedAt">): SavedPlace[] {
  const existing = loadSavedPlaces().filter(
    (item) => item.label.toLowerCase() !== place.label.toLowerCase()
  );
  const next: SavedPlace[] = [
    { ...place, id: `place-${Date.now()}`, savedAt: Date.now() },
    ...existing
  ].slice(0, MAX_SAVED_PLACES);
  writeJson(SAVED_PLACES_KEY, next);
  return next;
}

export function removeSavedPlace(placeId: string): SavedPlace[] {
  const next = loadSavedPlaces().filter((item) => item.id !== placeId);
  writeJson(SAVED_PLACES_KEY, next);
  return next;
}

export function loadRecentSearches(): RecentSearch[] {
  const searches = readJson<RecentSearch[]>(RECENT_SEARCHES_KEY, []);
  return Array.isArray(searches) ? searches : [];
}

export function addRecentSearch(search: Omit<RecentSearch, "id" | "searchedAt">): RecentSearch[] {
  const existing = loadRecentSearches().filter(
    (item) => !(item.pickup === search.pickup && item.dropoff === search.dropoff)
  );
  const next: RecentSearch[] = [
    { ...search, id: `search-${Date.now()}`, searchedAt: Date.now() },
    ...existing
  ].slice(0, MAX_RECENT_SEARCHES);
  writeJson(RECENT_SEARCHES_KEY, next);
  return next;
}

export function clearRecentSearches(): RecentSearch[] {
  writeJson(RECENT_SEARCHES_KEY, []);
  return [];
}

export function isBetaAcknowledged(): boolean {
  return readJson<boolean>(BETA_ACK_KEY, false) === true;
}

export function setBetaAcknowledged(): void {
  writeJson(BETA_ACK_KEY, true);
}

export function loadUserSettings(): UserSettings {
  const settings = readJson<UserSettings>(USER_SETTINGS_KEY, {
    name: "CurbCue demo user",
    role: "rider",
    homeMarketId: "bermuda",
  });
  return settings;
}

export function saveUserSettings(settings: UserSettings): UserSettings {
  writeJson(USER_SETTINGS_KEY, settings);
  void import("./supabaseSync").then(({ pushUserProfile }) => pushUserProfile(settings));
  return settings;
}

export function loadSavedComparisons(): SavedComparison[] {
  const rows = readJson<SavedComparison[]>(SAVED_COMPARISONS_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

/** Alias for sync merge — same as loadSavedComparisons. */
export function listSavedComparisonsForMerge(): SavedComparison[] {
  return loadSavedComparisons();
}

/** Merge remote rows; local wins when ids collide. */
export function mergeSavedComparisons(remote: SavedComparison[]): SavedComparison[] {
  const local = loadSavedComparisons();
  const localIds = new Set(local.map((r) => r.id));
  const merged = [...local, ...remote.filter((r) => !localIds.has(r.id))].slice(0, 12);
  writeJson(SAVED_COMPARISONS_KEY, merged);
  return merged;
}

export function saveComparisonTrip(input: Omit<SavedComparison, "id" | "savedAt">): SavedComparison[] {
  const record: SavedComparison = {
    ...input,
    id: `cmp-${Date.now()}`,
    savedAt: Date.now(),
  };
  const next = [record, ...loadSavedComparisons()].slice(0, 12);
  writeJson(SAVED_COMPARISONS_KEY, next);
  return next;
}

export function removeSavedComparison(id: string): SavedComparison[] {
  const next = loadSavedComparisons().filter((item) => item.id !== id);
  writeJson(SAVED_COMPARISONS_KEY, next);
  return next;
}

export function loadCrowdPolls(): CrowdPoll[] {
  const rows = readJson<CrowdPoll[]>(CROWD_POLLS_KEY, []);
  return Array.isArray(rows) ? rows : [];
}

/** Merge remote rows; local wins when ids collide. */
export function mergeCrowdPolls(remote: CrowdPoll[]): CrowdPoll[] {
  const local = loadCrowdPolls();
  const localIds = new Set(local.map((r) => r.id));
  const merged = [...local, ...remote.filter((r) => !localIds.has(r.id))].slice(0, 20);
  writeJson(CROWD_POLLS_KEY, merged);
  return merged;
}

export function submitCrowdPoll(input: Omit<CrowdPoll, "id" | "submittedAt">): CrowdPoll[] {
  const record: CrowdPoll = {
    ...input,
    id: `poll-${Date.now()}`,
    submittedAt: Date.now(),
  };
  const next = [record, ...loadCrowdPolls()].slice(0, 20);
  writeJson(CROWD_POLLS_KEY, next);
  return next;
}
