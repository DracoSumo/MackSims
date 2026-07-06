export type RideStatus = 'Planning' | 'Open' | 'Full' | 'Live Soon' | 'Completed'

export type RideCategory = 'upcoming' | 'featured' | 'completed'

export type RidePace = 'Relaxed' | 'Moderate' | 'Spirited' | 'Technical'

export type RideDifficulty = 'Easy' | 'Intermediate' | 'Advanced'

export type RideFilter = {
  status: RideStatus | 'All'
  pace: RidePace | 'All'
}

export type Ride = {
  id: string
  name: string
  host: string
  meetLocation: string
  kickstandsUp: string
  routeSummary: string
  estimatedMiles: number
  pace: RidePace
  difficulty: RideDifficulty
  riderCount: number
  riderLimit: number
  safetyNotes: string[]
  status: RideStatus
  category: RideCategory
  routeId: string
  featuredReason?: string
}

export type RoutePreview = {
  id: string
  rideId: string
  startPoint: string
  midpoint: string
  endPoint: string
  distanceMiles: number
  estimatedRideTime: string
  roadType: string
  segments: string[]
}

export type DraftRide = {
  id: string
  title: string
  dateTime: string
  meetSpot: string
  routeType: string
  pace: RidePace
  visibility: string
  notes: string
  savedAt: string
}

export type PackMember = {
  id: string
  rideId: string
  name: string
  role: 'Lead' | 'Sweep' | 'Rider'
  bike: string
  status: 'Confirmed' | 'Pending' | 'Maybe'
}

export type PermissionModule = {
  id: string
  title: string
  status: string
  description: string
}

export type RoadAwarenessFeature = {
  id: string
  title: string
  tier: 'Free' | 'Plus' | 'Pro'
  status: string
  description: string
}

export type ChatMessage = {
  id: string
  author: string
  role: 'host' | 'rider'
  time: string
  text: string
}

export type RideChat = {
  rideId: string
  announcement: string
  messages: ChatMessage[]
  checklist: {
    id: string
    label: string
    complete: boolean
  }[]
}

export type CommsModule = {
  id: string
  title: string
  status: string
  description: string
}

export type GarageBike = {
  year: string
  make: string
  model: string
  setup: string
  range: string
}

export type RidePhaseId = 'staging' | 'rolling' | 'regroup' | 'fuel' | 'complete'

export type RidePhase = {
  id: RidePhaseId
  label: string
  detail: string
  etaLabel: string
  state: 'done' | 'current' | 'upcoming'
}

export type EmergencyContact = {
  id: string
  name: string
  relation: string
  phone: string
}

export type RiderProfile = {
  name: string
  bike: string
  ridingStyle: string
  homeArea: string
  experienceLevel: string
  emergencyContact: string
  recentRides: string[]
  garage: GarageBike
}
