/**
 * API client for movie export/import endpoints
 * Handles categorized movie data export/import for manual enrichment workflow
 */

import { getAuthHeaders } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export type CategoryType =
  | "basic-info"
  | "cast-crew"
  | "timeline"
  | "trivia"
  | "awards"
  | "media"
  | "streaming"

export interface ExportMetadata {
  source: "tmdb" | "manual" | "llm-generated"
  last_updated: string
  updated_by?: string
}

export interface ExportResponse {
  category: string
  movie_id: string
  version: string
  exported_at: string
  data: Record<string, any>
  metadata: ExportMetadata
}

export interface ImportRequest {
  category: string
  movie_id: string
  version?: string
  data: Record<string, any>
  metadata?: ExportMetadata
}

export interface ImportResponse {
  success: boolean
  message: string
  updated_fields: string[]
  errors?: string[]
}

/**
 * Export a single category for a movie
 */
export async function exportMovieCategory(
  movieId: string,
  category: CategoryType
): Promise<ExportResponse> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/export/${category}`,
    {
      method: "GET",
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || `Failed to export ${category}`)
  }

  return response.json()
}

/**
 * Export all categories for a movie as a ZIP file
 */
export async function exportAllCategories(movieId: string): Promise<Blob> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/export/all`,
    {
      method: "GET",
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to export all categories")
  }

  return response.blob()
}

/**
 * Import enriched data for a specific category
 */
export async function importMovieCategory(
  movieId: string,
  category: CategoryType,
  importData: ImportRequest
): Promise<ImportResponse> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/import/${category}`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(importData),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || `Failed to import ${category}`)
  }

  return response.json()
}

/**
 * Download a JSON file to the user's computer
 */
export function downloadJSON(data: ExportResponse, filename?: string) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename || `${data.movie_id}-${data.category}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download a ZIP file to the user's computer
 */
export function downloadZIP(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Validate JSON structure for import
 */
export function validateImportJSON(jsonString: string): {
  valid: boolean
  data?: ImportRequest
  error?: string
} {
  try {
    const data = JSON.parse(jsonString)

    // Check required fields
    if (!data.category) {
      return { valid: false, error: "Missing required field: category" }
    }
    if (!data.movie_id) {
      return { valid: false, error: "Missing required field: movie_id" }
    }
    if (!data.data) {
      return { valid: false, error: "Missing required field: data" }
    }

    return { valid: true, data }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    }
  }
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: CategoryType): string {
  const names: Record<CategoryType, string> = {
    "basic-info": "Basic Info",
    "cast-crew": "Cast & Crew",
    timeline: "Timeline",
    trivia: "Trivia",
    awards: "Awards",
    media: "Media",
    streaming: "Streaming",
  }
  return names[category]
}

/**
 * Get category description for LLM enrichment
 */
export function getCategoryDescription(category: CategoryType): string {
  const descriptions: Record<CategoryType, string> = {
    "basic-info":
      "Core movie information including title, year, runtime, ratings, synopsis, and genres",
    "cast-crew":
      "Directors, writers, producers, and cast members with roles and character names",
    timeline:
      "Production timeline events from pre-production to release and beyond",
    trivia:
      "Interesting facts, behind-the-scenes stories, and fun trivia about the movie",
    awards:
      "Award nominations and wins from major ceremonies (Oscars, Golden Globes, etc.)",
    media: "Posters, backdrops, trailers, and gallery images",
    streaming: "Streaming platform availability and links",
  }
  return descriptions[category]
}

/**
 * Movie context for template generation
 */
export interface MovieContext {
  title: string
  year?: string | number
  tmdb_id?: number
  id: string
}

/**
 * Generate intelligent template for LLM-based enrichment
 * Includes movie context, instructions, and example data structure
 */
