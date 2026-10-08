// Guards for the 2026-10-09 QA pass: CSS url() escaping, honest offline saves, quiet startup,
// shipped headers and checklist, readable characters, and the trip_private_details policy fix.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const appJs = read('app.js');

test('every url() inside a style attribute goes through cssUrl()', () => {
  const raw = [...appJs.matchAll(/url\('\$\{(?!cssUrl\()/g)];
  assert.equal(raw.length, 0, `unescaped url() interpolations: ${raw.length}`);
  assert.ok(appJs.includes('const cssUrl = (value) =>'), 'cssUrl helper missing');
});

test('cssUrl() keeps a URL from breaking out of url(\'...\') or the attribute', () => {
  const safeLine = appJs.match(/const safe = \(value\) => [^\n]+/)[0];
  const cssLine = appJs.match(/const cssUrl = \(value\) => [^\n]+/)[0];
  const cssUrl = new Function(`${safeLine}\n${cssLine}\nreturn cssUrl;`)();
  const evil = "https://x.test/a.png');position:fixed;inset:0;background:url('https://evil.test/p.png";
  const out = cssUrl(evil);
  assert.ok(!/['()]/.test(out), out);
  assert.ok(!/\s/.test(out), out);
  assert.equal(cssUrl('"><img src=x>').includes('<'), false);
  assert.equal(cssUrl('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
  assert.equal(cssUrl('https://kkyuychvitrmtehvzqfd.supabase.co/storage/v1/object/public/fishcrew-media/a.jpg'), 'https://kkyuychvitrmtehvzqfd.supabase.co/storage/v1/object/public/fishcrew-media/a.jpg');
});

test('a failed shared save is reported and not covered by a success toast', () => {
  assert.match(appJs, /async function afterLocalWrite\(label, liveTask\) \{[\s\S]*?return false;\n    \}\n  \}/);
  assert.match(appJs, /if \(tone !== 'danger' && Date\.now\(\) < holdToastUntil\) return;/);
  assert.match(appJs, /holdToastUntil = 0;\n      fn\(el, event\);/);
});

test('an unsent chat message is taken back and its text kept in the box', () => {
  const start = appJs.indexOf('async function sendChat(');
  const body = appJs.slice(start, appJs.indexOf('\n  }\n', start));
  assert.match(body, /const delivered = await afterLocalWrite\('Chat message'/);
  assert.match(body, /if \(!delivered\) \{[\s\S]*filter\(\(m\) => m\.id !== msg\.id\)[\s\S]*again\.value = body/);
  assert.ok(body.indexOf("toast('Message sent.')") > body.indexOf('if (!delivered)'));
});

test('startup does not toast about the data connection; the Check button still does', () => {
  assert.ok(!appJs.includes("toast('Shared data connection ready.')"));
  assert.match(appJs, /'check-backend': \(\) => checkBackend\(\{ announce: true \}\)/);
});

test('CSP allows video and audio from https (feed and trip videos)', () => {
  for (const f of ['netlify.toml', '_headers']) {
    assert.match(read(f), /media-src 'self' data: blob: https:/, f);
  }
});

test('the morning checklist PDF exists and ships with the site', () => {
  const pdf = 'downloads/fishcrew-morning-window-checklist.pdf';
  assert.ok(existsSync(join(root, pdf)));
  assert.equal(readFileSync(join(root, pdf)).subarray(0, 5).toString(), '%PDF-');
  assert.ok(appJs.includes(`href="${pdf}"`));
  const dist = read('scripts/prepare-dist.mjs');
  assert.ok(dist.includes(`'${pdf}'`) && dist.includes("'_headers'"));
});

test('shipped text has no mis-encoded characters (â€” and friends)', () => {
  for (const f of ['app.js', 'index.html', 'config.js', 'early-access.html', 'early-access.js', 'privacy.html', 'terms.html', 'support.html', 'account-delete.html']) {
    assert.ok(!/â€|Ã[¢\u0083]|Â[ -¿]/.test(read(f)), f);
  }
});

test('trip_private_details writes require hosting the trip', () => {
  const sql = read('supabase/migrations/20261009_qa_hardening.sql');
  for (const name of ['trip_private_details_insert', 'trip_private_details_update']) {
    const start = sql.indexOf(`create policy ${name}`);
    assert.ok(start > 0, name);
    const stmt = sql.slice(start, sql.indexOf(');\n', start));
    assert.match(stmt, /exists \(\s*select 1 from public\.trip_posts t\s*where t\.id = trip_private_details\.trip_id\s*and t\.host_id = \(select auth\.uid\(\)\)::text/);
  }
  assert.match(sql, /drop policy if exists trip_private_details_host_write/);
  const code = sql.split('\n').filter((l) => !l.trim().startsWith('--')).join('\n')
    .replace(/\( SELECT auth\.uid\(\) AS uid\)/g, '').replace(/\(select auth\.uid\(\)\)/g, '');
  assert.ok(!code.includes('auth.uid()'), 'unwrapped auth.uid() left');
});
