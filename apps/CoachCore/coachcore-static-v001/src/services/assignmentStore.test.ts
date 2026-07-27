import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAssignmentStatus,
  listAssignmentStatuses,
  setAssignmentStatus,
} from "./assignmentStore";

describe("assignmentStore", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    };
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
      dispatchEvent: () => true,
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "test-uuid",
    });
  });

  it("returns fallback when no status is stored", () => {
    expect(getAssignmentStatus("film-1", "Assigned")).toBe("Assigned");
  });

  it("sets and gets assignment status", () => {
    setAssignmentStatus("film-1", "In progress");
    expect(getAssignmentStatus("film-1", "Assigned")).toBe("In progress");
  });

  it("lists all assignment statuses", () => {
    setAssignmentStatus("film-1", "Complete");
    setAssignmentStatus("workout-1", "Needs nudge");
    const all = listAssignmentStatuses();
    expect(all["film-1"]).toBe("Complete");
    expect(all["workout-1"]).toBe("Needs nudge");
  });
});
