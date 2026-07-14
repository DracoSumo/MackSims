# MackSims Visual Facelift Report

**Date:** 2026-07-05  
**Scope:** FairShare, MotoCrew, CoachCore, Sermon Studio, ShutterBid  
**Excluded:** FishCrew, Aegis Intel, MackSims public website (reference only)

---

## Summary

Five apps received **distinct visual facelifts** â€” CSS/component polish, no business-logic rewrites, no new heavy dependencies. All five **build/check PASS** after changes.

| App | Visual direction | Build/check | Deploy-ready |
|-----|------------------|-------------|--------------|
| **FairShare** | Bright transit/map, city-smart fare compare | PASS | Yes (Netlify beta redeploy) |
| **MotoCrew** | Bold road/garage, asphalt + stripe accents | PASS | Yes (Netlify beta redeploy) |
| **CoachCore** | Athletic accountability, electric green | PASS | Yes (Netlify beta redeploy) |
| **Sermon Studio** | Warm ministry workspace, soft dusk + gold | PASS | Yes (Netlify beta redeploy) |
| **ShutterBid** | Forest Studio editorial, photography-first | PASS | Yes (local/store build; public route still blocked) |

**Backups:** `MackSims/backups/[app]-backup-before-facelift-2026-07-05-2140.zip` (node_modules, .git, .env excluded)

---

## 1. FairShare

### Visual direction
Bright **transit/map-inspired** light theme â€” mint grid background, teal/coral route accents, DM Sans typography, map-grid hero overlay, light floating bottom nav with SVG icons.

### What changed
- Switched from dark navy shell to **light city-smart palette** (`--bg #eef6f4`, transit teal `#007a6e`, route coral `#e8542e`)
- Body: subtle **28px map grid** + soft radial gradients
- Cards/panels: white surfaces instead of dark glass
- Hero: city-street photo + tealâ†’coral gradient + grid overlay
- Bottom nav: light bar with **SVG icons** (home, compare, crowd, account)
- Mobile: 430px tuning for hero height and launch-action buttons
- Brand tagline: "City-smart fare compare"
- Loaded **DM Sans** via Google Fonts; theme-color `#007a6e`

### Files changed
- `apps/FairShare/src/styles.css`
- `apps/FairShare/src/components/AppShell.tsx`
- `apps/FairShare/index.html`

### Commands run
```
npm run check   â†’ PASS (5 tests, vite build OK)
```

### Remaining issues
- Demo/simulated-data banners and copy still visible (intentional for beta)
- Admin map placeholder still dashed grid (functional demo)
- Some legacy dark-tinted rules may exist in long CSS tail â€” spot-check compare page contrast
- Unsplash hero still external CDN

---

## 2. MotoCrew / Throttle

### Visual direction
**Bold road/garage energy** â€” asphalt charcoal (`#121214`), orange road accent (`#ff6b00`), yellow stripe (`#ffc107`), Barlow Condensed display for hero headings, left-stripe ride cards.

### What changed
- Token overhaul in `index.css`: asphalt palette, road-stripe border accents
- HTML background: warm orange/yellow radials on dark asphalt
- Hero panel: road-stripe repeat pattern + **4px orange left border**, uppercase condensed title
- Ride/module cards: gradient dark surfaces + **yellow left stripe**, hover lift
- Loaded **Barlow Condensed + Inter** fonts; theme-color `#121214`

### Files changed
- `apps/MotoCrew/src/index.css`
- `apps/MotoCrew/src/App.css`
- `apps/MotoCrew/index.html`

### Commands run
```
npm run check   â†’ PASS (eslint, 2 tests, vite build OK)
```

### Remaining issues
- Bottom nav still uses single-letter badges (not SVG icons)
- Create/Focus screens still orphan from nav
- Demo yellow `future-note` blocks unchanged (intentional beta labeling)
- Favicon still generic (not updated this pass)

---

## 3. CoachCore

### Visual direction
**Athletic accountability** â€” deeper navy field (`#0a1628`), electric green readiness accents, glass-panel cards wired to `--ms-*` tokens, landing hero keeps *"No more guessing who is locked in."*

### What changed
- `globals.css`: athletic token refresh (green radial + sky secondary)
- **`ms-glass-panel`** primitive activated with `position: relative`
- `CoachCards.tsx`: MetricCard + CommandCard use token-based glass panels
- Landing page: emerald CTAs replacing sky-blue; green radial hero
- `AthleteAccountabilityPanel`: retitled **"Who is locked in?"**, emerald hover borders
- Login: removed broken-looking `opacity-60`; demo fields in labeled bordered box; removed "placeholder" from signup link text

### Files changed
- `apps/CoachCore/coachcore-static-v001/src/app/globals.css`
- `apps/CoachCore/coachcore-static-v001/src/app/page.tsx`
- `apps/CoachCore/coachcore-static-v001/src/app/login/page.tsx`
- `apps/CoachCore/coachcore-static-v001/src/components/ui/CoachCards.tsx`
- `apps/CoachCore/coachcore-static-v001/src/components/AthleteAccountabilityPanel.tsx`

