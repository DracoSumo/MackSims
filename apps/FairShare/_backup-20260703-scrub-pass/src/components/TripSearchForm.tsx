import { useMemo, useState } from "react";
import { pickupZones } from "../data/mockData";

type FormSubmitEvent = {
  preventDefault: () => void;
};

type InputChangeEvent = {
  target: HTMLInputElement;
};

type SelectChangeEvent = {
  target: HTMLSelectElement;
};

interface TripSearchFormProps {
  compact?: boolean;
  defaultDropoff?: string;
  defaultPickup?: string;
  defaultZoneId?: string;
  onSubmit: (params: { pickup: string; dropoff: string; zoneId: string }) => void;
}

export function TripSearchForm({
  compact = false,
  defaultDropoff = "Hamilton hotel district",
  defaultPickup = "L.F. Wade International Airport",
  defaultZoneId = "bda-airport-curb",
  onSubmit
}: TripSearchFormProps) {
  const [pickup, setPickup] = useState(defaultPickup);
  const [dropoff, setDropoff] = useState(defaultDropoff);
  const [zoneId, setZoneId] = useState(defaultZoneId);

  const bermudaZones = useMemo(() => pickupZones.filter((zone) => zone.marketId === "bermuda"), []);

  return (
    <form
      className={compact ? "trip-form trip-form--compact" : "trip-form"}
      onSubmit={(event: FormSubmitEvent) => {
        event.preventDefault();
        onSubmit({ pickup, dropoff, zoneId });
      }}
    >
      <label>
        <span>Pickup</span>
        <input value={pickup} onChange={(event: InputChangeEvent) => setPickup(event.target.value)} />
      </label>
      <label>
        <span>Drop-off</span>
        <input value={dropoff} onChange={(event: InputChangeEvent) => setDropoff(event.target.value)} />
      </label>
      <label>
        <span>Pickup category</span>
        <select value={zoneId} onChange={(event: SelectChangeEvent) => setZoneId(event.target.value)}>
          {bermudaZones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Compare rides</button>
    </form>
  );
}
