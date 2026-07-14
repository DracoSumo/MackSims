# Netlify Supabase Env Alignment Status

Updated: 2026-07-14 (align + Aegis cleanup pass)

## Summary

Aligned production (+ deploy-preview, branch-deploy, dev) Supabase URL/anon for coachcore7, fairshare, motocrewz, sermon-studio-beta from `scripts/.netlify-supabase-keys.json`. Cleaned Aegis (sprightly-lily-160925) pollution and pointed URLs at `yferqiqlpfvbvevtfbsn`. **Aegis anon = NEED_KEYS** (not invented). Sermon wrong `VITE_*` deleted (Vite=false).

**CLI note:** `netlify env:get/unset --site` is unreliable on current netlify-cli; use `NETLIFY_SITE_ID`. `align-all-supabase-env.ps1` and `verify-netlify-supabase.ps1` patched accordingly.

## Align script run

| Site | Status |
|------|--------|
| coachcore7 | OK -> bfqfbkldxbojrrxeidcc |
| fairshare-v03-20260624 | OK -> dsbwqxhqktzsdleeobbi |
| motocrewz | OK -> npmiwnxnqgonnmwvblyi |
| sermon-studio-beta | OK -> zipxwqkmenapnckwyzrh |

Initial `align-all-supabase-env.ps1` failed post-set verify (`env:get --site` -> "No project id found"). Equivalent align via `NETLIFY_SITE_ID` succeeded for all four.

## Verify (`scripts/verify-netlify-supabase.ps1` equivalent via env:list --json)

| Site | urlRef | jwtRef | validJwt | projectMatch |
|------|--------|--------|----------|--------------|
| coachcore7 | bfqfbkldxbojrrxeidcc | bfqfbkldxbojrrxeidcc | true | true |
| fairshare-v03-20260624 | dsbwqxhqktzsdleeobbi | dsbwqxhqktzsdleeobbi | true | true |
| motocrewz | npmiwnxnqgonnmwvblyi | npmiwnxnqgonnmwvblyi | true | true |
| sermon-studio-beta | zipxwqkmenapnckwyzrh | zipxwqkmenapnckwyzrh | true | true |

## Per-site detail

| Site | Netlify ID | Expected ref | Status / notes |
|------|------------|--------------|----------------|
| coachcore7 | b8885541-5a95-4e01-8ba8-3ccb27e1e60f | bfqfbkldxbojrrxeidcc | Match. Names: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. VITE_*=absent |
| fairshare-v03-20260624 | f81df982-2348-4d3c-b842-fb806b1b4b00 | dsbwqxhqktzsdleeobbi | Match. Vite=true; VITE_* + NEXT_PUBLIC_* set |
| motocrewz | 94099ea3-9d62-4c02-9ab3-5162c59282a7 | npmiwnxnqgonnmwvblyi | Match. Vite=true |
| sermon-studio-beta | f695214f-1e22-429a-86ac-5adac2822414 | zipxwqkmenapnckwyzrh | Match. Wrong VITE_* (was motocrew) **deleted**. Vite=false |
| sprightly-lily-160925 (Aegis) | 31c40a08-099e-4357-87c0-03f432bdfcd7 | yferqiqlpfvbvevtfbsn | URLs OK. Anon/VITE cleared. **NEED_KEYS** |
| shutterbid-web | 21cb44ef-3d91-4636-88d3-5599ca0cc9ac | ykhpqnnthhcqilzqvkvs | Firebase-primary. `NEXT_PUBLIC_SUPABASE_URL=https://shutterbid.macksims.com` (not `*.supabase.co`). Anon JWT ref already ykhpqnn. **Left unchanged** |
| fishcrew | 456ad8ef-3582-4123-9031-63af8e7d68fb | n/a | No SUPABASE_* vars |

## Aegis SUPABASE env NAMES (after)

