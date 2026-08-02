import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = dirname(fileURLToPath(import.meta.url));
const hardenPath = join(root, "migrations/20260802_harden_media_storage_visibility.sql");
const basePath = join(root, "migrations/20260727_harden_ugc_media_visibility_rls.sql");

describe("media storage visibility authz", () => {
  const harden = readFileSync(hardenPath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("installs a trigger that freezes storage_path and public_url for non-admins", () => {
    assert.match(harden, /media_assets_freeze_storage_identity/);
    assert.match(harden, /storage_path is immutable after upload/);
    assert.match(harden, /public_url is immutable after upload/);
    assert.match(harden, /BEFORE UPDATE ON public\.media_assets/);
  });

  it("requires trip membership for crew-visible approved storage reads", () => {
    const stripComments = (sql) =>
      sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const policy = stripComments(harden).match(
      /CREATE POLICY fishcrew_media_select_approved_or_owner[\s\S]*?;/,
    )?.[0];
    assert.ok(policy, "expected rebuilt storage SELECT policy");
    assert.match(policy, /visibility IN \('public', 'profile'\)/);
    assert.match(policy, /visibility = 'crew'/);
    assert.match(policy, /trip_members/);
    assert.match(policy, /m\.status = 'Approved'/);
  });

  it("documents that the 20260727 storage policy only checked approval", () => {
    // Lock the historical hole so future readers know why 20260802 exists.
    const stripComments = (sql) =>
      sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const basePolicy = stripComments(base).match(
      /CREATE POLICY fishcrew_media_select_approved_or_owner[\s\S]*?;/,
    )?.[0];
    assert.ok(basePolicy);
    assert.match(basePolicy, /media_is_publicly_approved/);
    assert.doesNotMatch(basePolicy, /visibility/);
    assert.doesNotMatch(basePolicy, /trip_members/);
  });
});
