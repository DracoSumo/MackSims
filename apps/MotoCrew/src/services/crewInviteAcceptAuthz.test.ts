import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const invitePath = join(
  root,
  "supabase/migrations/20260828120000_crew_invite_accept_location.sql",
);
const basePath = join(
  root,
  "supabase/migrations/20260729191000_crew_circle_ride_sessions.sql",
);

describe("crew invite-accept location authz migration", () => {
  const invite = readFileSync(invitePath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs a trigger that blocks cross-user active enroll", () => {
    expect(invite).toContain("motocrew_guard_crew_member_invite");
    expect(invite).toContain("trg_motocrew_guard_crew_member_invite");
    expect(invite).toContain(
      "Cross-user crew enroll must use status=invited until the member accepts",
    );
    expect(invite).toContain("Only the invited user can accept crew membership");
    expect(invite).toContain("before insert or update on public.crew_members");
  });

  it("allows invited status in base + forward migration constraints", () => {
    expect(base).toMatch(/status in \('active', 'left', 'invited'\)/);
    expect(invite).toContain("crew_members_status_check");
    expect(invite).toMatch(/status in \('active', 'left', 'invited'\)/);
  });

  it("keeps location SELECT gated on active mutual membership", () => {
    expect(base).toContain("location settings select");
    expect(base).toContain("share_with_crew = true");
    expect(base).toContain("them.status = 'active'");
    expect(base).toContain("me.status = 'active'");
  });
});
