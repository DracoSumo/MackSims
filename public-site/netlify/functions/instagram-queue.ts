import type { Config } from "@netlify/functions";
import { requireAdmin } from "./_shared/auth.js";
import { createDraft, listQueue } from "./_shared/instagram-db.js";
import { validateQueueInput } from "./_shared/instagram-types.js";

export default async (request: Request): Promise<Response> => {
  const authError = requireAdmin(request);
  if (authError) return authError;

  if (request.method === "GET") {
    const limit = Number(new URL(request.url).searchParams.get("limit") ?? "50");
    return Response.json({ items: await listQueue(Number.isFinite(limit) ? limit : 50) });
  }
  if (request.method === "POST") {
    try {
      const input = validateQueueInput(await request.json());
      const result = await createDraft(input, "admin-api");
      return Response.json(result.record, { status: result.created ? 201 : 200 });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Invalid request" },
        { status: 400 },
      );
    }
  }
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: { Allow: "GET, POST" } });
};

export const config: Config = {
  path: "/api/admin/instagram/queue",
};
