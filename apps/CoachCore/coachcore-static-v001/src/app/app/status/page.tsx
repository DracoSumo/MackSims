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
  "Integration center (connect / request-access)",
  "OAuth sign-in (Google/GitHub when Supabase configured)",
  "Optional Supabase sync (check-ins, actions, beta, plugins)",
  "Google Calendar link (scopes via existing Google OAuth)",
  "Athlete check-in (localStorage)",
  "Mock action log (localStorage)",
  "Local data export/import",
  "Product docs",
  "Netlify mobile demo",
];

const safety = [
  "No production roster or Hudl data",
  "Sample roster until real teams are imported",
  "No payments",
  "No Hudl API connected (request-access only)",
  "No wearable APIs connected (request-access / needs credentials)",
  "No third-party secrets in the client bundle",
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
        <h2 className="mt-3 text-3xl font-black">v0.8 — Real teams + assignments</h2>
        <p className="mt-3 text-sm leading-6 text-sky-50/85">
          Replace sample roster with org/team membership, persist assignments beyond localStorage,
          and gate coach tools behind signed-in sessions once schema RLS is confirmed on production.
          Plugin follow-ups: Calendar event sync, Strava token exchange function, partner API credentials.
        </p>
      </div>
    </SectionPage>
  );
}
