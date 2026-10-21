$export = Get-Content -Raw "data\shopify_export.json" | ConvertFrom-Json
$destDir = "assets\images"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir }

$count = 0
foreach ($p in $export.products) {
    if ($p.images) {
        $idx = 1
        foreach ($img in $p.images) {
            $cleanUrl = $img.src.Split('?')[0]
            $ext = [System.IO.Path]::GetExtension($cleanUrl)
            if ([string]::IsNullOrEmpty($ext)) { $ext = ".jpg" }
            $safeTitle = $p.handle -replace '[^a-zA-Z0-9_-]', '_'
            $filename = "$safeTitle-$idx$ext"
            $targetPath = Join-Path $destDir $filename

            if (!(Test-Path $targetPath)) {
                Write-Output "Downloading $filename..."
                curl.exe -s -m 10 "$($img.src)" -o "$targetPath"
            } else {
                Write-Output "Already exists: $filename"
            }
            $idx++
            $count++
        }
    }
}
Write-Output "Done! Total images processed: $count"
