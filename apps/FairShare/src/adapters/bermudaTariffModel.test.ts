import { describe, expect, it } from "vitest";
import {
  calculateBermudaTaxiFare,
  estimateAirportShuttleFare,
  estimateTripDistanceKm,
  tripInvolvesAirport,
} from "./bermudaTariffModel";

describe("tripInvolvesAirport", () => {
  it("detects airport and L.F. Wade references", () => {
    expect(tripInvolvesAirport("L.F. Wade International Airport", "Hamilton")).toBe(true);
    expect(tripInvolvesAirport("Hamilton", "hotel")).toBe(false);
  });
});

describe("estimateTripDistanceKm", () => {
  it("uses airport-hamilton corridor distance", () => {
    expect(estimateTripDistanceKm("L.F. Wade International Airport", "Hamilton hotel")).toBe(15);
  });

  it("uses zone-aware airport curb distance", () => {
    expect(estimateTripDistanceKm("Airport", "Hamilton", "bda-airport-curb")).toBe(15);
  });
});

describe("calculateBermudaTaxiFare", () => {
  it("applies base fare plus per-mile bands", () => {
    const fare = calculateBermudaTaxiFare(15);
    expect(fare.baseFareBmd).toBe(6.45);
    expect(fare.totalLowBmd).toBeGreaterThan(fare.baseFareBmd);
    expect(fare.totalHighBmd).toBeGreaterThanOrEqual(fare.totalLowBmd);
    expect(fare.method).toBe("bermuda-taxi-tariff-v1");
  });
});

describe("estimateAirportShuttleFare", () => {
  it("returns per-person shuttle band for long airport trips", () => {
    const shuttle = estimateAirportShuttleFare(15);
    expect(shuttle.fareLowBmd).toBe(18);
    expect(shuttle.fareHighBmd).toBeGreaterThan(shuttle.fareLowBmd);
    expect(shuttle.etaMinutes).toBeGreaterThan(20);
  });
});
