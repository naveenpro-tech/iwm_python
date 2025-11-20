Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creating .env Configuration File" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for password
Write-Host "Please enter your PostgreSQL password (for .env file):" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# Create .env content
$envContent = @"
DATABASE_URL=postgresql+asyncpg://postgres:$passwordPlain@localhost:5432/moviemadders_local
JWT_SECRET_KEY=dev-secret-change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7
CORS_ORIGINS=["http://localhost:3000"]
"@

# Write to file
$envPath = "apps\backend\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "SUCCESS! .env file created at: $envPath" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Database: moviemadders_local" -ForegroundColor White
Write-Host "  Host: localhost:5432" -ForegroundColor White
Write-Host "  User: postgres" -ForegroundColor White
Write-Host ""
