@echo off
echo === Generating Production Migration SQL ===
cd apps\backend
set DATABASE_URL=postgresql://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb
alembic upgrade head --sql > production_migrations.sql
echo SQL generated at apps\backend\production_migrations.sql
cd ..\..
