"use client";

import { useEffect, useState } from "react";
import { ChoiceChip } from "@/components/ChoiceButton";
import { formatGymDistance, geocodePlace, nearbyGyms, type NearbyPlace } from "@/lib/nearbyGyms";

export function NearbyGyms({
  lat,
  lng,
  query,
  selected,
  onPick,
}: {
  lat?: number;
  lng?: number;
  query?: string;
  selected?: string;
  onPick: (name: string) => void;
}) {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [status, setStatus] = useState("");
  const [lookup, setLookup] = useState(query ?? "");

  useEffect(() => {
    const t = window.setTimeout(() => setLookup(query ?? ""), 400);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("Looking up gyms nearby…");
      try {
        let coords = lat != null && lng != null ? { lat, lng } : null;
        if (!coords && lookup.trim()) coords = await geocodePlace(lookup.trim());
        if (!coords) {
          if (!cancelled) {
            setPlaces([]);
            setStatus("Add a place name or use this device location to list gyms nearby.");
          }
          return;
        }
        const list = await nearbyGyms(coords.lat, coords.lng);
        if (cancelled) return;
        setPlaces(list);
        setStatus(list.length ? `${list.length} gyms near you (OpenStreetMap).` : "No named gyms in that area — type yours.");
      } catch {
        if (!cancelled) {
          setPlaces([]);
          setStatus("Couldn’t load gyms — type the name yourself.");
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [lat, lng, lookup]);

  if (!status && !places.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Gyms nearby</p>
      {places.length ? (
        <div className="flex flex-wrap gap-2">
          {places.map((place) => (
            <ChoiceChip key={place.id} selected={selected === place.name} onClick={() => onPick(place.name)}>
              {place.name}
              {place.distanceM != null ? ` · ${formatGymDistance(place.distanceM)}` : ""}
            </ChoiceChip>
          ))}
        </div>
      ) : null}
      <p className="text-xs text-[var(--pf-muted)]">{status}</p>
    </div>
  );
}
