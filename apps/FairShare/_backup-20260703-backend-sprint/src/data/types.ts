export type RideProviderKind =
  | "taxi"
  | "rideshare"
  | "shuttle"
  | "private-driver"
  | "local-transport"
  | "hotel-transport"
  | "airport-transfer"
  | "event-pickup"
  | "cruise-port-pickup"
  | "walking"
  | "designated-driver";

export type CrowdLevel = "Low" | "Moderate" | "High" | "Packed";

export type SurgeRisk = "Low" | "Medium" | "High";

export type PickupCategory =
  | "airport"
  | "hotel"
  | "cruise-port"
  | "event-venue"
  | "downtown-nightlife"
  | "neighborhood"
  | "bar"
  | "restaurant"
  | "beach"
  | "marina"
  | "tourist-attraction"
  | "shopping"
  | "transit-hub"
  | "campus"
  | "hospital"
  | "office-district"
  | "resort"
  | "stadium";

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
  providerName?: string;
  marketId: string;
  currency?: string;
  pickupZoneId: string;
  estimatedFare?: number;
  fareLow: number;
  fareHigh: number;
  etaMinutes: number;
  reliability?: number;
  reliabilityPercent: number;
  pickupQuality: number;
  crowdPressure?: number;
  crowdPressureScore: number;
  bookingAvailable?: boolean;
  complianceStatus?: "not-applicable" | "placeholder" | "pilot-review" | "verified";
  recommendation?: RideRecommendation;
  tags: string[];
}

export interface CrowdSignal {
  id: string;
  marketId: string;
  locationName: string;
  destinationType?: PickupCategory;
  level: CrowdLevel;
  surgeRisk: SurgeRisk;
  pickupPressureScore: number;
  eventDemand: string;
  confidence: number;
  timestampLabel: string;
  notes: string;
  signalInputs?: string[];
  waitRecommendation?: string;
  moveRecommendation?: string;
  nearbyAlternatives?: string[];
  precisionNote?: string;
  borrowedLogic?: string[];
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
  currency: string;
  locale?: string;
  country?: string;
  city?: string;
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

export interface NightlifeVenue {
  id: string;
  marketId: string;
  name: string;
  category: "bar" | "restaurant" | "event-venue" | "downtown-nightlife";
  vibe: string;
  crowdLevel: CrowdLevel;
  closingTime: string;
  pickupZoneId: string;
  tonightNote: string;
}

export interface LocalEvent {
  id: string;
  marketId: string;
  name: string;
  venueName: string;
  timeLabel: string;
  expectedCrowd: CrowdLevel;
  surgeRisk: SurgeRisk;
  pickupZoneId: string;
  note: string;
}

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  zoneId: string;
  savedAt: number;
}

export interface RecentSearch {
  id: string;
  pickup: string;
  dropoff: string;
  zoneId: string;
  searchedAt: number;
}
