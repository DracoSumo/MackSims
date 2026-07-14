"use client";

import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";

export function VideoMomentDetail({
  moment,
}: {
  moment: {
    id: string;
    title: string;
    tag: string;
    assigned: string;
    watched: string;
    opened: string;
    rewatched: string;
    note: string;
  };
}) {
  return (
    <SectionPage
      eyebrow="Video moment"
      title={moment.title}
      description={`${moment.tag} • Assigned to ${moment.assigned}`}
    >
      <div className="mb-6">
        <Link href="/app/video" className="text-sm font-bold text-sky-300">
          ← Back to video room
        </Link>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900 p-6">
        <div className="flex aspect-video items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950 text-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Mock video player</p>
            <h2 className="mt-3 text-3xl font-black">{moment.title}</h2>
            <p className="mt-2 text-slate-400">Upload scaffold ready — Supabase Storage in v0.7.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <MarkCompleteButton itemType="film" itemId={moment.id} label={`Watched ${moment.title}`} />
        <Link
          href="/app/actions/assign-video"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10"
        >
          Assign clip
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/app/actions/send-nudge"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10"
        >
          Nudge watchers
        </Link>
        <Link
          href="/app/actions/save-note"
          className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10"
        >
          Save note
        </Link>
        <Link href="/app/accountability" className="rounded-2xl bg-sky-400/20 px-5 py-3 text-center font-black text-sky-100">
          Accountability →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title={moment.watched} subtitle="Watch completion" />
        <Card title={moment.opened} subtitle="Opened" />
        <Card title={moment.rewatched} subtitle="Rewatched" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Coach note" subtitle="Teaching point">
          {moment.note}
        </Card>
        <Card title="Engagement tracking" subtitle="In-app only">
          Hudl and similar platforms are plugin-ready only. CoachCore tracks in-app watch time immediately.
        </Card>
      </div>
    </SectionPage>
  );
}
