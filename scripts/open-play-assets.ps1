# Open Play Store asset folders + listing pages for tier-3 apps
# Run: .\scripts\open-play-assets.ps1

$Root = Split-Path -Parent $PSScriptRoot
$Assets = Join-Path $Root 'docs\store-launch\play-assets'
$Dev = '6245841440522544747'

$apps = @(
  @{ key = 'curbcue'; play = 'FairShare'; id = '4973784784637253598' },
  @{ key = 'motocrew'; play = 'ThrottleLink'; id = '4973807688393588463' },
  @{ key = 'coachcore'; play = 'CoachCore'; id = '4973388644367502581' },
  @{ key = 'sermonstudio'; play = 'Sermon Studio'; id = '4972609657779602718' }
)

Write-Host "`n=== Play Store assets ===" -ForegroundColor Cyan
Write-Host "Per app folder contains:"
Write-Host "  phone\*.png        - 4-5 phone screenshots (~1080x2340)"
Write-Host "  tablet-7\*.png     - 4-5 seven-inch tablet screenshots (~1080x1728)"
Write-Host "  tablet-10\*.png    - 4-5 ten-inch tablet screenshots (1080x1920)"
Write-Host "  icon-512.png       - App icon"
Write-Host "  feature-1024x500.png - Feature graphic"
Write-Host ""

foreach ($a in $apps) {
  $dir = Join-Path $Assets $a.key
  $url = "https://play.google.com/console/u/0/developers/$Dev/app/$($a.id)/main-store-listing"
  Write-Host "$($a.play) ($($a.key))" -ForegroundColor Yellow
  Write-Host "  Folder: $dir"
  Write-Host "  Listing: $url"
  if (Test-Path $dir) { explorer.exe $dir }
  Start-Process $url
}

Write-Host "`nUpload order on each listing page:" -ForegroundColor Green
Write-Host "  1. App icon -> icon-512.png"
Write-Host "  2. Feature graphic -> feature-1024x500.png"
Write-Host "  3. Phone screenshots -> all files in phone\ (multi-select)"
Write-Host "  4. 7-inch tablet -> all files in tablet-7\ (multi-select)"
Write-Host "  5. 10-inch tablet -> all files in tablet-10\ (multi-select)"
Write-Host "  6. Click Save at bottom"
Write-Host ""
Write-Host "Re-capture: node scripts/capture-play-store-screens.mjs all"
Write-Host "Tablets only: node scripts/capture-play-store-screens.mjs all tablets"
Write-Host ""
