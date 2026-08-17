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

test("preferRemoteKeepLocalOnly keeps unsynced local trips while remote wins on shared ids", () => {
  const local = [
    { id: "remote-1", title: "stale local copy", privateLocation: "old pin" },
    { id: "local-only", title: "unsynced meetup", privateLocation: "Secret pier" },
  ];
  const remote = [{ id: "remote-1", title: "live copy", privateLocation: "Live pier" }];
  const merged = preferRemoteKeepLocalOnly(local, remote);
  assert.deepEqual(
    merged.map((t) => ({ id: t.id, title: t.title, privateLocation: t.privateLocation })),
    [
      { id: "remote-1", title: "live copy", privateLocation: "Live pier" },
      { id: "local-only", title: "unsynced meetup", privateLocation: "Secret pier" },
    ],
  );
});

test("preferRemoteKeepLocalOnly does not invent rows when local is empty", () => {
  const remote = [{ id: "a" }, { id: "b" }];
  assert.deepEqual(preferRemoteKeepLocalOnly([], remote), remote);
  assert.deepEqual(preferRemoteKeepLocalOnly(null, remote), remote);
});

test("pullSupabase preserves local-only trips/feed/bookings/requests after remote hydrate", () => {
  assert.match(appJs, /function preferRemoteKeepLocalOnly\(/);
  assert.match(appJs, /state\.trips = preferRemoteKeepLocalOnly\(state\.trips, remoteTrips\)/);
  assert.match(appJs, /state\.feed = preferRemoteKeepLocalOnly\(state\.feed, remoteFeed\)/);
  assert.match(appJs, /state\.bookings = preferRemoteKeepLocalOnly\(state\.bookings, remoteBookings\)/);
  assert.match(appJs, /state\.requests = preferRemoteKeepLocalOnly\(state\.requests, remoteRequests\)/);
  assert.doesNotMatch(
    appJs,
    /if \(tripsRes\.data\?\.length\) \{\s*const privateByTrip[\s\S]*?state\.trips = tripsRes\.data\.map\(/,
  );
  assert.doesNotMatch(
    appJs,
    /if \(Array\.isArray\(feedRes\.data\) && feedRes\.data\.length\) \{\s*state\.feed = feedRes\.data\.map\(/,
  );
});