### Commands run
```
npm run check   â†’ PASS (2 tests, Next build 41 routes)
```

### Remaining issues
- Mobile nav still shows 5/10 routes (Chat, Playbook, Video, etc. URL-only)
- `/app/timeline`, `/app/admin` still orphan routes
- Privacy/terms pages still marked placeholder in copy
- Demo disclaimers still on most app pages

---

## 4. Sermon Studio

### Visual direction
**Calm warm ministry workspace** â€” dusk parchment (`#1a1410`), gold/amber accents (`#d4a574`, `#e8c896`), Source Serif 4 body typography, warm gradients replacing cool blue.

### What changed
- `globals.css`: warm token palette, dusk gradients, gold primary buttons/tabs
- Replaced all `text-gray-500/400` in main page with `text-[color:var(--ss-muted)]` for dark-bg contrast
- `layout.tsx`: **Source Serif 4 + Inter** font pairing
- Fixed broken duplicate `.tab[data-active]` CSS rule from edit

### Files changed
- `apps/SermonStudio/app/globals.css`
- `apps/SermonStudio/app/layout.tsx`
- `apps/SermonStudio/app/page.tsx`

### Commands run
```
npm run check   â†’ PASS (1 test, Next 14 build OK)
```

### Remaining issues
- Tab icons not yet wired (lucide-react in deps but unused)
- Auth callback page still minimal styling
- `ChurchSwitcher.tsx` still unused
- Series colors still random neon from `randomColor()`
- Dense header (beta + auth + actions) unchanged

---

## 5. ShutterBid

### Visual direction
**Premium editorial photography marketplace** â€” Forest Studio cream shell unified end-to-end, serif hero headline, light mobile header matching body (no dark/light split).

### What changed
- `layout.tsx`: shell bg `#f7f4eb` / ink `#17251d` (was dark `#071612`)
- `globals.css`: mobile header â†’ light Forest Studio (cream bg, dark brand text, serif brand)
- `MarketplaceCoreLoopHome.tsx`: editorial hero copy â€” *"Post once. Compare bids. Book local pros."* + Georgia serif headline

### Files changed
- `apps/ShutterBid/shutterbid-starter/app/layout.tsx`
- `apps/ShutterBid/shutterbid-starter/app/globals.css`
- `apps/ShutterBid/shutterbid-starter/components/marketplace/MarketplaceCoreLoopHome.tsx`

### Commands run
```
npm run build   â†’ PASS (138 routes)
```

### Remaining issues
- Sample content banners still on feed/jobs/portfolio (intentional beta)
- `macksims.com/shutterbid` public route still **SITE NOT FOUND** (hosting/DNS â€” not fixed here)
- Monolithic 9k-line `globals.css` still has layered version blocks
- Feed still uses labeled gradient tiles vs real photography
- Store privacy/data-safety questionnaires still incomplete per prior audits

---

## Cross-app design decisions to preserve

1. **Distinct identities** â€” no shared dark-glass template; each app has its own palette and typography
2. **Beta/demo labeling kept** â€” simulated data disclaimers not removed (honest beta UX)
3. **Auth/backend untouched** â€” Firebase, Supabase, routes, business logic preserved
4. **Mobile-first** â€” bottom navs, 430px tweaks, safe-area padding retained
5. **No fake social proof** â€” no invented users, stats, reviews, or partnerships added

---

## Shared issues (unchanged by facelift)

| Issue | Apps affected |
|-------|---------------|
| Demo admin surfaces public without auth gate | FairShare, CoachCore |
| Orphan routes with no nav links | CoachCore (`/timeline`, `/admin`) |
| Legal pages placeholder copy | CoachCore privacy/terms |
| Public marketing routes broken on macksims.com | ShutterBid |
| External CDN images (Unsplash) | FairShare hero |

---

## Deploy-ready vs follow-up

### Deploy-ready (beta Netlify redeploy)
- FairShare â†’ `fairshare-v03-20260624.netlify.app`
- MotoCrew â†’ `motocrewz.netlify.app`
- CoachCore â†’ `coachcore7.netlify.app`
- Sermon Studio â†’ `sermon-studio-beta.netlify.app`

### Follow-up needed
- **ShutterBid:** DNS/public-site route for macksims.com/shutterbid; store privacy completion; feed photography assets
- **CoachCore:** mobile nav completeness; legal page copy; optional progress rings on athlete cards
- **MotoCrew:** nav icons; favicon refresh; Create tab in bottom nav
- **Sermon Studio:** tab icons; auth callback styling; series color palette
- **FairShare:** beta gate light/dark alignment now improved via global light theme

---

## Next step

Redeploy the four Netlify beta apps to surface CSS changes, then browser-smoke at **390px** (Public Mode, nav, compare flow, modals, console). For ShutterBid, fix public-site hosting before marketing the Forest Studio shell externally.

---

## Deployment (facelift â€” 2026-07-05)

