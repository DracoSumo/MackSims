import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appJs = readFileSync(join(here, "app.js"), "utf8");
const migration = readFileSync(
  join(here, "supabase/migrations/20260828130000_profiles_hide_email_from_clients.sql"),
  "utf8"
);

test("migration revokes profiles.email SELECT from anon/authenticated", () => {
  assert.match(migration, /REVOKE SELECT ON TABLE public\.profiles FROM anon, authenticated/i);
  assert.match(migration, /GRANT SELECT \(/i);
  assert.doesNotMatch(
    migration.replace(/--[^\n]*/g, ""),
    /GRANT SELECT \([^)]*\bemail\b[^)]*\) ON public\.profiles/i
  );
  assert.match(migration, /login_identifier_for_username/i);
  assert.match(migration, /auth\.users/i);
});

test("client profile upserts omit email field", () => {
  const upsertBlocks = [];
  const re = /\.from\(\s*['"]profiles['"]\s*\)[\s\S]{0,400}?upsert\s*\(/g;
  let match;
  while ((match = re.exec(appJs))) {
    upsertBlocks.push(appJs.slice(match.index, match.index + 500));
  }
  // Also catch liveUpsert('profiles', { ... })
  const liveIdx = appJs.indexOf("liveUpsert('profiles'");
  assert.ok(liveIdx >= 0, "expected liveUpsert profiles call");
  upsertBlocks.push(appJs.slice(liveIdx, liveIdx + 350));

  assert.ok(upsertBlocks.length >= 2, "expected multiple profiles write sites");
  for (const block of upsertBlocks) {
    assert.doesNotMatch(block, /\bemail\s*:/);
  }
});

test("live pull does not select profiles.email", () => {
  assert.match(
    appJs,
    /from\('profiles'\)\.select\('id, username, full_name, role, home_area, avatar_url, bio, fishing_styles, profile_theme, created_at'\)/
  );
  assert.doesNotMatch(
    appJs,
    /from\('profiles'\)\.select\([^)]*\bemail\b/
  );
});
