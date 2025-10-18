export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  metadata?: {
    userId?: string
    userName?: string
    userAvatar?: string
    movieId?: string
    movieTitle?: string
    moviePoster?: string
    clubId?: string
    clubName?: string
    quizId?: string
    quizTitle?: string
  }
}

export type NotificationType = "social" | "release" | "system" | "club" | "quiz"

export interface NotificationFilters {
  type: NotificationType | "all"
  readStatus: "all" | "read" | "unread"
  dateRange: "all" | "today" | "week" | "month"
}

export interface NotificationCounts {
  all: number
  social: number
  releases: number
  system: number
  clubs: number
  quizzes: number
}
