"""
Script to enable all movie-related features via direct database update
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Features to enable
FEATURES_TO_ENABLE = [
    # Content Features
    'visual_treats',
    'cricket',
    'scene_explorer',
    'movie_calendar',
    'quiz_system',
    'people',
    'tv_shows',
    
    # Community Features
    'pulse',
    'talent_hub',
    'industry_hub',
    
    # Review Features
    'reviews',
    'movie_reviews',
    
    # Discovery Features
    'compare_movies',
    'recent_views',
    'search_demo',
    'dashboard',
    
    # Critic Features
    'critics_directory',
    'critic_applications',
    'critic_dashboard',
    'critic_profile',
    
    # Settings Features
    'settings_roles',
]

async def enable_features():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5433/iwm')
    
    async with engine.begin() as conn:
        # Get current state
        result = await conn.execute(
            text('SELECT feature_key, is_enabled FROM feature_flags WHERE feature_key = ANY(:keys)'),
            {'keys': FEATURES_TO_ENABLE}
        )
        current_state = {row[0]: row[1] for row in result.fetchall()}
        
        print("Current State:")
        print("-" * 50)
        for key in FEATURES_TO_ENABLE:
            status = "ENABLED" if current_state.get(key, False) else "DISABLED"
            print(f"  {key}: {status}")
        
        # Enable all features
        await conn.execute(
            text('UPDATE feature_flags SET is_enabled = true WHERE feature_key = ANY(:keys)'),
            {'keys': FEATURES_TO_ENABLE}
        )
        
        print("\n" + "=" * 50)
        print("ENABLING ALL FEATURES...")
        print("=" * 50)
        
        # Verify changes
        result = await conn.execute(
            text('SELECT feature_key, is_enabled FROM feature_flags WHERE feature_key = ANY(:keys)'),
            {'keys': FEATURES_TO_ENABLE}
        )
        new_state = {row[0]: row[1] for row in result.fetchall()}
        
        print("\nNew State:")
        print("-" * 50)
        enabled_count = 0
        for key in FEATURES_TO_ENABLE:
            status = "ENABLED ✅" if new_state.get(key, False) else "DISABLED ❌"
            if new_state.get(key, False):
                enabled_count += 1
            print(f"  {key}: {status}")
        
        print("\n" + "=" * 50)
        print(f"SUCCESS: {enabled_count}/{len(FEATURES_TO_ENABLE)} features enabled")
        print("=" * 50)
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(enable_features())

