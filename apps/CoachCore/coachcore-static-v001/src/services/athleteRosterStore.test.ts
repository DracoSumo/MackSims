import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addRosterAthlete,
  importRosterNames,
  listRosterAthletes,
  removeRosterAthlete,
  resolveAthletes,
} from "./athleteRosterStore";

vi.mock("@/config/demoFixtures", () => ({
  enableDemoFixtures: false,
}));

vi.mock("@/data/mock", () => ({
  athletes: [],
}));

describe("athleteRosterStore", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    };
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
      dispatchEvent: () => true,
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "abcd1234-ef56-7890-abcd-ef1234567890",
    });
  });

  it("starts empty when fixtures are off", () => {
    expect(listRosterAthletes()).toEqual([]);
    expect(resolveAthletes()).toEqual([]);
  });

  it("adds athletes to the local roster", () => {
    const athlete = addRosterAthlete({ name: "Jordan Lee", role: "WR" });
    expect(athlete.name).toBe("Jordan Lee");
    expect(athlete.role).toBe("WR");
    expect(athlete.id).toContain("ath_jordan-lee");
    expect(listRosterAthletes()).toHaveLength(1);
    expect(resolveAthletes()[0]?.name).toBe("Jordan Lee");
  });

  it("imports names one per line with optional roles", () => {
    const created = importRosterNames("Alex Kim — RB\nSam Ortiz\n");
    expect(created).toHaveLength(2);
    expect(listRosterAthletes().map((a) => a.name)).toEqual(["Sam Ortiz", "Alex Kim"]);
    expect(listRosterAthletes().find((a) => a.name === "Alex Kim")?.role).toBe("RB");
  });

  it("removes athletes by id", () => {
    const athlete = addRosterAthlete({ name: "Casey" });
    removeRosterAthlete(athlete.id);
    expect(listRosterAthletes()).toHaveLength(0);
  });

  it("rejects blank names", () => {
    expect(() => addRosterAthlete({ name: "   " })).toThrow(/required/i);
  });
});
