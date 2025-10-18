from __future__ import annotations

from typing import Any, Iterable, List, Sequence
from datetime import datetime

from sqlalchemy import Select, select, func, desc, asc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Scene, Movie, Genre


class SceneExplorerRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _base_query(self) -> Select[Any]:
        return (
            select(Scene)
            .options(
                selectinload(Scene.movie),
                selectinload(Scene.genres),
            )
        )

    @staticmethod
    def _to_dto(items: Sequence[Scene]) -> List[dict[str, Any]]:
        out: List[dict[str, Any]] = []
        for s in items:
            mv = s.movie
            genres = [g.slug for g in (s.genres or [])]
            out.append(
                {
                    "id": s.external_id,
                    "title": s.title,
                    "description": s.description or "",
                    "thumbnail": s.thumbnail_url or "/placeholder.svg?height=720&width=1280",
                    "duration": s.duration_str or (f"{s.duration_seconds}s" if s.duration_seconds else ""),
                    "movieId": mv.external_id if mv else None,
                    "movieTitle": mv.title if mv else "",
                    "moviePoster": mv.poster_url if mv else None,
                    "releaseYear": int(mv.year) if (mv and mv.year and mv.year.isdigit()) else None,
                    "director": s.director or "",
                    "cinematographer": s.cinematographer or "",
                    "genres": genres,
                    "sceneType": s.scene_type or "",
                    "viewCount": s.view_count,
                    "commentCount": s.comment_count,
                    "isPopular": s.is_popular,
                    "isVisualTreat": s.is_visual_treat,
                    "addedDate": s.added_at.isoformat() if isinstance(s.added_at, datetime) else None,
                }
            )
        return out

    async def list_scenes(
        self,
        *,
        movie_external_id: str | None = None,
        genres: Iterable[str] | None = None,
        scene_type: str | None = None,
        page: int | None = None,
        page_size: int | None = None,
        sort: str | None = None,
    ) -> List[dict[str, Any]]:
        q = self._base_query()

        if movie_external_id:
            q = q.join(Scene.movie).where(Movie.external_id == movie_external_id)

        if genres:
            # filter scenes that have any of the provided genre slugs
            q = (
                q.join(Scene.genres)
                .where(Genre.slug.in_(list(genres)))
            )

        if scene_type:
            q = q.where(Scene.scene_type == scene_type)

        # Sorting
        if sort == "popular":
            q = q.order_by(desc(Scene.view_count))
        elif sort == "latest":
            q = q.order_by(desc(Scene.added_at))
        elif sort == "discussed":
            q = q.order_by(desc(Scene.comment_count))
        elif sort == "releaseNewest":
            q = q.join(Scene.movie).order_by(desc(Movie.year))
        elif sort == "releaseOldest":
            q = q.join(Scene.movie).order_by(asc(Movie.year))
        else:
            q = q.order_by(desc(Scene.added_at))

        if page and page_size:
            q = q.limit(page_size).offset((page - 1) * page_size)

        rows = (await self.session.execute(q)).scalars().unique().all()
        return self._to_dto(rows)

    async def list_by_movie(
        self,
        *,
        movie_external_id: str,
        page: int | None = None,
        page_size: int | None = None,
        sort: str | None = None,
    ) -> List[dict[str, Any]]:
        return await self.list_scenes(
            movie_external_id=movie_external_id,
            genres=None,
            scene_type=None,
            page=page,
            page_size=page_size,
            sort=sort,
        )

