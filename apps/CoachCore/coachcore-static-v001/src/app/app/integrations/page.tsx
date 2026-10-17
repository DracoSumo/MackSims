import { SectionPage } from "@/components/SectionPage";
import { IntegrationsCenter } from "@/components/integrations/IntegrationsCenter";

export default function IntegrationsPage() {
  return (
    <SectionPage
      eyebrow="Plugin-ready"
      title="Integration center"
      description="Connect Google Calendar when Google OAuth is ready. Request access for partner APIs (Hudl, wearables). No fake Connected states."
    >
      <IntegrationsCenter />
    </SectionPage>
  );
}
