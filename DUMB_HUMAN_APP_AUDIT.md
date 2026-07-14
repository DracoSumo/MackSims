# Dumb Human App Audit

**Audit date:** 2026-07-05  
**Auditor mode:** Impatient phone user — tap first, read never, rage-quit at 3 seconds of confusion  
**Evidence:** HTTP boot probes, production/local dev servers, build commands, terminal logs, source review, one live FishCrew accessibility snapshot. No screenshot files generated (browser automation unavailable after initial FishCrew load).

---

## Scope

### Apps tested
| App | Local path | Stack | Dev command | Build | Test command |
|-----|------------|-------|-------------|-------|--------------|
| **FishCrew** | `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070` | Static HTML/JS + Supabase | `python -m http.server` or Netlify static | N/A (static) | `node tests/v070-static-checks.js`, `node tests/auth-modal-smoke.js` |
| **ShutterBid** | `C:\Users\draco\Downloads\MackSims\apps\ShutterBid\shutterbid-starter` | Next.js 16 + Firebase | `npm run dev` (port 3457 existing) | `npm run build` ✅ | `npm run test:smoke` (blocked by existing dev server) |
| **FairShare** | `C:\Users\draco\Downloads\MackSims\apps\FairShare` | Vite 7 + React 19 | `npm run dev` → `:3000` | `npm run build` ✅ | `npm run test` (vitest) |
| **MotoCrew / Throttle** | `C:\Users\draco\Downloads\MackSims\apps\MotoCrew` | Vite 8 + React 19 | `npm run dev` → `:5173` | `npm run build` ✅ | `npm run test` (vitest) |
| **CoachCore** | `C:\Users\draco\Downloads\MackSims\apps\CoachCore\coachcore-static-v001` | Next.js 16 + Supabase | `npm run dev` → `:3002` | `npm run build` ✅ | `npm run test` (vitest) |
| **Sermon Studio** | `C:\Users\draco\Downloads\sermon-studio-next` | Next.js 14 + Supabase | `npm run dev` → `:3003` | `npm run build` ❌ | None found |

### Apps skipped
| App / folder | Reason |
|--------------|--------|
| **Aegis Intel** (all `aegis-intel-*` folders) | Explicitly excluded |
| **FishCrew iOS wrapper** (`MackSims/apps/FishCrew/fishcrew-ios`) | Empty package — no UI, only `build:ios` echo |
| **MackSims public site / launch packs** | Out of scope per instructions |
| **ShutterBid backups** (`shutterbid-working-mvp-backup`, etc.) | Duplicates of canonical ShutterBid starter |
| **FairShare duplicate** (`MackSims/Fairshare`) | Duplicate spelling folder; tested canonical `apps/FairShare` |
| **sports-predictor-mvp** | Not clearly MackSims portfolio; Expo mobile — not booted this pass |

**Aegis Intel was excluded.**

---

## Executive Summary

**Brutal truth:** The portfolio boots, but only **MotoCrew** and **ShutterBid** feel like they know what a confused stranger should tap first. **FishCrew** is the most feature-rich guest experience but drowns lazy users in words, beta warnings, and sign-in walls. **FairShare** makes you read a legal-ish beta essay before anything moves. **CoachCore** looks premium then punishes you with fake login fields and dev-server crashes. **Sermon Studio** cannot even ship a production build.

**Safest for real humans today:** MotoCrew (honest demo shell, one safety tap, mobile-first) → ShutterBid (clear “Post. Compare. Book.” home) → FishCrew (guest browse works, but noisy).

**Most embarrassing:** Sermon Studio (build broken). CoachCore close second (placeholder auth masquerading as real login).

**Lazy user quits first:** Sermon Studio (overwhelming single page + broken build) or FairShare (beta gate wall of text before compare).

---

## Portfolio Ranking

1. **MotoCrew / Throttle** — One safety button, obvious bottom nav, demo labels honest; rider can tap rides in under 30s.
2. **ShutterBid** — Home headline and CTAs are clear; builds clean; role/login maze still hurts.
3. **FishCrew** — Guest can browse a lot; beta banner + information density + sign-in gates on every action create friction.
4. **FairShare** — Compare works on defaults, but beta gate + “simulated only” reality kills trust for “I need a ride now.”
5. **CoachCore** — Great marketing hook, but login/signup are decorative; dev 500s; dashboard is demo wallpaper.
6. **Sermon Studio** — Cannot production-build; one giant form with no pastor onboarding; lazy user drowns.

