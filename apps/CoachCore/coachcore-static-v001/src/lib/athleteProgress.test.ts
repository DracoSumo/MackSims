import { describe, expect, it } from "vitest";
import { athletePillars, overallProgress, parsePercent } from "@/lib/athleteProgress";

describe("athleteProgress", () => {
  it("parses percentage strings", () => {
    expect(parsePercent("94%")).toBe(94);
    expect(parsePercent("bad")).toBe(0);
  });

  it("computes pillar completion and overall score", () => {
    const pillars = athletePillars({
      film: "90%",
      workouts: "85%",
      meals: "70%",
      readiness: "80%",
      messagesComplete: true,
    });
    expect(pillars[0].complete).toBe(true);
    expect(overallProgress(pillars)).toBeGreaterThan(70);
  });
});
