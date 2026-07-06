export type RideProviderKind =
  | "taxi"
  | "rideshare"
  | "shuttle"
  | "private-driver"
  | "local-transport";

export type CrowdLevel = "Low" | "Moderate" | "High" | "Packed";

export type SurgeRisk = "Low" | "Medium" | "High";

export type PickupCategory =
  | "airport"
  | "hotel"
  | "cruise-port"
  | "event-venue"
  | "downtown-nightlife"
  | "neighborhood";

export type RideRecommendation = "best-value" | "fastest-option";

export interface RideProvider {
  id: string;
  name: string;
  kind: RideProviderKind;
  summary: string;
  serviceArea: string;
  reliabilityScore: number;
  features: string[];
  isPilotPartner?: boolean;
}

export interface RideEstimate {
  id: string;
  providerId: string;
  marketId: string;
  pickupZoneId: string;
  fareLow: number;
  fareHigh: number;
  etaMinutes: number;
  reliabilityPercent: number;
  pickupQuality: number;
  crowdPressureScore: number;
  recommendation?: RideRecommendation;
  tags: string[];
}

export interface CrowdSignal {
  id: string;
  marketId: string;
  locationName: string;
  level: CrowdLevel;
  surgeRisk: SurgeRisk;
  pickupPressureScore: number;
  eventDemand: string;
  confidence: number;
  timestampLabel: string;
  notes: string;
}

export interface PickupZone {
  id: string;
  marketId: string;
  name: string;
  category: PickupCategory;
  addressHint: string;
  walkMinutes: number;
  pickupQualityScore: number;
  crowdSignalId: string;
  suggestedAlternativeId?: string;
  notes: string;
}

export interface TaxiLicenseStatus {
  status: "valid" | "review-needed" | "pending" | "expired";
  expirationDate: string;
  issuingAuthority: string;
  complianceFlags: string[];
}

export interface DriverProfile {
  id: string;
  marketId: string;
  name: string;
  vehicle: string;
  permitId: string;
  licenseStatus: TaxiLicenseStatus;
  trainingStatus: "not-started" | "in-progress" | "complete";
  queuePosition?: number;
  activePickupCategory?: PickupCategory;
}

export interface MarketConfig {
  id: string;
  label: string;
  mode: "global" | "bermuda-pilot";
  currency: "USD" | "BMD";
  distanceUnit: "mi" | "km";
  pickupCategories: PickupCategory[];
  complianceEnabled: boolean;
  governmentReportingEnabled: boolean;
}

export interface AdminMetric {
  id: string;
  marketId: string;
  label: string;
  value: string;
  trend: string;
  tone: "neutral" | "good" | "warning" | "critical";
  description: string;
}

export type SortMode = "best-value" | "cheapest" | "fastest" | "most-reliable";
