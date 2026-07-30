import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const hardenPath = join(
  root,
  "supabase/migrations/20260730110000_harden_crew_membership_authz.sql",
);
const basePath = join(
  root,
  "supabase/migrations/20260729191000_crew_circle_ride_sessions.sql",
);

describe("crew membership authz migration", () => {
  const harden = readFileSync(hardenPath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs triggers that block role self-escalation and owner reassignment", () => {
    expect(harden).toContain("motocrew_guard_crew_member_role");
    expect(harden).toContain("motocrew_guard_crew_owner");
    expect(harden).toContain("Cannot change own crew role");
    expect(harden).toContain("crews.owner_user_id is immutable");
    expect(harden).toContain("Crew joins require an admin invite");
    expect(harden).toContain("before insert or update on public.crew_members");
    expect(harden).toContain("before update on public.crews");
  });

  it("does not keep the open self-insert or owner tautology policies", () => {
    expect(harden).toContain("crew_members insert founding owner or admin");
    expect(harden).not.toMatch(
      /create policy "crew_members insert self or admin"[\s\S]*user_id = \(select auth\.uid\(\)\)\s*or private\.motocrew_is_crew_admin/,
    );
    // Strip SQL comments, then assert WITH CHECK never uses the NEW-row tautology.
    const stripComments = (sql: string) =>
      sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(stripComments(harden)).not.toMatch(/owner_user_id\s*=\s*crews\.owner_user_id/);
    expect(stripComments(base)).not.toMatch(/owner_user_id\s*=\s*crews\.owner_user_id/);
    expect(base).toContain("crew_members insert founding owner or admin");
  });
});
