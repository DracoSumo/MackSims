import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listCheckIns, mergeCheckIns, saveCheckIn } from "./checkInStore";
import { listActionLog, logCoachAction, mergeActionLog } from "./actionLogStore";

function mockLocalStorage() {
  const store: Record<string, string> = {};
  const localStorageMock = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) delete store[key];
    },
  };
  // safeStorage reads window.localStorage
  vi.stubGlobal("localStorage", localStorageMock);
  vi.stubGlobal("window", {
    localStorage: localStorageMock,
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  let n = 0;
  vi.stubGlobal("crypto", {
    randomUUID: () => `uuid-${++n}`,
  });
  return store;
}

describe("swarm load — check-ins and action logs", () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("handles 500–1000 sequential users without throwing and caps list lengths", () => {
    const USER_COUNT = 750;

    expect(() => {
      for (let i = 0; i < USER_COUNT; i++) {
        saveCheckIn({
          athleteId: `athlete-${i % 50}`,
          athleteName: `Athlete ${i % 50}`,
          readiness: i % 3 === 0 ? "Ready" : i % 3 === 1 ? "Sore" : "Tired",
        });
        logCoachAction(`nudge-${i % 10}`, `detail for user ${i}`);
      }
    }).not.toThrow();

    const checkIns = listCheckIns();
    const actions = listActionLog();

    expect(checkIns.length).toBeLessThanOrEqual(30);
    expect(checkIns).toHaveLength(30);
    expect(actions.length).toBeLessThanOrEqual(40);
    expect(actions).toHaveLength(40);

    // Newest first
    expect(checkIns[0].athleteId).toBe(`athlete-${(USER_COUNT - 1) % 50}`);
    expect(actions[0].label).toBe(`nudge-${(USER_COUNT - 1) % 10}`);
  });

  it("merges remote rows under load without exceeding caps", () => {
    for (let i = 0; i < 20; i++) {
      saveCheckIn({ athleteId: `local-${i}`, athleteName: `Local ${i}`, readiness: "Ready" });
      logCoachAction(`local-action-${i}`, "local");
    }

    const localCiId = listCheckIns()[0].id;
    const localAlId = listActionLog()[0].id;

    const remoteCheckIns = Array.from({ length: 40 }, (_, i) => ({
      id: `remote-ci-${i}`,
      athleteId: `remote-${i}`,
      athleteName: `Remote ${i}`,
      readiness: "Ready",
      checkedInAt: new Date(2026, 0, 1, 0, i).toISOString(),
    }));

    const remoteActions = Array.from({ length: 50 }, (_, i) => ({
      id: `remote-al-${i}`,
      label: `remote-action-${i}`,
      detail: "remote",
      loggedAt: new Date(2026, 0, 1, 0, i).toISOString(),
    }));

    // Overlapping ids — local wins
    remoteCheckIns[0] = {
      ...remoteCheckIns[0],
      id: localCiId,
      athleteName: "SHOULD_NOT_OVERRIDE",
    };
    remoteActions[0] = {
      ...remoteActions[0],
      id: localAlId,
      label: "SHOULD_NOT_OVERRIDE",
    };

    let mergedCi;
    let mergedAl;
    expect(() => {
      for (let round = 0; round < 25; round++) {
        mergedCi = mergeCheckIns(remoteCheckIns);
        mergedAl = mergeActionLog(remoteActions);
      }
    }).not.toThrow();

    expect(mergedCi!.length).toBeLessThanOrEqual(30);
    expect(mergedAl!.length).toBeLessThanOrEqual(40);
    expect(listCheckIns()).toHaveLength(30);
    expect(listActionLog()).toHaveLength(40);

    const localWinnerCi = listCheckIns().find((r) => r.id === localCiId);
    expect(localWinnerCi?.athleteName).not.toBe("SHOULD_NOT_OVERRIDE");

    const localWinnerAl = listActionLog().find((r) => r.id === localAlId);
    expect(localWinnerAl?.label).not.toBe("SHOULD_NOT_OVERRIDE");
  });
});
