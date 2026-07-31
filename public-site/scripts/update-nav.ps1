$root = Join-Path $PSScriptRoot '..\public' | Resolve-Path
$skip = @('index.html', 'products\index.html', 'about\index.html')

$companyCol = @"
        <div class="footer-col">
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="/products/">All products</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/beta/">Beta disclaimer</a></li>
          </ul>
        </div>
"@

Get-ChildItem $root -Recurse -Filter '*.html' | ForEach-Object {
  $rel = $_.FullName.Substring($root.Path.Length + 1)
  if ($skip -contains $rel) { return }

  $c = Get-Content $_.FullName -Raw
  $orig = $c

  $c = $c.Replace('href="/#products" aria-current="page"', 'href="/products/" aria-current="page"')
  $c = $c.Replace('href="/#products"', 'href="/products/"')
  $c = $c.Replace('href="/#about"', 'href="/about/"')

  if ($c -notmatch 'href="/about/"') {
    $c = $c -replace '(<a href="/products/"[^>]*>Products</a>\r?\n)', "`$1        <a href=""/about/"">About</a>`r`n"
  }

  $c = $c.Replace('<a class="btn" href="/">All products</a>', '<a class="btn" href="/products/">All products</a>')

  if ($c -notmatch '<h4>Company</h4>') {
    $c = $c.Replace(
      "          <p>Real-world software for communities, teams, creators, and local operators.</p>`r`n        </div>`r`n        <div class=""footer-col"">`r`n          <h4>Products</h4>",
      "          <p>Real-world software for communities, teams, creators, and local operators.</p>`r`n        </div>`r`n$companyCol        <div class=""footer-col"">`r`n          <h4>Products</h4>"
    )
    $c = $c.Replace("            <li><a href=""/account-deletion/"">Account deletion</a></li>`r`n            <li><a href=""/beta/"">Beta disclaimer</a></li>", '            <li><a href="/account-deletion/">Account deletion</a></li>')
  }

  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($_.FullName, $c)
    Write-Output "Updated: $rel"
  }
}
