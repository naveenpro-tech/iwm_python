import type React from "react"
export type ContentType = "movie" | "profile" | "casting" | "industry" | "cricket" | "pulse"

export interface RecentItem {
  id: string
  type: ContentType
  title: string
  subtitle?: string
  description?: string
  image?: string
  timestamp: Date
  duration?: string // For movies
  role?: string // For profiles
  status?: string // For casting calls
  score?: string // For cricket
  author?: string // For pulse
  link: string
  metadata?: {
    rating?: number
    genre?: string[]
    location?: string
    deadline?: string
    matchType?: string
    likes?: number
    comments?: number
  }
}

export interface FilterOption {
  id: ContentType | "all"
  label: string
  icon: React.ComponentType<{ className?: string }>
  count: number
}
