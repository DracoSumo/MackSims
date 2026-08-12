export type RiderProfileLocal = {
  name: string;
  ridingStyle: string;
  bike: string;
  homeArea: string;
  experienceLevel: string;
  emergencyContact: string;
  garage: {
    year: string;
    make: string;
    model: string;
    setup: string;
    range: string;
  };
};

const STORAGE_KEY = "motocrew.riderProfile";

const DEFAULT_PROFILE: RiderProfileLocal = {
  name: "",
  ridingStyle: "",
  bike: "",
  homeArea: "",
  experienceLevel: "",
  emergencyContact: "",
  garage: {
    year: "",
    make: "",
    model: "",
    setup: "",
    range: "",
  },
};

function trim(value: string | undefined | null): string {
  return (value ?? "").trim();
}

export function emptyRiderProfile(): RiderProfileLocal {
  return {
    ...DEFAULT_PROFILE,
    garage: { ...DEFAULT_PROFILE.garage },
  };
}

export function isBlankRiderProfile(profile: RiderProfileLocal): boolean {
  return (
    !trim(profile.name) &&
    !trim(profile.ridingStyle) &&
    !trim(profile.bike) &&
    !trim(profile.homeArea) &&
    !trim(profile.experienceLevel) &&
    !trim(profile.emergencyContact) &&
    !trim(profile.garage?.year) &&
    !trim(profile.garage?.make) &&
    !trim(profile.garage?.model) &&
    !trim(profile.garage?.setup) &&
    !trim(profile.garage?.range)
  );
}

/** Prefer non-empty local fields; fill gaps from remote. Blank local adopts remote entirely. */
export function mergeRiderProfileFields(
  local: RiderProfileLocal,
  remote: RiderProfileLocal | null
): RiderProfileLocal {
  if (!remote) return { ...local, garage: { ...local.garage } };
  if (isBlankRiderProfile(local)) return { ...remote, garage: { ...remote.garage } };

  const pick = (localValue: string, remoteValue: string) =>
    trim(localValue) ? localValue : remoteValue;

  return {
    name: pick(local.name, remote.name),
    ridingStyle: pick(local.ridingStyle, remote.ridingStyle),
    bike: pick(local.bike, remote.bike),
    homeArea: pick(local.homeArea, remote.homeArea),
    experienceLevel: pick(local.experienceLevel, remote.experienceLevel),
    emergencyContact: pick(local.emergencyContact, remote.emergencyContact),
    garage: {
      year: pick(local.garage?.year, remote.garage?.year),
      make: pick(local.garage?.make, remote.garage?.make),
      model: pick(local.garage?.model, remote.garage?.model),
      setup: pick(local.garage?.setup, remote.garage?.setup),
      range: pick(local.garage?.range, remote.garage?.range),
    },
  };
}

export function loadRiderProfile(): RiderProfileLocal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyRiderProfile();
    const parsed = JSON.parse(raw) as Partial<RiderProfileLocal>;
    return {
      ...emptyRiderProfile(),
      ...parsed,
      garage: { ...emptyRiderProfile().garage, ...(parsed.garage ?? {}) },
    };
  } catch {
    return emptyRiderProfile();
  }
}

/** Persist locally without triggering a cloud push (used by sign-in merge). */
export function saveRiderProfileLocal(profile: RiderProfileLocal): RiderProfileLocal {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function saveRiderProfile(profile: RiderProfileLocal): RiderProfileLocal {
  saveRiderProfileLocal(profile);
  void import("./supabaseSync").then(({ pushRiderProfile }) => pushRiderProfile(profile));
  return profile;
}

export function resetRiderProfile(): RiderProfileLocal {
  localStorage.removeItem(STORAGE_KEY);
  return emptyRiderProfile();
}
