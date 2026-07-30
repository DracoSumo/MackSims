# ZenBusiness → Netlify DNS cutover (macksims.com)

**Status (2026-07-23):** Owner-ready plan. Netlify DNS zone already exists and is pre-populated. **Do not change nameservers until the pre-flight checklist is done.** Prefer **https://www.macksims.com** until apex is clean.

**Related:** [DOMAIN_DNS_AUDIT.md](../DOMAIN_DNS_AUDIT.md) · [APEX_404_FIX.md](../APEX_404_FIX.md)

---

## Why

| Problem | Detail |
|---------|--------|
| Apex flaky / 404 | Live ZenBusiness/systemdns has **two** apex A records. Clients that hit `35.172.94.1` get ZenBusiness nginx **404**. Clients that hit `75.2.60.5` get Netlify (correct 301 → www). |
| Split brain | Authoritative NS is still `ns1/ns2/ns3.systemdns.com`, while Netlify already has a full zone (`dns1–4.p09.nsone.net`) that is **not** authoritative. |
| Goal | One source of truth on **Netlify DNS** for website + portfolio subdomains + Google Workspace email. |

**Interim (before NS swap):** In ZenBusiness DNS, **delete** bad A `@` → `35.172.94.1` and keep A `@` → `75.2.60.5`. That fixes apex without touching email. Full cutover (this doc) is still recommended for long-term control.

---

## Live snapshot (authoritative = ZenBusiness / systemdns)

Captured 2026-07-23 via `Resolve-DnsName` / `nslookup` against public resolvers and `ns1.systemdns.com`.

### Nameservers (live)

| Host | Type | Value |
|------|------|-------|
| macksims.com | NS | ns1.systemdns.com |
| macksims.com | NS | ns2.systemdns.com |
| macksims.com | NS | ns3.systemdns.com |

### Website

| Host | Type | Value | Notes |
|------|------|-------|-------|
| @ / macksims.com | A | **35.172.94.1** | **BAD** — ZenBusiness nginx 404 |
| @ / macksims.com | A | **75.2.60.5** | Netlify load balancer — keep until NS cutover |
| www | CNAME | macksims-public-site.netlify.app | Works (HTTP 200) |

No public AAAA on apex today. After Netlify DNS is authoritative, Netlify `NETLIFY` records serve current load-balancer IPs (commonly including `75.2.60.5` and `99.83.190.102`; do **not** hardcode extra A records on Netlify if the managed `NETLIFY` apex/www records are present).

### Email (Google Workspace) — must survive cutover

| Host | Type | Value | Notes |
|------|------|-------|-------|
| @ | MX | `smtp.google.com` (priority **1**) | Receiving works |
| @ | TXT | `v=spf1 include:_spf.google.com ~all` | Keep |
| @ | TXT | `v=spf1 include:_spf.hostedemail.com ~all` | **Stale ZenBusiness/hostedemail** — do **not** recreate on Netlify |
| @ | TXT | `google-site-verification=pYDzG9hJkSr7G--vrFUTUNP5XkyYenjfk-YncJ8DL0o` | Keep |
| _dmarc | TXT | `v=DMARC1; p=none; rua=mailto:privacy@macksims.com` | Keep |

**DKIM:** No common selectors published live (`google`, `default`, `selector1/2`, `k1`, `s1/s2`, `m1` → none). Receiving can work without DKIM; **outbound** auth may fail spam checks until DKIM is added from Google Admin. Export/generate DKIM in Google Admin **before** NS swap if possible, then add the exact TXT to Netlify DNS.

### Portfolio / app subdomains (live on systemdns)

| Host | Type | Value |
|------|------|-------|
| fishcrew.macksims.com | CNAME | fishcrew.netlify.app |
| fairshare.macksims.com | CNAME | fairshare.netlify.app |
| shutterbid.macksims.com | CNAME | b495a056168d4a30.vercel-dns-017.com |
| motocrew.macksims.com | — | **NXDOMAIN** (not published on systemdns) |
| coachcore.macksims.com | — | **NXDOMAIN** |
| sermonstudio.macksims.com | — | **NXDOMAIN** |

---

## Netlify state (prep already done — safe)

Site: **macksims-public-site** (`ff01fe30-986a-4a21-8293-4916e07b28b6`)

