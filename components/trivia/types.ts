export interface Trivia {
  id: string
  content: string
  category: string
  source?: string
  submittedBy: string
  submittedDate: string
  verified: boolean
  spoiler: boolean
  upvotes: number
  downvotes: number
  userVote?: "up" | "down" | null
  mediaUrl?: string
  mediaType?: "image" | "video"
  isFavorited?: boolean
  tags?: string[]
}

export interface NewTriviaData {
  content: string
  category: string
  source: string
  isSpoiler: boolean
  movieId: string
  submittedDate: string
  mediaFile?: File | null // For mock handling
  tagsInput?: string // Comma-separated tags
}

export const triviaCategoriesList = [
  { value: "all", label: "All Categories" },
  { value: "production", label: "Production" },
  { value: "cast-crew", label: "Cast & Crew" },
  { value: "plot-details", label: "Plot Details" },
  { value: "mistakes-goofs", label: "Mistakes & Goofs" },
  { value: "easter-eggs-references", label: "Easter Eggs & References" },
  { value: "awards-recognition", label: "Awards & Recognition" },
  { value: "soundtrack-music", label: "Soundtrack & Music" },
  { value: "release-reception", label: "Release & Reception" },
  { value: "cultural-impact", label: "Cultural Impact" },
  { value: "other", label: "Other" },
]
