import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

test("pullSupabase scopes private details and members to loaded trip ids", () => {
  assert.match(appJs, /trip_private_details'\)\.select\('\*'\)\.in\('trip_id', tripIds\)/);
  assert.match(appJs, /trip_members'\)\.select\('\*'\)\.in\('trip_id', tripIds\)/);
  assert.doesNotMatch(
    appJs,
    /from\('trip_private_details'\)\.select\('\*'\)\.limit\(LIVE_QUERY_LIMIT\)/,
  );
  assert.doesNotMatch(
    appJs,
    /from\('trip_members'\)\.select\('\*'\)\.limit\(LIVE_QUERY_LIMIT \* 2\)/,
  );
});

test("pullSupabase keeps prior local meetup pins when remote child rows are missing", () => {
  assert.match(appJs, /prevPrivateByTrip/);
  assert.match(
    appJs,
    /privateLocation:\s*privateByTrip\[t\.id\] \|\| prevPrivateByTrip\[t\.id\] \|\| 'Private details after approval'/,
  );
  assert.match(appJs, /memberMap\[t\.id\] \|\| prevMembersByTrip\[t\.id\]/);
});
