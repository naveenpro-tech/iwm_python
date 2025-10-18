export type CategoryType = "trending" | "topRated" | "newReleases" | "visualTreats" | "globalCinema"

export interface FilterState {
  genres: string[]
  yearRange: [number, number]
  languages: string[]
  countries: string[]
  ratingRange: [number, number]
}

export interface MovieType {
  id: string
  title: string
  year: string
  releaseDate: string
  posterUrl: string
  backdropUrl?: string
  rating: number
  runtime: number
  overview: string
  genres: string[]
  language: string
  country: string
  director?: string
  cast?: string[]
  tags?: string[]
  trending?: boolean
}
