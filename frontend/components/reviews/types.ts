export type ReviewFeedType = "latest" | "top" | "trending"

export type SortOption = "date_desc" | "date_asc" | "rating_desc" | "rating_asc" | "helpful_desc" | "comments_desc"

export interface ReviewFilters {
  genres: string[]
  yearRange: {
    min: number
    max: number
  }
  countries: string[]
  languages: string[]
  scoreRange: {
    min: number
    max: number
  }
  verificationStatus: "verified" | "unverified" | "all"
}

export interface Review {
  id: string
  title: string
  content: string
  rating: number
  date: string
  hasSpoilers: boolean
  isVerified: boolean
  helpfulVotes: number
  unhelpfulVotes: number
  commentCount: number
  engagementScore: number
  mediaUrls?: string[]
  author: {
    id: string
    name: string
    avatarUrl: string
  }
  movie: {
    id: string
    title: string
    posterUrl: string
    year: number
    genres: string[]
    country: string
    language: string
  }
}
