import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const freezePath = join(
  root,
  "supabase/migrations/20260731120000_freeze_team_organization_id.sql",
);
const hardenPath = join(
  root,
  "supabase/migrations/20260729190100_harden_security_definer_helpers.sql",
);

describe("team organization authz migration", () => {
  const freeze = readFileSync(freezePath, "utf8");
  const harden = readFileSync(hardenPath, "utf8");

  it("installs a trigger that freezes teams.organization_id", () => {
    expect(freeze).toContain("coachcore_guard_team_organization");
    expect(freeze).toContain("teams.organization_id is immutable");
    expect(freeze).toContain("before update on public.teams");
    expect(freeze).toContain("trg_coachcore_guard_team_organization");
  });

  it("documents that staff WITH CHECK alone cannot secure org reassignment", () => {
    expect(harden).toContain("trg_coachcore_guard_team_organization");
    expect(harden).toContain("is_team_staff(id) remains true after an org reassignment");
  });
});
