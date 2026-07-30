"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listUserIntegrations, type UserIntegrationRecord } from "@/services/integrationsStore";

export function ProfileIntegrationsSummary() {
  const [rows, setRows] = useState<UserIntegrationRecord[]>([]);

  useEffect(() => {
    setRows(listUserIntegrations().filter((r) => r.status !== "disconnected"));
  }, []);

  if (rows.length === 0) {
    return (
      <div className="space-y-2 text-sm">
        <p>No plugins connected or requested yet.</p>
        <p className="text-slate-500">
          Wearables and Hudl stay request-access until partner credentials exist.
        </p>
        <Link href="/app/integrations/" className="font-bold text-sky-300">
          Open Integrations →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {rows.map((row) => (
        <p key={row.providerId}>
          {row.displayName || row.providerId}:{" "}
          <span className="text-slate-400">{row.status.replace("_", " ")}</span>
        </p>
      ))}
      <Link href="/app/integrations/" className="inline-block font-bold text-sky-300">
        Manage plugins →
      </Link>
    </div>
  );
}
