# MackSims portfolio — upgrade audit

**Date:** 2026-07-27  
**Branch:** `cursor/portfolio-upgrade-audit-a666`

## Snapshot

| App | Framework | Product label | Highest-leverage upgrade |
|-----|-----------|---------------|--------------------------|
| **CoachCore** | Next 16 + React 19 | v0.5 static demo | Merge Wave 2 product bones (PR #5) → v0.6 Supabase schema/RLS |
| **CurbCue** | Vite 7 + React 19 | v0.3 beta | Live fare adapter behind flag after feedback; Cap ID align |
| **MotoCrew** | Vite 8 + React 19 | v0.2-demo (on PR) | Phase 0.3 map provider behind `mapAdapter` |
| **Sermon Studio** | Next **14** + React **18** | v0.1.1 | Security patch Next 14.2.x now; Next 15/React 19 later |

Open product PRs to merge first (if not already): blank-screen/continuity (#2/#4), next-wave bones (#5).

---

## Safe to do now (this PR)

1. **Align Capacitor default `appId`** → `com.macksims.*` (match Codemagic iOS)
2. **Align Codemagic Android package IDs** → `com.macksims.*` for the four hybrids
3. **Hybrid shell hygiene** on master lineage: trailing-slash URLs, `errorPath`, `allowNavigation`
4. **Patch deps:**
   - CoachCore: Next `16.2.12`, React `19.2.8`, Capacitor `7.6.8`, supabase-js `2.110.9`
   - Sermon Studio: Next `14.2.35`, React `18.3.1`, eslint-config-next match, supabase-js `2.110.9`
   - FairShare / MotoCrew: Capacitor `7.6.8`, supabase-js `2.110.9`, React patch
5. **Remove dead weight** where safe (document unused Netlify Next plugin on static CoachCore)

---

## Defer (higher risk / needs product decision)

| Item | Why defer |
|------|-----------|
| Capacitor **8** | Native regen + Codemagic smoke for all four |
| Sermon Studio → Next **15** + React **19** | Full App Router migration |
| Vitest **4** / ESLint **10** | Config churn, low user value |
| Live fare / GPS / Hudl / AI APIs | Wave 1 feedback + legal/compliance gates |
| Tailwind 4 on Sermon Studio | Visual regression risk |

---

## Per-app backlog (ranked)

### CoachCore
1. Merge Wave 2 (live timeline, assignment flips) if not on master  
2. v0.6: apply `supabase/schema.sql` + RLS; finish OAuth go-live  
3. Cap plugins later: SplashScreen, StatusBar, App  
4. Expand unit tests beyond stores; add `/app` smoke E2E  

### CurbCue
1. Keep `LIVE_FARE_ADAPTER_ENABLED=false` until beta feedback  
2. Staged live adapter with “not a live quote” labeling  
3. Add `@types/react` if missing; more vitest coverage  

### MotoCrew
1. Phase **0.3** map provider evaluation behind `mapAdapter`  
2. Cap vs RN decision before GPS (0.4)  
3. Refresh ROADMAP status vs code  

### Sermon Studio
1. Stay on Next 14.2.x patches  
2. New Supabase project only when authorized (standby doc)  
3. Surface `/api/ics` after sync works  

---

## Applied in this PR (`cursor/portfolio-upgrade-audit-a666`)

- Capacitor default `appId` → `com.macksims.*` for all four hybrids
- Codemagic Android package IDs aligned to `com.macksims.*`
- Hybrid shell: trailing-slash URLs, `errorPath`, `allowNavigation`, offline `error.html`
- Dep patches: CoachCore Next 16.2.12 / React 19.2.8; Sermon Next 14.2.35 / React 18.3.1; Cap 7.6.8 + supabase-js 2.110.9 across apps
- `X-Frame-Options: SAMEORIGIN` for hybrid WebViews
- MotoCrew package version metadata → `0.2.0`

All four apps `npm run check` / build verified after bumps.
