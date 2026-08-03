import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AdminMetricCard } from "./components/AdminMetricCard";
import { CrowdMeterCard } from "./components/CrowdMeterCard";
import { DriverStatusCard } from "./components/DriverStatusCard";
import { FareComparisonPanel } from "./components/FareComparisonPanel";
import { MarketModeBadge } from "./components/MarketModeBadge";
import { PickupSuggestionCard } from "./components/PickupSuggestionCard";
import { RecentTrips } from "./components/RecentTrips";
import { RideProviderCard } from "./components/RideProviderCard";
import { TripSearchForm } from "./components/TripSearchForm";
import {
  adminMetrics,
  canyonProjectFields,
  crowdSignals,
  driverProfiles,
  marketConfigs,
  pickupZones,
  rideEstimates
} from "./data/mockData";
import type { MarketConfig, PickupZone, SortMode } from "./data/types";
import { copyText, exportAggregatePilotCsv } from "./lib/exportReports";
import {
  loadFavoriteZoneIds,
  loadSettings,
  saveSettings,
  saveTrip,
  toggleFavoriteZone,
  type UserSettings
} from "./lib/localStore";
import { integrationRoadmap } from "./services/integrationHooks";
import { toTitleCase } from "./lib/format";
import {
  getCrowdSignal,
  getPickupZone,
  getProvider,
  getRecommendation,
  getSuggestedPickupZone,
  sortEstimates
} from "./lib/selectors";

type Navigate = (href: string) => void;

const getLocationKey = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

function focusLocationTarget() {
  const encodedHash = window.location.hash.replace(/^#/, "");
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  if (!encodedHash) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  let hash = encodedHash;
  try {
    hash = decodeURIComponent(encodedHash);
  } catch {
    // Keep the literal hash when it contains malformed URL encoding.
  }

  window.requestAnimationFrame(() => {
    const target = document.getElementById(hash);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior, block: "start" });
  });
}

const routeTitles: Record<string, string> = {
  "/": "Curbcue",
  "/compare": "Compare Rides",
  "/crowd-meter": "CrowdMeter",
  "/admin": "Operator Dashboard",
  "/admin/bermuda": "Bermuda Taxi Pilot",
  "/driver": "Driver Console",
  "/government": "Government View",
  "/canyon": "Canyon Project",
  "/settings": "Settings"
};

