import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = dirname(fileURLToPath(import.meta.url));
const freezePath = join(root, "migrations/20260806_freeze_approved_ugc_payload.sql");
const basePath = join(root, "migrations/20260727_harden_ugc_media_visibility_rls.sql");

const stripComments = (sql) =>
  sql.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

describe("approved UGC payload freeze", () => {
  const freeze = readFileSync(freezePath, "utf8");
  const base = readFileSync(basePath, "utf8");

  it("freezes media_assets.visibility after approval for non-admins", () => {
    assert.match(freeze, /media_assets_freeze_approved_payload/);
    assert.match(freeze, /visibility is immutable after approval/);
    assert.match(freeze, /BEFORE UPDATE ON public\.media_assets/);
  });

  it("freezes feed_posts.media_url after Live/Approved/Sponsored", () => {
    assert.match(freeze, /feed_posts_freeze_published_media/);
    assert.match(freeze, /media_url is immutable after publish/);
    assert.match(freeze, /'Live'::text, 'Approved'::text, 'Sponsored'::text/);
  });

  it("extends trip_posts guard to freeze media_url once approved", () => {
    const fn = stripComments(freeze).match(
      /CREATE OR REPLACE FUNCTION public\.trip_posts_guard_pending_media\(\)[\s\S]*?\$\$;/,
    )?.[0];
    assert.ok(fn, "expected replaced trip_posts_guard_pending_media");
    assert.match(fn, /media_url is immutable after approval/);
    assert.match(fn, /media_is_publicly_approved\(COALESCE\(OLD\.media_moderation_status/);
  });

  it("freezes profiles.avatar_url once approved (historical hole only froze pending)", () => {
    const freezeFn = stripComments(freeze).match(
      /CREATE OR REPLACE FUNCTION public\.profiles_guard_pending_avatar\(\)[\s\S]*?\$\$;/,
    )?.[0];
    const baseFn = stripComments(base).match(
      /CREATE OR REPLACE FUNCTION public\.profiles_guard_pending_avatar\(\)[\s\S]*?\$\$;/,
    )?.[0];
    assert.ok(freezeFn);
    assert.ok(baseFn);
    assert.match(freezeFn, /avatar_url is immutable after approval/);
    assert.doesNotMatch(baseFn, /avatar_url is immutable after approval/);
  });
});
