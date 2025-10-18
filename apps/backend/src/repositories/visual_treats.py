from __future__ import annotations

from typing import Any, Iterable, List, Sequence
import json

from sqlalchemy import Select, select, desc, asc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import VisualTreat, VisualTreatTagLookup, Movie, Scene


class VisualTreatsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _base_query(self) -> Select[Any]:
        return (
            select(VisualTreat)
            .options(
                selectinload(VisualTreat.movie),
                selectinload(VisualTreat.scene),
                selectinload(VisualTreat.tags),
            )
        )

    @staticmethod
    def _parse_palette(s: str | None) -> List[str] | None:
        if not s:
            return None
        try:
            data = json.loads(s)
            if isinstance(data, list):
                return [str(x) for x in data]
        except Exception:
            return None
        return None

    @staticmethod
    def _to_dto(items: Sequence[VisualTreat]) -> List[dict[str, Any]]:
        out: List[dict[str, Any]] = []
        for t in items:
            mv = t.movie
            tags = [tg.name for tg in (t.tags or [])]
            year_num = None
            if mv and mv.year and mv.year.isdigit():
                year_num = int(mv.year)
            out.append(
                {
                    "id": t.external_id,
                    "title": t.title,
                    "description": t.description or "",
                    "imageUrl": t.image_url or "/placeholder.svg?height=600&width=400",
                    "category": t.category,
                    "tags": tags,
                    "director": t.director or "",
                    "cinematographer": t.cinematographer or "",
                    "film": mv.title if mv else "",
                    "year": year_num or 0,
                    "colorPalette": VisualTreatsRepository._parse_palette(t.color_palette) or [],
                    "likes": t.likes,
                    "views": t.views,
                    # userLiked/userBookmarked intentionally omitted (optional)
                    "aspectRatio": t.aspect_ratio or None,
                    "resolution": t.resolution or None,
                    "submittedBy": t.submitted_by or None,
                }
            )
        return out

    async def list_treats(
        self,
        *,
        categories: Iterable[str] | None = None,
        tags: Iterable[str] | None = None,
        directors: Iterable[str] | None = None,
        cinematographers: Iterable[str] | None = None,
        decades: Iterable[str] | None = None,
        search: str | None = None,
        movie_external_id: str | None = None,
        scene_external_id: str | None = None,
        sort_by: str | None = None,
        page: int | None = None,
        page_size: int | None = None,
    ) -> List[dict[str, Any]]:
        q = self._base_query()

        if movie_external_id:
            q = q.join(VisualTreat.movie).where(Movie.external_id == movie_external_id)
        if scene_external_id:
            q = q.join(VisualTreat.scene).where(Scene.external_id == scene_external_id)

        if categories:
            q = q.where(VisualTreat.category.in_(list(categories)))
        if directors:
            q = q.where(VisualTreat.director.in_(list(directors)))
        if cinematographers:
            q = q.where(VisualTreat.cinematographer.in_(list(cinematographers)))
        if tags:
            q = q.join(VisualTreat.tags).where(VisualTreatTagLookup.name.in_(list(tags)))

        # Sorting
        if sort_by in {"popular", None}:
            q = q.order_by(desc(VisualTreat.likes))
        elif sort_by == "recent":
            q = q.join(VisualTreat.movie).order_by(desc(Movie.year))
        elif sort_by == "oldest":
            q = q.join(VisualTreat.movie).order_by(asc(Movie.year))
        elif sort_by == "title_asc":
            q = q.order_by(asc(VisualTreat.title))
        elif sort_by == "title_desc":
            q = q.order_by(desc(VisualTreat.title))
        elif sort_by == "director_asc":
            q = q.order_by(asc(VisualTreat.director))
        elif sort_by == "director_desc":
            q = q.order_by(desc(VisualTreat.director))
        elif sort_by == "film_asc":
            q = q.join(VisualTreat.movie).order_by(asc(Movie.title))
        elif sort_by == "film_desc":
            q = q.join(VisualTreat.movie).order_by(desc(Movie.title))
        elif sort_by == "views_desc":
            q = q.order_by(desc(VisualTreat.views))
        elif sort_by == "views_asc":
            q = q.order_by(asc(VisualTreat.views))
        else:
            q = q.order_by(desc(VisualTreat.likes))

        # Simple page
        if page and page_size:
            q = q.limit(page_size).offset((page - 1) * page_size)

        rows = (await self.session.execute(q)).scalars().unique().all()
        items = self._to_dto(rows)

        # Post-filter: search and decades
        if search:
            s = search.lower()
            items = [
                it
                for it in items
                if (s in it["title"].lower())
                or (s in it["description"].lower())
                or (s in it["film"].lower())
                or (s in it["director"].lower())
                or any(s in tag.lower() for tag in it["tags"])
            ]

        if decades:
            wanted: set[str] = set(decades)
            def as_decade(y: int) -> str:
                d = (y // 10) * 10
                return f"{d}s"
            items = [it for it in items if it["year"] and as_decade(it["year"]) in wanted]

        return items

    async def list_by_movie(self, *, movie_external_id: str, **kwargs: Any) -> List[dict[str, Any]]:
        return await self.list_treats(movie_external_id=movie_external_id, **kwargs)

    async def list_by_scene(self, *, scene_external_id: str, **kwargs: Any) -> List[dict[str, Any]]:
        return await self.list_treats(scene_external_id=scene_external_id, **kwargs)

