import { describe, expect, it } from "vitest";
import { buildSermonIcs } from "./localIcs";
import type { Sermon } from "./types";

const sample: Sermon = {
  id: "sermon-1",
  title: "Renewed Minds",
  theme: "faith",
  date: "2026-07-15",
  passages: ["Romans 12:2"],
  notes: "Pray for openness.",
  setlist: [],
  isSeriesItem: false,
  seriesId: "",
  outline: { keyPoints: [], illustrations: [], application: "" },
};

describe("buildSermonIcs", () => {
  it("emits a valid VCALENDAR block with event summary", () => {
    const ics = buildSermonIcs(sample);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Renewed Minds");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });
});
