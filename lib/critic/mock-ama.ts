/**
 * Mock AMA (Ask Me Anything) Data Generator for Critic Profiles
 * 
 * Generates Q&A data for critic profiles including:
 * - Questions from followers
 * - Upvote counts
 * - Answers from critics
 * - Timestamps
 */

export interface AMAAnswer {
  text: string
  answeredAt: string
}

export interface AMAQuestion {
  id: string
  text: string
  upvotes: number
  isUpvoted: boolean
  askedBy: string
  askedByAvatar: string | null
  askedAt: string
  answer: AMAAnswer | null
}

export interface AMAData {
  questions: AMAQuestion[]
  totalQuestions: number
  answeredQuestions: number
}

/**
 * Generate mock AMA questions for a critic
 */
export function generateMockAMA(criticUsername: string): AMAData {
  const questions: AMAQuestion[] = [
    {
      id: 'q1',
      text: "What's your favorite movie of all time and why?",
      upvotes: 142,
      isUpvoted: false,
      askedBy: 'moviebuff_2024',
      askedByAvatar: null,
      askedAt: '2025-10-15T10:30:00Z',
      answer: {
        text: "Inception (2010) - It completely changed how I think about storytelling in cinema. The way Nolan layers dreams within dreams while maintaining emotional coherence is masterful. Every rewatch reveals new details I missed before.",
        answeredAt: '2025-10-16T14:20:00Z',
      },
    },
    {
      id: 'q2',
      text: 'How do you approach reviewing a movie you know will be controversial?',
      upvotes: 98,
      isUpvoted: true,
      askedBy: 'cinephile_jane',
      askedByAvatar: null,
      askedAt: '2025-10-14T16:45:00Z',
      answer: {
        text: "I try to separate my personal biases from the technical and artistic merits of the film. I always ask: 'What is this film trying to achieve?' and 'Does it succeed on its own terms?' Controversy shouldn't cloud objective analysis.",
        answeredAt: '2025-10-15T09:10:00Z',
      },
    },
    {
      id: 'q3',
      text: 'What makes a great performance in your opinion?',
      upvotes: 87,
      isUpvoted: false,
      askedBy: 'actor_aspirant',
      askedByAvatar: null,
      askedAt: '2025-10-13T12:20:00Z',
      answer: {
        text: "Authenticity and transformation. The best performances make you forget you're watching an actor. They inhabit the character so completely that every gesture, every pause feels real. Technical skill matters, but emotional truth is paramount.",
        answeredAt: '2025-10-14T11:30:00Z',
      },
    },
    {
      id: 'q4',
      text: 'Do you think streaming platforms are hurting or helping cinema?',
      upvotes: 76,
      isUpvoted: false,
      askedBy: 'film_student_23',
      askedByAvatar: null,
      askedAt: '2025-10-12T09:15:00Z',
      answer: {
        text: "Both. They're democratizing access to diverse films and giving opportunities to stories that wouldn't get theatrical releases. But they're also changing viewing habits in ways that might diminish the communal theater experience. It's a complex evolution.",
        answeredAt: '2025-10-13T15:45:00Z',
      },
    },
    {
      id: 'q5',
      text: 'How has your taste in movies evolved over the years?',
      upvotes: 65,
      isUpvoted: true,
      askedBy: 'retro_cinema',
      askedByAvatar: null,
      askedAt: '2025-10-11T14:30:00Z',
      answer: {
        text: "I've become more appreciative of slow cinema and films that prioritize atmosphere over plot. Early in my career, I valued spectacle. Now I'm drawn to subtlety, silence, and the spaces between dialogue. Patience has become my greatest asset as a critic.",
        answeredAt: '2025-10-12T10:20:00Z',
      },
    },
    {
      id: 'q6',
      text: 'What advice would you give to aspiring film critics?',
      upvotes: 54,
      isUpvoted: false,
      askedBy: 'future_critic',
      askedByAvatar: null,
      askedAt: '2025-10-10T11:00:00Z',
      answer: null,
    },
    {
      id: 'q7',
      text: 'How do you balance being critical while still appreciating the effort that goes into filmmaking?',
      upvotes: 48,
      isUpvoted: false,
      askedBy: 'filmmaker_mike',
      askedByAvatar: null,
      askedAt: '2025-10-09T16:20:00Z',
      answer: null,
    },
    {
      id: 'q8',
      text: "What's the most underrated film you've reviewed?",
      upvotes: 42,
      isUpvoted: true,
      askedBy: 'hidden_gems',
      askedByAvatar: null,
      askedAt: '2025-10-08T13:45:00Z',
      answer: null,
    },
    {
      id: 'q9',
      text: 'Do you ever change your opinion on a film after rewatching it years later?',
      upvotes: 39,
      isUpvoted: false,
      askedBy: 'rewatch_enthusiast',
      askedByAvatar: null,
      askedAt: '2025-10-07T10:30:00Z',
      answer: null,
    },
    {
      id: 'q10',
      text: 'How important is cinematography compared to story in your reviews?',
      upvotes: 35,
      isUpvoted: false,
      askedBy: 'visual_storyteller',
      askedByAvatar: null,
      askedAt: '2025-10-06T15:10:00Z',
      answer: null,
    },
    {
      id: 'q11',
      text: 'What genre do you find most challenging to review?',
      upvotes: 31,
      isUpvoted: false,
      askedBy: 'genre_explorer',
      askedByAvatar: null,
      askedAt: '2025-10-05T12:00:00Z',
      answer: null,
    },
    {
      id: 'q12',
      text: 'Have you ever walked out of a movie? If so, which one?',
      upvotes: 28,
      isUpvoted: false,
      askedBy: 'curious_viewer',
      askedByAvatar: null,
      askedAt: '2025-10-04T09:25:00Z',
      answer: null,
    },
    {
      id: 'q13',
      text: 'How do you handle negative feedback on your reviews?',
      upvotes: 24,
      isUpvoted: false,
      askedBy: 'constructive_critic',
      askedByAvatar: null,
      askedAt: '2025-10-03T14:40:00Z',
      answer: null,
    },
    {
      id: 'q14',
      text: "What's your process for writing a review? Do you take notes during the film?",
      upvotes: 22,
      isUpvoted: false,
      askedBy: 'process_nerd',
      askedByAvatar: null,
      askedAt: '2025-10-02T11:15:00Z',
      answer: null,
    },
    {
      id: 'q15',
      text: 'Do you think AI will replace film critics in the future?',
      upvotes: 19,
      isUpvoted: false,
      askedBy: 'tech_futurist',
      askedByAvatar: null,
      askedAt: '2025-10-01T16:50:00Z',
      answer: null,
    },
  ]

  const answeredQuestions = questions.filter((q) => q.answer !== null).length

  return {
    questions,
    totalQuestions: questions.length,
    answeredQuestions,
  }
}

/**
 * Simulate upvoting a question (optimistic update)
 */
export function toggleUpvote(questionId: string, questions: AMAQuestion[]): AMAQuestion[] {
  return questions.map((q) => {
    if (q.id === questionId) {
      return {
        ...q,
        isUpvoted: !q.isUpvoted,
        upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
      }
    }
    return q
  })
}

/**
 * Simulate submitting a new question
 */
export function submitQuestion(text: string, questions: AMAQuestion[]): AMAQuestion[] {
  const newQuestion: AMAQuestion = {
    id: `q${Date.now()}`,
    text,
    upvotes: 0,
    isUpvoted: false,
    askedBy: 'current_user',
    askedByAvatar: null,
    askedAt: new Date().toISOString(),
    answer: null,
  }

  return [newQuestion, ...questions]
}

