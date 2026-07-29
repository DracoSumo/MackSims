/**
 * Local-first crew / ride-session store for MotoCrew.
 * Syncs to Supabase when signed in; never fabricates members or live GPS.
 */

export type CrewRole = "owner" | "admin" | "member";

export type Crew = {
  id: string;
  name: string;
  inviteCode: string;
  ownerUserId: string;
  createdAt: string;
};

export type CrewMember = {
  id: string;
  crewId: string;
  userId: string;
  role: CrewRole;
  displayName: string;
  status: "active" | "left";
  joinedAt: string;
};

export type RideSessionStatus = "planning" | "active" | "ended";

export type RideSession = {
  id: string;
  crewId: string;
  hostUserId: string;
  title: string;
  status: RideSessionStatus;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
};

export type CheckInStatus = "ok" | "delayed" | "need_help" | "off_bike" | "arrived";

export type RideCheckIn = {
  id: string;
  sessionId: string;
  userId: string;
  status: CheckInStatus;
  note: string;
  createdAt: string;
  pending?: boolean;
};

export type LocationPrecision = "off" | "approximate" | "precise";
export type PresenceStatus = "off" | "available" | "riding" | "delayed" | "need_help";

export type LocationShareSettings = {
  userId: string;
  precisionMode: LocationPrecision;
  shareWithCrew: boolean;
  presenceStatus: PresenceStatus;
  approxLabel: string;
  lat: number | null;
  lng: number | null;
  sessionExpiresAt: string | null;
  updatedAt: string;
};

export type CrewAlert = {
  id: string;
  crewId: string;
  actorUserId: string;
  kind: string;
  message: string;
  createdAt: string;
};

export type CrewState = {
  crews: Crew[];
  members: CrewMember[];
  sessions: RideSession[];
  checkIns: RideCheckIn[];
  location: LocationShareSettings | null;
  alerts: CrewAlert[];
  activeCrewId: string | null;
};

const STORAGE_KEY = "motocrew.crewState.v1";
let memoryRaw: string | null = null;

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readRaw(): string | null {
  if (typeof window === "undefined") return memoryRaw;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function writeRaw(value: string) {
  memoryRaw = value;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event("motocrew:crew-changed"));
  } catch {
    // keep memory fallback
  }
}

