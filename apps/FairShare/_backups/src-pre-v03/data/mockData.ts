import type {
  AdminMetric,
  CrowdSignal,
  DriverProfile,
  MarketConfig,
  PickupZone,
  RideEstimate,
  RideProvider
} from "./types";

export const marketConfigs: MarketConfig[] = [
  {
    id: "global",
    label: "FairShare Standard",
    mode: "global",
    currency: "USD",
    distanceUnit: "mi",
    pickupCategories: ["airport", "hotel", "event-venue", "downtown-nightlife", "neighborhood"],
    complianceEnabled: false,
    governmentReportingEnabled: false
  },
  {
    id: "bermuda",
    label: "Bermuda Taxi Pilot",
    mode: "bermuda-pilot",
    currency: "BMD",
    distanceUnit: "km",
    pickupCategories: ["airport", "hotel", "cruise-port", "event-venue", "downtown-nightlife"],
    complianceEnabled: true,
    governmentReportingEnabled: true
  }
];

export const rideProviders: RideProvider[] = [
  {
    id: "bermuda-taxi",
    name: "Bermuda Taxi",
    kind: "taxi",
    summary: "Licensed local taxi service with airport, hotel, and cruise pickup coverage.",
    serviceArea: "Islandwide",
    reliabilityScore: 91,
    features: ["Licensed drivers", "Pilot-ready", "Queue dispatch"],
    isPilotPartner: true
  },
  {
    id: "fairshare-rideshare",
    name: "FairShare Rideshare",
    kind: "rideshare",
    summary: "Placeholder rideshare comparison partner for price and wait-time benchmarking.",
    serviceArea: "Urban and visitor corridors",
    reliabilityScore: 84,
    features: ["Flexible pickup", "Fare estimate", "Surge indicator"]
  },
  {
    id: "harbor-shuttle",
    name: "Harbor Shuttle",
    kind: "shuttle",
    summary: "Shared route option for hotels, cruise areas, airport transfers, and venues.",
    serviceArea: "Airport, hotels, cruise port",
    reliabilityScore: 80,
    features: ["Shared fare", "Scheduled windows", "Group friendly"]
  },
  {
    id: "private-island-driver",
    name: "Private Driver",
    kind: "private-driver",
    summary: "Premium pre-booked vehicle placeholder for travelers who need certainty.",
    serviceArea: "Reservation zones",
    reliabilityScore: 93,
    features: ["Pre-book", "High pickup quality", "Direct route"]
  },
  {
    id: "local-transport",
    name: "Local Transport",
    kind: "local-transport",
    summary: "Public and community transport placeholder for budget-conscious trips.",
    serviceArea: "Downtown, terminals, and main corridors",
    reliabilityScore: 76,
    features: ["Lowest fare", "Walk-to-stop", "Schedule dependent"]
  }
];

export const crowdSignals: CrowdSignal[] = [
  {
    id: "bda-airport-arrivals",
    marketId: "bermuda",
    locationName: "L.F. Wade International Airport Arrivals",
    level: "High",
    surgeRisk: "Medium",
    pickupPressureScore: 78,
    eventDemand: "Two inbound flights landed within 20 minutes",
    confidence: 71,
    timestampLabel: "Mock live window",
    notes: "Airport arrivals are busy; queue clarity matters more than shortest walk."
  },
  {
    id: "hamilton-hotel-row",
    marketId: "bermuda",
    locationName: "Hamilton Hotel Row",
    level: "Moderate",
    surgeRisk: "Low",
    pickupPressureScore: 46,
    eventDemand: "Normal check-in and dinner traffic",
    confidence: 67,
    timestampLabel: "Mock live window",
    notes: "Hotel frontage is usable, but side-lane pickup may reduce wait variance."
  },
  {
    id: "dockyard-cruise",
    marketId: "bermuda",
    locationName: "Royal Naval Dockyard Cruise Port",
    level: "Packed",
    surgeRisk: "High",
    pickupPressureScore: 92,
    eventDemand: "Cruise disembarkation and excursion return overlap",
    confidence: 75,
    timestampLabel: "Mock live window",
    notes: "Cruise pickup needs managed queues and shuttle overflow planning."
  },
  {
    id: "national-stadium-event",
    marketId: "bermuda",
    locationName: "National Sports Centre Event Gate",
    level: "High",
    surgeRisk: "High",
    pickupPressureScore: 86,
    eventDemand: "Post-event exit wave expected",
    confidence: 63,
    timestampLabel: "Mock event window",
    notes: "Event venue demand should be split across two pickup zones."
  },
  {
    id: "front-street-nightlife",
    marketId: "bermuda",
    locationName: "Front Street Nightlife",
    level: "Moderate",
    surgeRisk: "Medium",
    pickupPressureScore: 61,
    eventDemand: "Late-night dining and bar close traffic",
    confidence: 59,
    timestampLabel: "Mock nightlife window",
    notes: "A short walk to a side street may improve pickup quality."
  },
  {
    id: "downtown-demo",
    marketId: "global",
    locationName: "Downtown Transit Core",
    level: "Moderate",
    surgeRisk: "Low",
    pickupPressureScore: 52,
    eventDemand: "Office commute plus restaurant traffic",
    confidence: 58,
    timestampLabel: "Mock live window",
    notes: "Generic downtown scenario for non-Bermuda demos."
  }
];

