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

