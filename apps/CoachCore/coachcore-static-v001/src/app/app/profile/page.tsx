import { Card, SectionPage } from "@/components/SectionPage";
import { ProfileAuthPanel } from "@/components/auth/ProfileAuthPanel";

export default function ProfilePage() {
  return (
    <SectionPage
      eyebrow="Identity"
      title="Coach profile"
      description="Profile, role, organization, permissions, notification preferences, and future connected devices."
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
        <Card title="Connected devices" subtitle="Future wearable sync">
          <p>Apple Health: Planned</p>
          <p>Garmin: Plugin-ready</p>
          <p>WHOOP: Plugin-ready</p>
        </Card>
      </div>
    </SectionPage>
  );
}
