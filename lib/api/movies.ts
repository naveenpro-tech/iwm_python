/**
 * Movies API Client
 * Fetches movie data from the FastAPI backend
 */

import { getApiUrl } from "@/lib/api-config"

const API_BASE = getApiUrl()

export interface MovieQueryParams {
  page?: number
  limit?: number
  genre?: string
  language?: string
  yearMin?: number
  yearMax?: number
  sortBy?: string
  search?: string
}

/**
 * Get movies with optional filters
 */
export async function getMovies(params: MovieQueryParams = {}) {
  try {
    const queryParams = new URLSearchParams()
    
    // Add parameters
    if (params.page) queryParams.set("page", String(params.page))
    if (params.limit) queryParams.set("limit", String(params.limit))
    if (params.genre) queryParams.set("genre", params.genre)
    if (params.language) queryParams.set("language", params.language)
    if (params.yearMin) queryParams.set("yearMin", String(params.yearMin))
    if (params.yearMax) queryParams.set("yearMax", String(params.yearMax))
    if (params.sortBy) queryParams.set("sortBy", params.sortBy)
    if (params.search) queryParams.set("search", params.search)

    const response = await fetch(`${API_BASE}/api/v1/movies?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching movies:", error)
    throw error
  }
}

/**
 * Get new releases (Telugu movies sorted by release date)
 */
export async function getNewReleases(limit: number = 10) {
  return getMovies({
    limit,
    language: "Telugu",
    sortBy: "release_date_desc",
  })
}

/**
 * Get featured movies (Telugu movies sorted by Siddu score)
 */
export async function getFeaturedMovies(limit: number = 10) {
  return getMovies({
    limit,
    language: "Telugu",
    sortBy: "siddu_score_desc",
  })
}

/**
 * Get top-rated movies (Telugu movies sorted by rating)
 */
export async function getTopRatedMovies(limit: number = 10) {
  return getMovies({
    limit,
    language: "Telugu",
    sortBy: "rating_desc",
  })
}

/**
 * Get a single movie by ID
 */
export async function getMovieById(id: string) {
  try {
    const response = await fetch(`${API_BASE}/api/v1/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching movie:", error)
    throw error
  }
}

/**
 * Search movies
 */
export async function searchMovies(query: string, limit: number = 20) {
  return getMovies({
    search: query,
    limit,
  })
}

