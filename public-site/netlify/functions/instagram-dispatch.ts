import type { Config } from "@netlify/functions";
import { getInstagramAdminSecret } from "./_shared/auth.js";
import { claimDueApproved, markFailed } from "./_shared/instagram-db.js";

export default async (request: Request): Promise<Response> => {
  const secret = getInstagramAdminSecret();
  if (!secret) throw new Error("INSTAGRAM_PUBLISH_ADMIN_SECRET is not configured");

  const jobs = await claimDueApproved(5);
  const endpoint = new URL("/.netlify/functions/instagram-publish-background", request.url);

  await Promise.all(
    jobs.map(async (job) => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-instagram-dispatch-secret": secret,
          },
          body: JSON.stringify({ id: job.id, lockToken: job.lockToken }),
        });
        if (!response.ok) throw new Error(`Background dispatch returned HTTP ${response.status}`);
      } catch (error) {
        await markFailed(
          job.id,
          job.lockToken!,
          error instanceof Error ? `Dispatch failed: ${error.message}` : "Background dispatch failed",
        );
      }
    }),
  );

  return Response.json({ claimed: jobs.length });
};

export const config: Config = {
  schedule: "*/10 * * * *",
};
