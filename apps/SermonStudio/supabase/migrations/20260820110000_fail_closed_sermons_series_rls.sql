-- SermonStudio: fail closed on unscoped user content (project-facing schema).
--
-- Concrete exploit on master schema.sql:
--   sermons / series have NO row level security and NO owner column.
--   NEXT_PUBLIC_SUPABASE_ANON_KEY is served from GET /api/config and embedded
--   in the client. With default public grants, anyone holding the anon key can
--   SELECT / INSERT / UPDATE / DELETE every row (pastor notes, outlines, etc.)
--   without signing in. Signed-in sync (lib/supabaseSync.ts pullSermons /
--   pushSermon) is likewise unscoped and will hydrate or overwrite the shared
--   pool.
--
-- Minimal fix (no owner-column redesign):
--   Enable RLS and deliberately add ZERO policies for sermons/series so
--   anon + authenticated are denied. Supabase service_role bypasses RLS, so
--   /api/ics (service role) keeps working; sermonId IDOR there is tracked
--   separately (PR #36).
--
-- Shared reference catalogs (songs / verses / verse_texts) stay readable but
-- lose anonymous write so a catalog wipe cannot piggy-back on the same hole.
-- Owner-scoped write policies for sermons/series are a follow-up redesign.

alter table public.sermons enable row level security;
alter table public.series enable row level security;

-- Explicitly drop any accidental open policies if an operator added them.
drop policy if exists "sermons_all" on public.sermons;
drop policy if exists "sermons_select" on public.sermons;
drop policy if exists "sermons_insert" on public.sermons;
drop policy if exists "sermons_update" on public.sermons;
drop policy if exists "sermons_delete" on public.sermons;
drop policy if exists "series_all" on public.series;
drop policy if exists "series_select" on public.series;
drop policy if exists "series_insert" on public.series;
drop policy if exists "series_update" on public.series;
drop policy if exists "series_delete" on public.series;

-- No CREATE POLICY on sermons/series → deny all for anon/authenticated.

alter table public.songs enable row level security;
alter table public.verses enable row level security;
alter table public.verse_texts enable row level security;

drop policy if exists "songs_read" on public.songs;
create policy "songs_read"
  on public.songs for select
  to anon, authenticated
  using (true);

drop policy if exists "verses_read" on public.verses;
create policy "verses_read"
  on public.verses for select
  to anon, authenticated
  using (true);

drop policy if exists "verse_texts_read" on public.verse_texts;
create policy "verse_texts_read"
  on public.verse_texts for select
  to anon, authenticated
  using (true);

comment on table public.sermons is
  'SermonStudio user content. RLS enabled with no client policies (fail closed) until owner-scoped authz lands.';
comment on table public.series is
  'SermonStudio series. RLS enabled with no client policies (fail closed) until owner-scoped authz lands.';
