export type NearbyPlace = {
  id: string;
  name: string;
  distanceM?: number;
};

function haversineM(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(s)));
}

export async function geocodePlace(query: string): Promise<{ lat: number; lng: number } | null> {
  const q = query.trim();
  if (q.length < 2) return null;
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    features?: { geometry?: { coordinates?: number[] } }[];
  };
  const coords = data.features?.[0]?.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;
  return { lng: coords[0], lat: coords[1] };
}

type OverpassEl = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export async function nearbyGyms(lat: number, lng: number): Promise<NearbyPlace[]> {
  const query = `[out:json][timeout:12];(nwr["leisure"="fitness_centre"](around:4500,${lat},${lng});nwr["leisure"="sports_centre"](around:4500,${lat},${lng});nwr["amenity"="gym"](around:4500,${lat},${lng}););out center 30;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query,
  });
  if (!res.ok) throw new Error("gym lookup failed");
  const data = (await res.json()) as { elements?: OverpassEl[] };
  const seen = new Set<string>();
  const places: NearbyPlace[] = [];
  for (const el of data.elements ?? []) {
    const name = el.tags?.name?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const pLat = el.lat ?? el.center?.lat;
    const pLng = el.lon ?? el.center?.lon;
    places.push({
      id: String(el.id),
      name,
      distanceM: pLat != null && pLng != null ? haversineM(lat, lng, pLat, pLng) : undefined,
    });
  }
  places.sort((a, b) => (a.distanceM ?? 9e9) - (b.distanceM ?? 9e9));
  return places.slice(0, 8);
}

export function formatGymDistance(meters?: number): string {
  if (meters == null) return "";
  if (meters < 1000) return `${Math.round(meters / 50) * 50} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
