import { localGet, localSet } from "@/lib/safeStorage";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/config/backend";

export type TeamContext = {
  organizationId: string;
  teamId: string;
  role: string;
};

const CACHE_KEY = "coachcore.defaultTeamContext";

type MembershipRow = { team_id: string; role: string | null };
type OrgRow = { id: string };
type TeamRow = { id: string; organization_id: string };

export function getCachedTeamContext(): TeamContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localGet(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TeamContext>;
    if (!parsed.organizationId || !parsed.teamId) return null;
    return {
      organizationId: parsed.organizationId,
      teamId: parsed.teamId,
      role: parsed.role || "coach",
    };
  } catch {
    return null;
  }
}

export function setCachedTeamContext(ctx: TeamContext | null): void {
  if (typeof window === "undefined") return;
  if (!ctx) {
    localSet(CACHE_KEY, "");
    return;
  }
  localSet(CACHE_KEY, JSON.stringify(ctx));
}

export function clearCachedTeamContext(): void {
  setCachedTeamContext(null);
}

/**
 * Ensure the signed-in coach has an organization, primary team, and staff membership.
 * Soft-fails (returns null) when org/team tables are missing — owner_user_id sync still works.
 */
export async function ensureDefaultTeamContext(userId: string, displayName?: string): Promise<TeamContext | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;

  const cached = getCachedTeamContext();
  if (cached) {
    // Verify membership still readable; keep cache if query fails softly.
    const { data, error } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", userId)
      .eq("team_id", cached.teamId)
      .maybeSingle();
    if (!error && data) {
      return {
        organizationId: cached.organizationId,
        teamId: cached.teamId,
        role: data.role || cached.role || "coach",
      };
    }
  }

  try {
    // 1) Existing membership
    const { data: memberships, error: memberErr } = await supabase
      .from("team_members")
      .select("team_id, role")
      .eq("user_id", userId)
      .limit(1);

    if (!memberErr && memberships && memberships.length > 0) {
      const membership = memberships[0] as MembershipRow;
      const { data: team } = await supabase
        .from("teams")
        .select("id, organization_id")
        .eq("id", membership.team_id)
        .maybeSingle();
      if (team) {
        const ctx: TeamContext = {
          organizationId: (team as TeamRow).organization_id,
          teamId: membership.team_id,
          role: membership.role || "coach",
        };
        setCachedTeamContext(ctx);
        return ctx;
      }
    }

    // 2) Owned organization
    let organizationId: string | null = null;
    const { data: orgs, error: orgErr } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_user_id", userId)
      .limit(1);

    if (orgErr) {
      // Tables likely missing — owner-scoped sync remains available.
      return null;
    }

    if (orgs && orgs.length > 0) {
      organizationId = (orgs[0] as OrgRow).id;
    } else {
      const orgName = displayName ? `${displayName}'s organization` : "My organization";
      const { data: createdOrg, error: createOrgErr } = await supabase
        .from("organizations")
        .insert({ owner_user_id: userId, name: orgName })
        .select("id")
        .single();
      if (createOrgErr || !createdOrg) return null;
      organizationId = (createdOrg as OrgRow).id;
    }

    // 3) Primary team under org
    let teamId: string | null = null;
    const { data: teams } = await supabase
      .from("teams")
      .select("id, organization_id")
      .eq("organization_id", organizationId)
      .limit(1);

    if (teams && teams.length > 0) {
      teamId = (teams[0] as TeamRow).id;
    } else {
      const { data: createdTeam, error: createTeamErr } = await supabase
        .from("teams")
        .insert({ organization_id: organizationId, name: "Primary team" })
        .select("id, organization_id")
        .single();
      if (createTeamErr || !createdTeam) return null;
      teamId = (createdTeam as TeamRow).id;
    }

    // 4) Coach membership
    const { error: upsertMemberErr } = await supabase.from("team_members").upsert(
      {
        team_id: teamId,
        user_id: userId,
        role: "coach",
      },
      { onConflict: "team_id,user_id" },
    );
    if (upsertMemberErr) return null;

    const ctx: TeamContext = {
      organizationId,
      teamId,
      role: "coach",
    };
    setCachedTeamContext(ctx);
    return ctx;
  } catch {
    return null;
  }
}
