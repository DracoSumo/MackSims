"use client";

import { useState } from "react";
import { LegalFooter } from "@/components/LegalFooter";
import { useTheme } from "@/components/ThemeProvider";
import { PREVIEW_UNLOCK_NOTE, getOwnedPacks, type ThemeId } from "@/lib/themes";

export default function ShopPage() {
  const { theme, owned, packs, copy, buy, equip, restore, receipts } = useTheme();
  const [pending, setPending] = useState<ThemeId | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const pendingPack = packs.find((p) => p.id === pending);

  function confirmBuy() {
    if (!pending) return;
    buy(pending);
    setNote(`${pendingPack?.name ?? "Pack"} unlocked on this device. No real payment was charged.`);
    setPending(null);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pf-muted)]">
          {copy.shop}
        </p>
        <h1 className="pf-display text-3xl font-bold">{copy.shopTitle}</h1>
        <p className="text-sm text-[var(--pf-muted)]">{PREVIEW_UNLOCK_NOTE}</p>
      </header>

      <div className="space-y-4">
        {packs.length === 0 ? (
          <div className="pf-card space-y-2 p-4 text-center">
            <p className="font-semibold">No packs listed</p>
            <p className="text-sm text-[var(--pf-muted)]">UI themes will show up here when available. Sleek stays free.</p>
          </div>
        ) : null}
        {packs.map((pack) => {
          const has = owned.includes(pack.id);
          const equipped = theme === pack.id;
          return (
            <article key={pack.id} className="pf-card space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="pf-display text-lg font-semibold">{pack.name}</h2>
                  <p className="mt-1 text-sm text-[var(--pf-muted)]">{pack.pitch}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-[var(--pf-silver)]">{pack.priceLabel}</p>
              </div>
              <div className="flex gap-2" aria-hidden>
                {pack.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-7 w-7 rounded-full border border-[var(--pf-line)]"
                    style={{ background: color }}
                  />
                ))}
              </div>
              {equipped ? (
                <p className="pf-btn-ghost pointer-events-none w-full opacity-80">Equipped</p>
              ) : has ? (
                <button type="button" className="pf-btn-primary w-full" onClick={() => equip(pack.id)}>
                  Equip
                </button>
              ) : (
                <button type="button" className="pf-btn-primary w-full" onClick={() => setPending(pack.id)}>
                  Buy · {pack.priceLabel}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {pendingPack ? (
        <div className="pf-card space-y-3 p-4">
          <p className="font-semibold">Unlock {pendingPack.name}?</p>
          <p className="text-sm text-[var(--pf-muted)]">
            Display price {pendingPack.priceLabel}. {PREVIEW_UNLOCK_NOTE} No real payment is charged.
          </p>
          <div className="flex gap-2">
            <button type="button" className="pf-btn-primary flex-1" onClick={confirmBuy}>
              Unlock on this device
            </button>
            <button type="button" className="pf-btn-ghost flex-1" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {note ? <p className="pf-done-banner">{note}</p> : null}

      <section className="space-y-2">
        <button
          type="button"
          className="pf-btn-ghost w-full"
          onClick={() => {
            restore();
            const packsOwned = getOwnedPacks();
            setNote(
              packsOwned.length > 1
                ? `Restored ${packsOwned.length} pack(s) already unlocked on this device.`
                : "PrimFit Sleek is already on this device. Paid packs restore only if you unlocked them here before.",
            );
          }}
        >
          Restore on this device
        </button>
        <p className="text-xs text-[var(--pf-muted)]">
          Restore reads packs already saved in localStorage. It cannot recover a purchase from the App Store or
          Play Store — those checkouts are not live.
        </p>
        {receipts.length ? (
          <p className="text-xs text-[var(--pf-muted)]">
            Last unlock: {receipts[0].packId} · {new Date(receipts[0].unlockedAt).toLocaleString()}
          </p>
        ) : null}
      </section>

      <LegalFooter />
    </div>
  );
}
