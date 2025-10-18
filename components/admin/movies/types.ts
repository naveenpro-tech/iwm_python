// Re-adding ALL_GENRES and ALL_STATUSES here as they are directly expected.
// Ideally, these should be imported from a central types file in the long run.

export const ALL_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
  "TV Movie",
] as const
export type MovieGenre = (typeof ALL_GENRES)[number]

export const ALL_STATUSES = ["upcoming", "released", "archived", "draft", "in-production", "post-production"] as const
export type MovieStatus = (typeof ALL_STATUSES)[number]

// Other types from the previous version of this file remain
// For brevity, I'm only showing the added constants and the import changes.
// Assume the rest of the file (CastMember, CrewMember, Movie, etc.) is still here.

// Import other shared types if they were moved to components/types.tsx
import type { MovieLanguage, MovieCertification } from "@/components/types"

export interface CastMember {
  id: string
  name: string
  character: string
  image?: string
  order: number
}

export interface CrewMember {
  id: string
  name: string
  role: string
  department: string
  image?: string
}

export interface StreamingPlatformLink {
  id: string
  provider: string
  region: string
  url: string
  type: "subscription" | "rent" | "buy"
  price?: string
  quality: "SD" | "HD" | "4K"
  verified: boolean
}

export interface ReleaseDateInfo {
  region: string
  date: string // YYYY-MM-DD
  type: "Theatrical" | "Digital" | "Physical" | "Festival"
}

export interface AwardInfo {
  id: string
  name: string
  year: number
  category: string
  status: "Winner" | "Nominee"
}

export interface TriviaItem {
  id: string
  question: string
  category: string // Using TriviaCategory type below
  answer: string
  explanation?: string
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  category: string // Using TimelineEventCategory type below
  mediaUrl?: string
}

export interface Movie {
  id: string
  title: string
  originalTitle?: string
  poster?: string // URL
  backdrop?: string // URL
  sidduScore?: number // 0-100
  releaseDate?: string // YYYY-MM-DD (Primary release date)
  status: MovieStatus
  genres: MovieGenre[]
  synopsis?: string
  runtime?: number // in minutes
  languages?: MovieLanguage[]
  certification?: MovieCertification

  cast?: CastMember[]
  crew?: CrewMember[]

  galleryImages?: string[] // URLs
  trailerUrl?: string // YouTube, Vimeo link
  trailerEmbed?: string // HTML embed code for trailer

  streamingLinks?: StreamingPlatformLink[]
  releaseDates?: ReleaseDateInfo[] // For multiple regional/type releases
  awards?: AwardInfo[]
  trivia?: TriviaItem[]
  timelineEvents?: TimelineEvent[]

  isPublished: boolean
  isArchived: boolean

  budget?: number
  boxOffice?: number
  productionCompanies?: string[]
  countriesOfOrigin?: string[]
  tagline?: string
  keywords?: string[]

  aspectRatio?: string
  soundMix?: string[]
  camera?: string

  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  importedFrom?: "TMDB" | "OMDB" | "JSON" | "Manual"
}

export interface MovieFiltersState {
  genre: MovieGenre | "all" | ""
  status: MovieStatus | "all" | ""
  year: string | "all" | "" // Year as string or "all"
}

export const STREAMING_PROVIDERS = [
  "Netflix",
  "Amazon Prime Video",
  "Disney+",
  "HBO Max",
  "Hulu",
  "Apple TV+",
  "YouTube Movies",
  "Google Play Movies",
  "Vudu",
  "JioCinema",
] as const

export const STREAMING_REGIONS = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
] as const

export const STREAMING_TYPES = ["subscription", "rent", "buy"] as const
export const STREAMING_QUALITIES = ["SD", "HD", "4K"] as const
export const RELEASE_TYPES = ["Theatrical", "Digital", "Physical", "Premiere"] as const

export const MOCK_AWARDS_POOL = [
  { id: "award-1", name: "Academy Awards", defaultCategory: "Best Picture" },
  { id: "award-2", name: "Golden Globe Awards", defaultCategory: "Best Motion Picture - Drama" },
  { id: "award-3", name: "BAFTA Awards", defaultCategory: "Best Film" },
  { id: "award-4", name: "Cannes Film Festival", defaultCategory: "Palme d'Or" },
  { id: "award-5", name: "Filmfare Awards", defaultCategory: "Best Film" },
]

export const MOCK_TALENT_POOL = [
  { id: "talent-1", name: "Leonardo DiCaprio", image: "/leonardo-dicaprio.png" },
  { id: "talent-2", name: "Christopher Nolan", image: "/christopher-nolan.png" },
  { id: "talent-3", name: "Cillian Murphy", image: "/cillian-murphy-portrait.png" },
  { id: "talent-4", name: "Emma Thomas", image: "/emma-thomas.png" },
  { id: "talent-5", name: "Tom Hardy", image: "/tom-hardy.png" },
  { id: "talent-6", name: "Margot Robbie", image: "/user-avatar-1.png" },
  { id: "talent-7", name: "Hans Zimmer", image: "/hans-zimmer-portrait.png" },
]

export const MOCK_TRIVIA_CATEGORIES = [
  "Behind the Scenes",
  "Continuity Error",
  "Cameo",
  "Production Detail",
  "Cultural Reference",
  "Goofs",
] as const
export type TriviaCategory = (typeof MOCK_TRIVIA_CATEGORIES)[number]

export const MOCK_TIMELINE_EVENT_CATEGORIES = [
  "Production Start",
  "Casting Announcement",
  "Trailer Release",
  "Premiere",
  "Box Office Milestone",
  "Award Win",
  "Controversy",
] as const
export type TimelineEventCategory = (typeof MOCK_TIMELINE_EVENT_CATEGORIES)[number]
