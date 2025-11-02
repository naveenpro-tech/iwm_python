from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
from datetime import datetime

import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models import (
    Movie,
    Genre,
    Person,
    StreamingPlatform,
    MovieStreamingOption,
    movie_people,
    movie_genres,
)
from ..integrations.gemini_client import fetch_movie_enrichment_with_gemini
from ..config import settings

TMDB_API_KEY = settings.tmdb_api_key

# Helpers ---------------------------------------------------------
async def _get_or_create_genre(session: AsyncSession, name: str) -> Genre:
    res = await session.execute(select(Genre).where(Genre.name.ilike(name)))
    g = res.scalar_one_or_none()
    if g:
        return g
    g = Genre(name=name, slug=name.lower().replace(" ", "-"))
    session.add(g)
    await session.flush()
    return g

async def _get_or_create_person(session: AsyncSession, name: str, image: Optional[str] = None) -> Person:
    res = await session.execute(select(Person).where(Person.name.ilike(name)))
    p = res.scalar_one_or_none()
    if p:
        if image and not getattr(p, "image_url", None):
            p.image_url = image
        return p
    p = Person(external_id=f"person-{name.lower().replace(' ', '-')}", name=name, image_url=image)
    session.add(p)
    await session.flush()
    return p

async def _get_or_create_platform(session: AsyncSession, key: str) -> StreamingPlatform:
    res = await session.execute(select(StreamingPlatform).where(StreamingPlatform.name.ilike(key)))
    plat = res.scalar_one_or_none()
    if plat:
        return plat
    plat = StreamingPlatform(external_id=key.lower(), name=key, logo_url=None, website_url=None)
    session.add(plat)
    await session.flush()
    return plat

# TMDB fallback ---------------------------------------------------
async def fetch_tmdb_enrichment(query: str) -> Optional[Dict[str, Any]]:
    if not TMDB_API_KEY:
        return None
    async with httpx.AsyncClient(timeout=20) as client:
        sr = await client.get(
            "https://api.themoviedb.org/3/search/movie",
            params={"api_key": TMDB_API_KEY, "query": query, "include_adult": "false"},
        )
        if sr.status_code != 200:
            return None
        res = sr.json()
        results = res.get("results") or []
        if not results:
            return None
        movie_id = results[0]["id"]
        dr = await client.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}",
            params={
                "api_key": TMDB_API_KEY,
                "append_to_response": "credits,keywords,release_dates,watch/providers,videos,reviews,similar",
            },
        )
        if dr.status_code != 200:
            return None
        data = dr.json()
        # Basic transform to our import schema
        year = None
        rel = data.get("release_date")
        if rel:
            try:
                year = rel.split("-")[0]
            except Exception:
                year = None
        genres = [g["name"] for g in (data.get("genres") or [])]
        directors, writers, producers, cast = [], [], [], []
        for crew in (data.get("credits", {}).get("crew") or []):
            job = (crew.get("job") or "").lower()
            person = {"name": crew.get("name"), "image": None}
            if job == "director":
                directors.append(person)
            elif job in ("writer", "screenplay"): 
                writers.append(person)
            elif job == "producer":
                producers.append(person)
        for actor in (data.get("credits", {}).get("cast") or [])[:15]:
            cast.append({"name": actor.get("name"), "character": actor.get("character"), "image": None})
        # watch/providers
        streaming = []
        providers = (data.get("watch/providers", {}).get("results") or {}).get("US") or {}
        for t in ("flatrate", "buy", "rent", "ads"):
            for p in providers.get(t, []) or []:
                streaming.append({
                    "platform": p.get("provider_name") or "unknown",
                    "region": "US",
                    "type": "subscription" if t == "flatrate" else ("free" if t == "ads" else t),
                    "price": None,
                    "quality": None,
                    "url": providers.get("link"),
                })
        enriched = {
            "external_id": f"tmdb-{data.get('id')}",
            "title": data.get("title") or data.get("name"),
            "tagline": data.get("tagline"),
            "year": year,
            "release_date": data.get("release_date"),
            "runtime": data.get("runtime"),
            "rating": None,
            "siddu_score": None,
            "critics_score": None,
            "imdb_rating": None,
            "rotten_tomatoes_score": None,
            "language": (data.get("original_language") or "").upper() or None,
            "country": None,
            "overview": data.get("overview"),
            "poster_url": (f"https://image.tmdb.org/t/p/w500{data.get('poster_path')}" if data.get("poster_path") else None),
            "backdrop_url": (f"https://image.tmdb.org/t/p/original{data.get('backdrop_path')}" if data.get("backdrop_path") else None),
            "budget": data.get("budget"),
            "revenue": data.get("revenue"),
            "status": data.get("status"),
            "genres": genres,
            "directors": directors,
            "writers": writers,
            "producers": producers,
            "cast": cast,
            "streaming": streaming,
        }
        return enriched

# Public API ------------------------------------------------------
class EnrichmentProviderError(Exception):
    """Raised when a specific provider is enforced but fails."""
    def __init__(self, provider: str, message: str = "provider_failed"):
        super().__init__(message)
        self.provider = provider
        self.message = message