export const pickupZones: PickupZone[] = [
  {
    id: "bda-airport-curb",
    marketId: "bermuda",
    name: "Airport Arrivals Taxi Curb",
    category: "airport",
    addressHint: "Main arrivals forecourt",
    walkMinutes: 2,
    pickupQualityScore: 82,
    crowdSignalId: "bda-airport-arrivals",
    suggestedAlternativeId: "bda-airport-east-lane",
    notes: "Best for licensed taxi queue visibility."
  },
  {
    id: "bda-airport-east-lane",
    marketId: "bermuda",
    name: "Airport East Lane",
    category: "airport",
    addressHint: "Short walk east of arrivals",
    walkMinutes: 5,
    pickupQualityScore: 88,
    crowdSignalId: "bda-airport-arrivals",
    notes: "Suggested relief zone when the main curb is crowded."
  },
  {
    id: "hamilton-hotel-front",
    marketId: "bermuda",
    name: "Hamilton Hotel Frontage",
    category: "hotel",
    addressHint: "Lobby-side pickup bay",
    walkMinutes: 1,
    pickupQualityScore: 74,
    crowdSignalId: "hamilton-hotel-row",
    suggestedAlternativeId: "hamilton-side-lane",
    notes: "Simple for visitors; can clog during dinner peaks."
  },
  {
    id: "hamilton-side-lane",
    marketId: "bermuda",
    name: "Hamilton Side Lane",
    category: "hotel",
    addressHint: "Marked side-lane pickup",
    walkMinutes: 4,
    pickupQualityScore: 87,
    crowdSignalId: "hamilton-hotel-row",
    notes: "Lower pressure and easier driver approach."
  },
  {
    id: "dockyard-terminal",
    marketId: "bermuda",
    name: "Dockyard Terminal Queue",
    category: "cruise-port",
    addressHint: "Cruise terminal taxi queue",
    walkMinutes: 3,
    pickupQualityScore: 69,
    crowdSignalId: "dockyard-cruise",
    suggestedAlternativeId: "dockyard-overflow",
    notes: "High visibility, high crowd pressure."
  },
  {
    id: "dockyard-overflow",
    marketId: "bermuda",
    name: "Dockyard Overflow Shuttle Stand",
    category: "cruise-port",
    addressHint: "Managed overflow stand",
    walkMinutes: 7,
    pickupQualityScore: 81,
    crowdSignalId: "dockyard-cruise",
    notes: "Useful for shuttle routing and group pickups."
  },
  {
    id: "stadium-gate-b",
    marketId: "bermuda",
    name: "Event Gate B",
    category: "event-venue",
    addressHint: "North venue exit",
    walkMinutes: 6,
    pickupQualityScore: 76,
    crowdSignalId: "national-stadium-event",
    notes: "Good split point for post-event pickup flow."
  },
  {
    id: "front-street-west",
    marketId: "bermuda",
    name: "Front Street West",
    category: "downtown-nightlife",
    addressHint: "West nightlife pickup point",
    walkMinutes: 3,
    pickupQualityScore: 79,
    crowdSignalId: "front-street-nightlife",
    notes: "Designed for late-night pickup pressure."
  },
  {
    id: "downtown-core",
    marketId: "global",
    name: "Downtown Transit Core",
    category: "downtown-nightlife",
    addressHint: "Central transport hub",
    walkMinutes: 4,
    pickupQualityScore: 77,
    crowdSignalId: "downtown-demo",
    notes: "Reusable non-Bermuda demo zone."
  }
];

