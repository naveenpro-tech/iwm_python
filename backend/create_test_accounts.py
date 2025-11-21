"""
Create Test Accounts Script
Creates admin and regular user accounts for testing
"""
import asyncio
import httpx
from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")
API_BASE = "http://127.0.0.1:8000"


async def create_account_via_api(email: str, password: str, name: str):
    """Create account via signup API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/auth/signup",
                json={
                    "email": email,
                    "password": password,
                    "name": name
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Created account: {email}")
                print(f"   User ID: {data.get('user', {}).get('id')}")
                print(f"   Username: {data.get('user', {}).get('username')}")
                return data
            else:
                print(f"❌ Failed to create {email}: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error creating {email}: {e}")
            return None


async def make_user_admin(user_id: int):
    """Make a user an admin by updating the database directly"""
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        # Check if admin_user_meta exists
        result = await conn.execute(
            text("SELECT id FROM admin_user_meta WHERE user_id = :user_id"),
            {"user_id": user_id}
        )
        admin_meta = result.fetchone()
        
        if not admin_meta:
            # Create admin_user_meta
            await conn.execute(
                text("""
                    INSERT INTO admin_user_meta (user_id, is_admin, can_curate, can_moderate, can_manage_users)
                    VALUES (:user_id, true, true, true, true)
                """),
                {"user_id": user_id}
            )
            print(f"✅ Created admin_user_meta for user {user_id}")
        else:
            # Update existing admin_user_meta
            await conn.execute(
                text("""
                    UPDATE admin_user_meta 
                    SET is_admin = true, can_curate = true, can_moderate = true, can_manage_users = true
                    WHERE user_id = :user_id
                """),
                {"user_id": user_id}
            )
            print(f"✅ Updated admin_user_meta for user {user_id}")
    
    await engine.dispose()


async def verify_accounts():
    """Verify that accounts were created"""
    engine = create_async_engine(DATABASE_URL, echo=False)

    async with engine.begin() as conn:
        result = await conn.execute(
            text("""
                SELECT u.id, u.email, u.name,
                       COALESCE(a.is_admin, false) as is_admin
                FROM users u
                LEFT JOIN admin_user_meta a ON u.id = a.user_id
                ORDER BY u.id
            """)
        )
        users = result.fetchall()

    await engine.dispose()

    print("\n📊 Accounts in database:")
    for user in users:
        admin_badge = "👑 ADMIN" if user[3] else "👤 USER"
        print(f"   {admin_badge} - ID: {user[0]}, Email: {user[1]}, Name: {user[2]}")

    return users


async def main():
    """Main function to create test accounts"""
    print("🚀 Creating test accounts...\n")
    
    # Create admin account
    print("1️⃣ Creating admin account...")
    admin_data = await create_account_via_api(
        email="admin@iwm.com",
        password="admin123",
        name="Admin User"
    )

    if admin_data:
        admin_user_id = admin_data.get('user', {}).get('id')
        if admin_user_id:
            print(f"   Making user {admin_user_id} an admin...")
            await make_user_admin(admin_user_id)

    print()

    # Create regular user account
    print("2️⃣ Creating regular user account...")
    user_data = await create_account_via_api(
        email="user@iwm.com",
        password="user123",
        name="Test User"
    )
    
    print()
    
    # Verify accounts
    users = await verify_accounts()
    
    if len(users) >= 2:
        print("\n✅ Test accounts created successfully!")
        print("\n📝 Login credentials:")
        print("   Admin:")
        print("      Email: admin@iwm.com")
        print("      Password: admin123")
        print("   Regular User:")
        print("      Email: user@iwm.com")
        print("      Password: user123")
        print("\n🌐 Access the app at: http://localhost:3000")
        print("   - Login: http://localhost:3000/login")
        print("   - Admin Panel: http://localhost:3000/admin")
        return True
    else:
        print("\n❌ Failed to create test accounts")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    import sys
    sys.exit(0 if success else 1)

