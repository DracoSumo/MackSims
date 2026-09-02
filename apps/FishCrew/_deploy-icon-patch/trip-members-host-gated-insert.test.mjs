import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(root, 'supabase/migrations/20260902120000_trip_members_host_gated_insert.sql'),
  'utf8',
);
const appJs = readFileSync(join(root, 'app.js'), 'utf8');

function fnBody(name) {
  const re = new RegExp(`(?:async )?function ${name}\\([\\s\\S]*?\\n  \\}\\n`);
  const match = appJs.match(re);
  assert.ok(match, `expected function ${name}`);
  return match[0];
}

describe('FishCrew trip_members host-gated INSERT', () => {
  it('ships host helper and replaces open self-enroll INSERT policy', () => {
    assert.match(migration, /fishcrew_is_trip_host/);
    assert.match(migration, /t\.host_id::text = \(auth\.uid\(\)\)::text/);
    assert.match(migration, /DROP POLICY IF EXISTS %I ON public\.trip_members/);
    assert.match(migration, /trip_members_insert_host_or_admin/);
    assert.match(
      migration,
      /CREATE POLICY trip_members_insert_host_or_admin\s+ON public\.trip_members\s+FOR INSERT\s+TO authenticated\s+WITH CHECK \(public\.fishcrew_is_trip_host\(trip_id::text\)\);/,
    );
  });

  it('freezes membership identity and allows self-leave DELETE', () => {
    assert.match(migration, /fishcrew_guard_trip_member_identity/);
    assert.match(migration, /trip_members\.trip_id and user_id are immutable/);
    assert.match(migration, /trip_members_delete_self_host_or_admin/);
    assert.match(migration, /user_id = \(auth\.uid\(\)\)::text/);
  });

  it('client still relies on host approval path for membership grants', () => {
    const approve = fnBody('approveRequest');
    assert.match(approve, /Only the host or operator can approve this request/);
    assert.match(approve, /liveUpsert\('trip_members'/);
    assert.match(approve, /user_id: req\.userId/);
    const save = fnBody('saveTrip');
    assert.match(save, /liveUpsert\('trip_members'/);
    assert.match(save, /member_role: 'host'/);
  });
});
