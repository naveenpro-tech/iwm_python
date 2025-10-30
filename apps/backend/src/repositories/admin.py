from __future__ import annotations
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime
from sqlalchemy import select, or_, func, desc, asc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import (
    User,
    AdminUserMeta,
    ModerationItem,
    ModerationAction,
    SystemSettings,
    AdminMetricSnapshot,
    Movie,
)


class AdminRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_users(
        self,
        *,
        search: Optional[str] = None,
        role: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = (
            select(User, AdminUserMeta)
            .outerjoin(AdminUserMeta, AdminUserMeta.user_id == User.id)
        )
        if search:
            s = f"%{search.lower()}%"
            q = q.where(or_(func.lower(User.name).like(s), func.lower(AdminUserMeta.email).like(s)))
        if role:
            # roles is JSONB array
            q = q.where(func.jsonb_contains(AdminUserMeta.roles, func.to_jsonb([role])))  # type: ignore
        if status:
            q = q.where(AdminUserMeta.status == status)
        q = q.offset((page - 1) * limit).limit(limit)
        res = await self.session.execute(q)
        rows = res.all()
        items: List[Dict[str, Any]] = []
        for u, meta in rows:
            items.append(
                {
                    "id": u.external_id,
                    "name": u.name,
                    "email": (meta.email if meta else None) or f"{u.external_id}@example.com",
                    "roles": (meta.roles if meta else ["User"]),
                    "status": (meta.status if meta else "Active"),
                    "joinedDate": (meta.joined_date.isoformat()[:10] if (meta and meta.joined_date) else None) or "2024-01-01",
                    "lastLogin": (meta.last_login.isoformat() if (meta and meta.last_login) else None),
                    "profileType": (meta.profile_type if meta else None),
                    "verificationStatus": (meta.verification_status if meta else None),
                    "accountType": (meta.account_type if meta else None),
                    "phoneNumber": (meta.phone_number if meta else None),
                    "location": (meta.location if meta else None),
                }
            )
        return items

    async def list_moderation_items(
        self,
        *,
        status: Optional[str] = None,
        content_type: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        q = select(ModerationItem).options(selectinload(ModerationItem.actions))
        if status:
            q = q.where(ModerationItem.status == status)
        if content_type:
            q = q.where(ModerationItem.content_type == content_type)
        if search:
            s = f"%{search.lower()}%"
            q = q.where(or_(func.lower(ModerationItem.content_title).like(s), func.lower(ModerationItem.report_reason).like(s)))
        q = q.order_by(ModerationItem.created_at.desc()).offset((page - 1) * limit).limit(limit)
        rows = (await self.session.execute(q)).scalars().all()
        out: List[Dict[str, Any]] = []
        for m in rows:
            out.append(
                {
                    "id": m.external_id,
                    "type": m.content_type,
                    "contentTitle": m.content_title,
                    "reportReason": m.report_reason,
                    "status": m.status,
                    "user": None,
                    "timestamp": m.created_at.isoformat(timespec="seconds"),
                    "reports": m.reporter_count,
                }
            )
        return out

    async def set_moderation_action(self, *, item_external_id: str, action: str, reason: Optional[str] = None) -> Dict[str, Any]:
        item = (
            await self.session.execute(select(ModerationItem).where(ModerationItem.external_id == item_external_id))
        ).scalar_one_or_none()
        if not item:
            return {}
        item.status = "resolved" if action == "approve" else "flagged"
        act = ModerationAction(item_id=item.id, moderator_user_id=None, action=action, reason=reason)
        self.session.add(act)
        await self.session.flush()
        await self.session.commit()
        return {"ok": True}

    async def get_settings(self) -> Dict[str, Any]:
        s = (
            await self.session.execute(select(SystemSettings).where(SystemSettings.external_id == "default"))
        ).scalar_one_or_none()
        if not s:
            s = SystemSettings(external_id="default", data={})
            self.session.add(s)
            await self.session.flush()
            await self.session.commit()
        return s.data

    async def update_settings(self, *, data: Dict[str, Any]) -> Dict[str, Any]:
        s = (
            await self.session.execute(select(SystemSettings).where(SystemSettings.external_id == "default"))
        ).scalar_one_or_none()
        if not s:
            s = SystemSettings(external_id="default", data=data)
            self.session.add(s)
        else:
            s.data = data
        await self.session.flush()
        await self.session.commit()
        return s.data

    async def get_analytics_overview(self) -> Dict[str, Any]:
        # Prefer latest snapshot, fallback to quick computed values
        snap = (
            await self.session.execute(
                select(AdminMetricSnapshot).order_by(AdminMetricSnapshot.snapshot_time.desc()).limit(1)
            )
        ).scalar_one_or_none()
        if snap and snap.metrics:
            return snap.metrics
        # Fallback compute
        users_count = (await self.session.execute(select(func.count(User.id)))).scalar_one() or 0
        return {
            "totalUsers": users_count,
            "contentViews": 0,
            "avgRating": 0,
            "systemHealth": 100.0,
            "changes": {"totalUsers": 0.0, "contentViews": 0.0, "avgRating": 0.0, "systemHealth": 0.0},
        }

    async def get_movies_for_curation(
        self,
        page: int = 1,
        page_size: int = 25,
        curation_status: Optional[str] = None,
        sort_by: str = "curated_at",
        sort_order: str = "desc",
    ) -> Tuple[List[Movie], int]:
        """
        Get paginated movies for curation with filters and sorting.

        Args:
            page: Page number (1-indexed)
            page_size: Items per page
            curation_status: Filter by curation status (draft, pending_review, approved, rejected)
            sort_by: Sort field (quality_score, curated_at)
            sort_order: Sort direction (asc, desc)

        Returns:
            Tuple of (movies_list, total_count)
        """
        # Build base query with eager loading
        query = select(Movie).options(selectinload(Movie.curated_by))

        # Apply filters
        if curation_status:
            query = query.where(Movie.curation_status == curation_status)

        # Get total count before pagination
        count_query = select(func.count(Movie.id))
        if curation_status:
            count_query = count_query.where(Movie.curation_status == curation_status)
        total_count = (await self.session.execute(count_query)).scalar_one() or 0

        # Apply sorting
        if sort_by == "quality_score":
            sort_column = Movie.quality_score
        else:  # default to curated_at
            sort_column = Movie.curated_at

        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        # Execute query
        result = await self.session.execute(query)
        movies = result.scalars().all()

        return movies, total_count

    async def update_movie_curation(
        self,
        movie_id: int,
        curation_status: Optional[str] = None,
        quality_score: Optional[int] = None,
        curator_notes: Optional[str] = None,
        curator_id: int = None,
    ) -> Movie:
        """
        Update movie curation fields and set curator/timestamps.

        Args:
            movie_id: Movie ID to update
            curation_status: New curation status
            quality_score: New quality score (0-100)
            curator_notes: New curator notes
            curator_id: ID of the curator (admin user)

        Returns:
            Updated movie with eager-loaded curator

        Raises:
            HTTPException: If movie not found
        """
        # Fetch movie
        query = select(Movie).where(Movie.id == movie_id).options(selectinload(Movie.curated_by))
        result = await self.session.execute(query)
        movie = result.scalar_one_or_none()

        if not movie:
            return None

        # Update fields (only non-None values)
        if curation_status is not None:
            movie.curation_status = curation_status
        if quality_score is not None:
            movie.quality_score = quality_score
        if curator_notes is not None:
            movie.curator_notes = curator_notes

        # Set curator and timestamps
        movie.curated_by_id = curator_id

        # Set curated_at only if it's currently NULL (first curation)
        if movie.curated_at is None:
            movie.curated_at = datetime.utcnow()

        # Always update last_reviewed_at
        movie.last_reviewed_at = datetime.utcnow()

        # Commit changes
        await self.session.flush()
        await self.session.commit()

        # Refresh to get updated relationships
        await self.session.refresh(movie, ["curated_by"])

        return movie


    async def bulk_update_movies(
        self,
        movie_ids: list[int],
        curation_data: dict,
        curator_id: int
    ) -> tuple[int, int, list[int]]:
        """
        Bulk update movies with curation data.

        Args:
            movie_ids: List of movie IDs to update
            curation_data: Dictionary of curation fields to update
            curator_id: ID of the admin user performing the update

        Returns:
            Tuple of (success_count, failure_count, failed_ids)
        """
        success_count = 0
        failure_count = 0
        failed_ids = []

        for movie_id in movie_ids:
            try:
                # Get movie
                result = await self.session.execute(
                    select(Movie).where(Movie.id == movie_id)
                )
                movie = result.scalar_one_or_none()

                if not movie:
                    failed_ids.append(movie_id)
                    failure_count += 1
                    continue

                # Update curation fields
                if "curation_status" in curation_data and curation_data["curation_status"] is not None:
                    movie.curation_status = curation_data["curation_status"]

                if "quality_score" in curation_data and curation_data["quality_score"] is not None:
                    movie.quality_score = curation_data["quality_score"]

                if "curator_notes" in curation_data and curation_data["curator_notes"] is not None:
                    movie.curator_notes = curation_data["curator_notes"]

                # Set curator and timestamps
                movie.curated_by_id = curator_id
                if movie.curated_at is None:
                    movie.curated_at = datetime.utcnow()
                movie.last_reviewed_at = datetime.utcnow()

                success_count += 1

            except Exception as e:
                print(f"Error updating movie {movie_id}: {e}")
                failed_ids.append(movie_id)
                failure_count += 1

        # Commit all changes
        await self.session.commit()

        return success_count, failure_count, failed_ids

    async def bulk_publish_movies(
        self,
        movie_ids: list[int],
        publish: bool,
        curator_id: int
    ) -> tuple[int, int, list[int]]:
        """
        Bulk publish/unpublish movies.

        Args:
            movie_ids: List of movie IDs to publish/unpublish
            publish: True to publish (approved), False to unpublish (draft)
            curator_id: ID of the admin user performing the action

        Returns:
            Tuple of (success_count, failure_count, failed_ids)
        """
        status = "approved" if publish else "draft"

        return await self.bulk_update_movies(
            movie_ids=movie_ids,
            curation_data={"curation_status": status},
            curator_id=curator_id
        )

    async def bulk_feature_movies(
        self,
        movie_ids: list[int],
        featured: bool,
        curator_id: int
    ) -> tuple[int, int, list[int]]:
        """
        Bulk feature/unfeature movies.

        Note: This is a placeholder. The Movie model doesn't have a 'featured' field yet.
        This method will need to be updated when the featured field is added to the schema.

        Args:
            movie_ids: List of movie IDs to feature/unfeature
            featured: True to feature, False to unfeature
            curator_id: ID of the admin user performing the action

        Returns:
            Tuple of (success_count, failure_count, failed_ids)
        """
        # TODO: Add 'is_featured' field to Movie model
        # For now, we'll just mark them as approved if featuring
        status = "approved" if featured else "draft"

        return await self.bulk_update_movies(
            movie_ids=movie_ids,
            curation_data={"curation_status": status},
            curator_id=curator_id
        )


def calculate_quality_score(movie: Movie) -> int:
    """
    Calculate quality score (0-100) based on movie data completeness.

    Scoring breakdown:
    - Metadata Completeness (40 points):
      - Title, year, release_date, runtime: 10 points
      - Overview, tagline: 10 points
      - Poster_url, backdrop_url: 10 points
      - Genres (at least 1): 10 points
    - Rich Content (30 points):
      - Trivia (at least 3 items): 15 points
      - Timeline (at least 3 items): 15 points
    - Rating Scores (20 points):
      - Has siddu_score: 5 points
      - Has critics_score: 5 points
      - Has imdb_rating: 5 points
      - Has rotten_tomatoes_score: 5 points
    - People/Cast (10 points):
      - Has at least 3 people: 10 points

    Args:
        movie: Movie model instance

    Returns:
        Quality score (0-100)
    """
    score = 0

    # Metadata Completeness (40 points)
    # Basic metadata: 10 points
    if movie.title and movie.year and movie.release_date and movie.runtime:
        score += 10
    elif movie.title and movie.year and movie.release_date:
        score += 7
    elif movie.title and movie.year:
        score += 5

    # Overview and tagline: 10 points
    if movie.overview and movie.tagline:
        score += 10
    elif movie.overview:
        score += 6
    elif movie.tagline:
        score += 4

    # Images: 10 points
    if movie.poster_url and movie.backdrop_url:
        score += 10
    elif movie.poster_url or movie.backdrop_url:
        score += 5

    # Genres: 10 points
    if movie.genres and len(movie.genres) >= 1:
        score += min(10, len(movie.genres) * 3)  # Max 10 points

    # Rich Content (30 points)
    # Trivia: 15 points
    if movie.trivia and len(movie.trivia) >= 3:
        score += 15
    elif movie.trivia and len(movie.trivia) >= 1:
        score += min(15, len(movie.trivia) * 5)

    # Timeline: 15 points
    if movie.timeline and len(movie.timeline) >= 3:
        score += 15
    elif movie.timeline and len(movie.timeline) >= 1:
        score += min(15, len(movie.timeline) * 5)

    # Rating Scores (20 points)
    rating_points = 0
    if movie.siddu_score is not None:
        rating_points += 5
    if movie.critics_score is not None:
        rating_points += 5
    if movie.imdb_rating is not None:
        rating_points += 5
    if movie.rotten_tomatoes_score is not None:
        rating_points += 5
    score += rating_points

    # People/Cast (10 points)
    if movie.people and len(movie.people) >= 3:
        score += 10
    elif movie.people and len(movie.people) >= 1:
        score += min(10, len(movie.people) * 3)

    # Ensure score is between 0 and 100
    return min(100, max(0, score))

