"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STRAVA_CLIENT_ID } from "@/config/plugins";
import { connectProviderLocally } from "@/services/integrationsSync";

/**
 * Strava OAuth return path.
 * Exchanges code via Netlify Function when STRAVA_CLIENT_SECRET is configured.
 * Otherwise stays pending_oauth — never fake Connected.
 */
export default function StravaIntegrationCallbackPage() {
  const [message, setMessage] = useState("Finishing Strava connect…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setMessage(`Strava declined or errored: ${error}`);
      return;
    }

    if (!code) {
      setMessage("Missing Strava authorization code.");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/integrations/strava/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            client_id: STRAVA_CLIENT_ID || undefined,
          }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          status?: string;
          error?: string;
          athlete_username?: string | null;
        };

        if (cancelled) return;

        if (res.ok && body.status === "connected") {
          await connectProviderLocally({
            providerId: "strava",
            displayName: "Strava",
            status: "connected",
            notes: body.athlete_username
              ? `Connected as ${body.athlete_username}. Tokens stay server-side.`
              : "Connected via secure token exchange. Tokens stay server-side.",
          });
          setMessage("Strava connected.");
          return;
        }

        const needsCreds = res.status === 503 || body.status === "needs_credentials";
        await connectProviderLocally({
          providerId: "strava",
          displayName: "Strava",
          status: "pending_oauth",
          notes: needsCreds
            ? "Authorization code received, but STRAVA_CLIENT_SECRET is not configured on Netlify. See docs/INTEGRATIONS_SETUP.md."
            : `Token exchange failed (${res.status}). Connection stays Pending.`,
        });
        setMessage(
          needsCreds
            ? "Strava consent received. Connection stays Pending until STRAVA_CLIENT_SECRET is set on Netlify."
            : `Strava token exchange failed. ${body.error ?? "See docs/INTEGRATIONS_SETUP.md."}`
        );
      } catch {
        if (cancelled) return;
        await connectProviderLocally({
          providerId: "strava",
          displayName: "Strava",
          status: "pending_oauth",
          notes:
            "Authorization code received, but the token-exchange function was unreachable. See docs/INTEGRATIONS_SETUP.md.",
        });
        setMessage(
          "Strava consent received, but the token-exchange function was unreachable. Connection stays Pending."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-black">Strava plugin</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">{message}</p>
        <Link href="/app/integrations/" className="mt-6 inline-block font-bold text-sky-300">
          Back to Integrations
        </Link>
      </div>
    </main>
  );
}
