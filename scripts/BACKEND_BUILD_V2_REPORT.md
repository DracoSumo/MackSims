# Backend Build V2 Report
Generated: 2026-07-05

## Executive summary

V2 sync layer built on existing blueprints for all four apps. Each app now has **auth-gated bidirectional merge** (localStorage wins until sign-in, then merge + push), **user-visible sync errors**, and **dashboard/status surfaces**. All four pass `npm run check` locally.

Production still requires operator steps from `BACKEND_SWEEP_REPORT.md`: per-site Supabase env with valid JWT, schema SQL + RLS policies, OAuth provider enable, and `deploy-all-with-keys.ps1` redeploy.

---

## CoachCore (`coachcore-static-v001`)

**Supabase ref:** `bfqfbkldxbojrrxeidcc`

### Features built
- `coach_profiles` upsert on sign-in (display name from OAuth metadata)
- Auth-gated push/upsert for `athlete_check_ins`, `coach_action_log`
- Pull + merge on sign-in (local wins on id conflicts; pushes local-only rows)
- `beta_requests` push (anon-friendly insert, unchanged from V1)
- Status dashboard: local vs remote row counts, last merged time, sync errors
- OAuth callback triggers merge after session exchange

### Files touched
| File | Change |
|------|--------|
| `src/services/supabaseSync.ts` | V2 merge, pull, upsert coach profile, sync meta, dashboard |
| `src/services/checkInStore.ts` | `mergeCheckIns()` |
| `src/services/actionLogStore.ts` | `mergeActionLog()` |
| `src/components/SupabaseStatusPanel.tsx` | Sync state panel |
| `src/components/auth/ProfileAuthPanel.tsx` | Merge on `SIGNED_IN`, counts + last sync |
| `src/app/auth/callback/page.tsx` | Merge after OAuth |

### Build
**PASS** — `npm run check` (vitest + next build)

### Sync flows (when signed in + configured + RLS)
1. Sign in (Google/GitHub) → coach profile upserted → remote check-ins/actions pulled → merged with local → local-only rows pushed
2. Athlete check-in / mock action → saved local immediately → upsert to Supabase if signed in
3. Beta intake → local + optional Supabase insert (no auth required)
4. Status page shows connection + sync counts

### Operator steps
1. Run `supabase/schema.sql` in project `bfqfbkldxbojrrxeidcc`
2. Enable RLS insert/select policies for authenticated users on sync tables; anon insert on `beta_requests`
3. Enable Google + GitHub OAuth; redirect `https://coachcore7.netlify.app/auth/callback/`
4. Redeploy with baked keys via `scripts/deploy-all-with-keys.ps1`

---

## FairShare (`apps/FairShare`)

**Supabase ref:** `dsbwqxhqktzsdleeobbi`

### Features built
- `user_profiles` upsert on sign-in merge
- Bidirectional `saved_comparisons` sync (pull on sign-in, push local-only)
- `crowd_polls` push (signed-in or anon `user_id: null` when configured)
- Compare screen: **Save locally** + optional **Save to cloud** when signed in
- CrowdMeter page: poll submit with visible Supabase sync result
- Settings: live sync dashboard row (local/cloud counts, last sync, errors)

### Files touched
| File | Change |
|------|--------|
| `src/lib/supabaseSync.ts` | Pull, merge, upsert, dashboard, anon crowd polls |
| `src/lib/storage.ts` | Merge helpers; decoupled auto-push from save (cloud is explicit on Compare) |
| `src/components/OAuthSignIn.tsx` | Merge on sign-in + callback |
| `src/App.tsx` | Compare cloud save, CrowdMeter sync messages, Settings sync info |

### Build
**PASS** — `npm run check` (vitest + tsc + vite build)

### Sync flows (when signed in + configured + RLS)
1. Sign in → profile upserted → remote comparisons pulled → merged → local-only comparisons pushed
2. Compare → Save locally (always) → Save to cloud (signed in only)
3. CrowdMeter poll → local save → Supabase insert (anon or authed) with user-visible result
4. Settings profile edit → local + profile upsert when signed in

