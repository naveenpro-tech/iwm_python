# Setup database for Movie Madders
# This script will create the database and run migrations

Write-Host "`n=== Movie Madders Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envPath = "apps\backend\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    # Prompt for database credentials
    Write-Host "`nPlease enter your PostgreSQL credentials:" -ForegroundColor Cyan
    $dbUser = Read-Host "PostgreSQL username (default: postgres)"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }
    
    $dbPassword = Read-Host "PostgreSQL password" -AsSecureString
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    )
    
    $dbHost = Read-Host "PostgreSQL host (default: localhost)"
    if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }
    
    $dbPort = Read-Host "PostgreSQL port (default: 5432)"
    if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }
    
    # Create .env file
    $envContent = @"
DATABASE_URL=postgresql+asyncpg://${dbUser}:${dbPasswordPlain}@${dbHost}:${dbPort}/moviemadders_local
JWT_SECRET_KEY=dev-secret-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXP_MINUTES=30
REFRESH_TOKEN_EXP_DAYS=7
CORS_ORIGINS=["http://localhost:3000"]
"@
    
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✓ .env file created" -ForegroundColor Green
}
else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Manually create the database using pgAdmin or psql:" -ForegroundColor White
Write-Host "   CREATE DATABASE moviemadders_local;" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run migrations:" -ForegroundColor White
Write-Host "   cd apps\backend" -ForegroundColor Gray
Write-Host "   ..\..\apps\backend\venv\Scripts\activate" -ForegroundColor Gray
Write-Host "   alembic upgrade head" -ForegroundColor Gray
Write-Host ""
