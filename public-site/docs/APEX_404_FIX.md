# Fix apex macksims.com 404s (ZenBusiness DNS)

**Symptom:** `https://macksims.com/...` returns nginx **404**.  
**Works today:** `https://www.macksims.com/...` (Netlify).

## Cause

Authoritative DNS is still **ZenBusiness / systemdns** (`ns1/ns2/ns3.systemdns.com`).

Apex has **two** A records:

| A record | Result |
|----------|--------|
| `75.2.60.5` | Netlify (correct) |
| `35.172.94.1` | Old ZenBusiness/nginx host → **404** |

Browsers/DNS randomly hit the bad IP → 404. Netlify already has `www.macksims.com` as primary and `macksims.com` as alias.

## Fix in ZenBusiness (fastest)

1. Log into ZenBusiness DNS for `macksims.com`.
2. **Delete** A `@` → `35.172.94.1`.
3. **Keep** A `@` → `75.2.60.5`.
4. **Keep** CNAME `www` → `macksims-public-site.netlify.app`.
5. Wait for TTL (often 5–60 min), then test:
   ```
   curl.exe -sI https://macksims.com/
   ```
   Expect Netlify **301** → `https://www.macksims.com/`.

Do **not** remove Google Workspace MX/TXT/SPF/DMARC while doing this.

## Alternative: switch nameservers to Netlify DNS

Netlify already has a zone for this domain. At the registrar, set NS to Netlify’s (`dns1.p09.nsone.net` … `dns4.p09.nsone.net` — confirm in Netlify → Domain management). Only do this if MX/mail records are already mirrored in the Netlify zone.

## Working links right now (use these)

| Asset | URL |
|-------|-----|
| Site | https://www.macksims.com/ |
| Beta | https://www.macksims.com/beta/ |
| QR pack | https://www.macksims.com/beta/#qr |
| Flyer | https://www.macksims.com/beta/flyer.html |
| Site QR | https://www.macksims.com/images/qr/macksims-site.png |
| Beta QR | https://www.macksims.com/images/qr/macksims-beta.png |

QR images encode the **www** URLs so scans work even before apex DNS is cleaned up.
