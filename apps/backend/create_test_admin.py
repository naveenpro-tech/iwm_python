"""Create a test admin user with known credentials"""
import asyncio
import httpx
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")
API_BASE = "http://127.0.0.1:8000"

TEST_ADMIN_EMAIL = "testadmin@iwm.com"
TEST_ADMIN_PASSWORD = "TestAdmin123!"
TEST_ADMIN_NAME = "Test Admin"


async def create_user():
    """Create user via signup API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/signup",
                json={
                    "email": TEST_ADMIN_EMAIL,
                    "password": TEST_ADMIN_PASSWORD,
                    "name": TEST_ADMIN_NAME
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Created user: {TEST_ADMIN_EMAIL}")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                print(f"ℹ️  User {TEST_ADMIN_EMAIL} already exists")
                return True
            else:
                print(f"❌ Failed to create user: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error creating user: {e}")
            return False


async def make_admin():
    """Make the user an admin"""
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        # Get user ID
        result = await conn.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": TEST_ADMIN_EMAIL}
        )
        user = result.fetchone()
        
        if not user:
            print(f"❌ User {TEST_ADMIN_EMAIL} not found")
            return False
        
        user_id = user[0]
        print(f"✅ Found user ID: {user_id}")
        
        # Check if admin role profile exists
        result = await conn.execute(
            text("""
                SELECT id FROM user_role_profiles
                WHERE user_id = :user_id AND role_type = 'admin'
            """),
            {"user_id": user_id}
        )
        existing = result.fetchone()
        
        if existing:
            # Update to enabled
            await conn.execute(
                text("""
                    UPDATE user_role_profiles
                    SET enabled = true
                    WHERE user_id = :user_id AND role_type = 'admin'
                """),
                {"user_id": user_id}
            )
            print(f"✅ Enabled admin role for user")
        else:
            # Create admin role profile
            await conn.execute(
                text("""
                    INSERT INTO user_role_profiles (user_id, role_type, enabled)
                    VALUES (:user_id, 'admin', true)
                """),
                {"user_id": user_id}
            )
            print(f"✅ Created admin role profile")
        
        return True
    
    await engine.dispose()


async def verify_login():
    """Verify we can login"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_BASE}/api/v1/auth/login",
            json={
                "email": TEST_ADMIN_EMAIL,
                "password": TEST_ADMIN_PASSWORD
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"   Access token: {data['access_token'][:50]}...")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False


async def main():
    print("\n" + "="*80)
    print("CREATE TEST ADMIN USER")
    print("="*80)
    
    print(f"\n📧 Email: {TEST_ADMIN_EMAIL}")
    print(f"🔑 Password: {TEST_ADMIN_PASSWORD}")
    
    print("\n1️⃣ Creating user...")
    if not await create_user():
        return
    
    print("\n2️⃣ Making user admin...")
    if not await make_admin():
        return
    
    print("\n3️⃣ Verifying login...")
    await verify_login()
    
    print("\n" + "="*80)
    print("✅ TEST ADMIN USER READY")
    print("="*80)
    print(f"\nUse these credentials for testing:")
    print(f"  Email: {TEST_ADMIN_EMAIL}")
    print(f"  Password: {TEST_ADMIN_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(main())

