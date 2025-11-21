# Fix movie detail page to fetch real data
$filePath = "app\movies\[id]\page.tsx"
$content = Get-Content $filePath -Encoding UTF8

#Replace the lines
$newContent = @()
foreach ($line in $content) {
    if ($line -match "const useBackend = process\.env\.NEXT_PUBLIC_ENABLE_BACKEND") {
        # Skip this line
    }
    elseif ($line -match "if \(\!useBackend \|\| \!apiBase\)") {
        # Replace with simpler check
        $newContent += $line -replace "if \(\!useBackend \|\| \!apiBase\)", "if (!apiBase)"
    }
    else {
        $newContent += $line
    }
}

Set-Content $filePath -Value $newContent -Encoding UTF8
Write-Host "Fixed movie detail page environment check"
