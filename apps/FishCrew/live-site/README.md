# FishCrew live site (0.9.10)

This folder is the exact site published at fishcrew.macksims.com (deployed by drag-and-drop to the
`fishcrew` Netlify site), so it can be tracked in git. It was rebuilt from `fishcrew-site-0.9.8.zip`
plus the live 0.9.9 changes (verified byte-for-byte against the live files), then 0.9.10 fixes:

- Fish ID and Measure removed (they guessed at random).
- In-app account deletion calls the `delete-account` Edge Function (data + login) and reports failures.
- Privacy and account-deletion pages describe the same deletion.

`_deploy-icon-patch` (0.9.7) is older and missing live features; deploy from this folder instead.
To publish: drag this folder (or a zip of it) onto Netlify → fishcrew → Deploys.
