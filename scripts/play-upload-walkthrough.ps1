# Step-by-step Play Store graphics upload for one app
# Usage: .\scripts\play-upload-walkthrough.ps1 curbcue
# Opens listing page + walks you through each asset slot.

param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('curbcue', 'motocrew', 'coachcore', 'sermonstudio')]
  [string]$App
)

$Root = Split-Path -Parent $PSScriptRoot
$Assets = Join-Path $Root 'docs\store-launch\play-assets'
$Dev = '6245841440522544747'

$map = @{
  curbcue      = @{ play = 'FairShare (Curbcue)'; id = '4973784784637253598' }
  motocrew     = @{ play = 'ThrottleLink (MotoCrew)'; id = '4973807688393588463' }
  coachcore    = @{ play = 'CoachCore'; id = '4973388644367502581' }
  sermonstudio = @{ play = 'Sermon Studio'; id = '4972609657779602718' }
}

$dir = Join-Path $Assets $App
$url = "https://play.google.com/console/u/0/developers/$Dev/app/$($map[$App].id)/main-store-listing"

Write-Host "`n=== $($map[$App].play) — graphics upload ===" -ForegroundColor Cyan
Write-Host "Listing: $url"
Write-Host "Assets:  $dir`n"

$steps = @(
  @{ slot = 'App icon'; file = Join-Path $dir 'icon-512.png' }
  @{ slot = 'Feature graphic'; file = Join-Path $dir 'feature-1024x500.png' }
  @{ slot = 'Phone screenshots (multi-select all)'; file = Join-Path $dir 'phone' }
  @{ slot = '7-inch tablet (multi-select all)'; file = Join-Path $dir 'tablet-7' }
  @{ slot = '10-inch tablet (multi-select all)'; file = Join-Path $dir 'tablet-10' }
)

$i = 1
foreach ($s in $steps) {
  Write-Host "[$i/5] $($s.slot)" -ForegroundColor Yellow
  Write-Host "      -> $($s.file)"
  if (Test-Path $s.file) {
    explorer.exe /select,"$((Get-Item $s.file).FullName)"
  } else {
    Write-Host "      MISSING — run: node scripts/capture-play-store-screens.mjs all" -ForegroundColor Red
  }
  if ($i -lt 5) {
    $null = Read-Host "      Press Enter after uploading this slot in Play Console"
  }
  $i++
}

Write-Host "`n[6] Scroll to bottom of listing page and click SAVE." -ForegroundColor Green
Write-Host "Then store settings: privacy https://macksims.com/privacy, email feedback@macksims.com`n"
Start-Process $url
