import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { athletes } from "@/data/mock";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip } from "@/components/ui/CoachCards";

export default function TeamPage() {
  return (
    <SectionPage
      eyebrow="Roster"
      title="Team command center"
      description="Manage athletes, groups, coach roles, team status, and accountability from one roster view."
    >
      <p className="text-sm text-slate-400">{coachCoreConfig.athleteTodayPrompt}</p>
      <div className="mt-4">
        <CrossLinkStrip current="Team" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {athletes.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              title="No athletes imported"
              body="Your roster will list here after team import. External builds do not show fabricated athlete profiles."
            />
          </div>
        ) : (
          athletes.map((athlete) => (
            <Link key={athlete.id} href={`/app/athletes/${athlete.id}`}>
              <Card title={athlete.name} subtitle={athlete.role}>
                <p>Status: {athlete.status}</p>
                <p>Last active: {athlete.lastActive}</p>
                <p>
                  Film: {athlete.film} • Workouts: {athlete.workouts} • Fueling: {athlete.meals} • Readiness:{" "}
                  {athlete.readiness}
                </p>
                <p className="mt-2 text-sm font-bold text-sky-300">Open profile →</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </SectionPage>
  );
}
