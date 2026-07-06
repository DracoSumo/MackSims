import type { CrowdSignal } from "../data/types";

interface CrowdMeterCardProps {
  signal: CrowdSignal;
  title?: string;
}

export function CrowdMeterCard({ signal, title = "CrowdMeter" }: CrowdMeterCardProps) {
  return (
    <article className={`card crowd-card crowd-card--${signal.level.toLowerCase()}`}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">{title}</p>
          <h3>{signal.locationName}</h3>
        </div>
        <span className="level-pill">{signal.level}</span>
      </div>

      <div className="metric-grid">
        <div>
          <span>Surge risk</span>
          <strong>{signal.surgeRisk}</strong>
        </div>
        <div>
          <span>Pressure</span>
          <strong>{signal.pickupPressureScore}/100</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>{signal.confidence}%</strong>
        </div>
      </div>

      <p className="muted">{signal.eventDemand}</p>
      <p>{signal.notes}</p>

      <div className="placeholder-action">
        <span>User crowd poll</span>
        <button type="button" disabled>
          Pending
        </button>
      </div>
    </article>
  );
}
