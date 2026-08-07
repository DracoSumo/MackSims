import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("instagram dispatch claim release", () => {
  it("releases claimed jobs back to approved instead of terminal failed", () => {
    const dispatch = readFileSync(join(root, "netlify/functions/instagram-dispatch.ts"), "utf8");
    expect(dispatch).toContain("releaseDispatchClaim");
    expect(dispatch).not.toMatch(/markFailed\s*\(/);

    const db = readFileSync(join(root, "netlify/functions/_shared/instagram-db.ts"), "utf8");
    expect(db).toContain("export async function releaseDispatchClaim");
    expect(db).toMatch(/SET state = 'approved'/);
    expect(db).toMatch(/meta_media_id IS NULL/);
    expect(db).toContain("dispatch_released");
  });
});
