import { ERROR_TRIGGER_TEXT, mockFareDataAdapter } from "./mockAdapter";
import { calculateBermudaTaxiFare, estimateAirportShuttleFare, estimateTripDistanceKm, tripInvolvesAirport } from "./bermudaTariffModel";
import type { AdapterResult, FareDataAdapter, TripQuery } from "./types";
import type { RideEstimate } from "../data/types";

const MOCK_LATENCY_MS = 320;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildTariffEstimates(query: TripQuery): RideEstimate[] {
  const distanceKm = estimateTripDistanceKm(query.pickup, query.dropoff, query.zoneId);
  const tariff = calculateBermudaTaxiFare(distanceKm);
  const airportTrip = tripInvolvesAirport(query.pickup, query.dropoff);

  const taxiEstimate: RideEstimate = {
    id: `tariff-taxi-${query.zoneId}`,
    providerId: "bermuda-taxi",
    marketId: query.marketId,
    pickupZoneId: query.zoneId,
    fareLow: tariff.totalLowBmd,
    fareHigh: tariff.totalHighBmd,
    etaMinutes: tariff.etaMinutes,
    reliabilityPercent: 91,
    pickupQuality: 86,
    crowdPressureScore: 42,
    recommendation: "best-value",
    tags: ["tariff-model", "licensed-taxi", "not-live-quote"],
    complianceStatus: "pilot-review",
  };

  const shuttle = airportTrip
    ? estimateAirportShuttleFare(distanceKm)
    : {
        fareLowBmd: Math.max(12, Math.round(tariff.totalLowBmd * 0.55)),
        fareHighBmd: Math.max(18, Math.round(tariff.totalHighBmd * 0.65)),
        etaMinutes: tariff.etaMinutes + 12,
      };

  const shuttleEstimate: RideEstimate = {
    id: `tariff-shuttle-${query.zoneId}`,
    providerId: airportTrip ? "airport-shuttle" : "harbor-shuttle",
    marketId: query.marketId,
    pickupZoneId: query.zoneId,
    fareLow: shuttle.fareLowBmd,
    fareHigh: shuttle.fareHighBmd,
    etaMinutes: shuttle.etaMinutes,
    reliabilityPercent: airportTrip ? 84 : 80,
    pickupQuality: airportTrip ? 78 : 74,
    crowdPressureScore: airportTrip ? 52 : 38,
    tags: airportTrip
      ? ["airport-shuttle-tariff", "shared-route-estimate", "not-live-quote"]
      : ["shared-route-estimate", "demo-companion"],
    complianceStatus: "placeholder",
  };

  const companion = (
    providerId: string,
    lowMult: number,
    highMult: number,
    etaOffset: number,
    tags: string[],
    recommendation?: RideEstimate["recommendation"],
  ): RideEstimate => ({
    id: `tariff-${providerId}-${query.zoneId}`,
    providerId,
    marketId: query.marketId,
    pickupZoneId: query.zoneId,
    fareLow: Math.round(tariff.totalLowBmd * lowMult * 100) / 100,
    fareHigh: Math.round(tariff.totalHighBmd * highMult * 100) / 100,
    etaMinutes: tariff.etaMinutes + etaOffset,
    reliabilityPercent: providerId === "fairshare-rideshare" ? 88 : 82,
    pickupQuality: providerId === "local-transport" ? 90 : 76,
    crowdPressureScore: providerId === "fairshare-rideshare" ? 48 : 35,
    recommendation,
    tags: [...tags, "formula-companion", "not-live-quote"],
    complianceStatus: "placeholder",
  });

  const walkingEstimate: RideEstimate = {
    id: `tariff-walk-${query.zoneId}`,
    providerId: "walking-route",
    marketId: query.marketId,
    pickupZoneId: query.zoneId,
    fareLow: 0,
    fareHigh: 0,
    etaMinutes: Math.max(20, Math.round(distanceKm * 12)),
    reliabilityPercent: 99,
    pickupQuality: 100,
    crowdPressureScore: 0,
    tags: ["walking", "distance-dependent"],
    complianceStatus: "not-applicable",
  };

  return [
    taxiEstimate,
    shuttleEstimate,
    companion("fairshare-rideshare", 1.18, 1.35, 4, ["rideshare-companion"], "fastest-option"),
    companion("private-island-driver", 1.55, 1.75, 2, ["private-driver-companion"]),
    companion("local-transport", 0.72, 0.88, 8, ["public-transport-companion"]),
    companion("designated-driver", 1.42, 1.6, 6, ["designated-driver-companion"]),
    walkingEstimate,
  ];
}

/**
 * Composite adapter: Bermuda taxi uses published tariff math;
 * other provider types remain mock companions clearly labeled via tags.
 */
export const compositeFareDataAdapter: FareDataAdapter = {
  name: "Bermuda tariff model (taxi) + labeled demo companions",
  isSimulated: true,

  async getRideEstimates(query: TripQuery): Promise<AdapterResult<RideEstimate[]>> {
    await delay(MOCK_LATENCY_MS);

    if (query.pickup.trim().toLowerCase() === ERROR_TRIGGER_TEXT) {
      throw new Error("Provider data unavailable (error test trigger).");
    }

    if (query.marketId === "bermuda") {
      return {
        data: buildTariffEstimates(query),
        source: "tariff-model",
        generatedAtLabel: "Tariff-model estimate (not a live meter quote)",
        disclaimer:
          "Bermuda taxi uses a published-rate distance model. Shuttle, rideshare, private driver, and other companion rows are formula estimates — not live provider quotes.",
      };
    }

    const mock = await mockFareDataAdapter.getRideEstimates(query);
    return {
      ...mock,
      disclaimer: "Mock demo data — no live provider quotes for this market.",
    };
  },

  getCrowdSignals: (marketId) => mockFareDataAdapter.getCrowdSignals(marketId),
  getNightlifeVenues: (marketId) => mockFareDataAdapter.getNightlifeVenues(marketId),
  getLocalEvents: (marketId) => mockFareDataAdapter.getLocalEvents(marketId),
};
