import type { Config, Context } from "@netlify/functions";
import { requireAdmin } from "./_shared/auth.js";
import { approveDraft } from "./_shared/instagram-db.js";

export default async (request: Request, context: Context): Promise<Response> => {
  const authError = requireAdmin(request);
  if (authError) return authError;
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "POST" } });
  }

  const body = (await request.json().catch(() => null)) as {
    approvedBy?: unknown;
    queueNow?: unknown;
  } | null;
  const approvedBy = typeof body?.approvedBy === "string" ? body.approvedBy.trim() : "";
  if (!approvedBy || approvedBy.length > 200) {
    return Response.json({ error: "approvedBy is required and must be 200 characters or fewer" }, { status: 400 });
  }
  if (body?.queueNow !== undefined && typeof body.queueNow !== "boolean") {
    return Response.json({ error: "queueNow must be a boolean" }, { status: 400 });
  }

  const record = await approveDraft(context.params.id, approvedBy, {
    queueNow: body?.queueNow === true,
  });
  if (!record) {
    return Response.json({ error: "Draft not found or no longer approvable" }, { status: 409 });
  }
  return Response.json(record);
};

export const config: Config = {
  path: "/api/admin/instagram/queue/:id/approve",
};
