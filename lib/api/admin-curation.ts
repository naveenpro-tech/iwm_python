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

