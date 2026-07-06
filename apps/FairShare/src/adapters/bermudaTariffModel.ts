/**
 * Bermuda licensed-taxi tariff estimation model (manual / published-rate based).
 *
 * Sources for operator review (not live API):
 * - Transport Control Department metered taxi structure (base + distance bands)
 * - Used for estimation only — actual meter, traffic, luggage, and waiting time vary.
 *
 * This is NOT Uber/Lyft pricing and NOT a live quote.
 */

export type TariffTripEstimate = {
  distanceKm: number;
  distanceMiles: number;
  baseFareBmd: number;
  distanceFareBmd: number;
  totalLowBmd: number;
  totalHighBmd: number;
  etaMinutes: number;
  method: "bermuda-taxi-tariff-v1";
};

/** Published-style meter bands for beta estimation (BMD). */
export const BERMUDA_TAXI_TARIFF_V1 = {
  currency: "BMD",
  baseFare: 6.45,
  firstMileIncluded: 1,
  perAdditionalMile: 2.75,
  nightSurchargePercent: 0.25,
  airportQueueNote: "Airport queue/wait time not included in distance estimate.",
};

const ROUTE_DISTANCE_KM: Record<string, number> = {
  "airport-hamilton": 15,
  "airport-stgeorge": 12,
  "hamilton-stgeorge": 22,
  "cruise-hamilton": 10,
  "default-island": 12,
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function tripInvolvesAirport(pickup: string, dropoff: string): boolean {
  const p = normalize(pickup);
  const d = normalize(dropoff);
  return (
    p.includes("airport") ||
    d.includes("airport") ||
    p.includes("wade") ||
    d.includes("wade") ||
    p.includes("lf wade") ||
    d.includes("lf wade")
  );
}

const ZONE_DISTANCE_KM: Record<string, number> = {
  "bda-airport-curb": 15,
  "bda-airport-east-lane": 15,
  "bda-hamilton-front-street": 8,
  "bda-cruise-dockyard": 10,
  "bda-st-george-square": 12,
};

export function estimateTripDistanceKm(pickup: string, dropoff: string, zoneId?: string): number {
  if (zoneId && ZONE_DISTANCE_KM[zoneId]) {
    const p = normalize(pickup);
    const d = normalize(dropoff);
    const hasHamilton = p.includes("hamilton") || d.includes("hamilton");
    const hasStGeorge = p.includes("st george") || d.includes("st george");
    if (zoneId.includes("airport") && hasHamilton) return ROUTE_DISTANCE_KM["airport-hamilton"];
    if (zoneId.includes("airport") && hasStGeorge) return ROUTE_DISTANCE_KM["airport-stgeorge"];
    if (zoneId.includes("airport")) return ZONE_DISTANCE_KM[zoneId];
    if (zoneId.includes("hamilton") && hasStGeorge) return ROUTE_DISTANCE_KM["hamilton-stgeorge"];
    return ZONE_DISTANCE_KM[zoneId];
  }

  const p = normalize(pickup);
  const d = normalize(dropoff);
  const hasAirport = tripInvolvesAirport(pickup, dropoff);
  const hasHamilton = p.includes("hamilton") || d.includes("hamilton");
  const hasCruise = p.includes("cruise") || d.includes("cruise") || p.includes("dockyard") || d.includes("dockyard");
  const hasStGeorge = p.includes("st george") || d.includes("st george");

  if (hasAirport && hasHamilton) return ROUTE_DISTANCE_KM["airport-hamilton"];
  if (hasAirport && hasStGeorge) return ROUTE_DISTANCE_KM["airport-stgeorge"];
  if (hasCruise && hasHamilton) return ROUTE_DISTANCE_KM["cruise-hamilton"];
  if (hasHamilton && hasStGeorge) return ROUTE_DISTANCE_KM["hamilton-stgeorge"];
  if (hasAirport) return 14;
  if (hasHamilton || hasCruise) return 8;
  return ROUTE_DISTANCE_KM["default-island"];
}

/** Shared airport shuttle bands for estimation (per person, not live operator quote). */
export function estimateAirportShuttleFare(distanceKm: number): {
  fareLowBmd: number;
  fareHighBmd: number;
  etaMinutes: number;
  note: string;
} {
  const perPerson = distanceKm >= 14 ? 18 : 15;
  return {
    fareLowBmd: perPerson,
    fareHighBmd: perPerson + 6,
    etaMinutes: Math.max(25, Math.round(distanceKm * 3.2 + 18)),
    note: "Airport shared-shuttle estimate — queue and hotel stops not included.",
  };
}

export function calculateBermudaTaxiFare(distanceKm: number): TariffTripEstimate {
  const distanceMiles = distanceKm * 0.621371;
  const { baseFare, firstMileIncluded, perAdditionalMile } = BERMUDA_TAXI_TARIFF_V1;
  const additionalMiles = Math.max(0, distanceMiles - firstMileIncluded);
  const distanceFare = additionalMiles * perAdditionalMile;
  const baseTotal = baseFare + distanceFare;
  const low = Math.round(baseTotal * 100) / 100;
  const high = Math.round(baseTotal * 1.15 * 100) / 100;
  const etaMinutes = Math.max(12, Math.round(distanceMiles * 2.8 + 8));

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    distanceMiles: Math.round(distanceMiles * 10) / 10,
    baseFareBmd: baseFare,
    distanceFareBmd: Math.round(distanceFare * 100) / 100,
    totalLowBmd: low,
    totalHighBmd: high,
    etaMinutes,
    method: "bermuda-taxi-tariff-v1",
  };
}
