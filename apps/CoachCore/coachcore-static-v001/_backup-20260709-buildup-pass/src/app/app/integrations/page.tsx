import { Card, SectionPage } from "@/components/SectionPage";
import { integrations } from "@/data/mock";

export default function IntegrationsPage() {
  return (
    <SectionPage
      eyebrow="Plugin-ready"
      title="Integration center"
      description="Hudl, wearable, calendar, and team-platform placeholders. No external APIs are connected in v0.1."
    >
      <div className="mb-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-50/90">
        Hudl and similar video-platform integrations will be supported where API, export, embed, or licensed access is available.
        CoachCore tracks in-app watch time and engagement immediately.
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} title={integration.name} subtitle={integration.status}>
            Plugin shell only. Credentials and API access are intentionally not connected.
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
