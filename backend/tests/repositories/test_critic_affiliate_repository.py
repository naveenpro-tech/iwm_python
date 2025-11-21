"""
Unit Tests for CriticAffiliateLinkRepository

Tests all 13 methods from apps/backend/src/repositories/critic_affiliate.py:
- create_affiliate_link
- get_affiliate_link_by_id
- get_affiliate_link_by_external_id
- list_affiliate_links_by_critic
- list_affiliate_links_by_username
- update_affiliate_link
- delete_affiliate_link
- track_click
- track_conversion
- get_total_clicks_by_critic
- get_total_conversions_by_critic
- get_top_performing_links
- get_total_count_by_critic

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from src.repositories.critic_affiliate import CriticAffiliateLinkRepository
from src.schemas.critic_affiliate import CriticAffiliateLinkCreate, CriticAffiliateLinkUpdate
from src.models import CriticAffiliateLink, CriticProfile


# ============================================================================
# CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_affiliate_link_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating an affiliate link successfully"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    link_data = CriticAffiliateLinkCreate(
        label="Watch on Netflix",
        platform="netflix",
        url="https://netflix.com/title/12345?ref=critic123",
        utm_source="critic_profile",
        utm_medium="affiliate",
        utm_campaign="movie_review"
    )

    link = await repo.create_affiliate_link(
        critic_id=test_critic_profile.id,
        link_data=link_data
    )

    assert link is not None
    assert link.id is not None
    assert link.external_id.startswith("aff_")
    assert link.critic_id == test_critic_profile.id
    assert link.label == "Watch on Netflix"
    assert link.platform == "netflix"
    assert link.url == "https://netflix.com/title/12345?ref=critic123"
    assert link.utm_source == "critic_profile"
    assert link.utm_medium == "affiliate"
    assert link.utm_campaign == "movie_review"
    assert link.click_count == 0
    assert link.conversion_count == 0
    assert link.is_active is True
    assert link.created_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_affiliate_link_with_utm_parameters(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that UTM parameters are stored correctly"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    link_data = CriticAffiliateLinkCreate(
        label="Amazon Prime",
        platform="amazon",
        url="https://amazon.com/dp/B123?tag=critic",
        utm_source="blog_post",
        utm_medium="text_link",
        utm_campaign="summer_2024"
    )

    link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    assert link.utm_source == "blog_post"
    assert link.utm_medium == "text_link"
    assert link.utm_campaign == "summer_2024"


# ============================================================================
# READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_affiliate_link_by_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting affiliate link by ID"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="Apple TV",
        platform="apple_tv",
        url="https://tv.apple.com/movie/123"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Retrieve by ID
    retrieved_link = await repo.get_affiliate_link_by_id(created_link.id)

    assert retrieved_link is not None
    assert retrieved_link.id == created_link.id
    assert retrieved_link.label == "Apple TV"
    assert retrieved_link.critic is not None  # Relationship loaded
    assert retrieved_link.critic.user is not None  # Nested relationship loaded


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_affiliate_link_by_id_not_found(
    async_db_session: AsyncSession
):
    """Test getting affiliate link by non-existent ID returns None"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    retrieved_link = await repo.get_affiliate_link_by_id(99999)

    assert retrieved_link is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_affiliate_link_by_external_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting affiliate link by external ID"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="Disney+",
        platform="disney_plus",
        url="https://disneyplus.com/movies/123"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Retrieve by external ID
    retrieved_link = await repo.get_affiliate_link_by_external_id(created_link.external_id)

    assert retrieved_link is not None
    assert retrieved_link.external_id == created_link.external_id
    assert retrieved_link.label == "Disney+"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_affiliate_links_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test getting all affiliate links by critic"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Critic 1 creates 3 links
    for i in range(3):
        link_data = CriticAffiliateLinkCreate(
            label=f"Link {i}",
            platform="netflix",
            url=f"https://netflix.com/{i}"
        )
        await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Critic 2 creates 1 link
    link_data = CriticAffiliateLinkCreate(
        label="Other Link",
        platform="amazon",
        url="https://amazon.com/123"
    )
    await repo.create_affiliate_link(test_other_critic_profile.id, link_data)

    # Get links for critic 1
    critic1_links = await repo.list_affiliate_links_by_critic(test_critic_profile.id)

    assert len(critic1_links) == 3
    for link in critic1_links:
        assert link.critic_id == test_critic_profile.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_affiliate_links_by_critic_filter_active(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test filtering affiliate links by active status"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create active link
    link_data1 = CriticAffiliateLinkCreate(
        label="Active Link",
        platform="netflix",
        url="https://netflix.com/1",
        is_active=True
    )
    await repo.create_affiliate_link(test_critic_profile.id, link_data1)

    # Create inactive link
    link_data2 = CriticAffiliateLinkCreate(
        label="Inactive Link",
        platform="amazon",
        url="https://amazon.com/2",
        is_active=False
    )
    await repo.create_affiliate_link(test_critic_profile.id, link_data2)

    # Get only active links
    active_links = await repo.list_affiliate_links_by_critic(
        test_critic_profile.id,
        is_active=True
    )

    assert len(active_links) == 1
    assert active_links[0].is_active is True


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_affiliate_links_by_critic_filter_platform(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test filtering affiliate links by platform"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create links for different platforms
    for platform in ["netflix", "amazon", "netflix"]:
        link_data = CriticAffiliateLinkCreate(
            label=f"{platform} link",
            platform=platform,
            url=f"https://{platform}.com/123"
        )
        await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Get only Netflix links
    netflix_links = await repo.list_affiliate_links_by_critic(
        test_critic_profile.id,
        platform="netflix"
    )

    assert len(netflix_links) == 2
    for link in netflix_links:
        assert link.platform == "netflix"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_affiliate_links_by_username(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting affiliate links by critic username"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create links
    for i in range(2):
        link_data = CriticAffiliateLinkCreate(
            label=f"Link {i}",
            platform="netflix",
            url=f"https://netflix.com/{i}"
        )
        await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Get by username
    links = await repo.list_affiliate_links_by_username(test_critic_profile.username)

    assert len(links) == 2
    for link in links:
        assert link.critic.username == test_critic_profile.username





# ============================================================================
# UPDATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_affiliate_link_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test updating an affiliate link"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="Original Label",
        platform="netflix",
        url="https://netflix.com/original"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Update link
    update_data = CriticAffiliateLinkUpdate(
        label="Updated Label",
        url="https://netflix.com/updated",
        is_active=False
    )
    updated_link = await repo.update_affiliate_link(created_link.id, update_data)

    assert updated_link is not None
    assert updated_link.label == "Updated Label"
    assert updated_link.url == "https://netflix.com/updated"
    assert updated_link.is_active is False
    assert updated_link.updated_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_affiliate_link_not_found(
    async_db_session: AsyncSession
):
    """Test updating non-existent affiliate link returns None"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    update_data = CriticAffiliateLinkUpdate(label="New Label")
    updated_link = await repo.update_affiliate_link(99999, update_data)

    assert updated_link is None


# ============================================================================
# DELETE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_affiliate_link_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting an affiliate link"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="To Delete",
        platform="netflix",
        url="https://netflix.com/delete"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Delete it
    result = await repo.delete_affiliate_link(created_link.id)

    assert result is True

    # Verify it's deleted
    deleted_link = await repo.get_affiliate_link_by_id(created_link.id)
    assert deleted_link is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_affiliate_link_not_found(
    async_db_session: AsyncSession
):
    """Test deleting non-existent affiliate link returns False"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    result = await repo.delete_affiliate_link(99999)

    assert result is False


# ============================================================================
# TRACKING TESTS (CRITICAL FOR AFFILIATE FUNCTIONALITY)
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_track_click_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test tracking clicks on affiliate link"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="Click Test",
        platform="netflix",
        url="https://netflix.com/click"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Track 3 clicks
    for _ in range(3):
        result = await repo.track_click(created_link.id)
        assert result is True

    # Verify click count
    updated_link = await repo.get_affiliate_link_by_id(created_link.id)
    assert updated_link.click_count == 3
    assert updated_link.last_clicked_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_track_click_not_found(
    async_db_session: AsyncSession
):
    """Test tracking click on non-existent link returns False"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    result = await repo.track_click(99999)

    assert result is False


@pytest.mark.asyncio
@pytest.mark.unit
async def test_track_conversion_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test tracking conversions on affiliate link"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create link
    link_data = CriticAffiliateLinkCreate(
        label="Conversion Test",
        platform="amazon",
        url="https://amazon.com/convert"
    )
    created_link = await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Track 2 conversions
    for _ in range(2):
        result = await repo.track_conversion(created_link.id)
        assert result is True

    # Verify conversion count
    updated_link = await repo.get_affiliate_link_by_id(created_link.id)
    assert updated_link.conversion_count == 2


@pytest.mark.asyncio
@pytest.mark.unit
async def test_track_conversion_not_found(
    async_db_session: AsyncSession
):
    """Test tracking conversion on non-existent link returns False"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    result = await repo.track_conversion(99999)

    assert result is False



# ============================================================================
# BUSINESS LOGIC / ANALYTICS TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_total_clicks_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test getting total clicks across all links for a critic"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Critic 1 creates 2 links and tracks clicks
    link_data1 = CriticAffiliateLinkCreate(
        label="Link 1", platform="netflix", url="https://netflix.com/1"
    )
    link1 = await repo.create_affiliate_link(test_critic_profile.id, link_data1)
    for _ in range(5):
        await repo.track_click(link1.id)

    link_data2 = CriticAffiliateLinkCreate(
        label="Link 2", platform="amazon", url="https://amazon.com/2"
    )
    link2 = await repo.create_affiliate_link(test_critic_profile.id, link_data2)
    for _ in range(3):
        await repo.track_click(link2.id)

    # Critic 2 creates link with clicks
    link_data3 = CriticAffiliateLinkCreate(
        label="Link 3", platform="netflix", url="https://netflix.com/3"
    )
    link3 = await repo.create_affiliate_link(test_other_critic_profile.id, link_data3)
    for _ in range(10):
        await repo.track_click(link3.id)

    # Get total clicks for critic 1
    total_clicks = await repo.get_total_clicks_by_critic(test_critic_profile.id)

    assert total_clicks == 8  # 5 + 3


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_total_conversions_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting total conversions across all links for a critic"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create 2 links with conversions
    link_data1 = CriticAffiliateLinkCreate(
        label="Link 1", platform="netflix", url="https://netflix.com/1"
    )
    link1 = await repo.create_affiliate_link(test_critic_profile.id, link_data1)
    for _ in range(2):
        await repo.track_conversion(link1.id)

    link_data2 = CriticAffiliateLinkCreate(
        label="Link 2", platform="amazon", url="https://amazon.com/2"
    )
    link2 = await repo.create_affiliate_link(test_critic_profile.id, link_data2)
    for _ in range(4):
        await repo.track_conversion(link2.id)

    # Get total conversions
    total_conversions = await repo.get_total_conversions_by_critic(test_critic_profile.id)

    assert total_conversions == 6  # 2 + 4


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_top_performing_links(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting top performing links sorted by click count"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create 3 links with different click counts
    links = []
    click_counts = [10, 5, 20]
    for i, clicks in enumerate(click_counts):
        link_data = CriticAffiliateLinkCreate(
            label=f"Link {i}",
            platform="netflix",
            url=f"https://netflix.com/{i}"
        )
        link = await repo.create_affiliate_link(test_critic_profile.id, link_data)
        for _ in range(clicks):
            await repo.track_click(link.id)
        links.append(link)

    # Get top performing links
    top_links = await repo.get_top_performing_links(test_critic_profile.id, limit=2)

    assert len(top_links) == 2
    assert top_links[0].click_count == 20  # Highest first
    assert top_links[1].click_count == 10  # Second highest


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_total_count_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting total count of affiliate links"""
    repo = CriticAffiliateLinkRepository(async_db_session)

    # Create 3 links (2 active, 1 inactive)
    for i in range(2):
        link_data = CriticAffiliateLinkCreate(
            label=f"Active {i}",
            platform="netflix",
            url=f"https://netflix.com/{i}",
            is_active=True
        )
        await repo.create_affiliate_link(test_critic_profile.id, link_data)

    link_data = CriticAffiliateLinkCreate(
        label="Inactive",
        platform="amazon",
        url="https://amazon.com/inactive",
        is_active=False
    )
    await repo.create_affiliate_link(test_critic_profile.id, link_data)

    # Get total count
    total_count = await repo.get_total_count_by_critic(test_critic_profile.id)
    assert total_count == 3

    # Get active count only
    active_count = await repo.get_total_count_by_critic(
        test_critic_profile.id,
        is_active=True
    )
    assert active_count == 2
