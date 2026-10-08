import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(root, 'app.js'), 'utf8');
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
// Admin functions live in the 0.9.6 console migration and later ones (charters in 0.9.8).
const migration = ['20261008_admin_console.sql', '20261010_charter_claims.sql']
  .map((file) => readFileSync(join(root, 'supabase/migrations', file), 'utf8'))
  .join('\n');

function fnBody(name) {
  const start = Math.max(appJs.indexOf(`async function ${name}(`), appJs.indexOf(`function ${name}(`));
  assert.ok(start >= 0, `missing function ${name}`);
  const brace = appJs.indexOf(') {', start) + 2;
  let depth = 0;
  for (let i = brace; i < appJs.length; i += 1) {
    if (appJs[i] === '{') depth += 1;
    else if (appJs[i] === '}') {
      depth -= 1;
      if (depth === 0) return appJs.slice(brace, i + 1);
    }
  }
  assert.fail(`unclosed function ${name}`);
}

function actionKeys() {
  const start = appJs.indexOf('const ACTIONS = {');
  const end = appJs.indexOf('\n  };', start);
  assert.ok(start > 0 && end > start, 'ACTIONS map not found');
  const block = appJs.slice(start, end);
  return new Set([...block.matchAll(/^ {4}'?([a-z0-9-]+)'?:/gm)].map((m) => m[1]));
}

function sqlFunction(name) {
  const start = migration.indexOf(`create or replace function public.${name}(`);
  assert.ok(start >= 0, `migration lacks public.${name}`);
  const end = migration.indexOf('\n$$;', start);
  return migration.slice(start, end);
}

test('every button in the app has a handler', () => {
  const keys = actionKeys();
  const used = new Set([...`${appJs}\n${indexHtml}`.matchAll(/data-action="([a-z0-9-]+)"/g)].map((m) => m[1]));
  const missing = [...used].filter((a) => !keys.has(a));
  assert.deepEqual(missing, []);
});

test('admin console calls only server functions that check for the operator', () => {
  const called = new Set([...appJs.matchAll(/adminRpc\('([a-z_]+)'/g)].map((m) => m[1]));
  assert.ok(called.size >= 7, 'expected the admin console to use the admin RPCs');
  for (const name of called) {
    assert.match(name, /^admin_/);
    assert.match(sqlFunction(name), /perform public\.admin_assert\(\);/, `${name} must check is_admin()`);
    assert.match(migration, new RegExp(`revoke all on function public\\.${name}\\([^)]*\\) from public, anon, authenticated;`), `${name} must be revoked from anon`);
    assert.match(migration, new RegExp(`grant execute on function public\\.${name}\\([^)]*\\) to authenticated;`), `${name} must be granted to signed-in users only`);
    assert.doesNotMatch(migration, new RegExp(`grant execute on function public\\.${name}\\([^)]*\\) to [^;]*anon`), `${name} must not be granted to anon`);
  }
});

test('the console is operator-only on the client too', () => {
  assert.match(fnBody('openAdminConsole'), /requireAdmin\(/);
  assert.match(fnBody('adminClient'), /if \(!isAdmin\(\)\) throw/);
});

test('destructive admin buttons ask for a second tap', () => {
  assert.match(fnBody('adminRestrict'), /confirmTap\(/);
  assert.match(fnBody('adminLift'), /confirmTap\(/);
  assert.match(fnBody('adminDeleteBanner'), /confirmTap\(/);
  assert.match(fnBody('adminModerate'), /el\.dataset\.confirm && !confirmTap/);
});

test('banner text is escaped and links must be https', () => {
  const banner = fnBody('renderAnnouncementBanner');
  assert.match(banner, /safe\(a\.title\)/);
  assert.match(banner, /safe\(a\.body\)/);
  assert.match(banner, /rel="noopener noreferrer"/);
  assert.match(fnBody('refreshAnnouncements'), /link: httpsUrl\(/);
  assert.match(fnBody('adminSaveBanner'), /httpsUrl\(linkRaw\)/);
  assert.match(migration, /link_url is null or link_url ~ '\^https:\/\//);
});

test('guests can pull public boards without crew-only tables failing the pull', () => {
  const pull = fnBody('pullSupabase');
  assert.match(pull, /filter\(\(e\) => e && !isPermissionError\(e\)\)/);
  assert.match(fnBody('isPermissionError'), /42501/);
});

test('moderated trips and hidden messages stay off public views', () => {
  assert.match(fnBody('publicTrips'), /!isModeratedTrip\(t\)/);
  assert.match(fnBody('renderCrewBody'), /isAdmin\(\) \? messages : messages\.filter\(\(m\) => !m\.hiddenAt\)/);
  assert.match(migration, /create policy messages_hidden_admin_only on public\.trip_messages\s+as restrictive for select/);
});

test('sign-in keeps the saved profile instead of overwriting it from sign-up data', () => {
  const body = fnBody('ensureUserFromSupabase');
  assert.match(body, /maybeSingle\(\)/);
  assert.match(body, /supabaseClient && !existingProfile\)/);
  assert.doesNotMatch(body, /select\([^)]*\bemail\b/);
});

test('reports carry what was reported and who posted it', () => {
  const insert = fnBody('liveInsertModeration');
  assert.match(insert, /target_type: targetType \|\| null/);
  assert.match(insert, /target_user_id: report\.targetUserId \|\| null/);
  assert.match(fnBody('saveReport'), /targetUserId: info\.ownerId/);
  assert.match(migration, /add column if not exists target_type text/);
});

test('restricted accounts cannot post from the app', () => {
  for (const name of ['saveTrip', 'saveFeedPost', 'sendChat', 'requestTrip', 'saveProfile']) {
    assert.match(fnBody(name), /if \(blockIfRestricted\(\)\) return;/, `${name} should check restrictions`);
  }
  assert.match(migration, /restricted_users_no_insert/);
});
