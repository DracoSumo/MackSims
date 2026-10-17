import { SectionPage } from "@/components/SectionPage";
import { EmptyState } from "@/components/ui/EmptyState";
import { VideoMomentsBoard } from "@/components/VideoMomentsBoard";
import { videoMoments } from "@/data/mock";

export default function VideoPage() {
  return (
    <SectionPage
      eyebrow="Film room"
      title="Video moments and drill review"
      description="Assign clips, tag corrections, highlight effort, review movement, and track in-app watch time. Simulate assignment status on this device."
    >
      {videoMoments.length === 0 ? (
        <EmptyState
          title="No film assignments yet"
          body="Assigned clips and watch completion will appear here once film is connected for your team."
        />
      ) : (
        <VideoMomentsBoard />
      )}
    </SectionPage>
  );
}
