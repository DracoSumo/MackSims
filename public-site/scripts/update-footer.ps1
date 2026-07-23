$root = (Resolve-Path (Join-Path $PSScriptRoot '..\public')).Path
$skip = @('index.html', 'products\index.html', 'about\index.html')

$companyCol = @'
        <div class="footer-col">
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="/products/">All products</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/beta/">Beta disclaimer</a></li>
          </ul>
        </div>
'@

$marker = '<p>Real-world software for communities, teams, creators, and local operators.</p>'
$productsStart = '        <div class="footer-col">
          <h4>Products</h4>'

Get-ChildItem $root -Recurse -Filter '*.html' | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  if ($skip -contains $rel) { return }

  $c = [System.IO.File]::ReadAllText($_.FullName)
  if ($c -match '<h4>Company</h4>') { return }

  $normalized = $c -replace "`r`n", "`n"
  $search = ($marker + "`n        </div>`n" + $productsStart) -replace "`r`n", "`n"
  $replace = ($marker + "`n        </div>`n" + $companyCol + $productsStart) -replace "`r`n", "`n"

  if ($normalized.Contains($search)) {
    $normalized = $normalized.Replace($search, $replace)
    $normalized = $normalized.Replace(
      "            <li><a href=`"/account-deletion/`">Account deletion</a></li>`n            <li><a href=`"/beta/`">Beta disclaimer</a></li>",
      '            <li><a href="/account-deletion/">Account deletion</a></li>'
    )
    [System.IO.File]::WriteAllText($_.FullName, $normalized.Replace("`n", "`r`n"))
    Write-Output "Footer updated: $rel"
  } else {
    Write-Output "Footer skip (no match): $rel"
  }
}
