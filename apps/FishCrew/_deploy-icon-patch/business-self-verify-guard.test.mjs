import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const root = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(root, 'app.js'), 'utf8');
const migration = readFileSync(
  join(root, 'supabase/migrations/20260829120000_block_business_self_verify.sql'),
  'utf8'
);

describe('FishCrew business self-verify guard', () => {
  it('ships a BEFORE INSERT/UPDATE trigger that blocks non-admin Verified', () => {
    assert.match(migration, /businesses_guard_verified_status/);
    assert.match(migration, /BEFORE INSERT OR UPDATE ON public\.businesses/);
    assert.match(migration, /Only operators can verify businesses/);
    assert.match(migration, /NEW\.status := 'Pending review'/);
    assert.match(migration, /public\.is_admin\(\)/);
  });

  it('client never upserts Verified for non-admin business rows', () => {
    assert.match(appJs, /function businessRow\(/);
    assert.match(
      appJs,
      /const status = !isAdmin\(\) && String\(b\.status \|\| ''\) === 'Verified'\s*\n\s*\? 'Pending review'\s*\n\s*: \(b\.status \|\| 'Lead'\);/
    );
    assert.match(appJs, /status: isAdmin\(\) \? 'Verified' : 'Pending review'/);
    assert.match(appJs, /async function verifyBusiness\(businessId\)/);
    assert.match(appJs, /if \(!requireAdmin\(\)\) return;/);
  });
});