- `SUPABASE_URL` = https://yferqiqlpfvbvevtfbsn.supabase.co
- `NEXT_PUBLIC_SUPABASE_URL` = https://yferqiqlpfvbvevtfbsn.supabase.co
- Deleted: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_KEY`
- **NEED_KEYS:** set correct anon for `yferqiqlpfvbvevtfbsn` then redeploy (do not invent)

### Aegis related key presence (yes/no)

| Name / family | Present |
|---------------|---------|
| SEC_USER_AGENT | YES |
| AEGIS_CLIENT_KEY | YES |
| ALPACA_* | YES (`ALPACA_API_KEY_ID`, `ALPACA_API_SECRET_KEY`, `ALPACA_DATA_FEED`) |
| POLYGON_* | YES (`POLYGON_API_KEY`) |
| PUSHOVER_* | YES (`PUSHOVER_APP_TOKEN`, `PUSHOVER_PRIORITY`, `PUSHOVER_SOUND`, `PUSHOVER_USER_KEY`) |
| FMP_* | YES (`FMP_API_KEY`) |

## Team / account env

- Account: fishcrew (`6a20824c37a8616e7912193d`)
- `GET /api/v1/accounts/{id}/env` with local CLI token: **401 Access Denied** (could not fully enumerate)
- Cross-site listings after cleanup show distinct per-site refs (no shared wrong-ref pattern remaining across the four aligned apps)
- Conclusion: **no confirmed team-scoped SUPABASE_* pollution**; account API enumeration incomplete

## Live smoke

| URL | HTTP | Ping / note |
|-----|------|-------------|
| https://fairshare-v03-20260624.netlify.app/ | 200 | homepage |
| https://motocrewz.netlify.app/ | 200 | homepage (no dedicated supabase-health function found; SPA catch-all) |
| https://coachcore7.netlify.app/ | 200 | homepage (no supabase-health at `/.netlify/functions/supabase-health` — 404) |
| https://sermon-studio-beta.netlify.app/ | 200 | homepage (no supabase-health — 404) |
| https://sprightly-lily-160925.netlify.app/ | 200 | homepage |
| https://sprightly-lily-160925.netlify.app/.netlify/functions/supabase-health | 200 | message=`Invalid API key` — live deploy still uses stale runtime env; dashboard anon cleared (NEED_KEYS) so redeploy after keys should show missing/valid instead of wrong-project Invalid |

## Follow-ups

1. Add Aegis `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and any function-scoped anon) for ref `yferqiqlpfvbvevtfbsn`, then **redeploy** sprightly-lily.
2. Optional: confirm coachcore/sermon `SUPABASE_SERVICE_ROLE_KEY` JWT refs (values secret-masked in CLI).
3. Shutterbid: leave custom URL unless deliberately moving off Firebase-primary / custom proxy.
4. Prefer `NETLIFY_SITE_ID` when scripting Netlify env on this CLI.

## Live recheck (2026-07-14 cloud agent orchestration)

Re-ran smokes / Netlify API / DNS while auditing other agents.

| Check | Result |
|-------|--------|
| fairshare / motocrewz / coachcore7/app / sermon-studio-beta | HTTP 200 |
| Aegis homepage | HTTP 200 |
| Aegis `supabase-health` | `anonKeyPresent=false`, `supabaseConfigured=false`, message: Supabase env vars are not configured |
| Aegis Netlify env | `SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_URL` present for `yferqiqlpfvbvevtfbsn`; **no** `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Aegis provider keys (SEC / AEGIS_CLIENT / ALPACA / POLYGON / PUSHOVER / FMP) | Present in Netlify env API |
| Aegis `npm run check` / `test:timestamps` / `test:intelligence` | PASS |
| `macksims.com` authoritative NS | Still `ns*.systemdns.com` (ZenBusiness) — **not** Netlify `dns*.p09.nsone.net` |
| Apex A records | Still **both** `75.2.60.5` (Netlify) and `35.172.94.1` (ZenBusiness/Duda 404) |
| Netlify DNS zone for `macksims.com` | Correct NETLIFY records exist, but **unused until NS cutover** |
| Mitigation applied | Primary domain set to `www.macksims.com` (CNAME healthy); apex kept as alias. Apex still lottery-404 until ZenBusiness deletes bad A **or** NS moved to Netlify |

### Still blocked (need owner)
1. Paste Aegis anon for `yferqiqlpfvbvevtfbsn` into Netlify, then redeploy `sprightly-lily-160925`.
2. ZenBusiness: delete A `35.172.94.1` **or** change nameservers to Netlify (`dns1.p09.nsone.net` … `dns4.p09.nsone.net`).
3. Codemagic ASC rebuilds (CurbCue / ThrottleLink / CoachCore / Sermon) — no API token in this environment to poll.
4. Play Console Data Safety resume (other agent aborted) — needs browser session.

## Netlify DNS prep for NS cutover (2026-07-14)

Netlify zone now includes Google MX/SPF/Search Console TXT/DMARC + ShutterBid Vercel CNAME (in addition to existing NETLIFY site records).

**Nameservers to set at ZenBusiness/Tucows registrar** (not Google Domains):

- `dns1.p09.nsone.net`
- `dns2.p09.nsone.net`
- `dns3.p09.nsone.net`
- `dns4.p09.nsone.net`

See `docs/DNS_NETLIFY_NS_CUTOVER.md`. Live NS still `systemdns.com` until owner updates registrar.
