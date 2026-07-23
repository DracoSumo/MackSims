# Domain DNS Audit

## Domains to audit
- macksims.com
- www.macksims.com
- fishcrew.macksims.com
- shutterbid.macksims.com
- fairshare.macksims.com
- motocrew.macksims.com

## Commands
```powershell
nslookup -type=mx macksims.com
nslookup -type=txt macksims.com
nslookup -type=txt _dmarc.macksims.com
nslookup -type=cname www.macksims.com
nslookup -type=cname fishcrew.macksims.com
nslookup -type=cname shutterbid.macksims.com
nslookup -type=cname fairshare.macksims.com
nslookup -type=cname motocrew.macksims.com
curl.exe -I https://macksims.com
curl.exe -I https://www.macksims.com
curl.exe -I https://fishcrew.macksims.com
curl.exe -I https://macksims.com/privacy
curl.exe -I https://macksims.com/terms
curl.exe -I https://macksims.com/support
curl.exe -I https://macksims.com/account-deletion
curl.exe -I https://macksims.com/beta
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
- Website records that point to the wrong Netlify/Vercel target.
- Root and www records that split between different site builders.

## Cleanup rule
Do not remove old ZenBusiness/hostedemail records until Google Workspace send and receive are confirmed for the official addresses.

## Email test checklist
- chris@macksims.com receives
- support@macksims.com receives
- feedback@macksims.com receives
- privacy@macksims.com receives
- legal@macksims.com receives
- apps@macksims.com receives
- outgoing reply works
- no bouncebacks
