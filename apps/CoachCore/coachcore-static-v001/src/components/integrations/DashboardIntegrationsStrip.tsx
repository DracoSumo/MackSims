"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/ui/CoachCards";
import {
  availabilityLabel,
  integrationsCatalog,
  type IntegrationAvailability,
} from "@/data/integrationsCatalog";
import { isGoogleCalendarConnectReady, isStravaConnectReady } from "@/lib/pluginOAuth";
import {
  effectiveAvailability,
  listUserIntegrations,
} from "@/services/integrationsStore";

function resolveCatalog(id: string, fallback: IntegrationAvailability): IntegrationAvailability {
  if (id === "google_calendar") {
    return isGoogleCalendarConnectReady() ? "available" : "needs_credentials";
  }
  if (id === "strava") {
    return isStravaConnectReady() ? "available" : "needs_credentials";
  }
  return fallback;
}

export function DashboardIntegrationsStrip() {
  const [labels, setLabels] = useState(
    integrationsCatalog.slice(0, 8).map((p) => ({
      name: p.name,
      status: availabilityLabel(p.availability),
    }))
  );

  useEffect(() => {
    const userRows = listUserIntegrations();
    const byId = new Map(userRows.map((r) => [r.providerId, r]));
    setLabels(
      integrationsCatalog.slice(0, 8).map((p) => {
        const user = byId.get(p.id);
        const status = effectiveAvailability(resolveCatalog(p.id, p.availability), user?.status);
        const label =
          user?.status === "requested"
            ? "Requested"
            : user?.status === "pending_oauth"
              ? "Pending"
              : availabilityLabel(status);
        return { name: p.name, status: label };
      })
    );
  }, []);

  const connectedCount = labels.filter((l) => l.status === "Connected").length;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Integration center</h2>
        <StatusPill tone={connectedCount > 0 ? "green" : "sky"}>
          {connectedCount > 0 ? `${connectedCount} connected` : "Live plugin layer"}
        </StatusPill>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {labels.map((item) => (
          <span
            key={item.name}
            className="rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200"
            title={item.status}
          >
            {item.name}
            <span className="ml-2 text-slate-500">{item.status}</span>
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-400">
        Google Calendar can link via existing Google OAuth. Partner APIs (Hudl, WHOOP, etc.) use request-access —
        not fake connections.{" "}
        <Link href="/app/integrations/" className="font-bold text-sky-300">
          Manage plugins →
        </Link>
      </p>
    </div>
  );
}
