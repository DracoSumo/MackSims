import type { RecentSearch, SavedPlace } from "../data/types";

/**
 * localStorage persistence for beta testing: saved places, recent searches,
 * and the one-time beta disclaimer acknowledgement. All reads are guarded so
 * corrupted or blocked storage degrades to empty state instead of crashing.
 */

const SAVED_PLACES_KEY = "fairshare.savedPlaces.v1";
const RECENT_SEARCHES_KEY = "fairshare.recentSearches.v1";
const BETA_ACK_KEY = "fairshare.betaAcknowledged.v1";

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
