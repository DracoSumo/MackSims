import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

test("duplicateTrip live-syncs private meetup details like saveTrip", () => {
  const duplicateFn = appJs.match(/async function duplicateTrip\(tripId\) \{[\s\S]*?\n  \}/);
  assert.ok(duplicateFn, "duplicateTrip function should exist");
  assert.match(
    duplicateFn[0],
    /liveUpsert\('trip_private_details',\s*tripPrivateRow\(copy\)/,
    "duplicateTrip must upsert trip_private_details for the copied trip",
  );
  assert.match(duplicateFn[0], /liveUpsert\('trip_posts',\s*tripRow\(copy\)/);
  assert.match(duplicateFn[0], /liveUpsert\('trip_members'/);
});
