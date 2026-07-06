import { useEffect, useMemo, useState } from "react";
import { AppShell, internalNavItems } from "./components/AppShell";
import { AdminMetricCard } from "./components/AdminMetricCard";
import { BetaGate } from "./components/BetaGate";
import { CrowdMeterCard } from "./components/CrowdMeterCard";
import { DriverStatusCard } from "./components/DriverStatusCard";
import { FareComparisonPanel } from "./components/FareComparisonPanel";
import { FeedbackPrompt } from "./components/FeedbackPrompt";
import { MarketModeBadge } from "./components/MarketModeBadge";
import { NightlifePanel } from "./components/NightlifePanel";
import { PickupSuggestionCard } from "./components/PickupSuggestionCard";
import { RideProviderCard } from "./components/RideProviderCard";
import { SavedComparisonsHomeBadge } from "./components/SavedComparisonsHomeBadge";
import { SavedPlacesPanel } from "./components/SavedPlacesPanel";
import { AuthCallbackScreen, OAuthSignIn } from "./components/OAuthSignIn";
import { TripSearchForm } from "./components/TripSearchForm";
import { fareDataAdapter } from "./adapters";
import { addRecentSearch, loadSavedComparisons, loadUserSettings, removeSavedComparison, saveComparisonTrip, saveSavedPlace, saveUserSettings, submitCrowdPoll, loadCrowdPolls } from "./lib/storage";
import { getCurrentUser } from "./lib/auth";
import { checkSupabaseConnection } from "./lib/supabaseClient";
import { getSyncDashboard, pushCrowdPoll, pushSavedComparison } from "./lib/supabaseSync";
import {
  APP_NAME,
  APP_SHORT_DESCRIPTION,
  APP_TAGLINE,
  BUILD_TARGET,
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_MARKET,
  SUPABASE_URL,
  VERSION_LABEL,
  WEB_CANONICAL_URL,
  isSupabaseConfigured,
  marketsReadiness,
  supabaseStatusLabel
} from "./config";
import {
  adminMetrics,
  canyonProjectFields,
  crowdPrecisionSources,
  crowdSignals,
  destinationCrowdProfiles,
  driverProfiles,
  marketConfigs,
  pickupZones
} from "./data/mockData";
import type { MarketConfig, PickupZone, RideEstimate, SortMode } from "./data/types";
import { integrationRoadmap } from "./services/integrationHooks";
import { formatFareRange, toTitleCase } from "./lib/format";
import {
  getCrowdSignal,
  getPickupZone,
  getProvider,
  getRecommendation,
  getScoreBreakdown,
  getSuggestedPickupZone,
  sortEstimates
} from "./lib/selectors";

type Navigate = (href: string) => void;

/** Public home aliases — `/curbcue` preferred; legacy paths preserved for bookmarks. */
const HOME_ROUTE_ALIASES = new Set(["/", "/curbcue", "/fairshare", "/farewave"]);

function resolveRoutePath(pathname: string): string {
  if (HOME_ROUTE_ALIASES.has(pathname) && pathname !== "/") {
    return "/";
  }
  return pathname;
}

const curbCueFeatures = [
  "Ride Compare",
  "Crowd Cue",
  "Surge Watch",
  "Pickup Smarts",
  "Timing Signal",
  "Route Options"
] as const;

const routeTitles: Record<string, string> = {
  "/": APP_NAME,
  "/curbcue": APP_NAME,
  "/fairshare": APP_NAME,
  "/farewave": APP_NAME,
  "/compare": "Compare Rides",
  "/crowd-meter": "CrowdMeter",
  "/admin": "Operator Dashboard",
  "/admin/bermuda": "Bermuda Taxi Pilot",
  "/driver": "Driver Console",
  "/government": "Government View",
  "/canyon": "Canyon Project",
  "/settings": "Settings",
  "/auth/callback": "Signing in"
};

const ecosystemSignals = [
  {
    app: "CurbCue",
    label: "Compare layer",
    title: "Ride options ranked by real trip friction",
    detail: "Fare, ETA, reliability, pickup quality, and CrowdMeter pressure stay in one decision view."
  },
  {
    app: "MotoCrew",
    label: "Route energy",
    title: "Group movement and route confidence",
    detail: "Borrowing the quick-action ride-planning feel for future shuttles, events, and shared pickup flows."
  },
  {
    app: "FishCrew",
    label: "Fleet rhythm",
    title: "Dispatch posture for moving crews",
    detail: "Useful cues for airport, cruise, hotel, dock, and operator queue coordination."
  },
  {
    app: "ShutterBid",
    label: "Trust system",
    title: "Marketplace-grade readiness",
    detail: "Clear roles, saved decisions, compliance placeholders, and no unverified live integrations."
  }
];

