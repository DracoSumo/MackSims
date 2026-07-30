# macksims.com → Netlify DNS nameserver cutover

## Why
ZenBusiness/`systemdns.com` still publishes apex A `35.172.94.1` (Duda 404) alongside Netlify `75.2.60.5`, so `macksims.com` intermittently 404s. Netlify already has a full DNS zone for this domain — it just is not authoritative yet.

## Registrar
- RDAP registrar: **Tucows Domains Inc.** (ZenBusiness reseller)
- Current NS: `ns1.systemdns.com`, `ns2.systemdns.com`, `ns3.systemdns.com`
- **Not** Google Domains. Google Console = Workspace mail + Search Console verification (records migrated below).

## Set these nameservers at ZenBusiness (domain registrar)

Replace all existing nameservers with **only**:

```
dns1.p09.nsone.net
dns2.p09.nsone.net
dns3.p09.nsone.net
dns4.p09.nsone.net
```

Path is usually: ZenBusiness → Domains → `macksims.com` → Nameservers / DNS → Custom nameservers.

Do **not** leave any `systemdns.com` NS entries.

## Already prepared on Netlify DNS zone (`macksims.com`)

| Type | Host | Value |
|------|------|-------|
| NETLIFY | `@` / `macksims.com` | `macksims-public-site.netlify.app` |
| NETLIFY | `www` | `macksims-public-site.netlify.app` |
| NETLIFY | `fairshare` | `fairshare-v03-20260624.netlify.app` |
| NETLIFY | `motocrew` | `motocrewz.netlify.app` |
| NETLIFY | `coachcore` | `coachcore7.netlify.app` |
| NETLIFY | `sermonstudio` | `sermon-studio-beta.netlify.app` |
| NETLIFY | `fishcrew` | `fishcrew.netlify.app` |
| CNAME | `shutterbid` | `b495a056168d4a30.vercel-dns-017.com` |
| MX (10→1) | `@` | `smtp.google.com` |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `@` | `google-site-verification=pYDzG9hJkSr7G--vrFUTUNP5XkyYenjfk-YncJ8DL0o` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:privacy@macksims.com` |

Site primary hostname is currently **`www.macksims.com`** (apex aliases to it) so mobile users avoid the ZenBusiness 404 lottery until NS propagates.

## Google Console checks (after NS propagates)

### Google Search Console
1. Open [Search Console](https://search.google.com/search-console) → domain property `macksims.com`
2. Confirm DNS TXT verification still shows verified (same token is on Netlify)
3. If it asks to re-verify, use DNS TXT method — record already present

### Google Admin / Workspace
1. Open [admin.google.com](https://admin.google.com) → Account → Domains
2. MX should remain `smtp.google.com` (priority 1) once Netlify NS is live
3. No nameserver change inside Google Admin — that is only at the registrar (ZenBusiness)

## Verify after cutover (5–60 minutes)

```powershell
Resolve-DnsName macksims.com -Type NS -Server 8.8.8.8
# expect dns*.p09.nsone.net only

Resolve-DnsName macksims.com -Type A -Server 8.8.8.8
# should NOT include 35.172.94.1

curl.exe -sI https://macksims.com/
curl.exe -sI https://www.macksims.com/
```

## Owner action required
This environment has **no browser MCP** and no ZenBusiness/Google login automation, so the NS replacement at ZenBusiness must be clicked by the owner (or an agent with an in-app browser session on that panel).
