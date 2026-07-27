import { SectionPage } from "@/components/SectionPage";
import { VideoMomentsBoard } from "@/components/VideoMomentsBoard";

export default function VideoPage() {
  return (
    <SectionPage
      eyebrow="Film room"
      title="Video moments and drill review"
      description="Assign clips, tag corrections, highlight effort, review movement, and track in-app watch time. Simulate assignment status on this device."
    >
      <VideoMomentsBoard />
    </SectionPage>
  );
}
