"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { StatusPill } from "@/components/ui/CoachCards";
import { coachCoreConfig } from "@/config/coachcore";
import {
  availabilityLabel,
  integrationsCatalog,
  type IntegrationAvailability,
  type IntegrationProvider,
} from "@/data/integrationsCatalog";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  isGoogleCalendarConnectReady,
  isStravaConnectReady,
  startGoogleCalendarOAuth,
  startStravaOAuth,
} from "@/lib/pluginOAuth";
import {
  effectiveAvailability,
  getUserIntegration,
  listUserIntegrations,
  removeUserIntegration,
  type UserIntegrationRecord,
} from "@/services/integrationsStore";
import {
  connectProviderLocally,
  deleteRemoteUserIntegration,
  submitAccessRequest,
  syncIntegrationsOnSignIn,
} from "@/services/integrationsSync";

function toneFor(status: IntegrationAvailability): "sky" | "green" | "amber" | "red" | "slate" {
  switch (status) {
    case "connected":
      return "green";
    case "available":
      return "sky";
    case "needs_credentials":
      return "amber";
    case "request_access":
      return "amber";
    default:
      return "slate";
  }
}

function resolveCatalogAvailability(provider: IntegrationProvider): IntegrationAvailability {
  if (provider.id === "google_calendar") {
    return isGoogleCalendarConnectReady() ? "available" : "needs_credentials";
  }
  if (provider.id === "strava") {
    return isStravaConnectReady() ? "available" : "needs_credentials";
  }
  return provider.availability;
}

export function IntegrationsCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [rows, setRows] = useState<UserIntegrationRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRows(listUserIntegrations());
  }, []);

  useEffect(() => {
    refresh();
    getCurrentUser().then(setUser);

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const next = session?.user ?? null;
      setUser(next);
      if (event === "SIGNED_IN" && next) {
        const err = await syncIntegrationsOnSignIn();
        refresh();
        if (err) setMessage(err);
      }
    });

    syncIntegrationsOnSignIn().then((err) => {
      refresh();
      if (err) setMessage(err);
    });

    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const byProvider = useMemo(() => {
    const map = new Map(rows.map((r) => [r.providerId, r]));
    return map;
  }, [rows]);

  async function handleConnect(provider: IntegrationProvider) {
    setBusyId(provider.id);
    setMessage(null);

    if (!user) {
      setMessage("Sign in from Profile or Login before connecting plugins.");
      setBusyId(null);
      return;
    }

    try {
      if (provider.connectMode === "oauth_google_calendar") {
        const err = await startGoogleCalendarOAuth();
        if (err) setMessage(err);
        return;
      }

      if (provider.connectMode === "oauth_strava") {
        if (!isStravaConnectReady()) {
          setMessage(
            "Strava needs an API app. Set NEXT_PUBLIC_STRAVA_CLIENT_ID after creating one (see docs/INTEGRATIONS_SETUP.md)."
          );
          return;
        }
        await connectProviderLocally({
          providerId: provider.id,
          displayName: provider.name,
          status: "pending_oauth",
          notes: "Strava authorize started — token exchange requires a server secret (not yet configured).",
        });
        refresh();
        const err = startStravaOAuth();
        if (err) setMessage(err);
        return;
      }

      setMessage("This plugin is not connectable yet.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRequestAccess(provider: IntegrationProvider) {
    setBusyId(provider.id);
    setMessage(null);

    if (!user) {
      setMessage("Sign in to submit an access request — we store it on your CoachCore account.");
      setBusyId(null);
      return;
    }

    const record = await connectProviderLocally({
      providerId: provider.id,
      displayName: provider.name,
      status: "requested",
      notes: "Access requested during live beta.",
    });

    const result = await submitAccessRequest({
      providerId: provider.id,
      providerName: provider.name,
      message: "Beta waitlist / request access from Integrations center",
    });

    refresh();
    setBusyId(null);

    if (result === "error") {
      setMessage(`Saved locally (${record.status}) but Supabase request insert failed — check RLS.`);
      return;
    }
    if (result === "skipped") {
      setMessage("Request saved locally. Sign in with Supabase configured to sync the waitlist.");
      return;
    }
    setMessage(`Access requested for ${provider.name}. We'll only enable it when credentials/API access are real.`);
  }

  async function handleDisconnect(provider: IntegrationProvider) {
    setBusyId(provider.id);
    setMessage(null);
    removeUserIntegration(provider.id);
    await deleteRemoteUserIntegration(provider.id);
    refresh();
    setBusyId(null);
    setMessage(`${provider.name} disconnected.`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-50/90">
        Hudl and similar video-platform integrations will be supported where API, export, embed, or licensed
        access is available. CoachCore tracks in-app watch time and engagement immediately.
      </div>

      <div className="rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5 text-sm text-sky-50/90">
        {coachCoreConfig.coachingSupportDisclaimer}
      </div>

      {!user && (
        <p className="text-sm text-slate-400">
          Sign in to sync connect / request-access state to Supabase. Local plugin choices still save on this
          device.
        </p>
      )}

      {message && <p className="text-sm text-slate-300">{message}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrationsCatalog.map((provider) => {
          const userRow = byProvider.get(provider.id) ?? getUserIntegration(provider.id);
          const catalogStatus = resolveCatalogAvailability(provider);
          const status = effectiveAvailability(catalogStatus, userRow?.status);
          const label =
            userRow?.status === "requested"
              ? "Requested"
              : userRow?.status === "pending_oauth"
                ? "Pending OAuth"
                : availabilityLabel(status);

          const canConnect =
            (provider.connectMode === "oauth_google_calendar" && isGoogleCalendarConnectReady()) ||
            (provider.connectMode === "oauth_strava" && isStravaConnectReady());

          const canRequest =
            provider.connectMode === "request_access" ||
            catalogStatus === "needs_credentials" ||
            catalogStatus === "request_access" ||
            catalogStatus === "coming_soon";

          const isLinked = userRow?.status === "connected";
          const isRequested =
            userRow?.status === "requested" || userRow?.status === "pending_oauth";

          return (
            <div
              key={provider.id}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black">{provider.name}</h2>
                <StatusPill tone={toneFor(status)}>{label}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{provider.blurb}</p>
              {provider.carefulCopy && (
                <p className="mt-3 text-xs leading-5 text-amber-100/80">{provider.carefulCopy}</p>
              )}
              {provider.disclaimer && (
                <p className="mt-2 text-xs leading-5 text-slate-500">{provider.disclaimer}</p>
              )}
              {userRow?.notes && (
                <p className="mt-2 text-xs leading-5 text-slate-500">{userRow.notes}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {canConnect && !isLinked && (
                  <button
                    type="button"
                    disabled={busyId === provider.id}
                    onClick={() => handleConnect(provider)}
                    className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-300/20 disabled:opacity-50"
                  >
                    Connect
                  </button>
                )}
                {canRequest && !isLinked && !isRequested && (
                  <button
                    type="button"
                    disabled={busyId === provider.id}
                    onClick={() => handleRequestAccess(provider)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50"
                  >
                    Request access
                  </button>
                )}
                {(isLinked || isRequested) && (
                  <button
                    type="button"
                    disabled={busyId === provider.id}
                    onClick={() => handleDisconnect(provider)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
