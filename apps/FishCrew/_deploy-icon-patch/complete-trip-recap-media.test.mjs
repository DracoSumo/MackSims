import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

function sliceFn(name, maxLen = 2500) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `missing function ${name}`);
  return appJs.slice(start, start + maxLen);
}

test("buildTripCompletionRecap forces empty media on Live completion recaps", () => {
  const fn = sliceFn("buildTripCompletionRecap", 1200);
  assert.match(fn, /media:\s*''/);
  assert.match(fn, /mediaType:\s*''/);
  assert.match(fn, /status:\s*'Live'/);
  assert.doesNotMatch(fn, /media:\s*trip\.media/);
  assert.doesNotMatch(fn, /mediaType:\s*trip\.mediaType/);
});

test("completeTrip uses buildTripCompletionRecap instead of copying trip.media", () => {
  const fn = sliceFn("completeTrip", 2000);
  assert.match(fn, /const recap = buildTripCompletionRecap\(trip, user\)/);
  assert.doesNotMatch(fn, /media:\s*trip\.media/);
  assert.doesNotMatch(fn, /mediaType:\s*trip\.mediaType/);
  assert.match(fn, /liveUpsert\('feed_posts', feedRow\(recap\)/);
});

test("documents why trip media must not ride on Live completion recaps", () => {
  assert.match(
    appJs,
    /pending Review URL|crew-scoped|Copying trip\.media onto a Live recap/i,
  );
});
