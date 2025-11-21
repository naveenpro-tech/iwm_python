// Release types
export type ReleaseType = "theatrical" | "ott" | "all"

// Movie release interface
export interface MovieRelease {
  id: string
  title: string
  posterUrl: string
  releaseDate: string
  releaseType: "theatrical" | "ott"
  languages: string[]
  genres: string[]
  country: string
  sidduScore: number
}

// Filter options interface
export interface FilterOptions {
  releaseType: ReleaseType
  languages: string[]
  genres: string[]
  countries: string[]
}
