# Resize App Store 1024 icons to Play 512 icons
# Run: .\scripts\prepare-play-icons.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot
$AppleRoot = Join-Path $Root 'docs\store-launch\app-store-assets'
$PlayRoot = Join-Path $Root 'docs\store-launch\play-assets'

$apps = @('curbcue', 'motocrew', 'coachcore', 'sermonstudio')

foreach ($app in $apps) {
  $src = Join-Path $AppleRoot "$app\icon-1024.png"
  if (-not (Test-Path $src)) {
    Write-Warning "Missing $src - run: node scripts/capture-app-store-screens.mjs $app"
    continue
  }
  $destDir = Join-Path $PlayRoot $app
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  $dest = Join-Path $destDir 'icon-512.png'

  $img = [System.Drawing.Image]::FromFile($src)
  $bmp = New-Object System.Drawing.Bitmap 512, 512
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, 512, 512)
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
  Write-Host ('Wrote ' + $dest)
}

Write-Host ''
Write-Host 'Play icons ready under docs/store-launch/play-assets/<app>/icon-512.png'
