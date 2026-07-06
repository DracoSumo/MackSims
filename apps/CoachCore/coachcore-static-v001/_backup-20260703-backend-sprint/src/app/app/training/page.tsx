import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { workouts } from "@/data/mock";
import { CrossLinkStrip, DemoDisclaimerStrip } from "@/components/ui/CoachCards";

export default function TrainingPage() {
  return (
    <SectionPage
      eyebrow="Programming"
      title="Training and AI workout drafts"
      description="Assign team workouts, position blocks, recovery sessions, strength work, and functional fitness WODs."
    >
      <DemoDisclaimerStrip />

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/app/training/new" className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950">
          Create Mock Workout
        </Link>
        <Link href="/app/actions/ai-workout" className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10">
          AI workout draft (mock)
        </Link>
        <CrossLinkStrip current="Training" />
      </div>

      <div className="mb-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">AI planner mock</p>
        <h2 className="mt-3 text-2xl font-black">Generate a 4-week speed and conditioning block</h2>
        <p className="mt-2 text-sm text-emerald-50/80">
          Draft only. Coach review required before assigning to athletes. No real AI API connected.
        </p>
        <p className="mt-3 text-sm text-emerald-50/70">
          Tied to: <Link href="/app/chat" className="font-bold underline">team chat reminders</Link>
          {" · "}
          <Link href="/app/nutrition" className="font-bold underline">fueling checks</Link>
          {" · "}
          <Link href="/app/accountability" className="font-bold underline">completion tracking</Link>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workouts.map((workout) => (
          <Card key={workout.title} title={workout.title} subtitle={`${workout.type} • ${workout.group}`}>
            <p>Duration: {workout.duration}</p>
            <p>Status: {workout.status}</p>
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
