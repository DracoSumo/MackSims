import type { RoutePreview, RouteStop } from "../types";
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
  getMeetSpot(rideId: string): RouteStop | undefined;
  getStops(rideId: string): RouteStop[];
}

function stopsFor(preview: RoutePreview | undefined): RouteStop[] {
  if (!preview) return [];
  if (preview.stops?.length) return preview.stops;
  return preview.segments.map((label, index) => ({
    label,
    kind:
      index === 0
        ? "meet"
        : index === preview.segments.length - 1
          ? "finish"
          : "waypoint",
  }));
}

export const mapAdapter: MapAdapter = {
  status: "mock",
  label: "Static route outline (no map tiles or GPS)",
  isLiveTrackingAvailable: false,
  getRoutePreview(rideId: string) {
    const ride = listRides().find((item) => item.id === rideId);
    if (!ride) return undefined;
    return getRouteForRide(ride);
  },
  getMeetSpot(rideId: string) {
    return this.getStops(rideId)[0];
  },
  getStops(rideId: string) {
    return stopsFor(this.getRoutePreview(rideId));
  },
};
