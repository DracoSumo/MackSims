/**
 * Data service seam for MotoCrew.
 *
 * Production/external builds: empty ride catalog + real localStorage drafts only.
 * Demo fixtures require VITE_ENABLE_DEMO_FIXTURES=true at build time.
 */

import { chats, packMembers, rides, routes } from "../data/mockData";
import type { DraftRide, EmergencyContact, Ride, RideChat, RoutePreview } from "../types";

export type DataSource = "mock" | "live" | "empty";

export const enableDemoFixtures = import.meta.env.VITE_ENABLE_DEMO_FIXTURES === "true";

export const dataServiceMeta = {
  source: (enableDemoFixtures ? "mock" : "empty") as DataSource,
  isSimulated: enableDemoFixtures,
  label: enableDemoFixtures
    ? "Local demo fixtures + browser storage"
    : "Browser storage only — no fabricated ride catalog",
};

export function listRides(): Ride[] {
  return enableDemoFixtures ? rides : [];
}

export function getRideById(rideId: string): Ride | undefined {
  return listRides().find((ride) => ride.id === rideId);
}

export function getRouteForRide(ride: Ride): RoutePreview | undefined {
  if (!enableDemoFixtures) return undefined;
  return routes.find((route) => route.id === ride.routeId);
}

export function getChatForRide(rideId: string): RideChat | undefined {
  if (!enableDemoFixtures) return undefined;
  return chats.find((chat) => chat.rideId === rideId);
}

export function listPackMembersForRide(rideId: string) {
  if (!enableDemoFixtures) return [];
  return packMembers.filter((member) => member.rideId === rideId);
}

export type LocalDraftStore = {
  joinedRideIds: string[];
  draftRides: DraftRide[];
  emergencyContacts: EmergencyContact[];
  safetyAcknowledged: boolean;
};

export const localStorageKeys = {
  joinedRideIds: "motocrew.joinedRideIds",
  draftRides: "motocrew.draftRides",
  emergencyContacts: "motocrew.emergencyContacts",
  safetyAcknowledged: "motocrew.safetyAcknowledged",
  /** @deprecated Flat array — migrated to completedChecklistByRide */
  completedChecklistIds: "motocrew.completedChecklistIds",
  completedChecklistByRide: "motocrew.completedChecklistByRide",
} as const;

/** Migrate legacy flat checklist array into a per-ride map (once). */
export function loadCompletedChecklistByRide(seedRideId: string): Record<string, string[]> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const byRideRaw = window.localStorage.getItem(localStorageKeys.completedChecklistByRide);
    if (byRideRaw) {
      const parsed = JSON.parse(byRideRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, string[]>;
      }
    }

    const legacyRaw = window.localStorage.getItem(localStorageKeys.completedChecklistIds);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as unknown;
      if (Array.isArray(legacy)) {
        const migrated: Record<string, string[]> = seedRideId
          ? { [seedRideId]: legacy.filter((id): id is string => typeof id === "string") }
          : {};
        window.localStorage.setItem(localStorageKeys.completedChecklistByRide, JSON.stringify(migrated));
        window.localStorage.removeItem(localStorageKeys.completedChecklistIds);
        return migrated;
      }
    }
  } catch {
    // Corrupt storage — start empty.
  }

  return {};
}

/** Checklist completion % for a ride (0–100). */
export function checklistReadiness(
  rideId: string,
  checklistIds: string[],
  completedMap: Record<string, string[]>,
): number {
  if (checklistIds.length === 0) {
    return 0;
  }
  const completed = completedMap[rideId] ?? [];
  const done = checklistIds.filter((id) => completed.includes(id)).length;
  return Math.round((done / checklistIds.length) * 100);
}

export function readinessLabel(percent: number): string {
  if (percent >= 80) return "Ready";
  if (percent >= 50) return "Almost";
  return "Needs checklist";
}
