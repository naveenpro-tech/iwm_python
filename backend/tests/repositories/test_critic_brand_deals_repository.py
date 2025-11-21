"""
Unit Tests for CriticBrandDealRepository

Tests brand deal and sponsor disclosure methods from apps/backend/src/repositories/critic_brand_deals.py:

Brand Deal Methods (9):
- create_brand_deal, get_brand_deal_by_id, get_brand_deal_by_external_id
- list_brand_deals_by_critic, list_brand_deals_by_username
- update_brand_deal, delete_brand_deal
- update_deal_status, get_total_count_by_critic

Sponsor Disclosure Methods (7):
- create_sponsor_disclosure, get_disclosure_by_id
- get_disclosure_by_review_id, get_disclosure_by_blog_post_id
- update_sponsor_disclosure, delete_sponsor_disclosure
- get_disclosures_by_critic

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from src.repositories.critic_brand_deals import CriticBrandDealRepository
from src.schemas.critic_brand_deals import (
    CriticBrandDealCreate,
    CriticBrandDealUpdate,
    CriticSponsorDisclosureCreate
)
from src.models import CriticBrandDeal, CriticSponsorDisclosure, CriticProfile


# ============================================================================
# BRAND DEAL CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_brand_deal_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating a brand deal successfully"""
    repo = CriticBrandDealRepository(async_db_session)

    deal_data = CriticBrandDealCreate(
        brand_name="Netflix",
        campaign_title="Q1 2024 Movie Promotion",
        brief="Promote new releases in Q1 2024",
        rate_card=5000.00,
        status="pending",
        deliverables={"videos": 2, "posts": 3},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=90)
    )

    deal = await repo.create_brand_deal(
        critic_id=test_critic_profile.id,
        deal_data=deal_data
    )

    assert deal is not None
    assert deal.id is not None
    assert deal.external_id.startswith("deal_")
    assert deal.critic_id == test_critic_profile.id
    assert deal.brand_name == "Netflix"
    assert deal.campaign_title == "Q1 2024 Movie Promotion"
    assert deal.rate_card == 5000.00
    assert deal.status == "pending"
    assert deal.deliverables == {"videos": 2, "posts": 3}
    assert deal.requires_disclosure is True
    assert deal.created_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_brand_deal_with_deliverables_json(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that deliverables JSON field stores and retrieves correctly"""
    repo = CriticBrandDealRepository(async_db_session)

    deliverables = {
        "youtube_videos": 3,
        "instagram_posts": 5,
        "blog_posts": 2,
        "requirements": ["Must mention product", "Include affiliate link"]
    }

    deal_data = CriticBrandDealCreate(
        brand_name="Amazon Prime",
        campaign_title="Prime Video Campaign",
        brief="Promote Prime Video content",
        rate_card=3000.00,
        status="accepted",
        deliverables=deliverables,
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=60)
    )

    deal = await repo.create_brand_deal(test_critic_profile.id, deal_data)

    assert deal.deliverables == deliverables
    assert deal.deliverables["youtube_videos"] == 3
    assert "Must mention product" in deal.deliverables["requirements"]


# ============================================================================
# BRAND DEAL READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_brand_deal_by_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting brand deal by ID"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create deal
    deal_data = CriticBrandDealCreate(
        brand_name="Disney+",
        campaign_title="Marvel Series Promo",
        brief="Promote Marvel series",
        rate_card=4000.00,
        status="active",
        deliverables={"videos": 1},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    created_deal = await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Retrieve by ID
    retrieved_deal = await repo.get_brand_deal_by_id(created_deal.id)

    assert retrieved_deal is not None
    assert retrieved_deal.id == created_deal.id
    assert retrieved_deal.brand_name == "Disney+"
    assert retrieved_deal.critic is not None  # Relationship loaded
    assert retrieved_deal.critic.user is not None  # Nested relationship loaded


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_brand_deal_by_id_not_found(
    async_db_session: AsyncSession
):
    """Test getting brand deal by non-existent ID returns None"""
    repo = CriticBrandDealRepository(async_db_session)

    retrieved_deal = await repo.get_brand_deal_by_id(99999)

    assert retrieved_deal is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_brand_deals_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test getting all brand deals by critic"""
    repo = CriticBrandDealRepository(async_db_session)

    # Critic 1 creates 2 deals
    for i in range(2):
        deal_data = CriticBrandDealCreate(
            brand_name=f"Brand {i}",
            campaign_title=f"Campaign {i}",
            brief="Brief",
            rate_card=1000.00,
            status="pending",
            deliverables={},
            requires_disclosure=True,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30)
        )
        await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Critic 2 creates 1 deal
    deal_data = CriticBrandDealCreate(
        brand_name="Other Brand",
        campaign_title="Other Campaign",
        brief="Brief",
        rate_card=2000.00,
        status="active",
        deliverables={},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    await repo.create_brand_deal(test_other_critic_profile.id, deal_data)

    # Get deals for critic 1
    critic1_deals = await repo.list_brand_deals_by_critic(test_critic_profile.id)

    assert len(critic1_deals) == 2
    for deal in critic1_deals:
        assert deal.critic_id == test_critic_profile.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_list_brand_deals_by_critic_filter_status(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test filtering brand deals by status"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create deals with different statuses
    for status in ["pending", "accepted", "pending"]:
        deal_data = CriticBrandDealCreate(
            brand_name="Brand",
            campaign_title=f"{status} Campaign",
            brief="Brief",
            rate_card=1000.00,
            status=status,
            deliverables={},
            requires_disclosure=True,
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=30)
        )
        await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Get only pending deals
    pending_deals = await repo.list_brand_deals_by_critic(
        test_critic_profile.id,
        status="pending"
    )

    assert len(pending_deals) == 2
    for deal in pending_deals:
        assert deal.status == "pending"


# ============================================================================
# BRAND DEAL UPDATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_brand_deal_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test updating a brand deal"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create deal
    deal_data = CriticBrandDealCreate(
        brand_name="Original Brand",
        campaign_title="Original Campaign",
        brief="Original brief",
        rate_card=1000.00,
        status="pending",
        deliverables={},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    created_deal = await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Update deal
    update_data = CriticBrandDealUpdate(
        campaign_title="Updated Campaign",
        rate_card=2000.00,
        status="accepted"
    )
    updated_deal = await repo.update_brand_deal(created_deal.id, update_data)

    assert updated_deal is not None
    assert updated_deal.campaign_title == "Updated Campaign"
    assert updated_deal.rate_card == 2000.00
    assert updated_deal.status == "accepted"
    assert updated_deal.updated_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_deal_status_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test updating deal status (status transition)"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create pending deal
    deal_data = CriticBrandDealCreate(
        brand_name="Brand",
        campaign_title="Campaign",
        brief="Brief",
        rate_card=1000.00,
        status="pending",
        deliverables={},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    created_deal = await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Update status to accepted
    updated_deal = await repo.update_deal_status(created_deal.id, "accepted")

    assert updated_deal is not None
    assert updated_deal.status == "accepted"

    # Update status to completed
    completed_deal = await repo.update_deal_status(created_deal.id, "completed")

    assert completed_deal.status == "completed"


# ============================================================================
# BRAND DEAL DELETE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_brand_deal_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting a brand deal"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create deal
    deal_data = CriticBrandDealCreate(
        brand_name="Brand",
        campaign_title="Campaign",
        brief="Brief",
        rate_card=1000.00,
        status="pending",
        deliverables={},
        requires_disclosure=True,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30)
    )
    created_deal = await repo.create_brand_deal(test_critic_profile.id, deal_data)

    # Delete it
    result = await repo.delete_brand_deal(created_deal.id)

    assert result is True

    # Verify it's deleted
    deleted_deal = await repo.get_brand_deal_by_id(created_deal.id)
    assert deleted_deal is None


# ============================================================================
# SPONSOR DISCLOSURE CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_sponsor_disclosure_for_review(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating sponsor disclosure linked to review"""
    repo = CriticBrandDealRepository(async_db_session)

    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="sponsored",
        disclosure_text="This review is sponsored by Netflix",
        review_id=123,
        blog_post_id=None
    )

    disclosure = await repo.create_sponsor_disclosure(
        critic_id=test_critic_profile.id,
        disclosure_data=disclosure_data
    )

    assert disclosure is not None
    assert disclosure.id is not None
    assert disclosure.critic_id == test_critic_profile.id
    assert disclosure.disclosure_type == "sponsored"
    assert disclosure.disclosure_text == "This review is sponsored by Netflix"
    assert disclosure.review_id == 123
    assert disclosure.blog_post_id is None
    assert disclosure.created_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_sponsor_disclosure_for_blog_post(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating sponsor disclosure linked to blog post"""
    repo = CriticBrandDealRepository(async_db_session)

    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="affiliate",
        disclosure_text="This post contains affiliate links",
        review_id=None,
        blog_post_id=456
    )

    disclosure = await repo.create_sponsor_disclosure(
        test_critic_profile.id,
        disclosure_data
    )

    assert disclosure.disclosure_type == "affiliate"
    assert disclosure.review_id is None
    assert disclosure.blog_post_id == 456


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_sponsor_disclosure_type_validation(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test all valid disclosure types"""
    repo = CriticBrandDealRepository(async_db_session)

    valid_types = ["sponsored", "affiliate", "gifted", "partnership"]

    for disclosure_type in valid_types:
        disclosure_data = CriticSponsorDisclosureCreate(
            disclosure_type=disclosure_type,
            disclosure_text=f"This is a {disclosure_type} disclosure",
            review_id=100 + valid_types.index(disclosure_type),
            blog_post_id=None
        )

        disclosure = await repo.create_sponsor_disclosure(
            test_critic_profile.id,
            disclosure_data
        )

        assert disclosure.disclosure_type == disclosure_type


# ============================================================================
# SPONSOR DISCLOSURE READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_disclosure_by_review_id(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting disclosure by review ID"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create disclosure for review
    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="sponsored",
        disclosure_text="Sponsored review",
        review_id=789,
        blog_post_id=None
    )
    created_disclosure = await repo.create_sponsor_disclosure(
        test_critic_profile.id,
        disclosure_data
    )

    # Retrieve by review ID
    retrieved_disclosure = await repo.get_disclosure_by_review_id(789)

    assert retrieved_disclosure is not None
    assert retrieved_disclosure.id == created_disclosure.id
    assert retrieved_disclosure.review_id == 789


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_disclosure_by_blog_post_id(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting disclosure by blog post ID"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create disclosure for blog post
    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="affiliate",
        disclosure_text="Contains affiliate links",
        review_id=None,
        blog_post_id=999
    )
    created_disclosure = await repo.create_sponsor_disclosure(
        test_critic_profile.id,
        disclosure_data
    )

    # Retrieve by blog post ID
    retrieved_disclosure = await repo.get_disclosure_by_blog_post_id(999)

    assert retrieved_disclosure is not None
    assert retrieved_disclosure.id == created_disclosure.id
    assert retrieved_disclosure.blog_post_id == 999


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_disclosures_by_critic(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test getting all disclosures by critic"""
    repo = CriticBrandDealRepository(async_db_session)

    # Critic 1 creates 3 disclosures
    for i in range(3):
        disclosure_data = CriticSponsorDisclosureCreate(
            disclosure_type="sponsored",
            disclosure_text=f"Disclosure {i}",
            review_id=100 + i,
            blog_post_id=None
        )
        await repo.create_sponsor_disclosure(test_critic_profile.id, disclosure_data)

    # Critic 2 creates 1 disclosure
    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="affiliate",
        disclosure_text="Other disclosure",
        review_id=200,
        blog_post_id=None
    )
    await repo.create_sponsor_disclosure(test_other_critic_profile.id, disclosure_data)

    # Get disclosures for critic 1
    critic1_disclosures = await repo.get_disclosures_by_critic(test_critic_profile.id)

    assert len(critic1_disclosures) == 3
    for disclosure in critic1_disclosures:
        assert disclosure.critic_id == test_critic_profile.id


# ============================================================================
# SPONSOR DISCLOSURE DELETE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_sponsor_disclosure_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting a sponsor disclosure"""
    repo = CriticBrandDealRepository(async_db_session)

    # Create disclosure
    disclosure_data = CriticSponsorDisclosureCreate(
        disclosure_type="sponsored",
        disclosure_text="To delete",
        review_id=111,
        blog_post_id=None
    )
    created_disclosure = await repo.create_sponsor_disclosure(
        test_critic_profile.id,
        disclosure_data
    )

    # Delete it
    result = await repo.delete_sponsor_disclosure(created_disclosure.id)

    assert result is True

    # Verify it's deleted
    deleted_disclosure = await repo.get_disclosure_by_id(created_disclosure.id)
    assert deleted_disclosure is None

