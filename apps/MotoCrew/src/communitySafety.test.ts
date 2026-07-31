import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  blockUser,
  listBlockedUsers,
  listOpenReports,
  resolveReport,
  submitReport,
  unblockUser,
} from "./services/communitySafety";

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

describe("motocrew communitySafety", () => {
  beforeEach(() => {
    const storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", { localStorage: storage });
  });

  it("blocks riders and queues deduped reports", () => {
    blockUser("host-one");
    expect(listBlockedUsers()).toContain("host-one");
    unblockUser("host-one");
    expect(listBlockedUsers()).toEqual([]);

    const a = submitReport({
      targetType: "message",
      targetId: "msg-1",
      targetLabel: "Demo message",
      category: "harassment",
      reporterKey: "rider",
    });
    const b = submitReport({
      targetType: "message",
      targetId: "msg-1",
      targetLabel: "Demo message",
      category: "harassment",
      reporterKey: "rider",
    });
    expect(a.deduped).toBe(false);
    expect(b.deduped).toBe(true);
    resolveReport(a.report.id, "dismiss");
    expect(listOpenReports()).toHaveLength(0);
  });
});
