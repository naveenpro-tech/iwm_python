# PowerShell script to run database migrations on Render PostgreSQL from local machine
# Usage: .\scripts\run-production-migrations.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Movie Madders - Production DB Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set the production database URL
$DATABASE_URL = "postgresql://moviemadders_db_user:qk3VnGolSO2M2ZeohlXKfzdahmLgnRnP@dpg-d450gci4d50c73ervgl0-a.oregon-postgres.render.com/moviemadders_db"

Write-Host "Setting DATABASE_URL environment variable..." -ForegroundColor Yellow
$env:DATABASE_URL = $DATABASE_URL

Write-Host "✓ DATABASE_URL set" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "apps\backend\alembic.ini")) {
    Write-Host "ERROR: Please run this script from the project root directory (c:\iwm\v142)" -ForegroundColor Red
    exit 1
}

Write-Host "Checking Python virtual environment..." -ForegroundColor Yellow

# Check if venv exists
if (-not (Test-Path "venv\Scripts\activate.ps1")) {
    Write-Host "ERROR: Python virtual environment not found at .\venv" -ForegroundColor Red
    Write-Host "Please create a virtual environment first:" -ForegroundColor Yellow
    Write-Host "  python -m venv venv" -ForegroundColor White
    exit 1
}

Write-Host "✓ Virtual environment found" -ForegroundColor Green
Write-Host ""

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

Write-Host "✓ Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Write-Host "Navigating to backend directory..." -ForegroundColor Yellow
Set-Location "apps\backend"

Write-Host "✓ In backend directory" -ForegroundColor Green
Write-Host ""

# Check if alembic is installed
Write-Host "Checking if Alembic is installed..." -ForegroundColor Yellow
$alembicCheck = & python -c "import alembic; print('OK')" 2>&1

if ($alembicCheck -ne "OK") {
    Write-Host "ERROR: Alembic not installed" -ForegroundColor Red
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

Write-Host "✓ Alembic is installed" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running Database Migrations..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

alembic upgrade head

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Migration Status..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

alembic current

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify migrations in Render Dashboard" -ForegroundColor White
Write-Host "2. Test your application at https://iwm-python.vercel.app/" -ForegroundColor White
Write-Host "3. Try signing up for a new account" -ForegroundColor White
Write-Host ""

# Return to project root
Set-Location "..\..\"

Write-Host "Done! Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

