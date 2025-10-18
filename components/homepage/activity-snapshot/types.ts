import type { LucideIcon } from "lucide-react"

// Data types for each card
export interface ProgressData {
  id: string
  icon: LucideIcon
  title: string
  description: string
  percentage: number
  color: string // e.g., "text-sky-400 bg-sky-400"
  ctaText?: string
  ctaLink?: string
}

export interface WhatsNextData {
  id: string
  category: string // e.g., "Watchlist", "Review Queue"
  title: string
  description: string
  imageUrl?: string
  ctaText: string
  ctaLink: string
}

export interface InfluenceData {
  id: string
  icon: LucideIcon
  title: string
  metricValue: number | string // Can be a number or a formatted string like "Top 5%"
  metricUnit?: string // e.g., "Likes", "Views", "" for percentages
  description: string
  color: string // Tailwind text color class
  change?: number // Percentage change, e.g., 5 for +5%, -2 for -2%
}

export interface RecommendationData {
  id: string
  type?: "movie" | "genre" | "person" // Type of recommendation
  title: string
  posterUrl?: string // For movies/people
  imageUrl?: string // For genres or general cards
  rating?: number // For movies
  genres?: string[] // For movies
  reason: string // Why this is recommended
  ctaLink: string
}

export interface WeeklyGemData {
  id: string
  category: string // e.g., "Hidden Gem", "Cult Classic"
  title: string
  description: string
  imageUrl?: string
  tags: string[]
  ctaText: string
  ctaLink: string
}

// Props for the main slider component
export interface PersonalizedActivitySliderProps {
  mockProgressData: ProgressData[]
  mockWhatsNextData: WhatsNextData[]
  mockInfluenceData: InfluenceData[]
  mockRecommendationData: RecommendationData[]
  mockWeeklyGemData: WeeklyGemData[]
}

// Shared props for all snapshot card wrappers/components
export interface ActivityCardSharedProps {
  isActive: boolean // To control animations or styles for the active card
  className?: string
}

// Specific props for each card component, extending shared props
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
