# Quarantined components

These files are **not imported** by the active local-first beta page (`app/page.tsx`).

| File | Reason |
|------|--------|
| `AuthCard.tsx` | Supabase auth UI — throws without env; not used in offline beta |
| `ChurchSwitcher.tsx` | Multi-church Supabase UI — empty-state crash risk |

Revive only when Supabase mode is explicitly re-enabled with schema + env review.