const launchActions = [
  { label: "Ride Compare", route: "/compare", detail: "Open rider decision view" },
  { label: "Crowd Cue", route: "/crowd-meter", detail: "Check pickup pressure" },
  { label: "Surge Watch", route: "/compare", detail: "Spot price pressure early" },
  { label: "Pickup Smarts", route: "/compare", detail: "Compare smarter pickup zones" }
];

const rotatingPhotos = [
  {
    label: "Airport arrivals",
    caption: "Airport curb pressure, queues, and pickup clarity",
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Harbor movement",
    caption: "Cruise, dock, shuttle, and visitor transport flow",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Night pickup",
    caption: "Downtown demand, nightlife exits, and safer pickup zones",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Local route",
    caption: "Taxi, shuttle, driver, and local transport choices",
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Beach return",
    caption: "Beach exits, resort lanes, and group pickup pressure",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Marina pickup",
    caption: "Harbor dining, charter returns, and dockside transport rhythm",
    src: "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Restaurant exit",
    caption: "Dinner turns, hotel guests, and curb turnover windows",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    label: "Transit pulse",
    caption: "Ferry, bus, downtown transfer, and walk-to-pickup timing",
    src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"
  }
];

export function App() {
  const [locationKey, setLocationKey] = useState(`${window.location.pathname}${window.location.search}`);

  useEffect(() => {
    const handlePopState = () => setLocationKey(`${window.location.pathname}${window.location.search}`);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (href: string) => {
    window.history.pushState({}, "", href);
    setLocationKey(`${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPath = resolveRoutePath(window.location.pathname);
  const rawPath = window.location.pathname;

  useEffect(() => {
    document.title = `${routeTitles[rawPath] ?? routeTitles[currentPath] ?? APP_NAME} | ${APP_NAME}`;
  }, [currentPath, rawPath, locationKey]);

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
        return <SettingsPage onNavigate={navigate} />;
      case "/auth/callback":
        return <AuthCallbackScreen onDone={navigate} />;
      case "/":
        return <HomePage navigate={navigate} />;
      default:
        if (HOME_ROUTE_ALIASES.has(rawPath)) {
          return <HomePage navigate={navigate} />;
        }
        return <HomePage navigate={navigate} />;
    }
  }, [currentPath, rawPath, locationKey]);

  return (
    <BetaGate>
      <AppShell currentPath={currentPath} onNavigate={navigate}>
        {page}
      </AppShell>
    </BetaGate>
  );
}

function getBermudaMarket(): MarketConfig {
  return marketConfigs.find((market) => market.id === "bermuda") ?? marketConfigs[0];
}

function buildCompareHref({ pickup, dropoff, zoneId }: { pickup: string; dropoff: string; zoneId: string }) {
  const params = new URLSearchParams({ pickup, dropoff, zone: zoneId });
  return `/compare?${params.toString()}`;
}

function HomePage({ navigate }: { navigate: Navigate }) {
  const market = getBermudaMarket();
  const spotlightSignal = crowdSignals.find((signal) => signal.id === "bda-airport-arrivals") ?? crowdSignals[0];
  const spotlightZone = getPickupZone("bda-airport-curb") as PickupZone;
  const suggestedZone = getSuggestedPickupZone(spotlightZone);

  const startSearch = (params: { pickup: string; dropoff: string; zoneId: string }) => {
    addRecentSearch(params);
    navigate(buildCompareHref(params));
  };

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="hero-copy">
          <MarketModeBadge market={market} />
          <h1>{APP_NAME}</h1>
          <p className="hero-subhead">{APP_TAGLINE}</p>
          <p>
            Compare rides, spot surge pressure, and choose smarter pickup options before prices jump.
          </p>
        </div>
        <TripSearchForm onSubmit={startSearch} submitLabel="Check ride options" />
        <div className="feature-label-row" aria-label="CurbCue features">
          {curbCueFeatures.map((feature) => (
            <span className="feature-label" key={feature}>
              {feature}
            </span>
          ))}
        </div>
      <SavedComparisonsHomeBadge onOpenCompare={() => navigate("/compare")} />
      </section>

      <SavedPlacesPanel
        onSelectPlace={(place) =>
          startSearch({ pickup: "Current location (demo)", dropoff: place.address, zoneId: place.zoneId })
        }
        onSelectSearch={(search) =>
          startSearch({ pickup: search.pickup, dropoff: search.dropoff, zoneId: search.zoneId })
        }
      />

      <NightlifePanel marketId={market.id} />

      <EcosystemFlairPanel navigate={navigate} />

      <section className="split-layout">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Platform order</p>
            <h2>Foundation first</h2>
          </div>
          <div className="sequence-list">
            <div>
              <strong>1. {APP_NAME}</strong>
              <span>Consumer comparison and account foundation</span>
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
          <h2>Airports, bars, beaches, marinas, venues, and visitor districts</h2>
        </div>
        <div className="card-grid">
          {pickupZones
            .filter((zone) => zone.marketId === "bermuda")
            .slice(0, 8)
            .map((zone) => (
              <article className="mini-card" key={zone.id}>
                <span>{toTitleCase(zone.category)}</span>
                <strong>{zone.name}</strong>
                <p>{zone.notes}</p>
              </article>
            ))}
        </div>
      </section>

      <PickupSuggestionCard currentZone={spotlightZone} suggestedZone={suggestedZone} signal={spotlightSignal} />

      <FeedbackPrompt />
    </div>
  );
}

function EcosystemFlairPanel({ navigate }: { navigate: Navigate }) {
  return (
    <section className="panel launch-panel">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">MackSims mobility ecosystem</p>
          <h2>{APP_NAME} with cross-app muscle</h2>
          <p>
            A faster product spine: compare like {APP_NAME}, coordinate like a crew app, and keep trust/readiness visible.
          </p>
        </div>
        <span className="launch-badge">Fast-track shell</span>
      </div>

      <div className="launch-actions" aria-label="Fast CurbCue routes">
        {launchActions.map((action) => (
          <button key={action.route} type="button" onClick={() => navigate(action.route)}>
            <strong>{action.label}</strong>
            <span>{action.detail}</span>
          </button>
        ))}
      </div>

      <RotatingPhotoRail />

      <div className="ecosystem-grid">
        {ecosystemSignals.map((signal) => (
          <article className="ecosystem-card" key={signal.app}>
            <span>{signal.app}</span>
            <p>{signal.label}</p>
            <strong>{signal.title}</strong>
            <small>{signal.detail}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function RotatingPhotoRail({
  compact = false,
  title = "Changing mobility photos",
  description = "A visual pulse for airport, harbor, event, and local transport demand."
}: {
  compact?: boolean;
  title?: string;
  description?: string;
}) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activePhoto = rotatingPhotos[activePhotoIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhotoIndex((current) => (current + 1) % rotatingPhotos.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <article className={compact ? "photo-rail photo-rail--compact" : "photo-rail"} aria-label="Changing CurbCue mobility photos">
      <div className="photo-rail-heading">
        <div>
          <p className="eyebrow">{title}</p>
          <h3>{description}</h3>
        </div>
      </div>
      <div className="photo-frame">
        <img src={activePhoto.src} alt={activePhoto.label} />
        <div className="photo-caption">
          <span>{activePhoto.label}</span>
          <strong>{activePhoto.caption}</strong>
        </div>
      </div>
      <div className="photo-dots" aria-label="Photo selector">
        {rotatingPhotos.map((photo, index) => (
          <button
            aria-label={`Show ${photo.label}`}
            className={index === activePhotoIndex ? "active" : ""}
            key={photo.label}
            type="button"
            onClick={() => setActivePhotoIndex(index)}
          />
        ))}
      </div>
    </article>
  );
}

function ComparePage({ navigate }: { navigate: Navigate }) {
  const market = getBermudaMarket();
  const params = new URLSearchParams(window.location.search);
  const selectedZoneId = params.get("zone") ?? "bda-airport-curb";
  const pickup = params.get("pickup") ?? "L.F. Wade International Airport";
  const dropoff = params.get("dropoff") ?? "Hamilton hotel district";
  const [sortMode, setSortMode] = useState<SortMode>("best-value");

  const currentZone = getPickupZone(selectedZoneId) ?? getPickupZone("bda-airport-curb");
  const signal = currentZone ? getCrowdSignal(currentZone.crowdSignalId) : undefined;
  const suggestedZone = currentZone ? getSuggestedPickupZone(currentZone) : undefined;

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [estimates, setEstimates] = useState<RideEstimate[]>([]);
  const [dataSource, setDataSource] = useState<string>("");
  const [dataDisclaimer, setDataDisclaimer] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    fareDataAdapter
      .getRideEstimates({ marketId: market.id, pickup, dropoff, zoneId: selectedZoneId })
      .then((result) => {
        if (cancelled) return;
        setEstimates(result.data);
        setDataSource(result.source);
        setDataDisclaimer(result.disclaimer ?? "");
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Unknown simulated failure.");
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [market.id, pickup, dropoff, selectedZoneId, reloadKey]);

  const sortedEstimates = sortEstimates(estimates, sortMode);
  const bestValue = getRecommendation(estimates, "best-value") ?? sortEstimates(estimates, "best-value")[0];
  const fastest = getRecommendation(estimates, "fastest-option") ?? sortEstimates(estimates, "fastest")[0];
  const [savedComparisons, setSavedComparisons] = useState(() => loadSavedComparisons());
  const [placeSaved, setPlaceSaved] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [pendingCloudRecord, setPendingCloudRecord] = useState<ReturnType<typeof loadSavedComparisons>[number] | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => setSignedIn(Boolean(user)));
  }, []);

  const saveComparison = () => {
    if (!bestValue) return;
    const next = saveComparisonTrip({
      label: `${pickup} → ${dropoff}`,
      pickup,
      dropoff,
      zoneId: selectedZoneId,
      estimateId: bestValue.id,
    });
    setSavedComparisons(next);
    const record = next[0];
    setPendingCloudRecord(record);
    setSaveMessage("Saved locally on this device.");
  };

  async function saveComparisonToCloud() {
    if (!pendingCloudRecord) return;
    const result = await pushSavedComparison(pendingCloudRecord);
    if (result === "ok") {
      setSaveMessage("Saved locally and synced to Supabase.");
    } else if (result === "error") {
      setSaveMessage("Saved locally; cloud sync failed — check sign-in and RLS policies.");
    } else {
      setSaveMessage("Saved locally — sign in and configure Supabase to sync to cloud.");
    }
  }
  const saveDropoffPlace = () => {
    saveSavedPlace({ label: dropoff, address: dropoff, zoneId: selectedZoneId });
    setPlaceSaved(true);
  };

  const handleSearch = (nextParams: { pickup: string; dropoff: string; zoneId: string }) => {
    addRecentSearch(nextParams);
    navigate(buildCompareHref(nextParams));
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Consumer {APP_NAME} app</p>
          <h1>Compare ride options</h1>
          <p>
            {pickup} to {dropoff}
          </p>
          <button className="save-place-button" type="button" disabled={placeSaved} onClick={saveDropoffPlace}>
            {placeSaved ? "Drop-off saved to your places" : "Save this drop-off"}
          </button>
        </div>
        <MarketModeBadge market={market} />
      </section>

      <RotatingPhotoRail
        compact
        title="Trip scene"
        description="Compare the ride against the real pickup environment."
      />

      <TripSearchForm
        compact
        defaultDropoff={dropoff}
        defaultPickup={pickup}
        defaultZoneId={selectedZoneId}
        onSubmit={handleSearch}
      />

      {loadState === "loading" && (
        <section className="panel loading-block" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading trip estimates…</p>
        </section>
      )}

      {loadState === "ready" && estimates.length > 0 && (
        <p className="data-source-note" role="note">
          Data source: <strong>{dataSource === "tariff-model" ? "Bermuda taxi tariff model" : "Simulated demo"}</strong>
          {dataDisclaimer ? ` — ${dataDisclaimer}` : ""}
        </p>
      )}

      {loadState === "error" && (
        <section className="panel error-block" role="alert">
          <strong>Comparison failed to load.</strong>
          <p>{loadError} All data in this beta is simulated, so retrying always recovers.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </button>
        </section>
      )}

      {loadState === "ready" && estimates.length === 0 && (
        <section className="panel empty-block">
          <strong>No ride signals yet.</strong>
          <p>Add a pickup area to compare ride prices, crowd pressure, and surge risk.</p>
        </section>
      )}

      {loadState === "ready" && estimates.length > 0 && (
        <>
      <BestCurbCuePick
        estimate={bestValue}
        market={market}
        onSave={saveComparison}
        onSaveToCloud={signedIn && isSupabaseConfigured ? saveComparisonToCloud : undefined}
        savedCount={savedComparisons.length}
        saveMessage={saveMessage}
      />

      <div className="recommendation-grid">
        <RecommendationSummary label="Best value recommendation" estimate={bestValue} market={market} />
        <RecommendationSummary label="Fastest option recommendation" estimate={fastest} market={market} />
      </div>

      <FareComparisonPanel estimates={estimates} market={market} />

      <section className="panel saved-panel">
        <div className="section-heading">
          <p className="eyebrow">Saved comparisons</p>
          <h2>Saved trip list</h2>
          <p className="muted">Stored in this browser; sign in to optionally sync saved trips to Supabase.</p>
        </div>
        {savedComparisons.length > 0 ? (
          <div className="table-list">
            {savedComparisons.map((comparison) => {
              const estimate = estimates.find((item) => item.id === comparison.estimateId);
              const provider = estimate ? getProvider(estimate.providerId) : undefined;
              return (
                <div className="table-row table-row--compact" key={comparison.id}>
                  <strong>{comparison.label}</strong>
                  <small>
                    {provider?.name ?? "Saved option"} —{" "}
                    {estimate ? formatFareRange(estimate.fareLow, estimate.fareHigh, market) : "Re-open trip to refresh fare"}
                  </small>
                  <button type="button" onClick={() => setSavedComparisons(removeSavedComparison(comparison.id))}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-block" style={{ marginTop: "1rem" }}>
            <strong>No saved comparisons yet.</strong>
            <p>Tap save on the best-value pick above, or sign in to sync trips to Supabase.</p>
          </div>
        )}
      </section>

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

        <div className="result-list">
          {sortedEstimates.map((estimate) => {
            const provider = getProvider(estimate.providerId);
            return provider ? (
              <RideProviderCard estimate={estimate} key={estimate.id} market={market} provider={provider} />
            ) : null;
          })}
        </div>
      </section>
        </>
      )}

      <FeedbackPrompt />
    </div>
  );
}

function BestCurbCuePick({
  estimate,
  market,
  onSave,
  onSaveToCloud,
  savedCount,
  saveMessage,
}: {
  estimate: RideEstimate;
  market: MarketConfig;
  onSave: () => void;
  onSaveToCloud?: () => void;
  savedCount: number;
  saveMessage?: string;
}) {
  const provider = getProvider(estimate.providerId);
  const breakdown = getScoreBreakdown(estimate);
  const highPressure = estimate.crowdPressureScore >= 75;

  return (
    <article className="card winner-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Ride Compare pick</p>
          <h2>{provider?.name ?? estimate.providerName}</h2>
        </div>
        <span className="score-pill">{breakdown.total}/100</span>
      </div>
      <p>
        Why this wins: strong reliability, clear pickup quality, and a balanced fare/ETA tradeoff for the active
        market.
      </p>
      {highPressure && (
        <p className="warning-copy">
          Crowd-adjusted warning: pickup pressure is high, so the better zone suggestion matters more than raw ETA.
        </p>
      )}
      <div className="score-grid">
        <ScoreItem label="Fare" value={breakdown.fare} />
        <ScoreItem label="ETA" value={breakdown.eta} />
        <ScoreItem label="Reliability" value={breakdown.reliability} />
        <ScoreItem label="Pickup" value={breakdown.pickupQuality} />
        <ScoreItem label="Crowd" value={breakdown.crowdPressure} />
      </div>
      <div className="placeholder-action">
        <span>{savedCount > 0 ? `${savedCount} saved` : "Save this comparison"}</span>
        <button type="button" onClick={onSave}>
          Save locally
        </button>
        {onSaveToCloud && (
          <button type="button" className="text-button" onClick={onSaveToCloud}>
            Save to cloud
          </button>
        )}
      </div>
      {saveMessage && <small className="muted">{saveMessage}</small>}
      <small className="muted">
        {formatFareRange(estimate.fareLow, estimate.fareHigh, market)} | {estimate.etaMinutes} min ETA | mocked data only
      </small>
    </article>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{Math.round(value)}</strong>
    </div>
  );
}

function RecommendationSummary({
  estimate,
  label,
  market
}: {
  estimate: RideEstimate;
  label: string;
  market: MarketConfig;
}) {
  const provider = getProvider(estimate.providerId);
  return (
    <article className="card recommendation-card">
      <span>{label}</span>
      <strong>{provider?.name}</strong>
      <p>
        {estimate.etaMinutes} min ETA | {estimate.reliabilityPercent}% reliability | {market.currency} estimate{" "}
        {estimate.fareLow}-{estimate.fareHigh}
      </p>
    </article>
  );
}

function CrowdMeterPage() {
  const market = getBermudaMarket();
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState("");
  const [signals, setSignals] = useState<typeof crowdSignals>([]);
  const [dataSource, setDataSource] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    fareDataAdapter
      .getCrowdSignals(market.id)
      .then((result) => {
        if (cancelled) return;
        setSignals(result.data);
        setDataSource(result.source);
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Crowd signals failed to load.");
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [market.id, reloadKey]);

  const signalLookup = useMemo(() => new Map(signals.map((signal) => [signal.id, signal])), [signals]);
  const [pollLocation, setPollLocation] = useState("L.F. Wade International Airport");
  const [pollLevel, setPollLevel] = useState<"Low" | "Medium" | "High">("Medium");
  const [pollNote, setPollNote] = useState("");
  const [localPolls, setLocalPolls] = useState(() => loadCrowdPolls());
  const [pollMessage, setPollMessage] = useState("");

  async function handleCrowdPollSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    const record = {
      locationName: pollLocation.trim() || "Unknown location",
      level: pollLevel,
      note: pollNote.trim(),
    };
    const next = submitCrowdPoll(record);
    setLocalPolls(next);
    setPollNote("");
    const latest = next[0];
    if (isSupabaseConfigured) {
      const sync = await pushCrowdPoll(latest);
      if (sync === "ok") {
        setPollMessage("Poll saved locally and submitted to Supabase (anon or signed-in).");
      } else if (sync === "error") {
        setPollMessage("Poll saved locally; Supabase insert failed — check RLS policies.");
      } else {
        setPollMessage("Poll saved locally — Supabase not available at build time.");
      }
    } else {
      setPollMessage("Poll saved locally on this device — Supabase not configured.");
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">CrowdSense layer</p>
          <h1>CrowdMeter</h1>
          <p>
            Destination-aware crowd, surge, pickup pressure, and demand intelligence for airports, bars, beaches,
            marinas, restaurants, attractions, transit, hotels, cruise ports, venues, and downtown districts.
          </p>
        </div>
      </section>

      <RotatingPhotoRail
        compact
        title="Crowd context"
        description="Pressure changes by destination type, pickup quality, timing, and nearby alternatives."
      />

      {loadState === "loading" && (
        <section className="panel loading-block" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Loading crowd signals…</p>
        </section>
      )}

      {loadState === "error" && (
        <section className="panel error-block" role="alert">
          <strong>CrowdMeter could not load.</strong>
          <p>{loadError} All crowd data in this beta is simulated — retrying should recover.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </button>
        </section>
      )}

      {loadState === "ready" && (
        <p className="data-source-note" role="note">
          Data source: <strong>{dataSource === "mock" ? "Simulated demo signals" : dataSource}</strong> — not live
          crowd telemetry. Partner APIs require opt-in and aggregate reporting rules before production use.
        </p>
      )}

      {loadState === "ready" && (
        <>
      <section className="panel precision-panel">
        <div className="section-heading">
          <p className="eyebrow">Pinpoint-ready signal model</p>
          <h2>Borrowed ecosystem logic, kept privacy-safe</h2>
          <p>
            These are mocked source concepts for now. Real APIs can connect later only after clear partner approval,
            opt-in rules, and aggregate reporting boundaries.
          </p>
        </div>
        <div className="precision-grid">
          {crowdPrecisionSources.map((source) => (
            <article className="precision-card" key={source.source}>
              <span>{source.source}</span>
              <strong>{source.usefulFor}</strong>
              <p>{source.guardrail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Destination coverage</p>
          <h2>Beyond hubs: where people actually go</h2>
        </div>
        <div className="coverage-grid">
          {destinationCrowdProfiles.map((profile) => (
            <article className="coverage-card" key={profile.category}>
              <div>
                <span>{profile.label}</span>
                <strong>{profile.operationalUse}</strong>
              </div>
              <div className="mini-tag-row">
                {profile.examples.map((example) => (
                  <small key={example}>{example}</small>
                ))}
              </div>
              <div className="signal-factor-list">
                {profile.signalFactors.map((factor) => (
                  <em key={factor}>{factor}</em>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {loadState === "ready" && signals.length === 0 && (
        <section className="panel empty-block">
          <strong>No crowd signals for this market yet.</strong>
          <p>The Bermuda demo market has the fullest sample set. Switch markets or retry after deploy updates.</p>
        </section>
      )}

      {loadState === "ready" && signals.length > 0 && (
      <div className="card-grid card-grid--wide">
        {signals.map((signal) => (
          <CrowdMeterCard key={signal.id} signal={signal} />
        ))}
      </div>
      )}

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Demand locations</p>
          <h2>Pickup pressure placeholders across destinations</h2>
        </div>
        <div className="table-list">
          {pickupZones.map((zone) => {
            const signal = signalLookup.get(zone.crowdSignalId);
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

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Voluntary crowd poll</p>
          <h2>Local-only pressure report</h2>
          <p>Test the poll UX without API keys. Reports stay in this browser until a backend with abuse controls is connected.</p>
        </div>
        <form className="settings-list" onSubmit={handleCrowdPollSubmit}>
          <label>
            <span>Location</span>
            <input value={pollLocation} onChange={(event: { target: { value: string } }) => setPollLocation(event.target.value)} />
          </label>
          <label>
            <span>Crowd level</span>
            <select value={pollLevel} onChange={(event: { target: { value: string } }) => setPollLevel(event.target.value as typeof pollLevel)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <label>
            <span>Note (optional)</span>
            <input value={pollNote} onChange={(event: { target: { value: string } }) => setPollNote(event.target.value)} placeholder="Pickup line, surge, etc." />
          </label>
          <button type="submit">Save local poll</button>
        </form>
        {pollMessage && <p className="muted">{pollMessage}</p>}
        {localPolls.length === 0 && (
          <p className="muted empty-hint">No local polls yet — submit one above to test the UX.</p>
        )}
        {localPolls.length > 0 && (
          <div className="table-list">
            {localPolls.slice(0, 5).map((poll) => (
              <div className="table-row table-row--compact" key={poll.id}>
                <strong>{poll.locationName}</strong>
                <small>
                  {poll.level} — {poll.note || "No note"} — {new Date(poll.submittedAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
        </>
      )}
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

      <RotatingPhotoRail
        compact
        title="Operator view"
        description="Demand surfaces stay visual while the data remains mocked and privacy-safe."
      />

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
            <span>Venues</span>
            <span>Bars</span>
            <span>Restaurants</span>
            <span>Beach</span>
            <span>Marina</span>
            <span>Transit</span>
            <span>Tourist</span>
            <span>Shopping</span>
            <span>Hospital</span>
          </div>
        </div>

        <DashboardColumn
          title="Launch control"
          eyebrow="Fast-track"
          items={["Rider compare live", "CrowdMeter visible", "Bermuda pilot staged", isSupabaseConfigured ? "Supabase client ready" : "Supabase URL staged — add anon key"]}
        />

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
          eyebrow="Destinations"
          items={["Gate B pressure high", "Front Street bars packed", "Beach return rising", "Marina pickup moderate"]}
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

      <RotatingPhotoRail
        compact
        title="Pilot field view"
        description="Airport, hotel, cruise, bar, beach, marina, event, restaurant, and resort pickup modes stay visible."
      />

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
          items={["Airport queue active", "Cruise overflow staged", "Bar close side street ready", "Beach and marina relief pins visible"]}
        />
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

      <RotatingPhotoRail
        compact
        title="Driver field view"
        description="Driver onboarding connects back to the live pickup environment."
      />

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
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Government / compliance</p>
          <h1>Oversight foundation</h1>
          <p>Aggregate pilot reporting, training, and license review placeholders for later policy definition.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <DashboardColumn
          title="Government reporting"
          eyebrow="Reports"
          items={["Daily aggregate demand", "Average airport wait", "Bar and venue pressure windows", "Compliance status counts"]}
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
          <DefinitionField label="Relationship to CurbCue / CrowdSense" value={canyonProjectFields.relationship} />
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

function SettingsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [settings, setSettings] = useState(loadUserSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [supabasePing, setSupabasePing] = useState("Checking Supabase…");
  const [syncInfo, setSyncInfo] = useState("");
  const [syncTick, setSyncTick] = useState(0);

  useEffect(() => {
    checkSupabaseConnection().then((result) => {
      setSupabasePing(result.state === "connected" ? `Connected — ${result.detail}` : `Not connected — ${result.detail}`);
    });
    getSyncDashboard().then((dash) => {
      if (!dash.signedIn) {
        setSyncInfo("Sign in to merge local comparisons and polls with Supabase.");
        return;
      }
      const parts = [
        `Comparisons — local: ${dash.local.comparisons}`,
        dash.remote?.comparisons !== null ? `cloud: ${dash.remote?.comparisons}` : null,
        `Polls — local: ${dash.local.polls}`,
        dash.remote?.polls !== null ? `cloud: ${dash.remote?.polls}` : null,
        dash.meta.lastSyncedAt ? `Last sync: ${new Date(dash.meta.lastSyncedAt).toLocaleString()}` : null,
        dash.meta.lastError ? `Error: ${dash.meta.lastError}` : null,
      ].filter(Boolean);
      setSyncInfo(parts.join(" · "));
    });
  }, [syncTick]);

  useEffect(() => {
    const onAuth = () => setSyncTick((n) => n + 1);
    window.addEventListener("fairshare:auth-changed", onAuth);
    return () => window.removeEventListener("fairshare:auth-changed", onAuth);
  }, []);

  function updateSettings(patch: Partial<typeof settings>) {
    const next = saveUserSettings({ ...settings, ...patch });
    setSettings(next);
    setSavedMessage("Settings saved on this device.");
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Account &amp; preferences</p>
          <h1>Settings</h1>
          <p>Sign in to sync saved trips. Profile fields below save on this device and sync when signed in.</p>
        </div>
      </section>

      <section className="split-layout">
        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">Account</p>
            <h2>Sign in</h2>
          </div>
          <OAuthSignIn />
          <div className="section-heading" style={{ marginTop: "1.5rem" }}>
            <p className="eyebrow">Local profile</p>
            <h2>Basic profile</h2>
          </div>
          <div className="settings-list">
            <label>
              <span>Name</span>
              <input
                value={settings.name}
                onChange={(event: { target: { value: string } }) => updateSettings({ name: event.target.value })}
              />
            </label>
            <label>
              <span>Role</span>
              <select
                value={settings.role}
                onChange={(event: { target: { value: string } }) => updateSettings({ role: event.target.value })}
              >
                <option value="rider">Rider</option>
                <option value="driver">Driver</option>
                <option value="operator">Operator</option>
                <option value="venue-partner">Venue / event partner</option>
                <option value="government-authority">Government / transport authority</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label>
              <span>Home market</span>
              <select
                value={settings.homeMarketId}
                onChange={(event: { target: { value: string } }) => updateSettings({ homeMarketId: event.target.value })}
              >
                {marketConfigs.map((market) => (
                  <option key={market.id} value={market.id}>
                    {market.label}
                  </option>
                ))}
              </select>
            </label>
            {savedMessage && <p className="muted">{savedMessage}</p>}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <p className="eyebrow">{APP_NAME} {VERSION_LABEL}</p>
            <h2>App readiness</h2>
          </div>
          <div className="table-list">
            <div className="table-row table-row--compact">
              <strong>{DEFAULT_MARKET}</strong>
              <small>
                {DEFAULT_CITY}, {DEFAULT_COUNTRY} | {DEFAULT_CURRENCY} | {DEFAULT_LOCALE} | {BUILD_TARGET}
              </small>
            </div>
            <div className="table-row table-row--compact">
              <strong>Canonical web app</strong>
              <small>{WEB_CANONICAL_URL}</small>
            </div>
            <div className="table-row table-row--compact">
              <strong>Supabase</strong>
              <small>{supabaseStatusLabel()}</small>
            </div>
            <div className="table-row table-row--compact">
              <strong>Data sync</strong>
              <small>{syncInfo || "Local-first; saves also attempt Supabase when configured and signed in."}</small>
            </div>
            <div className="table-row table-row--compact">
              <strong>Connection test</strong>
              <small>{supabasePing}</small>
            </div>
            <div className="table-row table-row--compact">
              <strong>Active data adapter</strong>
              <small>
                {fareDataAdapter.name} | {fareDataAdapter.isSimulated ? "simulated data only" : "live"}
              </small>
            </div>
            {integrationRoadmap.map((item) => (
              <div className="table-row table-row--compact" key={item.area}>
                <strong>{item.area}</strong>
                <small>{item.note}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Internal / operator demos</p>
          <h2>Not in primary beta nav</h2>
          <p className="subtle-copy">These shells are placeholders for future operator tools — not required for rider compare testing.</p>
        </div>
        <div className="settings-list">
          {internalNavItems.map((item) => (
            <button key={item.href} type="button" className="text-button" onClick={() => onNavigate(item.href)}>
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <RoadmapNotes />
    </div>
  );
}

function RoadmapNotes() {
  const roadmapItems = [
    "Multi-market support",
    "Currency and localization support",
    "Provider integrations",
    "Airport, cruise, event, hotel, bar, restaurant, beach, marina, resort, and transit pickup modes",
    "Local compliance modules",
    "Privacy-safe crowd signals"
  ];

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="eyebrow">Founder / roadmap note</p>
        <h2>Global readiness path</h2>
      </div>
      <div className="card-grid">
        {roadmapItems.map((item) => (
          <article className="mini-card" key={item}>
            <strong>{item}</strong>
            <p>Roadmap placeholder, not an implemented claim.</p>
          </article>
        ))}
      </div>
      <div className="table-list">
        {marketsReadiness.map((market) => (
          <div className="table-row table-row--compact" key={market.id}>
            <strong>{market.label}</strong>
            <small>
              {market.defaultCity}, {market.country} | {market.currency} | {market.status} |{" "}
              {market.supportedContexts.join(", ")}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
