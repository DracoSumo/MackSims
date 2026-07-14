"use client";

import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { workouts } from "@/data/mock";
import { CrossLinkStrip, DemoDisclaimerStrip } from "@/components/ui/CoachCards";
import { TodaysLoop } from "@/components/TodaysLoop";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { AiWorkoutReview } from "@/components/AiWorkoutReview";

export function TrainingWorkspace() {
  return (
    <SectionPage
      eyebrow="Programming"
      title="Training and AI workout drafts"
      description="Assign team workouts, position blocks, recovery sessions, strength work, and functional fitness WODs."
    >
      <DemoDisclaimerStrip />

      <div className="mt-4">
        <TodaysLoop current="workout" />
      </div>

      <div className="mb-6 mt-6 flex flex-wrap gap-3">
        <Link href="/app/training/new" className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950">
          Create mock workout
        </Link>
        <Link
          href="/app/actions/ai-workout"
          className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10"
        >
          AI workout draft (mock)
        </Link>
        <CrossLinkStrip current="Training" />
      </div>

      <div className="mb-6">
        <AiWorkoutReview />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workouts.map((workout) => (
          <Card key={workout.id} title={workout.title} subtitle={`${workout.type} • ${workout.group}`}>
            <p>Duration: {workout.duration}</p>
            <p>Status: {workout.status}</p>
            <div className="mt-4">
              <MarkCompleteButton
                itemType="workout"
                itemId={workout.id}
                label={`Team completed ${workout.title}`}
              />
            </div>
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
