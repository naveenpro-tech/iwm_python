/**
 * Admin Curation API Client
 * 
 * Provides methods for bulk movie curation operations.
 * All methods require admin authentication.
 */

import { getAuthHeaders } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// ============================================================================
// Type Definitions
// ============================================================================

export interface BulkUpdateRequest {
  movie_ids: number[]
  curation_data: {
    curation_status?: "draft" | "pending_review" | "approved" | "rejected"
    quality_score?: number
    curator_notes?: string
  }
}

export interface BulkPublishRequest {
  movie_ids: number[]
  publish: boolean
}

export interface BulkFeatureRequest {
  movie_ids: number[]
  featured: boolean
}

export interface BulkUpdateResponse {
  success_count: number
  failure_count: number
  failed_ids: number[]
  message: string
}

export interface MovieCurationListResponse {
  items: Array<{
    id: number
    external_id: string
    title: string
    year: string | null
    curation: {
      curation_status: string | null
      quality_score: number | null
      curator_notes: string | null
      curated_by_id: number | null
      curated_at: string | null
      last_reviewed_at: string | null
      curated_by: { id: number; name: string; email: string } | null
    }
  }>
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface GetMoviesParams {
  page?: number
  page_size?: number
  curation_status?: string | null
  sort_by?: string
  sort_order?: string
}

export interface CurationUpdateData {
  curation_status?: string
  quality_score?: number
  curator_notes?: string
}

// ============================================================================
// API Methods
// ============================================================================

/**
 * Bulk update curation fields for multiple movies
 * 
 * @param request - Bulk update request with movie IDs and curation data
 * @returns Response with success/failure counts and failed IDs
 * @throws Error if API call fails or user is not authenticated
 */
export async function bulkUpdateMovies(
  request: BulkUpdateRequest
): Promise<BulkUpdateResponse> {
  try {
    const headers = getAuthHeaders()

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/movies/bulk-update`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated. Please log in again.")
      }
      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.")
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to update movies: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred while updating movies")
  }
}

/**
 * Bulk publish or unpublish movies
 * 
 * @param request - Bulk publish request with movie IDs and publish flag
 * @returns Response with success/failure counts and failed IDs
 * @throws Error if API call fails or user is not authenticated
 */
export async function bulkPublishMovies(
  request: BulkPublishRequest
): Promise<BulkUpdateResponse> {
  try {
    const headers = getAuthHeaders()

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/movies/bulk-publish`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated. Please log in again.")
      }
      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.")
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to publish movies: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred while publishing movies")
  }
}

/**
 * Bulk feature or unfeature movies
 * 
 * @param request - Bulk feature request with movie IDs and featured flag
 * @returns Response with success/failure counts and failed IDs
 * @throws Error if API call fails or user is not authenticated
 */
export async function bulkFeatureMovies(
  request: BulkFeatureRequest
): Promise<BulkUpdateResponse> {
  try {
    const headers = getAuthHeaders()

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/movies/bulk-feature`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authenticated. Please log in again.")
      }
      if (response.status === 403) {
        throw new Error("Access denied. Admin privileges required.")
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to feature movies: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred while featuring movies")
  }
}


/**
 * Get paginated movies for curation
 */
export async function getMoviesForCuration(params: GetMoviesParams): Promise<MovieCurationListResponse> {
  try {
    const headers = getAuthHeaders()
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append("page", params.page.toString())
    if (params.page_size) queryParams.append("page_size", params.page_size.toString())
    if (params.curation_status) queryParams.append("curation_status", params.curation_status)
    if (params.sort_by) queryParams.append("sort_by", params.sort_by)
    if (params.sort_order) queryParams.append("sort_order", params.sort_order)

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/movies?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) throw new Error("Not authenticated")
      if (response.status === 403) throw new Error("Access denied")
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Failed to fetch movies")
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("An unexpected error occurred")
  }
}

/**
 * Update movie curation
 */
export async function updateMovieCuration(movieId: number, data: CurationUpdateData): Promise<any> {
  try {
    const headers = getAuthHeaders()

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/movies/${movieId}/curation`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) throw new Error("Not authenticated")
      if (response.status === 403) throw new Error("Access denied")
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Failed to update curation")
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("An unexpected error occurred")
  }
}
