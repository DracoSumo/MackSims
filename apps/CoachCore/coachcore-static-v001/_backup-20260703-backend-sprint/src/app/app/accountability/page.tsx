import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { athletes, mockNudgeTargets } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip, DemoDisclaimerStrip } from "@/components/ui/CoachCards";

export default function AccountabilityPage() {
  return (
    <SectionPage
      eyebrow="Accountability"
      title="Who is locked in?"
      description={coachCoreConfig.accountabilityDefinition}
    >
      <DemoDisclaimerStrip />

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Status legend</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          <p><span className="font-bold text-emerald-200">Locked in</span> — film, workouts, and fueling on track</p>
          <p><span className="font-bold text-amber-200">Needs nudge</span> — one or more habits slipping</p>
          <p><span className="font-bold text-red-200">At risk</span> — multiple missed assignments</p>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500">{coachCoreConfig.coachingSupportDisclaimer}</p>
      </div>

      <div className="mt-6">
        <CrossLinkStrip current="Accountability" />
      </div>

      <div className="mt-6 grid gap-4">
        {athletes.map((athlete) => (
          <Card key={athlete.id} title={athlete.name} subtitle={athlete.status}>
            <p className="text-sm text-slate-400">{athlete.role} • Last active: {athlete.lastActive}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-5">
              <p>Film: {athlete.film}</p>
              <p>Workouts: {athlete.workouts}</p>
              <p>Fueling: {athlete.meals}</p>
              <p>Readiness: {athlete.readiness}</p>
              <Link href={`/app/athletes/${athlete.id}`} className="font-bold text-sky-300 hover:text-sky-200">
                View profile →
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-xl font-black">Suggested nudges (demo)</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {mockNudgeTargets.map((target) => (
            <li key={target}>• {target}</li>
          ))}
        </ul>
        <Link
          href="/app/actions/send-nudge"
          className="mt-4 inline-flex rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-slate-950"
        >
          Open mock nudge flow
        </Link>
      </div>
    </SectionPage>
  );
}
