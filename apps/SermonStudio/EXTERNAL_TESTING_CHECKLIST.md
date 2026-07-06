# External Testing Checklist — Pastor's Sermon Studio (beta)

Setup: `npm install`, then `npm run dev`, open http://localhost:3000.
No account or backend needed — everything saves in your browser.

Check off each item and note anything surprising in the feedback template.

## First impressions
- [ ] Beta banner is visible and explains local storage + "not live AI"
- [ ] Page loads without errors on desktop
- [ ] Page is usable at phone width (no horizontal scrolling, buttons reachable)

## Current Sermon
- [ ] Enter a title, pick a theme, set a date
- [ ] Add 2–3 Key Points (Enter key and Add button both work)
- [ ] Remove a Key Point with the × button
- [ ] Add an Illustration
- [ ] Fill in the Application box
- [ ] Type some Notes
- [ ] Reload the page — your draft is still there

## Scripture tab
- [ ] Search "John" — John 3:16 appears
- [ ] Search "trust" — themed results appear
- [ ] Search gibberish — friendly "no matches" message appears
- [ ] Switch translations — verse text changes
- [ ] "Add to Sermon" — passage badge appears in Current Sermon

## Ideas tab
- [ ] Suggestions are labeled as local templates (not live AI)
- [ ] Changing theme changes the suggestions
- [ ] Attached passages appear under "From Passages"

## Worship tab
- [ ] Filter songs by theme and tempo
- [ ] "Match Current Sermon Theme" applies your sermon's theme
- [ ] Add two songs; they appear in Current Setlist
- [ ] Remove a song from the setlist

## Series tab
- [ ] Create a new series with the inline input
- [ ] Toggle "part of series" and select your series

## Library tab
- [ ] "Save Draft" — a success message appears (no popup dialogs)
- [ ] Saved sermon appears in the Library with date/theme/passages
- [ ] "Edit" loads it back into the editor, including outline fields
- [ ] "Delete" removes it
- [ ] Reload the page — library persists

## Export
- [ ] "Copy Sermon Notes" — paste into a text editor; title, date, passages, key points, illustrations, application, notes, and setlist are all present and readable

## Wrap-up
- [ ] Send your completed TESTER_FEEDBACK_TEMPLATE.md to feedback@macksims.com
