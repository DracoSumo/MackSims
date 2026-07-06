import type { CrowdSignal } from "../data/types";
import { toTitleCase } from "../lib/format";

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
          {signal.destinationType && <span className="destination-pill">{toTitleCase(signal.destinationType)}</span>}
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

      {(signal.waitRecommendation || signal.moveRecommendation) && (
        <div className="crowd-detail-list">
          {signal.waitRecommendation && (
            <div>
              <span>Wait guidance</span>
              <strong>{signal.waitRecommendation}</strong>
            </div>
          )}
          {signal.moveRecommendation && (
            <div>
              <span>Move guidance</span>
              <strong>{signal.moveRecommendation}</strong>
            </div>
          )}
        </div>
      )}

      {signal.signalInputs && (
        <div className="signal-block">
          <span>Mock signal inputs</span>
          <div className="mini-tag-row">
            {signal.signalInputs.map((input) => (
              <small key={input}>{input}</small>
            ))}
          </div>
        </div>
      )}

      {signal.nearbyAlternatives && (
        <div className="signal-block">
          <span>Nearby alternatives</span>
          <div className="mini-tag-row mini-tag-row--light">
            {signal.nearbyAlternatives.map((alternative) => (
              <small key={alternative}>{alternative}</small>
            ))}
          </div>
        </div>
      )}

      {signal.borrowedLogic && (
        <div className="signal-block">
          <span>Borrowed ecosystem logic</span>
          <div className="mini-tag-row mini-tag-row--light">
            {signal.borrowedLogic.map((logic) => (
              <small key={logic}>{logic}</small>
            ))}
          </div>
        </div>
      )}

      {signal.precisionNote && <p className="precision-note">{signal.precisionNote}</p>}

      <div className="placeholder-action">
        <span>User crowd poll</span>
        <button type="button" disabled>
          Pending
        </button>
      </div>
    </article>
  );
}
