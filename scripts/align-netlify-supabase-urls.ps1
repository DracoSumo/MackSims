# Sets per-app Supabase URLs on Netlify (all contexts).
$ErrorActionPreference = 'Stop'
$contexts = @('production','deploy-preview','branch-deploy','dev')
$alignments = @(
  @{ Site = 'coachcore7'; Url = 'https://bfqfbkldxbojrrxeidcc.supabase.co' },
  @{ Site = 'fairshare-v03-20260624'; Url = 'https://dsbwqxhqktzsdleeobbi.supabase.co' },
  @{ Site = 'motocrewz'; Url = 'https://npmiwnxnqgonnmwvblyi.supabase.co' },
  @{ Site = 'sermon-studio-beta'; Url = 'https://zipxwqkmenapnckwyzrh.supabase.co' }
)

foreach ($row in $alignments) {
  foreach ($ctx in $contexts) {
    netlify env:set NEXT_PUBLIC_SUPABASE_URL $row.Url --site $row.Site --context $ctx --force | Out-Null
    netlify env:set SUPABASE_URL $row.Url --site $row.Site --context $ctx --force | Out-Null
    if ($row.Site -in @('fairshare-v03-20260624', 'motocrewz')) {
      netlify env:set VITE_SUPABASE_URL $row.Url --site $row.Site --context $ctx --force | Out-Null
    }
  }
  Write-Host "URLs set for $($row.Site)"
}
