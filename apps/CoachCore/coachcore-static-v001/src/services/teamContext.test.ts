import { beforeEach, describe, expect, it, vi } from "vitest";

const store: Record<string, string> = {};

vi.mock("@/config/backend", () => ({
  isSupabaseConfigured: true,
}));

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  getSupabaseClient: () => ({
    from: (...args: unknown[]) => fromMock(...args),
  }),
}));

vi.mock("@/lib/safeStorage", () => ({
  localGet: (key: string) => store[key] ?? null,
  localSet: (key: string, value: string) => {
    store[key] = value;
  },
}));

describe("teamContext", () => {
  beforeEach(() => {
    for (const key of Object.keys(store)) delete store[key];
    fromMock.mockReset();
    vi.stubGlobal("window", { localStorage: store });
    vi.resetModules();
  });

  it("returns null when organizations query fails (tables missing)", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "team_members") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
              limit: async () => ({ data: [], error: null }),
            }),
          }),
        };
      }
      if (table === "organizations") {
        return {
          select: () => ({
            eq: () => ({
              limit: async () => ({ data: null, error: { message: "relation missing" } }),
            }),
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    });

    const { ensureDefaultTeamContext, getCachedTeamContext } = await import("./teamContext");
    const ctx = await ensureDefaultTeamContext("user-1", "Coach");
    expect(ctx).toBeNull();
    expect(getCachedTeamContext()).toBeNull();
  });

  it("creates org + team + membership when none exist", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "team_members") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
              limit: async () => ({ data: [], error: null }),
            }),
          }),
          upsert: async () => ({ error: null }),
        };
      }
      if (table === "organizations") {
        return {
          select: () => ({
            eq: () => ({
              limit: async () => ({ data: [], error: null }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({ data: { id: "org-1" }, error: null }),
            }),
          }),
        };
      }
      if (table === "teams") {
        return {
          select: () => ({
            eq: () => ({
              limit: async () => ({ data: [], error: null }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({
                data: { id: "team-1", organization_id: "org-1" },
                error: null,
              }),
            }),
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    });

    const { ensureDefaultTeamContext, getCachedTeamContext } = await import("./teamContext");
    const ctx = await ensureDefaultTeamContext("user-1", "Coach Pat");
    expect(ctx).toEqual({
      organizationId: "org-1",
      teamId: "team-1",
      role: "coach",
    });
    expect(getCachedTeamContext()?.teamId).toBe("team-1");
  });

  it("reuses existing membership when present", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "team_members") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
              limit: async () => ({
                data: [{ team_id: "team-9", role: "coach" }],
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === "teams") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: "team-9", organization_id: "org-9" },
                error: null,
              }),
            }),
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    });

    const { ensureDefaultTeamContext } = await import("./teamContext");
    const ctx = await ensureDefaultTeamContext("user-1");
    expect(ctx?.teamId).toBe("team-9");
    expect(ctx?.organizationId).toBe("org-9");
  });
});
