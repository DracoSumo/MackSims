import { Card, SectionPage } from "@/components/SectionPage";
import { activityTimeline } from "@/data/mock";

export default function TimelinePage() {
  return (
    <SectionPage
      eyebrow="Activity"
      title="CoachCore timeline"
      description="Static demo timeline showing future backend events for logins, film, workouts, fueling, notes, and alerts."
    >
      <div className="grid gap-4">
        {activityTimeline.map((item) => (
          <Card key={`${item.time}-${item.title}`} title={item.title} subtitle={`${item.time} • ${item.type}`}>
            {item.body}
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
