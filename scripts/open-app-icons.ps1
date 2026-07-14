# Open Apple + Play icon upload pages and select local icon files (same workflow as last time).
# Run: .\scripts\open-app-icons.ps1
# Does NOT auto-submit listings — drag the selected icon into each console slot, then Save.

$Root = Split-Path -Parent $PSScriptRoot
$AppleAssets = Join-Path $Root 'docs\store-launch\app-store-assets'
$PlayAssets = Join-Path $Root 'docs\store-launch\play-assets'
$Dev = '6245841440522544747'

$apps = @(
  @{ key = 'fishcrew'; name = 'FishCrew'; asc = '6783567028'; play = $null },
  @{ key = 'shutterbid'; name = 'ShutterBid'; asc = '6783551944'; play = $null },
  @{ key = 'curbcue'; name = 'Curbcue'; asc = '6787820297'; play = '4973784784637253598' },
  @{ key = 'motocrew'; name = 'ThrottleLink'; asc = '6787821088'; play = '4973807688393588463' },
  @{ key = 'coachcore'; name = 'CoachCore'; asc = '6787821608'; play = '4973388644367502581' },
  @{ key = 'sermonstudio'; name = 'Sermon Studio'; asc = '6787823019'; play = '4972609657779602718' }
)

Write-Host ''
Write-Host '=== Store icon upload (Aegis-family icons) ===' -ForegroundColor Cyan
Write-Host 'Apple: App Information -> App Icon -> drag icon-1024.png'
Write-Host 'Play:  Main store listing -> App icon -> drag icon-512.png -> SAVE'
Write-Host 'Sign in as simsc32@gmail.com if prompted.'
Write-Host ''

foreach ($a in $apps) {
  $appleIcon = Join-Path $AppleAssets "$($a.key)\icon-1024.png"
  $playIcon = Join-Path $PlayAssets "$($a.key)\icon-512.png"
  $ascUrl = "https://appstoreconnect.apple.com/apps/$($a.asc)/distribution/info"

  Write-Host $a.name -ForegroundColor Yellow
  Write-Host "  Apple icon: $appleIcon"
  Write-Host "  ASC: $ascUrl"
  if (Test-Path $appleIcon) { explorer.exe '/select,' $appleIcon }
  Start-Process $ascUrl

  if ($a.play) {
    $playUrl = "https://play.google.com/console/u/0/developers/$Dev/app/$($a.play)/main-store-listing"
    Write-Host "  Play icon:  $playIcon"
    Write-Host "  Play: $playUrl"
    if (Test-Path $playIcon) { explorer.exe '/select,' $playIcon }
    Start-Process $playUrl
  } else {
    Write-Host '  Play: no console app ID on file — Apple only for now' -ForegroundColor DarkYellow
  }
  Write-Host ''
  Start-Sleep -Milliseconds 800
}

Write-Host 'Drag each selected file into the matching open console tab, then Save.' -ForegroundColor Green
Write-Host 'Aegis Intel + MomentPick icons are exported locally but have no store app IDs yet.' -ForegroundColor DarkYellow