---

## Findings by App

### FishCrew

* **Local path:** `C:\Users\draco\Downloads\FishCrew-Superfolder\current\fishcrew-static-v070`
* **Stack:** Static SPA (`app.js`, `config.js`, Supabase)
* **Boot result:** ✅ Production `https://fishcrew.macksims.com/` HTTP 200; local static not served this pass (sandbox blocked)
* **Build result:** N/A static; static checks 87/87 pass locally (prior pass)
* **Mobile result:** Single-page with bottom nav (Home, Explore, Crew, Feed, Tools, Profile); high content density; beta banner; boot splash “Opening the dock.” — **both mobile + desktop**
* **First 60 seconds verdict:** At ~5s you know it’s fishing crew stuff. At ~10s there are many equal-weight buttons (Find a trip, Post catch, Tools, tutorial steps) — **no single obvious first tap**. At ~30s guest can read conditions and open Tools. At ~60s hitting Post catch / Create post / Join trip → sign-in wall.
* **Lazy user quit risk:** **Medium** — lots to browse, but every “do something” path ends at auth.

#### P0 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FC-P0-001 | Password reset may not work on production until hardening deploy | Guest → Sign in → Forgot password → enter email | Reset email or honest success | Prior live deploy had “not wired yet” stub; hardening pass exists locally but **not verified live this audit** | Deploy hardening package; confirm Supabase redirect URL |

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FC-P1-001 | Guest “useful action” trap — post/join/chat all hard-gated | Open app → tap **Post catch** or **Create post** or **Sign in to post a trip** | Clear guest path or softer CTA | Toast/modal: must sign in | Add one-tap guest win (e.g. browse explore, save area) before auth wall |
| FC-P1-002 | Information overload on home | Land on `/` mobile | One primary action | Hero + beta banner + 6+ chips + tutorial + feed + trips + partners — **scroll fatigue** | Collapse home to 1 hero CTA + “Browse as guest” |
| FC-P1-003 | Account deletion still not full cloud delete | Settings → Delete account → expect gone everywhere | Full deletion | Local device only + support email path | Edge Function deletion (known blocker) |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FC-P2-001 | Beta banner before value | First visit | Optional dismiss | “You are testing an early FishCrew build…” — must dismiss or ignore | Default collapsed; link only in settings |
| FC-P2-002 | Boot splash competes with content | Refresh `/` | Fast ready | “Opening the dock.” heading visible alongside home (snapshot) | Shorten boot or skip when cached |
| FC-P2-003 | Fishing jargon without glossary | Tap **Port Window**, **Alafia mouth**, **bite board** | Plain English | Assumes local knowledge | Tooltips or “what’s this?” on first tap |
| FC-P2-004 | Fish ID / measure feel real but are heuristic | Tools → Fish ID → upload photo | Clear “demo estimate” | Disclaimers exist (post-hardening) but lazy user skips reading | Result modal must lead with “NOT LEGAL PROOF” one line |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FC-P3-001 | Tutorial is optional wall of text | Tap **Start tutorial** | Quick 3-step | Multi-card tutorial modal | 3-screen carousel max |
| FC-P3-002 | Settings gear (life preserver) non-obvious | Look for settings | Obvious icon | Decorative life preserver — cute, not universal | Add “Settings” label on first visit |

#### Stupid Human Notes
> “I opened FishCrew and saw a million buttons. I tapped **Post catch** because it was big and green-ish and it told me to sign in. I don’t know what a bite board is. I tapped **Tools** and Fish ID looked like Shazam for fish — cool — but I still can’t post anything without an account. The beta banner makes me think it’s broken.”

#### Recommended Fix Order
1. FC-P0-001 — Deploy password reset + verify live  
2. FC-P1-002 — Home simplification (one guest win)  
3. FC-P1-001 — Soften guest dead-ends  
4. FC-P1-003 — Cloud deletion path  
5. FC-P2-001 — Beta banner demotion  

---

### ShutterBid

