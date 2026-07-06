import { mockFareDataAdapter } from "./mockAdapter";
import type { FareDataAdapter } from "./types";

/**
 * The active data adapter for the whole app.
 *
 * Swap path (documented in README.md):
 *   1. Implement `FareDataAdapter` in a new file (e.g. `liveAdapter.ts`)
 *      that calls approved provider APIs and sets `isSimulated: false`.
 *   2. Point this export at the new adapter (or select by env flag).
 *   3. No screen code changes are required; demo badges disappear
 *      automatically wherever `isSimulated` drives them.
 */
export const fareDataAdapter: FareDataAdapter = mockFareDataAdapter;

export { ERROR_TRIGGER_TEXT } from "./mockAdapter";
export type { AdapterResult, FareDataAdapter, TripQuery } from "./types";