export function App() {
  const [locationKey, setLocationKey] = useState(getLocationKey);

  useEffect(() => {
    const handleLocationChange = () => setLocationKey(getLocationKey());
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const navigate = (href: string) => {
    window.history.pushState({}, "", href);
    const nextLocationKey = getLocationKey();
    if (nextLocationKey === locationKey) {
      focusLocationTarget();
      return;
    }
    setLocationKey(nextLocationKey);
  };

  const currentPath = window.location.pathname;

  useEffect(() => {
    document.title = `${routeTitles[currentPath] ?? "Curbcue"} | Know the ride before you book`;
  }, [currentPath, locationKey]);

  useEffect(() => {
    focusLocationTarget();
  }, [locationKey]);

  const page = useMemo(() => {
    switch (currentPath) {
      case "/compare":
        return <ComparePage navigate={navigate} />;
      case "/crowd-meter":
        return <CrowdMeterPage />;
      case "/admin":
        return <AdminPage />;
      case "/admin/bermuda":
        return <BermudaAdminPage />;
      case "/driver":
        return <DriverPage />;
      case "/government":
        return <GovernmentPage />;
      case "/canyon":
        return <CanyonPage />;
      case "/settings":
        return <SettingsPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  }, [currentPath, locationKey]);

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate}>
      {page}
    </AppShell>
  );
}

function getBermudaMarket(): MarketConfig {
  return marketConfigs.find((market) => market.id === "bermuda") ?? marketConfigs[0];
}

function buildCompareHref({ pickup, dropoff, zoneId }: { pickup: string; dropoff: string; zoneId: string }) {
  const params = new URLSearchParams({ pickup, dropoff, zone: zoneId });
  return `/compare?${params.toString()}`;
}

function openCompare(navigate: Navigate, params: { pickup: string; dropoff: string; zoneId: string }) {
  saveTrip(params);
  navigate(buildCompareHref(params));
}

function VenueExitPack({ navigate }: { navigate: Navigate }) {
  const [shareStatus, setShareStatus] = useState("");
  const venueZones = pickupZones.filter(
    (zone) =>
      zone.marketId === "bermuda" &&
      (zone.category === "event-venue" || zone.category === "downtown-nightlife")
  );

  const shareGuestExit = async (zone: PickupZone) => {
    const href = buildCompareHref({
      pickup: zone.name,
      dropoff: "Hamilton hotel district",
      zoneId: zone.id
    });
    const url = `${window.location.origin}${href}`;
    const message = `Leaving ${zone.name}? Compare ride options before you book:\n${url}`;
    const ok = await copyText(message);
    setShareStatus(ok ? `Guest message copied for ${zone.name}` : "Copy failed — share the compare link from the address bar");
    window.setTimeout(() => setShareStatus(""), 2800);
  };

  return (
    <section className="panel venue-exit-pack">
      <div className="section-heading">
        <p className="eyebrow">Venue guest exit</p>
        <h2>Send guests a smarter way home</h2>
        <p>
          Built for event and nightlife hosts: one tap opens a demo fare compare from the venue curb, and
          another copies a guest-ready message they can text or post at the door.
        </p>
      </div>
      <div className="card-grid">
        {venueZones.map((zone) => {
          const signal = getCrowdSignal(zone.crowdSignalId);
          return (
            <article className="mini-card" key={zone.id}>
              <span>{toTitleCase(zone.category)}</span>
              <strong>{zone.name}</strong>
              <p>
                {signal ? `${signal.level} crowd · pickup pressure ${signal.pickupPressureScore}` : zone.notes}
              </p>
              <div className="venue-exit-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    openCompare(navigate, {
                      pickup: zone.name,
                      dropoff: "Hamilton hotel district",
                      zoneId: zone.id
                    })
                  }
                >
                  Guest exit compare
                </button>
                <button type="button" className="ghost-button" onClick={() => void shareGuestExit(zone)}>
                  Copy guest message
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {shareStatus ? (
        <p className="share-status" role="status" aria-live="polite">
          {shareStatus}
        </p>
      ) : null}
    </section>
  );
}

function HomePage({ navigate }: { navigate: Navigate }) {
  const market = getBermudaMarket();
  const spotlightSignal = crowdSignals.find((signal) => signal.id === "bda-airport-arrivals") ?? crowdSignals[0];
  const spotlightZone = getPickupZone("bda-airport-curb") as PickupZone;
  const suggestedZone = getSuggestedPickupZone(spotlightZone);
  const [favorites, setFavorites] = useState(() => loadFavoriteZoneIds());

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="hero-copy">
          <MarketModeBadge market={market} />
          <h1>Curbcue</h1>
          <p className="hero-tagline">Know the ride before you book.</p>
          <p>
            Compare rides, spot surge pressure, and find smarter pickup options before prices jump.
          </p>
        </div>
        <TripSearchForm onSubmit={(params) => openCompare(navigate, params)} />
      </section>

      <RecentTrips
        onOpenTrip={(trip) =>
          openCompare(navigate, { pickup: trip.pickup, dropoff: trip.dropoff, zoneId: trip.zoneId })
        }
      />

      <VenueExitPack navigate={navigate} />

      <section className="split-layout">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Platform order</p>
            <h2>Foundation first</h2>
          </div>
          <div className="sequence-list">
            <div>
              <strong>1. Curbcue</strong>
              <span>Demo fare comparison and local account foundation</span>
            </div>
            <div>
              <strong>2. CrowdMeter</strong>
              <span>Crowd and demand intelligence layer</span>
            </div>
            <div>
              <strong>3. Bermuda pilot</strong>
              <span>Taxi operations, training, queues, and reporting</span>
            </div>
          </div>
        </div>
        <CrowdMeterCard signal={spotlightSignal} title="CrowdMeter preview" />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Pickup flow</p>
          <h2>Airport, hotel, cruise, venue, and nightlife cases</h2>
        </div>
        <div className="card-grid">
          {pickupZones
            .filter((zone) => zone.marketId === "bermuda")
            .slice(0, 5)
            .map((zone) => (
              <article className="mini-card" key={zone.id}>
                <span>{toTitleCase(zone.category)}</span>
                <strong>{zone.name}</strong>
                <p>{zone.notes}</p>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setFavorites(toggleFavoriteZone(zone.id))}
                >
                  {favorites.includes(zone.id) ? "★ Saved zone" : "☆ Save zone"}
                </button>
              </article>
            ))}
        </div>
      </section>

      {favorites.length > 0 ? (
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Favorites</p>
            <h2>Saved pickup zones</h2>
          </div>
          <div className="card-grid">
            {favorites.map((zoneId) => {
              const zone = getPickupZone(zoneId);
              if (!zone) return null;
              return (
                <article className="mini-card" key={zone.id}>
                  <span>{toTitleCase(zone.category)}</span>
                  <strong>{zone.name}</strong>
                  <p>{zone.addressHint}</p>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() =>
                      openCompare(navigate, {
                        pickup: zone.name,
                        dropoff: "Hamilton hotel district",
                        zoneId: zone.id
                      })
                    }
                  >
                    Compare from here
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <PickupSuggestionCard currentZone={spotlightZone} suggestedZone={suggestedZone} signal={spotlightSignal} />
    </div>
  );
}

function ComparePage({ navigate }: { navigate: Navigate }) {
  const market = getBermudaMarket();
  const params = new URLSearchParams(window.location.search);
  const selectedZoneId = params.get("zone") ?? "bda-airport-curb";
  const pickup = params.get("pickup") ?? "L.F. Wade International Airport";
  const dropoff = params.get("dropoff") ?? "Hamilton hotel district";
  const [sortMode, setSortMode] = useState<SortMode>("best-value");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    saveTrip({ pickup, dropoff, zoneId: selectedZoneId });
  }, [pickup, dropoff, selectedZoneId]);

  const currentZone = getPickupZone(selectedZoneId) ?? getPickupZone("bda-airport-curb");
  const signal = currentZone ? getCrowdSignal(currentZone.crowdSignalId) : undefined;
  const suggestedZone = currentZone ? getSuggestedPickupZone(currentZone) : undefined;
  const estimates = rideEstimates.filter((estimate) => estimate.marketId === market.id);
  const sortedEstimates = sortEstimates(estimates, sortMode);
  const bestValue = getRecommendation(estimates, "best-value") ?? sortEstimates(estimates, "best-value")[0];
  const fastest = getRecommendation(estimates, "fastest-option") ?? sortEstimates(estimates, "fastest")[0];

  const shareCompare = async () => {
    const url = `${window.location.origin}${buildCompareHref({ pickup, dropoff, zoneId: selectedZoneId })}`;
    const ok = await copyText(url);
    setShareStatus(ok ? "Link copied" : "Copy failed — select the address bar instead");
    window.setTimeout(() => setShareStatus(""), 2500);
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Demo fare compare</p>
          <h1>Compare ride options</h1>
          <p>
            {pickup} to {dropoff}
          </p>
        </div>
        <div className="page-header-actions">
          <MarketModeBadge market={market} />
          <button type="button" className="ghost-button" onClick={shareCompare}>
            Share link
          </button>
          {shareStatus ? <small className="share-status">{shareStatus}</small> : null}
        </div>
      </section>

      <TripSearchForm
        compact
        defaultDropoff={dropoff}
        defaultPickup={pickup}
        defaultZoneId={selectedZoneId}
        onSubmit={(nextParams) => openCompare(navigate, nextParams)}
      />
      {bestValue || fastest ? (
        <div className="recommendation-grid">
          {bestValue ? (
            <RecommendationSummary label="Best value recommendation" estimate={bestValue} market={market} />
          ) : null}
          {fastest ? (
            <RecommendationSummary label="Fastest option recommendation" estimate={fastest} market={market} />
          ) : null}
        </div>
      ) : (
        <p className="empty-state" role="status">
          No demo recommendations are available for this trip yet.
        </p>
      )}

      <FareComparisonPanel dropoff={dropoff} estimates={estimates} market={market} pickup={pickup} />

      <section className="split-layout">
        {signal && <CrowdMeterCard signal={signal} title="CrowdMeter attached to trip" />}
        {currentZone && <PickupSuggestionCard currentZone={currentZone} suggestedZone={suggestedZone} signal={signal} />}
      </section>

      <section className="panel">
        <div className="section-heading section-heading--row">
          <div>
            <p className="eyebrow">Ride comparison results</p>
            <h2>Available providers</h2>
          </div>
          <div className="segmented-control" aria-label="Sort ride options">
            {(["best-value", "cheapest", "fastest", "most-reliable"] as SortMode[]).map((mode) => (
              <button
                className={sortMode === mode ? "active" : ""}
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
              >
                {toTitleCase(mode)}
              </button>
            ))}
          </div>
        </div>

        {sortedEstimates.length ? (
          <div className="result-list">
            {sortedEstimates.map((estimate) => {
              const provider = getProvider(estimate.providerId);
              return provider ? (
                <RideProviderCard estimate={estimate} key={estimate.id} market={market} provider={provider} />
              ) : null;
            })}
          </div>
        ) : (
          <p className="empty-state" role="status">
            No demo providers match this trip. Adjust the trip details and compare again.
          </p>
        )}
      </section>
    </div>
  );
}

function RecommendationSummary({
  estimate,
  label,
  market
}: {
  estimate: (typeof rideEstimates)[number];
  label: string;
  market: MarketConfig;
}) {
  const provider = getProvider(estimate.providerId);
  return (
    <article className="card recommendation-card">
      <span>{label}</span>
      <strong>{provider?.name}</strong>
      <p>
        {estimate.etaMinutes} min ETA · {estimate.reliabilityPercent}% reliability · {market.currency} estimate{" "}
        {estimate.fareLow}-{estimate.fareHigh}
      </p>
    </article>
  );
}

function CrowdMeterPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">CrowdSense layer</p>
          <h1>CrowdMeter</h1>
          <p>Simple crowd, surge, pickup pressure, and location demand intelligence.</p>
        </div>
      </section>

      <div className="card-grid card-grid--wide">
        {crowdSignals.map((signal) => (
          <CrowdMeterCard key={signal.id} signal={signal} />
        ))}
      </div>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Demand locations</p>
          <h2>Event and pickup pressure placeholders</h2>
        </div>
        <div className="table-list">
          {pickupZones.map((zone) => {
            const signal = getCrowdSignal(zone.crowdSignalId);
            return (
              <div className="table-row" key={zone.id}>
                <span>{toTitleCase(zone.category)}</span>
                <strong>{zone.name}</strong>
                <p>{signal?.level ?? "Unknown"} crowd level</p>
                <small>{zone.notes}</small>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AdminPage() {
  const bermudaMetrics = adminMetrics.filter((metric) => metric.marketId === "bermuda");

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Admin / Operator dashboard</p>
          <h1>Operations shell</h1>
          <p>Demand visibility, queue health, fleet status, venue pressure, and compliance placeholders.</p>
        </div>
      </section>

      <div className="metric-card-grid">
        {bermudaMetrics.map((metric) => (
          <AdminMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <section className="dashboard-grid">
        <div className="panel map-panel">
          <div className="section-heading">
            <p className="eyebrow">Live demand map</p>
            <h2>Island pressure overview</h2>
          </div>
          <div className="map-placeholder">
            <span>Airport</span>
            <span>Hotels</span>
            <span>Cruise</span>
            <span>Venue</span>
            <span>Nightlife</span>
          </div>
        </div>

        <DashboardColumn
          title="Driver / operator queue"
          eyebrow="Dispatch"
          items={["24 active taxis", "6 shuttle seats staged", "12 drivers in cruise queue", "4 airport priority turns"]}
        />
        <DashboardColumn
          title="Taxi fleet overview"
          eyebrow="Fleet"
          items={["31 licensed vehicles", "3 compliance reviews", "2 training refreshers due", "1 vehicle offline"]}
        />
        <DashboardColumn
          title="Venue transportation pressure"
          eyebrow="Events"
          items={["Gate B pressure high", "Overflow zone recommended", "Peak exit in 35 minutes", "Shuttle staging open"]}
        />
        <DashboardColumn
          title="Government / training / compliance"
          eyebrow="Oversight"
          items={["Aggregate reporting only", "Training module placeholder", "License status placeholder", "Policy review queue"]}
        />
        <DashboardColumn
          title="POS / security integrations"
          eyebrow="Disabled"
          items={["No payment integration", "No POS integration", "No security integration", "No surveillance feed"]}
        />
      </section>
    </div>
  );
}

function DashboardColumn({ eyebrow, items, title }: { eyebrow: string; items: string[]; title: string }) {
  return (
    <section className="panel dashboard-column">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="table-list">
        {items.map((item) => (
          <div className="table-row table-row--compact" key={item}>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function BermudaAdminPage() {
  const market = getBermudaMarket();
  const bermudaDrivers = driverProfiles.filter((driver) => driver.marketId === "bermuda");

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Bermuda taxi operations pilot</p>
          <h1>Bermuda market mode</h1>
          <p>Taxi onboarding, driver training, compliance status, reporting, categories, dispatch, and queue tools.</p>
        </div>
        <MarketModeBadge market={market} />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Pilot pickup categories</p>
          <h2>Configured market categories</h2>
        </div>
        <div className="card-grid">
          {market.pickupCategories.map((category) => (
            <article className="mini-card" key={category}>
              <span>{toTitleCase(category)}</span>
              <strong>{pickupZones.filter((zone) => zone.category === category).length} zones</strong>
              <p>Dispatch and demand reporting placeholder</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-layout">
        <DashboardColumn
          title="Taxi driver onboarding"
          eyebrow="Onboarding"
          items={["Identity verification placeholder", "Vehicle profile placeholder", "Permit upload placeholder", "Pilot invite status"]}
        />
        <DashboardColumn
          title="Driver training module"
          eyebrow="Training"
          items={["Airport queue training", "Cruise pickup etiquette", "CrowdMeter basics", "Accessibility refresher"]}
        />
      </section>

      <div className="card-grid card-grid--wide">
        {bermudaDrivers.map((driver) => (
          <DriverStatusCard driver={driver} key={driver.id} />
        ))}
      </div>

      <section className="split-layout">
        <DashboardColumn
          title="Government reporting"
          eyebrow="Reporting"
          items={["Aggregate wait-time export", "Compliance status export", "Pickup pressure summary", "No personal movement feed"]}
        />
        <DashboardColumn
          title="Dispatch / queue"
          eyebrow="Queue"
          items={["Airport queue active", "Cruise overflow staged", "Hotel pickup standby", "Venue egress queue pending"]}
        />
      </section>

      <section className="panel">
        <div className="section-heading section-heading--row">
          <div>
            <p className="eyebrow">Pilot export</p>
            <h2>Aggregate CSV</h2>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              exportAggregatePilotCsv({
                metrics: adminMetrics.filter((metric) => metric.marketId === "bermuda"),
                signals: crowdSignals.filter((signal) => signal.marketId === "bermuda"),
                zones: pickupZones.filter((zone) => zone.marketId === "bermuda"),
                drivers: bermudaDrivers
              })
            }
          >
            Download report
          </button>
        </div>
        <p className="muted">Same aggregate-only export as Government view — demo fixtures for pilot reviews.</p>
      </section>
    </div>
  );
}

function DriverPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Driver console</p>
          <h1>Driver onboarding and queue status</h1>
          <p>Placeholder driver profile, license, training, and pickup queue foundation.</p>
        </div>
      </section>

      <div className="card-grid card-grid--wide">
        {driverProfiles.map((driver) => (
          <DriverStatusCard driver={driver} key={driver.id} />
        ))}
      </div>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Driver workflow</p>
          <h2>Pilot readiness steps</h2>
        </div>
        <div className="sequence-list">
          <div>
            <strong>Onboard</strong>
            <span>Profile, vehicle, and permit placeholders</span>
          </div>
          <div>
            <strong>Train</strong>
            <span>Queue etiquette, pickup zones, CrowdMeter basics</span>
          </div>
          <div>
            <strong>Dispatch</strong>
            <span>Queue position and pickup category placeholders</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function GovernmentPage() {
  const bermudaMetrics = adminMetrics.filter((metric) => metric.marketId === "bermuda");
  const bermudaDrivers = driverProfiles.filter((driver) => driver.marketId === "bermuda");
  const bermudaZones = pickupZones.filter((zone) => zone.marketId === "bermuda");
  const bermudaSignals = crowdSignals.filter((signal) => signal.marketId === "bermuda");

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Government / compliance</p>
          <h1>Oversight foundation</h1>
          <p>Aggregate pilot reporting, training, and license review placeholders for later policy definition.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() =>
            exportAggregatePilotCsv({
              metrics: bermudaMetrics,
              signals: bermudaSignals,
              zones: bermudaZones,
              drivers: bermudaDrivers
            })
          }
        >
          Export aggregate CSV
        </button>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Privacy note</p>
          <h2>Demo export scope</h2>
        </div>
        <p className="muted">
          Downloads aggregate fixture metrics, crowd pressure, zones, and license status counts only. No personal
          movement trails or POS/security feeds.
        </p>
      </section>

      <section className="dashboard-grid">
        <DashboardColumn
          title="Government reporting"
          eyebrow="Reports"
          items={["Daily aggregate demand", "Average airport wait", "Cruise pressure windows", "Compliance status counts"]}
        />
        <DashboardColumn
          title="Training compliance"
          eyebrow="Training"
          items={["Driver module completion", "Accessibility training", "Airport queue standards", "Venue pickup protocol"]}
        />
        <DashboardColumn
          title="License status"
          eyebrow="Licensing"
          items={["Valid licenses", "Review needed", "Pending submissions", "Expired permits"]}
        />
        <DashboardColumn
          title="Privacy guardrails"
          eyebrow="Controls"
          items={["Aggregate reporting only", "No active surveillance", "No security integration", "No POS feed"]}
        />
      </section>
    </div>
  );
}

function CanyonPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Separate module</p>
          <h1>Canyon Project</h1>
          <p>{canyonProjectFields.status}</p>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Pending Definition</p>
          <h2>Definition fields</h2>
        </div>
        <div className="definition-grid">
          <DefinitionField label="Problem" value={canyonProjectFields.problem} />
          <DefinitionField label="User" value={canyonProjectFields.user} />
          <DefinitionField label="Business model" value={canyonProjectFields.businessModel} />
          <DefinitionField label="Relationship to Curbcue / CrowdSense" value={canyonProjectFields.relationship} />
        </div>
      </section>
    </div>
  );
}

function DefinitionField({ label, value }: { label: string; value: string }) {
  return (
    <article className="mini-card definition-field">
      <span>{label}</span>
      <p>{value}</p>
    </article>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [savedLabel, setSavedLabel] = useState("");

  const persist = (next: UserSettings) => {
    setSettings(next);
    saveSettings(next);
    setSavedLabel("Saved on this device");
    window.setTimeout(() => setSavedLabel(""), 2000);
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">User account</p>
          <h1>Settings</h1>
          <p>Account preferences stay on this device until cloud accounts are enabled.</p>
        </div>
        {savedLabel ? <small className="share-status">{savedLabel}</small> : null}
      </section>

      <section className="split-layout">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Account</p>
            <h2>Basic profile</h2>
          </div>
          <div className="settings-list">
            <label>
              <span>Name</span>
              <input
                value={settings.displayName}
                onChange={(event: { target: HTMLInputElement }) =>
                  persist({ ...settings, displayName: event.target.value })
                }
              />
            </label>
            <label>
              <span>Home market</span>
              <select
                value={settings.homeMarketId}
                onChange={(event: { target: HTMLSelectElement }) =>
                  persist({ ...settings, homeMarketId: event.target.value })
                }
              >
                {marketConfigs.map((market) => (
                  <option key={market.id} value={market.id}>
                    {market.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="settings-toggle">
              <span>Crowd alerts strip</span>
              <input
                checked={settings.alertsEnabled}
                type="checkbox"
                onChange={(event: { target: HTMLInputElement }) =>
                  persist({ ...settings, alertsEnabled: event.target.checked })
                }
              />
            </label>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Future integrations</p>
            <h2>Inactive by design</h2>
          </div>
          <div className="table-list">
            {integrationRoadmap.map((item) => (
              <div className="table-row table-row--compact" key={item.area}>
                <strong>
                  {item.area} <span className="integration-status">Status: {item.status}</span>
                </strong>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel" id="privacy-support" tabIndex={-1}>
        <div className="section-heading">
          <p className="eyebrow">Privacy and support</p>
          <h2>Account deletion support</h2>
        </div>
        <p className="muted">
          This demo has no cloud account or live authentication. Preferences, saved trips, favorites, and crowd
          votes stay in this browser only.
        </p>
        <div className="sequence-list">
          <div>
            <strong>Delete local demo data</strong>
            <span>Clear this site's browser storage; there is no remote account deletion to claim as complete.</span>
          </div>
          <div>
            <strong>Need help or privacy support?</strong>
            <span>
              Email <a href="mailto:support@macksims.com?subject=Curbcue%20privacy%20or%20deletion">support@macksims.com</a>.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
