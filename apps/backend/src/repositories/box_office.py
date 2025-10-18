from __future__ import annotations

from typing import Any, List
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import (
    BoxOfficeWeekendEntry,
    BoxOfficeTrendPoint,
    BoxOfficeYTD,
    BoxOfficeYTDTopMovie,
    BoxOfficeRecord,
    BoxOfficePerformanceGenre,
    BoxOfficePerformanceStudio,
    BoxOfficePerformanceMonthly,
)


def _fmt_money(amount_usd: float) -> str:
    # Format amounts like $4.87B, $189.4M
    if amount_usd is None:
        return "$0"
    if amount_usd >= 1_000_000_000:
        return f"${amount_usd/1_000_000_000:.2f}B"
    return f"${amount_usd/1_000_000:.1f}M"


def _fmt_change(percent: float | None, is_positive: bool | None) -> str:
    if percent is None:
        return "0%"
    sign = "+" if is_positive else "-"
    return f"{sign}{abs(percent):.1f}%"


class BoxOfficeRepository:
    def __init__(self, session: AsyncSession | None) -> None:
        self.session = session

    async def weekend(self, region: str = "global", limit: int = 10) -> List[dict[str, Any]]:
        if not self.session:
            return []
        res = await self.session.execute(
            select(BoxOfficeWeekendEntry)
            .where(BoxOfficeWeekendEntry.region == region)
            .order_by(BoxOfficeWeekendEntry.rank.asc())
        )
        rows = res.scalars().all()
        rows = rows[:limit]
        out: List[dict[str, Any]] = []
        for r in rows:
            out.append(
                {
                    "rank": r.rank,
                    "title": r.movie.title if r.movie else "",
                    "weekend": _fmt_money(r.weekend_gross_usd),
                    "total": _fmt_money(r.total_gross_usd),
                    "change": _fmt_change(r.change_percent, r.is_positive),
                    "isPositive": bool(r.is_positive),
                    "poster": r.poster_url or (r.movie.poster_url if r.movie else None),
                }
            )
        return out

    async def trends(self, region: str = "global") -> List[dict[str, Any]]:
        if not self.session:
            return []
        res = await self.session.execute(
            select(BoxOfficeTrendPoint)
            .where(BoxOfficeTrendPoint.region == region)
            .order_by(BoxOfficeTrendPoint.date.asc())
        )
        rows = res.scalars().all()
        return [{"date": r.date.strftime("%b %d"), "gross": float(r.gross_millions_usd)} for r in rows]

    async def ytd(self, region: str = "global", year: int | None = None) -> dict[str, Any] | None:
        if not self.session:
            return None
        stmt = select(BoxOfficeYTD).where(BoxOfficeYTD.region == region)
        if year is not None:
            stmt = stmt.where(BoxOfficeYTD.year == year)
        else:
            # pick latest year
            stmt = stmt.order_by(BoxOfficeYTD.year.desc())
        res = await self.session.execute(stmt)
        row = res.scalars().first()
        if not row:
            return None
        # top movies
        tm_res = await self.session.execute(
            select(BoxOfficeYTDTopMovie).where(BoxOfficeYTDTopMovie.ytd_id == row.id)
        )
        top = tm_res.scalars().all()
        return {
            "current": {
                "year": row.year,
                "total": _fmt_money(row.total_gross_usd),
                "change": _fmt_change(row.change_percent, row.is_positive),
                "isPositive": bool(row.is_positive),
            },
            "previous": {"year": row.previous_year, "total": _fmt_money(row.previous_total_gross_usd)},
            "topMovies": [{"title": t.title, "gross": _fmt_money(t.gross_usd)} for t in top],
        }

    async def performance(self, region: str = "global") -> dict[str, Any]:
        if not self.session:
            return {"genreData": [], "studioData": [], "monthlyData": []}
        # genre
        g_res = await self.session.execute(
            select(BoxOfficePerformanceGenre).where(BoxOfficePerformanceGenre.region == region)
        )
        genres = g_res.scalars().all()
        # studio
        s_res = await self.session.execute(
            select(BoxOfficePerformanceStudio).where(BoxOfficePerformanceStudio.region == region)
        )
        studios = s_res.scalars().all()
        # monthly
        m_res = await self.session.execute(
            select(BoxOfficePerformanceMonthly).where(BoxOfficePerformanceMonthly.region == region)
        )
        monthly = m_res.scalars().all()
        return {
            "genreData": [{"name": g.name, "value": g.percent, "color": g.color} for g in genres],
            "studioData": [{"studio": s.studio, "gross": float(s.gross_millions_usd)} for s in studios],
            "monthlyData": [{"month": m.month, "gross": float(m.gross_millions_usd)} for m in monthly],
        }

    async def records(self, region: str = "global") -> List[dict[str, Any]]:
        if not self.session:
            return []
        res = await self.session.execute(
            select(BoxOfficeRecord).where(BoxOfficeRecord.region == region)
        )
        rows = res.scalars().all()
        return [
            {
                "category": r.category,
                "title": r.title,
                "value": r.value_text,
                "year": r.year,
                "poster": r.poster_url,
            }
            for r in rows
        ]

