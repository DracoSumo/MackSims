import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  activeSessionForCrew,
  addCheckInLocal,
  alertsForCrew,
  checkInsForSession,
  createCrewLocal,
  endSessionLocal,
  isSessionStale,
  joinCrewByCodeLocal,
  leaveCrewLocal,
  loadCrewState,
  membersForCrew,
  saveCrewState,
  startSessionLocal,
  updateLocationLocal,
  type CheckInStatus,
  type CrewState,
  type LocationPrecision,
  type PresenceStatus,
} from "../services/crewStore";
import { isSupabaseConfigured } from "../config/backend";

const LOCAL_USER_KEY = "motocrew.localUserId";

function localUserId() {
  if (typeof window === "undefined") return "local-rider";
  try {
    const existing = window.localStorage.getItem(LOCAL_USER_KEY);
    if (existing) return existing;
    const next = `local-${Date.now().toString(36)}`;
    window.localStorage.setItem(LOCAL_USER_KEY, next);
    return next;
  } catch {
    return "local-rider";
  }
}

function formatTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function CrewScreen() {
  const [state, setState] = useState<CrewState>(() => loadCrewState());
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const userId = useMemo(() => localUserId(), []);

  useEffect(() => {
    const refresh = () => setState(loadCrewState());
    window.addEventListener("motocrew:crew-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("motocrew:crew-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const activeCrew = state.crews.find((c) => c.id === state.activeCrewId) ?? state.crews[0] ?? null;
  const members = membersForCrew(state, activeCrew?.id ?? null);
  const session = activeSessionForCrew(state, activeCrew?.id ?? null);
  const stale = isSessionStale(session);
  const checkIns = checkInsForSession(state, session?.id ?? null);
  const alerts = alertsForCrew(state, activeCrew?.id ?? null);
  const location = state.location;

  function apply(next: CrewState, okMessage: string) {
    saveCrewState(next);
    setState(next);
    setMessage(okMessage);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("crewName") || "").trim();
    const displayName = String(form.get("displayName") || "").trim() || "You";
    if (!name) {
      setMessage("Crew name is required.");
      return;
    }
    setBusy(true);
    const next = createCrewLocal(name, userId, displayName);
    apply(
      next,
      isSupabaseConfigured
        ? "Crew saved on this device. Sign in on Profile to sync crews to Supabase when connected."
        : "Crew saved on this device (local-only until Supabase env is configured).",
    );
    setBusy(false);
    event.currentTarget.reset();
  }

  function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get("inviteCode") || "");
    const displayName = String(form.get("joinName") || "").trim() || "Rider";
    const result = joinCrewByCodeLocal(code, userId, displayName);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    apply(result.state, "Joined crew on this device.");
    event.currentTarget.reset();
  }

  function handleStartSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeCrew) return;
    const title = String(new FormData(event.currentTarget).get("sessionTitle") || "Pack ride");
    apply(startSessionLocal(activeCrew.id, userId, title), "Ride session started for your crew.");
    event.currentTarget.reset();
  }

  function handleCheckIn(status: CheckInStatus) {
    if (!session) {
      setMessage("Start a ride session before checking in.");
      return;
    }
    apply(addCheckInLocal(session.id, userId, status), `Checked in as ${status.replaceAll("_", " ")}.`);
  }

  function handleLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const precisionMode = String(form.get("precisionMode") || "off") as LocationPrecision;
    const presenceStatus = String(form.get("presenceStatus") || "available") as PresenceStatus;
    const shareWithCrew = form.get("shareWithCrew") === "on";
    const approxLabel = String(form.get("approxLabel") || "").trim();
    apply(
      updateLocationLocal(userId, {
        precisionMode,
        presenceStatus,
        shareWithCrew: precisionMode === "off" ? false : shareWithCrew,
        approxLabel: precisionMode === "off" ? "" : approxLabel,
        lat: null,
        lng: null,
        sessionExpiresAt:
          precisionMode === "off"
            ? null
            : new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      }),
      precisionMode === "precise"
        ? "Precise mode enabled for consent only — this web build does not capture live GPS automatically. Use an approximate label if you want crew-visible status."
        : "Location sharing preferences updated. Exact home/ride pins are never public.",
    );
  }

  return (
    <div className="screen-content">
      <section className="crew-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Crew / Circle</p>
            <h2>{activeCrew ? activeCrew.name : "Your private crew"}</h2>
          </div>
          <span className="offline-pill">{isSupabaseConfigured ? "Device + cloud-ready" : "Device only"}</span>
        </div>
        <p className="subtle-copy">
          Life360-style private circles for your pack: invite-only membership, ride sessions, check-ins, and
          opt-in location status. No background GPS, crash detection, or emergency dispatch in this web build.
        </p>
        {message ? <p className="save-toast" role="status">{message}</p> : null}

        {!activeCrew ? (
          <p className="empty-state">No crew yet. Create one or join with an invite code from this device.</p>
        ) : (
          <>
            <div className="crew-meta">
              <p>
                Invite code: <strong>{activeCrew.inviteCode}</strong>
              </p>
              <p className="subtle-copy">Share only with riders you trust. Codes stay private to your circle.</p>
              <div className="action-row">
                {state.crews.map((crew) => (
                  <button
                    key={crew.id}
                    type="button"
                    className={crew.id === activeCrew.id ? "primary-action" : "text-action"}
                    onClick={() => {
                      const next = { ...loadCrewState(), activeCrewId: crew.id };
                      apply(next, `Switched to ${crew.name}.`);
                    }}
                  >
                    {crew.name}
                  </button>
                ))}
                <button
                  type="button"
                  className="text-action danger-action"
                  onClick={() => {
                    if (!window.confirm("Leave this crew on this device?")) return;
                    apply(leaveCrewLocal(activeCrew.id, userId), "Left crew on this device.");
                  }}
                >
                  Leave crew
                </button>
              </div>
            </div>

            <div className="member-list" aria-label="Crew members">
              {members.map((member) => (
                <article key={member.id} className="member-row">
                  <div>
                    <strong>{member.displayName || "Rider"}</strong>
                    <span>{member.role}</span>
                  </div>
                  <span>{member.userId === userId ? "You" : "Member"}</span>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="crew-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Create / join</p>
            <h2>Start a circle</h2>
          </div>
        </div>
        <form className="stack-form" onSubmit={handleCreate}>
          <label>
            Crew name
            <input name="crewName" maxLength={80} placeholder="Saturday canyon crew" required disabled={busy} />
          </label>
          <label>
            Your display name
            <input name="displayName" maxLength={40} placeholder="Alex" disabled={busy} />
          </label>
          <button type="submit" className="primary-action" disabled={busy}>
            Create crew
          </button>
        </form>
        <form className="stack-form" onSubmit={handleJoin}>
          <label>
            Invite code
            <input name="inviteCode" maxLength={8} placeholder="ABC123" required />
          </label>
          <label>
            Your display name
            <input name="joinName" maxLength={40} placeholder="Blake" />
          </label>
          <button type="submit" className="text-action">
            Join with code
          </button>
          <p className="future-note">
            Join-by-code works for crews created on this device. Cross-device invites require sign-in + synced
            Supabase crews.
          </p>
        </form>
      </section>

      {activeCrew ? (
        <section className="crew-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ride session</p>
              <h2>{session ? session.title : "No active session"}</h2>
            </div>
            {session ? (
              <span className={stale ? "offline-pill warn-pill" : "offline-pill"}>
                {stale ? "Stale session" : session.status}
              </span>
            ) : null}
          </div>
          {session ? (
            <>
              <p className="subtle-copy">
                Started {formatTime(session.startedAt)}
                {stale ? " — session looks stale; end it or start a fresh one." : ""}
              </p>
              <div className="action-row">
                <button type="button" className="primary-action" onClick={() => handleCheckIn("ok")}>
                  I&apos;m OK
                </button>
                <button type="button" className="text-action" onClick={() => handleCheckIn("delayed")}>
                  Delayed
                </button>
                <button type="button" className="text-action" onClick={() => handleCheckIn("arrived")}>
                  Arrived
                </button>
                <button type="button" className="text-action" onClick={() => handleCheckIn("need_help")}>
                  Need help
                </button>
                <button type="button" className="text-action" onClick={() => handleCheckIn("off_bike")}>
                  Off bike
                </button>
                <button
                  type="button"
                  className="text-action danger-action"
                  onClick={() => apply(endSessionLocal(session.id, userId), "Ride session ended.")}
                >
                  End session
                </button>
              </div>
              <div className="checkin-list">
                {checkIns.length === 0 ? (
                  <p className="empty-state">No check-ins yet. Tap a status above.</p>
                ) : (
                  checkIns.map((item) => (
                    <article key={item.id} className="module-card">
                      <span>{item.status.replaceAll("_", " ")}</span>
                      <h3>{formatTime(item.createdAt)}</h3>
                      <p>{item.note || "No note"}</p>
                    </article>
                  ))
                )}
              </div>
            </>
          ) : (
            <form className="stack-form" onSubmit={handleStartSession}>
              <label>
                Session title
                <input name="sessionTitle" placeholder="Morning twisties" />
              </label>
              <button type="submit" className="primary-action">
                Start ride session
              </button>
            </form>
          )}
        </section>
      ) : null}

      <section className="crew-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Location privacy</p>
            <h2>Sharing consent</h2>
          </div>
        </div>
        <p className="danger-note">
          Exact location is private by default. This PWA does not run background GPS. Precise mode records
          consent only unless you later add an explicit one-tap share — never expose home pins publicly.
        </p>
        <form className="stack-form" onSubmit={handleLocation}>
          <label>
            Precision
            <select name="precisionMode" defaultValue={location?.precisionMode ?? "off"}>
              <option value="off">Off (default)</option>
              <option value="approximate">Approximate label only</option>
              <option value="precise">Precise consent (no auto GPS in this web build)</option>
            </select>
          </label>
          <label>
            Presence
            <select name="presenceStatus" defaultValue={location?.presenceStatus ?? "available"}>
              <option value="available">Available</option>
              <option value="riding">Riding</option>
              <option value="delayed">Delayed</option>
              <option value="need_help">Need help</option>
              <option value="off">Hidden</option>
            </select>
          </label>
          <label>
            Approximate label (optional)
            <input
              name="approxLabel"
              maxLength={80}
              placeholder="Near meet / north loop"
              defaultValue={location?.approxLabel ?? ""}
            />
          </label>
          <label className="checkbox-row">
            <input name="shareWithCrew" type="checkbox" defaultChecked={location?.shareWithCrew ?? false} />
            Share status with my active crew while a share window is open
          </label>
          <button type="submit" className="primary-action">
            Save location preferences
          </button>
        </form>
      </section>

      {activeCrew ? (
        <section className="crew-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Crew updates</h2>
            </div>
          </div>
          {alerts.length === 0 ? (
            <p className="empty-state">No activity yet. Session starts and check-ins show up here.</p>
          ) : (
            <div className="module-list">
              {alerts.map((alert) => (
                <article key={alert.id} className="module-card">
                  <span>{alert.kind.replaceAll("_", " ")}</span>
                  <h3>{formatTime(alert.createdAt)}</h3>
                  <p>{alert.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
