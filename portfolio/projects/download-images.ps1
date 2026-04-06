# Скачивает фото Unsplash в локальные папки images/ (запуск из каталога projects)
# Лицензия Unsplash: https://unsplash.com/license
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$items = @(
  @{ Path = "neon\images\coffee.jpg"; Url = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&w=1200&q=85" },
  @{ Path = "minima\images\architecture.jpg"; Url = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&w=1200&q=85" },
  @{ Path = "magic\images\kids.jpg"; Url = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&w=1200&q=85" },
  @{ Path = "prana\images\yoga.jpg"; Url = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&w=1200&q=85" },
  @{ Path = "meme\images\phones.jpg"; Url = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&w=1200&q=85" },
  @{ Path = "future\images\fashion-1.jpg"; Url = "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&w=900&q=85" },
  @{ Path = "future\images\fashion-2.jpg"; Url = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&w=900&q=85" },
  @{ Path = "future\images\fashion-3.jpg"; Url = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&w=900&q=85" },
  @{ Path = "mechanic\images\garage.jpg"; Url = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&w=1200&q=85" }
)
foreach ($it in $items) {
  $dir = Split-Path (Join-Path $root $it.Path) -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $out = Join-Path $root $it.Path
  Write-Host "Downloading $($it.Path)..."
  curl.exe -L $it.Url -o $out
  if (-not (Test-Path $out)) { throw "Failed: $out" }
}
Write-Host "Done."
