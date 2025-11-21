#!/usr/bin/env python3
"""
Create Admin Account on Production
Creates admin account: siddu@moviemadders.com with admin privileges  
"""
import asyncio
import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
import ssl

# Production database (asyncpg doesn't support query params in URL)
DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_Tmgp68ZYbPXl@ep-long-pine-a4aleld9-pooler.us-east-1.aws.neon.tech/neondb"
API_BASE = "https://iwm-python.onrender.com"

# Admin credentials
ADMIN_EMAIL = "siddu@moviemadders.com"
ADMIN_PASSWORD = "Bava@123"
ADMIN_NAME = "Siddu"

# SSL context for Neon DB (asyncpg requires this)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

async def create_admin_via_api():
    """Create admin account via API"""
    print("Step 1: Creating admin account via API...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/signup",
                json={
                    "email": ADMIN_EMAIL,
                    "password": ADMIN_PASSWORD,
                    "name": ADMIN_NAME
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                user_id = data.get('user', {}).get('id')
                print(f"✅ Account created successfully")
                print(f"   User ID: {user_id}")
                return user_id
            else:
                print(f"❌ Failed to create account: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None

async def get_user_id_from_db():
    """Get user ID from database"""
    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"ssl": ssl_context})
    async with engine.connect() as conn:
        result = await conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": ADMIN_EMAIL}
        )
        user = result.fetchone()
    await engine.dispose()
    return user[0] if user else None

async def make_user_admin(user_id: int):
    """Grant admin privileges to user"""
    print(f"\nStep 2: Granting admin privileges to user {user_id}...")
    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"ssl": ssl_context})
    
    async with engine.begin() as conn:
        # Check if admin role exists
        result = await conn.execute(
            text("SELECT id FROM user_role_profiles WHERE user_id = :user_id AND role_type = 'admin'"),
            {"user_id": user_id}
        )
        
        if result.fetchone():
            # Update existing admin role
            await conn.execute(
                text("""
                    UPDATE user_role_profiles
                    SET enabled = true, is_default = true
                    WHERE user_id = :user_id AND role_type = 'admin'
                """),
                {"user_id": user_id}
            )
        else:
            # Create new admin role
            await conn.execute(
                text("""
                    INSERT INTO user_role_profiles (user_id, role_type, enabled, is_default)
                    VALUES (:user_id, 'admin', true, true)
                """),
                {"user_id": user_id}
            )
        
        print("✅ Admin privileges granted")
    
    await engine.dispose()

async def verify_admin():
    """Verify admin account"""
    print("\nStep 3: Verifying admin account...")
    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"ssl": ssl_context})
    
    async with engine.connect() as conn:
        result = await conn.execute(
            text("""
                SELECT u.id, u.email, u.name, 
                       COALESCE(array_agg(urp.role_type) FILTER (WHERE urp.enabled = true), ARRAY[]::text[]) as roles
                FROM users u
                LEFT JOIN user_role_profiles urp ON u.id = urp.user_id
                WHERE u.email = :email
                GROUP BY u.id, u.email, u.name
            """),
            {"email": ADMIN_EMAIL}
        )
        user = result.fetchone()
        
        if user:
            print(f"✅ Admin account verified")
            print(f"   Email: {user[1]}")
            print(f"   Name: {user[2]}")
            print(f"   Roles: {user[3]}")
        else:
            print("❌ Admin account not found")
    
    await engine.dispose()

async def create_user_in_db():
    """Create user directly in database"""
    print("\nStep 1b: Creating user directly in database...")
    # We need passlib for password hashing
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(ADMIN_PASSWORD)
    except Exception as e:
        print(f"⚠️ Password hashing failed ({e}), using plain text password (NOT RECOMMENDED)")
        hashed_password = ADMIN_PASSWORD

    engine = create_async_engine(DATABASE_URL, echo=False, connect_args={"ssl": ssl_context})
    
    async with engine.begin() as conn:
        # Insert user
        # Check if user exists first
        result = await conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": ADMIN_EMAIL}
        )
        existing_user = result.fetchone()
        
        if not existing_user:
            import uuid
            external_id = str(uuid.uuid4())
            
            await conn.execute(
                text("""
                    INSERT INTO users (email, hashed_password, name, external_id)
                    VALUES (:email, :password, :name, :external_id)
                """),
                {
                    "email": ADMIN_EMAIL,
                    "password": hashed_password,
                    "name": ADMIN_NAME,
                    "external_id": external_id
                }
            )
            print("✅ User inserted into DB")
        else:
            print(f"ℹ️ User already exists in DB with ID: {existing_user[0]}")
        
        # Get ID
        result = await conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": ADMIN_EMAIL}
        )
        user = result.fetchone()
    
    await engine.dispose()
    if user:
        print(f"✅ User created/found in DB with ID: {user[0]}")
        return user[0]
    return None

async def main():
    print("=" * 60)
    print("CREATE PRODUCTION ADMIN ACCOUNT")
    print("=" * 60)
    print(f"Email: {ADMIN_EMAIL}")
    print(f"Backend: {API_BASE}")
    print()
    
    # Create account via API
    user_id = await create_admin_via_api()
    
    # If API creation failed, try to create/find in database
    if not user_id:
        print("\nAPI creation failed. Attempting direct database creation...")
        user_id = await create_user_in_db()
    
    if user_id:
        # Grant admin privileges
        await make_user_admin(user_id)
        # Verify
        await verify_admin()
        
        print()
        print("=" * 60)
        print("✅ ADMIN ACCOUNT SETUP COMPLETE")
        print("=" * 60)
        print(f"\nLogin credentials:")
        print(f"  Email: {ADMIN_EMAIL}")
        print(f"  Password: {ADMIN_PASSWORD}")
        print(f"\nAccess admin panel at:")
        print(f"  https://www.moviemadders.com/admin")
        print(f"  https://www.moviemadders.in/admin")
    else:
        print("\n❌ Could not create or find admin account")

if __name__ == "__main__":
    asyncio.run(main())
