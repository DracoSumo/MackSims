import type { MarketConfig, RideEstimate } from "../data/types";
import { formatFareRange } from "../lib/format";
import { getProvider, sortEstimates } from "../lib/selectors";

interface FareComparisonPanelProps {
  estimates: RideEstimate[];
  market: MarketConfig;
}

export function FareComparisonPanel({ estimates, market }: FareComparisonPanelProps) {
  const cheapest = sortEstimates(estimates, "cheapest")[0];
  const fastest = sortEstimates(estimates, "fastest")[0];
  const reliable = sortEstimates(estimates, "most-reliable")[0];
  const bestValue = sortEstimates(estimates, "best-value")[0];

  const summaryItems = [
    { label: "Cheapest", estimate: cheapest },
    { label: "Fastest", estimate: fastest },
    { label: "Most reliable", estimate: reliable },
    { label: "Best value", estimate: bestValue }
  ];

  return (
    <section className="panel fare-panel">
      <div className="section-heading">
        <p className="eyebrow">Fare comparison</p>
        <h2>Trip options at a glance</h2>
      </div>
      <div className="comparison-grid">
        {summaryItems.map(({ label, estimate }) => {
          const provider = getProvider(estimate.providerId);
          return (
            <div className="comparison-cell" key={label}>
              <span>{label}</span>
              <strong>{provider?.name ?? "Provider"}</strong>
              <p>{formatFareRange(estimate.fareLow, estimate.fareHigh, market)}</p>
              <small>{estimate.etaMinutes} min ETA</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
