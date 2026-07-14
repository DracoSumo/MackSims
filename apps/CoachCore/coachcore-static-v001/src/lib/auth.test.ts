import { afterEach, describe, expect, it, vi } from "vitest";
import { getAuthCallbackUrl, getOAuthCallbackParams } from "@/lib/auth";

describe("OAuth callback helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds a stable callback URL without a trailing slash", () => {
    vi.stubGlobal("window", {
      location: {
        origin: "https://coachcore7.netlify.app",
        search: "",
        hash: "",
      },
    });

    expect(getAuthCallbackUrl()).toBe("https://coachcore7.netlify.app/auth/callback");
  });

  it("reads OAuth error params from query or hash", () => {
    vi.stubGlobal("window", {
      location: {
        origin: "https://coachcore7.netlify.app",
        search: "?code=abc123",
        hash: "#error_description=Provider%20disabled",
      },
    });

    const params = getOAuthCallbackParams();
    expect(params.get("code")).toBe("abc123");
    expect(params.get("error_description")).toBe("Provider disabled");
  });
});