/** Test helper: reset in-memory / local crew state. */
export function resetCrewStateForTests() {
  memoryRaw = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

function inviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export function defaultLocation(userId: string): LocationShareSettings {
  return {
    userId,
    precisionMode: "off",
    shareWithCrew: false,
    presenceStatus: "available",
    approxLabel: "",
    lat: null,
    lng: null,
    sessionExpiresAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function emptyCrewState(): CrewState {
  return {
    crews: [],
    members: [],
    sessions: [],
    checkIns: [],
    location: null,
    alerts: [],
    activeCrewId: null,
  };
}

export function loadCrewState(): CrewState {
  try {
    const raw = readRaw();
    if (!raw) return emptyCrewState();
    const parsed = JSON.parse(raw) as CrewState;
    return {
      ...emptyCrewState(),
      ...parsed,
      crews: Array.isArray(parsed.crews) ? parsed.crews : [],
      members: Array.isArray(parsed.members) ? parsed.members : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
    };
  } catch {
    return emptyCrewState();
  }
}

export function saveCrewState(state: CrewState) {
  writeRaw(JSON.stringify(state));
}

export function createCrewLocal(name: string, ownerUserId: string, displayName: string): CrewState {
  const state = loadCrewState();
  const crew: Crew = {
    id: uid("crew"),
    name: name.trim() || "My Crew",
    inviteCode: inviteCode(),
    ownerUserId,
    createdAt: new Date().toISOString(),
  };
  const member: CrewMember = {
    id: uid("member"),
    crewId: crew.id,
    userId: ownerUserId,
    role: "owner",
    displayName: displayName.trim() || "You",
    status: "active",
    joinedAt: new Date().toISOString(),
  };
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId: crew.id,
    actorUserId: ownerUserId,
    kind: "member_joined",
    message: `${member.displayName} created crew “${crew.name}”.`,
    createdAt: new Date().toISOString(),
  };
  const next: CrewState = {
    ...state,
    crews: [crew, ...state.crews],
    members: [member, ...state.members],
    alerts: [alert, ...state.alerts].slice(0, 40),
    activeCrewId: crew.id,
  };
  saveCrewState(next);
  return next;
}

export function joinCrewByCodeLocal(
  code: string,
  userId: string,
  displayName: string,
): { ok: true; state: CrewState } | { ok: false; error: string } {
  const state = loadCrewState();
  const crew = state.crews.find((c) => c.inviteCode.toUpperCase() === code.trim().toUpperCase());
  if (!crew) return { ok: false, error: "No local crew matches that invite code on this device." };
  if (state.members.some((m) => m.crewId === crew.id && m.userId === userId && m.status === "active")) {
    return { ok: false, error: "You are already in this crew." };
  }
  const member: CrewMember = {
    id: uid("member"),
    crewId: crew.id,
    userId,
    role: "member",
    displayName: displayName.trim() || "Rider",
    status: "active",
    joinedAt: new Date().toISOString(),
  };
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId: crew.id,
    actorUserId: userId,
    kind: "member_joined",
    message: `${member.displayName} joined “${crew.name}”.`,
    createdAt: new Date().toISOString(),
  };
  const next: CrewState = {
    ...state,
    members: [member, ...state.members.filter((m) => !(m.crewId === crew.id && m.userId === userId))],
    alerts: [alert, ...state.alerts].slice(0, 40),
    activeCrewId: crew.id,
  };
  saveCrewState(next);
  return { ok: true, state: next };
}

export function leaveCrewLocal(crewId: string, userId: string): CrewState {
  const state = loadCrewState();
  const nextMembers = state.members.map((m) =>
    m.crewId === crewId && m.userId === userId ? { ...m, status: "left" as const } : m,
  );
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId,
    actorUserId: userId,
    kind: "member_left",
    message: "A member left the crew.",
    createdAt: new Date().toISOString(),
  };
  const stillIn = nextMembers.some((m) => m.userId === userId && m.status === "active");
  const next: CrewState = {
    ...state,
    members: nextMembers,
    alerts: [alert, ...state.alerts].slice(0, 40),
    activeCrewId: stillIn ? state.activeCrewId : state.crews.find((c) =>
      nextMembers.some((m) => m.crewId === c.id && m.userId === userId && m.status === "active"),
    )?.id ?? null,
  };
  saveCrewState(next);
  return next;
}

export function startSessionLocal(crewId: string, hostUserId: string, title: string): CrewState {
  const state = loadCrewState();
  const session: RideSession = {
    id: uid("session"),
    crewId,
    hostUserId,
    title: title.trim() || "Pack ride",
    status: "active",
    startedAt: new Date().toISOString(),
    endedAt: null,
    createdAt: new Date().toISOString(),
  };
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId,
    actorUserId: hostUserId,
    kind: "session_started",
    message: `Ride session “${session.title}” started.`,
    createdAt: new Date().toISOString(),
  };
  const next: CrewState = {
    ...state,
    sessions: [
      session,
      ...state.sessions.map((s) =>
        s.crewId === crewId && s.status === "active"
          ? { ...s, status: "ended" as const, endedAt: new Date().toISOString() }
          : s,
      ),
    ],
    alerts: [alert, ...state.alerts].slice(0, 40),
    activeCrewId: crewId,
  };
  saveCrewState(next);
  return next;
}

