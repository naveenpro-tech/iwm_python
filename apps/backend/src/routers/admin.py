from __future__ import annotations
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from ..db import get_session
from ..repositories.admin import AdminRepository
from ..services.enrichment import enrich_movie_from_query
from ..models import (
    Movie, Genre, Person, StreamingPlatform, MovieStreamingOption, movie_genres, movie_people
)

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminUserOut(BaseModel):
    id: str
    name: str
    email: str
    roles: List[str]
    status: str
    joinedDate: str
    lastLogin: Optional[str] = None
    profileType: Optional[str] = None
    verificationStatus: Optional[str] = None
    accountType: Optional[str] = None
    phoneNumber: Optional[str] = None
    location: Optional[str] = None


class ModerationItemOut(BaseModel):
    id: str
    type: str
    contentTitle: str
    reportReason: Optional[str] = None
    status: str
    user: Optional[str] = None
    timestamp: str
    reports: int


class SettingsUpdateIn(BaseModel):
    data: Dict[str, Any]


class AnalyticsOverviewOut(BaseModel):
    totalUsers: int
    contentViews: int
    avgRating: float
    systemHealth: float
    changes: Dict[str, float]


@router.get("/users", response_model=List[AdminUserOut])
async def list_users(
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = AdminRepository(session)
    return await repo.list_users(search=search, role=role, status=status, page=page, limit=limit)


@router.get("/moderation/items", response_model=List[ModerationItemOut])
async def list_moderation_items(
    status: Optional[str] = Query(None),
    contentType: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    repo = AdminRepository(session)
    return await repo.list_moderation_items(status=status, content_type=contentType, search=search, page=page, limit=limit)


class ModerationActionIn(BaseModel):
    reason: Optional[str] = None


@router.post("/moderation/items/{itemId}/approve")
async def approve_item(itemId: str, body: ModerationActionIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    result = await repo.set_moderation_action(item_external_id=itemId, action="approve", reason=body.reason)
    if not result:
        raise HTTPException(status_code=404, detail="moderation_item_not_found")
    return result


@router.post("/moderation/items/{itemId}/reject")
async def reject_item(itemId: str, body: ModerationActionIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    result = await repo.set_moderation_action(item_external_id=itemId, action="reject", reason=body.reason)
    if not result:
        raise HTTPException(status_code=404, detail="moderation_item_not_found")
    return result


@router.get("/system/settings")
async def get_settings(session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.get_settings()


@router.put("/system/settings")
async def update_settings(body: SettingsUpdateIn, session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.update_settings(data=body.data)


@router.get("/analytics/overview", response_model=AnalyticsOverviewOut)
async def analytics_overview(session: AsyncSession = Depends(get_session)):
    repo = AdminRepository(session)
    return await repo.get_analytics_overview()


# ---------- JSON Import (Movies) ----------
class PersonIn(BaseModel):
    name: str
    role: Optional[str] = None  # director | writer | producer | actor
    character: Optional[str] = None
    image: Optional[str] = None

class StreamingIn(BaseModel):
    platform: str  # e.g., "netflix" or platform external_id/name
    region: str    # e.g., "US"
    type: str      # subscription | rent | buy | free
    price: Optional[float] = None
    quality: Optional[str] = None
    url: Optional[str] = None

class AwardSimpleIn(BaseModel):
    name: str
    year: int
    category: str
    status: str  # Winner | Nominee

class TriviaIn(BaseModel):
    question: str
    category: str
    answer: str
    explanation: Optional[str] = None

class TimelineIn(BaseModel):
    date: str  # YYYY-MM-DD
    title: str
    description: str
    type: str

class MovieImportIn(BaseModel):
    external_id: str
    title: str
    tagline: Optional[str] = None
    year: Optional[str] = None
    release_date: Optional[str] = None
    runtime: Optional[int] = None
    rating: Optional[str] = None
    siddu_score: Optional[float] = None
    critics_score: Optional[float] = None
    imdb_rating: Optional[float] = None
    rotten_tomatoes_score: Optional[float] = None
    language: Optional[str] = None
    country: Optional[str] = None
    overview: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    budget: Optional[int] = None
    revenue: Optional[int] = None
    status: Optional[str] = None
    genres: Optional[List[str]] = None
    directors: Optional[List[PersonIn]] = None
    writers: Optional[List[PersonIn]] = None
    producers: Optional[List[PersonIn]] = None
    cast: Optional[List[PersonIn]] = None
    streaming: Optional[List[StreamingIn]] = None
    awards: Optional[List[AwardSimpleIn]] = None
    trivia: Optional[List[TriviaIn]] = None
    timeline: Optional[List[TimelineIn]] = None

# ---------- Enrichment (Gemini/TMDB) ----------
class EnrichQueryIn(BaseModel):
    query: str
    provider: Optional[str] = None  # "gemini" to enforce Gemini-only; otherwise default fallback chain

class EnrichBulkIn(BaseModel):
    queries: List[str]

class EnrichResultOut(BaseModel):
    external_id: str
    updated: bool
    provider_used: str

@router.post("/movies/enrich", response_model=EnrichResultOut)
async def enrich_via_query(body: EnrichQueryIn, session: AsyncSession = Depends(get_session)):
    from ..services.enrichment import EnrichmentProviderError
    try:
        result = await enrich_movie_from_query(session, body.query, provider_preference=(body.provider or None))
        await session.commit()
        return EnrichResultOut(**result)
    except EnrichmentProviderError as e:
        await session.rollback()
        raise HTTPException(status_code=502, detail={"provider": e.provider, "error": e.message})

@router.post("/movies/enrich/bulk", response_model=List[EnrichResultOut])
async def enrich_bulk(body: EnrichBulkIn, session: AsyncSession = Depends(get_session)):
    out: List[EnrichResultOut] = []
    for q in body.queries:
        try:
            result = await enrich_movie_from_query(session, q)
            out.append(EnrichResultOut(**result))
        except Exception as e:
            # skip but continue; in UI show failures separately if needed later
            out.append(EnrichResultOut(external_id=f"error:{q}", updated=False))
    await session.commit()
    return out

class EnrichExistingIn(BaseModel):
    external_id: str
    query: Optional[str] = None

@router.post("/movies/enrich-existing", response_model=EnrichResultOut)
async def enrich_existing(body: EnrichExistingIn, session: AsyncSession = Depends(get_session)):
    # If query not provided, try using current movie title
    res = await session.execute(select(Movie).where(Movie.external_id == body.external_id))
    movie = res.scalar_one_or_none()
    if not movie:
        raise HTTPException(status_code=404, detail="movie_not_found")
    query = body.query or movie.title
    from ..services.enrichment import EnrichmentProviderError
    try:
        result = await enrich_movie_from_query(
            session, query, override_external_id=body.external_id, provider_preference=None
        )
        await session.commit()
        return EnrichResultOut(**result)
    except EnrichmentProviderError as e:
        await session.rollback()
        raise HTTPException(status_code=502, detail={"provider": e.provider, "error": e.message})


class ImportReportOut(BaseModel):
    imported: int
    updated: int
    failed: int
    errors: List[str]

@router.post("/movies/import", response_model=ImportReportOut)
async def import_movies_json(
    movies: List[MovieImportIn],
    session: AsyncSession = Depends(get_session),
):
    imported = 0
    updated = 0
    errors: List[str] = []

    async def get_or_create_genre(name: str) -> Genre:
        q = select(Genre).where(Genre.name.ilike(name))
        res = await session.execute(q)
        g = res.scalar_one_or_none()
        if g:
            return g
        g = Genre(name=name, slug=name.lower().replace(" ", "-"))
        session.add(g)
        await session.flush()
        return g

    async def get_or_create_person(name: str, image: Optional[str] = None) -> Person:
        q = select(Person).where(Person.name.ilike(name))
        res = await session.execute(q)
        p = res.scalar_one_or_none()
        if p:
            if image and not p.image_url:
                p.image_url = image
            return p
        p = Person(external_id=f"person-{name.lower().replace(' ', '-')}", name=name, image_url=image)
        session.add(p)
        await session.flush()
        return p

    async def get_or_create_platform(key: str) -> StreamingPlatform:
        q = select(StreamingPlatform).where(StreamingPlatform.name.ilike(key))
        res = await session.execute(q)
        plat = res.scalar_one_or_none()
        if plat:
            return plat
        plat = StreamingPlatform(external_id=key.lower(), name=key, logo_url=None, website_url=None)
        session.add(plat)
        await session.flush()
        return plat

    # Awards helpers
    from ..models import AwardCeremony, AwardCeremonyYear, AwardCategory, AwardNomination

    def _slug(s: str) -> str:
        import re
        return re.sub(r"[^a-z0-9-]", "", re.sub(r"\s+", "-", s.strip().lower()))

    async def get_or_create_ceremony(name: str) -> AwardCeremony:
        q = select(AwardCeremony).where(AwardCeremony.name.ilike(name))
        res = await session.execute(q)
        c = res.scalar_one_or_none()
        if c:
            return c
        c = AwardCeremony(external_id=_slug(name), name=name, short_name=name)
        session.add(c)
        await session.flush()
        return c

    async def get_or_create_ceremony_year(ceremony: AwardCeremony, year: int) -> AwardCeremonyYear:
        ext = f"{ceremony.external_id}-{year}"
        q = select(AwardCeremonyYear).where(AwardCeremonyYear.external_id == ext)
        res = await session.execute(q)
        y = res.scalar_one_or_none()
        if y:
            return y
        y = AwardCeremonyYear(external_id=ext, year=year, ceremony_id=ceremony.id)
        session.add(y)
        await session.flush()
        return y

    async def get_or_create_category(cyear: AwardCeremonyYear, name: str) -> AwardCategory:
        ext = f"{cyear.external_id}-{_slug(name)}"
        q = select(AwardCategory).where(AwardCategory.external_id == ext)
        res = await session.execute(q)
        cat = res.scalar_one_or_none()
        if cat:
            return cat
        cat = AwardCategory(external_id=ext, name=name, ceremony_year_id=cyear.id)
        session.add(cat)
        await session.flush()
        return cat

    for idx, m in enumerate(movies):
        try:
            # Upsert Movie by external_id
            res = await session.execute(select(Movie).where(Movie.external_id == m.external_id))
            movie = res.scalar_one_or_none()
            is_update = movie is not None
            if not movie:
                movie = Movie(external_id=m.external_id, title=m.title)
                session.add(movie)

            # Update fields
            movie.title = m.title
            movie.tagline = m.tagline
            movie.year = m.year
            movie.runtime = m.runtime
            movie.rating = m.rating
            movie.siddu_score = m.siddu_score
            movie.critics_score = m.critics_score
            movie.imdb_rating = m.imdb_rating
            movie.rotten_tomatoes_score = m.rotten_tomatoes_score
            movie.language = m.language
            movie.country = m.country
            movie.overview = m.overview
            movie.poster_url = m.poster_url
            movie.backdrop_url = m.backdrop_url
            movie.budget = m.budget
            movie.revenue = m.revenue
            movie.status = m.status
            if m.release_date:
                from datetime import datetime
                try:
                    movie.release_date = datetime.fromisoformat(m.release_date)
                except Exception:
                    movie.release_date = None

            # Ensure movie.id is available before linking associations
            await session.flush()

            # Genres - operate on association table directly to avoid async lazy-load issues
            if m.genres is not None:
                try:
                    await session.execute(
                        movie_genres.delete().where(movie_genres.c.movie_id == movie.id)
                    )
                    await session.flush()
                    for gname in m.genres:
                        g = await get_or_create_genre(gname)
                        await session.execute(
                            movie_genres.insert().values(movie_id=movie.id, genre_id=g.id)
                        )
                except Exception as ge:
                    errors.append(f"genres for {movie.external_id}: {ge}")

            # People (clear and re-link)
            if any([m.directors, m.writers, m.producers, m.cast]):
                await session.execute(
                    movie_people.delete().where(movie_people.c.movie_id == movie.id)
                )
                await session.flush()

                # Track inserted person_ids to avoid duplicates
                inserted_person_ids = set()

                async def link_person(per: PersonIn, role: str, character: Optional[str] = None):
                    p = await get_or_create_person(per.name, per.image)

                    # Only insert if this person hasn't been linked yet
                    if p.id not in inserted_person_ids:
                        await session.execute(
                            movie_people.insert().values(
                                movie_id=movie.id,
                                person_id=p.id,
                                role=role,
                                character_name=character,
                            )
                        )
                        inserted_person_ids.add(p.id)

                if m.directors:
                    for per in m.directors:
                        await link_person(per, "director")
                if m.writers:
                    for per in m.writers:
                        await link_person(per, "writer")
                if m.producers:
                    for per in m.producers:
                        await link_person(per, "producer")
                if m.cast:
                    for per in m.cast:
                        await link_person(per, "actor", per.character)

            # Streaming options
            if m.streaming is not None:
                await session.execute(
                    select(MovieStreamingOption).where(MovieStreamingOption.movie_id == movie.id)
                )
                # delete existing
                await session.execute(
                    MovieStreamingOption.__table__.delete().where(MovieStreamingOption.movie_id == movie.id)
                )
                await session.flush()
                for i, s in enumerate(m.streaming):
                    plat = await get_or_create_platform(s.platform)
                    ext_id = f"{movie.external_id}-{plat.external_id}-{s.region}-{i}"
                    opt = MovieStreamingOption(
                        external_id=ext_id,
                        movie_id=movie.id,
                        platform_id=plat.id,
                        region=s.region,
                        type=s.type,
                        price=s.price,
                        quality=s.quality,
                        url=s.url,
                        verified=True,
                    )
                    session.add(opt)

            # Awards import (optional)
            if m.awards:
                for a in m.awards:
                    try:
                        ceremony = await get_or_create_ceremony(a.name)
                        cyear = await get_or_create_ceremony_year(ceremony, int(a.year))
                        cat = await get_or_create_category(cyear, a.category)
                        nom_ext = f"{cyear.external_id}-{_slug(a.category)}-{movie.external_id}"
                        # ensure id uniqueness by appending counter if needed omitted for brevity
                        nomination = AwardNomination(
                            external_id=nom_ext,
                            nominee_type="movie",
                            nominee_name=movie.title,
                            image_url=None,
                            entity_url=None,
                            details=None,
                            is_winner=(str(a.status).lower().startswith("win")),
                            category_id=cat.id,
                            movie_id=movie.id,
                            person_id=None,
                        )
                        session.add(nomination)
                    except Exception as _awde:
                        errors.append(f"award for {movie.external_id}: {_awde}")

            # Trivia & Timeline JSONB (optional)
            if m.trivia is not None:
                # store as list of dicts
                movie.trivia = [
                    {
                        "question": t.question,
                        "category": t.category,
                        "answer": t.answer,
                        "explanation": getattr(t, "explanation", None),
                    }
                    for t in m.trivia
                ]
            if m.timeline is not None:
                movie.timeline = [
                    {
                        "date": tl.date,
                        "title": tl.title,
                        "description": tl.description,
                        "type": tl.type,
                    }
                    for tl in m.timeline
                ]

            if is_update:
                updated += 1
            else:
                imported += 1

            # Commit after each movie to avoid transaction rollback issues
            await session.commit()
        except Exception as e:
            # Rollback this movie's transaction and continue with next
            await session.rollback()
            errors.append(f"{m.external_id}: {e}")

    return ImportReportOut(imported=imported, updated=updated, failed=len(errors), errors=errors)

