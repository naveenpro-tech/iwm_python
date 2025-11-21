export type FilterType = "latest" | "popular" | "following" | "trending"

export interface PulseType {
  id: string
  userId: string
  userInfo: {
    username: string
    displayName: string
    avatarUrl: string
    isVerified: boolean
    verificationLevel?: "basic" | "industry" | "celebrity"
    isFollowing?: boolean
  }
  content: {
    text: string
    media?: Array<{
      type: string
      url: string
      thumbnailUrl?: string
    }>
    linkedContent?: {
      type: "movie" | "cricket"
      id: string
      title: string
      posterUrl?: string
    }
    hashtags: string[]
  }
  engagement: {
    reactions: {
      love: number
      fire: number
      mindblown: number
      laugh: number
      sad: number
      angry: number
      total: number
      [key: string]: number
    }
    comments: number
    shares: number
    userReaction?: string
    hasCommented: boolean
    hasShared: boolean
    hasBookmarked: boolean
  }
  timestamp: string
  editedAt?: string
}
