import Link from "next/link";
import { Card, SectionPage } from "@/components/SectionPage";
import { videoMoments } from "@/data/mock";
import { TodaysLoop } from "@/components/TodaysLoop";
import { VideoUploadPanel } from "@/components/VideoUploadPanel";

export default function VideoPage() {
  return (
    <SectionPage
      eyebrow="Film room"
      title="Video moments and drill review"
      description="Assign clips, tag corrections, highlight effort, review movement, and track in-app watch time."
    >
      <TodaysLoop current="film" />
      <div className="mt-6">
        <VideoUploadPanel />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {videoMoments.map((moment) => (
          <Link key={moment.id} href={`/app/video/${moment.id}`} className="block transition hover:-translate-y-1">
            <Card title={moment.title} subtitle={`${moment.tag} • ${moment.assigned}`}>
              <p>Watched: {moment.watched}</p>
              <p>{moment.note}</p>
              <p className="mt-3 font-bold text-sky-300">Open video detail →</p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionPage>
  );
}
