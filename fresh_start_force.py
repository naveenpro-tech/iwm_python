"""
Complete fresh start with force disconnect: Drop database, recreate, run migrations, create admin user.
"""
import asyncio
import subprocess
import sys
import os
import time

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
sys.path.insert(0, backend_path)


def run_command(cmd, cwd=None, shell=True):
    """Run a command and return success status."""
    print(f"🔄 Running command...")
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            cwd=cwd,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(f"✅ Success!")
            if result.stdout.strip():
                print(result.stdout.strip())
            return True
        else:
            print(f"❌ Failed!")
            if result.stderr.strip():
                print(result.stderr.strip())
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("=" * 70)
    print("🚀 FRESH START: Complete Database Reset (FORCE)")
    print("=" * 70)
    print()
    print("⚠️  WARNING: This will:")
    print("   - Terminate ALL connections to database 'iwm'")
    print("   - Drop database 'iwm' completely")
    print("   - Create fresh database")
    print("   - Run all migrations")
    print("   - Create admin user")
    print()
    print("⚠️  Make sure backend server is STOPPED!")
    print()
    
    # Step 1: Terminate all connections
    print("📋 STEP 1: Terminate all connections to 'iwm'")
    print("-" * 70)
    
    terminate_cmd = '''powershell -Command "cd 'C:\\Program Files\\PostgreSQL\\18\\bin'; $env:PGPASSWORD='postgres'; .\\psql.exe -U postgres -p 5433 -c \\"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'iwm' AND pid <> pg_backend_pid();\\""'''
    
    run_command(terminate_cmd)
    print()
    time.sleep(2)
    
    # Step 2: Drop database
    print("📋 STEP 2: Drop existing database 'iwm'")
    print("-" * 70)
    
    drop_cmd = '''powershell -Command "cd 'C:\\Program Files\\PostgreSQL\\18\\bin'; $env:PGPASSWORD='postgres'; .\\psql.exe -U postgres -p 5433 -c 'DROP DATABASE IF EXISTS iwm;'"'''
    
    if not run_command(drop_cmd):
        print("❌ Failed to drop database!")
        print("⚠️  Please manually stop the backend server and try again")
        return False
    
    print()
    time.sleep(2)
    
    # Step 3: Create database
    print("📋 STEP 3: Create fresh database 'iwm'")
    print("-" * 70)
    
    create_cmd = '''powershell -Command "cd 'C:\\Program Files\\PostgreSQL\\18\\bin'; $env:PGPASSWORD='postgres'; .\\psql.exe -U postgres -p 5433 -c 'CREATE DATABASE iwm;'"'''
    
    if not run_command(create_cmd):
        print("❌ Failed to create database!")
        return False
    
    print()
    time.sleep(2)
    
    # Step 4: Run Alembic migrations
    print("📋 STEP 4: Run Alembic migrations")
    print("-" * 70)
    
    backend_dir = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
    venv_python = os.path.join(backend_dir, '.venv', 'Scripts', 'python.exe')
    
    alembic_cmd = f'"{venv_python}" -m alembic upgrade head'
    
    if not run_command(alembic_cmd, cwd=backend_dir):
        print("❌ Failed to run migrations!")
        return False
    
    print()
    time.sleep(2)
    
    # Step 5: Verify database
    print("📋 STEP 5: Verify database schema")
    print("-" * 70)
    
    verify_cmd = '''powershell -Command "cd 'C:\\Program Files\\PostgreSQL\\18\\bin'; $env:PGPASSWORD='postgres'; .\\psql.exe -U postgres -p 5433 -d iwm -c 'SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ''public'';'"'''
    
    run_command(verify_cmd)
    
    print()
    time.sleep(2)
    
    # Step 6: Create admin user
    print("📋 STEP 6: Create admin user")
    print("-" * 70)
    
    import bcrypt
    import uuid
    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlalchemy.orm import sessionmaker
    from src.models import User, UserRoleProfile, RoleType, AdminUserMeta
    from src.config import settings

    async def create_admin():
        email = "admin@iwm.com"
        password = "AdminPassword123!"
        name = "IWM Admin"

        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print()

        # Generate external_id
        external_id = f"user_{uuid.uuid4().hex[:12]}"

        # Hash password
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

        # Create engine
        engine = create_async_engine(settings.database_url, echo=False)
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

        async with async_session() as session:
            # Create user
            user = User(
                external_id=external_id,
                email=email,
                name=name,
                hashed_password=hashed
            )
            session.add(user)
            await session.flush()
            
            print(f"✅ Created user: {user.name} (ID: {user.id})")
            
            # Create role profiles
            roles_to_create = [
                ("lover", True, True),    # lover - enabled, default
                ("critic", False, False),  # critic - disabled
                ("talent", False, False),  # talent - disabled
                ("industry", False, False), # industry - disabled
                ("admin", True, False)     # admin - enabled, not default
            ]
            
            for role_type, enabled, is_default in roles_to_create:
                role_profile = UserRoleProfile(
                    user_id=user.id,
                    role_type=role_type,
                    enabled=enabled,
                    is_default=is_default
                )
                session.add(role_profile)
            
            print(f"✅ Created role profiles")
            
            # Create admin metadata
            admin_meta = AdminUserMeta(
                user_id=user.id,
                email=email,
                roles=["Admin", "lover"]
            )
            session.add(admin_meta)
            
            print(f"✅ Created admin metadata")
            
            await session.commit()
            
            print()
            print("🎯 User Roles:")
            print("   - LOVER: ✅ ENABLED (DEFAULT)")
            print("   - CRITIC: ❌ DISABLED")
            print("   - TALENT: ❌ DISABLED")
            print("   - INDUSTRY: ❌ DISABLED")
            print("   - ADMIN: ✅ ENABLED")
            
        await engine.dispose()
        return True
    
    try:
        success = asyncio.run(create_admin())
        if not success:
            print("❌ Failed to create admin user!")
            return False
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print()
    print("=" * 70)
    print("✅ FRESH START COMPLETE!")
    print("=" * 70)
    print()
    print("📊 Summary:")
    print("   ✅ All connections terminated")
    print("   ✅ Database 'iwm' dropped and recreated")
    print("   ✅ Alembic migrations applied")
    print("   ✅ Admin user created with all roles")
    print()
    print("🔐 Admin Credentials:")
    print("   📧 Email: admin@iwm.com")
    print("   🔑 Password: AdminPassword123!")
    print()
    print("🚀 Next Steps:")
    print("   1. Start backend server:")
    print("      cd apps\\backend")
    print("      .venv\\Scripts\\python -m hypercorn src.main:app --reload --bind 127.0.0.1:8000")
    print()
    print("   2. Start frontend server:")
    print("      bun run dev")
    print()
    print("   3. Test login:")
    print("      - Open incognito browser")
    print("      - Go to http://localhost:3000/login")
    print("      - Login with admin@iwm.com / AdminPassword123!")
    print("      - Navigate to http://localhost:3000/admin")
    print()
    
    return True


if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

