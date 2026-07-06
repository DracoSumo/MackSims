import { compositeFareDataAdapter } from "./compositeAdapter";
import type { FareDataAdapter } from "./types";

/**
 * The active data adapter for the whole app.
 *
 * Bermuda compare uses published taxi tariff math + labeled demo companions.
 * Other markets fall back to bundled mock data.
 */
export const fareDataAdapter: FareDataAdapter = compositeFareDataAdapter;

export { ERROR_TRIGGER_TEXT } from "./mockAdapter";
export type { AdapterResult, FareDataAdapter, TripQuery } from "./types";
