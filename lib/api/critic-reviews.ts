/**
 * Critic Reviews API Client
 * Handles critic review CRUD operations and fetching
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client"

export interface CriticReviewData {
  movie_id: number
  title: string
  content: string
  numeric_rating: number
  tags?: string[]
  youtube_video_id?: string
  is_draft?: boolean
  published_at?: string
}

export interface CriticReviewResponse {
  id: number
  external_id: string
  critic_id: number
  movie_id: number
  title: string
  content: string
  numeric_rating: number
  slug: string
  tags: string[]
  youtube_video_id?: string
  is_draft: boolean
  published_at?: string
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  created_at: string
  updated_at: string
  critic: {
    id: number
    username: string
    display_name: string
    logo_url?: string
    is_verified: boolean
  }
}

export interface DashboardStats {
  total_reviews: number
  total_views: number
  total_likes: number
  average_rating: number
  this_month_reviews: number
  this_month_views: number
  trending_reviews: CriticReviewResponse[]
}

/**
 * Create a new critic review
 */
export async function createCriticReview(data: CriticReviewData): Promise<CriticReviewResponse> {
  return apiPost<CriticReviewResponse>("/api/v1/critic-reviews", data)
}

/**
 * Get a specific critic review
 */
export async function getCriticReview(reviewId: number): Promise<CriticReviewResponse> {
  return apiGet<CriticReviewResponse>(`/api/v1/critic-reviews/${reviewId}`)
}

/**
 * Update a critic review
 */
export async function updateCriticReview(
  reviewId: number,
  data: Partial<CriticReviewData>
): Promise<CriticReviewResponse> {
  return apiPut<CriticReviewResponse>(`/api/v1/critic-reviews/${reviewId}`, data)
}

/**
 * Delete a critic review
 */
export async function deleteCriticReview(reviewId: number): Promise<void> {
  return apiDelete(`/api/v1/critic-reviews/${reviewId}`)
}

/**
 * List reviews by critic username
 */
export async function listReviewsByCritic(
  username: string,
  limit: number = 20,
  offset: number = 0
): Promise<CriticReviewResponse[]> {
  return apiGet<CriticReviewResponse[]>(
    `/api/v1/critic-reviews/critic/${username}?limit=${limit}&offset=${offset}`
  )
}

/**
 * List reviews by movie
 */
export async function listReviewsByMovie(
  movieId: string,
  limit: number = 20,
  offset: number = 0
): Promise<CriticReviewResponse[]> {
  return apiGet<CriticReviewResponse[]>(
    `/api/v1/critic-reviews/movie/${movieId}?limit=${limit}&offset=${offset}`
  )
}

/**
 * Get critic dashboard stats
 */
export async function getCriticDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/api/v1/critics/me/stats")
}

/**
 * List current user's reviews (drafts and published)
 */
export async function listMyReviews(
  status?: "draft" | "published",
  limit: number = 20,
  offset: number = 0
): Promise<CriticReviewResponse[]> {
  const params = new URLSearchParams()
  if (status) params.append("status", status)
  params.append("limit", limit.toString())
  params.append("offset", offset.toString())

  return apiGet<CriticReviewResponse[]>(`/api/v1/critic-reviews/me?${params.toString()}`)
}

/**
 * Publish a draft review
 */
export async function publishReview(reviewId: number): Promise<CriticReviewResponse> {
  return apiPut<CriticReviewResponse>(`/api/v1/critic-reviews/${reviewId}/publish`, {})
}

/**
 * Unpublish a review (move back to draft)
 */
export async function unpublishReview(reviewId: number): Promise<CriticReviewResponse> {
  return apiPut<CriticReviewResponse>(`/api/v1/critic-reviews/${reviewId}/unpublish`, {})
}

