"""API routes for critic blog posts"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from ..database import get_db
from ..dependencies import get_current_user
from ..models import User, CriticProfile
from ..repositories.critic_blog import CriticBlogRepository
from ..repositories.critics import CriticRepository
from ..schemas.critic_blog import (
    CriticBlogPostCreate,
    CriticBlogPostUpdate,
    CriticBlogPostResponse,
    CriticBlogPostListResponse,
    PublishBlogPostRequest
)

router = APIRouter(prefix="/api/v1/critic-blog", tags=["Critic Blog"])


async def get_critic_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> CriticProfile:
    """Dependency to get current user's critic profile"""
    critic_repo = CriticRepository(db)
    critic_profile = await critic_repo.get_critic_by_user_id(current_user.id)
    
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only critics can access this endpoint"
        )
    
    return critic_profile


@router.post("", response_model=CriticBlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post_data: CriticBlogPostCreate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Create a new blog post (critics only)"""
    blog_repo = CriticBlogRepository(db)
    
    blog_post = await blog_repo.create_blog_post(
        critic_id=critic_profile.id,
        post_data=post_data
    )
    
    return CriticBlogPostResponse.model_validate(blog_post)


@router.get("/{post_identifier}", response_model=CriticBlogPostResponse)
async def get_blog_post(
    post_identifier: str,
    db: AsyncSession = Depends(get_db)
):
    """Get blog post by ID, external ID, or slug (public)"""
    blog_repo = CriticBlogRepository(db)
    
    # Try to get by external_id first
    blog_post = await blog_repo.get_blog_post_by_external_id(post_identifier)
    
    # If not found, try by slug
    if not blog_post:
        blog_post = await blog_repo.get_blog_post_by_slug(post_identifier)
    
    # If still not found, try by ID (if numeric)
    if not blog_post and post_identifier.isdigit():
        blog_post = await blog_repo.get_blog_post_by_id(int(post_identifier))
    
    if not blog_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Only show published posts to non-owners
    # (This will be enhanced with proper ownership check in update)
    
    # Increment view count for published posts
    if blog_post.status == "published":
        await blog_repo.increment_view_count(blog_post.id)
    
    return CriticBlogPostResponse.model_validate(blog_post)


@router.put("/{post_id}", response_model=CriticBlogPostResponse)
async def update_blog_post(
    post_id: int,
    post_data: CriticBlogPostUpdate,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Update blog post (owner only)"""
    blog_repo = CriticBlogRepository(db)
    
    # Get existing post
    existing_post = await blog_repo.get_blog_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check ownership
    if existing_post.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own blog posts"
        )
    
    # Update post
    updated_post = await blog_repo.update_blog_post(post_id, post_data)
    
    return CriticBlogPostResponse.model_validate(updated_post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Delete blog post (owner only)"""
    blog_repo = CriticBlogRepository(db)
    
    # Get existing post
    existing_post = await blog_repo.get_blog_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check ownership
    if existing_post.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own blog posts"
        )
    
    # Delete post
    await blog_repo.delete_blog_post(post_id)
    
    return None


@router.get("/critic/{username}", response_model=CriticBlogPostListResponse)
async def list_blog_posts_by_critic(
    username: str,
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """List blog posts by critic username (public for published, owner for all)"""
    blog_repo = CriticBlogRepository(db)
    critic_repo = CriticRepository(db)
    
    # Get critic profile
    critic_profile = await critic_repo.get_critic_by_username(username)
    if not critic_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Critic not found"
        )
    
    # Check if current user is the owner
    is_owner = current_user and critic_profile.user_id == current_user.id
    
    # If not owner, only show published posts
    if not is_owner and status_filter != "published":
        status_filter = "published"
    
    # Get posts
    posts = await blog_repo.list_blog_posts_by_username(
        username=username,
        status=status_filter,
        limit=limit,
        offset=offset
    )
    
    # Get total count
    total = await blog_repo.get_total_count_by_critic(
        critic_id=critic_profile.id,
        status=status_filter
    )
    
    return CriticBlogPostListResponse(
        posts=[CriticBlogPostResponse.model_validate(post) for post in posts],
        total=total,
        limit=limit,
        offset=offset
    )


@router.post("/{post_id}/publish", response_model=CriticBlogPostResponse)
async def publish_blog_post(
    post_id: int,
    critic_profile: CriticProfile = Depends(get_critic_profile),
    db: AsyncSession = Depends(get_db)
):
    """Publish a draft blog post (owner only)"""
    blog_repo = CriticBlogRepository(db)
    
    # Get existing post
    existing_post = await blog_repo.get_blog_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Check ownership
    if existing_post.critic_id != critic_profile.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only publish your own blog posts"
        )
    
    # Check if already published
    if existing_post.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blog post is already published"
        )
    
    # Publish post
    published_post = await blog_repo.publish_blog_post(post_id)
    
    return CriticBlogPostResponse.model_validate(published_post)


@router.post("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def like_blog_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a blog post (authenticated users)"""
    blog_repo = CriticBlogRepository(db)
    
    # Check if post exists
    existing_post = await blog_repo.get_blog_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Increment like count
    await blog_repo.increment_like_count(post_id)
    
    return None


@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_blog_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a blog post (authenticated users)"""
    blog_repo = CriticBlogRepository(db)
    
    # Check if post exists
    existing_post = await blog_repo.get_blog_post_by_id(post_id)
    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    # Decrement like count
    await blog_repo.decrement_like_count(post_id)
    
    return None

