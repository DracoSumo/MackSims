import { enableDemoFixtures } from "@/config/demoFixtures";
import { athletes as fixtureAthletes } from "@/data/mock";
import { localGet, localSet } from "@/lib/safeStorage";

export type RosterAthlete = {
  id: string;
  name: string;
  role: string;
  status: string;
  lastActive: string;
  film: string;
  workouts: string;
  meals: string;
  readiness: string;
  note: string;
};

const STORAGE_KEY = "coachcore.athleteRoster";

function parseRoster(raw: string | null): RosterAthlete[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row): row is RosterAthlete => {
        return (
          !!row &&
          typeof row === "object" &&
          typeof (row as RosterAthlete).id === "string" &&
          typeof (row as RosterAthlete).name === "string"
        );
      })
      .map((row) => ({
        id: row.id,
        name: row.name.trim(),
        role: typeof row.role === "string" && row.role.trim() ? row.role.trim() : "Athlete",
        status: typeof row.status === "string" && row.status.trim() ? row.status : "Needs nudge",
        lastActive: typeof row.lastActive === "string" && row.lastActive.trim() ? row.lastActive : "Not yet",
        film: typeof row.film === "string" ? row.film : "—",
        workouts: typeof row.workouts === "string" ? row.workouts : "—",
        meals: typeof row.meals === "string" ? row.meals : "—",
        readiness: typeof row.readiness === "string" ? row.readiness : "—",
        note: typeof row.note === "string" ? row.note : "",
      }))
      .filter((row) => row.name.length > 0);
  } catch {
    return [];
  }
}

function persist(rows: RosterAthlete[]): RosterAthlete[] {
  localSet(STORAGE_KEY, JSON.stringify(rows.slice(0, 120)));
  void import("./localDataEvents").then(({ notifyLocalDataChanged }) =>
    notifyLocalDataChanged("roster"),
  );
  return rows;
}

export function listRosterAthletes(): RosterAthlete[] {
  if (typeof window === "undefined") return [];
  return parseRoster(localGet(STORAGE_KEY));
}

/**
 * Local roster wins when present. Demo fixtures only fill an empty roster when
 * NEXT_PUBLIC_ENABLE_DEMO_FIXTURES=true — never invent athletes in production.
 */
export function resolveAthletes(): RosterAthlete[] {
  const roster = listRosterAthletes();
  if (roster.length > 0) return roster;
  if (enableDemoFixtures) return fixtureAthletes as RosterAthlete[];
  return [];
}

export function getRosterAthlete(id: string): RosterAthlete | undefined {
  return resolveAthletes().find((athlete) => athlete.id === id);
}

function makeId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());
  return `ath_${slug || "athlete"}_${suffix}`;
}

export function addRosterAthlete(input: { name: string; role?: string; note?: string }): RosterAthlete {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Athlete name is required.");
  }

  const record: RosterAthlete = {
    id: makeId(name),
    name,
    role: input.role?.trim() || "Athlete",
    status: "Needs nudge",
    lastActive: "Not yet",
    film: "—",
    workouts: "—",
    meals: "—",
    readiness: "—",
    note: input.note?.trim() || "",
  };

  const next = [record, ...listRosterAthletes().filter((row) => row.id !== record.id)];
  persist(next);
  void import("./actionLogStore").then(({ logCoachAction }) =>
    logCoachAction("Roster", `Added ${record.name}`),
  );
  return record;
}

/** Paste one athlete name per line; optional "Name — Role" format. */
export function importRosterNames(raw: string): RosterAthlete[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const created: RosterAthlete[] = [];
  for (const line of lines) {
    const [namePart, rolePart] = line.split(/\s+[—\-]\s+/);
    const name = (namePart ?? "").trim();
    if (!name) continue;
    const existing = listRosterAthletes().find(
      (row) => row.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      created.push(existing);
      continue;
    }
    created.push(addRosterAthlete({ name, role: rolePart?.trim() }));
  }
  return created;
}

export function removeRosterAthlete(id: string): void {
  const before = listRosterAthletes();
  const removed = before.find((row) => row.id === id);
  persist(before.filter((row) => row.id !== id));
  if (removed) {
    void import("./actionLogStore").then(({ logCoachAction }) =>
      logCoachAction("Roster", `Removed ${removed.name}`),
    );
  }
}

export function replaceRoster(athletes: RosterAthlete[]): RosterAthlete[] {
  return persist(athletes);
}
