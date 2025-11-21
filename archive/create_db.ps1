# Create PostgreSQL database for Movie Madders
$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

Write-Host "Creating database: moviemadders_local" -ForegroundColor Cyan

& $psqlPath -U postgres -c "CREATE DATABASE moviemadders_local;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Note: Database may already exist or check PostgreSQL password" -ForegroundColor Yellow
}
