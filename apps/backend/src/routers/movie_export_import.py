"""
Movie Export/Import Router

Provides categorized export and import endpoints for movie data enrichment.
Allows admins to export movie data in 7 separate category JSON files,
manually enrich them using LLMs, and import the enriched data back.

Categories:
1. basic-info - Title, year, runtime, ratings, synopsis, genres
2. cast-crew - Directors, writers, producers, actors
3. timeline - Production timeline events
4. trivia - Trivia items
5. awards - Award nominations and wins
6. media - Posters, backdrops, trailers, gallery
7. streaming - Streaming platform links

Author: IWM Development Team
Date: 2025-01-15
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from io import BytesIO
import zipfile

from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, validator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..models import Movie, Genre, Person, StreamingPlatform, MovieStreamingOption, AwardNomination, movie_people, movie_genres, User
from ..dependencies.admin import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/movies", tags=["Movie Export/Import"])


# ============================================================================
# Pydantic Models for Export/Import
# ============================================================================

class ExportMetadata(BaseModel):
    """Metadata for exported data"""
    source: str = Field(..., description="Data source: tmdb, manual, or llm-generated")
    last_updated: str = Field(..., description="ISO timestamp of last update")
    updated_by: Optional[str] = Field(None, description="Email of user who last updated")


class ExportResponse(BaseModel):
    """Standard export response format"""
    category: str = Field(..., description="Category name")
    movie_id: str = Field(..., description="Movie external ID")
    version: str = Field(default="1.0", description="Schema version")
    exported_at: str = Field(..., description="ISO timestamp of export")
    data: Dict[str, Any] = Field(..., description="Category-specific data")
    metadata: ExportMetadata = Field(..., description="Export metadata")


class ImportRequest(BaseModel):
    """Standard import request format"""
    category: str = Field(..., description="Category name")
    movie_id: str = Field(..., description="Movie external ID")
    version: Optional[str] = Field("1.0", description="Schema version")
    data: Dict[str, Any] = Field(..., description="Category-specific data")
    metadata: Optional[ExportMetadata] = Field(None, description="Import metadata")


class ImportResponse(BaseModel):
    """Standard import response"""
    success: bool
    message: str
    updated_fields: List[str]
    errors: Optional[List[str]] = None


# ============================================================================
# Helper Functions
# ============================================================================

def get_current_timestamp() -> str:
    """Get current UTC timestamp in ISO format"""
    return datetime.now(timezone.utc).isoformat()


async def get_movie_by_external_id(session: AsyncSession, external_id: str) -> Movie:
    """Get movie by external ID or raise 404"""
    result = await session.execute(
        select(Movie).where(Movie.external_id == external_id)
    )
    movie = result.scalar_one_or_none()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with ID '{external_id}' not found"
        )
    return movie


def determine_data_source(movie: Movie, field_name: str) -> str:
    """Determine the source of data for a field"""
    # Check if field has data
    field_value = getattr(movie, field_name, None)
    if field_value is None or (isinstance(field_value, (list, dict)) and not field_value):
        return "manual"
    
    # If movie has tmdb_id, assume TMDB source for basic fields
    if movie.tmdb_id and field_name in ["title", "year", "runtime", "overview", "poster_url", "backdrop_url", "budget", "revenue"]:
        return "tmdb"
    
    # Timeline and trivia are always manual
    if field_name in ["timeline", "trivia"]:
        return "manual"
    
    return "manual"


# ============================================================================
# Export Endpoints
# ============================================================================

@router.get("/{external_id}/export/basic-info", response_model=ExportResponse)
async def export_basic_info(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export basic movie information.
    
    Includes: title, tagline, year, release_date, runtime, rating, language,
    country, overview, budget, revenue, status, genres, scores
    """
    movie = await get_movie_by_external_id(session, external_id)
    
    # Get genres
    genres = [genre.name for genre in movie.genres]
    
    data = {
        "title": movie.title,
        "tagline": movie.tagline,
        "year": movie.year,
        "release_date": movie.release_date.isoformat() if movie.release_date else None,
        "runtime": movie.runtime,
        "rating": movie.rating,
        "language": movie.language,
        "country": movie.country,
        "overview": movie.overview,
        "budget": movie.budget,
        "revenue": movie.revenue,
        "status": movie.status,
        "genres": genres,
        "siddu_score": movie.siddu_score,
        "critics_score": movie.critics_score,
        "imdb_rating": movie.imdb_rating,
        "rotten_tomatoes_score": movie.rotten_tomatoes_score,
    }
    
    return ExportResponse(
        category="basic_info",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source=determine_data_source(movie, "title"),
            last_updated=movie.updated_at.isoformat() if hasattr(movie, 'updated_at') and movie.updated_at else get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/cast-crew", response_model=ExportResponse)
async def export_cast_crew(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export cast and crew information.
    
    Includes: directors, writers, producers, actors with character names
    """
    movie = await get_movie_by_external_id(session, external_id)
    
    # Query movie_people association table
    people_query = select(Person, movie_people.c.role, movie_people.c.character_name).join(
        movie_people, Person.id == movie_people.c.person_id
    ).where(movie_people.c.movie_id == movie.id)
    
    people_result = await session.execute(people_query)
    
    directors = []
    writers = []
    producers = []
    cast = []
    
    for person, role, character_name in people_result:
        person_dict = {
            "id": person.external_id,
            "name": person.name,
            "image": person.image_url,
        }
        
        if role == "director":
            directors.append(person_dict)
        elif role == "writer":
            writers.append(person_dict)
        elif role == "producer":
            producers.append(person_dict)
        elif role == "actor":
            person_dict["character"] = character_name
            cast.append(person_dict)
    
    data = {
        "directors": directors,
        "writers": writers,
        "producers": producers,
        "cast": cast,
    }
    
    return ExportResponse(
        category="cast_crew",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source=determine_data_source(movie, "people"),
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/timeline", response_model=ExportResponse)
async def export_timeline(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export production timeline events.
    
    Timeline is stored as JSONB array in the database.
    """
    movie = await get_movie_by_external_id(session, external_id)
    
    data = {
        "events": movie.timeline or []
    }
    
    return ExportResponse(
        category="timeline",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source="manual",
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/trivia", response_model=ExportResponse)
async def export_trivia(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export trivia items.

    Trivia is stored as JSONB array in the database.
    """
    movie = await get_movie_by_external_id(session, external_id)

    data = {
        "items": movie.trivia or []
    }

    return ExportResponse(
        category="trivia",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source="manual",
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/awards", response_model=ExportResponse)
async def export_awards(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export award nominations and wins.

    Fetches from award_nominations table.
    """
    movie = await get_movie_by_external_id(session, external_id)

    # Query award nominations
    awards_query = select(AwardNomination).where(AwardNomination.movie_id == movie.id)
    awards_result = await session.execute(awards_query)
    awards = awards_result.scalars().all()

    awards_list = [
        {
            "id": award.external_id,
            "ceremony": award.ceremony,
            "year": award.year,
            "category": award.category,
            "nominee": award.nominee,
            "result": award.result,
            "notes": award.notes,
        }
        for award in awards
    ]

    data = {
        "awards": awards_list
    }

    return ExportResponse(
        category="awards",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source="manual",
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/media", response_model=ExportResponse)
async def export_media(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export media assets.

    Includes: poster, backdrop, trailer URL, gallery images
    """
    movie = await get_movie_by_external_id(session, external_id)

    data = {
        "poster_url": movie.poster_url,
        "backdrop_url": movie.backdrop_url,
        "trailer_url": None,  # TODO: Add trailer_url field to Movie model
        "gallery_images": [],  # TODO: Add gallery_images field to Movie model
    }

    return ExportResponse(
        category="media",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source=determine_data_source(movie, "poster_url"),
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/streaming", response_model=ExportResponse)
async def export_streaming(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ExportResponse:
    """
    Export streaming platform links.

    Fetches from movie_streaming_options table.
    """
    movie = await get_movie_by_external_id(session, external_id)

    # Query streaming options
    streaming_query = select(MovieStreamingOption, StreamingPlatform).join(
        StreamingPlatform, MovieStreamingOption.platform_id == StreamingPlatform.id
    ).where(MovieStreamingOption.movie_id == movie.id)

    streaming_result = await session.execute(streaming_query)

    streaming_list = [
        {
            "platform": platform.name,
            "region": option.region,
            "type": option.type,
            "price": option.price,
            "quality": option.quality,
            "url": option.url,
        }
        for option, platform in streaming_result
    ]

    data = {
        "streaming_options": streaming_list
    }

    return ExportResponse(
        category="streaming",
        movie_id=external_id,
        exported_at=get_current_timestamp(),
        data=data,
        metadata=ExportMetadata(
            source=determine_data_source(movie, "streaming"),
            last_updated=get_current_timestamp(),
            updated_by=admin_user.email,
        )
    )


@router.get("/{external_id}/export/all")
async def export_all_categories(
    external_id: str,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
):
    """
    Export all categories as a ZIP file.

    Creates a ZIP file containing 7 JSON files (one per category).
    """
    # Fetch all category data
    basic_info = await export_basic_info(external_id, session, admin_user)
    cast_crew = await export_cast_crew(external_id, session, admin_user)
    timeline = await export_timeline(external_id, session, admin_user)
    trivia = await export_trivia(external_id, session, admin_user)
    awards = await export_awards(external_id, session, admin_user)
    media = await export_media(external_id, session, admin_user)
    streaming = await export_streaming(external_id, session, admin_user)

    # Create ZIP file in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr(f"{external_id}/basic-info.json", basic_info.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/cast-crew.json", cast_crew.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/timeline.json", timeline.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/trivia.json", trivia.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/awards.json", awards.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/media.json", media.model_dump_json(indent=2))
        zip_file.writestr(f"{external_id}/streaming.json", streaming.model_dump_json(indent=2))

    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={external_id}-export.zip"
        }
    )


# ============================================================================
# Import Endpoints
# ============================================================================

@router.post("/{external_id}/import/basic-info", response_model=ImportResponse)
async def import_basic_info(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import basic movie information.

    Updates: title, tagline, year, release_date, runtime, rating, language,
    country, overview, budget, revenue, status, genres, scores
    """
    # Validate category
    if import_data.category != "basic_info":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'basic_info', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data
    updated_fields = []

    # Update basic fields
    if "title" in data and data["title"]:
        movie.title = data["title"]
        updated_fields.append("title")

    if "tagline" in data:
        movie.tagline = data["tagline"]
        updated_fields.append("tagline")

    if "year" in data:
        movie.year = data["year"]
        updated_fields.append("year")

    if "release_date" in data and data["release_date"]:
        from datetime import datetime
        movie.release_date = datetime.fromisoformat(data["release_date"].replace("Z", "+00:00"))
        updated_fields.append("release_date")

    if "runtime" in data:
        movie.runtime = data["runtime"]
        updated_fields.append("runtime")

    if "rating" in data:
        movie.rating = data["rating"]
        updated_fields.append("rating")

    if "language" in data:
        movie.language = data["language"]
        updated_fields.append("language")

    if "country" in data:
        movie.country = data["country"]
        updated_fields.append("country")

    if "overview" in data:
        movie.overview = data["overview"]
        updated_fields.append("overview")

    if "budget" in data:
        movie.budget = data["budget"]
        updated_fields.append("budget")

    if "revenue" in data:
        movie.revenue = data["revenue"]
        updated_fields.append("revenue")

    if "status" in data:
        movie.status = data["status"]
        updated_fields.append("status")

    # Update scores
    if "siddu_score" in data:
        movie.siddu_score = data["siddu_score"]
        updated_fields.append("siddu_score")

    if "critics_score" in data:
        movie.critics_score = data["critics_score"]
        updated_fields.append("critics_score")

    if "imdb_rating" in data:
        movie.imdb_rating = data["imdb_rating"]
        updated_fields.append("imdb_rating")

    if "rotten_tomatoes_score" in data:
        movie.rotten_tomatoes_score = data["rotten_tomatoes_score"]
        updated_fields.append("rotten_tomatoes_score")

    # Update genres
    if "genres" in data and isinstance(data["genres"], list):
        # Clear existing genres
        await session.execute(
            movie_genres.delete().where(movie_genres.c.movie_id == movie.id)
        )

        # Add new genres
        for genre_name in data["genres"]:
            genre_result = await session.execute(
                select(Genre).where(Genre.name == genre_name)
            )
            genre = genre_result.scalar_one_or_none()
            if genre:
                movie.genres.append(genre)

        updated_fields.append("genres")

    await session.commit()

    return ImportResponse(
        success=True,
        message=f"Successfully imported basic info for movie '{external_id}'",
        updated_fields=updated_fields
    )


@router.post("/{external_id}/import/timeline", response_model=ImportResponse)
async def import_timeline(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import production timeline events.

    Updates the timeline JSONB field.
    """
    # Validate category
    if import_data.category != "timeline":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'timeline', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data

    # Update timeline
    if "events" in data and isinstance(data["events"], list):
        movie.timeline = data["events"]
        await session.commit()

        return ImportResponse(
            success=True,
            message=f"Successfully imported timeline for movie '{external_id}'",
            updated_fields=["timeline"]
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid timeline data. Expected 'events' array."
        )


@router.post("/{external_id}/import/trivia", response_model=ImportResponse)
async def import_trivia(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import trivia items.

    Updates the trivia JSONB field.
    """
    # Validate category
    if import_data.category != "trivia":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'trivia', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data

    # Update trivia
    if "items" in data and isinstance(data["items"], list):
        movie.trivia = data["items"]
        await session.commit()

        return ImportResponse(
            success=True,
            message=f"Successfully imported trivia for movie '{external_id}'",
            updated_fields=["trivia"]
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid trivia data. Expected 'items' array."
        )


@router.post("/{external_id}/import/media", response_model=ImportResponse)
async def import_media(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import media assets.

    Updates: poster_url, backdrop_url
    """
    # Validate category
    if import_data.category != "media":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'media', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data
    updated_fields = []

    if "poster_url" in data:
        movie.poster_url = data["poster_url"]
        updated_fields.append("poster_url")

    if "backdrop_url" in data:
        movie.backdrop_url = data["backdrop_url"]
        updated_fields.append("backdrop_url")

    # TODO: Add trailer_url and gallery_images when fields are added to Movie model

    await session.commit()

    return ImportResponse(
        success=True,
        message=f"Successfully imported media for movie '{external_id}'",
        updated_fields=updated_fields
    )


@router.post("/{external_id}/import/awards", response_model=ImportResponse)
async def import_awards(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import award nominations and wins.

    Creates/updates records in award_nominations table.
    Note: This is a simplified implementation. For production, consider:
    - Matching existing awards by ceremony/year/category
    - Handling updates vs creates
    - Validating award data
    """
    # Validate category
    if import_data.category != "awards":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'awards', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data

    if "awards" not in data or not isinstance(data["awards"], list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid awards data. Expected 'awards' array."
        )

    # For MVP, we'll just log that awards import is not fully implemented
    # Full implementation would require creating AwardNomination records
    logger.warning(f"Awards import for movie {external_id} - Full implementation pending")

    return ImportResponse(
        success=True,
        message=f"Awards import acknowledged for movie '{external_id}' (full implementation pending)",
        updated_fields=["awards"],
        errors=["Awards import is not fully implemented yet. Data received but not persisted."]
    )


@router.post("/{external_id}/import/streaming", response_model=ImportResponse)
async def import_streaming(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import streaming platform links.

    Creates/updates records in movie_streaming_options table.
    Note: This is a simplified implementation. For production, consider:
    - Matching existing streaming options
    - Handling updates vs creates
    - Validating platform names
    """
    # Validate category
    if import_data.category != "streaming":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'streaming', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data

    if "streaming_options" not in data or not isinstance(data["streaming_options"], list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid streaming data. Expected 'streaming_options' array."
        )

    # For MVP, we'll just log that streaming import is not fully implemented
    # Full implementation would require creating MovieStreamingOption records
    logger.warning(f"Streaming import for movie {external_id} - Full implementation pending")

    return ImportResponse(
        success=True,
        message=f"Streaming import acknowledged for movie '{external_id}' (full implementation pending)",
        updated_fields=["streaming"],
        errors=["Streaming import is not fully implemented yet. Data received but not persisted."]
    )


@router.post("/{external_id}/import/cast-crew", response_model=ImportResponse)
async def import_cast_crew(
    external_id: str,
    import_data: ImportRequest,
    session: AsyncSession = Depends(get_session),
    admin_user: User = Depends(require_admin),
) -> ImportResponse:
    """
    Import cast and crew information.

    Creates/updates records in people and movie_people tables.
    Note: This is a simplified implementation. For production, consider:
    - Matching existing people by name or external_id
    - Handling updates vs creates
    - Validating person data
    """
    # Validate category
    if import_data.category != "cast_crew":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Expected 'cast_crew', got '{import_data.category}'"
        )

    # Validate movie_id matches
    if import_data.movie_id != external_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie ID mismatch. URL: '{external_id}', Data: '{import_data.movie_id}'"
        )

    movie = await get_movie_by_external_id(session, external_id)
    data = import_data.data

    # Validate data structure
    required_keys = ["directors", "writers", "producers", "cast"]
    for key in required_keys:
        if key not in data or not isinstance(data[key], list):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid cast-crew data. Expected '{key}' array."
            )

    # For MVP, we'll just log that cast-crew import is not fully implemented
    # Full implementation would require creating Person and movie_people records
    logger.warning(f"Cast-crew import for movie {external_id} - Full implementation pending")

    return ImportResponse(
        success=True,
        message=f"Cast-crew import acknowledged for movie '{external_id}' (full implementation pending)",
        updated_fields=["cast", "crew"],
        errors=["Cast-crew import is not fully implemented yet. Data received but not persisted."]
    )

