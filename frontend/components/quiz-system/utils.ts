import type { Quiz, UserQuizAttempt } from "./types"

// Mock data for user quiz attempts
const mockUserAttempts: Record<string, Record<string, UserQuizAttempt[]>> = {
  "user-1": {
    "quiz-1": [
      {
        id: "attempt-1",
        quizId: "quiz-1",
        userId: "user-1",
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 minutes later
        score: 85,
        passed: true,
        answers: [],
      },
    ],
    "quiz-2": [
      {
        id: "attempt-2",
        quizId: "quiz-2",
        userId: "user-1",
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(), // 12 minutes later
        score: 40,
        passed: false,
        answers: [],
      },
      {
        id: "attempt-3",
        quizId: "quiz-2",
        userId: "user-1",
        attemptNumber: 2,
        startedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
        completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(), // 10 minutes later
        score: 60,
        passed: false,
        answers: [],
      },
    ],
  },
}

// Mock quizzes data
const mockQuizzes: Record<string, Quiz> = {
  "quiz-1": {
    id: "quiz-1",
    title: "Inception Knowledge Test",
    description:
      "Test your knowledge of Christopher Nolan's mind-bending masterpiece. This quiz will challenge your understanding of the film's complex narrative, characters, and themes.",
    movieId: "movie-1",
    movieTitle: "Inception",
    movieReleaseDate: "2010-07-16",
    moviePosterUrl: "/inception-movie-poster.png",
    numberOfQuestions: 10,
    timeLimit: 15 * 60, // 15 minutes in seconds
    passScore: 70,
    isVerificationRequired: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
    questions: [],
  },
  "quiz-2": {
    id: "quiz-2",
    title: "Interstellar Cosmic Quiz",
    description:
      "Explore the depths of your knowledge about Christopher Nolan's space epic. This quiz covers the science, characters, and emotional journey of the film.",
    movieId: "movie-2",
    movieTitle: "Interstellar",
    movieReleaseDate: "2014-11-07",
    moviePosterUrl: "/interstellar-poster.png",
    numberOfQuestions: 12,
    timeLimit: 18 * 60, // 18 minutes in seconds
    passScore: 75,
    isVerificationRequired: true,
    createdAt: "2023-02-20T00:00:00Z",
    updatedAt: "2023-02-20T00:00:00Z",
    questions: [],
  },
  "quiz-3": {
    id: "quiz-3",
    title: "The Dark Knight Trivia Challenge",
    description:
      "Test your knowledge of Christopher Nolan's iconic Batman film. This quiz will challenge your understanding of Gotham's heroes and villains.",
    movieId: "movie-3",
    movieTitle: "The Dark Knight",
    movieReleaseDate: "2008-07-18",
    moviePosterUrl: "/dark-knight-poster.png",
    numberOfQuestions: 15,
    timeLimit: 20 * 60, // 20 minutes in seconds
    passScore: 80,
    isVerificationRequired: false,
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
    questions: [],
  },
}

// Get quiz by ID
export function getQuizById(quizId: string): Quiz | null {
  return mockQuizzes[quizId] || null
}

// Get user attempts for a specific quiz
export function getUserQuizAttempts(userId: string, quizId: string): UserQuizAttempt[] {
  if (!mockUserAttempts[userId] || !mockUserAttempts[userId][quizId]) {
    return []
  }

  return mockUserAttempts[userId][quizId].sort((a, b) => {
    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  })
}

// Get the next attempt number for a user on a specific quiz
export function getNextAttemptNumber(userId: string, quizId: string): number {
  // In a real app, this would query the database
  // For now, we'll just return a placeholder
  return 1
}

// Check if a user is in cooldown period for a quiz
export function getUserCooldownStatus(userId: string, quizId: string): { inCooldown: boolean; cooldownUntil?: Date } {
  const attempts = getUserQuizAttempts(userId, quizId)

  // If user has less than 2 attempts or has passed the quiz, no cooldown
  if (attempts.length < 2 || attempts.some((a) => a.passed)) {
    return { inCooldown: false }
  }

  // Sort attempts by date (newest first)
  const sortedAttempts = [...attempts].sort((a, b) => {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  })

  // If the user has at least 2 failed attempts
  if (sortedAttempts.length >= 2 && !sortedAttempts[0].passed && !sortedAttempts[1].passed) {
    // Calculate cooldown end date (7 days after the last attempt)
    const lastAttemptDate = new Date(sortedAttempts[0].completedAt)
    const cooldownEndDate = new Date(lastAttemptDate)
    cooldownEndDate.setDate(cooldownEndDate.getDate() + 7)

    // Check if cooldown period is still active
    if (cooldownEndDate > new Date()) {
      return {
        inCooldown: true,
        cooldownUntil: cooldownEndDate,
      }
    }
  }

  return { inCooldown: false }
}

// Check if verification should be bypassed for a quiz
export function shouldBypassQuizVerification(quizId: string, movieId: string): boolean {
  const quiz = getQuizById(quizId)

  // If quiz doesn't require verification
  if (quiz && !quiz.isVerificationRequired) {
    return true
  }

  // If movie was released more than 25 days ago
  if (quiz) {
    const releaseDate = new Date(quiz.movieReleaseDate)
    const currentDate = new Date()
    const daysSinceRelease = Math.floor((currentDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceRelease > 25) {
      return true
    }
  }

  return false
}

// Format a date string to a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format time remaining in seconds to MM:SS format
export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Calculate the cooldown time remaining in seconds
export function getCooldownTimeRemaining(lastAttemptTime: string, cooldownHours: number): number {
  const lastAttempt = new Date(lastAttemptTime).getTime()
  const cooldownMs = cooldownHours * 60 * 60 * 1000
  const now = Date.now()

  const timeElapsed = now - lastAttempt
  const timeRemaining = cooldownMs - timeElapsed

  return Math.max(0, Math.floor(timeRemaining / 1000))
}

// Calculate time spent in a readable format
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
}

// Get all available quizzes
export function getQuizzes(): Quiz[] {
  return Object.values(mockQuizzes)
}

// Get a specific quiz attempt by ID
export function getUserQuizAttempt(userId: string, quizId: string, attemptId: string): UserQuizAttempt | null {
  const attempts = getUserQuizAttempts(userId, quizId)
  return attempts.find((attempt) => attempt.id === attemptId) || null
}

// Check if a user has passed a specific quiz
export function hasPassedQuiz(userId: string, quizId: string): boolean {
  const attempts = getUserQuizAttempts(userId, quizId)
  return attempts.some((attempt) => attempt.passed)
}
