import type { RoutePreview } from "../types";
import { getRouteForRide, listRides } from "./dataService";

export type MapProviderStatus = "unconfigured" | "mock" | "live";

/**
 * Map adapter seam — no provider keys in this beta build.
 * Swap implementation when Mapbox/Google keys and ToS are approved.
 */
export interface MapAdapter {
  readonly status: MapProviderStatus;
  readonly label: string;
  isLiveTrackingAvailable: boolean;
  getRoutePreview(rideId: string): RoutePreview | undefined;
}

export const mapAdapter: MapAdapter = {
  status: "mock",
  label: "Mock route preview (no map tiles or GPS)",
  isLiveTrackingAvailable: false,
  getRoutePreview(rideId: string) {
    const ride = listRides().find((item) => item.id === rideId);
    if (!ride) return undefined;
    return getRouteForRide(ride);
  },
};
