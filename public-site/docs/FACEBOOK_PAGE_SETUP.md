# MackSims Facebook Page — Setup Checklist

**Target URL:** https://www.facebook.com/macksims  
**Create flow:** https://www.facebook.com/pages/create  
**Assets:** `/public/images/social/macksims-facebook-profile.png`, `macksims-facebook-cover.png`

---

## 1. Create the page (requires Facebook login)

1. Open https://www.facebook.com/pages/create while logged into the MackSims owner account.
2. **Page name:** `MackSims`
3. **Category:** `Software company`
4. Click **Continue** and finish the wizard.
5. **Claim username:** Page settings → Page setup → Create Page @username → `macksims`

---

## 2. Profile & cover images

| Asset | File | Facebook size |
|-------|------|---------------|
| Profile photo | `public/images/social/macksims-facebook-profile.png` | 170×170 min (displays as circle) |
| Cover photo | `public/images/social/macksims-facebook-cover.png` | 820×312 recommended |

Upload both from Page → **Edit profile** → **Profile picture** / **Cover photo**.

---

## 3. Page details (copy-paste)

### Short description / bio

```
MackSims builds focused apps for anglers, photographers, riders, drivers, coaches, churches, and local operators. Veteran-led product studio. Join beta: macksims.com/beta
```

### About → Description

```
MackSims is a founder-built product studio. We ship useful software with clear expectations, honest beta labels, and direct support — no fake metrics or inflated launch theater.

Each MackSims product targets a specific community or job on the ground: fishing crews, photo jobs, fare decisions, ride coordination, sermon planning, and team accountability.

Products include FishCrew, ShutterBid, FairShare (CurbCue), MotoCrew, CoachCore, and Sermon Studio. External beta testing hub: macksims.com/beta
```

### Contact & links

| Field | Value |
|-------|-------|
| Website | https://macksims.com |
| Email | support@macksims.com |
| Action button | **Learn more** → https://macksims.com |
| Privacy policy | https://macksims.com/privacy |
| Terms | https://macksims.com/terms |

### Additional categories (optional)

- Technology company
- Internet company

---

## 4. Recommended first posts

### Pin this welcome post

```
Welcome to MackSims — real-world software for communities, teams, creators, and local operators.

We build focused apps (not platform fluff) for anglers, photographers, riders, drivers, coaches, churches, and local operators.

🧪 External beta: macksims.com/beta
📦 Products: macksims.com/products
💬 Support: support@macksims.com

Research and utility tools only — not financial, legal, or medical advice.
```

### Beta call (use with QR image)

Attach `public/images/qr/macksims-beta.png` (or the print PNG). Full copy pack: `docs/BETA_TESTER_POST.md`.

```
MackSims is looking for external beta testers.

We’re building focused apps for real-world communities — fishing crews, photo jobs, fare decisions, group rides, coaching, churches, and research watchlists.

Join once → web demos now, plus TestFlight / Play invites:
https://macksims.com/beta

Or scan the QR in this post.

Feedback: feedback@macksims.com
Beta software is unfinished — not for emergency, legal, medical, or safety-critical use.
```

### Follow-up posts (schedule 1 per week)

1. **FishCrew** — fishing community & water tools → macksims.com/fishcrew  
2. **ShutterBid** — photography job workflow → macksims.com/shutterbid  
3. **MotoCrew** — group ride coordination → macksims.com/motocrew  
4. **Site QR share** — post `macksims-site.png` with link https://macksims.com  
5. **Beta call** — invite testers to macksims.com/beta with honest disclaimer link

---

## 5. Page settings checklist

- [ ] Page visibility: **Published**
- [ ] Username: **@macksims**
- [ ] Messaging: enabled (routes to Page inbox)
- [ ] Notifications: assign Chris as admin
- [ ] Meta Business Suite: link page for scheduling & insights
- [ ] Page roles: only MackSims LLC team members as admins
- [ ] Two-factor authentication on owner Facebook account

---

## 6. Website integration (done in repo)

- Footer on all public pages links to `https://www.facebook.com/macksims`
- Home page Open Graph tags point at cover image for link previews
- Redeploy public-site to Netlify after merge

---

## 7. Post-setup verification

- [ ] https://www.facebook.com/macksims loads while logged out
- [ ] Website link opens macksims.com
- [ ] Profile + cover display correctly on mobile
- [ ] Action button works
- [ ] Footer Facebook link on macksims.com works
