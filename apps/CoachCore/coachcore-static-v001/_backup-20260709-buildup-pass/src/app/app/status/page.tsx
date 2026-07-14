import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { LocalDataPanel } from "@/components/LocalDataPanel";
import { SupabaseStatusPanel } from "@/components/SupabaseStatusPanel";
import { FoundationNote } from "@/components/ui/CoachCards";
import { coachCoreConfig } from "@/config/coachcore";

const locks = [
  "Landing page",
  "Coach dashboard",
  "Team roster",
  "Clickable athlete profiles",
  "Chat channels",
  "Playbook",
  "Training",
  "Nutrition",
  "Video room",
  "Clickable video details",
  "Accountability dashboard",
  "Integration center",
  "OAuth sign-in (Google/GitHub when Supabase configured)",
  "Optional Supabase sync (check-ins, actions, beta)",
  "Athlete check-in (localStorage)",
  "Mock action log (localStorage)",
  "Local data export/import",
  "Product docs",
  "Netlify mobile demo",
];

const safety = [
  "No production roster or Hudl data",
  "Supabase writes need schema + RLS policies",
  "No payments",
  "No Hudl API connected",
  "No wearable APIs connected",
  "No third-party credentials stored in app",
  "No production deployment telemetry",
  "Demo athlete data only",
];

export default function StatusPage() {
  return (
    <SectionPage
      eyebrow="Internal status"
      title="CoachCore build lock"
      description="Current project status, safety locks, demo URL, and next build direction."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={coachCoreConfig.version} subtitle="Current version">
          Demo polish, handoff documentation, static mock actions, and mobile demo deployment layer.
        </Card>

        <Card title="Mobile demo" subtitle="Netlify">
          <Link href={coachCoreConfig.demoUrl} className="font-bold text-sky-300">
            {coachCoreConfig.demoUrl}
          </Link>
          <p className="mt-3 text-slate-400">{coachCoreConfig.status}</p>
        </Card>
      </div>

      <div className="mt-6">
        <SupabaseStatusPanel />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Core hook" subtitle="Product identity">
          {coachCoreConfig.hook}
        </Card>

        <Card title="Safety note" subtitle="Demo guardrail">
          {coachCoreConfig.safetyNote}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Locked features" subtitle="Current demo foundation">
          <div className="grid gap-2 sm:grid-cols-2">
            {locks.map((item) => (
              <p key={item}>✓ {item}</p>
            ))}
          </div>
        </Card>

        <Card title="Safety locks" subtitle="Still intentionally disconnected">
          <div className="grid gap-2 sm:grid-cols-2">
            {safety.map((item) => (
              <p key={item}>✓ {item}</p>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <LocalDataPanel />
      </div>

      <div className="mt-6">
        <FoundationNote />
      </div>

      <div className="mt-6 rounded-[2rem] border border-sky-300/20 bg-sky-300/10 p-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">
          Next build
        </p>
        <h2 className="mt-3 text-3xl font-black">v0.6 — Supabase + OAuth wiring</h2>
        <p className="mt-3 text-sm leading-6 text-sky-50/85">
          Per-app Supabase projects, OAuth callback routes, local-first sync hooks, and connection status panels.
          Run schema SQL and enable OAuth providers in each Supabase dashboard to go live.
        </p>
      </div>
    </SectionPage>
  );
}
