-- Allow riders to read their own profile so sign-in merge can pull before push.
-- Without SELECT, mergeOnSignIn could only blind-upsert local (often blank) rows
-- and permanently wipe display_name / emergency_contact / garage on a fresh device.

drop policy if exists "auth select profiles" on public.rider_profiles;
create policy "auth select profiles"
  on public.rider_profiles for select to authenticated
  using (user_id = (select auth.uid()));
