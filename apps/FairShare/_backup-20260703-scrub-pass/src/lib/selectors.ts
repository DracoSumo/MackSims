import { crowdSignals, pickupZones, rideProviders } from "../data/mockData";
import type { CrowdSignal, PickupZone, RideEstimate, RideProvider, SortMode } from "../data/types";

export function getProvider(providerId: string): RideProvider | undefined {
  return rideProviders.find((provider) => provider.id === providerId);
}

export function getPickupZone(zoneId: string): PickupZone | undefined {
  return pickupZones.find((zone) => zone.id === zoneId);
}

export function getCrowdSignal(signalId: string): CrowdSignal | undefined {
  return crowdSignals.find((signal) => signal.id === signalId);
}

export function getSuggestedPickupZone(zone: PickupZone): PickupZone | undefined {
  if (!zone.suggestedAlternativeId) {
    return undefined;
  }

  return getPickupZone(zone.suggestedAlternativeId);
}

export function averageFare(estimate: RideEstimate): number {
  return (estimate.fareLow + estimate.fareHigh) / 2;
}

export function getValueScore(estimate: RideEstimate): number {
  const fareScore = Math.max(0, 100 - averageFare(estimate));
  const etaScore = Math.max(0, 100 - estimate.etaMinutes * 2);
  const pressurePenalty = estimate.crowdPressureScore * 0.35;
  return fareScore * 0.35 + etaScore * 0.25 + estimate.reliabilityPercent * 0.3 + estimate.pickupQuality * 4 - pressurePenalty;
}

export function getScoreBreakdown(estimate: RideEstimate) {
  const fare = Math.max(0, 100 - averageFare(estimate));
  const eta = Math.max(0, 100 - estimate.etaMinutes * 2);
  const reliability = estimate.reliabilityPercent;
  const pickupQuality = estimate.pickupQuality * 20;
  const crowdPressure = Math.max(0, 100 - estimate.crowdPressureScore);

  return {
    fare,
    eta,
    reliability,
    pickupQuality,
    crowdPressure,
    total: Math.round(fare * 0.24 + eta * 0.2 + reliability * 0.28 + pickupQuality * 0.16 + crowdPressure * 0.12)
  };
}

export function sortEstimates(estimates: RideEstimate[], sortMode: SortMode): RideEstimate[] {
  const sorted = [...estimates];

  if (sortMode === "cheapest") {
    return sorted.sort((a, b) => averageFare(a) - averageFare(b));
  }

  if (sortMode === "fastest") {
    return sorted.sort((a, b) => a.etaMinutes - b.etaMinutes);
  }

  if (sortMode === "most-reliable") {
    return sorted.sort((a, b) => b.reliabilityPercent - a.reliabilityPercent);
  }

  return sorted.sort((a, b) => getValueScore(b) - getValueScore(a));
}

export function getRecommendation(estimates: RideEstimate[], recommendation: RideEstimate["recommendation"]): RideEstimate | undefined {
  return estimates.find((estimate) => estimate.recommendation === recommendation);
}
