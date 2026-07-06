import type { CrowdSignal, LocalEvent, NightlifeVenue, RideEstimate } from "../data/types";

/**
 * Adapter boundary for FairShare data sources.
 *
 * Every screen that shows fares, crowd levels, venues, or events reads
 * through this interface instead of importing mock data directly. To swap
 * in real providers later, implement `FareDataAdapter` against live APIs
 * and change the export in `src/adapters/index.ts`. See the "Swapping in
 * real APIs" section of README.md for the full path.
 */

export interface TripQuery {
  marketId: string;
  pickup: string;
  dropoff: string;
  zoneId: string;
}

export interface AdapterResult<T> {
  data: T;
  /** Identifies where the data came from; the UI uses this to label demo data. */
  source: "mock" | "live";
  generatedAtLabel: string;
}

export interface FareDataAdapter {
  /** Human-readable name shown in Settings / diagnostics. */
  readonly name: string;
  /** True when every value returned is simulated. Drives demo badges in the UI. */
  readonly isSimulated: boolean;

  getRideEstimates(query: TripQuery): Promise<AdapterResult<RideEstimate[]>>;
  getCrowdSignals(marketId: string): Promise<AdapterResult<CrowdSignal[]>>;
  getNightlifeVenues(marketId: string): Promise<AdapterResult<NightlifeVenue[]>>;
  getLocalEvents(marketId: string): Promise<AdapterResult<LocalEvent[]>>;
}
