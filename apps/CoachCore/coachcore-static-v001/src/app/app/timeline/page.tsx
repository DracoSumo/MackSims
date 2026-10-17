import { SectionPage } from "@/components/SectionPage";
import { LiveTimelinePanel } from "@/components/LiveTimelinePanel";

export default function TimelinePage() {
  return (
    <SectionPage
      eyebrow="Activity"
      title="CoachCore timeline"
      description="Events from this device plus sample seed activity — film, workouts, fueling, notes, and alerts."
    >
      <LiveTimelinePanel limit={20} />
    </SectionPage>
  );
}
