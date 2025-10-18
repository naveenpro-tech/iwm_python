from __future__ import annotations

from typing import Any, Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select as _select
from sqlalchemy.orm import selectinload

from ..models import (
    Festival,
    FestivalEdition,
    FestivalProgramSection,
    FestivalProgramEntry,
    FestivalWinnerCategory,
    FestivalWinner,
)


class FestivalsRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_festivals(self) -> List[dict[str, Any]]:
        q = (
            _select(Festival)
            .options(selectinload(Festival.editions))
            .order_by(Festival.name)
        )
        festivals = (await self.session.execute(q)).scalars().all()
        items: List[dict[str, Any]] = []
        for f in festivals:
            # Derive a current/upcoming edition if present
            edition = None
            if f.editions:
                # Prefer upcoming, else latest year
                upcoming = [e for e in f.editions if (e.status or "").lower() == "upcoming"]
                edition = (upcoming[0] if upcoming else sorted(f.editions, key=lambda e: e.year, reverse=True)[0])
            items.append(
                {
                    "id": f.external_id,
                    "name": f.name,
                    "location": f.location,
                    "dates": edition.dates if edition else None,
                    "image": f.image_url,
                    "description": f.description,
                    "categories": [
                        "Competition",
                        "Un Certain Regard",
                        "Directors' Fortnight",
                    ],
                    "status": edition.status if edition else None,
                }
            )
        return items

    async def get_festival_header(self, festival_id: str) -> dict[str, Any] | None:
        f = (
            await self.session.execute(
                _select(Festival)
                .where(Festival.external_id == festival_id)
                .options(selectinload(Festival.editions))
            )
        ).scalars().first()
        if not f:
            return None
        # Choose latest edition
        ed = None
        if f.editions:
            ed = sorted(f.editions, key=lambda e: e.year, reverse=True)[0]
        return {
            "id": f.external_id,
            "name": f.name,
            "edition": ed.edition_label if ed else None,
            "dates": ed.dates if ed else None,
            "location": f.location,
            "website": f.website,
            "image": f.image_url,
            "logo": f.logo_url,
            "status": ed.status if ed else None,
            "description": f.description,
        }

    async def get_program(self, festival_id: str, year: int) -> dict[str, List[dict[str, Any]]] | None:
        ed = (
            await self.session.execute(
                _select(FestivalEdition)
                .join(Festival)
                .where(Festival.external_id == festival_id, FestivalEdition.year == year)
                .options(
                    selectinload(FestivalEdition.program_sections).selectinload(FestivalProgramSection.entries)
                )
            )
        ).scalars().first()
        if not ed:
            return None
        out: Dict[str, List[Dict[str, Any]]] = {"competition": [], "outOfCompetition": [], "specialScreenings": []}
        for sec in ed.program_sections:
            key = sec.name
            if key not in out:
                out[key] = []
            for e in sec.entries:
                out[key].append(
                    {
                        "title": e.title,
                        "director": e.director,
                        "country": e.country,
                        "premiere": e.premiere,
                        "image": e.image_url,
                    }
                )
        return out

    async def get_winners(self, festival_id: str, year: int) -> List[dict[str, Any]] | None:
        ed = (
            await self.session.execute(
                _select(FestivalEdition)
                .join(Festival)
                .where(Festival.external_id == festival_id, FestivalEdition.year == year)
                .options(
                    selectinload(FestivalEdition.winner_categories).selectinload(FestivalWinnerCategory.winners)
                )
            )
        ).scalars().first()
        if not ed:
            return None
        results: List[dict[str, Any]] = []
        for cat in ed.winner_categories:
            results.append(
                {
                    "id": cat.external_id,
                    "categoryName": cat.name,
                    "winners": [
                        {
                            "id": str(w.id),
                            "movieId": None,
                            "movieTitle": w.movie_title,
                            "moviePoster": w.movie_poster_url,
                            "recipient": w.recipient,
                            "director": w.director,
                            "citation": w.citation,
                            "rating": w.rating,
                        }
                        for w in cat.winners
                    ],
                }
            )
        return results

