-- 2026-10-07 (applied to project kkyuychvitrmtehvzqfd as profiles_hide_email_again_20261007)
--
-- anon and authenticated had table-level SELECT on public.profiles again, so the
-- publishable key could read every stored email (20260828130000 had fixed this,
-- but a later grant undid it). The app never selects or writes profiles.email,
-- so explicit column grants keep every screen working. Revoking the table
-- privilege also clears any column privileges first.
revoke select on table public.profiles from public;
revoke select on table public.profiles from anon, authenticated;

grant select (
  id,
  username,
  full_name,
  role,
  status,
  home_area,
  avatar_url,
  avatar_moderation_status,
  created_at,
  updated_at,
  bio,
  bio_long,
  fishing_styles,
  profile_theme,
  auth_provider,
  first_name,
  last_name,
  website_url,
  brand_url,
  youtube_url,
  instagram_url,
  boat,
  species,
  trip_types,
  experience
) on public.profiles to anon, authenticated;

comment on column public.profiles.email is
  'Not readable by anon/authenticated (column grant omitted on purpose). Admin tools read emails from auth.users through an is_admin()-checked function.';
