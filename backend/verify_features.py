"""
Verify all feature flags and show summary by category
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def verify_features():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5433/iwm')
    
    async with engine.connect() as conn:
        # Get all features grouped by category
        result = await conn.execute(
            text('''
                SELECT category, feature_key, feature_name, is_enabled 
                FROM feature_flags 
                ORDER BY category, display_order
            ''')
        )
        
        features_by_category = {}
        for row in result.fetchall():
            category = row[0]
            if category not in features_by_category:
                features_by_category[category] = []
            features_by_category[category].append({
                'key': row[1],
                'name': row[2],
                'enabled': row[3]
            })
        
        print("\n" + "=" * 70)
        print("FEATURE FLAGS STATUS - ALL CATEGORIES")
        print("=" * 70)
        
        total_features = 0
        total_enabled = 0
        
        for category, features in sorted(features_by_category.items()):
            enabled_count = sum(1 for f in features if f['enabled'])
            total_count = len(features)
            total_features += total_count
            total_enabled += enabled_count
            
            print(f"\n{category} ({enabled_count}/{total_count} enabled)")
            print("-" * 70)
            
            for feature in features:
                status = "✅ ENABLED " if feature['enabled'] else "❌ DISABLED"
                print(f"  {status} - {feature['name']}")
        
        print("\n" + "=" * 70)
        print(f"TOTAL: {total_enabled}/{total_features} features enabled")
        print("=" * 70)
        
        # Show newly enabled features
        newly_enabled = [
            'visual_treats', 'cricket', 'scene_explorer', 'movie_calendar',
            'quiz_system', 'tv_shows', 'pulse', 'talent_hub', 'industry_hub',
            'compare_movies', 'recent_views', 'search_demo', 'dashboard',
            'critics_directory', 'critic_applications', 'critic_dashboard',
            'critic_profile', 'settings_roles'
        ]
        
        print("\n" + "=" * 70)
        print("NEWLY ENABLED FEATURES (18 features)")
        print("=" * 70)
        
        result = await conn.execute(
            text('SELECT feature_name, category FROM feature_flags WHERE feature_key = ANY(:keys) ORDER BY category'),
            {'keys': newly_enabled}
        )
        
        for row in result.fetchall():
            print(f"  ✅ {row[0]} ({row[1]})")
        
        print("\n")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(verify_features())

