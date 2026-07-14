# Build locally with per-app Supabase env from JSON, deploy prebuilt assets (no remote build).
$ErrorActionPreference = 'Stop'
$keysPath = Join-Path $PSScriptRoot '.netlify-supabase-keys.json'
$map = Get-Content $keysPath -Raw | ConvertFrom-Json

$deploys = @(
  @{
    Site = 'coachcore7'
    Id = 'b8885541-5a95-4e01-8ba8-3ccb27e1e60f'
    Ref = 'bfqfbkldxbojrrxeidcc'
    Dir = 'C:\Users\draco\Downloads\MackSims\apps\CoachCore\coachcore-static-v001'
    Publish = 'out'
    Vite = $false
  },
  @{
    Site = 'fairshare-v03-20260624'
    Id = 'f81df982-2348-4d3c-b842-fb806b1b4b00'
    Ref = 'dsbwqxhqktzsdleeobbi'
    Dir = 'C:\Users\draco\Downloads\MackSims\apps\FairShare'
    Publish = 'dist'
    Vite = $true
  },
  @{
    Site = 'motocrewz'
    Id = '94099ea3-9d62-4c02-9ab3-5162c59282a7'
    Ref = 'npmiwnxnqgonnmwvblyi'
    Dir = 'C:\Users\draco\Downloads\MackSims\apps\MotoCrew'
    Publish = 'dist'
    Vite = $true
  },
  @{
    Site = 'sermon-studio-beta'
    Id = 'f695214f-1e22-429a-86ac-5adac2822414'
    Ref = 'zipxwqkmenapnckwyzrh'
    Dir = 'C:\Users\draco\Downloads\sermon-studio-next-patched'
    Publish = '.next'
    Vite = $false
    NextJs = $true
  }
)

foreach ($d in $deploys) {
  $url = "https://$($d.Ref).supabase.co"
  $anon = [string]$map.($d.Site).anon
  Write-Host "=== $($d.Site) ($($d.Ref)) ==="

  Push-Location $d.Dir
  $env:NEXT_PUBLIC_SUPABASE_URL = $url
  $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $anon
  $env:SUPABASE_URL = $url
  if ($d.Vite) {
    $env:VITE_SUPABASE_URL = $url
    $env:VITE_SUPABASE_ANON_KEY = $anon
  }

  if ($d.NextJs) {
    # Next.js on Netlify: plugin runs build; site env vars + SECRETS_SCAN_OMIT_KEYS bake anon key into bundle.
    netlify deploy --prod --site $d.Id
  } else {
    npm run build
    # Static/Vite: local build bakes per-app keys; --no-build prevents remote rebuild overwriting them.
    netlify deploy --prod --dir $d.Publish --site $d.Id --no-build
  }
  Pop-Location
  Write-Host "Deployed $($d.Site)"
}
