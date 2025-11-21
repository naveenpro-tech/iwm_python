"""Check admin users in database"""
import asyncio
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm")


async def check_admin_users():
    """Check admin users"""
    engine = create_async_engine(DATABASE_URL, echo=False)
    
    async with engine.begin() as conn:
        # Check users table
        result = await conn.execute(
            text("""
                SELECT u.id, u.email, u.name, u.external_id
                FROM users u
                ORDER BY u.id
                LIMIT 10
            """)
        )
        
        users = result.fetchall()
        print("\n📋 Users in database:")
        for user in users:
            print(f"   ID: {user[0]}, Email: {user[1]}, Name: {user[2]}, External ID: {user[3]}")
        
        # Check role profiles
        result = await conn.execute(
            text("""
                SELECT urp.user_id, urp.role_type, urp.enabled, u.email
                FROM user_role_profiles urp
                JOIN users u ON urp.user_id = u.id
                WHERE urp.role_type = 'admin'
                ORDER BY urp.user_id
            """)
        )
        
        admins = result.fetchall()
        print("\n👑 Admin role profiles:")
        for admin in admins:
            print(f"   User ID: {admin[0]}, Role: {admin[1]}, Enabled: {admin[2]}, Email: {admin[3]}")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(check_admin_users())

