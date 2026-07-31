import { useId, useState } from "react";
import {
  REPORT_CATEGORIES,
  blockUser,
  isBlocked,
  submitReport,
  type ReportCategory,
} from "../services/communitySafety";

export function SafetyMenu({
  targetType,
  targetId,
  targetLabel,
  authorId,
}: {
  targetType: "message" | "ride" | "user";
  targetId: string;
  targetLabel: string;
  authorId?: string;
}) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"menu" | "report">("menu");
  const [category, setCategory] = useState<ReportCategory>("spam");
  const [details, setDetails] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [blockedNow, setBlockedNow] = useState(false);
  const blocked = blockedNow || (authorId ? isBlocked(authorId) : false);

  function handleBlock() {
    if (!authorId) return;
    blockUser(authorId);
    setBlockedNow(true);
    setNote("Rider hidden on this device.");
    window.dispatchEvent(new Event("motocrew:safety-changed"));
    setOpen(false);
  }

  function handleReport() {
    const result = submitReport({
      targetType,
      targetId,
      targetLabel,
      category,
      details,
    });
    setNote(
      result.deduped
        ? "Already reported recently — thank you."
        : "Report queued. Your identity stays private from the reported rider.",
    );
    setDetails("");
    setMode("menu");
    setOpen(false);
  }

  return (
    <div className="safety-menu">
      <button
        type="button"
        className="compact-action"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((v) => !v);
          setMode("menu");
        }}
      >
        ⋯
      </button>
      {open ? (
        <div id={menuId} role="menu" className="safety-menu-panel">
          {mode === "menu" ? (
            <>
              <p className="future-note">Pack safety controls</p>
              <button type="button" role="menuitem" className="compact-action" onClick={() => setMode("report")}>
                Report
              </button>
              {authorId ? (
                <button
                  type="button"
                  role="menuitem"
                  className="compact-action"
                  onClick={handleBlock}
                  disabled={blocked}
                >
                  {blocked ? "Blocked" : "Block rider"}
                </button>
              ) : null}
              <button type="button" className="compact-action" onClick={() => setOpen(false)}>
                Close
              </button>
            </>
          ) : (
            <>
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)}>
                  {REPORT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Details
                <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={1000} />
              </label>
              <div className="profile-actions">
                <button type="button" className="compact-action" onClick={handleReport}>
                  Submit
                </button>
                <button type="button" className="compact-action" onClick={() => setMode("menu")}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
      {note ? <p className="future-note">{note}</p> : null}
    </div>
  );
}
