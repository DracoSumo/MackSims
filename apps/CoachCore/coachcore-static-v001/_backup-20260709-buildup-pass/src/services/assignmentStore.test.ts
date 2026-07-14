import { beforeEach, describe, expect, it, vi } from "vitest";
import { isItemComplete, listCompletions, markComplete } from "./assignmentStore";

describe("assignmentStore", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "assignment-uuid",
    });
  });

  it("marks and lists completions", () => {
    markComplete({
      itemType: "workout",
      itemId: "speed-block",
      label: "Completed speed block",
    });
    const rows = listCompletions();
    expect(rows).toHaveLength(1);
    expect(rows[0].itemId).toBe("speed-block");
    expect(isItemComplete("workout", "speed-block")).toBe(true);
  });

  it("does not duplicate the same item", () => {
    markComplete({ itemType: "film", itemId: "clip-1", label: "Watched clip" });
    markComplete({ itemType: "film", itemId: "clip-1", label: "Watched clip again" });
    expect(listCompletions()).toHaveLength(1);
  });
});
