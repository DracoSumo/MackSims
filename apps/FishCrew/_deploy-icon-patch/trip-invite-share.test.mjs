import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const app = readFileSync(join(root, 'app.js'), 'utf8');
const config = readFileSync(join(root, 'config.js'), 'utf8');

test('trip invite URL helpers and share actions exist', () => {
  for (const needle of [
    'function tripInviteUrl(',
    'function tripIdFromUrl(',
    'function shareTrip(',
    'function copyTripInvite(',
    'function shareTripPlatform(',
    'function openTripInvite(',
    'function consumePendingTripInvite(',
    "'share-trip':",
    "'copy-trip-invite':",
    'pendingTripId'
  ]) {
    assert.match(app, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('deep link boot opens trip invites', () => {
  assert.match(app, /tripIdFromUrl\(\)/);
  assert.match(app, /openTripInvite\(tripId\)/);
  assert.match(app, /consumePendingTripInvite\(\)/);
});

test('approved-only membership pull and host invite CTAs', () => {
  assert.match(app, /status \|\| 'Approved'\) !== 'Approved'/);
  assert.match(app, /data-action="share-trip"/);
  assert.match(app, /Share invite link/);
});

test('config marks trip invite share live at 0.8.0', () => {
  assert.match(config, /VERSION:\s*'0\.8\.0'/);
  assert.match(config, /tripInviteShare:\s*'live'/);
  assert.match(config, /DEMO_MODE:\s*false/);
});
