import type { Config } from "@netlify/functions";
import { getInstagramAdminSecret, requireAdmin } from "./_shared/auth.js";
import { createMetaClientFromEnv } from "./_shared/meta-instagram.js";

const REQUIRED_ENV = [
  "META_INSTAGRAM_APP_ID",
  "META_INSTAGRAM_APP_SECRET",
  "META_INSTAGRAM_ACCESS_TOKEN",
  "META_INSTAGRAM_USER_ID",
  "META_INSTAGRAM_API_VERSION",
] as const;

export default async (request: Request): Promise<Response> => {
  const authError = requireAdmin(request);
  if (authError) return authError;
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET" } });
  }

  const missing: string[] = REQUIRED_ENV.filter((name) => !Netlify.env.get(name));
  if (!getInstagramAdminSecret()) missing.push("INSTAGRAM_PUBLISH_ADMIN_SECRET");
  const expiresAtValue = Netlify.env.get("META_INSTAGRAM_TOKEN_EXPIRES_AT");
  const expiresAt = expiresAtValue && !Number.isNaN(Date.parse(expiresAtValue)) ? new Date(expiresAtValue) : null;
  const daysRemaining = expiresAt ? (expiresAt.getTime() - Date.now()) / 86_400_000 : null;
  const health: Record<string, unknown> = {
    configured: missing.length === 0,
    missing,
    token: {
      expiresAt: expiresAt?.toISOString() ?? null,
      daysRemaining: daysRemaining === null ? null : Math.floor(daysRemaining),
      refreshRequired: daysRemaining === null ? "unknown" : daysRemaining <= 10,
      note: "Long-lived Instagram tokens last about 60 days and require operator-confirmed refresh.",
    },
  };

  if (missing.length === 0 && new URL(request.url).searchParams.get("verify") === "1") {
    try {
      health.identity = await createMetaClientFromEnv().getIdentity();
      health.apiReachable = true;
    } catch (error) {
      health.apiReachable = false;
      health.apiError = error instanceof Error ? error.message : "Meta API verification failed";
    }
  }

  return Response.json(health, {
    headers: { "Cache-Control": "no-store" },
  });
};

export const config: Config = {
  path: "/api/admin/instagram/health",
};
