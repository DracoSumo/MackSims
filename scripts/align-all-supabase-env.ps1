# Per-app Supabase alignment using site IDs + post-set verification.
# NOTE: netlify-cli (observed) often ignores --site for env:get/unset; use NETLIFY_SITE_ID.
$ErrorActionPreference = 'Stop'
$contexts = @('production','deploy-preview','branch-deploy','dev')
$keysPath = Join-Path $PSScriptRoot '.netlify-supabase-keys.json'
$map = Get-Content $keysPath -Raw | ConvertFrom-Json

$apps = @(
  @{ Site = 'coachcore7'; Id = 'b8885541-5a95-4e01-8ba8-3ccb27e1e60f'; Ref = 'bfqfbkldxbojrrxeidcc'; Vite = $false },
  @{ Site = 'fairshare-v03-20260624'; Id = 'f81df982-2348-4d3c-b842-fb806b1b4b00'; Ref = 'dsbwqxhqktzsdleeobbi'; Vite = $true },
  @{ Site = 'motocrewz'; Id = '94099ea3-9d62-4c02-9ab3-5162c59282a7'; Ref = 'npmiwnxnqgonnmwvblyi'; Vite = $true },
  @{ Site = 'sermon-studio-beta'; Id = 'f695214f-1e22-429a-86ac-5adac2822414'; Ref = 'zipxwqkmenapnckwyzrh'; Vite = $false }
)

foreach ($app in $apps) {
  $url = "https://$($app.Ref).supabase.co"
  $anon = [string]$map.($app.Site).anon
  if ($anon.Length -lt 40) { Write-Error "Missing anon for $($app.Site)" }

  $env:NETLIFY_SITE_ID = $app.Id
  foreach ($ctx in $contexts) {
    netlify env:set NEXT_PUBLIC_SUPABASE_URL $url --context $ctx --force | Out-Null
    netlify env:set SUPABASE_URL $url --context $ctx --force | Out-Null
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY $anon --context $ctx --force | Out-Null
    if ($app.Vite) {
      netlify env:set VITE_SUPABASE_URL $url --context $ctx --force | Out-Null
      netlify env:set VITE_SUPABASE_ANON_KEY $anon --context $ctx --force | Out-Null
    } else {
      # Sermon/CoachCore are not Vite — drop polluted VITE_* if present
      netlify env:unset VITE_SUPABASE_URL --force 2>$null | Out-Null
      netlify env:unset VITE_SUPABASE_ANON_KEY --force 2>$null | Out-Null
    }
  }

  Start-Sleep -Seconds 2
  $envJson = netlify env:list --json | ConvertFrom-Json
  $gotUrl = [string]$envJson.NEXT_PUBLIC_SUPABASE_URL
  if ($gotUrl -ne $url) {
    Write-Error "URL mismatch on $($app.Site): expected $url got $gotUrl"
  }
  Write-Host "OK $($app.Site) -> $($app.Ref)"
}
Remove-Item Env:NETLIFY_SITE_ID -ErrorAction SilentlyContinue