export function getCategoryTemplate(
  category: CategoryType,
  movieData: MovieContext
): ImportRequest {
  const baseTemplate = {
    category,
    movie_id: movieData.id,
    version: "1.0",
    metadata: {
      source: "llm-generated" as const,
      last_updated: new Date().toISOString(),
    },
  }

  const movieContext = {
    title: movieData.title,
    year: movieData.year,
    tmdb_id: movieData.tmdb_id,
  }

  const templates: Record<CategoryType, any> = {
    "basic-info": {
      ...baseTemplate,
      data: {
        title: movieData.title,
        year: movieData.year ? String(movieData.year) : "YYYY",
        tagline: "Brief one-line tagline describing the movie's essence",
        release_date: "YYYY-MM-DD",
        runtime: 120,
        overview:
          "Comprehensive synopsis of the movie plot and themes (2-3 sentences)",
        rating: "PG-13",
        language: "English",
        country: "USA",
        status: "released",
        siddu_score: 85,
        critics_score: 82,
        imdb_rating: 8.5,
        rotten_tomatoes_score: 88,
      },
      instructions: `Research and fill in the basic information for "${movieData.title}" (${movieData.year}).
Use reliable sources like IMDb, Wikipedia, or official movie databases.
Ensure all dates are in YYYY-MM-DD format and scores are on their respective scales (0-100 or 0-10).`,
    },

    "cast-crew": {
      ...baseTemplate,
      data: {
        directors: [
          {
            id: "person-id",
            name: "Director Name",
            image: "https://example.com/image.jpg",
          },
        ],
        writers: [
          {
            id: "person-id",
            name: "Writer Name",
            image: "https://example.com/image.jpg",
          },
        ],
        producers: [
          {
            id: "person-id",
            name: "Producer Name",
            image: "https://example.com/image.jpg",
          },
        ],
        cast: [
          {
            id: "person-id",
            name: "Actor Name",
            character: "Character Name",
            image: "https://example.com/image.jpg",
          },
        ],
      },
      instructions: `Research the cast and crew for "${movieData.title}" (${movieData.year}).
List directors, writers, producers, and main cast members (top 10-15 actors).
Include character names for cast members. Use IMDb or similar sources for accurate information.`,
    },

    timeline: {
      ...baseTemplate,
      data: {
        events: [
          {
            date: "2023-01-15",
            title: "Pre-production Begins",
            description:
              "Director and producers begin planning and script development",
            category: "Production Start",
            mediaUrl: "https://example.com/image.jpg",
          },
          {
            date: "2023-06-01",
            title: "Principal Photography Starts",
            description: "Main filming begins on location",
            category: "Production Start",
            mediaUrl: "https://example.com/image.jpg",
          },
          {
            date: "2024-03-15",
            title: "Trailer Release",
            description: "Official trailer released to the public",
            category: "Trailer Release",
            mediaUrl: "https://example.com/trailer.jpg",
          },
        ],
      },
      instructions: `Research the production timeline for "${movieData.title}" (${movieData.year}).
Include key events from pre-production through release and beyond (awards, milestones).
Dates should be in YYYY-MM-DD format. Categories: Production Start, Casting Announcement, Trailer Release, Premiere, Box Office Milestone, Award Win, Controversy.`,
    },

    trivia: {
      ...baseTemplate,
      data: {
        items: [
          {
            question: "What is an interesting fact about this movie?",
            category: "Behind the Scenes",
            answer: "The answer to the trivia question",
            explanation:
              "Additional context or source for this trivia fact (optional)",
          },
          {
            question: "Did this movie have any notable cameos?",
            category: "Cameo",
            answer: "Yes, [Actor Name] appeared as [Character]",
            explanation: "Details about the cameo appearance",
          },
        ],
      },
      instructions: `Research interesting trivia and facts about "${movieData.title}" (${movieData.year}).
Include behind-the-scenes stories, production details, cameos, and fun facts.
Categories: Behind the Scenes, Continuity Error, Cameo, Production Detail, Cultural Reference, Goofs.
Provide 5-10 trivia items with questions, answers, and explanations.`,
    },

    awards: {
      ...baseTemplate,
      data: {
        awards: [
          {
            id: "award-1",
            ceremony: "Academy Awards",
            year: 2024,
            category: "Best Picture",
            nominee: "Movie Title",
            result: "Nominee",
            notes: "Additional notes about the nomination",
          },
          {
            id: "award-2",
            ceremony: "Golden Globe Awards",
            year: 2024,
            category: "Best Motion Picture - Drama",
            nominee: "Movie Title",
            result: "Winner",
            notes: "Won the award",
          },
        ],
      },
      instructions: `Research award nominations and wins for "${movieData.title}" (${movieData.year}).
Include major ceremonies: Academy Awards, Golden Globes, BAFTA, Cannes, Filmfare, etc.
Result should be "Winner" or "Nominee". Include all major nominations and wins.`,
    },

    media: {
      ...baseTemplate,
      data: {
        poster_url: "https://example.com/poster.jpg",
        backdrop_url: "https://example.com/backdrop.jpg",
        trailer_url: "https://youtube.com/watch?v=VIDEO_ID",
        gallery_images: [
          "https://example.com/scene1.jpg",
          "https://example.com/scene2.jpg",
          "https://example.com/scene3.jpg",
        ],
      },
      instructions: `Provide media URLs for "${movieData.title}" (${movieData.year}).
Include high-quality poster and backdrop images, official trailer link, and 3-5 scene/promotional images.
Use official sources or high-quality image databases. All URLs should be direct image links.`,
    },

    streaming: {
      ...baseTemplate,
      data: {
        streaming: [
          {
            id: "stream-1",
            provider: "Netflix",
            region: "US",
            url: "https://netflix.com/watch/...",
            type: "subscription",
            quality: "HD",
            verified: true,
          },
          {
            id: "stream-2",
            provider: "Amazon Prime Video",
            region: "US",
            url: "https://amazon.com/dp/...",
            type: "rent",
            quality: "HD",
            verified: true,
          },
        ],
      },
      instructions: `Research where "${movieData.title}" (${movieData.year}) is available to stream.
Include providers (Netflix, Prime Video, Disney+, etc.), regions, and availability type (subscription/rent/buy).
Verify links are current and working. Include quality information (SD/HD/4K).`,
    },
  }

  return templates[category]
}

/**
 * Publish draft data to make it live on the public website
 */
export async function publishDraftCategory(
  movieId: string,
  category: CategoryType
): Promise<ImportResponse> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/publish/${category}`,
    {
      method: "POST",
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || `Failed to publish ${category}`)
  }

  return response.json()
}

/**
 * Discard draft data without publishing
 */
export async function discardDraftCategory(
  movieId: string,
  category: CategoryType
): Promise<ImportResponse> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/draft/${category}`,
    {
      method: "DELETE",
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || `Failed to discard ${category} draft`)
  }

  return response.json()
}

/**
 * Get draft status for all categories
 */
export async function getDraftStatus(movieId: string): Promise<{
  movie_id: string
  draft_status: Record<
    CategoryType,
    {
      status: "draft" | "published"
      has_draft: boolean
      has_published: boolean
    }
  >
}> {
  const headers = getAuthHeaders()

  const response = await fetch(
    `${API_BASE}/admin/movies/${movieId}/draft-status`,
    {
      method: "GET",
      headers,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to get draft status")
  }

  return response.json()
}
