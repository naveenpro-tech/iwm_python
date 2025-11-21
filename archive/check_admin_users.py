"""
Check which users have admin privileges in the database.
"""
import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend .env file
env_path = Path(__file__).parent / "apps" / "backend" / ".env"
load_dotenv(env_path)

# Add backend src to path
sys.path.insert(0, str(Path(__file__).parent / "apps" / "backend"))

from sqlalchemy import select
from src.db import init_db, SessionLocal
from src.models import User


async def check_admin_users():
    """Check all users and their admin status."""
    # Initialize database
    await init_db()
    
    if SessionLocal is None:
        print("❌ Database not configured!")
        return
    
    async with SessionLocal() as session:
        # Get all users
        result = await session.execute(
            select(User.id, User.email, User.is_admin, User.created_at)
            .order_by(User.id)
        )
        users = result.all()
        
        print('\n' + '='*80)
        print('📊 USER ADMIN STATUS REPORT')
        print('='*80 + '\n')
        
        if not users:
            print('⚠️  No users found in database!\n')
            return
        
        # Print header
        print(f"{'ID':<5} {'Email':<35} {'Admin Status':<15} {'Created At':<20}")
        print('-' * 80)
        
        admin_count = 0
        admin_users = []
        regular_users = []
        
        for user in users:
            if user.is_admin:
                admin_status = '✅ ADMIN'
                admin_count += 1
                admin_users.append(user)
            else:
                admin_status = '❌ Regular User'
                regular_users.append(user)
            
            created = str(user.created_at)[:19] if user.created_at else 'N/A'
            print(f"{user.id:<5} {user.email:<35} {admin_status:<15} {created:<20}")
        
        print('-' * 80)
        print(f'\n📈 SUMMARY:')
        print(f'   Total Users: {len(users)}')
        print(f'   Admin Users: {admin_count}')
        print(f'   Regular Users: {len(users) - admin_count}')
        
        if admin_count == 0:
            print('\n⚠️  WARNING: No admin users found!')
            print('   You need to promote at least one user to admin.')
            print('   Run: python promote_to_admin.py')
        else:
            print('\n✅ Admin users found:')
            for user in admin_users:
                print(f'   - {user.email} (ID: {user.id})')
        
        print('\n' + '='*80 + '\n')


if __name__ == "__main__":
    asyncio.run(check_admin_users())

