import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(root, 'app.js'), 'utf8');
const migration = readFileSync(join(root, 'supabase/migrations/20261011_push_notifications.sql'), 'utf8');
const fnDir = join(root, 'supabase/functions/push-dispatch');
const fnSource = readFileSync(join(fnDir, 'index.ts'), 'utf8');

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
  const end = migration.indexOf('\n$', migration.indexOf('as $', start) + 4);
  return migration.slice(start, end);
}

/* ------------------------------------------------------------------ migration */

test('push_devices is RLS-locked with no client grants or policies', () => {
  assert.match(migration, /user_id uuid not null references auth\.users\(id\) on delete cascade/);
  assert.match(migration, /token text not null unique/);
  assert.match(migration, /check \(platform in \('ios'\)\)/);
  assert.match(migration, /alter table public\.push_devices enable row level security;/);
  assert.match(migration, /revoke all on table public\.push_devices from public, anon, authenticated;/);
  assert.doesNotMatch(migration, /create policy[^;]*push_devices/i);
  assert.doesNotMatch(migration, /grant [^;]* on table public\.push_devices to (anon|authenticated|public)/i);
});

test('device RPCs are security definer, pinned search_path, signed-in only', () => {
  for (const name of ['register_push_device', 'unregister_push_device']) {
    const body = sqlFunction(name);
    assert.match(body, /security definer/);
    assert.match(body, /set search_path = pg_catalog, public/);
    assert.match(body, /auth\.uid\(\)/);
  }
  for (const sig of ['register_push_device(text, text, text)', 'unregister_push_device(text)']) {
    assert.ok(migration.includes(`revoke all on function public.${sig} from public, anon, authenticated;`), `revoke ${sig}`);
    assert.ok(migration.includes(`grant execute on function public.${sig} to authenticated;`), `grant ${sig}`);
  }
  const reg = sqlFunction('register_push_device');
  assert.match(reg, /on conflict \(token\) do update\s+set user_id = excluded\.user_id/);
  assert.match(sqlFunction('unregister_push_device'), /and user_id = auth\.uid\(\)/);
});

test('trigger functions are security definer with an empty search_path and never raise', () => {
  for (const name of ['fc_trg_bookings_notify', 'fc_trg_notifications_push']) {
    const body = sqlFunction(name);
    assert.match(body, /security definer/);
    assert.match(body, /set search_path to ''/);
    assert.match(body, /exception\s+when others then\s+(?:--[^\n]*\s+)?raise warning '[^']+', sqlerrm;\s+return new;\s+end;$/);
    const beforeHandler = body.slice(0, body.lastIndexOf('exception'));
    assert.doesNotMatch(beforeHandler, /raise exception/);
    assert.ok(migration.includes(`revoke all on function public.${name}() from public, anon, authenticated;`));
  }
});

test('bookings notify the owner on insert and the customer on status change', () => {
  const body = sqlFunction('fc_trg_bookings_notify');
  assert.match(body, /where c\.id = coalesce\(new\.charter_id, new\.business_id\)/);
  assert.match(body, /from public\.businesses b/);
  assert.match(body, /if coalesce\(v_owner, ''\) = '' or v_owner = coalesce\(new\.customer_id, ''\) then\s+return new;/);
  assert.match(body, /'booking_requested'/);
  assert.match(body, /old\.status is distinct from new\.status/);
  assert.match(body, /new\.customer_id,\s+nullif\(v_actor, ''\),\s+'booking_status'/);
  assert.match(migration, /after insert or update of status on public\.bookings/);
});

