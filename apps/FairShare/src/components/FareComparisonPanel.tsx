import type { MarketConfig, RideEstimate } from "../data/types";
import { formatFareRange } from "../lib/format";
import { getProvider, sortEstimates } from "../lib/selectors";
import { providerDeepLinks } from "../services/integrationHooks";

interface FareComparisonPanelProps {
  dropoff: string;
  estimates: RideEstimate[];
  market: MarketConfig;
  pickup: string;
}

export function FareComparisonPanel({ dropoff, estimates, market, pickup }: FareComparisonPanelProps) {
  const cheapest = sortEstimates(estimates, "cheapest")[0];
  const fastest = sortEstimates(estimates, "fastest")[0];
  const reliable = sortEstimates(estimates, "most-reliable")[0];
  const bestValue = sortEstimates(estimates, "best-value")[0];
  const deepLinks = providerDeepLinks(pickup, dropoff);

  const summaryItems = [
    { label: "Cheapest", estimate: cheapest },
    { label: "Fastest", estimate: fastest },
    { label: "Most reliable", estimate: reliable },
    { label: "Best value", estimate: bestValue }
  ].filter((item): item is { label: string; estimate: RideEstimate } => Boolean(item.estimate));

  return (
    <section className="panel fare-panel">
      <div className="section-heading">
        <p className="eyebrow">Fare comparison</p>
        <h2>Trip options at a glance</h2>
      </div>
      {summaryItems.length ? (
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
      ) : (
        <p className="empty-state" role="status">
          No demo estimates for this trip yet. Adjust pickup, drop-off, or zone and compare again.
        </p>
      )}
      <div className="provider-link-actions" aria-label="Open trip in a rideshare provider">
        <a className="primary-button" href={deepLinks.uber} rel="noreferrer" target="_blank">
          Open in Uber
        </a>
        <a className="ghost-button" href={deepLinks.lyft} rel="noreferrer" target="_blank">
          Open in Lyft
        </a>
      </div>
      <p className="provider-disclaimer">{deepLinks.disclaimer}</p>
    </section>
  );
}
