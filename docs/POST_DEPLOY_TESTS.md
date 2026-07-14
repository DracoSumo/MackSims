# Post-deploy smoke checklist — MackSims portfolio

Use after any Netlify manual deploy. Last updated: 2026-07-05 (Picky Human Audit pass).

## FairShare (https://fairshare-v03-20260624.netlify.app)

- [ ] Home loads; beta banner visible
- [ ] Mobile 390px: bottom nav (Home, Compare, Crowd, Account)
- [ ] Compare: pre-filled trip, provider cards render
- [ ] CrowdMeter tab loads
- [ ] Settings → OAuth section (optional sign-in)
- [ ] Console: no red errors
- [ ] `/admin` loads demo operator shell (known public demo)

## MotoCrew (https://motocrewz.netlify.app)

- [ ] Home + 6-tab bottom nav
- [ ] Safety disclaimer visible
- [ ] Ride cards + "View details" buttons
- [ ] Mobile 390px layout OK
- [ ] Console clean

## CoachCore (https://coachcore7.netlify.app)

- [ ] `/app` demo dashboard
- [ ] Dismiss demo walkthrough banner
- [ ] Mobile bottom nav (Home, Team, Train, Fuel, Proof)
- [ ] Athlete detail links work
- [ ] `/app/admin` — mock org stats (known public demo)

## Sermon Studio (https://sermon-studio-beta.netlify.app)

- [ ] Editor loads; tabs (Scripture, Ideas, Worship, Series, Library)
- [ ] Save Draft / Copy / Print buttons present
- [ ] Mobile: button grid not overflowing (verify after CSS redeploy)

## MackSims public site (https://macksims.com)

- [ ] Home loads
- [ ] `/fairshare/`, `/motocrew/`, `/coachcore/` — no mojibake em-dashes
- [ ] `/shutterbid/` — **currently FAILING (SITE NOT FOUND)** — re-test after DNS fix
- [ ] `/privacy/`, `/terms/`, `/support/`

## ShutterBid web

- No production web URL — use local `npm run dev` or store TestFlight/Play internal

## MomentPick

- No deploy URL — local only until staging exists

---

**Commands before deploy (per app):**

| App | Pre-deploy command |
|-----|-------------------|
| FairShare | `npm run check` |
| MotoCrew | `npm run check` |
| CoachCore | `npm run check` |
| Sermon Studio | `npm run check` (when patched source restored) |
| ShutterBid | `npm run build` (+ owner check scripts as needed) |
| MomentPick | `npm run build && npm run lint` |
