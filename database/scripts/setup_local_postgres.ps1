# PostgreSQL 16 Local Setup Script for Windows
# This script sets up PostgreSQL 16 locally with all required extensions

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL 16 Local Setup for IWM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$pgVersion = & psql --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL 16:" -ForegroundColor Yellow
    Write-Host "  Option 1: Download from https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  Option 2: choco install postgresql16" -ForegroundColor White
    Write-Host "  Option 3: scoop install postgresql" -ForegroundColor White
    exit 1
}

Write-Host "Found: $pgVersion" -ForegroundColor Green
Write-Host ""

# Database configuration
$DB_NAME = "iwm"
$DB_USER = "postgres"
$DB_PASSWORD = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"

# Check if database exists
Write-Host "Checking if database '$DB_NAME' exists..." -ForegroundColor Yellow
$dbExists = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt 2>$null | Select-String -Pattern "^\s*$DB_NAME\s"

if ($dbExists) {
    Write-Host "Database '$DB_NAME' already exists" -ForegroundColor Green
    $response = Read-Host "Do you want to drop and recreate it? (y/N)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "Dropping database '$DB_NAME'..." -ForegroundColor Yellow
        & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>$null
        Write-Host "Creating database '$DB_NAME'..." -ForegroundColor Yellow
        & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;" 2>$null
        Write-Host "Database created successfully" -ForegroundColor Green
    }
} else {
    Write-Host "Creating database '$DB_NAME'..." -ForegroundColor Yellow
    & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to create database" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Enable extensions
Write-Host "Enabling PostgreSQL extensions..." -ForegroundColor Yellow
Write-Host ""

$extensions = @(
    @{Name="pg_trgm"; Description="Trigram text search (fuzzy matching)"},
    @{Name="pgcrypto"; Description="Cryptographic functions"},
    @{Name="hstore"; Description="Key-value storage"},
    @{Name="pg_stat_statements"; Description="Query performance tracking"},
    @{Name="vector"; Description="Vector similarity search (pgvector)"; Optional=$true},
    @{Name="postgis"; Description="Geospatial features"; Optional=$true},
    @{Name="pg_cron"; Description="Scheduled jobs"; Optional=$true},
    @{Name="pg_partman"; Description="Partition management"; Optional=$true}
)

foreach ($ext in $extensions) {
    $extName = $ext.Name
    $extDesc = $ext.Description
    $isOptional = $ext.Optional -eq $true
    
    Write-Host "  Installing $extName ($extDesc)..." -ForegroundColor Cyan
    
    $result = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS $extName CASCADE;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ $extName enabled" -ForegroundColor Green
    } else {
        if ($isOptional) {
            Write-Host "    ⚠ $extName not available (optional)" -ForegroundColor Yellow
        } else {
            Write-Host "    ✗ Failed to enable $extName" -ForegroundColor Red
            Write-Host "      Error: $result" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Configure pg_stat_statements
Write-Host "Configuring pg_stat_statements..." -ForegroundColor Yellow
$pgConfig = & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -c "SHOW config_file;" -t 2>$null
if ($pgConfig) {
    Write-Host "  PostgreSQL config file: $pgConfig" -ForegroundColor White
    Write-Host "  Add to postgresql.conf:" -ForegroundColor Yellow
    Write-Host "    shared_preload_libraries = 'pg_stat_statements'" -ForegroundColor White
    Write-Host "    pg_stat_statements.track = all" -ForegroundColor White
    Write-Host "  Then restart PostgreSQL service" -ForegroundColor Yellow
}

Write-Host ""

# Create performance indexes
Write-Host "Creating performance indexes..." -ForegroundColor Yellow
$indexScript = Join-Path $PSScriptRoot "create_indexes.sql"
if (Test-Path $indexScript) {
    & psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $indexScript 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Indexes created" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Some indexes may have failed (this is normal if tables don't exist yet)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ Index script not found: $indexScript" -ForegroundColor Yellow
}

Write-Host ""

# Display connection info
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Connection Info:" -ForegroundColor Yellow
Write-Host "  Host:     $DB_HOST" -ForegroundColor White
Write-Host "  Port:     $DB_PORT" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User:     $DB_USER" -ForegroundColor White
Write-Host ""
Write-Host "Connection String (AsyncPG):" -ForegroundColor Yellow
Write-Host "  postgresql+asyncpg://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update apps/backend/.env with the connection string above" -ForegroundColor White
Write-Host "  2. Run Alembic migrations: cd apps/backend && alembic upgrade head" -ForegroundColor White
Write-Host "  3. Seed the database: python run_seed.py" -ForegroundColor White
Write-Host "  4. Start the backend: hypercorn apps.backend.src.main:app --bind 0.0.0.0:8000" -ForegroundColor White
Write-Host ""
Write-Host "To connect to the database:" -ForegroundColor Yellow
Write-Host "  psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME" -ForegroundColor White
Write-Host ""

