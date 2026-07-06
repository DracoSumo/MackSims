import type { MarketConfig } from "../data/types";

interface MarketModeBadgeProps {
  market: MarketConfig;
}

export function MarketModeBadge({ market }: MarketModeBadgeProps) {
  return (
    <span className={`market-badge market-badge--${market.mode}`}>
      {market.label}
      <span>{market.currency}</span>
    </span>
  );
}
