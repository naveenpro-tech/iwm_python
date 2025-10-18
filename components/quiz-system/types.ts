// Quiz types
export interface Quiz {
  id: string
  title: string
  description: string
  movieId: string
  movieTitle: string
  movieReleaseDate: string
  moviePosterUrl?: string
  numberOfQuestions: number
  timeLimit?: number // in seconds
  passScore: number
  isVerificationRequired: boolean
  createdAt: string
  updatedAt: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  quizId: string
  text: string
  mediaUrl?: string
  mediaType?: "image" | "video" | "audio"
  options: QuizQuestionOption[]
  explanation?: string
  points: number
  order: number
  type: "multiple-choice" | "true-false" | "multiple-select"
}

export interface QuizQuestionOption {
  id: string
  questionId: string
  text: string
  isCorrect: boolean
  order: number
}

// User attempt types
export interface UserQuizAttempt {
  id: string
  quizId: string
  userId: string
  attemptNumber: number
  startedAt: string
  completedAt: string
  score: number
  passed: boolean
  answers: UserQuizAnswer[]
}

export interface UserQuizAnswer {
  questionId: string
  selectedOptionIds: string[]
  isCorrect: boolean
  timeSpent?: number // in seconds
}

// Mock data types
export interface MockData {
  quizzes: Record<string, Quiz>
  userAttempts: Record<string, Record<string, UserQuizAttempt[]>>
}
