import type { MarketConfig } from "../data/types";

export function formatCurrency(value: number, market: MarketConfig): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatFareRange(low: number, high: number, market: MarketConfig): string {
  return `${formatCurrency(low, market)}-${formatCurrency(high, market)}`;
}

export function toTitleCase(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
