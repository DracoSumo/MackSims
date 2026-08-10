import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

function fnBody(name) {
  const re = new RegExp(`(?:async )?function ${name}\\([\\s\\S]*?\\n  \\}\\n`);
  const match = appJs.match(re);
  assert.ok(match, `expected function ${name}`);
  return match[0];
}

test("cancelTrip declines pending join_requests on the live write path", () => {
  const body = fnBody("cancelTrip");
  assert.match(body, /pendingRequestIds/);
  assert.match(
    body,
    /liveUpdate\('join_requests', \{ status: 'Declined' \}, 'id', requestId/,
  );
  assert.match(body, /request decline on cancel/);
});

test("approveRequest refuses closed trips so cancelled pins stay locked", () => {
  const body = fnBody("approveRequest");
  assert.match(body, /String\(trip\.status \|\| 'Open'\) !== 'Open'/);
  assert.match(body, /cannot unlock the private meetup pin/);
});

test("saveBooking and openBookingForm are scoped to owned listings", () => {
  const openBody = fnBody("openBookingForm");
  const saveBody = fnBody("saveBooking");
  assert.match(openBody, /b\.ownerId === user\?\.id/);
  assert.match(openBody, /Add your own business listing before capturing leads/);
  assert.doesNotMatch(
    openBody,
    /\$\{state\.businesses\.map\(\(b\)=>`<option value="\$\{safe\(b\.id\)\}"/,
  );
  assert.match(saveBody, /That listing belongs to another partner/);
  assert.match(saveBody, /owned\.find\(\(b\) => b\.id === bizId\)/);
});

test("Instagram OAuth callback fails closed when state is missing or mismatched", () => {
  const body = fnBody("maybeHandleInstagramOAuthCallback");
  assert.match(body, /if \(!expected \|\| !stateToken \|\| expected !== stateToken\)/);
  assert.match(body, /fishcrew\.ig\.oauth\.uid/);
  assert.match(body, /Sign in before connecting Instagram/);
  assert.doesNotMatch(body, /if \(expected && stateToken && expected !== stateToken\)/);
});