* **Local path:** `C:\Users\draco\Downloads\MackSims\apps\ShutterBid\shutterbid-starter`
* **Stack:** Next.js 16 + Firebase + Tailwind
* **Boot result:** ✅ `http://127.0.0.1:3457/` HTTP 200 (pre-existing dev server)
* **Build result:** ✅ `npm run build` succeeded
* **Mobile result:** Responsive home with horizontal nav scroll; role-specific login lanes — **mobile + desktop**
* **First 60 seconds verdict:** **5s:** “Post. Compare. Book.” — clear. **10s:** Post a job / Templates / Get started visible. **30s:** Can browse templates and how-it-works without login. **60s:** Post job without account → redirect to signup (draft saved — good).
* **Lazy user quit risk:** **Medium** — role/login lane confusion; photographer vs client vs venue vs admin.

#### P0 Findings
_None — app boots and builds._

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SB-P1-001 | Login lane maze | Tap **Sign in** from home → discover `/photographer/login`, `/business-venue/login`, `/admin/login`, etc. | One front door | 7+ login URLs; lazy user picks wrong lane | Single login with role picker after auth |
| SB-P1-002 | Post job empty submit as guest | `/post-job` → leave title blank → submit | Validation message | Redirects to signup with draft saved — **confusing** (“did it post?”) | Inline “Sign in to publish” before redirect |
| SB-P1-003 | Sample jobs labeled “Sample” but look live | Home → job cards | Clear demo | “Wedding reception coverage” with budget looks real until you notice “Sample” | Badge “Demo job” on card face |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SB-P2-001 | Horizontal web nav overflow on narrow phone | 390px width home | All nav visible | Explore nav scrolls horizontally — easy to miss **Sign in** | Bottom tab bar for mobile |
| SB-P2-002 | Firebase env dependency opaque to user | Login with bad password | Friendly error | Generic auth errors possible (Firebase) | Map Firebase codes to plain English |
| SB-P2-003 | Playwright smoke could not run | `npm run test:smoke` | Pass | Failed: another dev server already on 3457 | Document single-server test workflow |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SB-P3-001 | Next.js turbopack root warning | Dev boot | Clean log | Warning about `C:\Users\draco\package-lock.json` as root | Set `turbopack.root` in next.config |
| SB-P3-002 | Many internal `/readiness-*` routes in build | Discover `/public-readiness-95` etc. | Hidden from users | Routes exist (build output) — SEO/noise risk | robots/noindex internal QA routes |

#### Stupid Human Notes
> “I know it’s a photo job app in like 5 seconds. I tapped **Post a job**, filled nothing, hit submit, and suddenly I’m signing up — did my job post? I went to **Sign in** but I’m not a photographer or a venue, I’m just a person with a phone.”

#### Recommended Fix Order
1. SB-P1-001 — Unified login + role pick  
2. SB-P1-002 — Guest post-job clarity  
3. SB-P2-001 — Mobile nav pattern  
4. SB-P1-003 — Demo job labeling  

---

### FairShare

* **Local path:** `C:\Users\draco\Downloads\MackSims\apps\FairShare`
* **Stack:** Vite 7 + React 19 + Supabase optional
* **Boot result:** ✅ `http://127.0.0.1:3000/` HTTP 200
* **Build result:** ✅ `npm run build` (514 kB JS chunk warning)
* **Mobile result:** App shell + bottom-style nav in header; beta gate full-screen first — **mobile + desktop**
* **First 60 seconds verdict:** **5s:** Beta gate — must read 4 bullets. **10s:** “I understand — explore the demo” is only obvious action. **30s:** Compare with Bermuda defaults works. **60s:** Change pickup to nonsense → “No estimates for this trip.”
* **Lazy user quit risk:** **High** — beta wall + simulated data ≠ “get me a ride.”

