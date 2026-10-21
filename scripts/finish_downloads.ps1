$remaining = @(
  @{ name='mosaic-mirror-art-3.png'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/1772728255442.png?v=1772739004' },
  @{ name='premium-upholstered-frame-1.jpg'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/WhatsAppImage2026-09-18at3.57.23PM.jpg?v=1790321070' },
  @{ name='venetian-mirror-1.jpg'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/20260222_092621.jpg?v=1771733529' },
  @{ name='venetian-mirror-2.jpg'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/20260222_092831.jpg?v=1771733529' },
  @{ name='venetian-mirror-3.jpg'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/IMG-20260117-WA0048_1.jpg?v=1771733529' },
  @{ name='silver-crown-framed-1.webp'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/20260221_235950.webp?v=1771748442' },
  @{ name='silver-crown-framed-2.webp'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/20260222_000512.webp?v=1771748442' },
  @{ name='silver-crown-framed-3.webp'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/20260222_000109.webp?v=1771748442' },
  @{ name='silver-crown-framed-4.webp'; url='https://cdn.shopify.com/s/files/1/0718/6304/2137/files/1771692695124.webp?v=1771748442' }
)

foreach ($item in $remaining) {
    Write-Output "Downloading $($item.name)..."
    curl.exe -s -m 30 -L "$($item.url)" -o "assets\images\$($item.name)"
}
$cnt = (Get-ChildItem assets\images).Count
Write-Output "FINISHED! Total images count: $cnt"
