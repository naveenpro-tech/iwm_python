export type ViewMode = "grid" | "list"

export type SortOption = "popular" | "latest" | "discussed" | "releaseNewest" | "releaseOldest"

export type SceneFilterType = "movie" | "genre" | "director" | "cinematographer" | "sceneType"

export interface SceneFilter {
  type: SceneFilterType
  value: string
  label: string
}

export interface Scene {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  movieId: string
  movieTitle: string
  moviePoster: string
  releaseYear: number
  director: string
  cinematographer: string
  genres: string[]
  sceneType: string
  viewCount: number
  commentCount: number
  isPopular: boolean
  isVisualTreat: boolean
  addedDate: string
}
