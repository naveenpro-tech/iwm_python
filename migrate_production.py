#!/usr/bin/env python3
"""
Production Database Migration Script
Runs migrations and seeds data on production Neon DB
"""
import os
import subprocess
import sys

# Production database URL (remove query parameters - asyncpg handles them differently)
PROD_DB_URL = "postgresql+asyncpg://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb"

# For Alembic, we need to use psycopg2 which accepts sslmode
ALEMBIC_DB_URL = "postgresql://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

print("=" * 60)
print("PRODUCTION DATABASE MIGRATION")
print("=" * 60)
print(f"Target: Neon DB (neondb)")
print()

# Set environment variable for Alembic (uses psycopg2 sync driver)
os.environ["DATABASE_URL"] = ALEMBIC_DB_URL

# Change to backend directory
backend_dir = "apps/backend"
os.chdir(backend_dir)

print("Step 1: Running Alembic migrations...")
try:
    result = subprocess.run(
        ["alembic", "upgrade", "head"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"❌ Migration failed: {result.stderr}")
        sys.exit(1)
    print("✅ Migrations completed successfully")
except Exception as e:
    print(f"❌ Error running migrations: {e}")
    sys.exit(1)

print()
print("Step 2: Seeding database...")
try:
    result = subprocess.run(
        ["python", "seed_database.py"],
        capture_output=True,
        text=True,
        env=os.environ
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"⚠️ Seeding had errors (may be due to existing data): {result.stderr}")
    else:
        print("✅ Database seeded successfully")
except Exception as e:
    print(f"❌ Error seeding database: {e}")

print()
print("=" * 60)
print("MIGRATION COMPLETE")
print("=" * 60)
