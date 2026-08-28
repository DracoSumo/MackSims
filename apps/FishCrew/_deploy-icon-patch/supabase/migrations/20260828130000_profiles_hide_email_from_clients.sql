-- FishCrew: profiles.email was world-readable via the publishable anon key.
-- Trigger: GET /rest/v1/profiles?select=email (or select=*) with only the
-- shipped anon key returned every account email.
--
-- Fix: column-level SELECT grants omit email for anon/authenticated.
-- Username → email for sign-in stays on security-definer RPC, preferring
-- auth.users so clients no longer need to write email into profiles.

REVOKE SELECT ON TABLE public.profiles FROM PUBLIC;
REVOKE SELECT ON TABLE public.profiles FROM anon, authenticated;

GRANT SELECT (
  id,
  username,
  full_name,
  role,
  home_area,
  avatar_url,
  created_at,
  updated_at,
  bio,
  fishing_styles,
  profile_theme,
  auth_provider,
  first_name,
  last_name,
  avatar_moderation_status,
  website_url,
  brand_url,
  youtube_url,
  instagram_url,
  boat,
  species,
  trip_types,
  experience,
  bio_long
) ON public.profiles TO anon, authenticated;

-- Keep INSERT/UPDATE (including email) for owners/service paths; SELECT of
-- email is what leaked. Prefer auth.users for login resolution going forward.
CREATE OR REPLACE FUNCTION public.login_identifier_for_username(candidate text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result text;
  normalized text := lower(trim(both from coalesce(candidate, '')));
BEGIN
  IF normalized = '' THEN
    RETURN NULL;
  END IF;

  SELECT lower(au.email::text) INTO result
  FROM public.profiles p
  INNER JOIN auth.users au ON au.id::text = p.id::text
  WHERE lower(coalesce(p.username, '')) = normalized
  LIMIT 1;

  IF result IS NOT NULL AND result <> '' THEN
    RETURN result;
  END IF;

  -- Legacy rows / seed profiles that still store email on profiles only.
  SELECT lower(p.email) INTO result
  FROM public.profiles p
  WHERE lower(coalesce(p.username, '')) = normalized
    AND coalesce(p.email, '') <> ''
  LIMIT 1;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.login_identifier_for_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.login_identifier_for_username(text) TO anon, authenticated;

COMMENT ON FUNCTION public.login_identifier_for_username(text) IS
  'Returns at most one login email for an exact username. SECURITY DEFINER; does not expose profiles.email via PostgREST SELECT.';
