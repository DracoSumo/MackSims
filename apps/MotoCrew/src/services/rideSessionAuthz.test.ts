import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const hardenPath = join(
  root,
  "supabase/migrations/20260731120000_harden_ride_session_authz.sql",
);
const basePath = join(
  root,
  "supabase/migrations/20260729191000_crew_circle_ride_sessions.sql",
);

describe("ride session authz migration", () => {
  const harden = readFileSync(hardenPath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs a trigger that freezes crew_id and guards host reassignment", () => {
    expect(harden).toContain("motocrew_guard_ride_session");
    expect(harden).toContain("ride_sessions.crew_id is immutable");
    expect(harden).toContain("Only crew admins can reassign ride session host");
    expect(harden).toContain("Ride session host must be an active crew member");
    expect(harden).toContain("before update on public.ride_sessions");
  });

  it("requires crew membership on ride_sessions UPDATE WITH CHECK", () => {
    const stripComments = (sql: string) =>
      sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

    for (const sql of [harden, base]) {
      const rideUpdate = stripComments(sql).match(
        /create policy "ride_sessions update"[\s\S]*?;/,
      )?.[0];
      expect(rideUpdate).toBeTruthy();
      expect(rideUpdate).toContain("private.motocrew_is_crew_member(crew_id)");
      // Host-only WITH CHECK (no membership) was the injection hole.
      expect(rideUpdate).not.toMatch(
        /with check\s*\(\s*host_user_id = \(select auth\.uid\(\)\)\s*or private\.motocrew_is_crew_admin/,
      );
    }
  });
});
