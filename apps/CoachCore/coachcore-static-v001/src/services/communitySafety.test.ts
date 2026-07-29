import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  blockUser,
  listBlockedUsers,
  listOpenReports,
  resolveReport,
  submitReport,
  unblockUser,
} from "./communitySafety";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
    clear: () => map.clear(),
  };
}

describe("communitySafety", () => {
  beforeEach(() => {
    const storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", { localStorage: storage });
  });

  it("blocks and unblocks users", () => {
    expect(listBlockedUsers()).toEqual([]);
    blockUser("channel-a");
    expect(listBlockedUsers()).toContain("channel-a");
    unblockUser("channel-a");
    expect(listBlockedUsers()).toEqual([]);
  });

  it("dedupes reports in the same hour and resolves statuses", () => {
    const first = submitReport({
      targetType: "channel",
      targetId: "team-chat",
      targetLabel: "Team chat",
      category: "spam",
      reporterKey: "tester",
    });
    const second = submitReport({
      targetType: "channel",
      targetId: "team-chat",
      targetLabel: "Team chat",
      category: "spam",
      reporterKey: "tester",
    });
    expect(first.deduped).toBe(false);
    expect(second.deduped).toBe(true);
    expect(listOpenReports()).toHaveLength(1);
    resolveReport(first.report.id, "remove");
    expect(listOpenReports()).toHaveLength(0);
  });
});
