import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

test("pullSupabase loads trip_messages per loaded trip (newest-first tails)", () => {
  assert.match(appJs, /const MESSAGES_PER_TRIP = 40/);
  assert.match(
    appJs,
    /\.from\('trip_messages'\)\s*\n\s*\.select\('\*'\)\s*\n\s*\.eq\('trip_id', tripId\)\s*\n\s*\.order\('created_at', \{ ascending: false \}\)\s*\n\s*\.limit\(MESSAGES_PER_TRIP\)/,
  );
  assert.doesNotMatch(
    appJs,
    /from\('trip_messages'\)\.select\('\*'\)\.order\('created_at', \{ ascending: true \}\)\.limit\(LIVE_QUERY_LIMIT \* 2\)/,
  );
  assert.doesNotMatch(
    appJs,
    /from\('trip_messages'\)\.select\('\*'\)\.order\('created_at', \{ ascending: false \}\)\.limit\(LIVE_QUERY_LIMIT \* 2\)/,
  );
});

test("pullSupabase preserves prior local chat when a trip has no remote rows this pull", () => {
  assert.match(appJs, /Keep prior local tails when a trip got no remote rows this pull/);
  assert.match(
    appJs,
    /if \(!nextMessages\[tripId\] && prevMessages\[tripId\]\?\.length\) nextMessages\[tripId\] = prevMessages\[tripId\]/,
  );
  assert.doesNotMatch(appJs, /if \(messagesRes\.data\?\.length\) \{\s*state\.messages = \{\}/);
});

test("pullSupabase merges pending media assets instead of wiping on empty/partial windows", () => {
  assert.match(appJs, /if \(Array\.isArray\(mediaRes\.data\) && mediaRes\.data\.length\)/);
  assert.match(appJs, /retainedLocal/);
  assert.match(appJs, /\['Review', 'Local preview', 'Pending review'\]/);
  assert.doesNotMatch(
    appJs,
    /if \(Array\.isArray\(mediaRes\.data\)\) \{\s*state\.mediaAssets = mediaRes\.data\.map/,
  );
});