export function endSessionLocal(sessionId: string, actorUserId: string): CrewState {
  const state = loadCrewState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return state;
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId: session.crewId,
    actorUserId,
    kind: "session_ended",
    message: `Ride session “${session.title}” ended.`,
    createdAt: new Date().toISOString(),
  };
  const next: CrewState = {
    ...state,
    sessions: state.sessions.map((s) =>
      s.id === sessionId ? { ...s, status: "ended", endedAt: new Date().toISOString() } : s,
    ),
    alerts: [alert, ...state.alerts].slice(0, 40),
  };
  saveCrewState(next);
  return next;
}

export function addCheckInLocal(
  sessionId: string,
  userId: string,
  status: CheckInStatus,
  note = "",
): CrewState {
  const state = loadCrewState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session || session.status !== "active") return state;
  const checkIn: RideCheckIn = {
    id: uid("checkin"),
    sessionId,
    userId,
    status,
    note: note.trim(),
    createdAt: new Date().toISOString(),
    pending: false,
  };
  const alert: CrewAlert = {
    id: uid("alert"),
    crewId: session.crewId,
    actorUserId: userId,
    kind: "check_in",
    message: `Check-in: ${status.replace("_", " ")}${note ? ` — ${note.slice(0, 60)}` : ""}`,
    createdAt: new Date().toISOString(),
  };
  const next: CrewState = {
    ...state,
    checkIns: [checkIn, ...state.checkIns].slice(0, 80),
    alerts: [alert, ...state.alerts].slice(0, 40),
  };
  saveCrewState(next);
  return next;
}

export function updateLocationLocal(
  userId: string,
  patch: Partial<Omit<LocationShareSettings, "userId">>,
): CrewState {
  const state = loadCrewState();
  const base = state.location?.userId === userId ? state.location : defaultLocation(userId);
  let nextLoc: LocationShareSettings = {
    ...base,
    ...patch,
    userId,
    updatedAt: new Date().toISOString(),
  };
  if (nextLoc.precisionMode === "off") {
    nextLoc = {
      ...nextLoc,
      shareWithCrew: false,
      lat: null,
      lng: null,
      sessionExpiresAt: null,
      approxLabel: "",
    };
  } else if (nextLoc.precisionMode === "approximate") {
    nextLoc = { ...nextLoc, lat: null, lng: null };
  }
  const alertCrewId = state.activeCrewId;
  const alerts = alertCrewId
    ? [
        {
          id: uid("alert"),
          crewId: alertCrewId,
          actorUserId: userId,
          kind: "location_consent_changed",
          message: `Location sharing set to ${nextLoc.precisionMode}${nextLoc.shareWithCrew ? " (crew-visible)" : " (private)"}.`,
          createdAt: new Date().toISOString(),
        } satisfies CrewAlert,
        ...state.alerts,
      ].slice(0, 40)
    : state.alerts;
  const next: CrewState = { ...state, location: nextLoc, alerts };
  saveCrewState(next);
  return next;
}

export function activeSessionForCrew(state: CrewState, crewId: string | null): RideSession | null {
  if (!crewId) return null;
  return state.sessions.find((s) => s.crewId === crewId && s.status === "active") ?? null;
}

export function membersForCrew(state: CrewState, crewId: string | null): CrewMember[] {
  if (!crewId) return [];
  return state.members.filter((m) => m.crewId === crewId && m.status === "active");
}

export function alertsForCrew(state: CrewState, crewId: string | null): CrewAlert[] {
  if (!crewId) return [];
  return state.alerts.filter((a) => a.crewId === crewId).slice(0, 12);
}

export function checkInsForSession(state: CrewState, sessionId: string | null): RideCheckIn[] {
  if (!sessionId) return [];
  return state.checkIns.filter((c) => c.sessionId === sessionId).slice(0, 20);
}

export function isSessionStale(session: RideSession | null, maxHours = 8): boolean {
  if (!session || session.status !== "active" || !session.startedAt) return false;
  const started = Date.parse(session.startedAt);
  if (Number.isNaN(started)) return false;
  return Date.now() - started > maxHours * 60 * 60 * 1000;
}
