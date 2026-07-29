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

export function loadRiderProfile(): RiderProfileLocal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as RiderProfileLocal;
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveRiderProfile(profile: RiderProfileLocal): RiderProfileLocal {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  void import("./supabaseSync").then(({ pushRiderProfile }) => pushRiderProfile(profile));
  return profile;
}

export function resetRiderProfile(): RiderProfileLocal {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_PROFILE };
}
