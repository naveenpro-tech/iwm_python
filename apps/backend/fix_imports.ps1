# Fix imports in critic router files
$files = @(
    "src\routers\critic_affiliate.py",
    "src\routers\critic_brand_deals.py",
    "src\routers\critic_pinned.py",
    "src\routers\critic_recommendations.py"
)

foreach ($file in $files) {
    (Get-Content $file) -replace 'from \.\.dependencies import get_current_user', 'from ..dependencies.auth import get_current_user' | Set-Content $file
    Write-Host "Fixed $file"
}

Write-Host "All files fixed!"

