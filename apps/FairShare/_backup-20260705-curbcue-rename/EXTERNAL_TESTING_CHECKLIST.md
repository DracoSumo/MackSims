# CurbCue — External Testing Checklist

Version 0.3.0 · All data simulated · Feedback: feedback@macksims.com

Mark each item Pass / Fail / Notes. See FAIRSHARE_TESTING_NOTES.md for how to trigger each state.

## First run
- [ ] Beta disclaimer screen appears on first visit and clearly says data is simulated
- [ ] "I understand" dismisses it; it does not reappear after reload
- [ ] Orange "Demo data" banner is visible on every page afterward
- [ ] App name reads **CurbCue** in shell, beta gate, and browser title

## Compare flow
- [ ] Home trip form navigates to Compare (CTA: "Check ride options")
- [ ] Loading spinner appears briefly before results
- [ ] Ride Compare pick, recommendation cards, and fare panel render
- [ ] Provider list includes taxi, rideshare-style, shuttle, private driver, local transport, walking, and designated driver options
- [ ] All four sort modes reorder the list sensibly
- [ ] Typing `error test` as Pickup shows the error state; "Try again" recovers
- [ ] Empty compare state reads "No ride signals yet."
- [ ] Fares/ETAs are clearly presented as demo estimates (no "live" implication anywhere)

## Saved places & recent searches
- [ ] "Save this drop-off" on Compare adds to Saved places on Home
- [ ] Searches appear under Recent searches; tapping one re-runs it
- [ ] Remove and Clear all work
- [ ] Both lists survive a full page reload

## Nightlife & crowd
- [ ] "Tonight nearby (demo)" shows venue cards with crowd chips and closing times
- [ ] Demo events list shows expected crowd and surge risk
- [ ] CrowdMeter page cards show pressure scores, surge risk, and mock signal labels
- [ ] Pickup suggestion cards propose a better zone where relevant
- [ ] Home hero shows feature labels: Ride Compare, Crowd Cue, Surge Watch, Pickup Smarts, Timing Signal, Route Options

## Routes
- [ ] `/curbcue` loads home
- [ ] `/fairshare` and `/farewave` load home (legacy aliases)

## Feedback
- [ ] Feedback buttons open an email draft to feedback@macksims.com with subject `CurbCue Beta Feedback`

## Mobile / general
- [ ] Layout is usable at ~375 px width (no horizontal scroll, tappable buttons)
- [ ] No console errors during normal navigation
- [ ] Browser back/forward navigate between pages correctly

**Tester:** ____________  **Device/browser:** ____________  **Date:** ____________
