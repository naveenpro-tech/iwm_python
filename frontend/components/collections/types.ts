export interface Collection {
  id: string
  title: string
  description: string
  creator: string
  movieCount: number
  followers: number
  posterImages: string[]
  isPublic?: boolean
  createdAt: string
  updatedAt?: string
  tags?: string[]
  movies?: Movie[]  // Added movies array
  // Computed/display fields
  curator?: string  // Alias for creator
  moviesCount?: number  // Alias for movieCount
  likesCount?: number  // Alias for followers
  lastUpdated?: string  // Alias for updatedAt
  isOfficial?: boolean
  isPrivate?: boolean
}

export interface Movie {
  id: string
  title: string
  year: number | null
  poster: string
  rating: number | null
  genres: string[]
}
