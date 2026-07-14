# Reads per-app anon keys from scripts/.netlify-supabase-keys.json and sets Netlify env (all contexts).
$ErrorActionPreference = 'Stop'
$keysPath = Join-Path $PSScriptRoot '.netlify-supabase-keys.json'
if (-not (Test-Path $keysPath)) {
  Write-Error "Missing $keysPath"
}

$contexts = @('production','deploy-preview','branch-deploy','dev')
$viteSites = @('fairshare-v03-20260624', 'motocrewz')
$map = Get-Content $keysPath -Raw | ConvertFrom-Json

foreach ($prop in $map.PSObject.Properties) {
  $site = $prop.Name
  $anon = [string]$prop.Value.anon
  if ($anon.Length -lt 40 -or -not $anon.StartsWith('eyJ')) {
    Write-Error "Site $site has invalid anon key in JSON"
  }
  foreach ($ctx in $contexts) {
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY $anon --site $site --context $ctx --force | Out-Null
    if ($site -in $viteSites) {
      netlify env:set VITE_SUPABASE_ANON_KEY $anon --site $site --context $ctx --force | Out-Null
    }
  }
  Write-Host "Anon key set on $site (len=$($anon.Length))"
}
