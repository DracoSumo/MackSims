-- 2026-10-09 FishCrew QA hardening (security + performance)
--
-- 1. trip_private_details: replace five overlapping policies with one per action.
--    Fixes a hole: the old FOR ALL policy only checked host_id = auth.uid(), so a
--    signed-in user could create the private meetup details for a trip they do
--    not host (when that trip had no details row yet), or move their own row onto
--    someone else's trip with an UPDATE. Writes now require hosting the trip.
-- 2. RLS speed-up: wrap auth.uid() and public.is_admin() in scalar subqueries so
--    Postgres evaluates them once per query instead of once per row
--    (Supabase advisor 0003 auth_rls_initplan). Same logic, same results.
-- 3. Covering indexes for four foreign keys (Supabase advisor 0001).
--
-- Safe to re-run. Paste the whole file into the Supabase SQL editor; it runs as
-- one transaction.

begin;

-- 1. trip_private_details --------------------------------------------------------
drop policy if exists private_details_insert_host on public.trip_private_details;
drop policy if exists private_details_select_approved_host_admin on public.trip_private_details;
drop policy if exists private_details_update_host_admin on public.trip_private_details;
drop policy if exists trip_private_details_host_write on public.trip_private_details;
drop policy if exists trip_private_details_read on public.trip_private_details;
drop policy if exists trip_private_details_select on public.trip_private_details;
drop policy if exists trip_private_details_insert on public.trip_private_details;
drop policy if exists trip_private_details_update on public.trip_private_details;
drop policy if exists trip_private_details_delete on public.trip_private_details;

create policy trip_private_details_select on public.trip_private_details
  for select to authenticated
  using (
    (select public.is_admin())
    or host_id = (select auth.uid())::text
    or exists (
      select 1 from public.trip_members m
      where m.trip_id = trip_private_details.trip_id
        and m.user_id = (select auth.uid())::text
        and m.status = 'Approved'
    )
  );

create policy trip_private_details_insert on public.trip_private_details
  for insert to authenticated
  with check (
    (select public.is_admin())
    or (
      host_id = (select auth.uid())::text
      and exists (
        select 1 from public.trip_posts t
        where t.id = trip_private_details.trip_id
          and t.host_id = (select auth.uid())::text
      )
    )
  );

create policy trip_private_details_update on public.trip_private_details
  for update to authenticated
  using ((select public.is_admin()) or host_id = (select auth.uid())::text)
  with check (
    (select public.is_admin())
    or (
      host_id = (select auth.uid())::text
      and exists (
        select 1 from public.trip_posts t
        where t.id = trip_private_details.trip_id
          and t.host_id = (select auth.uid())::text
      )
    )
  );

create policy trip_private_details_delete on public.trip_private_details
  for delete to authenticated
  using ((select public.is_admin()) or host_id = (select auth.uid())::text);

