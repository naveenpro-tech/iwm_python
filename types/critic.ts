/**
 * TypeScript type definitions for Critic Hub features
 */

export interface CriticProfile {
  id: number
  external_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  banner_image_url: string | null
  banner_video_url: string | null
  is_verified: boolean
  verification_level: 'basic' | 'professional' | 'celebrity'
  total_reviews: number
  total_followers: number
  total_following: number
  avg_rating: number
  total_likes: number
  total_views: number
  joined_at: string
  social_links: SocialLink[]
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  display_text: string | null
}

export interface CriticReview {
  id: number
  external_id: string
  title: string
  content: string
  rating: number
  slug: string
  published_at: string
  likes_count: number
  comments_count: number
  views_count: number
  movie: {
    id: number
    external_id: string
    title: string
    poster_url: string | null
    year: string | null
  }
}

export interface MovieInfo {
  id: number
  external_id: string
  title: string
  poster_url: string | null
  year: string | null
}

// New types for Phase 2: Critic-Centric Hub

export interface CriticRecommendation {
  id: number
  critic_id: number
  movie_id: number
  recommendation_note: string
  badge_type: 'highly_recommended' | 'hidden_gem' | 'classic_must_watch' | 'underrated' | 'masterpiece'
  created_at: string
  movie: {
    id: number
    external_id: string
    title: string
    poster_url: string | null
    year: string | null
    genre: string[]
    imdb_rating: number | null
  }
}

export interface CriticBlogPost {
  id: number
  critic_id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image_url: string | null
  tags: string[]
  published_at: string
  views_count: number
  is_published: boolean
  read_time_minutes: number
}

export interface PinnedContent {
  id: number
  critic_id: number
  content_type: 'review' | 'blog_post' | 'recommendation'
  content_id: number
  position: number
  created_at: string
  // Populated content based on type
  review?: CriticReview
  blog_post?: CriticBlogPost
  recommendation?: CriticRecommendation
}

export interface CriticAnalytics {
  top_genres: Array<{
    genre: string
    count: number
    percentage: number
  }>
  rating_distribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
  review_frequency: {
    per_month: number
    trend: 'increasing' | 'stable' | 'decreasing'
  }
  engagement_stats: {
    avg_likes_per_review: number
    avg_comments_per_review: number
    avg_views_per_review: number
  }
}