| Field | Value |
|-------|--------|
| custom_domain | www.macksims.com |
| domain_aliases | macksims.com |
| force_ssl | true |
| managed_dns | **true** |
| dns_zone_id | `6a38b77f663c3c2a17f5bf24` |
| zone name | macksims.com |
| Netlify nameservers | dns1.p09.nsone.net, dns2.p09.nsone.net, dns3.p09.nsone.net, dns4.p09.nsone.net |
| uses_netlify_registrar | false (domain stays at ZenBusiness registrar) |

**Netlify DNS zone already has records** (queried via Netlify API `getDnsZone` / `getDnsRecords`). Enabling DNS / adding the domain again is unnecessary. **Do not change ZenBusiness nameservers from CLI/API** — owner must do that in the registrar UI.

### Records already on Netlify DNS (recreate checklist = verify these exist)

| Hostname | Type | Value / target | Purpose |
|----------|------|----------------|---------|
| macksims.com | NETLIFY | macksims-public-site.netlify.app | Apex → public site |
| www.macksims.com | NETLIFY | macksims-public-site.netlify.app | www → public site |
| macksims.com | MX (1) | smtp.google.com | Google Workspace |
| macksims.com | TXT | `v=spf1 include:_spf.google.com ~all` | SPF |
| macksims.com | TXT | `google-site-verification=pYDzG9hJkSr7G--vrFUTUNP5XkyYenjfk-YncJ8DL0o` | Google verify |
| _dmarc.macksims.com | TXT | `v=DMARC1; p=none; rua=mailto:privacy@macksims.com` | DMARC |
| fishcrew.macksims.com | NETLIFY | fishcrew.netlify.app | Portfolio |
| fairshare.macksims.com | NETLIFY | fairshare-v03-20260624.netlify.app | Portfolio (see note) |
| shutterbid.macksims.com | CNAME | b495a056168d4a30.vercel-dns-017.com | Portfolio (Vercel) |
| motocrew.macksims.com | NETLIFY | motocrewz.netlify.app | Will start resolving after cutover |
| coachcore.macksims.com | NETLIFY | coachcore7.netlify.app | Will start resolving after cutover |
| sermonstudio.macksims.com | NETLIFY | sermon-studio-beta.netlify.app | Will start resolving after cutover |

**Fairshare note:** Live systemdns CNAME is `fairshare.netlify.app`; Netlify zone uses managed target `fairshare-v03-20260624.netlify.app`. Both resolve to the same Netlify CDN IPs today. Confirm the Fairshare site’s custom domain in Netlify UI before cutover if you care which hostname is “canonical.”

**Intentionally omitted on Netlify (do not add):**

- A `@` → `35.172.94.1`
- TXT SPF `include:_spf.hostedemail.com` (stale ZenBusiness mail)
- Duplicate SPF records (keep **one** Google SPF only)

---

## Pre-flight checklist (owner)

1. **Export all ZenBusiness / systemdns records** for `macksims.com` (screenshot or CSV). Keep a copy offline.
2. Confirm Google Workspace Admin → Domains shows `macksims.com` verified and MX = `smtp.google.com`.
3. In Google Admin, open **DKIM** for macksims.com: start/authenticate and copy the exact `*._domainkey` TXT. Add that TXT in **Netlify DNS** before or immediately after NS swap.
4. In Netlify → Domains → `macksims.com` DNS, verify every row in the table above (especially MX + Google SPF + DMARC).
5. Optional but recommended **interim apex fix** (no NS change): delete ZenBusiness A `@` → `35.172.94.1` only. Keep MX/TXT/DMARC untouched.
6. Lower TTL on ZenBusiness NS-related records if the UI allows (helps faster rollback), or note current TTLs (~200–300s observed).
7. Check ZenBusiness registrar for **domain lock / transfer lock / nameserver lock**. Unlock nameserver changes only if required for the swap.
8. Schedule a short maintenance window; keep using **www.macksims.com** in links/QR until post-cutover checks pass.
9. Have rollback NS list ready: `ns1.systemdns.com`, `ns2.systemdns.com`, `ns3.systemdns.com`.

---

## Exact owner actions in ZenBusiness (nameserver swap)

Do these **only after** pre-flight. Agents must **not** perform step 4 for you.

1. Log into **ZenBusiness** (domain / DNS / registrar for `macksims.com`).
2. Open **DNS management** for `macksims.com` and **export/screenshot** all records (final backup).
3. Optional interim: delete A `@` → `35.172.94.1` if still present (fixes 404 while still on systemdns).
4. Open **Nameservers** / **DNS servers** (registrar setting, not just “DNS records”).
5. Switch from custom/systemdns to **custom nameservers** and set **exactly**:
   - `dns1.p09.nsone.net`
   - `dns2.p09.nsone.net`
   - `dns3.p09.nsone.net`
   - `dns4.p09.nsone.net`