#### P0 Findings
_None — boots and builds._

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FS-P1-001 | Beta gate blocks instant compare | First visit `/` | Compare rides | Full-screen disclaimer; must click accept | Skip gate for `/compare` deep link OR one-line dismiss |
| FS-P1-002 | “Compare rides” with wrong cities = dead end | `/compare` → clear pickup/dropoff → Compare | Helpful error | “No estimates for this trip” + Bermuda hint — lazy user already left | Default trip always works; inline “try Bermuda demo” button |
| FS-P1-003 | Invalid URLs show home silently | Visit `/garbage` | 404 | HTTP 200, renders **HomePage** (SPA default case) | Dedicated not-found view |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FS-P2-001 | “No bookings happen” kills urgency | Read beta gate | Actionable compare | Explicit: nothing is real — user asks “why am I here?” | Lead with “See how fares compare” not legal bullets |
| FS-P2-002 | Operator/admin routes discoverable | Settings → internal links → `/admin` | Hidden from riders | Admin, Government, Canyon shells reachable | Gate behind dev flag |
| FS-P2-003 | Account/settings role selector with no effect | Settings → change role to Admin | Something changes | Local profile label only — feels broken | Disable or explain “demo label only” |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| FS-P3-001 | Large JS bundle | First load mobile | Fast | 514 kB JS | Code-split compare route |
| FS-P3-002 | DemoDataBanner always visible | Any page | Subtle | Persistent banner | Collapsible after first view |

#### Stupid Human Notes
> “I wanted to compare Uber vs taxi. First I got a homework assignment about simulated data. I clicked through, hit Compare, and got a bunch of fake prices for Bermuda? I typed ‘home’ to ‘work’ and it said no estimates. I’m done.”

#### Recommended Fix Order
1. FS-P1-001 — Beta gate shorten or bypass to compare  
2. FS-P1-002 — Foolproof default compare trip  
3. FS-P1-003 — Real 404  
4. FS-P2-001 — Rewrite opening value prop  

---

### MotoCrew / Throttle

* **Local path:** `C:\Users\draco\Downloads\MackSims\apps\MotoCrew`
* **Stack:** Vite 8 + React 19 (Throttle branding in `THROTTLE_TESTING_NOTES.md`)
* **Boot result:** ✅ `http://127.0.0.1:5173/` HTTP 200
* **Build result:** ✅ `npm run build`
* **Mobile result:** Phone-stage layout, bottom nav (Home/Rides/Map/Chat/Safety/Profile), safety gate — **mobile-first**
* **First 60 seconds verdict:** **5s:** Safety gate — one button. **10s:** Home with hero ride. **30s:** Join/leave ride works locally. **60s:** Map = placeholder, chat disabled — but labeled.
* **Lazy user quit risk:** **Low** for demo; **Medium** if user expects real GPS/chat.

#### P0 Findings
_None._

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| MC-P1-001 | Rides tab empty without selecting ride | Tap **Rides** before picking ride | List of rides | Blank/sub-state until ride selected from Home | Default-select first open ride |
| MC-P1-002 | Map tab is explicit placeholder | Tap **Map** | Map | “Map view not configured” — honest but dead end | Link to external maps or clearer “demo only” CTA back to ride |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| MC-P2-001 | Chat input disabled without loud empty state | Tap **Chat** → type | Message | Input disabled “Not live” — easy to miss | Banner at top of chat |
| MC-P2-002 | Invalid route serves same SPA | `/garbage` | 404 | HTTP 200, same app | Client 404 state |
| MC-P2-003 | Create ride form long for rider-on-bike context | Create ride | Quick | Many fields — OK on couch, bad if user ignores safety gate | Keep on create screen only |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| MC-P3-001 | Desktop rail + phone stage dual chrome | Wide desktop | One layout | Shows both — slightly confusing | Hide rail on narrow only (already mostly mobile) |

#### Stupid Human Notes
> “It told me not to use it while riding — good. I tapped through, joined a ride, felt like Strava for motorcycles. Map was useless but it said so. Chat didn’t work but the button looked clickable — minor annoyance.”

#### Recommended Fix Order
1. MC-P1-001 — Rides tab default selection  
2. MC-P1-002 — Map dead-end UX  
3. MC-P2-001 — Chat disabled banner  

---

### CoachCore

* **Local path:** `C:\Users\draco\Downloads\MackSims\apps\CoachCore\coachcore-static-v001`
* **Stack:** Next.js 16 + Supabase
* **Boot result:** ⚠️ First GET `/` 200, subsequent GET `/` **500** in dev (RSC manifest error in terminal)
* **Build result:** ✅ `npm run build` succeeded (production may work)
* **Mobile result:** Marketing page responsive; `/app` dashboard dense — **mobile + desktop**
* **First 60 seconds verdict:** **5s:** “No more guessing who is locked in.” — **excellent hook**. **10s:** Start Demo vs Open Dashboard — clear. **30s:** Dashboard loads with fake stats. **60s:** Try typing in login → fields are **disabled/decorative**.
* **Lazy user quit risk:** **High** — user thinks they’re signing up; nothing real happens.

