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

  it("stores assignment records with metadata", async () => {
    const { listAssignmentRecords } = await import("./assignmentStore");
    setAssignmentStatus("film-1", "Complete", {
      title: "Route stem",
      kind: "film",
      assignee: "Skill group",
    });
    const records = listAssignmentRecords();
    expect(records[0]?.title).toBe("Route stem");
    expect(records[0]?.kind).toBe("film");
    expect(records[0]?.status).toBe("Complete");
  });

  it("creates assignment records with generated ids", async () => {
    const { createAssignment, listAssignmentRecords } = await import("./assignmentStore");
    const record = createAssignment({
      title: "Acceleration block",
      kind: "training",
      assignee: "Jordan Lee",
    });
    expect(record.id.startsWith("asg_")).toBe(true);
    expect(listAssignmentRecords()[0]?.assignee).toBe("Jordan Lee");
    expect(getAssignmentStatus(record.id, "Assigned")).toBe("Assigned");
  });
});