6. Save. Do **not** delete MX/SPF/DKIM/DMARC in ZenBusiness before propagation finishes (after NS swap, ZenBusiness record edits no longer matter for resolution).
7. Wait for NS propagation (often minutes to a few hours; globally up to 24–48h). Prefer verifying with multiple resolvers.
8. Run the post-cutover verification section below.
9. Confirm Google Workspace mail send/receive for the addresses in the audit email checklist.

---

## Rollback plan

If website or email breaks after the NS change:

1. In ZenBusiness registrar, set nameservers **back** to:
   - `ns1.systemdns.com`
   - `ns2.systemdns.com`
   - `ns3.systemdns.com`
2. Wait for NS to show systemdns again (`nslookup -type=ns macksims.com`).
3. Confirm MX still `smtp.google.com` and apex/www behave as before the swap.
4. If apex 404 returns, re-apply interim fix: remove A `35.172.94.1`, keep `75.2.60.5`.
5. Debug Netlify zone offline (fix missing MX/TXT/DKIM) **before** attempting another NS cutover.

Netlify zone records are **not** deleted by rolling NS back; rollback only changes which servers are authoritative.

---

## Post-cutover verification

### DNS

```powershell
nslookup -type=ns macksims.com
# Expect: dns1–4.p09.nsone.net

nslookup -type=a macksims.com
# Expect: Netlify IPs only (no 35.172.94.1)

nslookup -type=cname www.macksims.com
# Expect: macksims-public-site.netlify.app (or Netlify-managed equivalent)

nslookup -type=mx macksims.com
# Expect: smtp.google.com preference 1

nslookup -type=txt macksims.com
# Expect: Google SPF + site verification; NOT hostedemail SPF

nslookup -type=txt _dmarc.macksims.com
nslookup -type=cname fishcrew.macksims.com
nslookup -type=cname shutterbid.macksims.com
nslookup -type=cname fairshare.macksims.com
```

### HTTP

```powershell
curl.exe -sI https://www.macksims.com/
# Expect: HTTP/2 or 1.1 200, Server: Netlify

curl.exe -sI https://macksims.com/
# Expect: 301/302 → https://www.macksims.com/ (Netlify), NOT nginx 404

curl.exe -sI --resolve macksims.com:443:75.2.60.5 https://macksims.com/
curl.exe -sI https://fishcrew.macksims.com/
curl.exe -sI https://fairshare.macksims.com/
curl.exe -sI https://shutterbid.macksims.com/
```

### Email (do not skip)

- Send test messages to/from: chris@, support@, feedback@, privacy@, legal@, apps@macksims.com
- In Google Admin, confirm domain MX and DKIM status
- **Warning:** Deleting or omitting MX / SPF / DKIM / DMARC during cutover **breaks or degrades email**. Never “clean up” mail records until Workspace send + receive are confirmed.

---

## Blockers / watch items

| Item | Severity | Notes |
|------|----------|-------|
| Nameserver swap is owner-only | Process | Must be done in ZenBusiness registrar UI; CLI cannot safely change registrar NS. |
| Registrar / NS lock | Possible | Check ZenBusiness for domain/NS lock before swap (whois not available on this workstation). |
| No live DKIM | Medium | Not published on systemdns or Netlify zone; add from Google Admin. |
| Dual SPF on ZenBusiness | Low after cutover | Netlify zone correctly has only Google SPF; do not copy hostedemail SPF. |
| Bad apex A still live | High until fixed | Delete `35.172.94.1` interim **or** complete NS cutover. |
| Subdomains that only exist on Netlify | Info | motocrew / coachcore / sermonstudio will start resolving after cutover. |
| Fairshare target hostname differs | Low | Live vs Netlify zone target hostname differ; CDN IPs match today — verify in Netlify UI. |

---

## Agent / CLI prep log (2026-07-23)

- Inspected live DNS (NS, A, www, MX, TXT, DMARC, portfolio CNAMEs, DKIM probes).
- Confirmed Netlify site domains + `managed_dns: true` + zone `6a38b77f663c3c2a17f5bf24`.
- Confirmed Netlify zone already contains website `NETLIFY` records, Google MX/SPF/DMARC, verification TXT, and portfolio records.
- **No nameserver change performed.** No ZenBusiness registrar mutations performed.
- No further Netlify API enablement required; zone is ready for owner NS swap after pre-flight.
