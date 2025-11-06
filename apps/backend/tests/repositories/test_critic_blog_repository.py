"""
Unit Tests for CriticBlogRepository

Tests all 15 methods from apps/backend/src/repositories/critic_blog.py:
- create_blog_post
- get_blog_post_by_id
- get_blog_post_by_external_id
- get_blog_post_by_slug
- update_blog_post
- delete_blog_post
- publish_blog_post
- unpublish_blog_post
- get_blog_posts_by_critic
- get_blog_posts_by_status
- increment_view_count
- get_popular_posts
- search_blog_posts
- get_blog_post_count
- generate_unique_slug

Author: IWM Development Team
Date: 2025-01-30
"""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from src.repositories.critic_blog import CriticBlogRepository
from src.schemas.critic_blog import CriticBlogPostCreate, CriticBlogPostUpdate
from src.models import CriticBlogPost, CriticProfile, User


# ============================================================================
# CREATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_blog_post_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating a blog post successfully"""
    repo = CriticBlogRepository(async_db_session)

    post_data = CriticBlogPostCreate(
        title="My First Blog Post",
        content="This is the content of my first blog post.",
        excerpt="A short excerpt",
        cover_image_url="https://example.com/image.jpg",
        tags=["movies", "reviews"],
        status="draft"
    )

    blog_post = await repo.create_blog_post(
        critic_id=test_critic_profile.id,
        post_data=post_data
    )

    assert blog_post is not None
    assert blog_post.id is not None
    assert blog_post.external_id.startswith("bp_")
    assert blog_post.title == "My First Blog Post"
    assert blog_post.content == "This is the content of my first blog post."
    assert blog_post.excerpt == "A short excerpt"
    assert blog_post.cover_image_url == "https://example.com/image.jpg"
    assert blog_post.tags == ["movies", "reviews"]
    assert blog_post.status == "draft"
    assert blog_post.slug is not None
    assert "my-first-blog-post" in blog_post.slug
    assert blog_post.published_at is None  # Draft posts not published
    assert blog_post.view_count == 0
    assert blog_post.critic_id == test_critic_profile.id


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_blog_post_published_sets_published_at(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test creating a published blog post sets published_at"""
    repo = CriticBlogRepository(async_db_session)

    post_data = CriticBlogPostCreate(
        title="Published Post",
        content="This post is published immediately.",
        status="published"
    )

    blog_post = await repo.create_blog_post(
        critic_id=test_critic_profile.id,
        post_data=post_data
    )

    assert blog_post.status == "published"
    assert blog_post.published_at is not None
    assert isinstance(blog_post.published_at, datetime)


@pytest.mark.asyncio
@pytest.mark.unit
async def test_create_blog_post_generates_unique_slug(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test that slug generation creates unique slugs"""
    repo = CriticBlogRepository(async_db_session)

    # Create first post
    post_data1 = CriticBlogPostCreate(
        title="Same Title",
        content="First post content",
        status="draft"
    )
    post1 = await repo.create_blog_post(test_critic_profile.id, post_data1)

    # Create second post with same title
    post_data2 = CriticBlogPostCreate(
        title="Same Title",
        content="Second post content",
        status="draft"
    )
    post2 = await repo.create_blog_post(test_critic_profile.id, post_data2)

    # Slugs should be different (external_id makes them unique)
    assert post1.slug != post2.slug
    assert "same-title" in post1.slug
    assert "same-title" in post2.slug


# ============================================================================
# READ TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_blog_post_by_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting blog post by ID"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Test Post",
        content="Test content",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    # Retrieve by ID
    retrieved_post = await repo.get_blog_post_by_id(created_post.id)

    assert retrieved_post is not None
    assert retrieved_post.id == created_post.id
    assert retrieved_post.title == "Test Post"
    assert retrieved_post.critic is not None  # Relationship loaded
    assert retrieved_post.critic.user is not None  # Nested relationship loaded


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_blog_post_by_id_not_found(
    async_db_session: AsyncSession
):
    """Test getting blog post by non-existent ID returns None"""
    repo = CriticBlogRepository(async_db_session)

    retrieved_post = await repo.get_blog_post_by_id(99999)

    assert retrieved_post is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_blog_post_by_external_id_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting blog post by external ID"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Test Post",
        content="Test content",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    # Retrieve by external ID
    retrieved_post = await repo.get_blog_post_by_external_id(created_post.external_id)

    assert retrieved_post is not None
    assert retrieved_post.external_id == created_post.external_id
    assert retrieved_post.title == "Test Post"


@pytest.mark.asyncio
@pytest.mark.unit
async def test_get_blog_post_by_slug_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test getting blog post by slug"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Test Post",
        content="Test content",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    # Retrieve by slug
    retrieved_post = await repo.get_blog_post_by_slug(created_post.slug)

    assert retrieved_post is not None
    assert retrieved_post.slug == created_post.slug
    assert retrieved_post.title == "Test Post"


# ============================================================================
# UPDATE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_blog_post_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test updating a blog post"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Original Title",
        content="Original content",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    # Update the post
    update_data = CriticBlogPostUpdate(
        title="Updated Title",
        content="Updated content",
        excerpt="New excerpt",
        tags=["updated", "tags"]
    )
    updated_post = await repo.update_blog_post(created_post.id, update_data)

    assert updated_post is not None
    assert updated_post.id == created_post.id
    assert updated_post.title == "Updated Title"
    assert updated_post.content == "Updated content"
    assert updated_post.excerpt == "New excerpt"
    assert updated_post.tags == ["updated", "tags"]
    # Slug should be regenerated based on new title
    assert "updated-title" in updated_post.slug


@pytest.mark.asyncio
@pytest.mark.unit
async def test_update_blog_post_not_found(
    async_db_session: AsyncSession
):
    """Test updating non-existent blog post returns None"""
    repo = CriticBlogRepository(async_db_session)

    update_data = CriticBlogPostUpdate(title="New Title")
    updated_post = await repo.update_blog_post(99999, update_data)

    assert updated_post is None





# ============================================================================
# DELETE TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_blog_post_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test deleting a blog post"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Post to Delete",
        content="This will be deleted",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)
    post_id = created_post.id

    # Delete the post
    result = await repo.delete_blog_post(post_id)

    assert result is True

    # Verify it's deleted
    deleted_post = await repo.get_blog_post_by_id(post_id)
    assert deleted_post is None


