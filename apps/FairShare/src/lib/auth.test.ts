import { describe, expect, it } from "vitest";
import { isOAuthProviderEnabled, sanitizeAuthReturnTo } from "./auth";

describe("sanitizeAuthReturnTo", () => {
  it("keeps same-app paths", () => {
    expect(sanitizeAuthReturnTo("/settings?section=account#login")).toBe(
      "/settings?section=account#login",
    );
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/auth/callback"])(
    "rejects unsafe return target %s",
    (value) => {
      expect(sanitizeAuthReturnTo(value)).toBe("/settings");
    },
  );
});

describe("isOAuthProviderEnabled", () => {
  it("keeps Google and GitHub enabled by default", () => {
    expect(isOAuthProviderEnabled("google")).toBe(true);
    expect(isOAuthProviderEnabled("github")).toBe(true);
  });

  it("keeps Facebook gated off until ENABLE_FACEBOOK_AUTH is flipped", () => {
    expect(isOAuthProviderEnabled("facebook")).toBe(false);
  });
});