Operator: deploy subagent (post visual facelift ebf7bd26). **Excluded:** Aegis Intel, FishCrew. No DNS or Netlify settings changes.

### Deployed (production)

| App | Source path | Build command | Publish dir | Site ID | Production URL | HTTP verify |
|-----|-------------|---------------|-------------|---------|----------------|-------------|
| FairShare | `apps/FairShare` | `npm run build` (`tsc -b && vite build`) | `dist` | `f81df982-2348-4d3c-b842-fb806b1b4b00` | https://fairshare-v03-20260624.netlify.app | 200 |
| MotoCrew | `apps/MotoCrew` | `npm run build` (`tsc -b && vite build`) | `dist` | `94099ea3-9d62-4c02-9ab3-5162c59282a7` | https://motocrewz.netlify.app | 200 |
| CoachCore | `apps/CoachCore/coachcore-static-v001` | `npm run build` (`next build`, static export) | `out` | `b8885541-5a95-4e01-8ba8-3ccb27e1e60f` | https://coachcore7.netlify.app | 200 |
| Sermon Studio | `apps/SermonStudio` | `npm run build` (`next build`) | `.next` (+ Next runtime) | `f695214f-1e22-429a-86ac-5adac2822414` | https://sermon-studio-beta.netlify.app | 200 |

**Deploy CLI (each):** `netlify deploy --prod --dir=<publish dir> --site <site id>` from the source path (Netlify also ran `build.command` from each `netlify.toml`).

**Build results:** All four builds exited 0 locally and again during Netlify CLI deploy. FairShare/MotoCrew: Vite chunk-size / dynamic-import warnings only. CoachCore: 41 static routes. Sermon Studio: 7 routes; `/api/ics` dynamic function bundled.

**Sermon Studio source note:** `sermon-studio-next-patched` was not present under MackSims; deploy used `apps/SermonStudio` (matches existing `sermon-studio-beta` Netlify project).

### Skipped

| App | Reason |
|-----|--------|
| ShutterBid | No matching site in `netlify sites:list` (8 projects; no shutterbid). Per instructions, deploy only if site exists and build passes. |
| Aegis Intel | Explicit exclusion |
| FishCrew | Explicit exclusion |

### Deploy IDs (Netlify)

- FairShare: `6a4b093abd75dbeb946303ec`
- MotoCrew: `6a4b096b5dadd6b2f27cf5ba`
- CoachCore: `6a4b096d8e52ade903601796`
- Sermon Studio: `6a4b09a34150b769fa7a9122`


---

## Deployment (facelift — 2026-07-05)

Facelift pass marked all five apps **build/check PASS**. Production Netlify redeploy executed for the four beta web apps with linked sites. **Aegis Intel** and **FishCrew** were not touched. No DNS, hosting settings, Firebase, Supabase, signing, or console records were changed.

| App | Deployed | Production URL | Build/check | Commands | Notes |
|-----|----------|----------------|-------------|----------|-------|
| **FairShare** | **YES** | https://fairshare-v03-20260624.netlify.app | PASS (`npm run check`) | `npm run check`; `netlify deploy --prod --dir=dist` (site `f81df982`, linked) | HTTP **200** verified |
| **MotoCrew** | **YES** | https://motocrewz.netlify.app | PASS (`npm run check`) | `npm run check`; `netlify deploy --prod --dir=dist` (site `94099ea3`, linked) | HTTP **200** verified |
| **CoachCore** | **YES** | https://coachcore7.netlify.app | PASS (`npm run check`) | `npm run check`; `netlify deploy --prod --dir=out` (site `b8885541`, linked) | HTTP **200** verified; 160 CDN assets updated |
| **Sermon Studio** | **YES** | https://sermon-studio-beta.netlify.app | PASS (`npm run check` in `apps/SermonStudio` v0.1.1) | `npm run check`; `netlify deploy --prod --site=f695214f-1e22-429a-86ac-5adac2822414` | HTTP **200** verified; source = `MackSims/apps/SermonStudio` (not empty `Downloads/sermon-studio-next-patched` shell) |
| **ShutterBid** | **NO** | — | PASS (`npm run build`, 138 routes) | Build only | **Skipped:** no ShutterBid project in `netlify sites:list`; store/public route gaps unchanged per audit |

### Auth / ops blockers (unchanged)

- Netlify CLI authenticated as **fishcrew** account (required for deploy; not modified).
- Demo admin routes remain public on FairShare and CoachCore (mock data only).
- `macksims.com/shutterbid` still **SITE NOT FOUND** — not in scope for this deploy.
- ShutterBid: ASC/Play builds separate; privacy questionnaires still incomplete.

### Deploy log artifacts

- `docs/_deploy_*_build.log` / `docs/_deploy_*_prod.log` for FairShare, MotoCrew, CoachCore, Sermon Studio, ShutterBid build.



## Uniform deploy (2026-07-05)

Portfolio web deploy standardized to Netlify CLI prod (npm run deploy:netlify). ShutterBid: netlify.toml + site shutterbid-web. public-site redeployed. See docs/UNIFORM_DEPLOY.md.
