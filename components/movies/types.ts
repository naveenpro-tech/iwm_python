export interface Movie {
  id: string
  title: string
  posterUrl?: string
  year?: string
  genres?: string[]
  sidduScore?: number
  popularity?: number
  director?: string
  cast?: string[]
  runtime?: string
  country?: string
  language?: string
  status?: string
  synopsis?: string
  streamingOptions?: {
    [region: string]: {
      id: string
      provider: string
      logoUrl: string
      type: "subscription" | "rent" | "buy" | "free"
      price?: string
      quality: "SD" | "HD" | "4K" | "8K"
      url: string
      verified: boolean
    }[]
  }
}