export const rideEstimates: RideEstimate[] = [
  {
    id: "estimate-taxi-airport",
    providerId: "bermuda-taxi",
    marketId: "bermuda",
    pickupZoneId: "bda-airport-curb",
    fareLow: 32,
    fareHigh: 44,
    etaMinutes: 7,
    reliabilityPercent: 91,
    pickupQuality: 4,
    crowdPressureScore: 78,
    recommendation: "best-value",
    tags: ["Licensed", "Good queue visibility", "Pilot priority"]
  },
  {
    id: "estimate-rideshare-airport",
    providerId: "fairshare-rideshare",
    marketId: "bermuda",
    pickupZoneId: "bda-airport-curb",
    fareLow: 29,
    fareHigh: 52,
    etaMinutes: 9,
    reliabilityPercent: 82,
    pickupQuality: 3,
    crowdPressureScore: 81,
    tags: ["Fare can swing", "Pickup zone sensitive"]
  },
  {
    id: "estimate-shuttle-airport",
    providerId: "harbor-shuttle",
    marketId: "bermuda",
    pickupZoneId: "bda-airport-east-lane",
    fareLow: 18,
    fareHigh: 24,
    etaMinutes: 18,
    reliabilityPercent: 78,
    pickupQuality: 4,
    crowdPressureScore: 58,
    tags: ["Cheapest", "Shared route", "Lower pressure"]
  },
  {
    id: "estimate-private-driver",
    providerId: "private-island-driver",
    marketId: "bermuda",
    pickupZoneId: "hamilton-side-lane",
    fareLow: 65,
    fareHigh: 82,
    etaMinutes: 6,
    reliabilityPercent: 94,
    pickupQuality: 5,
    crowdPressureScore: 42,
    recommendation: "fastest-option",
    tags: ["Fastest", "Reserved", "Premium"]
  },
  {
    id: "estimate-local-transport",
    providerId: "local-transport",
    marketId: "bermuda",
    pickupZoneId: "front-street-west",
    fareLow: 5,
    fareHigh: 8,
    etaMinutes: 28,
    reliabilityPercent: 72,
    pickupQuality: 3,
    crowdPressureScore: 55,
    tags: ["Lowest fare", "Walk-to-stop", "Schedule dependent"]
  }
];

export const driverProfiles: DriverProfile[] = [
  {
    id: "driver-001",
    marketId: "bermuda",
    name: "Avery Simmons",
    vehicle: "Taxi 184 - 6 seat van",
    permitId: "BDA-TXI-184",
    licenseStatus: {
      status: "valid",
      expirationDate: "2027-05-31",
      issuingAuthority: "Bermuda Transport Control Department",
      complianceFlags: []
    },
    trainingStatus: "complete",
    queuePosition: 4,
    activePickupCategory: "airport"
  },
  {
    id: "driver-002",
    marketId: "bermuda",
    name: "Morgan Trott",
    vehicle: "Taxi 227 - sedan",
    permitId: "BDA-TXI-227",
    licenseStatus: {
      status: "review-needed",
      expirationDate: "2026-09-15",
      issuingAuthority: "Bermuda Transport Control Department",
      complianceFlags: ["Insurance document review pending"]
    },
    trainingStatus: "in-progress",
    queuePosition: 12,
    activePickupCategory: "cruise-port"
  }
];

export const adminMetrics: AdminMetric[] = [
  {
    id: "metric-demand",
    marketId: "bermuda",
    label: "Live demand pressure",
    value: "High",
    trend: "+18% vs normal",
    tone: "warning",
    description: "Airport arrivals and cruise traffic are overlapping."
  },
  {
    id: "metric-queue",
    marketId: "bermuda",
    label: "Taxi queue health",
    value: "24 active",
    trend: "4 min median turn",
    tone: "good",
    description: "Pilot queue has adequate supply for current airport pressure."
  },
  {
    id: "metric-event",
    marketId: "bermuda",
    label: "Event venue pressure",
    value: "86/100",
    trend: "Peak in 35 min",
    tone: "critical",
    description: "Venue egress needs split pickup zones and shuttle staging."
  },
  {
    id: "metric-compliance",
    marketId: "bermuda",
    label: "Compliance queue",
    value: "3 reviews",
    trend: "2 driver docs, 1 training item",
    tone: "neutral",
    description: "Placeholder review queue for government and operator workflows."
  }
];

export const canyonProjectFields = {
  status: "Pending Definition",
  problem: "Undefined mobility, access, or adjacent platform problem.",
  user: "Unknown target user segment.",
  businessModel: "To be defined separately from FairShare revenue logic.",
  relationship:
    "Canyon remains separate until the problem is validated; it may later consume CrowdSense insights if relevant."
};
