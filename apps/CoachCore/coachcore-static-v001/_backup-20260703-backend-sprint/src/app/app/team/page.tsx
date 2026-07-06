import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
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
        {athletes.map((athlete) => (
          <Link key={athlete.id} href={`/app/athletes/${athlete.id}`}>
            <Card title={athlete.name} subtitle={athlete.role}>
              <p>Status: {athlete.status}</p>
              <p>Last active: {athlete.lastActive}</p>
              <p>Film: {athlete.film} • Workouts: {athlete.workouts} • Fueling: {athlete.meals} • Readiness: {athlete.readiness}</p>
              <p className="mt-2 text-sm font-bold text-sky-300">Open profile →</p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionPage>
  );
}
