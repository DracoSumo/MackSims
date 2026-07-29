"use client";

import { useEffect, useState } from "react";
import { Card, SectionPage } from "@/components/SectionPage";
import { adminCards } from "@/data/mock";
import {
  listBlockedUsers,
  listOpenReports,
  resolveReport,
  unblockUser,
  type ContentReport,
} from "@/services/communitySafety";

export default function AdminPage() {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);

  function refresh() {
    setReports(listOpenReports());
    setBlocked(listBlockedUsers());
  }

  useEffect(() => {
    refresh();
  }, []);

  function act(reportId: string, action: "hide" | "remove" | "dismiss" | "approve") {
    const result = resolveReport(reportId, action);
    setNote(result ? `Marked ${action}.` : "Report not found — retry.");
    refresh();
  }

  return (
    <SectionPage
      eyebrow="Organization"
      title="Admin command center"
      description="For schools, clubs, gyms, trainers, and performance facilities managing multiple teams and coaches."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCards.length ? (
          adminCards.map((card) => (
            <Card key={card.label} title={card.value} subtitle={card.label}>
              {card.note}
            </Card>
          ))
        ) : (
          <div className="xl:col-span-4">
            <Card title="No org metrics yet" subtitle="Organization">
              Organization, team, coach, and athlete counts appear after real org data is connected — not fabricated KPIs.
            </Card>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Moderation queue" subtitle={`${reports.length} open / in review`}>
          <p className="mb-4 text-xs text-slate-400">
            Reports from team chat and channels. Reporter identity is never shown here in the beta shell.
            Apply the Supabase safety schema for server-enforced operator actions in production.
          </p>
          {note ? <p className="mb-3 text-xs text-emerald-300">{note}</p> : null}
          {reports.length === 0 ? (
            <p className="text-sm text-slate-400">No open reports.</p>
          ) : (
            <ul className="space-y-3">
              {reports.map((report) => (
                <li key={report.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-sm font-bold capitalize">{report.category}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {report.targetType} · {report.targetLabel}
                  </p>
                  {report.details ? <p className="mt-2 text-sm text-slate-300">{report.details}</p> : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["hide", "remove", "dismiss", "approve"] as const).map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="rounded-lg border border-white/15 px-2 py-1 text-xs capitalize hover:bg-white/10"
                        onClick={() => act(report.id, action)}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Blocked profiles" subtitle={`${blocked.length} on this device`}>
          {blocked.length === 0 ? (
            <p className="text-sm text-slate-400">No blocked profiles.</p>
          ) : (
            <ul className="space-y-2">
              {blocked.map((id) => (
                <li key={id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-slate-300">{id}</span>
                  <button
                    type="button"
                    className="rounded-lg border border-white/15 px-2 py-1 text-xs hover:bg-white/10"
                    onClick={() => {
                      unblockUser(id);
                      refresh();
                    }}
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </SectionPage>
  );
}
