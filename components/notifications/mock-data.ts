import type { Notification } from "./types"

// Helper function to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Helper function to create hours ago
const hoursAgo = (hours: number): Date => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date
}

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    type: "social",
    title: "New Connection Request",
    message: "Director Ava Chen has sent you a connection request.",
    timestamp: hoursAgo(2),
    isRead: false,
    actionUrl: "/connections/requests",
    metadata: {
      userId: "user-123",
      userName: "Ava Chen",
      userAvatar: "/placeholder.svg?height=50&width=50&query=professional headshot of female director",
    },
  },
  {
    id: "notif-002",
    type: "release",
    title: "New Film Release",
    message: '"The Last Horizon" is now available to watch on streaming platforms.',
    timestamp: hoursAgo(5),
    isRead: true,
    actionUrl: "/movies/the-last-horizon",
    metadata: {
      movieId: "movie-456",
      movieTitle: "The Last Horizon",
      moviePoster: "/placeholder.svg?height=100&width=70&query=sci-fi movie poster with space horizon",
    },
  },
  {
    id: "notif-003",
    type: "system",
    title: "Profile Verification Complete",
    message: "Your talent profile has been successfully verified. You now have access to all premium features.",
    timestamp: daysAgo(1),
    isRead: false,
    actionUrl: "/talent-hub/profile/me",
  },
  {
    id: "notif-004",
    type: "club",
    title: "New Discussion in Filmmakers Club",
    message: 'New topic: "The Future of Independent Cinema" has been started in your club.',
    timestamp: daysAgo(2),
    isRead: false,
    actionUrl: "/clubs/filmmakers/discussions/future-indie-cinema",
    metadata: {
      clubId: "club-789",
      clubName: "Filmmakers Club",
    },
  },
  {
    id: "notif-005",
    type: "quiz",
    title: "New Film Knowledge Quiz",
    message: 'Test your knowledge with our new quiz: "Classic Cinema Masterpieces"',
    timestamp: daysAgo(3),
    isRead: true,
    actionUrl: "/quiz/classic-cinema",
    metadata: {
      quizId: "quiz-101",
      quizTitle: "Classic Cinema Masterpieces",
    },
  },
  {
    id: "notif-006",
    type: "social",
    title: "Your Post Received Engagement",
    message: 'Your post about "Method Acting Techniques" has received 25 new likes and 8 comments.',
    timestamp: daysAgo(3),
    isRead: true,
    actionUrl: "/pulse/posts/method-acting",
  },
  {
    id: "notif-007",
    type: "release",
    title: "Upcoming Release Reminder",
    message: '"The Dark Path" will be released in theaters next week. You marked this film as interested.',
    timestamp: daysAgo(4),
    isRead: false,
    actionUrl: "/movies/the-dark-path",
    metadata: {
      movieId: "movie-789",
      movieTitle: "The Dark Path",
      moviePoster: "/placeholder.svg?height=100&width=70&query=dark thriller movie poster with forest path",
    },
  },
  {
    id: "notif-008",
    type: "system",
    title: "Security Alert",
    message: "New login detected from Mumbai, India. If this wasn't you, please secure your account.",
    timestamp: daysAgo(5),
    isRead: true,
    actionUrl: "/settings/security",
  },
  {
    id: "notif-009",
    type: "club",
    title: "Club Event Reminder",
    message: "Virtual Screenwriting Workshop starts in 2 days. Don't forget to prepare your script sample.",
    timestamp: daysAgo(5),
    isRead: false,
    actionUrl: "/clubs/events/screenwriting-workshop",
    metadata: {
      clubId: "club-456",
      clubName: "Screenwriters United",
    },
  },
  {
    id: "notif-010",
    type: "quiz",
    title: "Quiz Results Available",
    message: 'Your results for "Directors and Their Signature Styles" quiz are now available.',
    timestamp: daysAgo(6),
    isRead: true,
    actionUrl: "/quiz/directors-styles/results",
    metadata: {
      quizId: "quiz-202",
      quizTitle: "Directors and Their Signature Styles",
    },
  },
  {
    id: "notif-011",
    type: "social",
    title: "New Message",
    message: "You have a new message from Cinematographer Raj Patel regarding a potential project.",
    timestamp: daysAgo(7),
    isRead: false,
    actionUrl: "/messages/inbox/msg-303",
    metadata: {
      userId: "user-456",
      userName: "Raj Patel",
      userAvatar: "/placeholder.svg?height=50&width=50&query=professional headshot of male cinematographer",
    },
  },
  {
    id: "notif-012",
    type: "release",
    title: "New Trailer Released",
    message: 'The official trailer for "Eternal Echo" has just been released. Watch it now!',
    timestamp: daysAgo(8),
    isRead: true,
    actionUrl: "/movies/eternal-echo/trailer",
    metadata: {
      movieId: "movie-505",
      movieTitle: "Eternal Echo",
      moviePoster: "/placeholder.svg?height=100&width=70&query=dramatic romance movie poster with couple",
    },
  },
  {
    id: "notif-013",
    type: "system",
    title: "Account Upgrade Available",
    message: "You're eligible for a free upgrade to Siddu Pro. Unlock advanced features for your talent profile.",
    timestamp: daysAgo(9),
    isRead: false,
    actionUrl: "/settings/subscription",
  },
  {
    id: "notif-014",
    type: "club",
    title: "You've Been Made a Moderator",
    message: 'Congratulations! You are now a moderator of the "Visual Effects Artists" club.',
    timestamp: daysAgo(10),
    isRead: true,
    actionUrl: "/clubs/vfx-artists/settings",
    metadata: {
      clubId: "club-606",
      clubName: "Visual Effects Artists",
    },
  },
  {
    id: "notif-015",
    type: "quiz",
    title: "New Industry Knowledge Quiz",
    message: 'Test your knowledge with our new quiz: "Film Production Terminology"',
    timestamp: daysAgo(12),
    isRead: true,
    actionUrl: "/quiz/production-terminology",
    metadata: {
      quizId: "quiz-404",
      quizTitle: "Film Production Terminology",
    },
  },
  {
    id: "notif-016",
    type: "social",
    title: "Profile View Milestone",
    message: "Your talent profile has reached 500 views! Your visibility is growing.",
    timestamp: daysAgo(14),
    isRead: true,
    actionUrl: "/talent-hub/profile/me/analytics",
  },
  {
    id: "notif-017",
    type: "release",
    title: "Award Nomination",
    message: '"The Silent River", which you marked as a favorite, has been nominated for 5 International Film Awards.',
    timestamp: daysAgo(15),
    isRead: true,
    actionUrl: "/movies/the-silent-river/awards",
    metadata: {
      movieId: "movie-707",
      movieTitle: "The Silent River",
      moviePoster: "/placeholder.svg?height=100&width=70&query=dramatic river scene movie poster",
    },
  },
  {
    id: "notif-018",
    type: "system",
    title: "New Feature Available",
    message: "Siddu has launched a new Portfolio Showcase feature. Highlight your best work to potential employers.",
    timestamp: daysAgo(16),
    isRead: true,
    actionUrl: "/talent-hub/profile/me/portfolio",
  },
  {
    id: "notif-019",
    type: "club",
    title: "Club Milestone",
    message: '"International Filmmakers Network" has reached 10,000 members! Thanks for being part of our community.',
    timestamp: daysAgo(18),
    isRead: true,
    actionUrl: "/clubs/international-filmmakers",
    metadata: {
      clubId: "club-808",
      clubName: "International Filmmakers Network",
    },
  },
  {
    id: "notif-020",
    type: "quiz",
    title: "Weekly Challenge",
    message: "This week's filmmaker challenge: Create a 60-second story using only 5 shots.",
    timestamp: daysAgo(20),
    isRead: true,
    actionUrl: "/challenges/five-shot-story",
    metadata: {
      quizId: "challenge-505",
      quizTitle: "Five Shot Story Challenge",
    },
  },
]
