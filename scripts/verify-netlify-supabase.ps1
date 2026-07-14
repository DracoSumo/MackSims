# Verifies Netlify Supabase anon keys without printing secret values.
# Uses NETLIFY_SITE_ID + env:list --json (env:get --site is unreliable on current CLI).
$ErrorActionPreference = 'Stop'
$sites = @(
  @{ Name='coachcore7'; Id='b8885541-5a95-4e01-8ba8-3ccb27e1e60f' },
  @{ Name='fairshare-v03-20260624'; Id='f81df982-2348-4d3c-b842-fb806b1b4b00' },
  @{ Name='motocrewz'; Id='94099ea3-9d62-4c02-9ab3-5162c59282a7' },
  @{ Name='sermon-studio-beta'; Id='f695214f-1e22-429a-86ac-5adac2822414' }
)
$expected = @{
  'coachcore7'='bfqfbkldxbojrrxeidcc'
  'fairshare-v03-20260624'='dsbwqxhqktzsdleeobbi'
  'motocrewz'='npmiwnxnqgonnmwvblyi'
  'sermon-studio-beta'='zipxwqkmenapnckwyzrh'
}

foreach ($site in $sites) {
  $name = $site.Name
  $env:NETLIFY_SITE_ID = $site.Id
  $envJson = netlify env:list --json | ConvertFrom-Json
  $url = [string]$envJson.NEXT_PUBLIC_SUPABASE_URL
  if (-not $url) { $url = [string]$envJson.VITE_SUPABASE_URL }
  $key = [string]$envJson.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (-not $key) { $key = [string]$envJson.VITE_SUPABASE_ANON_KEY }
  $ref = if ($url -match 'https://([^.]+)\.supabase\.co') { $Matches[1] } else { 'invalid-url' }
  $jwtRef = 'n/a'
  if ($key -match '^eyJ') {
    $payload = $key.Split('.')[1]
    $pad = '=' * ((4 - ($payload.Length % 4)) % 4)
    try {
      $json = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(($payload + $pad).Replace('-','+').Replace('_','/')))
      if ($json -match '"ref"\s*:\s*"([^"]+)"') { $jwtRef = $Matches[1] }
    } catch { $jwtRef = 'decode-failed' }
  }
  $valid = ($key.Length -gt 40 -and $key.StartsWith('eyJ') -and -not $key.Contains('your-anon-key'))
  $match = ($ref -eq $expected[$name] -and $jwtRef -eq $expected[$name])
  Write-Host "$name urlRef=$ref jwtRef=$jwtRef keyLen=$($key.Length) validJwt=$valid projectMatch=$match"
}
Remove-Item Env:NETLIFY_SITE_ID -ErrorAction SilentlyContinue
