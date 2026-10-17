import { describe, expect, it } from "vitest";
import { resolveIcsAccess, sermonVisibleToChurch } from "./icsAccess";

describe("resolveIcsAccess", () => {
  it("rejects bare sermonId without a church feed token (IDOR gate)", () => {
    const result = resolveIcsAccess({
      sermonId: "11111111-1111-1111-1111-111111111111",
      token: null,
    });
    expect(result).toEqual({
      ok: false,
      status: 401,
      error: "A valid church feed token is required",
    });
  });

  it("rejects empty token even when sermonId is present", () => {
    const result = resolveIcsAccess({
      sermonId: "11111111-1111-1111-1111-111111111111",
      token: "   ",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(401);
  });

  it("allows single-sermon export only when token is present", () => {
    const result = resolveIcsAccess({
      sermonId: "11111111-1111-1111-1111-111111111111",
      token: "church-feed-token",
    });
    expect(result).toEqual({
      ok: true,
      mode: "single",
      sermonId: "11111111-1111-1111-1111-111111111111",
      token: "church-feed-token",
    });
  });

  it("allows bulk feed export with token", () => {
    const result = resolveIcsAccess({
      sermonId: null,
      token: "church-feed-token",
      from: "2026-01-01",
      to: "2026-12-31",
    });
    expect(result).toEqual({
      ok: true,
      mode: "feed",
      token: "church-feed-token",
      from: "2026-01-01",
      to: "2026-12-31",
    });
  });
});

describe("sermonVisibleToChurch", () => {
  it("requires matching church_id", () => {
    expect(
      sermonVisibleToChurch(
        { church_id: "church-a" },
        "church-a",
      ),
    ).toBe(true);
    expect(
      sermonVisibleToChurch(
        { church_id: "church-a" },
        "church-b",
      ),
    ).toBe(false);
    expect(sermonVisibleToChurch({ church_id: null }, "church-a")).toBe(false);
    expect(sermonVisibleToChurch(null, "church-a")).toBe(false);
  });
});
