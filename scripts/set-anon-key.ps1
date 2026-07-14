param(
  [Parameter(Mandatory=$true)][string]$Site,
  [Parameter(Mandatory=$true)][string]$ExpectedRef,
  [Parameter(Mandatory=$true)][string]$AnonKey,
  [switch]$ViteMirror
)
$ErrorActionPreference = 'Stop'
$anon = $AnonKey.Trim()
if ($anon.Length -lt 40 -or -not $anon.StartsWith('eyJ')) { Write-Error 'Invalid anon JWT' }
$payload = $anon.Split('.')[1]
$pad = '=' * ((4 - ($payload.Length % 4)) % 4)
$json = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(($payload + $pad).Replace('-','+').Replace('_','/')))
if ($json -notmatch '"ref"\s*:\s*"([^"]+)"' -or $Matches[1] -ne $ExpectedRef) {
  Write-Error "JWT ref mismatch. Expected $ExpectedRef"
}
foreach ($ctx in @('production','deploy-preview','branch-deploy','dev')) {
  netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY $anon --site $Site --context $ctx --force | Out-Null
  if ($ViteMirror) { netlify env:set VITE_SUPABASE_ANON_KEY $anon --site $Site --context $ctx --force | Out-Null }
}
Write-Host "Set anon on $Site for $ExpectedRef (len=$($anon.Length))"
