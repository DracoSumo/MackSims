# Open App Store Connect asset folders + listing pages for tier-3 apps
# Run: .\scripts\open-app-store-assets.ps1

$Root = Split-Path -Parent $PSScriptRoot
$Assets = Join-Path $Root 'docs\store-launch\app-store-assets'

$apps = @(
  @{ key = 'curbcue'; name = 'Curbcue'; asc = '6787820297' },
  @{ key = 'motocrew'; name = 'ThrottleLink'; asc = '6787821088' },
  @{ key = 'coachcore'; name = 'CoachCore'; asc = '6787821608' },
  @{ key = 'sermonstudio'; name = 'Sermon Studio'; asc = '6787823019' }
)

Write-Host "`n=== App Store Connect assets ===" -ForegroundColor Cyan
Write-Host "Per app folder contains:"
Write-Host "  iphone-6.7\*.png  - 1290x2796 screenshots (required)"
Write-Host "  ipad-12.9\*.png   - 2048x2732 screenshots (recommended)"
Write-Host "  icon-1024.png     - App Store icon"
Write-Host ""
Write-Host "Re-capture: node scripts/capture-app-store-screens.mjs all"
Write-Host ""

foreach ($a in $apps) {
  $dir = Join-Path $Assets $a.key
  $prep = "https://appstoreconnect.apple.com/apps/$($a.asc)/distribution/ios/version/inflight"
  $icon = "https://appstoreconnect.apple.com/apps/$($a.asc)/distribution/info"
  Write-Host "$($a.name) ($($a.key))" -ForegroundColor Yellow
  Write-Host "  Folder: $dir"
  Write-Host "  Screenshots: $prep"
  Write-Host "  App icon: $icon"
  if (Test-Path $dir) { explorer.exe $dir }
  Start-Process $prep
}

Write-Host "`nUpload order (each app):" -ForegroundColor Green
Write-Host "  1. App Information -> App Icon -> icon-1024.png"
Write-Host "  2. iOS App version -> Screenshots -> 6.7 inch -> drag all iphone-6.7\*.png"
Write-Host "  3. Optional: 12.9 inch iPad -> drag all ipad-12.9\*.png"
Write-Host "  4. Save"
Write-Host ""
