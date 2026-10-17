import { Card, SectionPage } from "@/components/SectionPage";
import { ProfileAuthPanel } from "@/components/auth/ProfileAuthPanel";
import { ProfileIntegrationsSummary } from "@/components/integrations/ProfileIntegrationsSummary";

export default function ProfilePage() {
  return (
    <SectionPage
      eyebrow="Identity"
      title="Coach profile"
      description="Profile, role, organization, permissions, notification preferences, and connected plugins."
    >
      <Card title="Account" subtitle="Supabase OAuth (Google / GitHub)">
        <ProfileAuthPanel />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Coach Davis" subtitle="Head Coach • Varsity Football">
          <p>Organization: MackSims Demo Athletics</p>
          <p>Permissions: Coach admin</p>
          <p>Notification mode: Film, workouts, missed assignments</p>
        </Card>
        <Card title="Connected plugins" subtitle="Live status from Integrations">
          <ProfileIntegrationsSummary />
        </Card>
      </div>
    </SectionPage>
  );
}
