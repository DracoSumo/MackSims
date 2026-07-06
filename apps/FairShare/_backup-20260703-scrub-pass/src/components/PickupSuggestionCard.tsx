import type { CrowdSignal, PickupZone } from "../data/types";

interface PickupSuggestionCardProps {
  currentZone: PickupZone;
  suggestedZone?: PickupZone;
  signal?: CrowdSignal;
}

export function PickupSuggestionCard({ currentZone, suggestedZone, signal }: PickupSuggestionCardProps) {
  return (
    <article className="card pickup-card">
      <p className="eyebrow">Pickup quality</p>
      <h3>{suggestedZone ? "Suggested better pickup zone" : "Current pickup zone"}</h3>

      <div className="zone-stack">
        <div>
          <span>Current</span>
          <strong>{currentZone.name}</strong>
          <p>{currentZone.addressHint}</p>
        </div>
        {suggestedZone && (
          <div className="zone-suggestion">
            <span>Better zone</span>
            <strong>{suggestedZone.name}</strong>
            <p>
              {suggestedZone.walkMinutes} min walk · pickup quality {suggestedZone.pickupQualityScore}/100
            </p>
          </div>
        )}
      </div>

      <p className="muted">{suggestedZone?.notes ?? currentZone.notes}</p>
      {signal && <p className="pressure-note">Crowd pressure: {signal.pickupPressureScore}/100</p>}
    </article>
  );
}
