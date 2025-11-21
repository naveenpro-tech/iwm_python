"""
Unit Tests for CriticPinnedContentRepository

Tests all 11 methods from apps/backend/src/repositories/critic_pinned.py:
- create_pinned_content
- get_pinned_content_by_id
- get_pinned_content_by_external_id
- get_pinned_content_by_critic
- get_pinned_content_by_username
- update_pinned_content
- delete_pinned_content
- reorder_pinned_content
- get_pinned_count
- check_duplicate_pin
- _reorder_after_delete (tested indirectly through delete)

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from src.repositories.critic_pinned import CriticPinnedContentRepository
from src.schemas.critic_pinned import CriticPinnedContentCreate, CriticPinnedContentUpdate
from src.models import CriticPinnedContent, CriticProfile


# ============================================================================
# CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_pinned_content_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating pinned content successfully"""
    repo = CriticPinnedContentRepository(async_db_session)

    pin_data = CriticPinnedContentCreate(
        content_type="review",
        content_id=123
    )

    pinned = await repo.create_pinned_content(
        critic_id=test_critic_profile.id,
        pinned_data=pin_data
    )

    assert pinned is not None
    assert pinned.id is not None
    assert pinned.external_id.startswith("pin_")
    assert pinned.critic_id == test_critic_profile.id
    assert pinned.content_type == "review"
    assert pinned.content_id == 123
    assert pinned.display_order == 0  # First item gets order 0
    assert pinned.pinned_at is not None
    assert isinstance(pinned.pinned_at, datetime)


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_pinned_content_auto_increment_display_order(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that display_order auto-increments for new pins"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create first pin
    pin_data1 = CriticPinnedContentCreate(content_type="review", content_id=1)
    pin1 = await repo.create_pinned_content(test_critic_profile.id, pin_data1)

    # Create second pin
    pin_data2 = CriticPinnedContentCreate(content_type="blog_post", content_id=2)
    pin2 = await repo.create_pinned_content(test_critic_profile.id, pin_data2)

    # Create third pin
    pin_data3 = CriticPinnedContentCreate(content_type="recommendation", content_id=3)
    pin3 = await repo.create_pinned_content(test_critic_profile.id, pin_data3)

    assert pin1.display_order == 0
    assert pin2.display_order == 1
    assert pin3.display_order == 2


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_pinned_content_different_critics_independent_order(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test that different critics have independent display orders"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Critic 1 creates 2 pins
    pin_data1 = CriticPinnedContentCreate(content_type="review", content_id=1)
    pin1 = await repo.create_pinned_content(test_critic_profile.id, pin_data1)

    pin_data2 = CriticPinnedContentCreate(content_type="review", content_id=2)
    pin2 = await repo.create_pinned_content(test_critic_profile.id, pin_data2)

    # Critic 2 creates first pin (should start at 0)
    pin_data3 = CriticPinnedContentCreate(content_type="review", content_id=3)
    pin3 = await repo.create_pinned_content(test_other_critic_profile.id, pin_data3)

    assert pin1.display_order == 0
    assert pin2.display_order == 1
    assert pin3.display_order == 0  # Independent ordering


# ============================================================================
# READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting pinned content by ID"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pinned content
    pin_data = CriticPinnedContentCreate(content_type="blog_post", content_id=456)
    created_pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Retrieve by ID
    retrieved_pin = await repo.get_pinned_content_by_id(created_pin.id)

    assert retrieved_pin is not None
    assert retrieved_pin.id == created_pin.id
    assert retrieved_pin.content_type == "blog_post"
    assert retrieved_pin.content_id == 456
    assert retrieved_pin.critic is not None  # Relationship loaded
    assert retrieved_pin.critic.user is not None  # Nested relationship loaded


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_id_not_found(
    async_db_session: AsyncSession
):
    """Test getting pinned content by non-existent ID returns None"""
    repo = CriticPinnedContentRepository(async_db_session)

    retrieved_pin = await repo.get_pinned_content_by_id(99999)

    assert retrieved_pin is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_external_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting pinned content by external ID"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pinned content
    pin_data = CriticPinnedContentCreate(content_type="recommendation", content_id=789)
    created_pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Retrieve by external ID
    retrieved_pin = await repo.get_pinned_content_by_external_id(created_pin.external_id)

    assert retrieved_pin is not None
    assert retrieved_pin.external_id == created_pin.external_id
    assert retrieved_pin.content_type == "recommendation"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_critic_ordered(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting all pinned content for critic in display order"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 3 pins
    for i in range(3):
        pin_data = CriticPinnedContentCreate(
            content_type="review",
            content_id=100 + i
        )
        await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Get all pins
    pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)

    assert len(pins) == 3
    # Verify they're ordered by display_order ascending
    assert pins[0].display_order == 0
    assert pins[1].display_order == 1
    assert pins[2].display_order == 2


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_critic_only_own_content(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test that get_pinned_content_by_critic only returns that critic's pins"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Critic 1 creates 2 pins
    for i in range(2):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Critic 2 creates 1 pin
    pin_data = CriticPinnedContentCreate(content_type="review", content_id=99)
    await repo.create_pinned_content(test_other_critic_profile.id, pin_data)

    # Get pins for critic 1
    critic1_pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)

    assert len(critic1_pins) == 2
    for pin in critic1_pins:
        assert pin.critic_id == test_critic_profile.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_content_by_username(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting pinned content by critic username"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pins
    for i in range(2):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Get by username
    pins = await repo.get_pinned_content_by_username(test_critic_profile.username)

    assert len(pins) == 2
    for pin in pins:
        assert pin.critic.username == test_critic_profile.username


# ============================================================================
# UPDATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_pinned_content_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test updating pinned content display order"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pinned content
    pin_data = CriticPinnedContentCreate(content_type="review", content_id=1)
    created_pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Update display order
    update_data = CriticPinnedContentUpdate(display_order=5)
    updated_pin = await repo.update_pinned_content(created_pin.id, update_data)

    assert updated_pin is not None
    assert updated_pin.display_order == 5
    assert updated_pin.updated_at is not None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_pinned_content_not_found(
    async_db_session: AsyncSession
):
    """Test updating non-existent pinned content returns None"""
    repo = CriticPinnedContentRepository(async_db_session)

    update_data = CriticPinnedContentUpdate(display_order=3)
    updated_pin = await repo.update_pinned_content(99999, update_data)

    assert updated_pin is None





# ============================================================================
# DELETE TESTS (INCLUDING CRITICAL AUTO-REORDER TEST)
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_pinned_content_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting pinned content"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pinned content
    pin_data = CriticPinnedContentCreate(content_type="review", content_id=1)
    created_pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Delete it
    result = await repo.delete_pinned_content(created_pin.id)

    assert result is True

    # Verify it's deleted
    deleted_pin = await repo.get_pinned_content_by_id(created_pin.id)
    assert deleted_pin is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_pinned_content_not_found(
    async_db_session: AsyncSession
):
    """Test deleting non-existent pinned content returns False"""
    repo = CriticPinnedContentRepository(async_db_session)

    result = await repo.delete_pinned_content(99999)

    assert result is False


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_pinned_content_auto_reorder(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """
    CRITICAL TEST: Test that deleting item auto-reorders remaining items

    Scenario:
    - Create 5 pins with display_order: 0, 1, 2, 3, 4
    - Delete pin at position 2
    - Remaining pins should be reordered to: 0, 1, 2, 3 (no gaps)
    """
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 5 pins
    pins = []
    for i in range(5):
        pin_data = CriticPinnedContentCreate(
            content_type="review",
            content_id=100 + i
        )
        pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)
        pins.append(pin)

    # Verify initial order
    assert pins[0].display_order == 0
    assert pins[1].display_order == 1
    assert pins[2].display_order == 2
    assert pins[3].display_order == 3
    assert pins[4].display_order == 4

    # Delete pin at position 2 (middle item)
    await repo.delete_pinned_content(pins[2].id)

    # Get remaining pins
    remaining_pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)

    # Should have 4 pins now
    assert len(remaining_pins) == 4

    # Verify auto-reordering (no gaps)
    assert remaining_pins[0].display_order == 0
    assert remaining_pins[1].display_order == 1
    assert remaining_pins[2].display_order == 2  # Was position 3, now 2
    assert remaining_pins[3].display_order == 3  # Was position 4, now 3

    # Verify content IDs match (pins 0, 1, 3, 4 remain)
    assert remaining_pins[0].content_id == 100
    assert remaining_pins[1].content_id == 101
    assert remaining_pins[2].content_id == 103  # Was pin[3]
    assert remaining_pins[3].content_id == 104  # Was pin[4]


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_first_pinned_content_auto_reorder(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting first item auto-reorders remaining items"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 3 pins
    pins = []
    for i in range(3):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)
        pins.append(pin)

    # Delete first pin
    await repo.delete_pinned_content(pins[0].id)

    # Get remaining pins
    remaining_pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)

    assert len(remaining_pins) == 2
    assert remaining_pins[0].display_order == 0  # Was 1, now 0
    assert remaining_pins[1].display_order == 1  # Was 2, now 1


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_last_pinned_content_auto_reorder(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting last item doesn't affect other items"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 3 pins
    pins = []
    for i in range(3):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)
        pins.append(pin)

    # Delete last pin
    await repo.delete_pinned_content(pins[2].id)

    # Get remaining pins
    remaining_pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)

    assert len(remaining_pins) == 2
    assert remaining_pins[0].display_order == 0
    assert remaining_pins[1].display_order == 1



