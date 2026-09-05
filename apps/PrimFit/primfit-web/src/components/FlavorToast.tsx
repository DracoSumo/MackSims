"use client";

import { useEffect, useRef, useState } from "react";

export function FlavorToast({
  message,
  rankedUp,
  crit,
  rankLabel,
  onDone,
}: {
  message: string | null;
  rankedUp?: boolean;
  crit?: boolean;
  rankLabel?: string;
  onDone: () => void;
}) {
  const [show, setShow] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!message) return;
    setShow(true);
    const t = window.setTimeout(() => {
      setShow(false);
      onDoneRef.current();
    }, rankedUp ? 2800 : crit ? 1800 : 1500);
    return () => window.clearTimeout(t);
  }, [message, rankedUp, crit]);

  if (!message || !show) return null;

  return (
    <div className={`pf-flavor-toast ${rankedUp ? "is-rank" : ""} ${crit ? "is-crit" : ""}`} role="status">
      {rankedUp ? <p className="pf-flavor-toast-rank">{rankLabel ?? "Rank up"}</p> : null}
      {crit && !rankedUp ? <p className="pf-flavor-toast-rank">Critical</p> : null}
      <p>{message}</p>
    </div>
  );
}
