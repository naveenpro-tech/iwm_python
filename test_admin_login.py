"""
Test admin login - Debug password verification
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
from src.models import User, UserRoleProfile
from src.config import settings
from src.security.password import verify_password, hash_password


async def main():
    print("=" * 80)
    print("🔐 TESTING ADMIN LOGIN")
    print("=" * 80)
    print()
    
    email = "admin@iwm.com"
    password = "AdminPassword123!"
    
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print()
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Get user
        result = await session.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"❌ User not found: {email}")
            print()
            print("Creating admin user...")
            
            # Create user with hashed password
            import bcrypt
            import uuid
            
            external_id = f"user_{uuid.uuid4().hex[:12]}"
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
            
            user = User(
                external_id=external_id,
                email=email,
                name="IWM Admin",
                hashed_password=hashed
            )
            session.add(user)
            await session.flush()
            
            # Create role profiles
            roles_to_create = [
                ("lover", True, True),
                ("critic", False, False),
                ("talent", False, False),
                ("industry", False, False),
                ("admin", True, False)
            ]
            
            for role_type, enabled, is_default in roles_to_create:
                role_profile = UserRoleProfile(
                    user_id=user.id,
                    role_type=role_type,
                    enabled=enabled,
                    is_default=is_default
                )
                session.add(role_profile)
            
            await session.commit()
            
            print(f"✅ Created user: {user.name} (ID: {user.id})")
            print()
        else:
            print(f"✅ User found: {user.name} (ID: {user.id})")
            print()
        
        # Test password verification
        print("🔍 Testing password verification...")
        print("-" * 80)
        print()
        
        print(f"Stored hash: {user.hashed_password[:60]}...")
        print()
        
        # Test with verify_password function
        is_valid = verify_password(password, user.hashed_password)
        
        if is_valid:
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
            print()
            print("Attempting to fix password...")
            
            # Hash password using the same method as backend
            new_hash = hash_password(password)
            user.hashed_password = new_hash
            await session.commit()
            
            print(f"✅ Password updated!")
            print(f"   New hash: {new_hash[:60]}...")
            print()
            
            # Test again
            is_valid = verify_password(password, user.hashed_password)
            if is_valid:
                print("✅ Password verification after fix: SUCCESS")
            else:
                print("❌ Password verification after fix: STILL FAILED")
        
        print()
        
        # Get role profiles
        role_profiles_result = await session.execute(
            select(UserRoleProfile).where(UserRoleProfile.user_id == user.id)
        )
        role_profiles_list = role_profiles_result.scalars().all()
        
        print("🎯 User Roles:")
        print("-" * 80)
        for rp in role_profiles_list:
            status = "✅ ENABLED" if rp.enabled else "❌ DISABLED"
            default = " (DEFAULT)" if rp.is_default else ""
            print(f"   - {rp.role_type.upper()}: {status}{default}")
        
        print()
        
        # Check admin role
        has_admin = any(
            rp.role_type == "admin" and rp.enabled
            for rp in role_profiles_list
        )
        
        if has_admin:
            print("✅ Admin role is ENABLED")
        else:
            print("❌ Admin role is NOT ENABLED")
        
        print()
    
    await engine.dispose()
    
    print("=" * 80)
    print("✅ TEST COMPLETE")
    print("=" * 80)
    print()
    
    if is_valid and has_admin:
        print("🎉 Admin login should work now!")
        print()
        print("Try logging in:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print()
        print("   Login URL: http://localhost:3000/login")
        print("   Admin URL: http://localhost:3000/admin")
        print()
    else:
        print("⚠️  There may still be issues with admin login")
        print()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

