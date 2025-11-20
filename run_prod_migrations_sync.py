"""
Simple synchronous Alembic runner for production migrations
Uses psycopg2 (sync) instead of asyncpg to support sslmode parameter
"""
import os
os.environ["DATABASE_URL"] = "postgresql://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

from alembic.config import Config
from alembic import command
import sys

# Change to backend directory
os.chdir("apps/backend")

# Create Alembic config
alembic_cfg = Config("alembic.ini")

# Override the database URL to use psycopg2 (sync driver)
alembic_cfg.set_main_option("sqlalchemy.url", os.environ["DATABASE_URL"])

print("=" * 60)
print("RUNNING PRODUCTION DATABASE MIGRATIONS")
print("=" * 60)
print(f"Database: Neon DB (neondb)")
print()

try:
    print("Running migrations...")
    command.upgrade(alembic_cfg, "head")
    print()
    print("✅ Migrations completed successfully!")
except Exception as e:
    print(f"❌ Migration failed: {e}")
    sys.exit(1)

print("=" * 60)
