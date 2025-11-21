$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

Write-Host "Listing all databases in PostgreSQL 16:" -ForegroundColor Cyan
Write-Host ""

# List all databases
& $psqlPath -U postgres -l

Write-Host ""
Write-Host "To create moviemadders_local database, you need to provide the PostgreSQL password" -ForegroundColor Yellow
