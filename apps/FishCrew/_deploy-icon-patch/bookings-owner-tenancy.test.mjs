import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(root, 'supabase/migrations/20260829140000_bookings_owner_tenancy_rls.sql'),
  'utf8'
);
const appJs = readFileSync(join(root, 'app.js'), 'utf8');

function fnBody(name) {
  const re = new RegExp(`(?:async )?function ${name}\\([\\s\\S]*?\\n  \\}\\n`);
  const match = appJs.match(re);
  assert.ok(match, `expected function ${name}`);
  return match[0];
}

describe('FishCrew bookings owner tenancy RLS', () => {
  it('ships fishcrew_owns_business helper and replaces bookings policies', () => {
    assert.match(migration, /fishcrew_owns_business/);
    assert.match(migration, /b\.owner_id = \(auth\.uid\(\)\)::text/);
    assert.match(migration, /DROP POLICY IF EXISTS %I ON public\.bookings/);
    assert.match(migration, /bookings_select_owner_customer_or_admin/);
    assert.match(migration, /bookings_insert_owner_or_admin/);
    assert.match(migration, /WITH CHECK \(public\.fishcrew_owns_business\(business_id\)\)/);
    assert.match(
      migration,
      /customer_id IS NOT NULL\s*\n\s*AND customer_id = \(auth\.uid\(\)\)::text/
    );
  });

  it('client booking form/save are scoped to owned listings (defense in depth)', () => {
    const openBody = fnBody('openBookingForm');
    const saveBody = fnBody('saveBooking');
    assert.match(openBody, /b\.ownerId === user\?\.id/);
    assert.match(openBody, /Add your own business listing before capturing leads/);
    assert.doesNotMatch(
      openBody,
      /\$\{state\.businesses\.map\(\(b\)=>`<option value="\$\{safe\(b\.id\)\}"/
    );
    assert.match(saveBody, /That listing belongs to another partner/);
    assert.match(saveBody, /owned\.find\(\(b\) => b\.id === bizId\)/);
  });
});
