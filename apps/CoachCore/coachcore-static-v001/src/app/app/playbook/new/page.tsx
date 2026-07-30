import { MockActionPage, MockField, MockSelect, MockTextarea } from "@/components/actions/MockActionPage";

export default function NewPlaybookPage() {
  return (
    <MockActionPage
      eyebrow="Create install"
      title="Add a play, drill, or movement standard"
      description="Interactive preview for coach playbooks, sport installs, practice plans, and functional fitness movement standards."
      resultTitle="Playbook item published to the selected group"
      resultBody="CoachCore would publish this install to the assigned group once a live team backend is connected."
      buttonLabel="Record playbook preview"
      successTitle="Playbook preview recorded"
      successBody="A generic activity marker was stored locally; playbook field values were not saved. No Hudl, team API, or athlete notification was used."
      actionLabel="Playbook draft"
      timelineItems={[
        "Generic playbook preview activity recorded locally.",
        "Playbook and group field values left unsaved.",
        "No backend, database, or partner API write was made.",
      ]}
    >
      <MockField label="Title" placeholder="Cover 2 shell / Thruster standard" />
      <MockSelect
        label="Type"
        options={[
          "Play",
          "Drill",
          "Game plan",
          "Practice plan",
          "Movement standard",
          "Functional fitness WOD standard",
        ]}
      />
      <MockField label="Assigned group" placeholder="Varsity defense / Morning class" />
      <MockTextarea
        label="Coach notes"
        placeholder="Responsibilities, standards, or teaching points"
      />
    </MockActionPage>
  );
}
