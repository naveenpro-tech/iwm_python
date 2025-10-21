# PostgreSQL 16 Installation Guide for Windows

Complete guide to install PostgreSQL 16 locally on Windows for the IWM project.

---

## Prerequisites

- Windows 10/11
- Administrator access
- At least 2GB free disk space
- Internet connection

---

## Option 1: Official PostgreSQL Installer (Recommended)

### Step 1: Download PostgreSQL 16

1. Visit: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Select **PostgreSQL 16.x** for Windows x86-64
4. Download the installer (approximately 300MB)

### Step 2: Run the Installer

1. **Run the downloaded .exe file** as Administrator
2. **Installation Directory:** Accept default `C:\Program Files\PostgreSQL\16`
3. **Select Components:**
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Stack Builder (for extensions)
   - ✅ Command Line Tools
4. **Data Directory:** Accept default `C:\Program Files\PostgreSQL\16\data`
5. **Password:** Set a password for the `postgres` superuser
   - **IMPORTANT:** Remember this password! You'll need it.
   - Recommended: Use `postgres` for local development
6. **Port:** Accept default `5432`
7. **Locale:** Accept default (your system locale)
8. Click **Next** and wait for installation to complete

### Step 3: Add PostgreSQL to PATH

1. Open **System Properties** → **Environment Variables**
2. Under **System Variables**, find `Path`
3. Click **Edit** → **New**
4. Add: `C:\Program Files\PostgreSQL\16\bin`
5. Click **OK** to save

### Step 4: Verify Installation

Open a **new** PowerShell window:
```powershell
psql --version
# Should output: psql (PostgreSQL) 16.x
```

If you get "command not found", restart your computer and try again.

---

## Option 2: Chocolatey Package Manager

### Step 1: Install Chocolatey (if not installed)

Open PowerShell as Administrator:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install PostgreSQL 16

```powershell
choco install postgresql16 -y
```

This will:
- Install PostgreSQL 16
- Add to PATH automatically
- Set up Windows service
- Create `postgres` user with password `postgres`

### Step 3: Verify Installation

```powershell
psql --version
# Should output: psql (PostgreSQL) 16.x
```

---

## Option 3: Scoop Package Manager

### Step 1: Install Scoop (if not installed)

Open PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### Step 2: Install PostgreSQL

```powershell
scoop install postgresql
```

### Step 3: Initialize Database

```powershell
# Initialize PostgreSQL data directory
initdb -D "$env:USERPROFILE\scoop\apps\postgresql\current\data"

# Start PostgreSQL service
pg_ctl -D "$env:USERPROFILE\scoop\apps\postgresql\current\data" start
```

---

## Post-Installation Setup

### 1. Start PostgreSQL Service

**Option A: Windows Services**
1. Press `Win + R`, type `services.msc`
2. Find `postgresql-x64-16` service
3. Right-click → **Start**
4. Right-click → **Properties** → Set **Startup type** to **Automatic**

**Option B: PowerShell**
```powershell
# Start service
Start-Service postgresql-x64-16

# Set to start automatically
Set-Service postgresql-x64-16 -StartupType Automatic

# Check status
Get-Service postgresql-x64-16
```

### 2. Test Connection

```powershell
# Connect to PostgreSQL
psql -U postgres

# You should see:
# psql (16.x)
# Type "help" for help.
# postgres=#

# Test a query
SELECT version();

# Exit
\q
```

### 3. Configure Password (if needed)

If you need to set/change the postgres password:
```powershell
psql -U postgres
```

Then in psql:
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

---

## Installing PostgreSQL Extensions

### Core Extensions (Included)

These are included with PostgreSQL:
- ✅ pg_trgm
- ✅ pgcrypto
- ✅ hstore
- ✅ pg_stat_statements

### Optional Extensions (Require Separate Installation)

#### 1. pgvector (Vector Similarity Search)

**Download:**
1. Visit: https://github.com/pgvector/pgvector/releases
2. Download `pgvector-0.5.1-windows-x64-postgresql-16.zip`
3. Extract the ZIP file

**Install:**
```powershell
# Copy files to PostgreSQL directory
Copy-Item "pgvector.dll" "C:\Program Files\PostgreSQL\16\lib\"
Copy-Item "pgvector.control" "C:\Program Files\PostgreSQL\16\share\extension\"
Copy-Item "pgvector--*.sql" "C:\Program Files\PostgreSQL\16\share\extension\"

# Restart PostgreSQL
Restart-Service postgresql-x64-16
```

**Verify:**
```powershell
psql -U postgres -c "CREATE EXTENSION vector;"
```

#### 2. PostGIS (Geospatial Features)

**Download:**
1. Visit: https://postgis.net/windows_downloads/
2. Download PostGIS for PostgreSQL 16
3. Run the installer

**Install:**
- Select PostgreSQL 16 installation directory
- Complete the installation wizard

**Verify:**
```powershell
psql -U postgres -c "CREATE EXTENSION postgis;"
```

#### 3. pg_cron (Scheduled Jobs)

**Download:**
1. Visit: https://github.com/citusdata/pg_cron/releases
2. Download Windows build for PostgreSQL 16
3. Extract the ZIP file