# ============================================================================
# REORDER TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_reorder_pinned_content_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test reordering pinned content"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 3 pins
    pins = []
    for i in range(3):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        pin = await repo.create_pinned_content(test_critic_profile.id, pin_data)
        pins.append(pin)

    # Reorder: swap first and last
    pin_orders = [
        {"pin_id": pins[0].id, "display_order": 2},
        {"pin_id": pins[1].id, "display_order": 1},
        {"pin_id": pins[2].id, "display_order": 0}
    ]

    result = await repo.reorder_pinned_content(test_critic_profile.id, pin_orders)

    assert result is True

    # Verify new order
    reordered_pins = await repo.get_pinned_content_by_critic(test_critic_profile.id)
    assert reordered_pins[0].id == pins[2].id  # Last is now first
    assert reordered_pins[1].id == pins[1].id  # Middle stays middle
    assert reordered_pins[2].id == pins[0].id  # First is now last


@pytest.mark.asyncio
@pytest.mark.unit
async def test_reorder_pinned_content_only_own_content(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test that reorder only affects critic's own content"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Critic 1 creates pin
    pin_data1 = CriticPinnedContentCreate(content_type="review", content_id=1)
    pin1 = await repo.create_pinned_content(test_critic_profile.id, pin_data1)

    # Critic 2 creates pin
    pin_data2 = CriticPinnedContentCreate(content_type="review", content_id=2)
    pin2 = await repo.create_pinned_content(test_other_critic_profile.id, pin_data2)

    # Critic 1 tries to reorder critic 2's pin (should be ignored)
    pin_orders = [
        {"pin_id": pin2.id, "display_order": 5}
    ]

    await repo.reorder_pinned_content(test_critic_profile.id, pin_orders)

    # Verify critic 2's pin unchanged
    pin2_after = await repo.get_pinned_content_by_id(pin2.id)
    assert pin2_after.display_order == 0  # Unchanged


# ============================================================================
# BUSINESS LOGIC TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_pinned_count(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile,
    test_other_critic_profile: CriticProfile
):
    """Test getting count of pinned content"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Critic 1 creates 3 pins
    for i in range(3):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Critic 2 creates 2 pins
    for i in range(2):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i + 10)
        await repo.create_pinned_content(test_other_critic_profile.id, pin_data)

    # Get counts
    count1 = await repo.get_pinned_count(test_critic_profile.id)
    count2 = await repo.get_pinned_count(test_other_critic_profile.id)

    assert count1 == 3
    assert count2 == 2


@pytest.mark.asyncio
@pytest.mark.unit
async def test_check_duplicate_pin_exists(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test duplicate check detects existing pin"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pin
    pin_data = CriticPinnedContentCreate(content_type="review", content_id=123)
    await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Check for duplicate
    duplicate = await repo.check_duplicate_pin(
        test_critic_profile.id,
        "review",
        123
    )

    assert duplicate is not None
    assert duplicate.content_type == "review"
    assert duplicate.content_id == 123


@pytest.mark.asyncio
@pytest.mark.unit
async def test_check_duplicate_pin_not_exists(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test duplicate check returns None when no duplicate"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Check for duplicate before creating any
    duplicate = await repo.check_duplicate_pin(
        test_critic_profile.id,
        "review",
        123
    )

    assert duplicate is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_check_duplicate_pin_different_content_type(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that same content_id with different type is not a duplicate"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create pin for review
    pin_data1 = CriticPinnedContentCreate(content_type="review", content_id=123)
    await repo.create_pinned_content(test_critic_profile.id, pin_data1)

    # Check for blog_post with same ID (should not be duplicate)
    duplicate = await repo.check_duplicate_pin(
        test_critic_profile.id,
        "blog_post",
        123
    )

    assert duplicate is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_max_5_pins_validation(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that critics can pin up to 5 items (business rule validation)"""
    repo = CriticPinnedContentRepository(async_db_session)

    # Create 5 pins (max allowed)
    for i in range(5):
        pin_data = CriticPinnedContentCreate(content_type="review", content_id=i)
        await repo.create_pinned_content(test_critic_profile.id, pin_data)

    # Verify count
    count = await repo.get_pinned_count(test_critic_profile.id)
    assert count == 5

    # Note: Actual enforcement of max 5 limit should be in API layer
    # This test just verifies the count method works correctly
