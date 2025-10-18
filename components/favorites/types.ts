export interface FavoriteItem {
  id: string
  title: string
  type: "movie" | "tv-show" | "person" | "scene" | "article"
  imageUrl?: string
  addedDate: string // ISO date string
  // Add other relevant fields, e.g., rating, year
  releaseYear?: number
  userRating?: number
  genres?: string[]
}

export type FavoriteSortOption = "dateAddedDesc" | "dateAddedAsc" | "titleAsc" | "titleDesc" | "type"
export type FavoriteViewMode = "grid" | "list" | "wall"

export interface FavoritesFilters {
  type: "all" | FavoriteItem["type"]
  searchTerm: string
}
