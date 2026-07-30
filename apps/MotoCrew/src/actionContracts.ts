export const primaryNavigation = [
  { screen: 'home', label: 'Home', icon: 'home' },
  { screen: 'rides', label: 'Rides', icon: 'rides' },
  { screen: 'crew', label: 'Crew', icon: 'crew' },
  { screen: 'safety', label: 'Safety', icon: 'safety' },
  { screen: 'profile', label: 'More', icon: 'more' },
] as const

export type PrimaryDestination = (typeof primaryNavigation)[number]['screen']

export const coreActionContracts = [
  { id: 'plan-ride', outcome: 'create', feedback: 'screen-change' },
  { id: 'open-crew', outcome: 'crew', feedback: 'screen-change' },
  { id: 'open-ride', outcome: 'rides', feedback: 'screen-change' },
  { id: 'preview-route', outcome: 'map', feedback: 'screen-change' },
  { id: 'open-checklist', outcome: 'chat', feedback: 'screen-change' },
  { id: 'save-contact', outcome: 'contact-saved', feedback: 'status-message' },
  { id: 'join-ride', outcome: 'membership-updated', feedback: 'status-message' },
  { id: 'save-profile', outcome: 'profile-saved', feedback: 'status-message' },
  { id: 'sign-in', outcome: 'oauth-redirect', feedback: 'loading-or-error' },
] as const

export const intentionallyUnavailableActions = [
  'voice-room',
  'push-to-talk',
  'call-ride-lead',
] as const
