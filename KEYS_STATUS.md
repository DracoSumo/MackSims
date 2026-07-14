# Netlify Supabase Env Alignment Status

Updated: 2026-07-14

## Summary

Aligned production (+ deploy-preview, branch-deploy, dev) Supabase URL/anon for coachcore7, fairshare, motocrewz, sermon-studio-beta. Cleaned Aegis (sprightly-lily) pollution and pointed URLs at `yferqiqlpfvbvevtfbsn`. No team-scoped SUPABASE env vars found.

**CLI note:** `netlify env:get --site` is unreliable on netlify-cli/26; scripts now use `NETLIFY_SITE_ID`.

## Per-site

| Site | Netlify ID | Expected ref | urlRef | jwtRef | validJwt | projectMatch | Notes |
|------|------------|--------------|--------|--------|----------|--------------|-------|
| coachcore7 | b8885541-5a95-4e01-8ba8-3ccb27e1e60f | bfqfbkldxbojrrxeidcc | bfqfbkldxbojrrxeidcc | bfqfbkldxbojrrxeidcc | true | true | VITE_* removed (Vite=false). SUPABASE_SERVICE_ROLE_KEY still present (masked; not revalidated). |
| fairshare-v03-20260624 | f81df982-2348-4d3c-b842-fb806b1b4b00 | dsbwqxhqktzsdleeobbi | dsbwqxhqktzsdleeobbi | dsbwqxhqktzsdleeobbi | true | true | Vite=true; VITE_* + NEXT_PUBLIC_* set |
| motocrewz | 94099ea3-9d62-4c02-9ab3-5162c59282a7 | npmiwnxnqgonnmwvblyi | npmiwnxnqgonnmwvblyi | npmiwnxnqgonnmwvblyi | true | true | Vite=true |
| sermon-studio-beta | f695214f-1e22-429a-86ac-5adac2822414 | zipxwqkmenapnckwyzrh | zipxwqkmenapnckwyzrh | zipxwqkmenapnckwyzrh | true | true | Wrong VITE_* (was motocrew) **deleted**. Vite=false |
| sprightly-lily-160925 (Aegis) | 31c40a08-099e-4357-87c0-03f432bdfcd7 | yferqiqlpfvbvevtfbsn | yferqiqlpfvbvevtfbsn | (none) | false | URL_OK | **NEED_KEYS** — no anon in keys JSON. Cleared polluted NEXT_PUBLIC/VITE anon + wrong VITE URL. Present names: `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL` only |
| shutterbid-web | 21cb44ef-3d91-4636-88d3-5599ca0cc9ac | ykhpqnnthhcqilzqvkvs | custom (`https://shutterbid.macksims.com`) | ykhpqnnthhcqilzqvkvs | true | JWT_OK | **OWNER/Firebase** — URL is not `*.supabase.co`; left unchanged (Firebase primary + custom host). Anon JWT already matches ykhpqnn. No anon in keys JSON; did not overwrite keys. |
| fishcrew | 456ad8ef-3582-4123-9031-63af8e7d68fb | n/a | missing | n/a | n/a | n/a | No SUPABASE URL vars in production |

## Align script run

| Site | Status |
|------|--------|
| coachcore7 | OK (after NETLIFY_SITE_ID fix + JWT-checked realign) |
| fairshare-v03-20260624 | OK |
| motocrewz | OK |
| sermon-studio-beta | OK |

Initial `align-all-supabase-env.ps1` failed verification because `env:get --site` returned "No project id found". Equivalent align via `NETLIFY_SITE_ID` succeeded. Scripts patched accordingly.

## Aegis before → after

| Var | Before | After |
|-----|--------|-------|
| NEXT_PUBLIC_SUPABASE_URL | zipxwq (sermon) | https://yferqiqlpfvbvevtfbsn.supabase.co |
| SUPABASE_URL | polluted/masked | https://yferqiqlpfvbvevtfbsn.supabase.co |
| VITE_SUPABASE_URL | motocrew npmiwn | **deleted** |
| VITE_SUPABASE_ANON_KEY | wrong project | **deleted** |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | wrong project | **deleted** (NEED_KEYS) |
| SUPABASE_ANON_KEY / SERVICE_ROLE | unknown/masked | **deleted** (NEED_KEYS) |

## Team / account env

- Account id: `6a20824c37a8616e7912193d` (slug simsc32)
- `GET /accounts/{id}/env` count: **0**
- Team-scoped `SUPABASE_*` / `VITE_SUPABASE_*` / `NEXT_PUBLIC_SUPABASE_*`: **none found**

## Verify (`scripts/verify-netlify-supabase.ps1` equivalent)

| Site | urlRef | jwtRef | validJwt | projectMatch |
|------|--------|--------|----------|--------------|
| coachcore7 | bfqfbkldxbojrrxeidcc | bfqfbkldxbojrrxeidcc | true | true |
| fairshare-v03-20260624 | dsbwqxhqktzsdleeobbi | dsbwqxhqktzsdleeobbi | true | true |
| motocrewz | npmiwnxnqgonnmwvblyi | npmiwnxnqgonnmwvblyi | true | true |
| sermon-studio-beta | zipxwqkmenapnckwyzrh | zipxwqkmenapnckwyzrh | true | true |

## Live smoke (HTTP status only)

| URL | HTTP | Note |
|-----|------|------|
| https://fairshare-v03-20260624.netlify.app | 200 | |
| https://motocrewz.netlify.app | 200 | |
| https://coachcore7.netlify.app | 200 | |
| https://sermon-studio-beta.netlify.app | 200 | |
| https://sprightly-lily-160925.netlify.app/.netlify/functions/supabase-health | 200 | `ok=true` message=`Invalid API key` — live deploy still has stale/wrong anon until redeploy + NEED_KEYS filled |
| .../api/supabase-health | 404 | not used |

## Follow-ups

1. **Aegis NEED_KEYS:** add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and function keys if needed) for `yferqiqlpfvbvevtfbsn`, then redeploy sprightly-lily.
2. Redeploy Aegis so runtime env matches cleared Pollution / new URLs.
3. Optional: confirm coachcore7/sermon `SUPABASE_SERVICE_ROLE_KEY` JWT refs (API returns secret-masked).
4. Shutterbid: keep custom URL unless deliberately moving off Firebase-primary / custom proxy.
