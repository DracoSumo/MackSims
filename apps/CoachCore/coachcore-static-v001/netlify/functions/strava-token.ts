import type { Config, Context } from "@netlify/functions";

/**
 * Strava OAuth token exchange.
 * Requires Netlify env STRAVA_CLIENT_SECRET (+ optional STRAVA_CLIENT_ID fallback).
 * Public client id may also come from the request body / NEXT_PUBLIC_STRAVA_CLIENT_ID at build.
 * Never marks Connected without a successful token response.
 */
export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, req);
  }

  const clientSecret = Netlify.env.get("STRAVA_CLIENT_SECRET")?.trim();
  if (!clientSecret) {
    return json(
      {
        error: "STRAVA_CLIENT_SECRET is not configured on Netlify",
        status: "needs_credentials",
      },
      503,
      req
    );
  }

  let body: { code?: string; client_id?: string };
  try {
    body = (await req.json()) as { code?: string; client_id?: string };
  } catch {
    return json({ error: "Invalid JSON body" }, 400, req);
  }

  const code = body.code?.trim();
  if (!code) {
    return json({ error: "Missing authorization code" }, 400, req);
  }

  const clientId =
    body.client_id?.trim() ||
    Netlify.env.get("STRAVA_CLIENT_ID")?.trim() ||
    Netlify.env.get("NEXT_PUBLIC_STRAVA_CLIENT_ID")?.trim();

  if (!clientId) {
    return json(
      {
        error: "Strava client id missing (NEXT_PUBLIC_STRAVA_CLIENT_ID or STRAVA_CLIENT_ID)",
        status: "needs_credentials",
      },
      503,
      req
    );
  }

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
  });

  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const tokenJson = (await tokenRes.json().catch(() => ({}))) as Record<string, unknown>;
  if (!tokenRes.ok) {
    return json(
      {
        error: "Strava token exchange failed",
        status: "pending_oauth",
        provider_status: tokenRes.status,
        // Do not echo provider error bodies that may include sensitive details.
      },
      502,
      req
    );
  }

  const athlete = (tokenJson.athlete as { id?: number; username?: string } | undefined) ?? {};
  return json(
    {
      status: "connected",
      athlete_id: athlete.id ?? null,
      athlete_username: athlete.username ?? null,
      expires_at: tokenJson.expires_at ?? null,
      // Tokens stay server-side only — never return refresh/access tokens to the browser.
      has_access_token: Boolean(tokenJson.access_token),
      has_refresh_token: Boolean(tokenJson.refresh_token),
    },
    200,
    req
  );
};

export const config: Config = {
  path: "/api/integrations/strava/token",
  method: ["POST", "OPTIONS"],
};

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("Origin") || "*";
  const allowed = new Set([
    "https://coachcore7.netlify.app",
    "https://coachcore.macksims.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  const allowOrigin = allowed.has(origin) ? origin : "https://coachcore7.netlify.app";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, req: Request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(req),
    },
  });
}
