# MackSims Advertising Campaign Brief

**Campaign name:** Real-World Software  
**Brand:** MackSims  
**Primary CTA:** Join the beta → https://www.macksims.com/  
**Support:** feedback@macksims.com  
**Launch posture:** External beta — honest labeling, no “fully live” claims

---

## Objective

Drive qualified beta signups and B2B partner interest for the MackSims suite, leading with **FishCrew** and **ShutterBid** (strongest live betas), then **CurbCue**, **MotoCrew**, **CoachCore**, and **Sermon Studio**.

Primary KPI: **cost per verified beta signup**  
Secondary: partner reply rate (venues / photographers / charters), demo video completion rate, site → product click-through.

---

## Audience map

| Segment | Product | Pain | Offer |
|---------|---------|------|-------|
| Charter captains & fishing crews | FishCrew | Scattered bookings, no crew rhythm | List your charter / coordinate the crew |
| Photographers & event clients | ShutterBid | Jobs lost in DMs, unclear bids | Bid, book, and profile in one place |
| Nightlife venues & hotels | CurbCue | Exit chaos, unsafe curb waits | Partner for smarter guest departures |
| Motorcycle group hosts | MotoCrew | Group rides run on texts + guesswork | Plan the ride. Ride with the pack. |
| Coaches / gym owners | CoachCore | No visibility on who is locked in | Accountability without the spreadsheet |
| Pastors / ministry staff | Sermon Studio | Prep scattered across docs & notes | Draft → series → worship → export |

Geography priority for Wave 1 ads + outreach: **Bermuda** (pilot density) → East Coast US tourism corridors → broader English-speaking markets.

---

## Creative system

### Brand frame (every ad)
- End card: **MackSims** wordmark + product name
- One line: *Software for real-world communities*
- CTA: **Join the beta**
- Fine print when needed: *External beta — features may use demo or estimate data*

### Demo video inputs
Produce from `docs/marketing/DEMO_VIDEO_SCRIPTS.md`:
1. Brand reel (30–45s) — suite overview
2. FishCrew cutdown (15–30s)
3. ShutterBid cutdown (15–30s)
4. CurbCue cutdown (15–30s)
5. MotoCrew cutdown (15–30s)
6. CoachCore cutdown (15–30s)
7. Sermon Studio cutdown (15–30s)

Record on device against live Netlify betas; burn in product URL at the end.

### Still assets (needed)
- App icon lockups on dark teal / charcoal backgrounds
- 1 UI screenshot per product (home / core loop only — no admin stubs)
- Partner postcard for venues / charters / photographers (PDF from outreach pack)

---

## Channel mix

| Channel | Role | Budget bias |
|---------|------|-------------|
| **Meta** (IG/FB Reels + Feed) | Demo video distribution | Highest — FishCrew + ShutterBid |
| **Google Search / YouTube** | Intent capture (“Bermuda fishing charter app”, “photographer booking”) | Medium |
| **TikTok / Shorts** | Organic + boosted cutdowns | Low–medium test |
| **LinkedIn** | CoachCore + venue GM / hotel ops | Low, high-touch |
| **Email** | Partner outreach sequences | Ops cost, not ad spend |
| **macksims.com** | Landing + beta signup | Always-on |

Detailed copy: `docs/marketing/AD_COPY.md`  
Channel checklist: `docs/marketing/CHANNEL_PLAN.md`

---

## Messaging rules

**Do**
- Lead with the job (“book the charter”, “compare before you ride”)
- Show the product UI in motion
- Invite partners as operators, not just consumers

**Don’t**
- Claim live GPS / live fares / live bidding if that surface is still mocked
- Use medical claims for CoachCore
- Imply CrossFit affiliation
- Promise store availability dates

---

## Measurement

Weekly dashboard (manual is fine at start):

1. Spend by product
2. Impressions / CTR / thruplay
3. Landing sessions → beta signup
4. Partner emails sent / replies / booked demos
5. Feedback themes → product backlog

UTM pattern:

```
utm_source=meta|google|tiktok|email
utm_medium=paid|organic|outreach
utm_campaign=macksims_realworld_2026
utm_content=<product>_<asset>
```

Example:  
`https://www.macksims.com/?utm_source=meta&utm_medium=paid&utm_campaign=macksims_realworld_2026&utm_content=fishcrew_reel15`
