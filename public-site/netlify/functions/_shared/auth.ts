import { timingSafeEqual } from "node:crypto";

const ADMIN_SECRET_NAMES = [
  "INSTAGRAM_PUBLISH_ADMIN_SECRET",
  "MACKSIMS_INSTAGRAM_ADMIN_SECRET",
] as const;

function safeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function getInstagramAdminSecret(): string | undefined {
  for (const name of ADMIN_SECRET_NAMES) {
    const value = Netlify.env.get(name);
    if (value) return value;
  }
  return undefined;
}

export function requireAdmin(request: Request): Response | null {
  const configured = getInstagramAdminSecret();
  if (!configured) return Response.json({ error: "Admin authentication is not configured" }, { status: 503 });

  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!supplied || !safeEqual(supplied, configured)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function requireDispatch(request: Request): Response | null {
  const configured = getInstagramAdminSecret();
  const supplied = request.headers.get("x-instagram-dispatch-secret") ?? "";
  if (!configured) return Response.json({ error: "Dispatch authentication is not configured" }, { status: 503 });
  if (!supplied || !safeEqual(supplied, configured)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
