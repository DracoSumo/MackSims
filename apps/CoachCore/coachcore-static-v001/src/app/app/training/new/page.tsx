import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function NewTrainingPage() {
  return (
    <MockActionPage
      eyebrow="Create workout"
      title="Build a training assignment"
      description="Interactive preview for team workouts, individual blocks, recovery sessions, and functional fitness WODs."
      resultTitle="Workout assigned to the selected group"
      resultBody="CoachCore would assign this workout to the selected group once a live training backend is connected."
      buttonLabel="Record workout preview"
      successTitle="Workout preview recorded"
      successBody="A generic activity marker was stored locally; workout field values were not saved. No athlete push, calendar sync, or team database write was made."
      actionLabel="Training draft"
      timelineItems={[
        "Generic workout preview activity recorded locally.",
        "Workout and group field values left unsaved.",
        "No backend, database, or partner API write was made.",
      ]}
    >
      <MockField label="Workout title" placeholder="Tuesday speed block" />
      <MockSelect
        label="Session type"
        options={[
          "Speed block",
          "Strength",
          "Recovery",
          "Functional fitness WOD",
          "Conditioning",
        ]}
      />
      <MockField label="Assigned group" placeholder="JV / Varsity / Individual" />
      <MockTextarea
        label="Exercises and notes"
        placeholder="Exercises, notes, and coach instructions"
      />
    </MockActionPage>
  );
}
