export interface VisualTreat {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  tags: string[]
  director: string
  cinematographer: string
  film: string
  year: number
  colorPalette?: string[]
  likes: number
  views: number
  userLiked?: boolean
  userBookmarked?: boolean // Added for bookmark/collection
  aspectRatio?: string
  resolution?: string
  submittedBy?: string // For user submissions
}

export type SortByType =
  | "popular"
  | "recent"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "director_asc"
  | "director_desc"
  | "film_asc"
  | "film_desc"
  | "views_asc"
  | "views_desc"

export interface FilterState {
  categories: string[]
  tags: string[]
  directors: string[]
  cinematographers: string[]
  decades: string[]
  sortBy: SortByType
}

export interface AvailableFilters {
  categories: { name: string; count: number }[]
  tags: { name: string; count: number }[]
  directors: { name: string; count: number }[]
  cinematographers: { name: string; count: number }[]
  decades: { name: string; count: number }[]
}
