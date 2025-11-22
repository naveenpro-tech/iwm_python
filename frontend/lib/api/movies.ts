/**
 * Movies API Client
 * Fetches movie data from the FastAPI backend
 */

import { getApiUrl } from "@/lib/api-config"

const API_BASE = getApiUrl()

/**
 * Sanitize poster URL - handle malformed JSON strings in database
 */
function sanitizePosterUrl(url: string | null | undefined): string {
  if (!url) return ""

  // If the URL contains JSON-like syntax, try to extract the actual URL
  if (typeof url === 'string' && url.includes('"')) {
    // Match pattern: "poster": "URL" or just "URL"
    const urlMatch = url.match(/["']([^"']+\.(jpg|jpeg|png|webp|gif|svg))["']/i)
    if (urlMatch) return urlMatch[1]

    // Try to extract any http/https URL
    const httpMatch = url.match(/(https?:\/\/[^\s"']+)/i)
    if (httpMatch) return httpMatch[1]

    // If it starts with / or http, it might be valid
    if (url.startsWith('/') || url.startsWith('http')) return url

    return "" // Invalid URL
  }

  return url
}

/**
 * Sanitize movie data - clean up malformed URLs
 */
function sanitizeMovie(movie: any): any {
  return {
    ...movie,
    posterUrl: sanitizePosterUrl(movie.posterUrl),
    backdropUrl: sanitizePosterUrl(movie.backdropUrl),
  }
}


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

    const data = await response.json()

    // Sanitize movie data to handle malformed URLs
    if (Array.isArray(data)) {
      return data.map(sanitizeMovie)
    }

    return data
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

    const data = await response.json()
    return sanitizeMovie(data)
  } catch (error) {
    console.error("Error fetching movie:", error)
    throw error
  }
}

/**
 * Search movies using the dedicated search endpoint
 */
export async function searchMovies(query: string, limit: number = 20) {
  try {
    const queryParams = new URLSearchParams()
    queryParams.set("q", query)
    queryParams.set("limit", String(limit))

    const response = await fetch(`${API_BASE}/api/v1/movies/search?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.statusText}`)
    }

    const data = await response.json()

    // The search endpoint returns { results: [...], total: number }
    if (data.results && Array.isArray(data.results)) {
      return data.results.map(sanitizeMovie)
    }

    return []
  } catch (error) {
    console.error("Error searching movies:", error)
    throw error
  }
}

export interface ExploreMoviesParams {
  page?: number
  limit?: number
  category?: "trending" | "topRated" | "newReleases" | "visualTreats" | "globalCinema"
  genres?: string[]
  yearMin?: number
  yearMax?: number
  languages?: string[]
  countries?: string[]
  ratingMin?: number
  ratingMax?: number
  sortBy?: string
}

/**
 * Get movies for the explore page with comprehensive filtering
 */
export async function getExploreMovies(params: ExploreMoviesParams = {}) {
  try {
    const queryParams = new URLSearchParams()

    // Add pagination
    if (params.page) queryParams.set("page", String(params.page))
    if (params.limit) queryParams.set("limit", String(params.limit))

    // Handle category-based filtering
    let sortBy = params.sortBy
    if (params.category) {
      switch (params.category) {
        case "trending":
          // For trending, get recent movies sorted by popularity
          sortBy = "popular"
          const currentYear = new Date().getFullYear()
          if (!params.yearMin) queryParams.set("yearMin", String(currentYear - 2))
          break
        case "topRated":
          sortBy = "score"
          break
        case "newReleases":
          sortBy = "latest"
          break
        case "globalCinema":
          // Filter out English movies
          if (!params.languages || params.languages.length === 0) {
            // Get all non-English movies - we'll handle this by not setting English as language
            // The backend will return all languages, and we'll filter client-side if needed
          }
          break
        case "visualTreats":
          // Visual treats will need client-side filtering by tags
          // For now, get high-rated movies
          sortBy = "score"
          if (!params.ratingMin) queryParams.set("ratingMin", "7.5")
          break
      }
    }

    // Add sorting
    if (sortBy) queryParams.set("sortBy", sortBy)

    // Add genre filter (backend accepts single genre via 'genre' param)
    if (params.genres && params.genres.length > 0) {
      // For now, use the first genre. Backend supports single genre filtering
      queryParams.set("genre", params.genres[0].toLowerCase())
    }

    // Add year range
    if (params.yearMin) queryParams.set("yearMin", String(params.yearMin))
    if (params.yearMax) queryParams.set("yearMax", String(params.yearMax))

    // Add languages (comma-separated)
    if (params.languages && params.languages.length > 0) {
      queryParams.set("languages", params.languages.join(","))
    }

    // Add countries (comma-separated)
    if (params.countries && params.countries.length > 0) {
      queryParams.set("countries", params.countries.join(","))
    }

    // Add rating range
    if (params.ratingMin !== undefined) queryParams.set("ratingMin", String(params.ratingMin))
    if (params.ratingMax !== undefined) queryParams.set("ratingMax", String(params.ratingMax))

    const response = await fetch(`${API_BASE}/api/v1/movies?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch explore movies: ${response.statusText}`)
    }

    const data = await response.json()

    // Sanitize movie data
    if (Array.isArray(data)) {
      let movies = data.map(sanitizeMovie)

      // Client-side filtering for special cases
      if (params.category === "globalCinema") {
        movies = movies.filter(m => m.language && m.language.toLowerCase() !== "english")
      }

      // For visual treats, we'd filter by tags here if available
      // Since tags aren't in the backend response yet, we rely on high ratings

      return movies
    }

    return data
  } catch (error) {
    console.error("Error fetching explore movies:", error)
    throw error
  }
}

