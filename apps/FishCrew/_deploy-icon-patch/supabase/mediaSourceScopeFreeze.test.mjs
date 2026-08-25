import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = dirname(fileURLToPath(import.meta.url));
const freezePath = join(root, "migrations/20260825_freeze_media_source_scope.sql");
const basePath = join(root, "migrations/20260727_harden_ugc_media_visibility_rls.sql");

const stripComments = (sql) =>
  sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

describe("media source scope freeze", () => {
  const freeze = readFileSync(freezePath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs a trigger that freezes source_id and source_type for non-admins", () => {
    assert.match(freeze, /media_assets_freeze_source_scope/);
    assert.match(freeze, /source_id is immutable after upload/);
    assert.match(freeze, /source_type is immutable after upload/);
    assert.match(freeze, /BEFORE UPDATE ON public\.media_assets/);
  });

  it("documents that crew SELECT keys membership on source_id", () => {
    const policy = stripComments(base).match(
      /CREATE POLICY media_select_visible[\s\S]*?;/,
    )?.[0];
    assert.ok(policy, "expected media_assets SELECT policy");
    assert.match(policy, /visibility = 'crew'|visibility <> 'crew'/);
    assert.match(policy, /trip_members/);
    assert.match(policy, /m\.trip_id = media_assets\.source_id/);
  });

  it("documents that base owner UPDATE does not freeze source_id", () => {
    const updatePolicy = stripComments(base).match(
      /CREATE POLICY media_update_owner_or_admin[\s\S]*?;/,
    )?.[0];
    assert.ok(updatePolicy);
    assert.match(updatePolicy, /owner_id = \(auth\.uid\(\)\)::text/);
    assert.doesNotMatch(updatePolicy, /source_id/);
    assert.doesNotMatch(stripComments(base), /media_assets_freeze_source_scope/);
  });
});
