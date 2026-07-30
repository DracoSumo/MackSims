import { describe, expect, it } from "vitest";
import { isOAuthProviderEnabled, sanitizeAuthReturnTo } from "./auth";

describe("sanitizeAuthReturnTo", () => {
  it("keeps same-app paths", () => {
    expect(sanitizeAuthReturnTo("/?screen=profile#account")).toBe("/?screen=profile#account");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/auth/callback"])(
    "rejects unsafe return target %s",
    (value) => {
      expect(sanitizeAuthReturnTo(value)).toBe("/");
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
