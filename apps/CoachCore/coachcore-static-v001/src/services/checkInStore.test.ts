import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatCheckInTime, listCheckIns, saveCheckIn } from "./checkInStore";

describe("checkInStore", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "test-uuid",
    });
  });

  it("saves and lists check-ins newest first", () => {
    saveCheckIn({ athleteId: "a1", athleteName: "Marcus", readiness: "Ready" });
    const rows = listCheckIns();
    expect(rows).toHaveLength(1);
    expect(rows[0].athleteName).toBe("Marcus");
    expect(rows[0].id).toBe("test-uuid");
  });

  it("formats check-in timestamps for display", () => {
    const label = formatCheckInTime("2026-07-04T12:00:00.000Z");
    expect(label.length).toBeGreaterThan(5);
  });
});
