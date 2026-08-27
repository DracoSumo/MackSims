import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

function extractFn(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `missing function ${name}`);
  let i = appJs.indexOf("{", start);
  let depth = 0;
  for (; i < appJs.length; i++) {
    const ch = appJs[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        // eslint-disable-next-line no-new-func
        return new Function(`return (${appJs.slice(start, i + 1)})`)();
      }
    }
  }
  throw new Error(`unclosed function ${name}`);
}

const preferRemoteKeepLocalOnly = extractFn("preferRemoteKeepLocalOnly");

test("preferRemoteKeepLocalOnly keeps unsynced local businesses while remote wins on shared ids", () => {
  const local = [
    { id: "remote-1", name: "stale shop", campaign: "old offer" },
    { id: "local-only", name: "unsynced charter", campaign: "Dawn run" },
  ];
  const remote = [{ id: "remote-1", name: "live shop", campaign: "Live offer" }];
  const merged = preferRemoteKeepLocalOnly(local, remote);
  assert.deepEqual(
    merged.map((b) => ({ id: b.id, name: b.name, campaign: b.campaign })),
    [
      { id: "remote-1", name: "live shop", campaign: "Live offer" },
      { id: "local-only", name: "unsynced charter", campaign: "Dawn run" },
    ],
  );
});

test("preferRemoteKeepLocalOnly does not invent rows when local is empty", () => {
  const remote = [{ id: "a" }, { id: "b" }];
  assert.deepEqual(preferRemoteKeepLocalOnly([], remote), remote);
  assert.deepEqual(preferRemoteKeepLocalOnly(null, remote), remote);
});

test("pullSupabase preserves local-only businesses after remote hydrate", () => {
  assert.match(appJs, /function preferRemoteKeepLocalOnly\(/);
  assert.match(
    appJs,
    /state\.businesses = preferRemoteKeepLocalOnly\(state\.businesses, remoteBusinesses\)/,
  );
  assert.doesNotMatch(
    appJs,
    /if \(businessesRes\.data\?\.length\) \{\s*state\.businesses = businessesRes\.data\.map\(/,
  );
});
