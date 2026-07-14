# Paste anon keys from your open Supabase tabs (Settings -> API -> anon public).
# Save as scripts/.netlify-supabase-keys.json then run:
#   powershell -File scripts/import-keys-from-browser-helper.ps1
#
# Quick fill: with a Supabase API page focused, copy the anon key, then run
# this script with -Site and it reads clipboard into the JSON file.

param(
  [Parameter(Mandatory=$true)]
  [ValidateSet('coachcore7','fairshare-v03-20260624','motocrewz','sermon-studio-beta')]
  [string]$Site
)

$ErrorActionPreference = 'Stop'
$keysPath = Join-Path $PSScriptRoot '.netlify-supabase-keys.json'
$example = Join-Path $PSScriptRoot '.netlify-supabase-keys.json.example'
if (-not (Test-Path $keysPath)) {
  Copy-Item $example $keysPath
}
$anon = (Get-Clipboard -Raw).Trim()
if ($anon.Length -lt 40 -or -not $anon.StartsWith('eyJ')) {
  Write-Error "Clipboard does not look like a Supabase anon JWT. Copy from Supabase API settings first."
}
$map = Get-Content $keysPath -Raw | ConvertFrom-Json
$map.$Site = @{ anon = $anon }
$map | ConvertTo-Json -Depth 3 | Set-Content $keysPath -Encoding UTF8
Write-Host "Stored anon key for $Site (len=$($anon.Length)). Repeat for other sites, then run align-netlify-supabase-keys.ps1"
