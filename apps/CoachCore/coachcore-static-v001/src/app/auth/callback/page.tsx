"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { consumeAuthReturnTo, exchangeAuthCallbackCode, getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { connectProviderLocally, syncIntegrationsOnSignIn } from "@/services/integrationsSync";
import { mergeOnSignIn } from "@/services/supabaseSync";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    let active = true;

    exchangeAuthCallbackCode().then(async (message) => {
      if (!active) return;
      if (message) {
        setError(message);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const plugin = params.get("plugin");

      const user = await getCurrentUser();
      if (user) {
        const syncErr = await mergeOnSignIn(user);
        if (syncErr) {
          setError(syncErr);
          return;
        }
        await syncIntegrationsOnSignIn();
      }

      if (plugin === "google_calendar" && user) {
        setStatus("Linking Google Calendar…");
        const supabase = getSupabaseClient();
        const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
        const hasProviderToken = Boolean(data.session?.provider_token);

        await connectProviderLocally({
          providerId: "google_calendar",
          displayName: "Google Calendar",
          status: hasProviderToken ? "connected" : "pending_oauth",
          notes: hasProviderToken
            ? "Google Calendar scopes granted. Event sync is not reading calendars yet — connection only."
            : "Signed in after Calendar consent, but no provider_token in session. Confirm Google Calendar API + scopes on the OAuth client (docs/INTEGRATIONS_SETUP.md).",
        });

        if (!active) return;
        router.replace("/app/integrations/");
        return;
      }

      if (!active) return;
      router.replace(consumeAuthReturnTo());
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black">Sign-in failed</h1>
          <p className="mt-3 text-slate-400">{error}</p>
          <Link href="/login" className="mt-6 inline-block font-bold text-sky-300">
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <p className="text-slate-300">{status}</p>
    </main>
  );
}
