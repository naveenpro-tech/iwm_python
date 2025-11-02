"""
Script to promote a user to admin role by directly updating the database.
This creates a UserRoleProfile with role_type='admin' and enabled=True.
"""
import asyncio
import sys
import os

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
sys.path.insert(0, backend_path)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.models import User, UserRoleProfile, RoleType
from src.config import settings


async def promote_user_to_admin(email: str):
    """Promote a user to admin role."""
    
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Find user by email
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User with email '{email}' not found!")
            return False
        
        print(f"✅ Found user: {user.name} (ID: {user.id}, Email: {user.email})")
        
        # Check if user already has admin role
        existing_admin_role = None
        for role_profile in user.role_profiles:
            if role_profile.role_type == RoleType.ADMIN:
                existing_admin_role = role_profile
                break
        
        if existing_admin_role:
            if existing_admin_role.enabled:
                print(f"⚠️  User already has ADMIN role enabled!")
                return True
            else:
                # Enable existing admin role
                existing_admin_role.enabled = True
                await session.commit()
                print(f"✅ Enabled existing ADMIN role for user!")
                return True
        
        # Create new admin role profile
        admin_role = UserRoleProfile(
            user_id=user.id,
            role_type=RoleType.ADMIN,
            enabled=True,
            is_default=False  # Don't make admin the default role
        )
        session.add(admin_role)
        await session.commit()
        
        print(f"✅ Successfully promoted user to ADMIN role!")
        print(f"   User ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Name: {user.name}")
        print(f"   Admin Role: ENABLED")
        
        return True


async def main():
    email = "admin@iwm.com"
    print(f"🔐 Promoting user '{email}' to ADMIN role...")
    print()
    
    success = await promote_user_to_admin(email)
    
    if success:
        print()
        print("=" * 60)
        print("✅ ADMIN USER SETUP COMPLETE!")
        print("=" * 60)
        print(f"📧 Email: {email}")
        print(f"🔑 Password: AdminPassword123!")
        print()
        print("🚀 You can now log in with admin privileges!")
        print("🔗 Login URL: http://localhost:3000/login")
        print("🔗 Admin Panel: http://localhost:3000/admin")
    else:
        print()
        print("❌ Failed to promote user to admin role.")


if __name__ == "__main__":
    asyncio.run(main())

