import { MockActionPage, MockSelect } from "@/components/actions/MockActionPage";
import { athletes } from "@/data/mock";

export default function AthleteCheckInPage() {
  return (
    <MockActionPage
      eyebrow="Athlete action"
      title="Session check-in"
      description="Demo athlete check-in — records readiness locally until backend sync exists."
      resultTitle="Check-in staged"
      resultBody="Coach dashboard would update who checked in and readiness when a real backend is connected."
      buttonLabel="Submit check-in (demo)"
      successTitle="Check-in recorded in demo mode"
      successBody="This athlete's session presence and readiness would sync to the coach command center."
      timelineItems={[
        "Athlete marked present for today's session",
        "Readiness self-report staged for coach review",
        "Team accountability board would refresh",
      ]}
    >
      <MockSelect
        label="Athlete"
        options={athletes.map((a) => `${a.name} — ${a.role}`)}
      />
      <MockSelect
        label="Readiness (self-report)"
        options={["Locked in", "Showing up — need warmup", "Recovering / limited"]}
      />
    </MockActionPage>
  );
}
