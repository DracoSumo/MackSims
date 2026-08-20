import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(root, 'app.js'), 'utf8');

function fnBody(name) {
  const patterns = [`async function ${name}(`, `function ${name}(`];
  let start = -1;
  for (const p of patterns) {
    start = appJs.indexOf(p);
    if (start >= 0) break;
  }
  assert.ok(start >= 0, `missing function ${name}`);
  // Skip default-arg `{}` in the signature; open on the body brace after params.
  const sigEnd = appJs.indexOf(') {', start);
  assert.ok(sigEnd > start, `missing body for ${name}`);
  const brace = sigEnd + 2;
  let depth = 0;
  for (let i = brace; i < appJs.length; i += 1) {
    const ch = appJs[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return appJs.slice(brace, i + 1);
    }
  }
  assert.fail(`unclosed function ${name}`);
}

test('crew chat helpers gate membership and scrub local chat on logout/switch', () => {
  assert.match(appJs, /function isTripCrewMember\(/);
  assert.match(appJs, /function scrubCrewChatLocalState\(/);
  assert.match(fnBody('scrubCrewChatLocalState'), /state\.messages = \{\}/);
  assert.match(fnBody('scrubCrewChatLocalState'), /state\.activeTripId = ''/);
});

test('chat panel does not render message bodies for non-members', () => {
  const body = fnBody('renderCrewBody');
  assert.match(body, /const messages = member \? \(state\.messages\[trip\.id\] \|\| \[\]\) : \[\]/);
  assert.match(body, /Crew chat locked/);
  assert.match(body, /const chatLog = member/);
  assert.doesNotMatch(
    body,
    /Private meetup:<\/strong> \$\{member \? safe\(trip\.privateLocation\) : 'Locked until approval\.'\}<\/p><div class="chat-log">\$\{messages\.map/,
  );
});

test('renderCrew refuses activeTripId outside membership', () => {
  const body = fnBody('renderCrew');
  assert.match(body, /active && isTripCrewMember\(active, user\)/);
  assert.doesNotMatch(body, /visibleTrips\[0\] \|\| state\.trips\[0\]/);
});

test('openTripChat blocks non-members from selecting a chat trip', () => {
  const body = fnBody('openTripChat');
  assert.match(body, /if \(!isTripCrewMember\(trip\)\)/);
  assert.match(body, /state\.activeTripId = ''/);
});

test('logout and account switch scrub crew chat local state', () => {
  assert.match(fnBody('logout'), /scrubCrewChatLocalState\(\)/);
  assert.match(fnBody('ensureUserFromSupabase'), /scrubCrewChatLocalState\(\)/);
});