**Install:**
```powershell
# Copy files
Copy-Item "pg_cron.dll" "C:\Program Files\PostgreSQL\16\lib\"
Copy-Item "pg_cron.control" "C:\Program Files\PostgreSQL\16\share\extension\"
Copy-Item "pg_cron--*.sql" "C:\Program Files\PostgreSQL\16\share\extension\"

# Edit postgresql.conf
notepad "C:\Program Files\PostgreSQL\16\data\postgresql.conf"

# Add this line:
shared_preload_libraries = 'pg_cron'

# Add this line:
cron.database_name = 'iwm'

# Save and restart PostgreSQL
Restart-Service postgresql-x64-16
```

**Verify:**
```powershell
psql -U postgres -d iwm -c "CREATE EXTENSION pg_cron;"
```

#### 4. pg_partman (Partition Management)

**Download:**
1. Visit: https://github.com/pgpartman/pg_partman/releases
2. Download Windows build for PostgreSQL 16
3. Extract the ZIP file

**Install:**
```powershell
# Copy files
Copy-Item "pg_partman_bgw.dll" "C:\Program Files\PostgreSQL\16\lib\"
Copy-Item "pg_partman.control" "C:\Program Files\PostgreSQL\16\share\extension\"
Copy-Item "pg_partman--*.sql" "C:\Program Files\PostgreSQL\16\share\extension\"

# Restart PostgreSQL
Restart-Service postgresql-x64-16
```

**Verify:**
```powershell
psql -U postgres -d iwm -c "CREATE EXTENSION pg_partman;"
```

---

## Running the IWM Setup Script

Once PostgreSQL is installed and running:

```powershell
cd C:\iwm\v142\database\scripts
.\setup_local_postgres.ps1
```

This script will:
1. ✅ Check PostgreSQL installation
2. ✅ Create `iwm` database
3. ✅ Enable all available extensions
4. ✅ Create performance indexes
5. ✅ Display connection information

---

## Troubleshooting

### Issue: "psql: command not found"

**Solution:**
1. Verify PostgreSQL is installed: `C:\Program Files\PostgreSQL\16\bin\psql.exe`
2. Add to PATH (see Step 3 of Option 1)
3. Restart PowerShell/Terminal
4. If still not working, restart computer

### Issue: "could not connect to server"

**Solution:**
```powershell
# Check if service is running
Get-Service postgresql-x64-16

# If not running, start it
Start-Service postgresql-x64-16

# Check if port 5432 is in use
netstat -ano | findstr :5432
```

### Issue: "password authentication failed"

**Solution:**
```powershell
# Reset password
psql -U postgres
# Then: ALTER USER postgres WITH PASSWORD 'postgres';
```

### Issue: "extension not found"

**Solution:**
- Verify extension files are in correct directories
- Check `C:\Program Files\PostgreSQL\16\share\extension\`
- Restart PostgreSQL service after copying files

### Issue: "permission denied"

**Solution:**
- Run PowerShell as Administrator
- Ensure you're connecting as `postgres` superuser

---

## GUI Tools

### pgAdmin 4 (Included with PostgreSQL)

1. Open pgAdmin 4 from Start Menu
2. Right-click **Servers** → **Register** → **Server**
3. **General** tab:
   - Name: `IWM Local`
4. **Connection** tab:
   - Host: `localhost`
   - Port: `5432`
   - Database: `iwm`
   - Username: `postgres`
   - Password: `postgres`
5. Click **Save**

### DBeaver (Alternative)

1. Download from: https://dbeaver.io/download/
2. Install and open DBeaver
3. Click **New Database Connection**
4. Select **PostgreSQL**
5. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `iwm`
   - Username: `postgres`
   - Password: `postgres`
6. Click **Test Connection** → **Finish**

---

## Next Steps

After PostgreSQL is installed and running:

1. ✅ Run setup script: `.\database\scripts\setup_local_postgres.ps1`
2. ✅ Run migrations: `cd apps\backend && alembic upgrade head`
3. ✅ Update .env: `DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/iwm`
4. ✅ Test backend: `cd apps\backend && python -m src.main`
5. ✅ Run tests: `pytest`

---

## Useful Commands

```powershell
# Connect to database
psql -U postgres -d iwm

# List databases
psql -U postgres -l

# Backup database
pg_dump -U postgres iwm > backup.sql

# Restore database
psql -U postgres iwm < backup.sql

# Check PostgreSQL version
psql -U postgres -c "SELECT version();"

# List extensions
psql -U postgres -d iwm -c "\dx"

# Check service status
Get-Service postgresql-x64-16

# View PostgreSQL logs
Get-Content "C:\Program Files\PostgreSQL\16\data\log\postgresql-*.log" -Tail 50
```

---

## Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/16/
- **pgAdmin Documentation:** https://www.pgadmin.org/docs/
- **pgvector:** https://github.com/pgvector/pgvector
- **PostGIS:** https://postgis.net/
- **pg_cron:** https://github.com/citusdata/pg_cron

---

**Last Updated:** 2025-10-21  
**For:** IWM Project (c:\iwm\v142)

