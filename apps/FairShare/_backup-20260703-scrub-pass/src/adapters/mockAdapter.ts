import { crowdSignals, localEvents, nightlifeVenues, rideEstimates } from "../data/mockData";
import type { CrowdSignal, LocalEvent, NightlifeVenue, RideEstimate } from "../data/types";
import type { AdapterResult, FareDataAdapter, TripQuery } from "./types";

/** Simulated network delay so loading states are visible to testers. */
const MOCK_LATENCY_MS = 450;

/**
 * Typing this exact text into the pickup field forces the adapter to fail,
 * so testers can see the error state. Documented in FAIRSHARE_TESTING_NOTES.md.
 */
export const ERROR_TRIGGER_TEXT = "error test";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function wrap<T>(data: T): AdapterResult<T> {
  return { data, source: "mock", generatedAtLabel: "Simulated demo window" };
}

/**
 * Default adapter: serves bundled demo data with simulated latency.
 * No network calls are made anywhere in this file.
 */
export const mockFareDataAdapter: FareDataAdapter = {
  name: "FairShare Demo Data (bundled, simulated)",
  isSimulated: true,

  async getRideEstimates(query: TripQuery): Promise<AdapterResult<RideEstimate[]>> {
    await delay(MOCK_LATENCY_MS);

    if (query.pickup.trim().toLowerCase() === ERROR_TRIGGER_TEXT) {
      throw new Error("Simulated provider outage (triggered by the 'error test' pickup text).");
    }

    return wrap(rideEstimates.filter((estimate) => estimate.marketId === query.marketId));
  },

  async getCrowdSignals(marketId: string): Promise<AdapterResult<CrowdSignal[]>> {
    await delay(MOCK_LATENCY_MS);
    return wrap(crowdSignals.filter((signal) => signal.marketId === marketId));
  },

  async getNightlifeVenues(marketId: string): Promise<AdapterResult<NightlifeVenue[]>> {
    await delay(MOCK_LATENCY_MS);
    return wrap(nightlifeVenues.filter((venue) => venue.marketId === marketId));
  },

  async getLocalEvents(marketId: string): Promise<AdapterResult<LocalEvent[]>> {
    await delay(MOCK_LATENCY_MS);
    return wrap(localEvents.filter((event) => event.marketId === marketId));
  }
};
