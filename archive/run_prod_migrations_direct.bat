@echo off
echo === Running Production Database Migrations ===
cd apps\backend
set DATABASE_URL=postgresql://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb
alembic upgrade head
echo === Migrations Complete ===
