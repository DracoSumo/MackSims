# External Testing Checklist — MotoCrew (Throttle / ThrottleLink beta)

Work top to bottom. Mark each item Pass / Fail / Notes. **Do not test while riding.**
Email results to feedback@macksims.com (see TESTER_FEEDBACK_TEMPLATE.md).

## Setup

- [ ] App loads without console errors (`npm run dev` or a hosted build).
- [ ] First load shows the red safety notice; "I understand" dismisses it.
- [ ] Reloading the page does NOT show the safety notice again.

## Home dashboard

- [ ] Hero card shows tonight's ride with status pill and "Open Ride" works.
- [ ] Quick actions navigate: Create Ride, Find Ride, My Pack, Safety.
- [ ] Ride status card shows Staging → Rolling → Regroup → Fuel Stop → Complete with
      "Not live" pill and a note that statuses are mocked.
- [ ] Upcoming / featured / completed ride sections render with counts.

## Rides

- [ ] Status and pace filters narrow the ride selector; an empty state appears when nothing matches.
- [ ] Selecting a ride updates the detail card (meet location, kickstands-up, miles, roster).
- [ ] Join Ride / Leave Ride toggles and survives a page reload.
- [ ] Join is disabled for the completed ride.
- [ ] "Preview Route" opens the Map screen.

## Map

- [ ] A "Map view not configured" placeholder renders — no blank panel, no key errors.
- [ ] Mocked route stops, distance, ride time, and road type display.
- [ ] Road awareness section is clearly labeled as paid concepts with nothing active.

## Chat / Comms

- [ ] Chat is marked "Not live"; the message input and Send button are disabled.
- [ ] Voice Room / Push-to-Talk / Call Ride Lead buttons are disabled and marked demo.

## Safety screen

- [ ] Emergency disclaimer is visible: no dispatch, call 911 in a real emergency.
- [ ] Adding an emergency contact (name + phone) works; missing fields show an error.
- [ ] Contacts persist across reload; Remove deletes them; list caps at 6.
- [ ] Feedback button opens an email draft to feedback@macksims.com.

## Create ride

- [ ] Submitting the form saves a draft and shows a "saved locally" message.
- [ ] Drafts appear on Home and on the Create screen and survive reload (max 8 kept).

## Footer / global

- [ ] Every screen shows the footer: do-not-use-while-riding copy, demo notice, feedback link.
- [ ] Nothing anywhere claims live tracking, live intercom, or emergency dispatch is active.

## Responsive / accessibility spot checks

- [ ] Phone-width viewport: bottom nav (6 tabs) is tappable and readable.
- [ ] Desktop ≥860px: side rail navigation appears and works.
- [ ] Keyboard: tab focus is visible on buttons and form fields.
- [ ] Text remains readable at 125% browser zoom.

## Reset

- [ ] Clearing site data resets joined rides, drafts, contacts, and the safety notice.
