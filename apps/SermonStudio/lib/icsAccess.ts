/**
 * Authorization helpers for /api/ics.
 *
 * Church calendar feeds are intentionally token-gated (calendar clients cannot
 * send a user JWT). Single-sermon export must use the same gate — never a bare
 * sermonId against the service role.
 */

export type IcsAccess =
  | { ok: false; status: 401 | 400; error: string }
  | { ok: true; mode: "single"; sermonId: string; token: string }
  | { ok: true; mode: "feed"; token: string; from: string | null; to: string | null };

export function resolveIcsAccess(params: {
  sermonId: string | null;
  token: string | null;
  from?: string | null;
  to?: string | null;
}): IcsAccess {
  const sermonId = params.sermonId?.trim() || null;
  const token = params.token?.trim() || null;
  const from = params.from?.trim() || null;
  const to = params.to?.trim() || null;

  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "A valid church feed token is required",
    };
  }

  if (sermonId) {
    return { ok: true, mode: "single", sermonId, token };
  }

  return { ok: true, mode: "feed", token, from, to };
}

/** Hide cross-church existence: wrong token or missing row → same 404. */
export function sermonVisibleToChurch(
  sermon: { church_id: string | null } | null | undefined,
  churchId: string,
): boolean {
  return Boolean(sermon && sermon.church_id && sermon.church_id === churchId);
}
