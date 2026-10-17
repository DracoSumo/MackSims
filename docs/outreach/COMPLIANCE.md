# Outreach compliance notes

MackSims partner outreach uses **publicly published business contact emails** only.

## Allowed sources

- Business website Contact / Reservations pages
- Official tourism / chamber / marina directories that list a business email
- Email addresses the business prints on ads, cards, or Google Business Profile when visible without login

## Not allowed

- Scraping personal Gmail/Yahoo addresses from social profiles without a business listing
- Buying scraped email dumps
- Harvesting addresses from private Facebook groups
- Misleading subject lines or forged sender domains
- Continuing to email after an unsubscribe / “stop” reply

## Sending rules

1. Send from `@macksims.com` (e.g. `csims@macksims.com` or `partners@macksims.com`).
2. Identify MackSims clearly in the first paragraph.
3. State why you are writing (product + pilot invite).
4. Include a one-click way to decline (`Reply STOP` is fine for small volume).
5. Cap: **3 touches / 21 days**, then archive unless they engaged.
6. Keep a send log in the CSV (`last_contacted`, `status`, `notes`).
7. Prefer **Tampa / Tampa Bay** first — CurbCue is based in Tampa. Treat other markets (including Bermuda demo content in-app) as secondary unless you have a live product story there.

## Data handling

- Lead CSVs may contain business emails — do **not** commit private personal data, notes about individuals’ families, or purchased lists.
- If a lead asks for deletion, remove the row and note `deleted_on_request` in git history message only if needed; prefer updating status to `do_not_contact`.

## Verification flags

CSV `verification` column:

| Value | Meaning |
|-------|---------|
| `page_verified` | Email seen on the business’s own site in this research pass |
| `directory_listed` | Email from a third-party directory — re-check before send |
| `published_possible_typo` | On-site email looks mistyped — verify before send |
| `unverified` | Needs human confirmation |

This is not legal advice; adjust for local anti-spam rules before large sends.
