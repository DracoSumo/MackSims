import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { APP_NAME, APP_TAGLINE, BUILD_TARGET, DEFAULT_MARKET, VERSION_LABEL } from './config'
import {
  chats,
  commsModules,
  packMembers,
  permissionModules,
  riderProfile,
  rides,
  roadAwarenessFeatures,
  routes,
} from './data/mockData'
import type {
  DraftRide,
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

type Screen = 'home' | 'rides' | 'map' | 'chat' | 'profile' | 'create'

const navItems: { screen: Exclude<Screen, 'create'>; label: string }[] = [
  { screen: 'home', label: 'Home' },
  { screen: 'rides', label: 'Rides' },
  { screen: 'map', label: 'Map' },
  { screen: 'chat', label: 'Chat' },
  { screen: 'profile', label: 'Profile' },
]

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
  const [activeScreen, setActiveScreen] = useState<Screen>('home')
  const [selectedRideId, setSelectedRideId] = useState(rides[0].id)
  const [joinedRideIds, setJoinedRideIds] = useLocalStorageState<string[]>('motocrew.joinedRideIds', [
    rides[0].id,
  ])
  const [draftRides, setDraftRides] = useLocalStorageState<DraftRide[]>('motocrew.draftRides', [])
  const [rideFilter, setRideFilter] = useState<RideFilter>({ status: 'All', pace: 'All' })
  const [saveMessage, setSaveMessage] = useState('')

  const selectedRide = rides.find((ride) => ride.id === selectedRideId) ?? rides[0]
  const selectedRoute = routes.find((route) => route.id === selectedRide.routeId) ?? routes[0]
  const selectedChat = chats.find((chat) => chat.rideId === selectedRide.id) ?? chats[0]
  const selectedPackMembers = packMembers.filter((member) => member.rideId === selectedRide.id)
  const isJoined = joinedRideIds.includes(selectedRide.id)

  const rideGroups = useMemo(
    () => ({
      upcoming: rides.filter((ride) => ride.category === 'upcoming'),
      featured: rides.filter((ride) => ride.category === 'featured'),
      completed: rides.filter((ride) => ride.category === 'completed'),
    }),
    [],
  )

  const filteredRides = useMemo(
    () =>
      rides.filter((ride) => {
        const statusMatches = rideFilter.status === 'All' || ride.status === rideFilter.status
        const paceMatches = rideFilter.pace === 'All' || ride.pace === rideFilter.pace
        return statusMatches && paceMatches
      }),
    [rideFilter],
  )

  function selectRide(rideId: string, nextScreen: Screen = 'rides') {
    setSelectedRideId(rideId)
    setActiveScreen(nextScreen)
  }

  function toggleJoinRide() {
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
          {activeScreen === 'rides' && (
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
          {activeScreen === 'map' && <MapScreen ride={selectedRide} route={selectedRoute} />}
          {activeScreen === 'chat' && <ChatScreen ride={selectedRide} chat={selectedChat} />}
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
  return (
    <div className="screen-content">
      <section className="hero-panel">
        <p className="eyebrow">Tonight's pack</p>
        <h2>{rideGroups.upcoming[0].name}</h2>
        <p>{rideGroups.upcoming[0].routeSummary}</p>
        <div className="hero-meta">
          <span>{rideGroups.upcoming[0].kickstandsUp}</span>
          <span>{rideGroups.upcoming[0].estimatedMiles} mi</span>
          <StatusPill status={rideGroups.upcoming[0].status} />
        </div>
        <button type="button" className="primary-action" onClick={() => onSelectRide(rideGroups.upcoming[0].id)}>
          Open Ride
        </button>
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
        <button type="button" onClick={() => onNavigate('chat')}>
          Safety
        </button>
      </section>

      <DraftRideCollection drafts={draftRides} onCreate={() => onNavigate('create')} />
      <RideCollection title="Upcoming group rides" rides={rideGroups.upcoming} onSelectRide={onSelectRide} />
      <RideCollection title="Featured local rides" rides={rideGroups.featured} onSelectRide={onSelectRide} />
      <RideCollection title="Recently completed" rides={rideGroups.completed} onSelectRide={onSelectRide} />
    </div>
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

function ChatScreen({ ride, chat }: { ride: Ride; chat: RideChat }) {
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
      </div>
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
