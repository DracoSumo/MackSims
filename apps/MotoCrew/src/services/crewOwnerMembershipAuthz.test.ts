import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const protectPath = join(
  root,
  "supabase/migrations/20260808120000_protect_crew_owner_membership.sql",
);
const basePath = join(
  root,
  "supabase/migrations/20260729191000_crew_circle_ride_sessions.sql",
);

describe("crew owner membership protection", () => {
  const protect = readFileSync(protectPath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs DELETE/UPDATE guards for the founding owner membership", () => {
    expect(protect).toContain("motocrew_guard_crew_owner_membership");
    expect(protect).toContain("motocrew_is_founding_owner_membership");
    expect(protect).toContain("Cannot remove the crew owner membership");
    expect(protect).toContain("Cannot deactivate the crew owner membership");
    expect(protect).toContain("before update or delete on public.crew_members");
  });

  it("tightens DELETE RLS so founding owner rows are never removable", () => {
    expect(protect).toContain("not private.motocrew_is_founding_owner_membership(crew_id, user_id)");
    // Base migration historically allowed admin/self DELETE of any row including owner.
    expect(base).toMatch(/create policy "crew_members delete"[\s\S]*motocrew_is_crew_admin\(crew_id\)/);
  });
});
