export type WatchStatus = "want-to-watch" | "watching" | "watched"

export type SortOption = "dateAdded" | "title" | "releaseDate" | "rating" | "priority"

export type GroupByOption = "status" | "priority" | "genre" | "year"

export interface WatchlistItem {
  id: string
  title: string
  posterUrl: string
  backdropUrl?: string
  dateAdded: string
  releaseDate: string
  status: WatchStatus
  priority: "high" | "medium" | "low"
  progress?: number
  rating: number
  genres: string[]
  runtime?: number
  director?: string
  streamingServices?: string[]
}

export interface WatchlistStats {
  total: number
  watched: number
  watching: number
  wantToWatch: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  upcomingReleases: number
}
