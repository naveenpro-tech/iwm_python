import type { LucideIcon } from "lucide-react"

export interface Movie {
  id: string
  title: string
  posterUrl: string
  sidduScore?: number
  year: string
  genres?: string[]
  streamingOptions?: {
    [region: string]: StreamingOption[]
  }
  isNew?: boolean
  slug?: string
  releaseDate?: string
  director?: string
  duration?: string
  description?: string
  cast?: { id: string; name: string; role: string; avatarUrl?: string }[]
  averageRating?: number
  reviewCount?: number
  backdropUrl?: string
  tagline?: string
  language?: string
  country?: string
  awards?: string[]
  trailerUrl?: string
  watchProviders?: { provider_id: number; logo_path: string; provider_name: string; type: string }[]
  rating?: string // MPAA or similar rating
}

export interface StreamingOption {
  id: string
  provider: string
  logoUrl: string
  type: "subscription" | "rent" | "buy" | "free"
  price?: string
  quality: "SD" | "HD" | "4K" | "8K"
  url: string
  verified: boolean
}

export interface MasterpieceFilm extends Movie {
  country: string
  countryCode: string
  visualStyle?: string
}

export interface SiddusPickMovie extends Movie {
  pickReason: string
  backdropUrl: string
}

export interface TrendingPulseUser {
  id: string
  name: string
  username: string
  avatarUrl?: string
  isVerified?: boolean
}

export interface TrendingPulseRelatedMovie {
  id: string
  title: string
  year: string
  posterUrl?: string
}

export interface TrendingPulseStats {
  comments: number
  likes: number
  reposts: number
  views?: number
}

export interface TrendingPulse {
  id: string
  user: TrendingPulseUser
  timestamp: string
  content: string
  media?: { type: "image" | "video"; url: string; alt?: string }[]
  relatedMovie?: TrendingPulseRelatedMovie
  stats: TrendingPulseStats
  topic?: string
  sourceMovieId?: string
  tags?: string[]
}

export interface BestScene {
  id: string
  title: string
  movieTitle: string
  movieYear: string
  movieId: string
  thumbnailUrl: string
  description: string
  duration?: string
  vfxBreakdown?: boolean
  directorInsight?: boolean
  sidduScore?: number
  tags?: string[]
  slug?: string
  timestampInMovie?: string
  relatedScenes?: string[]
}

export interface CinematicVignetteElement {
  type: "image" | "text"
  src?: string
  alt?: string
  content?: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  animation: { type: string; delay: number; duration: number }
  className?: string
}

export interface CinematicVignette {
  id: string
  title: string
  director?: string
  year?: string
  quote?: string
  quoteAuthor?: string
  description: string
  videoUrl?: string
  fallbackImageUrl: string
  ctaText: string
  ctaLink: string
  theme?: "light" | "dark"
  elements?: CinematicVignetteElement[]
  category?: "Visual Treats" | "Behind the Scenes" | "Iconic Film" // Added category
}

// Types for Activity Snapshot
export interface ProgressData {
  // Renamed from ProgressSnapshotItem
  id: string
  icon: LucideIcon
  title: string
  description: string
  percentage: number
  color: string
  ctaText?: string
  ctaLink?: string
}

export interface WhatsNextData {
  // Renamed from WhatsNextSnapshotItem
  id: string
  category: string
  title: string
  description: string
  imageUrl?: string
  ctaText: string
  ctaLink: string
}

export interface InfluenceData {
  // Renamed from InfluenceSnapshotItem
  id: string
  icon: LucideIcon
  title: string
  metricValue: number | string
  metricUnit?: string
  description: string
  color: string
  change?: number
}

export interface RecommendationData {
  // Renamed from RecommendationSnapshotItem
  id: string
  type?: "movie" | "genre" | "person" // Made optional as not all contexts might use it
  title: string
  posterUrl?: string
  imageUrl?: string
  rating?: number
  genres?: string[]
  reason: string
  ctaLink: string
}

export interface WeeklyGemData {
  // Renamed from WeeklyGemSnapshotItem
  id: string
  category: string
  title: string
  description: string
  imageUrl?: string
  tags: string[]
  ctaText: string
  ctaLink: string
}

export interface PersonalizedActivitySliderProps {
  mockProgressData: ProgressData[]
  mockWhatsNextData: WhatsNextData[]
  mockInfluenceData: InfluenceData[]
  mockRecommendationData: RecommendationData[]
  mockWeeklyGemData: WeeklyGemData[]
}

export interface ActivityCardSharedProps {
  isActive: boolean
  className?: string
}

export interface ProgressSnapshotCardProps extends ActivityCardSharedProps {
  item: ProgressData
}
export interface WhatsNextSnapshotCardProps extends ActivityCardSharedProps {
  item: WhatsNextData
}
export interface InfluenceSnapshotCardProps extends ActivityCardSharedProps {
  item: InfluenceData
}
export interface RecommendationSnapshotCardProps extends ActivityCardSharedProps {
  item: RecommendationData
}
export interface WeeklyGemSnapshotCardProps extends ActivityCardSharedProps {
  item: WeeklyGemData
}
