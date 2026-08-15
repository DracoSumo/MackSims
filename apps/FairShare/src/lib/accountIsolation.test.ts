import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAccountLocalState,
  DEFAULT_USER_SETTINGS,
  loadSavedComparisons,
  loadUserSettings,
  saveComparisonTrip,
  saveUserSettings,
} from "./storage";
import {
  bindSyncOwner,
  clearLocalSyncStateOnSignOut,
  getSyncMeta,
} from "./supabaseSync";

function installMemoryLocalStorage() {
  const store = new Map<string, string>();
  const localStorageMock = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: localStorageMock,
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: localStorageMock, dispatchEvent: () => true },
  });
  return store;
}

describe("FairShare account local isolation", () => {
  beforeEach(() => {
    installMemoryLocalStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clearAccountLocalState drops comparisons and settings but keeps beta ack", () => {
    localStorage.setItem("fairshare.betaAcknowledged.v1", "true");
    saveUserSettings({ name: "Alice", role: "rider", homeMarketId: "bermuda" });
    saveComparisonTrip({
      label: "Airport → City",
      pickup: "Airport",
      dropoff: "City",
      zoneId: "zone-1",
      estimateId: "est-1",
    });

    clearAccountLocalState();

    expect(loadSavedComparisons()).toEqual([]);
    expect(loadUserSettings()).toEqual(DEFAULT_USER_SETTINGS);
    expect(localStorage.getItem("fairshare.betaAcknowledged.v1")).toBe("true");
  });

  it("bindSyncOwner scrubs prior account payload when uid changes", () => {
    localStorage.setItem("fairshare.syncOwnerUserId", "user-a");
    saveUserSettings({ name: "Alice", role: "rider", homeMarketId: "bermuda" });
    saveComparisonTrip({
      label: "Alice trip",
      pickup: "A",
      dropoff: "B",
      zoneId: "z",
      estimateId: "e",
    });
    localStorage.setItem(
      "fairshare.syncMeta",
      JSON.stringify({ lastSyncedAt: "2026-01-01", lastError: null, lastResult: "ok" }),
    );

    const switched = bindSyncOwner("user-b");

    expect(switched).toBe(true);
    expect(localStorage.getItem("fairshare.syncOwnerUserId")).toBe("user-b");
    expect(loadSavedComparisons()).toEqual([]);
    expect(loadUserSettings()).toEqual(DEFAULT_USER_SETTINGS);
    expect(getSyncMeta().lastSyncedAt).toBeNull();
  });

  it("bindSyncOwner keeps data when the same uid rebinds", () => {
    localStorage.setItem("fairshare.syncOwnerUserId", "user-a");
    saveUserSettings({ name: "Alice", role: "rider", homeMarketId: "bermuda" });

    expect(bindSyncOwner("user-a")).toBe(false);
    expect(loadUserSettings().name).toBe("Alice");
  });

  it("clearLocalSyncStateOnSignOut removes owner and account keys", () => {
    localStorage.setItem("fairshare.syncOwnerUserId", "user-a");
    saveUserSettings({ name: "Alice", role: "rider", homeMarketId: "bermuda" });
    saveComparisonTrip({
      label: "Alice trip",
      pickup: "A",
      dropoff: "B",
      zoneId: "z",
      estimateId: "e",
    });

    clearLocalSyncStateOnSignOut();

    expect(localStorage.getItem("fairshare.syncOwnerUserId")).toBeNull();
    expect(loadSavedComparisons()).toEqual([]);
    expect(loadUserSettings()).toEqual(DEFAULT_USER_SETTINGS);
  });
});

describe("exchangeAuthCallbackCode session ownership", () => {
  it("returns null when a session already exists without re-exchanging", async () => {
    const exchangeCodeForSession = vi.fn();
    const getSession = vi.fn().mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });

    vi.resetModules();
    vi.doMock("./supabaseClient", () => ({
      getSupabaseClient: () => ({
        auth: { getSession, exchangeCodeForSession },
      }),
    }));

    const { exchangeAuthCallbackCode } = await import("./auth");
    const result = await exchangeAuthCallbackCode();

    expect(result).toBeNull();
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("exchanges the code when no session exists yet", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });
    const getSession = vi
      .fn()
      .mockResolvedValueOnce({ data: { session: null }, error: null });

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: { search: "?code=abc123" },
      },
    });

    vi.resetModules();
    vi.doMock("./supabaseClient", () => ({
      getSupabaseClient: () => ({
        auth: { getSession, exchangeCodeForSession },
      }),
    }));

    const { exchangeAuthCallbackCode } = await import("./auth");
    const result = await exchangeAuthCallbackCode();

    expect(result).toBeNull();
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });
});
