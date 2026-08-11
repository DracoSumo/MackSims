import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appJs = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "app.js"), "utf8");

function fnBody(name) {
  const re = new RegExp(`(?:async )?function ${name}\\([\\s\\S]*?\\n  \\}\\n`);
  const match = appJs.match(re);
  assert.ok(match, `expected function ${name}`);
  return match[0];
}

test("importInstagramMedia uses only the signed-in user's connection", () => {
  const body = fnBody("importInstagramMedia");
  assert.match(body, /instagramConnectionFor\(currentUser\(\)\)/);
  assert.doesNotMatch(body, /currentUser\(\)\?\.instagramConnection \|\| state\.instagramConnection/);
});

test("logout scrubs Instagram Graph tokens from local state", () => {
  const body = fnBody("logout");
  assert.match(body, /clearInstagramConnectionState\(\)/);
});

test("ensureUserFromSupabase rebinds Instagram state per account and never merges prior tokens", () => {
  const body = fnBody("ensureUserFromSupabase");
  assert.match(body, /clearInstagramConnectionState\(\{ exceptUserId: user\.id \}\)/);
  assert.match(body, /bindInstagramConnectionState\(/);
  assert.doesNotMatch(
    body,
    /state\.instagramConnection = \{ \.\.\.\(state\.instagramConnection \|\| \{\}\), \.\.\.user\.instagramConnection \}/,
  );
});

test("profile Instagram panel does not fall back to a global connection handle", () => {
  assert.match(appJs, /const igConnection = instagramConnectionFor\(user\)/);
  assert.doesNotMatch(
    appJs,
    /const igConnection = user\?\.instagramConnection \|\| state\.instagramConnection \|\| null/,
  );
});
