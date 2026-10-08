-- FishCrew 0.9.8: captain-claimable charter listings.
--
-- An operator lists a charter for a captain who agreed to be listed, with the
-- captain's email. The listing has no owner and reads "Managed by FishCrew";
-- inquiries on it reach the operator (bookings_select already lets admins read
-- them). When the captain signs up with that email and confirms it, the app
-- calls claim_my_charters(), which hands the charter (and its business row and
-- past inquiries) to the captain.
--
-- The claim email lives in its own table with no client grants and no
-- policies, so only the security-definer functions below can read or write it.
-- Safe to run more than once.

-- 1. Private claim table --------------------------------------------------------
create table if not exists public.charter_claims (
  charter_id text primary key references public.charters(id) on delete cascade,
  claim_email text not null,
  consent_note text not null default '',
  created_by text,
  created_at timestamptz not null default now(),
  claimed_by text,
  claimed_at timestamptz,
  constraint charter_claims_email_shape check (
    char_length(claim_email) between 3 and 254
    and claim_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  )
);

create index if not exists charter_claims_open_email_idx
  on public.charter_claims (lower(claim_email))
  where claimed_at is null;

alter table public.charter_claims enable row level security;
revoke all on table public.charter_claims from public, anon, authenticated;

-- 2. Operator: create or edit a managed listing --------------------------------
create or replace function public.admin_save_managed_charter(
  p_id text,
  p_name text,
  p_area text default '',
  p_species text default '',
  p_boat_type text default '',
  p_trip_types text default '',
  p_availability text default '',
  p_price_from integer default null,
  p_price_to integer default null,
  p_website_url text default '',
  p_bio text default '',
  p_claim_email text default '',
  p_consent_note text default '',
  p_status text default 'Verified'
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id text := nullif(btrim(coalesce(p_id, '')), '');
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := lower(btrim(coalesce(p_claim_email, '')));
  v_site text := btrim(coalesce(p_website_url, ''));
  v_status text := coalesce(nullif(btrim(p_status), ''), 'Verified');
  v_owner text;
  v_claim public.charter_claims%rowtype;
begin
  perform public.admin_assert();

  if v_name = '' or char_length(v_name) > 80 then
    raise exception 'Add a charter name (80 characters or fewer)' using errcode = '22023';
  end if;
  if v_status not in ('Verified', 'Pending review') then
    raise exception 'Status must be Verified (public) or Pending review (hidden)' using errcode = '22023';
  end if;
  if v_site <> '' and v_site !~* '^https://[^[:space:]]+$' then
    raise exception 'Website must start with https://' using errcode = '22023';
  end if;
  if v_email <> '' and (char_length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') then
    raise exception 'That captain email does not look right' using errcode = '22023';
  end if;
  if p_price_from is not null and (p_price_from < 0 or p_price_from > 100000) then
    raise exception 'Price from must be between 0 and 100000' using errcode = '22023';
  end if;
  if p_price_to is not null and (p_price_to < 0 or p_price_to > 100000) then
    raise exception 'Price to must be between 0 and 100000' using errcode = '22023';
  end if;
  if p_price_from is not null and p_price_to is not null and p_price_to < p_price_from then
    raise exception 'Price to must be at least price from' using errcode = '22023';
  end if;

  if v_id is null then
    if v_email = '' then
      raise exception 'Add the captain''s email so they can claim the listing' using errcode = '22023';
    end if;
    if char_length(btrim(coalesce(p_consent_note, ''))) < 3 then
      raise exception 'Note how the captain agreed to be listed' using errcode = '22023';
    end if;
    v_id := 'biz_' || replace(gen_random_uuid()::text, '-', '');

    insert into public.businesses (
      id, owner_id, name, business_type, area, status, campaign, website_url,
      species, boat_type, trip_types, availability_notes,
      price_from_cents, price_to_cents, listing_kind
    ) values (
      v_id, null, v_name, 'Pro Charter', btrim(coalesce(p_area, '')), v_status,
      left(btrim(coalesce(p_bio, '')), 1000), nullif(v_site, ''),
      btrim(coalesce(p_species, '')), btrim(coalesce(p_boat_type, '')),
      btrim(coalesce(p_trip_types, '')), btrim(coalesce(p_availability, '')),
      p_price_from * 100, p_price_to * 100, 'managed'
    );

    insert into public.charters (
      id, owner_id, business_id, name, area, species, boat_type, trip_types,
      availability_notes, price_from_cents, price_to_cents, website_url, bio,
      status, listing_kind
    ) values (
      v_id, null, v_id, v_name, btrim(coalesce(p_area, '')), btrim(coalesce(p_species, '')),
      btrim(coalesce(p_boat_type, '')), btrim(coalesce(p_trip_types, '')),
      btrim(coalesce(p_availability, '')), p_price_from * 100, p_price_to * 100,
      v_site, left(btrim(coalesce(p_bio, '')), 1000), v_status, 'managed'
    );

    insert into public.charter_claims (charter_id, claim_email, consent_note, created_by)
    values (v_id, v_email, left(btrim(p_consent_note), 500), (select auth.uid())::text);

    perform public.admin_log('charter_created', 'charter', v_id, v_name,
      jsonb_build_object('status', v_status));
    return v_id;
  end if;

  select owner_id into v_owner from public.charters where id = v_id for update;
  if not found then
    raise exception 'Charter not found' using errcode = 'P0002';
  end if;

  update public.charters
     set name = v_name,
         area = btrim(coalesce(p_area, '')),
         species = btrim(coalesce(p_species, '')),
         boat_type = btrim(coalesce(p_boat_type, '')),
         trip_types = btrim(coalesce(p_trip_types, '')),
         availability_notes = btrim(coalesce(p_availability, '')),
         price_from_cents = p_price_from * 100,
         price_to_cents = p_price_to * 100,
         website_url = v_site,
         bio = left(btrim(coalesce(p_bio, '')), 1000),
         status = v_status,
         updated_at = now()
   where id = v_id;

  update public.businesses
     set name = v_name,
         area = btrim(coalesce(p_area, '')),
         species = btrim(coalesce(p_species, '')),
         boat_type = btrim(coalesce(p_boat_type, '')),
         trip_types = btrim(coalesce(p_trip_types, '')),
         availability_notes = btrim(coalesce(p_availability, '')),
         price_from_cents = p_price_from * 100,
         price_to_cents = p_price_to * 100,
         website_url = nullif(v_site, ''),
         campaign = left(btrim(coalesce(p_bio, '')), 1000),
         status = v_status,
         updated_at = now()
   where id = v_id;

  -- The claim email can change only while nobody has claimed the listing.
  if v_owner is null and v_email <> '' then
    select * into v_claim from public.charter_claims where charter_id = v_id for update;
    if found then
      update public.charter_claims
         set claim_email = v_email,
             consent_note = coalesce(nullif(left(btrim(coalesce(p_consent_note, '')), 500), ''), consent_note)
       where charter_id = v_id;
    else
      insert into public.charter_claims (charter_id, claim_email, consent_note, created_by)
      values (v_id, v_email, left(btrim(coalesce(p_consent_note, '')), 500), (select auth.uid())::text);
    end if;
  end if;

  perform public.admin_log('charter_updated', 'charter', v_id, v_name,
    jsonb_build_object('status', v_status, 'claimed', v_owner is not null));
  return v_id;
end;
$$;

-- 3. Operator: every charter with its claim state ------------------------------
create or replace function public.admin_list_charters()
returns table (
  charter_id text,
  name text,
  area text,
  species text,
  boat_type text,
  trip_types text,
  availability_notes text,
  price_from integer,
  price_to integer,
  website_url text,
  bio text,
  status text,
  listing_kind text,
  owner_id text,
  owner_name text,
  claim_email text,
  consent_note text,
  claimed_at timestamptz,
  inquiries bigint,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  perform public.admin_assert();
  return query
  select
    c.id,
    c.name,
    c.area,
    c.species,
    c.boat_type,
    c.trip_types,
    c.availability_notes,
    (c.price_from_cents / 100)::integer,
    (c.price_to_cents / 100)::integer,
    c.website_url,
    c.bio,
    c.status,
    c.listing_kind,
    c.owner_id,
    p.full_name,
    cc.claim_email,
    cc.consent_note,
    cc.claimed_at,
    (select count(*) from public.bookings b where coalesce(b.charter_id, b.business_id) = c.id),
    c.created_at
  from public.charters c
  left join public.charter_claims cc on cc.charter_id = c.id
  left join public.profiles p on p.id = c.owner_id
  order by c.created_at desc
  limit 500;
end;
$$;

-- 4. Captain: claim listings waiting for this confirmed email -------------------
create or replace function public.claim_my_charters()
returns table (charter_id text, name text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid text := (select auth.uid())::text;
  v_email text;
  v_confirmed timestamptz;
  r record;
begin
  if v_uid is null then
    return;
  end if;
  select lower(u.email::text), u.email_confirmed_at into v_email, v_confirmed
    from auth.users u where u.id::text = v_uid;
  -- Only a confirmed address proves the person owns it.
  if v_email is null or v_confirmed is null then
    return;
  end if;
  if public.is_restricted() then
    return;
  end if;

  for r in
    select cc.charter_id as id, c.name as charter_name
      from public.charter_claims cc
      join public.charters c on c.id = cc.charter_id
     where cc.claimed_at is null
       and lower(cc.claim_email) = v_email
       and c.owner_id is null
     for update of cc, c
  loop
    update public.charters
       set owner_id = v_uid, listing_kind = 'partner', updated_at = now()
     where id = r.id;
    update public.businesses
       set owner_id = v_uid, listing_kind = 'partner', updated_at = now()
     where id = r.id and owner_id is null;
    update public.charter_claims
       set claimed_by = v_uid, claimed_at = now()
     where charter_claims.charter_id = r.id;
    perform public.admin_log('charter_claimed', 'charter', r.id, r.charter_name,
      jsonb_build_object('captain_id', v_uid));
    charter_id := r.id;
    name := r.charter_name;
    return next;
  end loop;

  if found then
    update public.profiles
       set role = 'Captain', updated_at = now()
     where id = v_uid
       and lower(coalesce(role, 'angler')) in ('angler', '');
  end if;
end;
$$;

-- 5. Grants ---------------------------------------------------------------------
-- Supabase grants EXECUTE on new functions to anon and authenticated by default.
revoke all on function public.admin_save_managed_charter(text, text, text, text, text, text, text, integer, integer, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.admin_list_charters() from public, anon, authenticated;
revoke all on function public.claim_my_charters() from public, anon, authenticated;

grant execute on function public.admin_save_managed_charter(text, text, text, text, text, text, text, integer, integer, text, text, text, text, text) to authenticated;
grant execute on function public.admin_list_charters() to authenticated;
grant execute on function public.claim_my_charters() to authenticated;