#### P0 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| CC-P0-001 | Dev server 500 on `/` after refresh | `npm run dev` → open `/` twice | Stable home | `Could not find the module ... global-error.js#default` in React Client Manifest | Fix Next 16 dev/turbopack config; verify `npm run start` after build |

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| CC-P1-001 | Fake login form — fields non-functional | `/login` → type email/password → no submit | Sign in | Fields in `opacity-60` block; only **Enter Demo Dashboard** link works | Remove fake fields OR wire real auth |
| CC-P1-002 | Signup pretends to create account | `/signup` → fill form → **Create Demo Workspace** | Account created | Link to `/app` — no validation, no backend | Rename button “Open demo” ; remove form pretense |
| CC-P1-003 | `/app` accessible without auth | Direct visit `/app` | Login wall | Dashboard loads for anyone | Middleware auth when Supabase live |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| CC-P2-001 | Dashboard feels like generic SaaS | Land `/app` | “Who is locked in?” focus | Lots of cards/modules — hook diluted | Put accountability alert above fold only |
| CC-P2-002 | Demo disclaimer easy to ignore | Scroll past strip | Obvious demo | Small strip | Persistent “Demo data” pill |
| CC-P2-003 | HTTP 308 on trailing-slash routes | `curl /login` without follow | 200 | 308 Permanent Redirect | Normal Next behavior — lazy user bookmarking may confuse |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| CC-P3-001 | “View signup placeholder” link text | `/login` footer | Professional | Literally says “placeholder” | Remove “placeholder” from user copy |

#### Stupid Human Notes
> “The tagline hooked me instantly. I tried to log in like a normal app and the email box barely works. I clicked Enter Demo Dashboard and got a pretty dashboard that’s clearly fake numbers. Sign up says ‘Create demo account’ — at least it’s honest, but I feel tricked by the login page.”

#### Recommended Fix Order
1. CC-P0-001 — Dev stability  
2. CC-P1-001 — Kill fake login UI  
3. CC-P1-002 — Honest signup CTA  
4. CC-P1-003 — Auth gate for `/app` when live  

---

### Sermon Studio

* **Local path:** `C:\Users\draco\Downloads\sermon-studio-next`
* **Stack:** Next.js 14 + Supabase + Tailwind
* **Boot result:** ✅ `http://127.0.0.1:3003/` HTTP 200 (dev)
* **Build result:** ❌ **FAILED** — `components/ui/tabs.tsx:9` TypeScript error on `cloneElement` `value` prop
* **Mobile result:** Single page with many tabs/sections — **desktop-first layout**, poor narrow-screen scan — **mobile + desktop**
* **First 60 seconds verdict:** **5s:** Unclear — looks like a admin dashboard. **10s:** No “start here” for pastors. **30s:** Can type sermon title. **60s:** Overwhelmed by tabs (Songs, Series, Library, Export…).
* **Lazy user quit risk:** **Nuclear**

#### P0 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SS-P0-001 | Production build broken | `npm run build` | Success | TS error in `tabs.tsx` cloneElement | Fix tabs component types or replace with Radix/shadcn properly |
| SS-P0-002 | No onboarding — zero-context pastor lost | Open `/` | Guided first sermon | One massive page | Wizard: Title → Passage → Notes → Export |

#### P1 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SS-P1-001 | Save/export unclear | Fill sermon → look for Save | Obvious save | localStorage + Supabase hybrid — no prominent “Saved!” | Sticky save bar + toast |
| SS-P1-002 | Mobile layout overload | 390px viewport | Thumb-friendly | Multi-column grids, tiny controls | Single-column mobile stack |

#### P2 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SS-P2-001 | `window.prompt` for new series | Series → New Series | Modal form | Browser prompt — feels broken/1998 | Inline modal component |
| SS-P2-002 | Invalid URL | `/garbage` | Friendly 404 | Next.js 404 ✅ | OK |
| SS-P2-003 | Browserslist outdated warning | Build | Clean | Warning in build log | `npx update-browserslist-db` |

#### P3 Findings
| ID | Issue | Exact steps | Expected | Actual | Likely fix |
|----|-------|-------------|----------|--------|------------|
| SS-P3-001 | Mixed Next 14 + old React 18 | — | Current stack | Behind other apps on Next 16 / React 19 | Upgrade when build fixed |