test('notification push trigger uses pg_net with a Vault secret and skips when it is missing', () => {
  assert.match(migration, /create extension if not exists pg_net with schema extensions;/);
  const body = sqlFunction('fc_trg_notifications_push');
  assert.match(body, /from vault\.decrypted_secrets s\s+where s\.name = 'push_webhook_secret'/);
  assert.match(body, /if coalesce\(v_secret, ''\) = '' then\s+return new;/);
  assert.match(body, /net\.http_post\(/);
  assert.match(body, /'x-push-secret', v_secret/);
  assert.match(body, /if not exists \(select 1 from public\.push_devices d/);
  assert.match(migration, /after insert on public\.notifications\s+for each row execute function public\.fc_trg_notifications_push\(\);/);
});

/* ------------------------------------------------------------------ app.js */

test('push never prompts at launch', () => {
  const boot = fnBody('boot');
  assert.match(boot, /setupPushListeners\(\);/);
  assert.doesNotMatch(boot, /enablePush|requestPermissions/);
  const listeners = fnBody('setupPushListeners');
  assert.doesNotMatch(listeners, /requestPermissions/);
  assert.match(listeners, /perm\?\.receive === 'granted'\) await push\.register\(\)/);
  // The only permission request lives in enablePush, reached from Settings or an in-context offer.
  assert.equal(appJs.split('requestPermissions(').length - 1, 1);
  assert.match(fnBody('enablePush'), /push\.requestPermissions\(\)/);
});

test('push is offered in context: settings toggle, after an inquiry, in the leads inbox', () => {
  assert.match(fnBody('openUserSettings'), /isNativePush\(\) \? `<button class="settings-tile" type="button" data-action="toggle-push">/);
  assert.match(fnBody('saveCharterInquiry'), /offerPushAfterInquiry\(\);\s+\}$/);
  assert.match(fnBody('openBusinessLeads'), /\$\{leads\.length \? pushLeadsOffer\(\) : ''\}/);
  assert.match(fnBody('saveUserSettings'), /state\.notificationPref === 'Quiet' && state\.pushEnabled\) disablePush\(\)/);
  for (const action of ['toggle-push', 'enable-push', 'dismiss-push-offer']) assert.ok(appJs.includes(`'${action}':`), `action ${action}`);
});

test('isNativePush only answers yes inside the iOS shell with the plugin', () => {
  const body = fnBody('pushPlugin');
  assert.match(body, /cap\.isNativePlatform\(\)/);
  assert.match(body, /cap\.getPlatform\(\) !== 'ios'/);
  assert.match(body, /isPluginAvailable\('PushNotifications'\)/);
});

test('tokens go to the RPCs, and sign-out or account deletion drops them first', () => {
  assert.match(fnBody('sendPushToken'), /rpc\('register_push_device', \{ p_token: token, p_platform: 'ios', p_app_version: VERSION \}\)/);
  assert.match(fnBody('disablePush'), /rpc\('unregister_push_device', \{ p_token: token \}\)/);
  const logout = fnBody('logout');
  assert.ok(logout.indexOf('await disablePush({ quiet: true });') >= 0, 'logout unregisters');
  assert.ok(logout.indexOf('await disablePush({ quiet: true });') < logout.indexOf('auth.signOut()'), 'before the session ends');
  const del = fnBody('confirmDeleteAccount');
  assert.ok(del.indexOf('await disablePush({ quiet: true });') >= 0 && del.indexOf('await disablePush') < del.indexOf("rpc('delete_own_account')"));
});

test('tapping a push opens its in-app link with the app router', () => {
  assert.match(fnBody('setupPushListeners'), /'pushNotificationActionPerformed', \(action\) => openPushLink\(action\?\.notification\?\.data\?\.link\)/);
  const open = fnBody('openPushLink');
  assert.match(open, /if \(url\.origin !== location\.origin\) return;/);
  assert.match(open, /nav\(url\.searchParams\.get\('screen'\) \|\| 'home'\)/);
  assert.match(open, /open === 'leads'\) openBusinessLeads\(\)/);
  assert.match(open, /open === 'inquiries'\) openMyBookings\(\)/);
});

/* ------------------------------------------------------------------ edge function */

test('push-dispatch checks the secret and uses the FishCrew topic', () => {
  assert.match(fnSource, /const TOPIC = 'com\.chrissims\.fishcrew';/);
  assert.match(fnSource, /req\.headers\.get\('x-push-secret'\)/);
  assert.match(fnSource, /env\('PUSH_WEBHOOK_SECRET'\)/);
  assert.match(fnSource, /SUPABASE_SERVICE_ROLE_KEY/);
});

async function loadHandler() {
  globalThis.Deno = globalThis.Deno || { env: { get: () => undefined }, serve: () => {} };
  try {
    return (await import(pathToFileURL(join(fnDir, 'index.ts')).href)).handle;
  } catch (error) {
    return null; // this Node cannot strip TypeScript types
  }
}

test('push-dispatch sends to the user\'s devices, drops dead tokens, records errors', async (t) => {
  const handle = await loadHandler();
  if (!handle) return t.skip('TypeScript stripping unavailable in this Node');
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const env = {
    PUSH_WEBHOOK_SECRET: 's3cret-value',
    SUPABASE_URL: 'https://db.test',
    SUPABASE_SERVICE_ROLE_KEY: 'service',
    APNS_KEY_ID: 'KEY1234567',
    APNS_TEAM_ID: 'TEAM123456',
    APNS_KEY: privateKey.export({ type: 'pkcs8', format: 'pem' }),
  };
  const get = (k) => env[k];
  const nid = '11111111-2222-3333-4444-555555555555';
  const uid = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  const good = 'a'.repeat(64), dead = 'b'.repeat(64), flaky = 'c'.repeat(64);
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const u = String(url);
    if (u.startsWith('https://db.test/rest/v1/notifications')) {
      return new Response(JSON.stringify([{ id: nid, user_id: uid, title: 'New charter inquiry', body: 'Sam asked', entity_id: 'book_1', link_path: '/?screen=home&open=leads', read_at: null }]));
    }
    if (u.startsWith('https://db.test/rest/v1/push_devices?user_id=')) {
      return new Response(JSON.stringify([{ token: good }, { token: dead }, { token: flaky }]));
    }
    if (u.startsWith('https://db.test/rest/v1/push_devices')) return new Response(null, { status: 204 });
    if (u.includes(`/3/device/${good}`)) return new Response('', { status: 200 });
    if (u.includes(`/3/device/${dead}`)) return new Response(JSON.stringify({ reason: 'Unregistered' }), { status: 410 });
    if (u.includes(`/3/device/${flaky}`)) return new Response(JSON.stringify({ reason: 'TooManyRequests' }), { status: 429 });
    throw new Error(`unexpected fetch ${u}`);
  };
  try {
    const bad = await handle(new Request('https://fn/push', { method: 'POST', headers: { 'x-push-secret': 'nope' }, body: JSON.stringify({ notification_id: nid }) }), get);
    assert.equal(bad.status, 401);
    assert.equal(calls.length, 0);

    const res = await handle(new Request('https://fn/push', { method: 'POST', headers: { 'x-push-secret': env.PUSH_WEBHOOK_SECRET }, body: JSON.stringify({ notification_id: nid }) }), get);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { sent: 1, dead: 1, failed: 1 });

    const apns = calls.filter((c) => c.url.startsWith('https://api.push.apple.com/3/device/'));
    assert.equal(apns.length, 3);
    assert.equal(apns[0].init.headers['apns-topic'], 'com.chrissims.fishcrew');
    const payload = JSON.parse(apns[0].init.body);
    assert.deepEqual(payload.aps.alert, { title: 'New charter inquiry', body: 'Sam asked' });
    assert.equal(payload.aps['thread-id'], 'book_1');
    assert.equal(payload.link, '/?screen=home&open=leads');
    assert.equal(payload.notificationId, nid);

    const del = calls.find((c) => c.init.method === 'DELETE');
    assert.equal(del.url, `https://db.test/rest/v1/push_devices?token=in.(${dead})`);
    const patch = calls.find((c) => c.init.method === 'PATCH');
    assert.equal(patch.url, `https://db.test/rest/v1/push_devices?token=eq.${flaky}`);
    assert.match(JSON.parse(patch.init.body).last_error, /^429 TooManyRequests$/);
    assert.equal(calls.find((c) => c.url.includes('/rest/v1/notifications')).init.headers.authorization, 'Bearer service');
  } finally {
    globalThis.fetch = realFetch;
  }
});
