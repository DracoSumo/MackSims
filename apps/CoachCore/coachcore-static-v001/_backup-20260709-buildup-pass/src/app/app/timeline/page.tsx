import { SectionPage } from "@/components/SectionPage";
import { LiveTimelinePanel } from "@/components/LiveTimelinePanel";

export default function TimelinePage() {
  return (
    <SectionPage
      eyebrow="Activity"
      title="CoachCore timeline"
      description="Live demo events from this device plus sample future backend events for logins, film, workouts, fueling, notes, and alerts."
    >
      <LiveTimelinePanel limit={20} />
    </SectionPage>
  );
}
