/**
 * Data service seam for MotoCrew.
 *
 * Today: mock data + browser localStorage only.
 * Future: swap implementations here for REST, Firebase, or native sync
 * without rewriting screen components.
 */

import { chats, packMembers, rides, routes } from "../data/mockData";
import type { DraftRide, EmergencyContact, Ride, RideChat, RoutePreview } from "../types";

export type DataSource = "mock" | "live";

export const dataServiceMeta = {
  source: "mock" as DataSource,
  isSimulated: true,
  label: "Local mock + browser storage",
};

export function listRides(): Ride[] {
  return rides;
}

export function getRideById(rideId: string): Ride | undefined {
  return rides.find((ride) => ride.id === rideId);
}

export function getRouteForRide(ride: Ride): RoutePreview | undefined {
  return routes.find((route) => route.id === ride.routeId);
}

export function getChatForRide(rideId: string): RideChat | undefined {
  return chats.find((chat) => chat.rideId === rideId);
}

export function listPackMembersForRide(rideId: string) {
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
} as const;
