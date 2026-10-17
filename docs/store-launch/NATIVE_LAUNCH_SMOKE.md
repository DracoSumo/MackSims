# Native Capacitor launch smoke (owner)

Install a TestFlight / Play internal build, then confirm the remote web UI appears — not a blank WebView, not a stuck splash, not an offline shell page.

## Expectation

Within **~5 seconds** of tap (on normal network): splash hides and the live product UI loads from the configured HTTPS `server.url`.

## Per-app URL to expect

| App | Bundle / package | Live URL |
| --- | --- | --- |
| Aegis Intel | `com.macksims.aegisintel` | https://sprightly-lily-160925.netlify.app |
| CurbCue (FairShare) | `com.chrissims.fairshare` | https://fairshare-v03-20260624.netlify.app |
| MotoCrew | `com.chrissims.throttlelink` | https://motocrewz.netlify.app |
| CoachCore | `com.macksims.coachcore` | https://coachcore7.netlify.app/app/ |
| Sermon Studio | `com.chrissims.sermonstudio` | https://sermon-studio-beta.netlify.app |
| FishCrew | `com.chrissims.fishcrew` | https://fishcrew.macksims.com |
| ShutterBid | `com.chrissims.shutterbid` | https://shutterbid-web.netlify.app |

Marketing site (not an app shell): https://www.macksims.com

## Pass / fail checks

1. Cold start → UI visible in ≤5s (splash may show ~1.5s).
2. Pull-to-refresh or navigate one in-app route → still works (SPA routing OK).
3. Airplane mode → expect load failure / offline, not an infinite splash.
4. Restore network → relaunch recovers.

## Fail signatures

- Blank white/black WebView forever → wrong/dead `server.url`, blocked navigation, or JS boot crash on the live site.
- Splash never dismisses → SplashScreen `launchAutoHide` / duration misconfig (should auto-hide after ~1.5s).
- “Loading …” local stub only → native shell did not apply `server.url` (re-run `npx cap sync` / Codemagic sync step).
