import { Card, SectionPage } from "@/components/SectionPage";
import { adminCards } from "@/data/mock";

export default function AdminPage() {
  return (
    <SectionPage
      eyebrow="Organization"
      title="Admin command center"
      description="For schools, clubs, gyms, trainers, and performance facilities managing multiple teams and coaches."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCards.map((card) => (
          <Card key={card.label} title={card.value} subtitle={card.label}>
            {card.note}
          </Card>
        ))}
      </div>
    </SectionPage>
  );
}
