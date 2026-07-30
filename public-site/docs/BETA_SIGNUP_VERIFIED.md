# Beta signup form — verified working

**Date:** 2026-07-23  
**URL:** https://macksims.com/beta/#join  
**Form name:** `beta-signup`  
**Netlify site:** `macksims-public-site`

## What happens on submit

1. Browser POSTs to `/` with `form-name=beta-signup` (AJAX in `public/js/site.js`).
2. Netlify Forms stores the submission.
3. Emails fire to:
   - **feedback@macksims.com**
   - **support@macksims.com**
4. User is redirected to `/beta/thanks/`.
5. If the POST fails, the page opens a prefilled `mailto:feedback@macksims.com` backup.

## Fields collected

| Field | Required |
|-------|----------|
| name | yes |
| email | yes |
| apps | yes (at least one) |
| platform | optional |
| store_email | optional |
| message | optional |
| source | auto (`macksims-public-beta`) |

## Where to read signups

1. **Email** — check `feedback@` and `support@` (and spam).
2. **Netlify UI** — [Forms](https://app.netlify.com/projects/macksims-public-site/forms) → **beta-signup** → Submissions.
3. Known real signup already present: Chris Sims / `draconicsummons@outlook.com`.

## Quick re-test

Submit once from https://macksims.com/beta/ with your own email. You should land on the thanks page and receive the notification email within a few minutes.