async def enrich_movie_from_query(
    session: AsyncSession,
    query: str,
    override_external_id: Optional[str] = None,
    provider_preference: Optional[str] = None,
) -> Dict[str, Any]:
    provider_used = "stub"

    data: Optional[Dict[str, Any]] = None

    if provider_preference == "gemini":
        # Enforce Gemini-only mode
        data = await fetch_movie_enrichment_with_gemini(query)
        if not data:
            raise EnrichmentProviderError("gemini", "Gemini enrichment failed or returned no data")
        provider_used = "gemini"
    else:
        # Default behavior: Gemini -> TMDB -> stub
        data = await fetch_movie_enrichment_with_gemini(query)
        if data:
            provider_used = "gemini"
        else:
            data = await fetch_tmdb_enrichment(query)
            if data:
                provider_used = "tmdb"

    if not data:
        # Offline/No-provider fallback: create a minimal stub so processing continues with empty/null fields
        slug = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in query.lower()).strip("-")
        fallback_external_id = override_external_id or f"stub-{slug}"
        data = {
            "external_id": fallback_external_id,
            "title": query,
            "tagline": None,
            "year": None,
            "release_date": None,
            "runtime": None,
            "rating": None,
            "siddu_score": None,
            "critics_score": None,
            "imdb_rating": None,
            "rotten_tomatoes_score": None,
            "language": None,
            "country": None,
            "overview": None,
            "poster_url": None,
            "backdrop_url": None,
            "budget": None,
            "revenue": None,
            "status": None,
            "genres": [],
            "directors": [],
            "writers": [],
            "producers": [],
            "cast": [],
            "streaming": [],
        }
        provider_used = "stub"

    # Upsert Movie
    if override_external_id:
        res = await session.execute(select(Movie).where(Movie.external_id == override_external_id))
    else:
        res = await session.execute(select(Movie).where(Movie.external_id == data["external_id"]))
    movie = res.scalar_one_or_none()
    is_update = movie is not None
    if not movie:
        movie = Movie(external_id=(override_external_id or data["external_id"]), title=data.get("title") or query)
        session.add(movie)
        await session.flush()

    # Update scalar fields
    movie.title = data.get("title") or movie.title
    movie.tagline = data.get("tagline")
    movie.year = data.get("year")
    movie.runtime = data.get("runtime")
    movie.rating = data.get("rating")
    movie.siddu_score = data.get("siddu_score")
    movie.critics_score = data.get("critics_score")
    movie.imdb_rating = data.get("imdb_rating")
    movie.rotten_tomatoes_score = data.get("rotten_tomatoes_score")
    movie.language = data.get("language")
    movie.country = data.get("country")
    movie.overview = data.get("overview")
    movie.poster_url = data.get("poster_url")
    movie.backdrop_url = data.get("backdrop_url")
    movie.budget = data.get("budget")
    movie.revenue = data.get("revenue")
    movie.status = data.get("status")
    if data.get("release_date"):
        try:
            movie.release_date = datetime.fromisoformat(str(data["release_date"]))
        except Exception:
            pass

    # Genres (replace) - avoid lazy load by operating on association table directly
    if data.get("genres") is not None:
        await session.execute(movie_genres.delete().where(movie_genres.c.movie_id == movie.id))
        await session.flush()
        for gname in data["genres"]:
            g = await _get_or_create_genre(session, gname)
            await session.execute(
                movie_genres.insert().values(movie_id=movie.id, genre_id=g.id)
            )

    # People (replace)
    if any([data.get("directors"), data.get("writers"), data.get("producers"), data.get("cast")]):
        await session.execute(movie_people.delete().where(movie_people.c.movie_id == movie.id))
        await session.flush()
        async def link(per: dict, role: str, character: Optional[str] = None):
            p = await _get_or_create_person(session, per.get("name"), per.get("image"))
            await session.execute(
                movie_people.insert().values(
                    movie_id=movie.id,
                    person_id=p.id,
                    role=role,
                    character_name=character,
                )
            )
        for per in (data.get("directors") or []):
            await link(per, "director")
        for per in (data.get("writers") or []):
            await link(per, "writer")
        for per in (data.get("producers") or []):
            await link(per, "producer")
        for per in (data.get("cast") or []):
            await link(per, "actor", per.get("character"))

    # Streaming (replace)
    if data.get("streaming") is not None:
        await session.execute(MovieStreamingOption.__table__.delete().where(MovieStreamingOption.movie_id == movie.id))
        await session.flush()
        for i, s in enumerate(data.get("streaming") or []):
            plat = await _get_or_create_platform(session, s.get("platform") or "unknown")
            ext_id = f"{movie.external_id}-{plat.external_id}-{s.get('region') or 'XX'}-{i}"
            opt = MovieStreamingOption(
                external_id=ext_id,
                movie_id=movie.id,
                platform_id=plat.id,
                region=s.get("region") or "XX",
                type=s.get("type") or "subscription",
                price=s.get("price"),
                quality=s.get("quality"),
                url=s.get("url"),
                verified=True,
            )
            session.add(opt)

    await session.flush()
    return {"external_id": movie.external_id, "updated": is_update, "provider_used": provider_used}

