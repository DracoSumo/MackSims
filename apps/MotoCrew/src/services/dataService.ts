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
  completedChecklistIds: "motocrew.completedChecklistIds",
} as const;
