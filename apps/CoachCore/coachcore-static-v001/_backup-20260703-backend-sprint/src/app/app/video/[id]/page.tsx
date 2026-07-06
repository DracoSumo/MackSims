import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, SectionPage } from "@/components/SectionPage";
import { videoMoments } from "@/data/mock";

export function generateStaticParams() {
  return videoMoments.map((moment) => ({
    id: moment.id,
  }));
}

export default async function VideoMomentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moment = videoMoments.find((item) => item.id === id);

  if (!moment) {
    notFound();
  }

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
            <p className="mt-2 text-slate-400">Real uploads come in a later backend patch.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/app/actions/assign-video" className="rounded-2xl bg-sky-400 px-5 py-3 text-center font-black text-slate-950">
          Assign Clip
        </Link>
        <Link href="/app/actions/send-nudge" className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10">
          Nudge Watchers
        </Link>
        <Link href="/app/actions/save-note" className="rounded-2xl border border-white/10 px-5 py-3 text-center font-black text-white hover:bg-white/10">
          Save Note
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
