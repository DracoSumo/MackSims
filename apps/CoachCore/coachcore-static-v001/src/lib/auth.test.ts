import { describe, expect, it } from "vitest";
import { isOAuthProviderEnabled, sanitizeAuthReturnTo } from "./auth";

describe("sanitizeAuthReturnTo", () => {
  it("keeps same-app paths", () => {
    expect(sanitizeAuthReturnTo("/app/team/?tab=active#roster")).toBe(
      "/app/team/?tab=active#roster",
    );
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/auth/callback?code=x"])(
    "rejects unsafe return target %s",
    (value) => {
      expect(sanitizeAuthReturnTo(value)).toBe("/app/");
    },
  );
});

describe("isOAuthProviderEnabled", () => {
  it("keeps Google and GitHub enabled by default", () => {
    expect(isOAuthProviderEnabled("google")).toBe(true);
    expect(isOAuthProviderEnabled("github")).toBe(true);
  });

  it("enables the configured Facebook provider by default", () => {
    expect(isOAuthProviderEnabled("facebook")).toBe(true);
  });
});
