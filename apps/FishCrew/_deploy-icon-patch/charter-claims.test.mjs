import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(root, 'app.js'), 'utf8');
const migration = readFileSync(join(root, 'supabase/migrations/20261010_charter_claims.sql'), 'utf8');

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

function sqlFunction(name) {
  const start = migration.indexOf(`create or replace function public.${name}(`);
  assert.ok(start >= 0, `migration lacks public.${name}`);
  return migration.slice(start, migration.indexOf('\n$$;', start));
}

test('claim emails sit in a table no client role can touch', () => {
  assert.match(migration, /alter table public\.charter_claims enable row level security;/);
  assert.match(migration, /revoke all on table public\.charter_claims from public, anon, authenticated;/);
  assert.doesNotMatch(migration, /create policy[^;]*charter_claims/i);
  assert.doesNotMatch(migration, /grant [^;]* on table public\.charter_claims/i);
});

test('operator functions check for the operator first', () => {
  for (const name of ['admin_save_managed_charter', 'admin_list_charters']) {
    const body = sqlFunction(name);
    assert.match(body, /security definer/);
    assert.match(body, /set search_path = pg_catalog, public/);
    assert.match(body.slice(body.indexOf('begin')), /^begin\s+perform public\.admin_assert\(\);/);
  }
});

test('a claim needs a confirmed email, an unrestricted account and an unowned listing', () => {
  const body = sqlFunction('claim_my_charters');
  assert.match(body, /email_confirmed_at/);
  assert.match(body, /if v_email is null or v_confirmed is null then\s+return;/);
  assert.match(body, /if public\.is_restricted\(\) then\s+return;/);
  assert.match(body, /cc\.claimed_at is null/);
  assert.match(body, /c\.owner_id is null/);
  assert.match(body, /lower\(cc\.claim_email\) = v_email/);
});

test('new functions are revoked from anon and granted only to signed-in users', () => {
  for (const sig of [
    'admin_save_managed_charter(text, text, text, text, text, text, text, integer, integer, text, text, text, text, text)',
    'admin_list_charters()',
    'claim_my_charters()'
  ]) {
    assert.ok(migration.includes(`revoke all on function public.${sig} from public, anon, authenticated;`), `revoke ${sig}`);
    assert.ok(migration.includes(`grant execute on function public.${sig} to authenticated;`), `grant ${sig}`);
  }
});

test('sign-in tries to claim waiting charters, and failures stay quiet', () => {
  assert.match(fnBody('ensureUserFromSupabase'), /await claimWaitingCharters\(user\);/);
  const claim = fnBody('claimWaitingCharters');
  assert.match(claim, /rpc\('claim_my_charters'\)/);
  assert.match(claim, /if \(error\) return \[\];/);
  assert.match(claim, /catch \(_\) \{\s+return \[\];/);
});

test('admin console has a Charters tab wired to the server functions', () => {
  assert.match(appJs, /\['charters', 'Charters'\]/);
  assert.match(fnBody('loadAdminTab'), /adminRpc\('admin_list_charters'\)/);
  assert.match(fnBody('adminSaveCharter'), /adminRpc\('admin_save_managed_charter'/);
  const save = fnBody('adminSaveCharter');
  for (const key of ['p_id', 'p_name', 'p_area', 'p_species', 'p_boat_type', 'p_trip_types', 'p_availability', 'p_price_from', 'p_price_to', 'p_website_url', 'p_bio', 'p_claim_email', 'p_consent_note', 'p_status']) {
    assert.ok(save.includes(`${key}:`), `adminSaveCharter sends ${key}`);
    assert.ok(sqlFunction('admin_save_managed_charter').includes(key), `server takes ${key}`);
  }
});

test('managed listings say so on the card, the profile and the inquiry', () => {
  assert.match(fnBody('charterCard'), /isManagedListing\(listing\) \? 'Managed by FishCrew'/);
  assert.match(fnBody('openCharterProfile'), /isManagedListing\(listing\)/);
  assert.match(fnBody('openCharterInquiry'), /FishCrew manages this listing/);
});

test('a customer inquiry no longer writes someone else\'s business row', () => {
  const body = fnBody('saveCharterInquiry');
  assert.match(body, /const canWriteBiz = Boolean\(biz\) && \(biz\.ownerId === user\.id \|\| isAdmin\(\)\);/);
  assert.match(body, /if \(canWriteBiz && liveBiz && await liveUpsertBusiness\(biz\)\)/);
  assert.match(body, /if \(canWriteBiz && liveBiz\) await liveUpdate\('businesses'/);
  assert.doesNotMatch(body, /\n\s+if \(biz && String\(biz\.id\)\.startsWith\('biz_'\)\) await liveUpsertBusiness/);
  assert.match(fnBody('ensureCharterBusiness'), /localOnly: true/);
});
