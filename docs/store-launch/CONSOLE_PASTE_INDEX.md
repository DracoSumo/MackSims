# Store console paste index (ASC + Play)

**Updated:** 2026-07-14  
Use this as the routing sheet. Full copy lives in each app folder.

| App | ASC form | Play form | Review logins | Data Safety CSV |
| --- | --- | --- | --- | --- |
| CoachCore | [APP_STORE_CONNECT.md](./apps/coachcore/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/coachcore/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/coachcore/REVIEW_NOTES.md) | `play-data-safety/data_safety_coachcore.csv` |
| Curbcue (FairShare) | [APP_STORE_CONNECT.md](./apps/fairshare/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/fairshare/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/fairshare/REVIEW_NOTES.md) | `data_safety_curbcue.csv` |
| ThrottleLink | [APP_STORE_CONNECT.md](./apps/throttlelink/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/throttlelink/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/throttlelink/REVIEW_NOTES.md) | `data_safety_throttlelink.csv` |
| Sermon Studio | [APP_STORE_CONNECT.md](./apps/sermon-studio/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/sermon-studio/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/sermon-studio/REVIEW_NOTES.md) | `data_safety_sermonstudio.csv` |
| FishCrew | [APP_STORE_CONNECT.md](./apps/fishcrew/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/fishcrew/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/fishcrew/REVIEW_NOTES.md) | `data_safety_fishcrew.csv` |
| ShutterBid | [APP_STORE_CONNECT.md](./apps/shutterbid/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/shutterbid/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/shutterbid/REVIEW_NOTES.md) | `data_safety_shutterbid.csv` |
| Aegis Intel | [APP_STORE_CONNECT.md](./apps/aegis-intel/APP_STORE_CONNECT.md) | [GOOGLE_PLAY_CONSOLE.md](./apps/aegis-intel/GOOGLE_PLAY_CONSOLE.md) | [REVIEW_NOTES](./apps/aegis-intel/REVIEW_NOTES.md) | `data_safety_aegis.csv` |

**Master credentials:** [DEMO_REVIEW_LOGINS.md](./DEMO_REVIEW_LOGINS.md)  
**Shared declarations:** [PLAY_CONSOLE_DECLARATIONS.md](./PLAY_CONSOLE_DECLARATIONS.md) · [TIER3_PLAY_STORE_LISTINGS.md](./TIER3_PLAY_STORE_LISTINGS.md)

## Filled now vs still manual

### Automated / draft-filled in docs (ready to paste)

- Publisher entity, shared privacy/support/deletion URLs
- Categories, short/full descriptions (Tier-3 + Aegis + FishCrew/ShutterBid paste packs)
- App access + demo review emails/passwords
- Data Safety type matrices via CSVs
- Disclaimers (rides, motorcycle safety, coaching non-medical, sermon copyright, Aegis non-broker)

### Still requires human / console

1. **Provision** every `review.*@macksims.com` user in the correct Supabase/auth project
2. Sync ShutterBid ASC review fields to the new client/photographer pair
3. Paste privacy URLs into Apple App Privacy (FishCrew + ShutterBid) and Play (ShutterBid)
4. Import remaining Data Safety CSVs (Aegis noted saved previously)
5. Upload screenshots/icons after owner approval boards
6. Select App Review / closed-testing builds
7. Resolve CoachCore package ID split: docs `com.macksims.coachcore` vs Play `com.chrissims.coachcore`
8. Aegis native packaging go/no-go before creating ASC/Play records
9. Confirm ThrottleLink vs MotoCrew final public name (Play listing currently ThrottleLink)

## Login requirement summary

| Requires login for review | Apps |
| --- | --- |
| Yes | ShutterBid, Sermon Studio |
| No (guest/demo) | Curbcue, ThrottleLink, CoachCore demo, FishCrew, Aegis guest |
| Optional signed-in account provisioned anyway | All of the above |
