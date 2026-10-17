# FairShare / CurbCue - Store Launch Status

**Updated:** 2026-07-23  
**Owner paste kit:** [`../../OWNER_UPLOAD_KIT.md`](../../OWNER_UPLOAD_KIT.md) (section CurbCue)

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Store copy | **READY TO PASTE** | OWNER_UPLOAD_KIT + ASC/Play docs |
| Privacy / App Privacy wizard | **OWNER CONFIRM** | Matrix in PRIVACY_DATA / CSV; do not invent |
| Screenshots | **READY TO PASTE** | 4×6.5, 4×6.9, 4×iPad 12.9; Play phone+feature ready |
| Age / content rights | **OWNER CONFIRM** | Target 12+ / audience 18+ |
| Reviewer notes | **READY TO PASTE** | Guest browse + optional demo login |
| iOS / Android binaries | IN PROGRESS | ASC `6787820297` · package `com.chrissims.fairshare` |
| Web/PWA | LIVE | https://fairshare-v03-20260624.netlify.app/ |
| Backend readiness | **OWNER CONFIRM** | Location / fare source / provider language |

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

