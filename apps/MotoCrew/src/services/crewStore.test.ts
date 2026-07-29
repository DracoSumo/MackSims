import { beforeEach, describe, expect, it } from "vitest";
import {
  activeSessionForCrew,
  addCheckInLocal,
  createCrewLocal,
  emptyCrewState,
  endSessionLocal,
  isSessionStale,
  joinCrewByCodeLocal,
  resetCrewStateForTests,
  startSessionLocal,
  updateLocationLocal,
} from "./crewStore";

describe("crewStore", () => {
  beforeEach(() => {
    resetCrewStateForTests();
  });

  it("creates a crew with owner membership", () => {
    const state = createCrewLocal("Night Pack", "user-1", "Alex");
    expect(state.crews[0]?.name).toBe("Night Pack");
    expect(state.members[0]?.role).toBe("owner");
    expect(state.activeCrewId).toBe(state.crews[0]?.id);
  });

  it("joins by invite code and starts/ends a session with check-ins", () => {
    const created = createCrewLocal("Valley Riders", "user-1", "Alex");
    const code = created.crews[0]!.inviteCode;
    const joined = joinCrewByCodeLocal(code, "user-2", "Blake");
    expect(joined.ok).toBe(true);
    if (!joined.ok) return;
    const started = startSessionLocal(created.crews[0]!.id, "user-1", "Dawn ride");
    const session = activeSessionForCrew(started, created.crews[0]!.id);
    expect(session?.status).toBe("active");
    const withCheckIn = addCheckInLocal(session!.id, "user-2", "ok", "at meet");
    expect(withCheckIn.checkIns[0]?.status).toBe("ok");
    const ended = endSessionLocal(session!.id, "user-1");
    expect(ended.sessions.find((s) => s.id === session!.id)?.status).toBe("ended");
  });

  it("keeps precise coords off when precision is approximate/off", () => {
    let state = emptyCrewState();
    state = updateLocationLocal("user-1", {
      precisionMode: "precise",
      shareWithCrew: true,
      lat: 35.1,
      lng: -85.2,
      approxLabel: "Chattanooga",
    });
    expect(state.location?.lat).toBe(35.1);
    state = updateLocationLocal("user-1", { precisionMode: "approximate", approxLabel: "Near meet" });
    expect(state.location?.lat).toBeNull();
    expect(state.location?.approxLabel).toBe("Near meet");
    state = updateLocationLocal("user-1", { precisionMode: "off" });
    expect(state.location?.shareWithCrew).toBe(false);
    expect(state.location?.approxLabel).toBe("");
  });

  it("detects stale active sessions", () => {
    const stale = isSessionStale({
      id: "s1",
      crewId: "c1",
      hostUserId: "u1",
      title: "Old",
      status: "active",
      startedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      endedAt: null,
      createdAt: new Date().toISOString(),
    });
    expect(stale).toBe(true);
  });
});