-- 2. Evaluate auth.uid() / is_admin() once per query ------------------------------
alter policy "account_deletion_requests_insert" on public."account_deletion_requests"
  with check (((user_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Requested'::text) = ANY (ARRAY['Requested'::text, 'Pending server deletion'::text, 'Local deletion complete'::text]))));

alter policy "account_deletion_requests_select" on public."account_deletion_requests"
  using (((user_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "account_deletion_requests_update" on public."account_deletion_requests"
  using (( SELECT public.is_admin() AS is_admin))
  with check (( SELECT public.is_admin() AS is_admin));

alter policy "admin_events_insert_admin" on public."admin_events"
  with check (( SELECT public.is_admin() AS is_admin));

alter policy "admin_events_select_admin" on public."admin_events"
  using (( SELECT public.is_admin() AS is_admin));

alter policy "bookings_insert" on public."bookings"
  with check (((customer_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'New'::text) = 'New'::text)));

alter policy "bookings_select" on public."bookings"
  using ((( SELECT public.is_admin() AS is_admin) OR (customer_id = (( SELECT auth.uid() AS uid))::text) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = bookings.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.charters c
  WHERE ((c.id = COALESCE(bookings.charter_id, bookings.business_id)) AND (c.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "bookings_update" on public."bookings"
  using ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = bookings.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.charters c
  WHERE ((c.id = COALESCE(bookings.charter_id, bookings.business_id)) AND (c.owner_id = (( SELECT auth.uid() AS uid))::text))))))
  with check ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = bookings.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.charters c
  WHERE ((c.id = COALESCE(bookings.charter_id, bookings.business_id)) AND (c.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "businesses_insert" on public."businesses"
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Pending review'::text) <> ALL (ARRAY['Verified'::text, 'Removed'::text]))));

alter policy "businesses_select" on public."businesses"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (COALESCE(status, 'Live'::text) = ANY (ARRAY['Live'::text, 'Verified'::text, 'Directory'::text, 'Approved'::text]))));

alter policy "businesses_update" on public."businesses"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "campaigns_insert_owner_or_admin" on public."campaigns"
  with check ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = campaigns.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "campaigns_select_owner" on public."campaigns"
  using ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = campaigns.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "campaigns_update_owner_or_admin" on public."campaigns"
  using ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = campaigns.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "captain_waitlist_insert_public" on public."captain_waitlist"
  with check (((COALESCE(status, 'waitlist'::text) = 'waitlist'::text) AND (consent IS TRUE) AND ((char_length(COALESCE(name, ''::text)) >= 1) AND (char_length(COALESCE(name, ''::text)) <= 80)) AND (char_length(COALESCE(email, ''::text)) <= 120) AND (char_length(COALESCE(phone, ''::text)) <= 32) AND ((char_length(COALESCE(home_port, area, ''::text)) >= 1) AND (char_length(COALESCE(home_port, area, ''::text)) <= 80)) AND (char_length(COALESCE(vessel_name, ''::text)) <= 80) AND (char_length(COALESCE(trip_types, note, ''::text)) <= 200) AND (char_length(COALESCE(website_url, ''::text)) <= 200) AND (char_length(COALESCE(instagram, ''::text)) <= 80) AND (char_length(COALESCE(note, ''::text)) <= 400) AND (char_length(COALESCE(source, ''::text)) <= 40) AND (((email IS NOT NULL) AND (email <> ''::text)) OR ((phone IS NOT NULL) AND (phone <> ''::text))) AND ((user_id IS NULL) OR (user_id = (( SELECT auth.uid() AS uid))::text))));

alter policy "captain_waitlist_select_own" on public."captain_waitlist"
  using ((( SELECT public.is_admin() AS is_admin) OR ((user_id IS NOT NULL) AND (user_id = (( SELECT auth.uid() AS uid))::text))));

alter policy "captain_waitlist_update_admin" on public."captain_waitlist"
  using (( SELECT public.is_admin() AS is_admin))
  with check ((( SELECT public.is_admin() AS is_admin) AND (status = ANY (ARRAY['waitlist'::text, 'invited'::text, 'listed'::text]))));

alter policy "charter_reviews_insert_reviewer" on public."charter_reviews"
  with check (((reviewer_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Review'::text) = ANY (ARRAY['Review'::text, 'Pending'::text]))));

alter policy "charter_reviews_select_visible" on public."charter_reviews"
  using (((reviewer_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (status = 'Live'::text) OR (EXISTS ( SELECT 1
   FROM public.charters c
  WHERE ((c.id = charter_reviews.charter_id) AND (c.owner_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = charter_reviews.business_id) AND (b.owner_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "charter_reviews_update_owner_or_admin" on public."charter_reviews"
  using ((( SELECT public.is_admin() AS is_admin) OR (reviewer_id = (( SELECT auth.uid() AS uid))::text)))
  with check ((( SELECT public.is_admin() AS is_admin) OR ((reviewer_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Review'::text) <> ALL (ARRAY['Live'::text, 'Approved'::text])))));

alter policy "charters_insert_owner" on public."charters"
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Pending review'::text) <> ALL (ARRAY['Removed'::text, 'Verified'::text, 'Live'::text, 'Approved'::text]))));

alter policy "charters_select_visible" on public."charters"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (status = ANY (ARRAY['Live'::text, 'Verified'::text, 'Directory'::text, 'Approved'::text]))));

alter policy "charters_update_owner_or_admin" on public."charters"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "share_events_select_self_admin" on public."external_share_events"
  using (((user_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "feed_delete_owner_or_admin" on public."feed_posts"
  using (((author_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "feed_insert_author" on public."feed_posts"
  with check ((author_id = (( SELECT auth.uid() AS uid))::text));

alter policy "feed_select_public" on public."feed_posts"
  using (((author_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (status = ANY (ARRAY['Live'::text, 'Approved'::text, 'Sponsored'::text]))));

alter policy "feed_update_owner_or_admin" on public."feed_posts"
  using (((author_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check ((( SELECT public.is_admin() AS is_admin) OR ((author_id = (( SELECT auth.uid() AS uid))::text) AND (status = 'Removed'::text))));

alter policy "integrations_insert_owner_admin" on public."integration_connections"
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "integrations_select_owner_admin" on public."integration_connections"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "integrations_update_owner_admin" on public."integration_connections"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "requests_insert_self" on public."join_requests"
  with check ((requester_id = (( SELECT auth.uid() AS uid))::text));

alter policy "requests_select_related" on public."join_requests"
  using (((requester_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.trip_posts t
  WHERE ((t.id = join_requests.trip_id) AND (t.host_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "requests_update_host_or_admin" on public."join_requests"
  using ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.trip_posts t
  WHERE ((t.id = join_requests.trip_id) AND (t.host_id = (( SELECT auth.uid() AS uid))::text))))));

alter policy "location_media_delete_admin" on public."location_media_sources"
  using (( SELECT public.is_admin() AS is_admin));

alter policy "location_media_insert_admin" on public."location_media_sources"
  with check (( SELECT public.is_admin() AS is_admin));

alter policy "location_media_select_public" on public."location_media_sources"
  using (((status = 'Approved'::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "location_media_update_admin" on public."location_media_sources"
  using (( SELECT public.is_admin() AS is_admin))
  with check (( SELECT public.is_admin() AS is_admin));

alter policy "media_delete_admin" on public."media_assets"
  using (( SELECT public.is_admin() AS is_admin));

alter policy "media_insert_owner" on public."media_assets"
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) AND (COALESCE(status, 'Review'::text) <> 'Removed'::text)));

alter policy "media_select_visible" on public."media_assets"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (public.media_is_publicly_approved(COALESCE(moderation_status, status)) AND (visibility = ANY (ARRAY['public'::text, 'profile'::text, 'crew'::text])) AND ((visibility <> 'crew'::text) OR (owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.trip_members m
  WHERE ((m.trip_id = media_assets.source_id) AND (m.user_id = (( SELECT auth.uid() AS uid))::text) AND (m.status = 'Approved'::text))))))));

alter policy "media_update_owner_or_admin" on public."media_assets"
  using (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check (((owner_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "moderation_items_insert" on public."moderation_items"
  with check ((((reporter_id = (( SELECT auth.uid() AS uid))::text) OR (target_user_id = (( SELECT auth.uid() AS uid))::text)) AND (COALESCE(status, 'Open'::text) = ANY (ARRAY['Open'::text, 'New'::text, 'Review'::text])) AND (char_length(COALESCE(details, ''::text)) <= 2000)));

alter policy "moderation_items_select" on public."moderation_items"
  using ((( SELECT public.is_admin() AS is_admin) OR (reporter_id = (( SELECT auth.uid() AS uid))::text) OR (target_user_id = (( SELECT auth.uid() AS uid))::text)));

alter policy "moderation_items_update" on public."moderation_items"
  using (( SELECT public.is_admin() AS is_admin))
  with check (( SELECT public.is_admin() AS is_admin));

alter policy "notifications_owner" on public."notifications"
  using (((user_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check (((user_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "profiles_insert_self" on public."profiles"
  with check (((id = (( SELECT auth.uid() AS uid))::text) AND (lower(COALESCE(role, 'angler'::text)) <> ALL (ARRAY['admin'::text, 'operator'::text]))));

alter policy "profiles_select_visible" on public."profiles"
  using (((id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (COALESCE(status, 'Live'::text) <> ALL (ARRAY['Removed'::text, 'Deleted'::text, 'Banned'::text]))));

alter policy "profiles_update_self" on public."profiles"
  using (((id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)))
  with check ((( SELECT public.is_admin() AS is_admin) OR ((id = (( SELECT auth.uid() AS uid))::text) AND (lower(COALESCE(role, 'angler'::text)) <> ALL (ARRAY['admin'::text, 'operator'::text])))));

alter policy "trip_members_delete_self_host_or_admin" on public."trip_members"
  using (((user_id = (( SELECT auth.uid() AS uid))::text) OR public.fishcrew_is_trip_host(trip_id)));

alter policy "trip_members_select_member_host_or_admin" on public."trip_members"
  using ((( SELECT public.is_admin() AS is_admin) OR (user_id = (( SELECT auth.uid() AS uid))::text) OR public.fishcrew_is_trip_host(trip_id) OR public.fishcrew_is_approved_trip_member(trip_id)));

alter policy "messages_insert_members_hosts_admin" on public."trip_messages"
  with check (((sender_id = (( SELECT auth.uid() AS uid))::text) AND (( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.trip_posts t
  WHERE ((t.id = trip_messages.trip_id) AND (t.host_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.trip_members m
  WHERE ((m.trip_id = trip_messages.trip_id) AND (m.user_id = (( SELECT auth.uid() AS uid))::text) AND (m.status = 'Approved'::text)))))));

alter policy "messages_select_members_hosts_admin" on public."trip_messages"
  using ((( SELECT public.is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM public.trip_posts t
  WHERE ((t.id = trip_messages.trip_id) AND (t.host_id = (( SELECT auth.uid() AS uid))::text)))) OR (EXISTS ( SELECT 1
   FROM public.trip_members m
  WHERE ((m.trip_id = trip_messages.trip_id) AND (m.user_id = (( SELECT auth.uid() AS uid))::text) AND (m.status = 'Approved'::text))))));

alter policy "trips_insert_host" on public."trip_posts"
  with check ((host_id = (( SELECT auth.uid() AS uid))::text));

alter policy "trips_select_public" on public."trip_posts"
  using (((host_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin) OR (COALESCE(status, 'Open'::text) <> ALL (ARRAY['Removed'::text, 'Deleted'::text, 'Hidden'::text, 'Draft'::text]))));

alter policy "trips_update_host_or_admin" on public."trip_posts"
  using (((host_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "user_blocks_delete" on public."user_blocks"
  using (((blocker_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

alter policy "user_blocks_insert" on public."user_blocks"
  with check (((blocker_id = (( SELECT auth.uid() AS uid))::text) AND (blocked_id IS NOT NULL) AND (blocker_id <> blocked_id)));

alter policy "user_blocks_select" on public."user_blocks"
  using (((blocker_id = (( SELECT auth.uid() AS uid))::text) OR ( SELECT public.is_admin() AS is_admin)));

-- 3. Foreign-key indexes ------------------------------------------------------------
create index if not exists bookings_business_id_idx on public.bookings (business_id);
create index if not exists campaigns_business_id_idx on public.campaigns (business_id);
create index if not exists moderation_items_feed_post_id_idx on public.moderation_items (feed_post_id);
create index if not exists trip_messages_trip_id_created_at_idx on public.trip_messages (trip_id, created_at);

commit;
