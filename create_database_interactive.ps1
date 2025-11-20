$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creating moviemadders_local Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for password
Write-Host "Please enter your PostgreSQL password:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# Set password as environment variable
$env:PGPASSWORD = $passwordPlain

Write-Host ""
Write-Host "Attempting to create database..." -ForegroundColor Cyan

# Try to create database
$output = & $psqlPath -U postgres -c "CREATE DATABASE moviemadders_local;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Database 'moviemadders_local' created!" -ForegroundColor Green
    Write-Host ""
    
    # Verify database exists
    Write-Host "Verifying database..." -ForegroundColor Cyan
    & $psqlPath -U postgres -l | Select-String "moviemadders_local"
    
    Write-Host ""
    Write-Host "Next step: Run migrations to create tables" -ForegroundColor Yellow
    Write-Host "Command: cd apps\backend && .\venv\Scripts\activate && alembic upgrade head" -ForegroundColor Gray
}
else {
    Write-Host ""
    Write-Host "Database creation failed!" -ForegroundColor Red
    Write-Host "Error: $output" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create the database manually using pgAdmin:" -ForegroundColor Yellow
    Write-Host "1. Open pgAdmin 4" -ForegroundColor White
    Write-Host "2. Connect to PostgreSQL 16" -ForegroundColor White
    Write-Host "3. Right-click Databases -> Create -> Database" -ForegroundColor White
    Write-Host "4. Name: moviemadders_local" -ForegroundColor White
    Write-Host "5. Click Save" -ForegroundColor White
}

# Clear password from environment
$env:PGPASSWORD = $null

Write-Host ""
