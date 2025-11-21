"""Repository for critic blog post operations"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime
import uuid
import re

from ..models import CriticBlogPost, CriticProfile, User
from ..schemas.critic_blog import CriticBlogPostCreate, CriticBlogPostUpdate


class CriticBlogRepository:
    """Repository for managing critic blog posts"""

    def __init__(self, db: AsyncSession):
        self.db = db

    def _generate_slug(self, title: str, external_id: str) -> str:
        """Generate URL-friendly slug from title"""
        # Convert to lowercase and replace spaces with hyphens
        slug = title.lower().strip()
        # Remove special characters except hyphens and alphanumeric
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        # Replace multiple spaces/hyphens with single hyphen
        slug = re.sub(r'[\s-]+', '-', slug)
        # Remove leading/trailing hyphens
        slug = slug.strip('-')
        # Append short external_id to ensure uniqueness
        slug = f"{slug}-{external_id[:8]}"
        return slug

    async def create_blog_post(
        self,
        critic_id: int,
        post_data: CriticBlogPostCreate
    ) -> CriticBlogPost:
        """Create a new blog post"""
        external_id = f"bp_{uuid.uuid4().hex[:12]}"
        slug = self._generate_slug(post_data.title, external_id)

        blog_post = CriticBlogPost(
            external_id=external_id,
            critic_id=critic_id,
            title=post_data.title,
            slug=slug,
            content=post_data.content,
            excerpt=post_data.excerpt,
            cover_image_url=post_data.cover_image_url,
            tags=post_data.tags,
            status=post_data.status,
            published_at=datetime.utcnow() if post_data.status == "published" else None
        )

        self.db.add(blog_post)
        await self.db.commit()
        await self.db.refresh(blog_post)
        return blog_post

    async def get_blog_post_by_id(self, post_id: int) -> Optional[CriticBlogPost]:
        """Get blog post by ID"""
        query = (
            select(CriticBlogPost)
            .options(selectinload(CriticBlogPost.critic).selectinload(CriticProfile.user))
            .where(CriticBlogPost.id == post_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_blog_post_by_external_id(self, external_id: str) -> Optional[CriticBlogPost]:
        """Get blog post by external ID"""
        query = (
            select(CriticBlogPost)
            .options(selectinload(CriticBlogPost.critic).selectinload(CriticProfile.user))
            .where(CriticBlogPost.external_id == external_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_blog_post_by_slug(self, slug: str) -> Optional[CriticBlogPost]:
        """Get blog post by slug"""
        query = (
            select(CriticBlogPost)
            .options(selectinload(CriticBlogPost.critic).selectinload(CriticProfile.user))
            .where(CriticBlogPost.slug == slug)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_blog_post(
        self,
        post_id: int,
        post_data: CriticBlogPostUpdate
    ) -> Optional[CriticBlogPost]:
        """Update blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return None

        update_data = post_data.model_dump(exclude_unset=True)
        
        # Regenerate slug if title changed
        if "title" in update_data:
            update_data["slug"] = self._generate_slug(update_data["title"], blog_post.external_id)

        # Set published_at if status changed to published
        if update_data.get("status") == "published" and blog_post.status != "published":
            update_data["published_at"] = datetime.utcnow()

        for key, value in update_data.items():
            setattr(blog_post, key, value)

        blog_post.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(blog_post)
        return blog_post

    async def delete_blog_post(self, post_id: int) -> bool:
        """Delete blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return False

        await self.db.delete(blog_post)
        await self.db.commit()
        return True

    async def list_blog_posts_by_critic(
        self,
        critic_id: int,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticBlogPost]:
        """List blog posts by critic with optional status filter"""
        query = (
            select(CriticBlogPost)
            .options(selectinload(CriticBlogPost.critic).selectinload(CriticProfile.user))
            .where(CriticBlogPost.critic_id == critic_id)
        )

        if status:
            query = query.where(CriticBlogPost.status == status)

        query = (
            query
            .order_by(CriticBlogPost.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def list_blog_posts_by_username(
        self,
        username: str,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[CriticBlogPost]:
        """List blog posts by critic username"""
        query = (
            select(CriticBlogPost)
            .join(CriticProfile)
            .options(selectinload(CriticBlogPost.critic).selectinload(CriticProfile.user))
            .where(CriticProfile.username == username)
        )

        if status:
            query = query.where(CriticBlogPost.status == status)

        query = (
            query
            .order_by(CriticBlogPost.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def publish_blog_post(self, post_id: int) -> Optional[CriticBlogPost]:
        """Publish a draft blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return None

        if blog_post.status == "published":
            return blog_post  # Already published

        blog_post.status = "published"
        blog_post.published_at = datetime.utcnow()
        blog_post.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(blog_post)
        return blog_post

    async def increment_view_count(self, post_id: int) -> bool:
        """Increment view count for a blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return False

        blog_post.view_count += 1
        await self.db.commit()
        return True

    async def increment_like_count(self, post_id: int) -> bool:
        """Increment like count for a blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return False

        blog_post.like_count += 1
        await self.db.commit()
        return True

    async def decrement_like_count(self, post_id: int) -> bool:
        """Decrement like count for a blog post"""
        blog_post = await self.get_blog_post_by_id(post_id)
        if not blog_post:
            return False

        if blog_post.like_count > 0:
            blog_post.like_count -= 1
            await self.db.commit()
        return True

    async def get_total_count_by_critic(
        self,
        critic_id: int,
        status: Optional[str] = None
    ) -> int:
        """Get total count of blog posts by critic"""
        query = select(func.count(CriticBlogPost.id)).where(
            CriticBlogPost.critic_id == critic_id
        )

        if status:
            query = query.where(CriticBlogPost.status == status)

        result = await self.db.execute(query)
        return result.scalar_one()

