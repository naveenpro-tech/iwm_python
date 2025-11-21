from __future__ import annotations

from typing import Any, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models import AwardCeremony, AwardCeremonyYear, AwardCategory, AwardNomination


class AwardsRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def list_ceremonies(self) -> List[dict[str, Any]]:
        if not self.session:
            return []
        # Load ceremonies and their years
        res = await self.session.execute(select(AwardCeremony))
        ceremonies = res.scalars().all()
        result: List[dict[str, Any]] = []
        for c in ceremonies:
            years_available = sorted([y.year for y in c.years], reverse=True)
            result.append(
                {
                    "id": c.external_id,
                    "name": c.name,
                    "shortName": c.short_name,
                    "description": c.description or "",
                    "logoUrl": c.logo_url or "",
                    "backgroundImageUrl": c.background_image_url or None,
                    "yearsAvailable": years_available,
                    "nextCeremonyDate": c.next_ceremony_date.isoformat() if c.next_ceremony_date else None,
                    "currentYear": c.current_year,
                }
            )
        return result

    async def get_award_details(self, ceremony_year_external_id: str) -> dict[str, Any] | None:
        if not self.session:
            return None
        res = await self.session.execute(
            select(AwardCeremonyYear)
            .options(
                selectinload(AwardCeremonyYear.ceremony).selectinload(AwardCeremony.years),
                selectinload(AwardCeremonyYear.categories).selectinload(AwardCategory.nominations),
            )
            .where(AwardCeremonyYear.external_id == ceremony_year_external_id)
        )
        year = res.scalar_one_or_none()
        if not year:
            return None
        categories: List[dict[str, Any]] = []
        for cat in year.categories:
            nominations = []
            for n in cat.nominations:
                nominations.append(
                    {
                        "id": n.external_id,
                        "name": n.nominee_name,
                        "type": n.nominee_type,
                        "imageUrl": n.image_url,
                        "entityUrl": n.entity_url,
                        "isWinner": n.is_winner,
                        "details": n.details,
                    }
                )
            categories.append({"id": cat.external_id, "name": cat.name, "nominees": nominations})

        # Build relatedCeremonies as neighbors for same ceremony without triggering lazy-loads
        siblings_res = await self.session.execute(
            select(AwardCeremonyYear).where(AwardCeremonyYear.ceremony_id == year.ceremony_id)
        )
        siblings = siblings_res.scalars().all()
        related = [
            {"id": y.external_id, "name": f"{year.ceremony.name if year.ceremony else ''} {y.year}", "year": y.year}
            for y in sorted(siblings, key=lambda x: x.year, reverse=True)
            if y.external_id != year.external_id
        ][:5]

        return {
            "id": year.external_id,
            "ceremonyName": f"The {year.year} {year.ceremony.name}",
            "year": year.year,
            "date": year.date.isoformat() if year.date else "",
            "location": year.location or None,
            "hostedBy": [] if not year.hosted_by else [h.strip() for h in year.hosted_by.split(",")],
            "backgroundImageUrl": year.background_image_url or None,
            "logoUrl": year.logo_url or (year.ceremony.logo_url or None),
            "description": year.description or None,
            "highlights": [] if not year.highlights else [h.strip() for h in year.highlights.split("|")],
            "categories": categories,
            "relatedCeremonies": related,
        }

