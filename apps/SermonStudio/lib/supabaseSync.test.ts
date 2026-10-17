import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultOutline } from "./types";

const store = new Map<string, string>();

const localStorageMock = {
  getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
  clear: () => {
    store.clear();
  },
};

vi.stubGlobal("localStorage", localStorageMock);

const authGetUser = vi.fn();
const sermonsSelect = vi.fn();
const seriesSelect = vi.fn();
const sermonsUpsert = vi.fn();

function chainSelect(result: { data: unknown; error: { message: string } | null }) {
  const order = vi.fn().mockResolvedValue(result);
  return { select: vi.fn(() => ({ order })) };
}

vi.mock("./supabaseClient", () => ({
  ensureSupabaseClient: vi.fn(async () => ({
    auth: { getUser: authGetUser },
    from: (table: string) => {
      if (table === "sermons") {
        return {
          ...chainSelect(sermonsSelect()),
          upsert: (...args: unknown[]) => {
            const result = sermonsUpsert(...args);
            return {
              select: () => ({
                single: async () => result,
              }),
            };
          },
        };
      }
      if (table === "series") {
        return chainSelect(seriesSelect());
      }
      throw new Error(`unexpected table ${table}`);
    },
  })),
  isSupabaseConfigured: vi.fn(() => true),
}));

import {
  bindSyncOwner,
  clearLocalLibraryOnSignOut,
  LS_DRAFT,
  LS_LIB,
  LS_SERIES,
  mergeOnSignIn,
  type SermonWithSync,
} from "./supabaseSync";

function localSermon(id: string, title: string): SermonWithSync {
  return {
    id,
    title,
    theme: "faith",
    date: "",
    passages: [],
    notes: "private notes",
    setlist: [],
    isSeriesItem: false,
    seriesId: "",
    outline: defaultOutline(),
    cloudSynced: false,
  };
}

describe("sermon studio sync isolation", () => {
  beforeEach(() => {
    store.clear();
    authGetUser.mockReset();
    sermonsSelect.mockReset();
    seriesSelect.mockReset();
    sermonsUpsert.mockReset();
    authGetUser.mockResolvedValue({ data: { user: { id: "user-b" } } });
    seriesSelect.mockReturnValue({ data: [], error: null });
  });

  afterEach(() => {
    store.clear();
  });

  it("clears prior-account local library keys on sign-out", () => {
    localStorage.setItem(LS_LIB, JSON.stringify([localSermon("a1", "A")]));
    localStorage.setItem(LS_SERIES, "[]");
    localStorage.setItem(LS_DRAFT, "{}");
    localStorage.setItem("sermon-studio.syncOwnerUserId", "user-a");

    clearLocalLibraryOnSignOut();

    expect(localStorage.getItem(LS_LIB)).toBeNull();
    expect(localStorage.getItem(LS_SERIES)).toBeNull();
    expect(localStorage.getItem(LS_DRAFT)).toBeNull();
    expect(localStorage.getItem("sermon-studio.syncOwnerUserId")).toBeNull();
  });

  it("bindSyncOwner scrubs prior account payload when uid changes", () => {
    localStorage.setItem("sermon-studio.syncOwnerUserId", "user-a");
    localStorage.setItem(LS_LIB, JSON.stringify([localSermon("a1", "A")]));
    localStorage.setItem(LS_SERIES, "[]");
    localStorage.setItem(LS_DRAFT, "{}");

    expect(bindSyncOwner("user-b")).toBe(true);
    expect(localStorage.getItem(LS_LIB)).toBeNull();
    expect(localStorage.getItem("sermon-studio.syncOwnerUserId")).toBe("user-b");
  });

  it("does not push prior-account local sermons after account switch", async () => {
    localStorage.setItem("sermon-studio.syncOwnerUserId", "user-a");
    sermonsSelect.mockReturnValue({
      data: [{ id: "remote-b", title: "B cloud", theme: "hope", date: null, passages: [], notes: "", setlist: [], is_series_item: false, series_id: null, outline: defaultOutline() }],
      error: null,
    });

    const result = await mergeOnSignIn([localSermon("a1", "A private")], []);

    expect(result.clearedPriorAccount).toBe(true);
    expect(result.library.map((s) => s.id)).toEqual(["remote-b"]);
    expect(sermonsUpsert).not.toHaveBeenCalled();
  });

  it("aborts pushes when sermon pull fails instead of treating cloud as empty", async () => {
    localStorage.setItem("sermon-studio.syncOwnerUserId", "user-b");
    sermonsSelect.mockReturnValue({ data: null, error: { message: "timeout" } });

    const local = [localSermon("same-id", "stale local")];
    const result = await mergeOnSignIn(local, []);

    expect(result.error).toMatch(/pull failed/i);
    expect(result.library).toEqual(local);
    expect(sermonsUpsert).not.toHaveBeenCalled();
  });
});
