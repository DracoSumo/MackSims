# MackSims catalog audit

**Date:** 2026-07-27  
**Branch:** `cursor/catalog-prepare-no-filler-db2f`  
**Source:** [macksims.com/products](https://www.macksims.com/products/) + this monorepo

## Rule for this pass

**No filler after login.** Once a user signs in (or enters the app workspace), remove tourist chrome: demo walkthrough banners, fake credential forms, “static demo / mock action” theater, and redundant “Not live” pills on surfaces that already work locally. Keep real safety notices and honest labels only where a capability is truly disconnected (e.g. live GPS voice).

## Catalog status

| Product | Public status | Live URL (checked) | In this monorepo | Post-login readiness |
|---------|---------------|--------------------|------------------|----------------------|
| **FishCrew** | External beta | https://fishcrew.netlify.app/ **200** | No (separate repo) | Outside this PR — audit only |
| **ShutterBid** | External beta | https://www.shutterbid.com/ **200** (netlify subdomain 404) | No (`DracoSumo/ShutterBid`) | Outside this PR — audit only |
| **CurbCue** (FairShare) | External beta | https://fairshare-v03-20260624.netlify.app/ **200** | `apps/FairShare` | Prepared — BetaGate skipped when signed in; DemoDataBanner hidden after auth |
| **MotoCrew** | External beta | https://motocrewz.netlify.app/ **200** | `apps/MotoCrew` | Prepared — safety gate kept; demo chrome stripped after session; checklist/ride planning UX |
| **CoachCore** | External beta | https://coachcore7.netlify.app/ **200** | `apps/CoachCore/coachcore-static-v001` | Prepared — workspace session hides walkthrough; actions use product language |
| **Sermon Studio** | External beta | https://sermon-studio-beta.netlify.app/ **200** | `apps/SermonStudio` | Prepared — beta/start-here banners only before sign-in |
| **Aegis Intel** | Early access | aegisintel.netlify.app **404** | No | Catalog lists it; web beta URL broken — fix marketing link or redeploy |
| **MomentPick** | External beta | https://momentpick.netlify.app/ **200** | No | Outside this PR — audit only |
| **Content Suite** | External beta | https://contentsuite.netlify.app/ **200** | No | Outside this PR — audit only |

Marketing site: https://www.macksims.com/products/ **200**

## Monorepo apps prepared this pass

Built on Wave 2 product bones (CoachCore v0.5 timeline/assignments, MotoCrew v0.2 ride-planning).

### CoachCore
- Login: remove fake email/password filler; OAuth + **Enter coach workspace**
- After workspace session: hide DemoWalkthroughBanner, DemoDisclaimerStrip, FoundationNote inside `/app`
- Actions: “Save / Sent / Saved on this device” instead of “Mock / demo mode”
- AuthGate: “Continue into workspace” (not “demo mode”)
- **v0.7.3:** local roster on Team (add/paste); check-in, notes, accountability, assign film/workout, nutrition use real local stores — no fabricated athletes

### CurbCue
- Signed-in users skip BetaGate and DemoDataBanner
- Pre-auth copy tightened; CTAs say “Continue into CurbCue”

### MotoCrew
- Safety gate remains (legal)
- After session: footer drops tourist DEMO_NOTICE; ride status / pack checklist / comms lose “Not live” theater
- Comms stay disabled but labeled “coming soon”

### Sermon Studio
- Signed-in: no external-beta banner, no “Start here” tourist strip
- AuthCard local copy is product-facing

## Outside monorepo (owner follow-ups)

1. Fix **Aegis Intel** public URL (404) or remove from catalog until live  
2. Align ShutterBid catalog link (canonical is shutterbid.com)  
3. Apply the same “no filler after login” rule in FishCrew / ShutterBid / MomentPick / Content Suite repos when those codebases are in scope  

## Verify

```bash
cd apps/CoachCore/coachcore-static-v001 && npm test && npm run build
cd apps/FairShare && npm run build
cd apps/MotoCrew && npm run build
cd apps/SermonStudio && npm run build
node scripts/swarm-smoke.mjs   # optional against live Netlify
```

## Ship

1. Merge this branch  
2. Redeploy four Netlify hybrids so post-login UX is live  
3. Rebuild Capacitor binaries after Netlify is green  
