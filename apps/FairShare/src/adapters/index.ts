import { compositeFareDataAdapter } from "./compositeAdapter";
import type { FareDataAdapter } from "./types";
import { LIVE_FARE_ADAPTER_ENABLED } from "../config";

/**
 * The active data adapter for the whole app.
 *
 * Bermuda compare uses published taxi tariff math + labeled demo companions.
 * Other markets fall back to bundled mock data.
 * Live provider adapters stay behind LIVE_FARE_ADAPTER_ENABLED (Wave 2 gate).
 */
export const fareDataAdapter: FareDataAdapter = LIVE_FARE_ADAPTER_ENABLED
  ? compositeFareDataAdapter // swap to a live adapter here when Wave 1 feedback clears
  : compositeFareDataAdapter;

export { ERROR_TRIGGER_TEXT } from "./mockAdapter";
export type { AdapterResult, FareDataAdapter, TripQuery } from "./types";
export { LIVE_FARE_ADAPTER_ENABLED };
