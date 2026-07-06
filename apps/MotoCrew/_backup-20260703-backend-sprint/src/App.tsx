import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  APP_NAME,
  APP_TAGLINE,
  BUILD_TARGET,
  DEFAULT_MARKET,
  DEMO_NOTICE,
  FEEDBACK_EMAIL,
  SAFETY_NOTICE,
  VERSION_LABEL,
} from './config'
import {
  getChatForRide,
  getRideById,
  getRouteForRide,
  listPackMembersForRide,
  listRides,
  localStorageKeys,
} from './services/dataService'
import {
  commsModules,
  permissionModules,
  ridePhases,
  riderProfile,
  roadAwarenessFeatures,
} from './data/mockData'
import type {
  DraftRide,
  EmergencyContact,
  PackMember,
  PermissionModule,
  Ride,
  RideChat,
  RideFilter,
  RidePace,
  RideStatus,
  RoadAwarenessFeature,
  RoutePreview,
} from './types'
import './App.css'

type Screen = 'home' | 'rides' | 'map' | 'chat' | 'safety' | 'profile' | 'create'

const navItems: { screen: Exclude<Screen, 'create'>; label: string }[] = [
  { screen: 'home', label: 'Home' },
  { screen: 'rides', label: 'Rides' },
  { screen: 'map', label: 'Map' },
  { screen: 'chat', label: 'Chat' },
  { screen: 'safety', label: 'Safety' },
  { screen: 'profile', label: 'Profile' },
]

const feedbackMailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
  `${APP_NAME} ${VERSION_LABEL} beta feedback`,
)}`

const rideStatuses: RideStatus[] = ['Planning', 'Open', 'Full', 'Live Soon', 'Completed']
const ridePaces: RidePace[] = ['Relaxed', 'Moderate', 'Spirited', 'Technical']

function statusClassName(status: RideStatus) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

function App() {
  const rides = useMemo(() => listRides(), [])
  const [activeScreen, setActiveScreen] = useState<Screen>('home')
  const [selectedRideId, setSelectedRideId] = useState(() => rides[0]?.id ?? '')
  const [joinedRideIds, setJoinedRideIds] = useLocalStorageState<string[]>(localStorageKeys.joinedRideIds, rides[0]?.id ? [rides[0].id] : [])
  const [draftRides, setDraftRides] = useLocalStorageState<DraftRide[]>(localStorageKeys.draftRides, [])
  const [emergencyContacts, setEmergencyContacts] = useLocalStorageState<EmergencyContact[]>(
    localStorageKeys.emergencyContacts,
    [],
  )
  const [safetyAcknowledged, setSafetyAcknowledged] = useLocalStorageState(
    localStorageKeys.safetyAcknowledged,
    false,
  )
  const [rideFilter, setRideFilter] = useState<RideFilter>({ status: 'All', pace: 'All' })
  const [saveMessage, setSaveMessage] = useState('')

  const selectedRide = getRideById(selectedRideId) ?? rides[0]
  const selectedRoute = selectedRide ? getRouteForRide(selectedRide) : undefined
  const selectedChat = selectedRide ? getChatForRide(selectedRide.id) : undefined
  const selectedPackMembers = selectedRide ? listPackMembersForRide(selectedRide.id) : []
  const isJoined = selectedRide ? joinedRideIds.includes(selectedRide.id) : false

  const rideGroups = useMemo(
    () => ({
      upcoming: rides.filter((ride) => ride.category === 'upcoming'),
      featured: rides.filter((ride) => ride.category === 'featured'),
      completed: rides.filter((ride) => ride.category === 'completed'),
    }),
    [rides],
  )

  const filteredRides = useMemo(
    () =>
      rides.filter((ride) => {
        const statusMatches = rideFilter.status === 'All' || ride.status === rideFilter.status
        const paceMatches = rideFilter.pace === 'All' || ride.pace === rideFilter.pace
        return statusMatches && paceMatches
      }),
    [rideFilter, rides],
  )

  function selectRide(rideId: string, nextScreen: Screen = 'rides') {
    setSelectedRideId(rideId)
    setActiveScreen(nextScreen)
  }

  function toggleJoinRide() {
    if (!selectedRide) return
    setJoinedRideIds((current) =>
      current.includes(selectedRide.id)
        ? current.filter((rideId) => rideId !== selectedRide.id)
        : [...current, selectedRide.id],
    )
  }

  function handleCreateRide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') || 'Untitled ride draft')
    const draft: DraftRide = {
      id: `draft-${Date.now()}`,
      title,
      dateTime: String(formData.get('dateTime') || 'Unscheduled'),
      meetSpot: String(formData.get('meetSpot') || 'Meet spot TBD'),
      routeType: String(formData.get('routeType') || 'Backroads'),
      pace: String(formData.get('pace') || 'Moderate') as RidePace,
      visibility: String(formData.get('visibility') || 'Pack invite'),
      notes: String(formData.get('notes') || 'No notes yet'),
      savedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    }

    setDraftRides((current) => [draft, ...current].slice(0, 8))
    setSaveMessage(`${title} saved locally as a draft. No backend is connected yet.`)
    event.currentTarget.reset()
  }

  return (
    <main className="app-shell">
      <DesktopRail activeScreen={activeScreen} onNavigate={setActiveScreen} />

      <section className="phone-stage" aria-label={`${APP_NAME} app shell`}>
        {!safetyAcknowledged && (
          <div className="safety-gate" role="alertdialog" aria-label="Rider safety notice">
            <p className="eyebrow">Before you tap anything</p>
            <h2>Do not use {APP_NAME} while riding.</h2>
            <p>{SAFETY_NOTICE}</p>
            <p className="subtle-copy">{DEMO_NOTICE}</p>
            <button
              type="button"
              className="primary-action"
              onClick={() => setSafetyAcknowledged(true)}
            >
              I understand — I am not riding right now
            </button>
          </div>
        )}
        <header className="app-header">
          <div>
            <p className="eyebrow">{DEFAULT_MARKET}</p>
            <h1>{APP_NAME}</h1>
            <p className="tagline">{APP_TAGLINE}</p>
          </div>
          <div className="build-pill">
            <span>{VERSION_LABEL}</span>
            <span>{BUILD_TARGET}</span>
          </div>
        </header>

        <div className="screen-stack">
          {activeScreen === 'home' && (
            <HomeScreen
              draftRides={draftRides}
              rideGroups={rideGroups}
              onNavigate={setActiveScreen}
              onSelectRide={selectRide}
            />
          )}
          {activeScreen === 'rides' && selectedRide && (
            <RideScreen
              draftCount={draftRides.length}
              filter={rideFilter}
              packMembers={selectedPackMembers}
              rides={filteredRides}
              selectedRide={selectedRide}
              isJoined={isJoined}
              onFilterChange={setRideFilter}
              onSelectRide={selectRide}
              onToggleJoin={toggleJoinRide}
              onOpenMap={() => setActiveScreen('map')}
              onCreate={() => setActiveScreen('create')}
            />
          )}
          {activeScreen === 'rides' && !selectedRide && (
            <EmptyRideState message="No rides loaded in this demo shell." onBrowse={() => setActiveScreen('create')} />
          )}
          {activeScreen === 'map' && selectedRide && selectedRoute && (
            <MapScreen ride={selectedRide} route={selectedRoute} />
          )}
          {activeScreen === 'map' && (!selectedRide || !selectedRoute) && (
            <EmptyRideState message="Select a ride with a route preview to open the map." onBrowse={() => setActiveScreen('rides')} />
          )}
          {activeScreen === 'chat' && selectedRide && (
            <ChatScreen ride={selectedRide} chat={selectedChat} />
          )}
          {activeScreen === 'safety' && (
            <SafetyScreen contacts={emergencyContacts} onContactsChange={setEmergencyContacts} />
          )}
          {activeScreen === 'profile' && (
            <ProfileScreen
              permissionItems={permissionModules}
              onCreate={() => setActiveScreen('create')}
            />
          )}
          {activeScreen === 'create' && (
            <CreateRideScreen
              draftRides={draftRides}
              saveMessage={saveMessage}
              onSubmit={handleCreateRide}
              onBack={() => setActiveScreen('rides')}
            />
          )}
          <footer className="app-footer">
            <p className="safety-footer-line">{SAFETY_NOTICE}</p>
            <p>{DEMO_NOTICE}</p>
            <p>
              Beta tester? <a href={feedbackMailto}>Email feedback to {FEEDBACK_EMAIL}</a>
            </p>
          </footer>
        </div>

        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      </section>
    </main>
  )
}

function DesktopRail({
  activeScreen,
  onNavigate,
}: {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}) {
  return (
    <aside className="desktop-rail" aria-label="Primary navigation">
      <div>
        <span className="brand-mark">MC</span>
        <p>{APP_NAME}</p>
      </div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item.screen}
            type="button"
            className={activeScreen === item.screen ? 'active' : ''}
            onClick={() => onNavigate(item.screen)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button type="button" className="rail-action" onClick={() => onNavigate('create')}>
        Create Ride
      </button>
    </aside>
  )
}

function HomeScreen({
  draftRides,
  rideGroups,
  onNavigate,
  onSelectRide,
}: {
  draftRides: DraftRide[]
  rideGroups: {
    upcoming: Ride[]
    featured: Ride[]
    completed: Ride[]
  }
  onNavigate: (screen: Screen) => void
  onSelectRide: (rideId: string, nextScreen?: Screen) => void
}) {
  const spotlight = rideGroups.upcoming[0]

  return (
    <div className="screen-content">
      <section className="hero-panel">
        <p className="eyebrow">Tonight&apos;s pack</p>
        {spotlight ? (
          <>
            <h2>{spotlight.name}</h2>
            <p>{spotlight.routeSummary}</p>
            <div className="hero-meta">
              <span>{spotlight.kickstandsUp}</span>
              <span>{spotlight.estimatedMiles} mi</span>
              <StatusPill status={spotlight.status} />
            </div>
            <button type="button" className="primary-action" onClick={() => onSelectRide(spotlight.id)}>
              Open Ride
            </button>
          </>
        ) : (
          <>
            <h2>No upcoming rides</h2>
            <p>Create a local draft or browse open rides to get started.</p>
            <button type="button" className="primary-action" onClick={() => onNavigate('create')}>
              Create Ride Draft
            </button>
          </>
        )}
      </section>

      <section className="quick-actions" aria-label="Quick actions">
        <button type="button" onClick={() => onNavigate('create')}>
          Create Ride
        </button>
        <button type="button" onClick={() => onNavigate('rides')}>
          Find Ride
        </button>
        <button type="button" onClick={() => onNavigate('profile')}>
          My Pack
        </button>
        <button type="button" onClick={() => onNavigate('safety')}>
          Safety
        </button>
      </section>

      <RidePhaseCard />

      <DraftRideCollection drafts={draftRides} onCreate={() => onNavigate('create')} />
      <RideCollection title="Upcoming group rides" rides={rideGroups.upcoming} onSelectRide={onSelectRide} />
      <RideCollection title="Featured local rides" rides={rideGroups.featured} onSelectRide={onSelectRide} />
      <RideCollection title="Recently completed" rides={rideGroups.completed} onSelectRide={onSelectRide} />
    </div>
  )
}

function RidePhaseCard() {
  const currentPhase = ridePhases.find((phase) => phase.state === 'current') ?? ridePhases[0]

  return (
    <section className="phase-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ride status — demo data</p>
          <h2>{currentPhase.label}</h2>
        </div>
        <span className="offline-pill">Not live</span>
      </div>
      <p className="subtle-copy">{currentPhase.detail}</p>
      <div className="phase-rail" aria-label="Ride phases">
        {ridePhases.map((phase) => (
          <div key={phase.id} className={`phase-step ${phase.state}`}>
            <span className="phase-dot" aria-hidden="true" />
            <strong>{phase.label}</strong>
            <span className="phase-eta">{phase.etaLabel}</span>
          </div>
        ))}
      </div>
      <p className="future-note">
        Statuses and ETAs above are mocked. Live pack status requires GPS, a backend, and a ride
        session service that are not connected in this beta.
      </p>
    </section>
  )
}

function DraftRideCollection({ drafts, onCreate }: { drafts: DraftRide[]; onCreate?: () => void }) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <h2>Local ride drafts</h2>
        {onCreate ? (
          <button type="button" className="compact-action" onClick={onCreate}>
            New
          </button>
        ) : (
          <span>{drafts.length}</span>
        )}
      </div>
      {drafts.length === 0 ? (
        <p className="empty-state">Saved draft rides will live here locally until backend storage is added.</p>
      ) : (
        <div className="draft-grid">
          {drafts.map((draft) => (
            <article key={draft.id} className="draft-card">
              <span>{draft.visibility}</span>
              <h3>{draft.title}</h3>
              <p>{draft.meetSpot}</p>
              <div className="mini-meta">
                <span>{draft.dateTime}</span>
                <span>{draft.pace}</span>
                <span>{draft.routeType}</span>
              </div>
              <p className="feature-note">{draft.notes}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function RideCollection({
  title,
  rides: collection,
  onSelectRide,
}: {
  title: string
  rides: Ride[]
  onSelectRide: (rideId: string, nextScreen?: Screen) => void
}) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <h2>{title}</h2>
        <span>{collection.length}</span>
      </div>
      <div className="ride-grid">
        {collection.map((ride) => (
          <RideCard key={ride.id} ride={ride} onSelectRide={onSelectRide} />
        ))}
      </div>
    </section>
  )
}

function RideCard({
  ride,
  onSelectRide,
}: {
  ride: Ride
  onSelectRide: (rideId: string, nextScreen?: Screen) => void
}) {
  return (
    <article className="ride-card">
      <div className="card-topline">
        <StatusPill status={ride.status} />
        <span>{ride.estimatedMiles} mi</span>
      </div>
      <h3>{ride.name}</h3>
      <p>{ride.routeSummary}</p>
      <div className="mini-meta">
        <span>{ride.kickstandsUp}</span>
        <span>{ride.pace}</span>
        <span>
          {ride.riderCount}/{ride.riderLimit} riders
        </span>
      </div>
      {ride.featuredReason && <p className="feature-note">{ride.featuredReason}</p>}
      <button type="button" className="text-action" onClick={() => onSelectRide(ride.id)}>
        View details
      </button>
    </article>
  )
}

function RideScreen({
  draftCount,
  filter,
  packMembers: selectedPackMembers,
  rides: rideList,
  selectedRide,
  isJoined,
  onFilterChange,
  onSelectRide,
  onToggleJoin,
  onOpenMap,
  onCreate,
}: {
  draftCount: number
  filter: RideFilter
  packMembers: PackMember[]
  rides: Ride[]
  selectedRide: Ride
  isJoined: boolean
  onFilterChange: (filter: RideFilter) => void
  onSelectRide: (rideId: string, nextScreen?: Screen) => void
  onToggleJoin: () => void
  onOpenMap: () => void
  onCreate: () => void
}) {
  return (
    <div className="screen-content">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Ride detail</h2>
            <p className="subtle-copy">{draftCount} local drafts saved</p>
          </div>
          <button type="button" className="compact-action" onClick={onCreate}>
            Create
          </button>
        </div>
        <RideFilterBar filter={filter} onChange={onFilterChange} />
        <div className="ride-selector" aria-label="Select ride">
          {rideList.length === 0 ? (
            <p className="empty-state">No rides match this filter yet.</p>
          ) : (
            rideList.map((ride) => (
              <button
                key={ride.id}
                type="button"
                className={ride.id === selectedRide.id ? 'active' : ''}
                onClick={() => onSelectRide(ride.id, 'rides')}
              >
                {ride.name}
              </button>
            ))
          )}
        </div>
      </section>

      <article className="detail-card">
        <div className="detail-header">
          <div>
            <StatusPill status={selectedRide.status} />
            <h2>{selectedRide.name}</h2>
            <p>Hosted by {selectedRide.host}</p>
          </div>
          <button
            type="button"
            className={isJoined ? 'secondary-action' : 'primary-action'}
            onClick={onToggleJoin}
            disabled={selectedRide.status === 'Completed'}
          >
            {selectedRide.status === 'Completed' ? 'Completed' : isJoined ? 'Leave Ride' : 'Join Ride'}
          </button>
        </div>

        <dl className="detail-list">
          <div>
            <dt>Meet location</dt>
            <dd>{selectedRide.meetLocation}</dd>
          </div>
          <div>
            <dt>Kickstands-up</dt>
            <dd>{selectedRide.kickstandsUp}</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{selectedRide.routeSummary}</dd>
          </div>
          <div>
            <dt>Estimated miles</dt>
            <dd>{selectedRide.estimatedMiles}</dd>
          </div>
          <div>
            <dt>Difficulty and pace</dt>
            <dd>
              {selectedRide.difficulty} / {selectedRide.pace}
            </dd>
          </div>
          <div>
            <dt>Riders</dt>
            <dd>
              {selectedRide.riderCount}/{selectedRide.riderLimit}
            </dd>
          </div>
        </dl>

        <PackRoster members={selectedPackMembers} />

        <div className="safety-notes">
          <h3>Safety notes</h3>
          <ul>
            {selectedRide.safetyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <StatusRail activeStatus={selectedRide.status} />
        <button type="button" className="secondary-action wide-action" onClick={onOpenMap}>
          Preview Route
        </button>
      </article>
    </div>
  )
}

function RideFilterBar({ filter, onChange }: { filter: RideFilter; onChange: (filter: RideFilter) => void }) {
  return (
    <div className="filter-bar" aria-label="Ride filters">
      <label>
        Status
        <select
          value={filter.status}
          onChange={(event) => onChange({ ...filter, status: event.target.value as RideFilter['status'] })}
        >
          <option>All</option>
          {rideStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>
      <label>
        Pace
        <select
          value={filter.pace}
          onChange={(event) => onChange({ ...filter, pace: event.target.value as RideFilter['pace'] })}
        >
          <option>All</option>
          {ridePaces.map((pace) => (
            <option key={pace}>{pace}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

function PackRoster({ members }: { members: PackMember[] }) {
  return (
    <section className="pack-roster">
      <div className="section-heading">
        <h3>Pack roster</h3>
        <span>{members.length}</span>
      </div>
      {members.length === 0 ? (
        <p className="empty-state">Lead, sweep, and rider roles will appear here as the pack forms.</p>
      ) : (
        <div className="member-list">
          {members.map((member) => (
            <article key={member.id} className="member-row">
              <div>
                <strong>{member.name}</strong>
                <span>{member.bike}</span>
              </div>
              <div>
                <span>{member.role}</span>
                <StatusText value={member.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function StatusText({ value }: { value: string }) {
  return <span className="status-text">{value}</span>
}

function StatusRail({ activeStatus }: { activeStatus: RideStatus }) {
  return (
    <div className="status-rail" aria-label="Ride status tags">
      {rideStatuses.map((status) => (
        <span
          key={status}
          className={`status-pill ${statusClassName(status)} ${status === activeStatus ? 'is-active' : ''}`}
        >
          {status}
        </span>
      ))}
    </div>
  )
}

function StatusPill({ status }: { status: RideStatus }) {
  return <span className={`status-pill ${statusClassName(status)}`}>{status}</span>
}

function MapScreen({ ride, route }: { ride: Ride; route: RoutePreview }) {
  return (
    <div className="screen-content">
      <section className="route-preview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Mock route preview</p>
            <h2>{ride.name}</h2>
          </div>
          <StatusPill status={ride.status} />
        </div>

        <div className="map-placeholder" role="img" aria-label="Map placeholder">
          <div className="map-placeholder-grid" aria-hidden="true" />
          <div className="map-placeholder-copy">
            <strong>Map view not configured</strong>
            <p>
              Live maps require a map provider and API key (Mapbox, Google Maps, or an
              OpenStreetMap stack). No key is bundled with this beta, so the panel below shows the
              mocked route outline instead.
            </p>
          </div>
        </div>

        <div className="mock-map" aria-label="Mock route line">
          {route.segments.map((segment, index) => (
            <div key={segment} className="route-stop">
              <span>{index + 1}</span>
              <p>{segment}</p>
            </div>
          ))}
        </div>

        <div className="route-stats">
          <InfoTile label="Start" value={route.startPoint} />
          <InfoTile label="Midpoint" value={route.midpoint} />
          <InfoTile label="End" value={route.endPoint} />
          <InfoTile label="Distance" value={`${route.distanceMiles} miles`} />
          <InfoTile label="Ride time" value={route.estimatedRideTime} />
          <InfoTile label="Road type" value={route.roadType} />
        </div>

        <p className="future-note">Real maps and live route sharing will come later. This panel uses mocked route data only.</p>
      </section>

      <RoadAwarenessPanel features={roadAwarenessFeatures} />
    </div>
  )
}

function RoadAwarenessPanel({ features }: { features: RoadAwarenessFeature[] }) {
  return (
    <section className="awareness-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Road awareness</p>
          <h2>Paid alert concepts</h2>
        </div>
      </div>
      <p className="subtle-copy">
        These are placeholders for legal, regional, and safety-reviewed alerts. No speed, camera, or enforcement data is active.
      </p>
      <div className="module-list">
        {features.map((feature) => (
          <article key={feature.id} className="module-card">
            <span>{feature.tier}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <StatusText value={feature.status} />
          </article>
        ))}
      </div>
    </section>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function EmptyRideState({ message, onBrowse }: { message: string; onBrowse: () => void }) {
  return (
    <div className="screen-content">
      <section className="hero-panel">
        <p className="eyebrow">Nothing to show</p>
        <h2>Ride not available</h2>
        <p>{message}</p>
        <button type="button" className="primary-action" onClick={onBrowse}>
          Browse rides
        </button>
      </section>
    </div>
  )
}

function ChatScreen({ ride, chat }: { ride: Ride; chat?: RideChat }) {
  if (!chat) {
    return (
      <div className="screen-content">
        <section className="chat-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pack chat mock</p>
              <h2>{ride.name}</h2>
            </div>
            <span className="offline-pill">Not live</span>
          </div>
          <p className="subtle-copy">
            No mock chat thread is loaded for this ride yet. Messaging is simulated only — not connected to a backend.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="screen-content">
      <section className="chat-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pack chat mock</p>
            <h2>{ride.name}</h2>
          </div>
          <span className="offline-pill">Not live</span>
        </div>

        <div className="announcement">
          <span>Host announcement</span>
          <p>{chat.announcement}</p>
        </div>

        <div className="message-list">
          {chat.messages.map((message) => (
            <article key={message.id} className={`message-bubble ${message.role}`}>
              <div>
                <strong>{message.author}</strong>
                <span>{message.time}</span>
              </div>
              <p>{message.text}</p>
            </article>
          ))}
        </div>

        <div className="checklist">
          <h3>Pre-ride checklist</h3>
          {chat.checklist.map((item) => (
            <label key={item.id}>
              <input type="checkbox" checked={item.complete} readOnly />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        <div className="mock-input">
          <input type="text" placeholder="Real-time messaging is not connected in this shell" disabled />
          <button type="button" disabled>
            Send
          </button>
        </div>
      </section>

      <CommsPanel />
    </div>
  )
}

function CommsPanel() {
  return (
    <section className="comms-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Comms / Intercom</p>
          <h2>Planned ride audio modules</h2>
        </div>
        <span className="offline-pill">Not live</span>
      </div>
      <div className="comms-mock-controls" aria-label="Intercom placeholder controls">
        <button type="button" disabled>
          Join Voice Room (demo)
        </button>
        <button type="button" disabled>
          Push-to-Talk (demo)
        </button>
        <button type="button" disabled>
          Call Ride Lead (demo)
        </button>
      </div>
      <p className="future-note">
        These controls are placeholders only. No voice, intercom, or calling is connected in this
        beta build.
      </p>
      <div className="module-list">
        {commsModules.map((module) => (
          <article key={module.id} className="module-card">
            <span>{module.status}</span>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SafetyScreen({
  contacts,
  onContactsChange,
}: {
  contacts: EmergencyContact[]
  onContactsChange: (updater: (current: EmergencyContact[]) => EmergencyContact[]) => void
}) {
  const [formError, setFormError] = useState('')

  function handleAddContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('contactName') || '').trim()
    const phone = String(formData.get('contactPhone') || '').trim()

    if (!name || !phone) {
      setFormError('Name and phone number are both required.')
      return
    }

    const contact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name,
      relation: String(formData.get('contactRelation') || 'Contact').trim() || 'Contact',
      phone,
    }

    onContactsChange((current) => [...current, contact].slice(0, 6))
    setFormError('')
    event.currentTarget.reset()
  }

  function removeContact(contactId: string) {
    onContactsChange((current) => current.filter((contact) => contact.id !== contactId))
  }

  return (
    <div className="screen-content">
      <section className="safety-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rider safety</p>
            <h2>Ride smart, ride home</h2>
          </div>
        </div>
        <p className="danger-note">
          {APP_NAME} does <strong>not</strong> dispatch emergency services and has no live
          emergency features. In a real emergency, call 911 (or your local emergency number)
          directly.
        </p>
        <p className="safety-footer-line">{SAFETY_NOTICE}</p>
        <ul className="safety-list">
          <li>Set up rides, contacts, and routes before you put your helmet on.</li>
          <li>Phone stays mounted or pocketed while the wheels are turning.</li>
          <li>Agree on hand signals and regroup points at the pre-ride brief.</li>
          <li>Ride your own ride — never chase the pack beyond your skill.</li>
        </ul>
      </section>

      <section className="contacts-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Emergency contacts</p>
            <h2>Your contact list</h2>
          </div>
          <span>{contacts.length}/6</span>
        </div>
        <p className="subtle-copy">
          Stored only on this device (localStorage). This list is a reference for you and your ride
          lead — nothing is transmitted anywhere.
        </p>

        {contacts.length === 0 ? (
          <p className="empty-state">
            No emergency contacts saved yet. Add one below so your pack knows who to call.
          </p>
        ) : (
          <div className="member-list">
            {contacts.map((contact) => (
              <article key={contact.id} className="member-row">
                <div>
                  <strong>{contact.name}</strong>
                  <span>{contact.relation}</span>
                </div>
                <div>
                  <span>{contact.phone}</span>
                  <button
                    type="button"
                    className="text-action danger-action"
                    onClick={() => removeContact(contact.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <form className="ride-form" onSubmit={handleAddContact}>
          <label>
            Name
            <input name="contactName" type="text" placeholder="Sam Rivera" required />
          </label>
          <label>
            Relation
            <input name="contactRelation" type="text" placeholder="Partner, parent, friend" />
          </label>
          <label>
            Phone
            <input name="contactPhone" type="tel" placeholder="555-014-2233" required />
          </label>
          <button type="submit" className="secondary-action full-span">
            Save Contact Locally
          </button>
        </form>
        {formError && <p className="danger-note">{formError}</p>}
      </section>

      <section className="feedback-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Beta testing</p>
            <h2>Tell us what broke</h2>
          </div>
        </div>
        <p className="subtle-copy">
          Found a bug, confusing screen, or missing safety copy? Send it over — every note shapes
          the next build.
        </p>
        <a className="primary-action link-action" href={feedbackMailto}>
          Email {FEEDBACK_EMAIL}
        </a>
      </section>
    </div>
  )
}

function ProfileScreen({
  permissionItems,
  onCreate,
}: {
  permissionItems: PermissionModule[]
  onCreate: () => void
}) {
  return (
    <div className="screen-content">
      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          MC
        </div>
        <div>
          <p className="eyebrow">Rider profile</p>
          <h2>{riderProfile.name}</h2>
          <p>{riderProfile.ridingStyle}</p>
        </div>
        <dl className="detail-list compact">
          <div>
            <dt>Bike</dt>
            <dd>{riderProfile.bike}</dd>
          </div>
          <div>
            <dt>Home area</dt>
            <dd>{riderProfile.homeArea}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{riderProfile.experienceLevel}</dd>
          </div>
          <div>
            <dt>Emergency contact</dt>
            <dd>{riderProfile.emergencyContact}</dd>
          </div>
        </dl>
      </section>

      <section className="garage-card">
        <div className="section-heading">
          <h2>Garage</h2>
          <button type="button" className="compact-action" onClick={onCreate}>
            Plan ride
          </button>
        </div>
        <div className="bike-plate">
          <span>{riderProfile.garage.year}</span>
          <strong>
            {riderProfile.garage.make} {riderProfile.garage.model}
          </strong>
        </div>
        <p>{riderProfile.garage.setup}</p>
        <p className="future-note">{riderProfile.garage.range}</p>
      </section>

      <SettingsPanel items={permissionItems} />

      <section className="section-block">
        <div className="section-heading">
          <h2>Recent rides</h2>
          <span>{riderProfile.recentRides.length}</span>
        </div>
        <div className="recent-list">
          {riderProfile.recentRides.map((ride) => (
            <span key={ride}>{ride}</span>
          ))}
        </div>
      </section>
    </div>
  )
}

function SettingsPanel({ items }: { items: PermissionModule[] }) {
  return (
    <section className="settings-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Settings</p>
          <h2>Future permissions</h2>
        </div>
      </div>
      <div className="module-list">
        {items.map((item) => (
          <article key={item.id} className="module-card">
            <span>{item.status}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function CreateRideScreen({
  draftRides,
  saveMessage,
  onSubmit,
  onBack,
}: {
  draftRides: DraftRide[]
  saveMessage: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onBack: () => void
}) {
  return (
    <div className="screen-content">
      <section className="create-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Mock create flow</p>
            <h2>Create ride</h2>
          </div>
          <button type="button" className="compact-action" onClick={onBack}>
            Back
          </button>
        </div>

        <form className="ride-form" onSubmit={onSubmit}>
          <label>
            Ride title
            <input name="title" type="text" placeholder="Saturday ridge loop" required />
          </label>
          <label>
            Date and time
            <input name="dateTime" type="datetime-local" />
          </label>
          <label>
            Meet spot
            <input name="meetSpot" type="text" placeholder="Fuel stop or landmark" />
          </label>
          <label>
            Route type
            <select name="routeType" defaultValue="Backroads">
              <option>Backroads</option>
              <option>Coastal loop</option>
              <option>Mountain route</option>
              <option>City night loop</option>
            </select>
          </label>
          <label>
            Pace
            <select name="pace" defaultValue="Moderate">
              <option>Relaxed</option>
              <option>Moderate</option>
              <option>Spirited</option>
              <option>Technical</option>
            </select>
          </label>
          <label>
            Visibility
            <select name="visibility" defaultValue="Pack invite">
              <option>Pack invite</option>
              <option>Local riders</option>
              <option>Private draft</option>
            </select>
          </label>
          <label className="full-span">
            Notes
            <textarea name="notes" placeholder="Safety notes, fuel stops, road condition, rider expectations" />
          </label>
          <button type="submit" className="primary-action full-span">
            Save Mock Ride
          </button>
        </form>

        {saveMessage && <p className="save-message">{saveMessage}</p>}
      </section>

      <DraftRideCollection drafts={draftRides} />
    </div>
  )
}

function BottomNav({
  activeScreen,
  onNavigate,
}: {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <button
          key={item.screen}
          type="button"
          className={activeScreen === item.screen ? 'active' : ''}
          onClick={() => onNavigate(item.screen)}
        >
          <span aria-hidden="true">{item.label.slice(0, 1)}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export default App
