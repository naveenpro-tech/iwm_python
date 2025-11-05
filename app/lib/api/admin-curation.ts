/**
 * Admin Curation API Client
 * 
 * Handles all API calls for movie curation management
 */

import { getAuthToken } from "@/lib/auth/token"

export interface CuratorInfo {
  id: number
  name: string
  email: string
}

export interface CurationData {
  curation_status: string | null
  quality_score: number | null
  curator_notes: string | null
  curated_by_id: number | null
  curated_at: string | null
  last_reviewed_at: string | null
  curated_by: CuratorInfo | null
}

export interface MovieCurationResponse {
  id: number
  external_id: string
  title: string
  year: string | null
  curation: CurationData
}

export interface MovieCurationListResponse {
  items: MovieCurationResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CurationUpdateRequest {
  curation_status?: string | null
  quality_score?: number | null
  curator_notes?: string | null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Get paginated movies for curation with filters and sorting
 */
export async function getMoviesForCuration(params: {
  page?: number
  page_size?: number
  curation_status?: string | null
  sort_by?: string
  sort_order?: string
}): Promise<MovieCurationListResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const searchParams = new URLSearchParams()
  if (params.page) searchParams.append("page", params.page.toString())
  if (params.page_size) searchParams.append("page_size", params.page_size.toString())
  if (params.curation_status) searchParams.append("curation_status", params.curation_status)
  if (params.sort_by) searchParams.append("sort_by", params.sort_by)
  if (params.sort_order) searchParams.append("sort_order", params.sort_order)

  const response = await fetch(
    `${API_BASE_URL}/api/admin/movies?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please login again")
    }
    if (response.status === 403) {
      throw new Error("Forbidden - admin access required")
    }
    throw new Error(`Failed to fetch movies: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Update movie curation
 */
export async function updateMovieCuration(
  movieId: number,
  data: CurationUpdateRequest
): Promise<MovieCurationResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(
    `${API_BASE_URL}/api/admin/movies/${movieId}/curation`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - please login again")
    }
    if (response.status === 403) {
      throw new Error("Forbidden - admin access required")
    }
    if (response.status === 404) {
      throw new Error("Movie not found")
    }
    if (response.status === 400) {
      const error = await response.json()
      throw new Error(`Validation error: ${error.detail || "Invalid data"}`)
    }
    throw new Error(`Failed to update movie: ${response.statusText}`)
  }

  return response.json()
}

