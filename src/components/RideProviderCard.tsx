import type { MarketConfig, RideEstimate, RideProvider } from "../data/types";
import { formatFareRange, toTitleCase } from "../lib/format";

interface RideProviderCardProps {
  estimate: RideEstimate;
  provider: RideProvider;
  market: MarketConfig;
}

export function RideProviderCard({ estimate, provider, market }: RideProviderCardProps) {
  return (
    <article className="card ride-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">{toTitleCase(provider.kind)}</p>
          <h3>{provider.name}</h3>
        </div>
        {estimate.recommendation && (
          <span className={`recommendation recommendation--${estimate.recommendation}`}>
            {estimate.recommendation === "best-value" ? "Best value" : "Fastest"}
          </span>
        )}
      </div>

      <p className="muted">{provider.summary}</p>

      <div className="metric-grid metric-grid--ride">
        <div>
          <span>Fare</span>
          <strong>{formatFareRange(estimate.fareLow, estimate.fareHigh, market)}</strong>
        </div>
        <div>
          <span>ETA</span>
          <strong>{estimate.etaMinutes} min</strong>
        </div>
        <div>
          <span>Reliable</span>
          <strong>{estimate.reliabilityPercent}%</strong>
        </div>
        <div>
          <span>Pickup</span>
          <strong>{estimate.pickupQuality}/5</strong>
        </div>
      </div>

      <div className="pressure-row">
        <span>Pressure score</span>
        <div className="meter">
          <span style={{ width: `${estimate.crowdPressureScore}%` }} />
        </div>
        <strong>{estimate.crowdPressureScore}</strong>
      </div>

      <div className="tag-row">
        {estimate.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}
