"""
Reset admin user password and promote to admin role.
This script:
1. Finds or creates admin@iwm.com user
2. Resets password to AdminPassword123!
3. Promotes user to admin role
"""
import asyncio
import sys
import os

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
sys.path.insert(0, backend_path)

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.models import User, UserRoleProfile, RoleType, AdminUserMeta
from src.config import settings
from src.security.password import hash_password


async def reset_admin_user():
    """Reset admin user password and promote to admin role."""
    
    email = "admin@iwm.com"
    password = "AdminPassword123!"
    name = "IWM Admin"
    
    print("=" * 60)
    print("🔐 ADMIN USER RESET & PROMOTION")
    print("=" * 60)
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print()
    
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Find or create user
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if user:
            print(f"✅ Found existing user: {user.name} (ID: {user.id})")
            print(f"🔄 Resetting password...")

            # Reset password
            user.hashed_password = hash_password(password)
            await session.commit()
            print(f"✅ Password reset successfully!")
        else:
            print(f"📝 Creating new user...")
            
            # Create new user
            user = User(
                email=email,
                name=name,
                hashed_password=hash_password(password)
            )
            session.add(user)
            await session.flush()  # Get user.id
            
            print(f"✅ User created: {user.name} (ID: {user.id})")
            
            # Create AdminUserMeta
            admin_meta = AdminUserMeta(
                user_id=user.id,
                email=email,
                roles=["lover"]  # Will add admin role next
            )
            session.add(admin_meta)
            
            # Create default role profiles
            for role_type in ["lover", "critic", "talent", "industry"]:
                role_profile = UserRoleProfile(
                    user_id=user.id,
                    role_type=role_type,
                    enabled=(role_type == "lover")
                )
                session.add(role_profile)
            
            await session.commit()
            print(f"✅ Default roles created")
        
        print()
        print("🔄 Promoting to ADMIN role...")
        
        # Check if user already has admin role
        result = await session.execute(
            select(UserRoleProfile).where(
                UserRoleProfile.user_id == user.id,
                UserRoleProfile.role_type == RoleType.ADMIN
            )
        )
        admin_role = result.scalar_one_or_none()
        
        if admin_role:
            if admin_role.enabled:
                print(f"⚠️  User already has ADMIN role enabled!")
            else:
                admin_role.enabled = True
                await session.commit()
                print(f"✅ Enabled existing ADMIN role!")
        else:
            # Create new admin role profile
            admin_role = UserRoleProfile(
                user_id=user.id,
                role_type=RoleType.ADMIN,
                enabled=True,
                is_default=False
            )
            session.add(admin_role)
            await session.commit()
            print(f"✅ Created and enabled ADMIN role!")
        
        # Update AdminUserMeta to include admin role
        result = await session.execute(
            select(AdminUserMeta).where(AdminUserMeta.user_id == user.id)
        )
        admin_meta = result.scalar_one_or_none()
        
        if admin_meta:
            if "Admin" not in admin_meta.roles:
                admin_meta.roles = admin_meta.roles + ["Admin"]
                await session.commit()
                print(f"✅ Updated AdminUserMeta with Admin role!")
        else:
            # Create AdminUserMeta if it doesn't exist
            admin_meta = AdminUserMeta(
                user_id=user.id,
                email=email,
                roles=["Admin", "lover"]
            )
            session.add(admin_meta)
            await session.commit()
            print(f"✅ Created AdminUserMeta with Admin role!")
        
        print()
        print("=" * 60)
        print("✅ ADMIN USER SETUP COMPLETE!")
        print("=" * 60)
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 User ID: {user.id}")
        print(f"👤 Name: {user.name}")
        print()
        print("🎯 User Roles:")
        
        # Query all role profiles
        result = await session.execute(
            select(UserRoleProfile).where(UserRoleProfile.user_id == user.id)
        )
        role_profiles = result.scalars().all()
        
        for rp in role_profiles:
            status = "✅ ENABLED" if rp.enabled else "❌ DISABLED"
            print(f"   - {rp.role_type.upper()}: {status}")
        
        print()
        print("🚀 You can now log in with admin privileges!")
        print("🔗 Login URL: http://localhost:3000/login")
        print("🔗 Admin Panel: http://localhost:3000/admin")
        print()
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(reset_admin_user())

