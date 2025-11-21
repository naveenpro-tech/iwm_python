export type TimelineCategory =
  | "development"
  | "production"
  | "post-production"
  | "marketing"
  | "release"
  | "reception"
  | "award"

export interface TimelineEventData {
  id: string // Changed to string for flexibility (e.g., 'dev1', 'prod2')
  title: string
  date: string // ISO date string (e.g., "2008-01-15") for sorting
  formattedDate: string // User-friendly date (e.g., "January 15, 2008")
  description: string
  category: TimelineCategory
  image?: string
  videoEmbed?: string // YouTube video ID or full embed URL
  media?: Array<{ type: "image" | "video"; url: string; caption?: string }>
  sourceCitations?: Array<{ text: string; url?: string }>
  relatedLinks?: Array<{ title: string; url: string }>
  tags?: string[]
  details?: string // More detailed description for modal
  significance?: "minor" | "major" | "key-milestone"
  relatedEventIds?: string[]
}
