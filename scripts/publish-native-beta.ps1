# MackSims native beta publish helper
# Run from repo root: .\scripts\publish-native-beta.ps1
# Requires: keystores uploaded in Codemagic (see KEYSTORE_UPLOAD below)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$KeystoreDir = Join-Path $RepoRoot 'secrets\keystores'

Write-Host "`n=== MackSims Native Beta Publish ===" -ForegroundColor Cyan

Write-Host "`n[1] KEYSTORE UPLOAD (Codemagic UI — one-time)" -ForegroundColor Yellow
Write-Host "Open: https://codemagic.io/teams/6a3afacde3a7ffcadf5cf0f4"
Write-Host "Settings > Code signing identities > Android keystores"
Write-Host "Upload each .jks; use Reference name = filename without .jks"
Write-Host ""
if (Test-Path $KeystoreDir) {
  Get-ChildItem $KeystoreDir -Filter '*.jks' | ForEach-Object {
    $ref = $_.BaseName
    Write-Host "  - $($_.Name)  ->  reference: $ref"
  }
  $pwFile = Join-Path $KeystoreDir 'PASSWORDS.txt'
  if (Test-Path $pwFile) {
    Write-Host "`n  Passwords/aliases: $pwFile (local only, never commit)"
  }
} else {
  Write-Host "  Keystore dir missing: $KeystoreDir"
}

Write-Host "`n[2] TRIGGER CODEMAGIC BUILDS" -ForegroundColor Yellow
Write-Host "MackSims monorepo: https://codemagic.io/app/6a4c95224bd05eb987f3e1c0"
Write-Host "Workflows (master branch):"
Write-Host "  - curbcue-android-signed"
Write-Host "  - motocrew-android-signed"
Write-Host "  - coachcore-android-signed"
Write-Host "  - sermon-studio-android-signed"
Write-Host "  - curbcue-ios-signed (needs ASC app ID for com.macksims.curbcue)"
Write-Host "  - motocrew-ios-signed, coachcore-ios-signed, sermon-studio-ios-signed"
Write-Host ""
Write-Host "Legacy iOS wrappers (TestFlight auto-upload configured):"
Write-Host "  - fairshare-ios  -> Curbcue iOS TestFlight Wrapper"
Write-Host "  - throttlelink-ios -> MotoCrew"
Write-Host "  - coachcore-ios"
Write-Host "  - sermonstudio-ios"

$token = $env:CODEMAGIC_API_TOKEN
if ($token) {
  Write-Host "`n  CODEMAGIC_API_TOKEN found — triggering builds via API..." -ForegroundColor Green
  $headers = @{ 'x-auth-token' = $token; 'Content-Type' = 'application/json' }
  $appId = '6a4c95224bd05eb987f3e1c0'
  $workflows = @(
    'curbcue-android-signed',
    'motocrew-android-signed',
    'coachcore-android-signed',
    'sermon-studio-android-signed'
  )
  foreach ($wf in $workflows) {
    $body = @{ appId = $appId; workflowId = $wf; branch = 'master' } | ConvertTo-Json
    try {
      $r = Invoke-RestMethod -Method Post -Uri 'https://api.codemagic.io/builds' -Headers $headers -Body $body
      Write-Host "  Started $wf -> build $($r.buildId)"
    } catch {
      Write-Host "  FAILED $wf : $($_.Exception.Message)" -ForegroundColor Red
    }
  }
} else {
  Write-Host "  Set CODEMAGIC_API_TOKEN to auto-trigger (Account settings > API token > Show)"
}

Write-Host "`n[3] GOOGLE PLAY — closed/internal testing" -ForegroundColor Yellow
Write-Host "FairShare (CurbCue) console:"
Write-Host "  https://play.google.com/console/u/0/developers/6245841440522544747/app/4973784784637253598/tracks/internal-testing"
Write-Host "Package names (Play Console — com.chrissims.*):"
Write-Host "  com.chrissims.fairshare | com.chrissims.throttlelink | com.chrissims.coachcore | com.chrissims.sermonstudio"
Write-Host "After AAB builds finish: Testing > Internal/Closed > Create release > Upload AAB"
Write-Host "Copy opt-in URL: https://play.google.com/apps/testing/<package.name>"

Write-Host "`n[4] TESTFLIGHT EXTERNAL" -ForegroundColor Yellow
Write-Host "App Store Connect: https://appstoreconnect.apple.com/apps"
Write-Host "Per app: TestFlight > External Testing > enable public link OR add testers"
Write-Host "Submit Beta App Review for external testers (first time per app)"
Write-Host "Legacy wrappers use com.chrissims.fairshare etc. — confirm bundle IDs match ASC records"

Write-Host "`n[5] UPDATE BETA HUB" -ForegroundColor Yellow
Write-Host "Edit public-site/public/beta/index.html with real TestFlight + Play URLs"
Write-Host "Deploy: cd public-site && netlify deploy --prod --dir=public --no-build"
Write-Host ""
