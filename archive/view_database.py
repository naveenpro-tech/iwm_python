"""
Quick database viewer - View your PostgreSQL database in the terminal
"""
import asyncio
import sys
import os
from tabulate import tabulate

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'apps', 'backend')
sys.path.insert(0, backend_path)

from sqlalchemy import text, inspect
from sqlalchemy.ext.asyncio import create_async_engine
from src.config import settings


async def main():
    print("=" * 80)
    print("🗄️  IWM DATABASE VIEWER")
    print("=" * 80)
    print()
    
    # Create engine
    engine = create_async_engine(settings.database_url, echo=False)
    
    async with engine.begin() as conn:
        # Get all tables
        print("📊 TABLES IN DATABASE:")
        print("-" * 80)
        
        result = await conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """))
        
        tables = [row[0] for row in result]
        
        # Display in columns
        cols = 3
        rows = []
        for i in range(0, len(tables), cols):
            rows.append(tables[i:i+cols])
        
        print(tabulate(rows, tablefmt="simple"))
        print()
        print(f"Total tables: {len(tables)}")
        print()
        
        # Show users table
        print("=" * 80)
        print("👥 USERS TABLE:")
        print("-" * 80)
        
        result = await conn.execute(text("""
            SELECT 
                u.id,
                u.email,
                u.name,
                u.created_at,
                STRING_AGG(
                    CASE WHEN rp.enabled THEN rp.role_type ELSE NULL END, 
                    ', '
                ) as enabled_roles
            FROM users u
            LEFT JOIN user_role_profiles rp ON u.id = rp.user_id
            GROUP BY u.id, u.email, u.name, u.created_at
            ORDER BY u.id
        """))
        
        users = []
        for row in result:
            users.append([
                row[0],  # id
                row[1],  # email
                row[2],  # name
                str(row[3])[:19] if row[3] else None,  # created_at
                row[4] or "none"  # roles
            ])
        
        if users:
            print(tabulate(
                users,
                headers=["ID", "Email", "Name", "Created At", "Enabled Roles"],
                tablefmt="grid"
            ))
        else:
            print("No users found.")
        
        print()
        
        # Show admin users
        print("=" * 80)
        print("👑 ADMIN USERS:")
        print("-" * 80)
        
        result = await conn.execute(text("""
            SELECT 
                u.id,
                u.email,
                u.name,
                rp.enabled
            FROM users u
            JOIN user_role_profiles rp ON u.id = rp.user_id
            WHERE rp.role_type = 'admin'
            ORDER BY u.id
        """))
        
        admins = []
        for row in result:
            admins.append([
                row[0],  # id
                row[1],  # email
                row[2],  # name
                "✅ ENABLED" if row[3] else "❌ DISABLED"
            ])
        
        if admins:
            print(tabulate(
                admins,
                headers=["ID", "Email", "Name", "Status"],
                tablefmt="grid"
            ))
        else:
            print("No admin users found.")
        
        print()
        
        # Show table counts
        print("=" * 80)
        print("📈 TABLE ROW COUNTS:")
        print("-" * 80)
        
        important_tables = [
            'users', 'user_role_profiles', 'admin_user_meta',
            'movies', 'people', 'reviews', 'collections',
            'watchlist', 'favorites', 'notifications'
        ]
        
        counts = []
        for table in important_tables:
            if table in tables:
                result = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                counts.append([table, count])
        
        print(tabulate(counts, headers=["Table", "Rows"], tablefmt="grid"))
        print()
    
    await engine.dispose()
    
    print("=" * 80)
    print("✅ DATABASE VIEWER COMPLETE")
    print("=" * 80)
    print()
    print("💡 TIP: Install a GUI tool for better database management:")
    print()
    print("   1. DBeaver (FREE) - https://dbeaver.io/download/")
    print("      - Beautiful UI, easy to use")
    print("      - Connection: localhost:5433, database: iwm, user: postgres")
    print()
    print("   2. pgAdmin (FREE) - https://www.pgadmin.org/download/")
    print("      - Official PostgreSQL tool")
    print()
    print("   3. TablePlus (PAID) - https://tableplus.com/")
    print("      - Most beautiful UI")
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

