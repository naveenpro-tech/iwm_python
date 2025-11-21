"""
Unit Tests for CriticRecommendationRepository

Tests all 9 methods from apps/backend/src/repositories/critic_recommendations.py:
- create_recommendation
- get_recommendation_by_id
- get_recommendation_by_external_id
- list_recommendations_by_critic
- list_recommendations_by_username
- list_recommendations_by_type
- delete_recommendation
- check_duplicate_recommendation
- get_total_count_by_critic

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from src.repositories.critic_recommendations import CriticRecommendationRepository
from src.schemas.critic_recommendations import CriticRecommendationCreate
from src.models import CriticRecommendation, CriticProfile, Movie, User


# ============================================================================
# CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_recommendation_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test creating a recommendation successfully"""
    repo = CriticRecommendationRepository(async_db_session)

    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="must_watch",
        reason="This is an amazing film that everyone should see at least once."
    )

    recommendation = await repo.create_recommendation(
        critic_id=test_critic_profile.id,
        recommendation_data=rec_data
    )

    assert recommendation is not None
    assert recommendation.id is not None
    assert recommendation.external_id.startswith("rec_")
    assert recommendation.critic_id == test_critic_profile.id
    assert recommendation.movie_id == test_movie.id
    assert recommendation.recommendation_type == "must_watch"
    assert recommendation.reason == "This is an amazing film that everyone should see at least once."
    assert recommendation.created_at is not None
    assert isinstance(recommendation.created_at, datetime)


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_recommendation_duplicate_prevention(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test that duplicate check can detect existing recommendation"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create first recommendation
    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="must_watch",
        reason="This is an amazing film that everyone should see."
    )
    await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Check for duplicate
    duplicate = await repo.check_duplicate_recommendation(
        test_critic_profile.id,
        test_movie.id
    )

    assert duplicate is not None
    assert duplicate.critic_id == test_critic_profile.id
    assert duplicate.movie_id == test_movie.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_recommendation_different_critics_same_movie(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test that different critics can recommend the same movie"""
    repo = CriticRecommendationRepository(async_db_session)

    # First critic recommends
    rec_data1 = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="must_watch",
        reason="This is an amazing film that everyone should see."
    )
    rec1 = await repo.create_recommendation(test_critic_profile.id, rec_data1)

    # Second critic recommends same movie
    rec_data2 = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="hidden_gem",
        reason="An underrated masterpiece that deserves more attention."
    )
    rec2 = await repo.create_recommendation(test_other_critic_profile.id, rec_data2)

    assert rec1.id != rec2.id
    assert rec1.critic_id != rec2.critic_id
    assert rec1.movie_id == rec2.movie_id


# ============================================================================
# READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_recommendation_by_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting recommendation by ID"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create a recommendation
    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="masterpiece",
        reason="A cinematic achievement that stands the test of time."
    )
    created_rec = await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Retrieve by ID
    retrieved_rec = await repo.get_recommendation_by_id(created_rec.id)

    assert retrieved_rec is not None
    assert retrieved_rec.id == created_rec.id
    assert retrieved_rec.recommendation_type == "masterpiece"
    assert retrieved_rec.critic is not None  # Relationship loaded
    assert retrieved_rec.critic.user is not None  # Nested relationship loaded
    assert retrieved_rec.movie is not None  # Movie relationship loaded
    assert retrieved_rec.movie.id == test_movie.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_recommendation_by_id_not_found(
    async_db_session: AsyncSession
):
    """Test getting recommendation by non-existent ID returns None"""
    repo = CriticRecommendationRepository(async_db_session)

    retrieved_rec = await repo.get_recommendation_by_id(99999)

    assert retrieved_rec is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_recommendation_by_external_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting recommendation by external ID"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create a recommendation
    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="cult_classic",
        reason="A film that has gained a devoted following over the years."
    )
    created_rec = await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Retrieve by external ID
    retrieved_rec = await repo.get_recommendation_by_external_id(created_rec.external_id)

    assert retrieved_rec is not None
    assert retrieved_rec.external_id == created_rec.external_id
    assert retrieved_rec.recommendation_type == "cult_classic"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_recommendations_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting all recommendations by a specific critic"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create recommendations for first critic
    for rec_type in ["must_watch", "hidden_gem", "masterpiece"]:
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type=rec_type,
            reason=f"A {rec_type} film that you should definitely watch."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Create recommendation for second critic
    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="underrated",
        reason="An underrated gem."
    )
    await repo.create_recommendation(test_other_critic_profile.id, rec_data)

    # Get recommendations for first critic
    critic1_recs = await repo.list_recommendations_by_critic(test_critic_profile.id)

    assert len(critic1_recs) == 3
    for rec in critic1_recs:
        assert rec.critic_id == test_critic_profile.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_recommendations_by_critic_with_type_filter(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test filtering recommendations by type"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create recommendations with different types
    for rec_type in ["must_watch", "hidden_gem", "must_watch"]:
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type=rec_type,
            reason=f"A {rec_type} film."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Filter by type
    must_watch_recs = await repo.list_recommendations_by_critic(
        test_critic_profile.id,
        recommendation_type="must_watch"
    )

    assert len(must_watch_recs) == 2
    for rec in must_watch_recs:
        assert rec.recommendation_type == "must_watch"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_recommendations_by_critic_pagination(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test pagination of recommendations"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create 5 recommendations
    for i in range(5):
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type="must_watch",
            reason=f"Recommendation number {i+1}."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Get first page (limit 2)
    page1 = await repo.list_recommendations_by_critic(
        test_critic_profile.id,
        limit=2,
        offset=0
    )

    # Get second page (limit 2, offset 2)
    page2 = await repo.list_recommendations_by_critic(
        test_critic_profile.id,
        limit=2,
        offset=2
    )

    assert len(page1) == 2
    assert len(page2) == 2
    assert page1[0].id != page2[0].id  # Different recommendations



@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_recommendations_by_type(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting all recommendations by type across all critics"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create hidden_gem recommendations from both critics
    rec_data1 = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="hidden_gem",
        reason="A hidden gem from critic 1."
    )
    await repo.create_recommendation(test_critic_profile.id, rec_data1)

    rec_data2 = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="hidden_gem",
        reason="A hidden gem from critic 2."
    )
    await repo.create_recommendation(test_other_critic_profile.id, rec_data2)

    # Create a different type
    rec_data3 = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="masterpiece",
        reason="A masterpiece."
    )
    await repo.create_recommendation(test_critic_profile.id, rec_data3)

    # Get all hidden_gem recommendations
    hidden_gems = await repo.list_recommendations_by_type("hidden_gem")

    assert len(hidden_gems) == 2
    for rec in hidden_gems:
        assert rec.recommendation_type == "hidden_gem"


# ============================================================================
# DELETE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_recommendation_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test deleting a recommendation"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create a recommendation
    rec_data = CriticRecommendationCreate(
        movie_id=test_movie.id,
        recommendation_type="must_watch",
        reason="A must watch film."
    )
    created_rec = await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Delete the recommendation
    result = await repo.delete_recommendation(created_rec.id)

    assert result is True

    # Verify it's deleted
    deleted_rec = await repo.get_recommendation_by_id(created_rec.id)
    assert deleted_rec is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_recommendation_not_found(
    async_db_session: AsyncSession
):
    """Test deleting a non-existent recommendation returns False"""
    repo = CriticRecommendationRepository(async_db_session)

    result = await repo.delete_recommendation(99999)

    assert result is False


# ============================================================================
# BUSINESS LOGIC TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_check_duplicate_recommendation_no_duplicate(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test duplicate check returns None when no duplicate exists"""
    repo = CriticRecommendationRepository(async_db_session)

    # Check for duplicate before creating any
    duplicate = await repo.check_duplicate_recommendation(
        test_critic_profile.id,
        test_movie.id
    )

    assert duplicate is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_total_count_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting total count of recommendations by critic"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create 3 recommendations for first critic
    for i in range(3):
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type="must_watch",
            reason=f"Recommendation {i+1}."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Create 2 recommendations for second critic
    for i in range(2):
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type="hidden_gem",
            reason=f"Recommendation {i+1}."
        )
        await repo.create_recommendation(test_other_critic_profile.id, rec_data)

    # Get count for first critic
    count1 = await repo.get_total_count_by_critic(test_critic_profile.id)
    count2 = await repo.get_total_count_by_critic(test_other_critic_profile.id)

    assert count1 == 3
    assert count2 == 2


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_total_count_by_critic_with_type_filter(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting count filtered by recommendation type"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create recommendations with different types
    for rec_type in ["must_watch", "hidden_gem", "must_watch", "masterpiece"]:
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type=rec_type,
            reason=f"A {rec_type} film."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Get count for must_watch only
    must_watch_count = await repo.get_total_count_by_critic(
        test_critic_profile.id,
        recommendation_type="must_watch"
    )

    # Get total count
    total_count = await repo.get_total_count_by_critic(test_critic_profile.id)

    assert must_watch_count == 2
    assert total_count == 4


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_recommendations_by_username(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_movie: Movie
):
    """Test getting recommendations by critic username"""
    repo = CriticRecommendationRepository(async_db_session)

    # Create recommendations
    for i in range(2):
        rec_data = CriticRecommendationCreate(
            movie_id=test_movie.id,
            recommendation_type="must_watch",
            reason=f"Recommendation {i+1}."
        )
        await repo.create_recommendation(test_critic_profile.id, rec_data)

    # Get by username
    recs = await repo.list_recommendations_by_username(test_critic_profile.username)

    assert len(recs) == 2
    for rec in recs:
        assert rec.critic.username == test_critic_profile.username

