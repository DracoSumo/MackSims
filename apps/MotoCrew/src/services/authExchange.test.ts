import { afterEach, describe, expect, it, vi } from "vitest";

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
    const getSession = vi.fn().mockResolvedValueOnce({ data: { session: null }, error: null });

    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        location: { search: "?code=abc123" },
      },
    });

    vi.doMock("./supabaseClient", () => ({
      getSupabaseClient: () => ({
        auth: { getSession, exchangeCodeForSession },
      }),
    }));
    vi.doMock("../config/backend", () => ({
      isSupabaseConfigured: true,
    }));

    const { exchangeAuthCallbackCode } = await import("./auth");
    const result = await exchangeAuthCallbackCode();

    expect(result).toBeNull();
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });
});
