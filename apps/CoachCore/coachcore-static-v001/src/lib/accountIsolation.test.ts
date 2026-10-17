import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listCheckIns, saveCheckIn } from "@/services/checkInStore";
import { listActionLog, logCoachAction } from "@/services/actionLogStore";
import {
  bindSyncOwner,
  clearLocalSyncStateOnSignOut,
  getSyncMeta,
} from "@/services/supabaseSync";

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

describe("CoachCore account local isolation", () => {
  beforeEach(() => {
    installMemoryLocalStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("bindSyncOwner scrubs prior account check-ins and action log when uid changes", () => {
    localStorage.setItem("coachcore.syncOwnerUserId", "user-a");
    saveCheckIn({ athleteId: "a1", athleteName: "Alex", readiness: "green" });
    logCoachAction("Send workout", "Block A");
    localStorage.setItem(
      "coachcore.syncMeta",
      JSON.stringify({ lastSyncedAt: "2026-01-01", lastError: null, lastResult: "ok" }),
    );

    const switched = bindSyncOwner("user-b");

    expect(switched).toBe(true);
    expect(localStorage.getItem("coachcore.syncOwnerUserId")).toBe("user-b");
    expect(listCheckIns()).toEqual([]);
    expect(listActionLog()).toEqual([]);
    expect(getSyncMeta().lastSyncedAt).toBeNull();
  });

  it("bindSyncOwner keeps data when the same uid rebinds", () => {
    localStorage.setItem("coachcore.syncOwnerUserId", "user-a");
    saveCheckIn({ athleteId: "a1", athleteName: "Alex", readiness: "green" });

    expect(bindSyncOwner("user-a")).toBe(false);
    expect(listCheckIns()).toHaveLength(1);
    expect(listCheckIns()[0]?.athleteName).toBe("Alex");
  });

  it("clearLocalSyncStateOnSignOut removes owner and account keys", () => {
    localStorage.setItem("coachcore.syncOwnerUserId", "user-a");
    saveCheckIn({ athleteId: "a1", athleteName: "Alex", readiness: "green" });
    logCoachAction("Send workout", "Block A");

    clearLocalSyncStateOnSignOut();

    expect(localStorage.getItem("coachcore.syncOwnerUserId")).toBeNull();
    expect(listCheckIns()).toEqual([]);
    expect(listActionLog()).toEqual([]);
  });
});

describe("exchangeAuthCallbackCode session ownership", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns null when a session already exists without re-exchanging", async () => {
    const exchangeCodeForSession = vi.fn();
    const getSession = vi.fn().mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });

    vi.doMock("@/lib/supabaseClient", () => ({
      getSupabaseClient: () => ({
        auth: { getSession, exchangeCodeForSession },
      }),
    }));

    const { exchangeAuthCallbackCode } = await import("@/lib/auth");
    const result = await exchangeAuthCallbackCode();

    expect(result).toBeNull();
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("exchanges the code when no session exists yet", async () => {
    const exchangeCodeForSession = vi.fn().mockResolvedValue({ error: null });
    const getSession = vi.fn().mockResolvedValueOnce({ data: { session: null }, error: null });

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: { search: "?code=abc123" },
      },
    });

    vi.doMock("@/lib/supabaseClient", () => ({
      getSupabaseClient: () => ({
        auth: { getSession, exchangeCodeForSession },
      }),
    }));

    const { exchangeAuthCallbackCode } = await import("@/lib/auth");
    const result = await exchangeAuthCallbackCode();

    expect(result).toBeNull();
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });
});
