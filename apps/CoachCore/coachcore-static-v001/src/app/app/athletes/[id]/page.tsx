import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, SectionPage } from "@/components/SectionPage";
import { athletes, videoMoments, workouts } from "@/data/mock";

export function generateStaticParams() {
  return athletes.map((athlete) => ({
    id: athlete.id,
  }));
}

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const athlete = athletes.find((item) => item.id === id);

  if (!athlete) {
    notFound();
  }

  return (
    <SectionPage
      eyebrow="Athlete profile"
      title={athlete.name}
      description={`${athlete.role} • ${athlete.status} • Last active: ${athlete.lastActive}`}
    >
      <div className="mb-6">
        <Link href="/app/team" className="text-sm font-bold text-sky-300">
          ← Back to team
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title={athlete.readiness} subtitle="Readiness" />
        <Card title={athlete.film} subtitle="Film completion" />
        <Card title={athlete.workouts} subtitle="Workout completion" />
        <Card title={athlete.meals} subtitle="Fueling logs" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/app/actions/send-nudge" className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950">
          Send Nudge
        </Link>
        <Link href="/app/actions/assign-workout" className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10">
          Assign Workout
        </Link>
        <Link href="/app/actions/save-note" className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10">
          Save Note
        </Link>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Coach note" subtitle="Latest staff readout">
          {athlete.note}
        </Card>

        <Card title="Next action" subtitle="Mock recommendation">
          {athlete.status === "Locked in"
            ? "Keep current plan. Assign advanced film and preserve recovery window."
            : "Send a coach nudge, assign missed film, and check hydration/fueling before next session."}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {workouts.slice(0, 2).map((workout) => (
          <Card key={workout.id} title={workout.title} subtitle={`${workout.type} • ${workout.status}`}>
            Duration: {workout.duration} • Group: {workout.group}
          </Card>
        ))}

        {videoMoments.slice(0, 2).map((moment) => (
          <Link key={moment.id} href={`/app/video/${moment.id}`} className="block transition hover:-translate-y-1">
            <Card title={moment.title} subtitle={`${moment.tag} • ${moment.watched} watched`}>
              {moment.note}
              <p className="mt-3 font-bold text-sky-300">Open video moment →</p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionPage>
  );
}
