-- MotoCrew: restrict owner writes on user-owned tables (project npmiwnxnqgonnmwvblyi)
-- Idempotent: drop/recreate policies; revoke anon writes. Service role continues to bypass RLS.

-- rider_profiles: insert/update/delete only as self; authenticated can still read profiles
drop policy if exists "auth insert profiles" on public.rider_profiles;
create policy "auth insert profiles"
  on public.rider_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "auth update profiles" on public.rider_profiles;
create policy "auth update profiles"
  on public.rider_profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "auth delete profiles" on public.rider_profiles;
create policy "auth delete profiles"
  on public.rider_profiles for delete to authenticated
  using (user_id = (select auth.uid()));

-- ride_drafts: private to owner (including select)
drop policy if exists "auth insert drafts" on public.ride_drafts;
create policy "auth insert drafts"
  on public.ride_drafts for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "auth select drafts" on public.ride_drafts;
create policy "auth select drafts"
  on public.ride_drafts for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "auth update drafts" on public.ride_drafts;
create policy "auth update drafts"
  on public.ride_drafts for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "auth delete drafts" on public.ride_drafts;
create policy "auth delete drafts"
  on public.ride_drafts for delete to authenticated
  using (user_id = (select auth.uid()));

-- joined_rides: owner-only mutations and reads (client already scopes by user_id)
drop policy if exists "auth insert joined" on public.joined_rides;
create policy "auth insert joined"
  on public.joined_rides for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "auth select joined" on public.joined_rides;
create policy "auth select joined"
  on public.joined_rides for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "auth update joined" on public.joined_rides;
create policy "auth update joined"
  on public.joined_rides for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "auth delete joined" on public.joined_rides;
create policy "auth delete joined"
  on public.joined_rides for delete to authenticated
  using (user_id = (select auth.uid()));

-- Defense in depth: anon must not write user-owned rows even if table grants exist
revoke insert, update, delete on public.rider_profiles from anon;
revoke insert, update, delete on public.ride_drafts from anon;
revoke insert, update, delete on public.joined_rides from anon;
