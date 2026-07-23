# Domain DNS Audit

## Domains to audit
- macksims.com
- www.macksims.com
- fishcrew.macksims.com
- shutterbid.macksims.com
- fairshare.macksims.com
- motocrew.macksims.com

## Cutover plan (ZenBusiness → Netlify DNS)

Full owner-ready plan: **[dns/ZENBUSINESS_TO_NETLIFY_DNS.md](./dns/ZENBUSINESS_TO_NETLIFY_DNS.md)**  
(Pre-flight, exact Netlify records, nameserver swap steps, rollback, verification curls.)

**Interim apex fix (do this now if not ready for NS swap):** In ZenBusiness/systemdns, **delete** bad A `@` → `35.172.94.1`. Keep A `@` → `75.2.60.5`, www CNAME, and **all** MX/SPF/DKIM/DMARC. Do not touch nameservers for the interim fix.

## Apex 404 incident (2026-07-23) — ACTION REQUIRED AT REGISTRAR

**Symptom:** `https://macksims.com/*` returns nginx 404; `https://www.macksims.com/*` returns Netlify 200.

**Netlify site (macksims-public-site / ff01fe30-986a-4a21-8293-4916e07b28b6) is already correct:**
- `custom_domain`: www.macksims.com
- `domain_aliases`: macksims.com
- `force_ssl`: true
- Hitting Netlify apex IP `75.2.60.5` correctly 301s to https://www.macksims.com/

**Root cause:** Authoritative DNS is still ZenBusiness **systemdns** (not Netlify DNS), and apex has **two** A records:

| Host | Type | Value | Result |
|------|------|-------|--------|
| `@` / macksims.com | A | **35.172.94.1** | ZenBusiness/nginx **404** (REMOVE THIS) |
| `@` / macksims.com | A | **75.2.60.5** | Netlify load balancer (KEEP) |
| www | CNAME | macksims-public-site.netlify.app | Works |

**Live NS (broken for Netlify-managed zone):**
- ns1.systemdns.com
- ns2.systemdns.com
- ns3.systemdns.com

**Netlify DNS zone exists but is NOT authoritative** (dns1–4.p09.nsone.net). Until NS is switched OR systemdns A records are fixed, apex will keep failing for many clients.

### Fix option A (fastest — stay on ZenBusiness/systemdns)
In ZenBusiness / systemdns DNS for macksims.com:
1. **Delete** the A record for `@` pointing to `35.172.94.1`
2. **Keep only** A `@` → `75.2.60.5` (Netlify)
3. **Keep** CNAME `www` → `macksims-public-site.netlify.app`
4. Wait for TTL (often 5–60 min), then verify: `curl.exe -sI https://macksims.com/` should be Netlify 301 → www

### Fix option B (use Netlify DNS fully)
At the domain registrar, set nameservers to Netlify’s:
- dns1.p09.nsone.net
- dns2.p09.nsone.net
- dns3.p09.nsone.net
- dns4.p09.nsone.net

Then Netlify’s zone (already has NETLIFY records for apex + www → macksims-public-site.netlify.app, plus Google MX/SPF/DMARC) becomes live. Re-check email after NS cutover.

### Canonical marketing URL until apex is clean
Use **https://www.macksims.com** for QR codes, flyers, and share links (QR assets regenerated to encode www).

## Commands
```powershell
nslookup -type=ns macksims.com
nslookup -type=a macksims.com
nslookup -type=cname www.macksims.com
nslookup -type=mx macksims.com
nslookup -type=txt macksims.com
nslookup -type=txt _dmarc.macksims.com
curl.exe -sI https://macksims.com/
curl.exe -sI https://www.macksims.com/
curl.exe -sI --resolve macksims.com:443:75.2.60.5 https://macksims.com/
curl.exe -sI --resolve macksims.com:443:35.172.94.1 https://macksims.com/
```

## Expected Google Workspace email records
- MX: `smtp.google.com` with priority `1`, unless Google Admin shows a different required value.
- SPF: one root TXT record: `v=spf1 include:_spf.google.com ~all`
- DMARC starter: host `_dmarc`, value `v=DMARC1; p=none; rua=mailto:privacy@macksims.com`
- DKIM: cannot be invented. Generate the DKIM selector and TXT value in Google Admin, then add the exact record to DNS.

## Stale/risky record watch list
- Old ZenBusiness/hostedemail MX records.
- Old hostedemail SPF includes.
- Duplicate SPF records.
- **Duplicate apex A records** (especially leftover ZenBusiness `35.172.94.1` alongside Netlify `75.2.60.5`).
- Website records that point to the wrong Netlify/Vercel target.
- Root and www records that split between different site builders.
- Registrar NS still on systemdns while a Netlify DNS zone is unused.

## Cleanup rule
Do not remove old ZenBusiness/hostedemail mail records until Google Workspace send and receive are confirmed for the official addresses. **Do** remove the apex website A record `35.172.94.1` once Netlify `75.2.60.5` is in place.

## Email test checklist
- chris@macksims.com receives
- support@macksims.com receives
- feedback@macksims.com receives
- privacy@macksims.com receives
- legal@macksims.com receives
- apps@macksims.com receives
- outgoing reply works
- no bouncebacks
