# Per-App Backend + Bug/Trap Sweep Report
Generated: 2026-07-04 (session c3c42c11)

## Executive summary

All four apps **pass local `npm run check`** after fixes. Production still needs a **redeploy with baked Supabase env** (`deploy-all-with-keys.ps1`) because Netlify `NEXT_PUBLIC_*` vars are not valid JWTs (verify shows `keyLen=73`, `validJwt=False`). OAuth callback routes exist in source builds but **404 or show stale home** on production until redeployed.

---

## CoachCore (`coachcore7.netlify.app`)

### Flesh-out
- `src/services/supabaseSync.ts` — push check-ins, action log, beta requests; remote count
- Wired into `checkInStore`, `actionLogStore`, `betaIntake`
- `ProfileAuthPanel` — session + local/remote counts
- OAuth Google/GitHub PKCE, `/auth/callback` static page

### Env alignment
| Field | Status |
|-------|--------|
| URL in production bundle | **OK** — `bfqfbkldxbojrrxeidcc` (status panel) |
| Anon key baked at build | **FAIL** — placeholder (~73 char Netlify env) |
| Netlify `projectMatch` | **FAIL** — verify script |

### Build / deploy
- **Build:** PASS (`npm run check`)
- **Deploy:** NEEDS REVIEW — run `scripts/deploy-all-with-keys.ps1` (local bake)

### Verification (production smoke)
- `/app/status/` loads; Supabase panel shows **error** (placeholder anon key)
- `/auth/callback` → **404** (stale deploy; local `out/auth/callback/index.html` exists)
- 390px nav: OK (status page renders full nav)

### Bug/trap sweep
| Item | Type | Action |
|------|------|--------|
| Status page claimed "No real auth" | Trap | **FIXED** — updated locks/safety copy |
| Beta page "server not connected" | Trap | **FIXED** — honest Netlify/Supabase messaging |
| `betaIntake.ts` localStorage parse crash | Bug | **FIXED** — safe read + corrupt key removal |
| OAuth callback URL missing trailing slash | Bug | **FIXED** — `/auth/callback/` + netlify 301 redirect |
| Demo walkthrough says "not connected" | Trap | NEEDS REVIEW — accurate for auth until redeploy |
| Mock actions fake success | Trap | OK — labeled demo/local |

**Sweep status:** FIXED (code) / NEEDS REVIEW (production deploy + env)

---

## FairShare (`fairshare-v03-20260624.netlify.app`)

### Flesh-out
- `src/lib/supabaseSync.ts` — saved comparisons, crowd polls, user profile
- Wired into `storage.ts` save paths
- Settings "Data sync" row + OAuth in settings
- Reads both `VITE_*` and `NEXT_PUBLIC_*` env names

### Env alignment
- **FAIL** — production not configured at build time (OAuth buttons disabled pattern expected)

### Build / deploy
- **Build:** PASS
- **Deploy:** NEEDS REVIEW

### Verification (production smoke)
- Home loads at 390px; nav OK
- `/auth/callback` → shows **home** (stale bundle without callback handler, or pre-OAuth deploy)
- Settings → connection test not re-smoked this pass

### Bug/trap sweep
| Item | Type | Action |
|------|------|--------|
| `WEB_CANONICAL_URL` typo `fareshar.netlify.app` | Trap | **FIXED** → correct site URL |
| CrowdMeter "Pending" disabled button | Trap | **FIXED** — added `title` explanation |
| `integrationHooks.ts` TODOs | Trap | OK — documented roadmap, not fake success |
| localStorage in `storage.ts` | Bug | OK — try/catch + array guards already present |

**Sweep status:** FIXED / NEEDS REVIEW (deploy)

---

## MotoCrew (`motocrewz.netlify.app`)

### Flesh-out
- `src/services/supabaseSync.ts` — rider profile, joined rides
- Wired into `profileStore.ts`
- OAuth + `AuthCallbackHandler` in `App.tsx`
- Profile screen Supabase ping line

### Env alignment
- **FAIL** — same Netlify env issue

### Build / deploy
- **Build:** PASS (after lint fix)
- **Deploy:** NEEDS REVIEW

### Verification (production smoke)
- Home + bottom nav OK at mobile width
- `/auth/callback` → **home shell** (stale deploy)
- Disabled chat input | OK — placeholder explains no backend

### Bug/trap sweep
| Item | Type | Action |
|------|------|--------|
| `setState` in `useEffect` for auth callback | Bug | **FIXED** — removed redundant effect |
| `useLocalStorageState` parse errors | Bug | OK — try/catch returns initial |
| Service worker | N/A | None in app |

**Sweep status:** FIXED / NEEDS REVIEW (deploy)

---

## Sermon Studio (`sermon-studio-beta.netlify.app`)

### Flesh-out
- Existing Supabase sermon/series sync in `app/page.tsx`
- OAuth in `AuthCard`; callback at `app/auth/callback/page.tsx`
- `.env.local` URL + anon filled locally

### Env alignment
- Local `.env.local` OK; Netlify production **FAIL**

### Build / deploy
- **Build:** PASS
- **Deploy:** NEEDS REVIEW — use local build + `netlify deploy --prod` (script updated to skip remote rebuild)

### Verification (production smoke)
- `/auth/callback` → **404** (route in build output but not deployed)

### Bug/trap sweep
| Item | Type | Action |
|------|------|--------|
| localStorage double-parse crash path | Bug | **FIXED** — per-key try/catch + corrupt key removal |
| ChurchSwitcher disabled when empty | Trap | OK — loading/empty states |
| Service worker | N/A | None |

**Sweep status:** FIXED / NEEDS REVIEW (deploy)

---

## Operator checklist (blocking green panels + OAuth)

1. **Netlify team env cleanup** — Remove or scope team-wide `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_*` that override per-site vars (scoped "All").
2. **Set per-site env** — Run `scripts/align-all-supabase-env.ps1` (uses site IDs). Verify with `scripts/verify-netlify-supabase.ps1` until `validJwt=True` and `projectMatch=True`.
3. **Deploy with baked keys** — Run `scripts/deploy-all-with-keys.ps1` from an approved session (reads gitignored `.netlify-supabase-keys.json`).
4. **Supabase SQL** — Run each app's `supabase/schema.sql` in the matching project.
5. **RLS policies** — Enable insert policies for sync tables when authenticated.
6. **OAuth providers** — Enable Google + GitHub; redirect URLs:
   - CoachCore: `https://coachcore7.netlify.app/auth/callback/`
   - FairShare: `https://fairshare-v03-20260624.netlify.app/auth/callback`
   - MotoCrew: `https://motocrewz.netlify.app/auth/callback`
   - Sermon: `https://sermon-studio-beta.netlify.app/auth/callback`

---

## Files changed this sweep

- `CoachCore/.../betaIntake.ts`, `beta/page.tsx`, `app/status/page.tsx`, `lib/auth.ts`, `netlify.toml`
- `FairShare/src/config.ts`, `CrowdMeterCard.tsx`
- `MotoCrew/src/App.tsx`
- `sermon-studio-next-patched/app/page.tsx`
- `scripts/deploy-all-with-keys.ps1`, `verify-netlify-supabase.ps1`
