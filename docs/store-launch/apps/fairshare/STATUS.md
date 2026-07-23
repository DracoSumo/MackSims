# FairShare - Store Launch Status

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| iOS | NOT STARTED | Bundle ID and TestFlight status not confirmed |
| Android | NOT STARTED | Package name and AAB status not confirmed |
| Web/PWA | NOT STARTED | Current deployment status not confirmed |
| Store copy | NOT STARTED | Seeded template only; owner review required |
| Privacy | NEEDS OWNER CONFIRMATION | Complete `PRIVACY_DATA.md` |
| Screenshots | NOT STARTED | Capture after build is final |
| Tester readiness | NOT STARTED | Demo/reviewer path not confirmed |
| Backend readiness | NEEDS OWNER CONFIRMATION | Confirm APIs, location, comparison data, analytics |

## Highest-Priority Blockers

- Confirm location behavior and whether background location is used.
- Confirm fare/pricing source and required disclaimers.
- Confirm third-party provider/API language.
- Confirm privacy/data safety answers with owner.

## Next Action

Confirm product scope and provider integrations, then complete `PRIVACY_DATA.md` before drafting final store copy.

---

## 2026-07-05 — Bulk UI Polish + Mismatch Audit append

| Area | Status | Notes |
| --- | --- | --- |
| Mobile UI | **IMPROVED** | Bottom nav added at ≤719px; top nav hidden on phone |
| Local build | **PASS** | `npm run check` on 2026-07-05 |
| Public route | **LIKELY MATCH** | `https://fairshare-v03-20260624.netlify.app/` per deploy report — not live-probed this pass |
| Store readiness | **NOT STARTED** | Unchanged |
| Screenshot prep | **MINOR POLISH ONLY** | Demo/beta banners remain visible — owner decision for marketing captures |
| Source vs deploy | **LIKELY MATCH** | package `0.3.0` aligns with Netlify slug |

See `docs/BULK_UI_POLISH_REPORT.md` for full mismatch table.

