# MackSims

Public product studio for MackSims LLC apps. Marketing site: [www.macksims.com](https://www.macksims.com).

**Public-ready status:** [`PUBLIC-READY.md`](./PUBLIC-READY.md)  
**Store launch system:** [`docs/store-launch/README.md`](./docs/store-launch/README.md) � tracker [`docs/store-launch/PER_APP_STATUS_TRACKER.md`](./docs/store-launch/PER_APP_STATUS_TRACKER.md)

## Product index

| Product | Path | Stack | Live |
| --- | --- | --- | --- |
| Marketing site | [`public-site/`](./public-site/) | Static � Netlify | https://www.macksims.com |
| CoachCore | [`apps/CoachCore/coachcore-static-v001/`](./apps/CoachCore/coachcore-static-v001/) | Next.js static | https://coachcore.macksims.com |
| CurbCue (FairShare) | [`apps/FairShare/`](./apps/FairShare/) | Vite + React + Capacitor | https://fairshare.macksims.com |
| MotoCrew (ThrottleLink) | [`apps/MotoCrew/`](./apps/MotoCrew/) | Vite + React + Capacitor | https://motocrew.macksims.com |
| Sermon Studio | [`apps/SermonStudio/`](./apps/SermonStudio/) | Next.js + Netlify | https://sermonstudio.macksims.com |
| FishCrew | [`apps/FishCrew/`](./apps/FishCrew/) | Capacitor wrapper + Codemagic | https://fishcrew.macksims.com |
| ShutterBid | [`apps/ShutterBid/shutterbid-starter/`](./apps/ShutterBid/shutterbid-starter/) | Next.js + Firebase | https://shutterbid.macksims.com |
| MomentPick | [`apps/momentpick-web/`](./apps/momentpick-web/) | Next.js + Firebase | https://momentpick.macksims.com |
| Aegis Intel | `C:\Users\draco\Downloads\aegis-intel-v9-full` | Static PWA + Netlify Functions | https://sprightly-lily-160925.netlify.app |
| Content Suite | `C:\Users\draco\Downloads\DracoSumo\content-suite` | Vite + React � Netlify | https://adorable-chebakia-0fc082.netlify.app |

## Local build cheat sheet

```bash
# Vite apps (FairShare, MotoCrew)
npm ci && npm run check && npm run deploy:netlify

# Next apps (CoachCore, Sermon Studio, ShutterBid, MomentPick)
npm ci && npm run build   # or npm run check where defined

# Aegis
npm run check && npx netlify deploy --prod

# public-site
npx netlify deploy --prod --dir=public
```

## Notes

- Do **not** duplicate FishCrew / ShutterBid App Store or Play records � audit existing consoles only.
- Sermon Studio: if the live site 404s, clear Netlify UI **Publish directory** (must not be `.next`) and use the Next plugin deploy path documented in `apps/SermonStudio/netlify.toml`.
- Content Suite is MackSims-branded but currently checked out under the DracoSumo workspace path.