### Operator steps
1. Run `supabase/schema.sql` in project `dsbwqxhqktzsdleeobbi`
2. RLS: authenticated CRUD on `user_profiles`, `saved_comparisons`; anon + authed insert on `crowd_polls`
3. OAuth redirect `https://fairshare-v03-20260624.netlify.app/auth/callback`
4. Redeploy with baked keys

---

## MotoCrew (`apps/MotoCrew`)

**Supabase ref:** `npmiwnxnqgonnmwvblyi`

### Features built
- `rider_profiles` upsert on sign-in and profile save
- `ride_drafts` push on create + pull/merge on sign-in
- `joined_rides` push on join + pull/merge on sign-in
- Profile screen: sync feedback on save, last sync + error display
- Export local data unchanged (offline JSON download)

### Files touched
| File | Change |
|------|--------|
| `src/services/supabaseSync.ts` | Drafts, joined rides, merge, dashboard |
| `src/components/OAuthSignIn.tsx` | Merge on sign-in + callback |
| `src/App.tsx` | Draft/join sync, profile save feedback, post-callback state reload |

### Build
**PASS** — `npm run check` (eslint + vitest + tsc + vite build)

### Sync flows (when signed in + configured + RLS)
1. Sign in → rider profile upserted → remote drafts/joins pulled → merged → local-only drafts pushed
2. Create ride draft → local + cloud push when signed in
3. Join ride → local + `joined_rides` upsert when signed in
4. Edit profile → local + `rider_profiles` upsert when signed in
5. Export local data → still works without network

### Operator steps
1. Run `supabase/schema.sql` in project `npmiwnxnqgonnmwvblyi`
2. RLS: authenticated policies on `rider_profiles`, `ride_drafts`, `joined_rides`
3. OAuth redirect `https://motocrewz.netlify.app/auth/callback`
4. Redeploy with baked keys

---

## Sermon Studio (`sermon-studio-next-patched`)

**Supabase ref:** `zipxwqkmenapnckwyzrh`

### Features built
- New `lib/supabaseSync.ts` — typed sermon/series helpers, auth-gated push/pull, merge
- Auth required for cloud writes; localStorage always persists as fallback
- Songs/verses remain read-only Supabase seed when configured (no auth)
- Library badges: **Synced** vs **Local only** per sermon
- Sign-in merges local library with remote; pushes unsynced local sermons
- Full offline: no Supabase or unsigned-in → 100% localStorage

### Files touched
| File | Change |
|------|--------|
| `lib/supabaseSync.ts` | **New** — sync layer |
| `app/page.tsx` | Auth-gated save, merge on sign-in, badges, always-local persistence |

### Build
**PASS** — `npm run check` (vitest + next build)

### Sync flows (when signed in + configured + RLS)
1. Sign in → remote sermons/series pulled → merged with local (local wins) → unsynced local sermons pushed
2. Save Draft → Supabase when signed in (badge: Synced); localStorage when not
3. Create series → Supabase when signed in; local otherwise
4. Import/export JSON backup → local only (unchanged)
5. Songs/verses load from Supabase when tables seeded (read-only)

### Operator steps
1. Run `supabase/schema.sql` in project `zipxwqkmenapnckwyzrh`
2. RLS: authenticated insert/select/update on `sermons`, `series`; public read on `songs`, `verses` if seeded
3. OAuth redirect `https://sermon-studio-beta.netlify.app/auth/callback`
4. Redeploy with baked keys (Sermon uses local build + `netlify deploy --prod` in deploy script)

---

## Cross-app engineering notes

| Rule | Status |
|------|--------|
| Reuse `supabaseClient`, `auth.ts`, `isSupabaseConfigured` | ✓ |
| Typed helpers matching `schema.sql` column names | ✓ |
| try/catch + user-visible sync errors | ✓ |
| `npm run check` per app | ✓ All PASS |
| No new Supabase projects | ✓ |
| No secrets in code/report | ✓ |
| Minimize diff / match conventions | ✓ |

## Recommended next operator action

```powershell
# From MackSims repo root, approved session with .netlify-supabase-keys.json present:
.\scripts\align-all-supabase-env.ps1
.\scripts\verify-netlify-supabase.ps1   # until validJwt=True, projectMatch=True
.\scripts\deploy-all-with-keys.ps1
```

Then smoke each app: sign in → create local data → verify merge counts on status/settings/profile → confirm no silent console errors.
