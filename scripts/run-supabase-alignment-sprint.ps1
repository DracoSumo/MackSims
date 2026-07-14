# Per-app Supabase alignment (URLs + anon keys + redeploy)
# Run from repo root after filling scripts/.netlify-supabase-keys.json

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

Write-Host 'Step 1: URLs'
& (Join-Path $PSScriptRoot 'align-netlify-supabase-urls.ps1')

$keysPath = Join-Path $PSScriptRoot '.netlify-supabase-keys.json'
if (Test-Path $keysPath) {
  Write-Host 'Step 2: Anon keys'
  & (Join-Path $PSScriptRoot 'align-netlify-supabase-keys.ps1')
} else {
  Write-Warning 'Skip anon keys — create scripts/.netlify-supabase-keys.json from the .example file'
}

Write-Host 'Step 3: Verify metadata'
& (Join-Path $PSScriptRoot 'verify-netlify-supabase.ps1')

Write-Host 'Step 4: Production deploys'
$deploys = @(
  @{ dir = Join-Path $root 'apps\CoachCore\coachcore-static-v001'; site = 'coachcore7' },
  @{ dir = Join-Path $root 'apps\FairShare'; site = 'fairshare-v03-20260624' },
  @{ dir = Join-Path $root 'apps\MotoCrew'; site = 'motocrewz' },
  @{ dir = 'C:\Users\draco\Downloads\sermon-studio-next-patched'; site = 'sermon-studio-beta' }
)
foreach ($d in $deploys) {
  Push-Location $d.dir
  Write-Host "Deploying $($d.site) from $($d.dir)"
  netlify link --name $d.site --yes 2>&1 | Out-Null
  netlify deploy --prod --build 2>&1
  Pop-Location
}

Write-Host 'Done. Check connection panels on production URLs.'
