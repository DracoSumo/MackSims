import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const identityPath = join(
  root,
  "supabase/migrations/20260829120000_freeze_crew_member_identity.sql",
);
const basePath = join(
  root,
  "supabase/migrations/20260729191000_crew_circle_ride_sessions.sql",
);

describe("crew member identity freeze authz migration", () => {
  const identity = readFileSync(identityPath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs a BEFORE UPDATE trigger that freezes user_id and crew_id", () => {
    expect(identity).toContain("motocrew_guard_crew_member_identity");
    expect(identity).toContain("trg_motocrew_guard_crew_member_identity");
    expect(identity).toContain("crew_members.user_id is immutable");
    expect(identity).toContain("crew_members.crew_id is immutable");
    expect(identity).toContain("before update on public.crew_members");
  });

  it("documents the admin user_id remap bypass of invite-only enroll", () => {
    expect(identity).toMatch(/user_id/i);
    expect(identity).toMatch(/force-enroll|identity remap/i);
    expect(identity).toContain("share_with_crew");
  });

  it("keeps location SELECT gated on active mutual membership in base RLS", () => {
    expect(base).toContain("location settings select");
    expect(base).toContain("share_with_crew = true");
    expect(base).toContain("them.status = 'active'");
    expect(base).toContain("me.status = 'active'");
  });

  it("base UPDATE policy alone does not freeze user_id (regression contract)", () => {
    // Strip comments so we assert on live policy text.
    const stripComments = (sql: string) =>
      sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const baseLive = stripComments(base);
    expect(baseLive).toMatch(
      /create policy "crew_members update"[\s\S]*user_id = \(select auth\.uid\(\)\) or private\.motocrew_is_crew_admin\(crew_id\)/,
    );
    // Identity immutability lives in the forward migration trigger, not base RLS.
    expect(baseLive).not.toContain("crew_members.user_id is immutable");
  });
});
