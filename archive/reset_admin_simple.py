"""
Simple script to reset admin user password using bcrypt directly.
"""
import bcrypt
import asyncio
import sys
import os

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
sys.path.insert(0, backend_path)

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from src.models import User, UserRoleProfile, RoleType
from src.config import settings


async def reset_admin():
    """Reset admin user password and add admin role."""
    
    email = "admin@iwm.com"
    password = "AdminPassword123!"
    
    print("=" * 60)
    print("🔐 RESETTING ADMIN USER")
    print("=" * 60)
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print()
    
    # Hash password using bcrypt directly
    print("🔄 Hashing password...")
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    hashed_str = hashed.decode('utf-8')
    print(f"✅ Password hashed: {hashed_str[:20]}...")
    print()
    
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Find user
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User '{email}' not found!")
            print(f"📝 Please create the user first using signup endpoint")
            return False
        
        print(f"✅ Found user: {user.name} (ID: {user.id})")
        print()
        
        # Update password
        print("🔄 Updating password in database...")
        user.hashed_password = hashed_str
        await session.commit()
        print("✅ Password updated!")
        print()
        
        # Check for admin role
        print("🔄 Checking admin role...")
        result = await session.execute(
            select(UserRoleProfile).where(
                UserRoleProfile.user_id == user.id,
                UserRoleProfile.role_type == RoleType.ADMIN
            )
        )
        admin_role = result.scalar_one_or_none()
        
        if admin_role:
            if admin_role.enabled:
                print("✅ Admin role already enabled!")
            else:
                print("🔄 Enabling admin role...")
                admin_role.enabled = True
                await session.commit()
                print("✅ Admin role enabled!")
        else:
            print("🔄 Creating admin role...")
            admin_role = UserRoleProfile(
                user_id=user.id,
                role_type=RoleType.ADMIN,
                enabled=True,
                is_default=False
            )
            session.add(admin_role)
            await session.commit()
            print("✅ Admin role created and enabled!")
        
        print()
        print("=" * 60)
        print("✅ ADMIN USER RESET COMPLETE!")
        print("=" * 60)
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
        print(f"👤 User ID: {user.id}")
        print()
        
        # Show all roles
        print("🎯 User Roles:")
        result = await session.execute(
            select(UserRoleProfile).where(UserRoleProfile.user_id == user.id)
        )
        roles = result.scalars().all()
        
        for role in roles:
            status = "✅ ENABLED" if role.enabled else "❌ DISABLED"
            default = " (DEFAULT)" if role.is_default else ""
            print(f"   - {role.role_type.upper()}: {status}{default}")
        
        print()
        print("🚀 You can now log in!")
        print("🔗 Login URL: http://localhost:3000/login")
        print("🔗 Admin Panel: http://localhost:3000/admin")
        print()
    
    await engine.dispose()
    return True


if __name__ == "__main__":
    success = asyncio.run(reset_admin())
    sys.exit(0 if success else 1)

