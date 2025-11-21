"""
TMDB (The Movie Database) API Integration

Provides functions to fetch movie data from TMDB API v3.
Supports both search-based and direct ID-based movie fetching.
"""

from __future__ import annotations

import logging
import os
from typing import Any, Dict, Optional

import httpx

try:
    from ..config import settings
except ImportError:
    # Fallback for direct script execution
    from config import settings

logger = logging.getLogger(__name__)

TMDB_API_KEY = settings.tmdb_api_key
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

# Image sizes for different use cases
POSTER_SIZE = "w500"  # 500px width for posters
BACKDROP_SIZE = "original"  # Original size for backdrops


class TMDBError(Exception):
    """Base exception for TMDB API errors"""
    pass


class TMDBNotFoundError(TMDBError):
    """Raised when a movie is not found on TMDB"""
    pass


class TMDBRateLimitError(TMDBError):
    """Raised when TMDB API rate limit is exceeded"""
    pass


async def search_movie(query: str, year: Optional[int] = None) -> Optional[Dict[str, Any]]:
    """
    Search for a movie on TMDB by title.
    
    Args:
        query: Movie title to search for
        year: Optional release year to narrow results
        
    Returns:
        Movie data dict or None if not found
        
    Raises:
        TMDBError: If API call fails
    """
    if not TMDB_API_KEY:
        logger.warning("TMDB_API_KEY not configured")
        return None
    
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            params = {
                "api_key": TMDB_API_KEY,
                "query": query,
                "include_adult": "false",
            }
            if year:
                params["year"] = str(year)
            
            logger.debug(f"Searching TMDB for: {query}")
            response = await client.get(
                f"{TMDB_BASE_URL}/search/movie",
                params=params,
            )
            
            if response.status_code == 429:
                raise TMDBRateLimitError("TMDB API rate limit exceeded")
            
            if response.status_code != 200:
                logger.error(f"TMDB search failed: {response.status_code}")
                return None
            
            data = response.json()
            results = data.get("results") or []
            
            if not results:
                logger.debug(f"No TMDB results for: {query}")
                return None
            
            # Return the first result
            movie_id = results[0]["id"]
            logger.debug(f"Found TMDB movie ID: {movie_id}")
            return await fetch_movie_by_id(movie_id)
            
    except httpx.TimeoutException:
        logger.error("TMDB API request timed out")
        raise TMDBError("TMDB API request timed out")
    except Exception as e:
        logger.error(f"TMDB search error: {str(e)}")
        raise TMDBError(f"TMDB search failed: {str(e)}")


async def fetch_movie_by_id(movie_id: int) -> Optional[Dict[str, Any]]:
    """
    Fetch complete movie data from TMDB by ID.
    
    Args:
        movie_id: TMDB movie ID
        
    Returns:
        Complete movie data dict or None if not found
        
    Raises:
        TMDBError: If API call fails
    """
    if not TMDB_API_KEY:
        logger.warning("TMDB_API_KEY not configured")
        return None
    
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            # Append additional data to the response
            append_to_response = "credits,keywords,release_dates,watch/providers,videos,reviews,similar"
            
            logger.debug(f"Fetching TMDB movie ID: {movie_id}")
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/{movie_id}",
                params={
                    "api_key": TMDB_API_KEY,
                    "append_to_response": append_to_response,
                },
            )
            
            if response.status_code == 429:
                raise TMDBRateLimitError("TMDB API rate limit exceeded")
            
            if response.status_code == 404:
                logger.warning(f"TMDB movie not found: {movie_id}")
                raise TMDBNotFoundError(f"Movie {movie_id} not found on TMDB")
            
            if response.status_code != 200:
                logger.error(f"TMDB fetch failed: {response.status_code}")
                return None
            
            data = response.json()
            logger.debug(f"Successfully fetched TMDB movie: {data.get('title')}")
            return _transform_tmdb_response(data)
            
    except TMDBNotFoundError:
        raise
    except httpx.TimeoutException:
        logger.error("TMDB API request timed out")
        raise TMDBError("TMDB API request timed out")
    except Exception as e:
        logger.error(f"TMDB fetch error: {str(e)}")
        raise TMDBError(f"TMDB fetch failed: {str(e)}")


def _transform_tmdb_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform TMDB API response to our internal schema.

    Args:
        data: Raw TMDB API response

    Returns:
        Transformed movie data dict
    """
    from datetime import datetime

    # Extract year from release_date
    year = None
    release_date = data.get("release_date")
    release_date_obj = None
    if release_date:
        try:
            year = release_date.split("-")[0]
            # Convert string date to datetime object
            release_date_obj = datetime.strptime(release_date, "%Y-%m-%d").date()
        except Exception:
            pass
    
    # Extract genres
    genres = [g["name"] for g in (data.get("genres") or [])]
    
    # Extract cast and crew
    directors, writers, producers, cast = [], [], [], []
    for crew in (data.get("credits", {}).get("crew") or []):
        job = (crew.get("job") or "").lower()
        person = {
            "name": crew.get("name"),
            "image": (
                f"{TMDB_IMAGE_BASE_URL}/w185{crew.get('profile_path')}"
                if crew.get("profile_path")
                else None
            ),
        }
        if job == "director":
            directors.append(person)
        elif job in ("writer", "screenplay"):
            writers.append(person)
        elif job == "producer":
            producers.append(person)
    
    # Extract cast (limit to 15)
    for actor in (data.get("credits", {}).get("cast") or [])[:15]:
        cast.append({
            "name": actor.get("name"),
            "character": actor.get("character"),
            "image": (
                f"{TMDB_IMAGE_BASE_URL}/w185{actor.get('profile_path')}"
                if actor.get("profile_path")
                else None
            ),
        })
    
    # Extract streaming providers
    streaming = []
    providers_data = data.get("watch/providers", {}).get("results") or {}
    for region, region_data in providers_data.items():
        if not isinstance(region_data, dict):
            continue
        for provider_type in ("flatrate", "buy", "rent", "ads"):
            for provider in region_data.get(provider_type, []) or []:
                streaming.append({
                    "platform": provider.get("provider_name") or "unknown",
                    "region": region,
                    "type": "subscription" if provider_type == "flatrate" else (
                        "free" if provider_type == "ads" else provider_type
                    ),
                    "price": None,
                    "quality": None,
                    "url": region_data.get("link"),
                })
    
    # Build transformed response
    transformed = {
        "external_id": f"tmdb-{data.get('id')}",
        "tmdb_id": data.get("id"),
        "title": data.get("title") or data.get("name"),
        "tagline": data.get("tagline"),
        "year": year,
        "release_date": release_date_obj,
        "runtime": data.get("runtime"),
        "rating": None,
        "siddu_score": None,
        "critics_score": None,
        "imdb_rating": None,
        "rotten_tomatoes_score": None,
        "language": (data.get("original_language") or "").upper() or None,
        "country": None,
        "overview": data.get("overview"),
        "poster_url": (
            f"{TMDB_IMAGE_BASE_URL}/{POSTER_SIZE}{data.get('poster_path')}"
            if data.get("poster_path")
            else None
        ),
        "backdrop_url": (
            f"{TMDB_IMAGE_BASE_URL}/{BACKDROP_SIZE}{data.get('backdrop_path')}"
            if data.get("backdrop_path")
            else None
        ),
        "budget": data.get("budget") or None,
        "revenue": data.get("revenue") or None,
        "status": data.get("status"),
        "genres": genres,
        "directors": directors,
        "writers": writers,
        "producers": producers,
        "cast": cast,
        "streaming": streaming,
    }
    
    return transformed

