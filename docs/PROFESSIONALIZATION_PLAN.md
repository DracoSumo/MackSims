# MackSims — Professionalization Plan

**Date:** 2026-07-27  
**Branch:** `cursor/professional-growth-00d9`  
**Owner:** MackSims (`csims@macksims.com` / `feedback@macksims.com`)

## Snapshot

| Product | In monorepo | Live posture | Professional gap |
|---------|-------------|--------------|------------------|
| **FishCrew** | Separate (gitignored) | External beta | Charter onboarding + ads + lead outreach |
| **ShutterBid** | Separate (gitignored) | External beta | Photographer onboarding + ads + lead outreach |
| **CurbCue** (FairShare) | ✅ | Simulated beta | Live fares, maps, legal, venue partners |
| **MotoCrew** | ✅ | Mocked ride shell | Real rides/maps, RLS, legal |
| **CoachCore** | ✅ | Static demo + OAuth scaffold | Roster persistence, athlete path, legal |
| **Sermon Studio** | ✅ | Local-first beta | Sync/RLS, scripture depth, legal |
| **Content Suite / Aegis** | Outside | Catalog only | Not in this pass |

Related open PRs (merge coordination): blank-screen (#2), continuity (#4), next-wave bones (#5), Cap/deps upgrade (#6), no-filler after login (#7).

---

## Definition of “professional standard”

A MackSims app is professional-ready when:

1. **Core loop works with real or honestly labeled estimate data** (not mock-as-product).
2. **Auth + cloud sync** have schema + RLS and survive sign-out / second device.
3. **Legal pack** (Privacy + Terms) is published and linked from every surface.
4. **Demo chrome is gated** — signed-in / workspace users see product UX, not beta theater.
5. **Observability** — basic error reporting + funnel analytics.
6. **Store / web listing** — privacy questionnaire, screenshots, consistent `com.macksims.*` IDs.
7. **Support path** — `feedback@macksims.com` + documented SLAs for beta partners.

---

## Ranked workstreams (this initiative)

### A. Growth engine (started this branch)

| Workstream | Deliverable | Status |
|------------|-------------|--------|
| Advertising campaign | `docs/marketing/*` — brief, demo video scripts, ad copy, channels | ✅ Started |
| B2B lead outreach | `docs/outreach/*` + seeded Bermuda lead CSVs + mail-merge scripts | ✅ Started |
| Legal pack | Shared `legal/` + wired into four hybrids | ✅ Started |

### B. Per-app product bones (parallel / next commits)

#### CurbCue
1. Keep live fare adapter behind flag until Wave 1 feedback (`LIVE_FARE_ADAPTER_ENABLED`).
2. Finish Supabase RLS for polls/comparisons/profiles.
3. Maps/geocoding adapter (autocomplete + pickup pins).
4. Venue partner handoff flow (QR / “Your riders leave through CurbCue”).
5. Gate admin/driver/gov shells from consumer builds.

#### MotoCrew
1. RLS policies + leave-ride sync.
2. Real ride catalog (replace mock IDs).
3. Phase 0.3 map provider behind `mapAdapter`.
4. Unify emergency contacts.
5. Privacy/Terms + honest “online-only” or PWA SW.

#### CoachCore
1. Merge Wave 2 product bones if not on master.
2. v0.6: apply schema + RLS; coach/athlete roles.
3. Athlete “today” completion path.
4. Replace placeholder Privacy/Terms (this branch).
5. Narrow Wave 1 nav (hide Chat/Admin/Integrations theater).

#### Sermon Studio
1. Schema with `user_id` + RLS; true cloud delete.
2. Align or remove churches/`/api/ics` mismatch.
3. Expand scripture / worship libraries.
4. Privacy/Terms pages (this branch).
5. Stay on Next 14.2.x patches until migration authorized.

#### FishCrew / ShutterBid (external)
1. Supply demo videos into MackSims ad campaign.
2. Run charter / photographer outreach sequences from lead CSVs.
3. Vendor sources into monorepo when store CI needs them.

---

## Execution order (recommended)

```
Week-of ops (no calendar estimate — sequenced work):
1. Ship legal + marketing + outreach scaffolding (this PR)
2. Merge #2/#4/#5/#6/#7 when green
3. Redeploy four Netlify hybrids + rebuild Capacitor
4. Record demo videos per docs/marketing/DEMO_VIDEO_SCRIPTS.md
5. Launch Meta/Google ads on FishCrew + ShutterBid first (strongest betas)
6. Start email sequences to venues / photographers / charters
7. Close Supabase RLS gaps app-by-app
8. Live data adapters (fares, maps, rides) behind flags
```

---

## Success metrics

| Metric | Target signal |
|--------|---------------|
| Demo video completion | 6 app cutdowns + 1 MackSims brand reel published |
| Outreach | ≥50 verified public business emails researched; first 25 contacted |
| Ads | CTR + cost-per-beta-signup tracked weekly |
| Product | Signed-in users never see “placeholder / not live” as primary chrome |
| Legal | Privacy + Terms linked on all four hybrids |
| Backend | RLS policies applied where OAuth is offered |