#### Stupid Human Notes
> “I’m a pastor not a web developer. I opened this and saw fifty boxes. I don’t know where to start. I clicked around and nothing told me I saved anything. If this is sermon software, where’s step one?”

#### Recommended Fix Order
1. SS-P0-001 — Fix build  
2. SS-P0-002 — Pastor onboarding wizard  
3. SS-P1-001 — Save feedback  
4. SS-P1-002 — Mobile layout pass  

---

## Cross-App Problems

| Theme | Apps affected | Pattern |
|-------|---------------|---------|
| **Auth** | FishCrew, ShutterBid, CoachCore, FairShare | Multiple login entry points; placeholder login fields (CoachCore); guest→signup redirects without clear status (ShutterBid) |
| **Mobile layout** | ShutterBid, FairShare, Sermon Studio, FishCrew | Horizontal nav scroll; dense home screens; desktop grids on phone |
| **Navigation** | FairShare, MotoCrew | Invalid URLs silently show home (SPA) |
| **Empty states** | FairShare, MotoCrew, FishCrew | “No estimates” / no ride selected — weak recovery CTAs |
| **Forms** | CoachCore, ShutterBid, Sermon Studio | Long forms; decorative fields; weak validation feedback |
| **Error messages** | ShutterBid (Firebase), FishCrew (auth) | Technical or generic — not lazy-human plain |
| **Loading states** | FairShare | Good loading spinner on compare; others inconsistent |
| **Onboarding** | FairShare (negative — wall of text), Sermon Studio (missing), FishCrew (optional tutorial) | No portfolio-wide “first 10 seconds” pattern |
| **Protected routes** | CoachCore (`/app` open), FairShare (`/admin` open) | Demo shells reachable without auth |
| **Build/deploy readiness** | Sermon Studio ❌, CoachCore dev ⚠️, others ✅ | Sermon Studio blocks ship |

---

## Silver Bullet Fix List

Smallest set of changes that improve the **whole portfolio** fastest:

1. **One front door for auth everywhere** — Single `/login` with role picked *after* sign-in (ShutterBid lanes, FishCrew tabs, CoachCore fake fields).
2. **Kill or shorten beta gates** — FairShare + FishCrew beta banner: one line + dismiss forever (not 4 bullets).
3. **Invalid URL handling in SPAs** — FairShare + MotoCrew: show “Page not found” instead of home.
4. **Fix Sermon Studio build** — Unblocks the only app that literally cannot ship.
5. **Guest “one win in 30s”** — Each app: one no-login action with visible result (FishCrew: conditions; FairShare: default compare; ShutterBid: browse templates; CoachCore: accountability preview; MotoCrew: join demo ride).
6. **Demo labeling on cards** — ShutterBid sample jobs, FairShare fares, CoachCore stats — face-visible “Demo” badge.

---

## Do Not Touch Yet

| Area | Why |
|------|-----|
| **FishCrew Supabase RLS / username RPCs** | Privacy-critical; prior live verify 6/6 |
| **ShutterBid Firebase rules / admin approval flows** | Complex; role gates intentional |
| **MotoCrew mock data architecture** | Documented demo shell; don’t fake live GPS |
| **FairShare tariff model math** | Backend sprint work — UX first |
| **Aegis Intel** | Out of scope |
| **CoachCore Supabase schema** | Until auth is real, gating is premature |
| **Mass route deletion in ShutterBid** (`/readiness-*`) | May be used by internal QA scripts |

---

## Checks Run (this audit)

| Command / probe | Result |
|-----------------|--------|
| HTTP boot all local apps + FishCrew prod | All 200 except CoachCore intermittent 500 |
| `npm run build` FairShare | ✅ |
| `npm run build` MotoCrew | ✅ |
| `npm run build` ShutterBid | ✅ |
| `npm run build` CoachCore | ✅ |
| `npm run build` Sermon Studio | ❌ tabs.tsx TS error |
| `npm run test:smoke` ShutterBid | ❌ dev server port conflict |
| FishCrew static checks | Not re-run this pass (prior 87/87) |
| Mobile browser automation | Partial — one FishCrew prod snapshot only |

---

*End of audit. No source code was modified. No deploys. No commits.*
