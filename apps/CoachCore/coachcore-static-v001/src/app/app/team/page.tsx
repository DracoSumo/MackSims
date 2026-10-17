import { SectionPage } from "@/components/SectionPage";
import { TeamRosterPanel } from "@/components/TeamRosterPanel";
import { coachCoreConfig } from "@/config/coachcore";
import { CrossLinkStrip } from "@/components/ui/CoachCards";

export default function TeamPage() {
  return (
    <SectionPage
      eyebrow="Roster"
      title="Team command center"
      description="Manage athletes, groups, coach roles, team status, and accountability from one roster view."
    >
      <p className="text-sm text-slate-400">{coachCoreConfig.athleteTodayPrompt}</p>
      <div className="mt-4">
        <CrossLinkStrip current="Team" />
      </div>
      <TeamRosterPanel />
    </SectionPage>
  );
}
