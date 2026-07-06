import { Card, SectionPage } from "@/components/SectionPage";
import { channels } from "@/data/mock";

export default function ChatPage() {
  return (
    <SectionPage
      eyebrow="Communication"
      title="Team and group chats"
      description="Full team messages, coach-only planning, parent announcements, position groups, and training channels."
    >
      <div className="mb-6 rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
        <p className="font-black text-sky-100">Pinned coach announcement</p>
        <p className="mt-2 text-sm text-sky-50/80">Film, playbook, and hydration checks are due before tomorrow&apos;s session.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {channels.map((channel) => (
          <Card key={channel.name} title={channel.name} subtitle={channel.description}>
            {channel.latest}
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
