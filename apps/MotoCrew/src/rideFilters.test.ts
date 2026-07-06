import { describe, expect, it } from "vitest";
import { rides } from "./data/mockData";

function filterRides(
  items: typeof rides,
  filter: { status: string; pace: string; difficulty: string },
) {
  return items.filter((ride) => {
    const statusMatches = filter.status === "All" || ride.status === filter.status;
    const paceMatches = filter.pace === "All" || ride.pace === filter.pace;
    const difficultyMatches = filter.difficulty === "All" || ride.difficulty === filter.difficulty;
    return statusMatches && paceMatches && difficultyMatches;
  });
}

describe("ride filters", () => {
  it("returns all rides when filters are All", () => {
    expect(filterRides(rides, { status: "All", pace: "All", difficulty: "All" }).length).toBe(
      rides.length,
    );
  });

  it("filters by difficulty", () => {
    const easy = filterRides(rides, { status: "All", pace: "All", difficulty: "Easy" });
    expect(easy.every((ride) => ride.difficulty === "Easy")).toBe(true);
    expect(easy.length).toBeGreaterThan(0);
  });
});
