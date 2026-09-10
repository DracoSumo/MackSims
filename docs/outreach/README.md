# MackSims B2B Outreach — Overview

Pull **publicly listed business emails** for venues, photographers, and charter services, then invite them onto the right MackSims app.

**Home market:** Tampa / Tampa Bay (CurbCue is based in Tampa). Bermuda mock/demo data in the apps is example content only — do not use it for outreach.

| Lead type | Target app | Why |
|-----------|------------|-----|
| Nightlife / restaurant / hotel venues | **CurbCue** | Guest departure / pickup pressure |
| Photographers | **ShutterBid** | Jobs, bids, bookings |
| Fishing & leisure charters | **FishCrew** | Crew + charter coordination |

## What’s in this folder

| Path | Purpose |
|------|---------|
| `COMPLIANCE.md` | How we collect and email legally |
| `EMAIL_SEQUENCES.md` | 3-touch sequences per vertical |
| `leads/*.csv` | Seeded **Tampa Bay** leads (public business contacts) |
| `leads/_schema.md` | CSV column definitions |
| `../../scripts/outreach/` | Validate CSVs + export mail-merge drafts |

## Workflow

1. Research public contact pages / directories (see COMPLIANCE).
2. Append rows to the matching CSV (`status=researched`).
3. Run `node scripts/outreach/validate-leads.mjs`.
4. Export drafts: `node scripts/outreach/export-mail-merge.mjs --vertical=charters`.
5. Send from a real MackSims mailbox (personalize first line).
6. Update `status` + `last_contacted` + `notes` after each touch.

## Seed coverage (this PR)

**Tampa / Tampa Bay** — Ybor + Channelside venues, Tampa photographers, Tampa Bay fishing charters with published business emails. Expand to St. Pete Beach / Clearwater / Orlando corridors next using the same schema.
