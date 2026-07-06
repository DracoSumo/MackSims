# CurbCue — Testing Notes (External Beta, v0.3.0)

> **Note:** This file keeps the legacy filename `FAIRSHARE_TESTING_NOTES.md` for existing beta links. Content reflects the **CurbCue** product name.

All data is simulated. Nothing in this build talks to a real API.

## How to run

```powershell
npm run dev        # http://127.0.0.1:3000
```

Best viewed at mobile widths (open devtools and pick a phone preset), but desktop works.

## Key flows to exercise

### 1. Beta landing gate
- First visit shows the External Beta disclaimer screen.
- Clicking "I understand" stores an acknowledgement in localStorage and never shows again on that
  device. To reset: devtools > Application > Local Storage > remove `fairshare.betaAcknowledged.v1`.

### 2. Demo-data banner
- After the gate, an orange "Demo data" strip sits under the top bar on every page, with a
  "Send feedback" mailto link.

### 3. Compare flow (Home > search > Compare)
- Submitting the trip form navigates to `/compare` and shows a loading spinner (~0.5 s simulated
  latency), then the Ride Compare pick, recommendations, fare panel, and provider list —
  including Walking and Designated Driver (example) options.
- Sorting (Best Value / Cheapest / Fastest / Most Reliable) reorders the list.
- **Error state:** type `error test` into the Pickup field and submit. The compare screen shows a
  simulated provider-outage error with a working "Try again" button.
- **Empty state:** if no estimates load, copy reads "No ride signals yet."

### 4. Saved places / recent searches (localStorage)
- On `/compare`, "Save this drop-off" adds the drop-off to Saved places.
- Every search is added to Recent searches (max 6, deduped).
- Both lists appear on Home under "Saved places and recent searches"; tapping an entry re-runs the
  comparison; Remove / Clear all work; both survive a page reload.

### 5. Nightlife & events (Home)
- "Tonight nearby (demo)" panel loads simulated venues (with crowd chips and closing times) and
  events through the same adapter, with its own loading/error/empty states.

### 6. CrowdMeter / surge awareness
- `/crowd-meter` shows crowd cards with surge risk, pressure scores, and mock signal inputs.
  Everything is labeled as mock/simulated windows.

### 7. Pickup guidance
- Compare and Home show "better pickup zone" suggestion cards (e.g. side-street instead of bar
  frontage at close).

### 8. Feedback prompt
- Feedback panels on Home and Compare open a pre-filled mailto to feedback@macksims.com.

### 9. Route aliases
- `/curbcue`, `/fairshare`, and `/farewave` all render the home view (legacy aliases preserved).

## Known limitations (by design in this beta)

- No bookings, payments, or push notifications.
- Provider names are generic/example; fares never reflect reality.
- Other routes (`/admin`, `/driver`, `/government`, `/canyon`) are operator-facing shells with
  placeholder content — browse them, but the consumer flows above are the test focus.
- Saved comparisons inside the Best Pick card are session-only (intentionally mocked); saved
  places / recent searches are the persisted features.
