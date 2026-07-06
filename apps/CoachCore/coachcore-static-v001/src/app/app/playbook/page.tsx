import { Card, SectionPage } from "@/components/SectionPage";
import { playbookItems } from "@/data/mock";

export default function PlaybookPage() {
  return (
    <SectionPage
      eyebrow="Install"
      title="Coach playbook"
      description="Build plays, drills, formations, practice plans, game plans, WOD standards, and coach notes."
    >
      <p className="mb-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50/90">
        Demo content only — mock playbook items with no live Hudl or team API connection.
      </p>
      <div className="mb-6 flex flex-wrap gap-3">
        <a href="/app/playbook/new" className="rounded-2xl bg-sky-400 px-5 py-3 font-black text-slate-950">
          Create Mock Playbook Item
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {playbookItems.map((item) => (
          <Card key={item.title} title={item.title} subtitle={`${item.type} • ${item.assigned}`}>
            <p>Status: {item.status}</p>
            <p>{item.note}</p>
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
