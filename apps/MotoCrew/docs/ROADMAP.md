# MotoCrew Product Roadmap

MotoCrew's long-term target is to become the riding app that delivers what group riders expect other apps to do, but rarely do well: ride planning, GPS, navigation, pack awareness, in-app comms, safety alerts, device compatibility, and a serious motorcycle-first experience.

The path is staged on purpose. MotoCrew should feel ambitious without becoming a pile of risky half-integrations.

## North Star

MotoCrew should help riders plan, join, navigate, communicate, and complete group rides with confidence.

Core promise:

- Plan the ride.
- Ride with the pack.
- Know where the group is.
- Communicate without fumbling.
- Surface useful road awareness.
- Support the devices riders already use.

## Product Principles

- Motorcycle-first, not generic car navigation.
- Mobile-first and wrapper-ready for iOS and Android.
- Safety-first wording and interaction design.
- Mock before live integration.
- Build the product bones before visual polish.
- Keep live features behind clear permission, privacy, and platform boundaries.
- Paid features should feel like serious rider utilities, not gimmicks.

## Phase 0.1: App Shell

Status: built.

Foundation:

- Ride feed.
- Ride detail.
- Mock route preview.
- Mock pack chat.
- Comms placeholders.
- Rider profile and garage.
- Mock create ride.
- Typed local data.
- PWA metadata and SPA fallback.

No real GPS, maps, messaging, calling, Bluetooth, payments, or auth yet.

## Phase 0.2: Ride Planning Bones

Goal: make MotoCrew useful before live road features.

Features:

- Better create-ride state.
- Ride draft list.
- Ride filters by pace, distance, status, and difficulty.
- Pack roster mock states.
- Pre-ride safety checklist per ride.
- Route preview improvements with richer mocked stops.
- App settings screen for future permissions.

Technical:

- Add lightweight local persistence.
- Keep data service-shaped so a backend can replace it later.
- Avoid router dependency unless navigation complexity requires it.

## Phase 0.3: Real Map Foundation

Goal: introduce real map rendering without live tracking.

Features:

- Real map provider evaluation.
- Static route display.
- Meet spot pin.
- Stop pins.
- Route distance and estimated duration.
- Offline/error states.

Candidates to evaluate:

- Mapbox.
- Google Maps Platform.
- Apple MapKit JS for web considerations.
- OpenStreetMap-based stack.

Notes:

- Keep provider isolated behind a map adapter.
- Do not tie app logic directly to one map SDK.
- Review pricing before committing to a provider.

## Phase 0.4: GPS and Navigation

Goal: add permission-based rider location and navigation basics.

Features:

- User GPS permission flow.
- Current rider position.
- Ride start proximity helper.
- Turn-by-turn feasibility research.
- Battery and background mode constraints.
- Location privacy controls.

Platform notes:

- Web GPS is limited.
- Background location requires native wrappers and app-store policy work.
- Capacitor or React Native wrapper decisions should happen before serious background GPS.

## Phase 0.5: Pack Awareness

Goal: let riders understand group position without creating unsafe distraction.

Features:

- Shared ride session concept.
- Lead and sweep roles.
- Pack member presence.
- Delayed or privacy-protected location sharing.
- Regroup prompts.
- Lost rider state.

Safety notes:

- Avoid UI that encourages riders to stare at the screen.
- Prioritize audio cues, glanceable state, and ride-leader controls.

## Phase 0.6: In-App Comms

Goal: design the comms model before live audio.

Features:

- Voice room UI.
- Push-to-talk UX.
- Host broadcast mode.
- Emergency broadcast concept.
- Muted/listening states.
- Comms permission screens.

Technical candidates:

- WebRTC for live audio.
- Native audio session handling for mobile wrappers.
- Push notification backup for critical ride updates.

Constraints:

- Live voice is platform-sensitive.
- Helmet/headset routing needs native research.
- Emergency flows need careful language and reliability standards.

## Phase 0.7: Device and Vehicle Integrations

Goal: support the rider's ecosystem without pretending every device is easy.

Targets:

- Bluetooth headset compatibility research.
- Helmet comms research.
- Apple CarPlay feasibility.
- Android Auto feasibility.
- Motorcycle dash/display possibilities where available.
- Smartwatch glance support.

Important reality:

- Web apps cannot integrate with every Bluetooth device or vehicle system.
- CarPlay and Android Auto require native app work, entitlement review, and strict UX rules.
- Bluetooth behavior varies heavily across iOS, Android, device makers, and headset models.

Approach:

- Start with compatibility notes and settings.
- Build adapters per platform/device class.
- Add one integration at a time after proof of concept.

## Phase 0.8: Road Awareness and Rider Alerts

Goal: paid road-awareness utilities that help riders stay informed.

Potential paid features:

- Speed zone awareness.
- Speed camera and red-light camera alerts where legally allowed.
- Reported enforcement zones where legally allowed.
- Road hazard reports.
- Construction and closure warnings.
- Weather and wind alerts.
- Group-submitted route condition notes.

Safety and legal notes:

- Laws around speed camera, enforcement, and radar-trap alerts vary by location.
- MotoCrew should include regional feature controls.
- Do not encourage speeding or evasion.
- Frame this as road awareness and legal compliance support.
- Paid access should unlock utility, not unsafe behavior.

## Phase 0.9: Monetization

Potential tiers:

- Free: ride planning, basic ride feed, profile, garage.
- Plus: advanced route planning, saved routes, richer checklists, pack tools.
- Pro: road awareness, premium alerts, advanced comms, device integrations.
- Crew: group admin tools, ride history, private packs, shared planning.

Payment should wait until:

- Auth exists.
- Backend exists.
- Feature entitlements exist.
- Legal review exists for regional alert features.

## Phase 1.0: Real Product Release

Release only when these are real:

- Auth.
- Backend ride storage.
- Real maps.
- Permissioned location.
- Tested mobile wrapper.
- Privacy controls.
- Basic safety review.
- App-store-ready metadata.
- Clear feature boundaries by region.

## Near-Term Build Path

Next best move:

1. Build v0.2 ride planning bones.
2. Add local persistence.
3. Add settings and permission placeholders.
4. Add map-provider adapter interface without choosing a paid provider yet.
5. Improve mocked route and pack states.
6. Keep comms and GPS clearly marked as planned until platform research is complete.

This keeps MotoCrew moving toward the big vision while protecting the codebase from premature integrations.