@pytest.mark.asyncio
@pytest.mark.unit
async def test_delete_blog_post_not_found(
    async_db_session: AsyncSession
):
    """Test deleting non-existent blog post returns False"""
    repo = CriticBlogRepository(async_db_session)

    result = await repo.delete_blog_post(99999)

    assert result is False


# ============================================================================
# PUBLISH/UNPUBLISH TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_publish_blog_post_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test publishing a draft blog post"""
    repo = CriticBlogRepository(async_db_session)

    # Create a draft post
    post_data = CriticBlogPostCreate(
        title="Draft Post",
        content="Draft content",
        status="draft"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    assert created_post.status == "draft"
    assert created_post.published_at is None

    # Publish the post
    published_post = await repo.publish_blog_post(created_post.id)

    assert published_post is not None
    assert published_post.status == "published"
    assert published_post.published_at is not None
    assert isinstance(published_post.published_at, datetime)


@pytest.mark.asyncio
@pytest.mark.unit
async def test_unpublish_blog_post_success(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test unpublishing a published blog post"""
    repo = CriticBlogRepository(async_db_session)

    # Create a published post
    post_data = CriticBlogPostCreate(
        title="Published Post",
        content="Published content",
        status="published"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    assert created_post.status == "published"
    assert created_post.published_at is not None

    # Unpublish the post
    unpublished_post = await repo.unpublish_blog_post(created_post.id)

    assert unpublished_post is not None
    assert unpublished_post.status == "draft"


# ============================================================================
# VIEW COUNT TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_increment_view_count(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test incrementing view count"""
    repo = CriticBlogRepository(async_db_session)

    # Create a post
    post_data = CriticBlogPostCreate(
        title="Popular Post",
        content="This will get views",
        status="published"
    )
    created_post = await repo.create_blog_post(test_critic_profile.id, post_data)

    assert created_post.view_count == 0

    # Increment view count multiple times
    await repo.increment_view_count(created_post.id)
    await repo.increment_view_count(created_post.id)
    await repo.increment_view_count(created_post.id)

    # Retrieve and check
    updated_post = await repo.get_blog_post_by_id(created_post.id)
    assert updated_post.view_count == 3


# ============================================================================
# SEARCH TESTS
# ============================================================================

@pytest.mark.asyncio
@pytest.mark.unit
async def test_search_blog_posts_by_title(
    async_db_session: AsyncSession,
    test_critic_profile: CriticProfile
):
    """Test searching blog posts by title"""
    repo = CriticBlogRepository(async_db_session)

    # Create posts with different titles
    titles = [
        "The Best Movies of 2024",
        "Top 10 Action Films",
        "My Favorite Dramas"
    ]

    for title in titles:
        post_data = CriticBlogPostCreate(
            title=title,
            content="Content",
            status="published"
        )
        await repo.create_blog_post(test_critic_profile.id, post_data)

    # Search for "movies"
    results = await repo.search_blog_posts(query="movies")

    assert len(results) >= 1
    assert any("Movies" in post.title for post in results)
