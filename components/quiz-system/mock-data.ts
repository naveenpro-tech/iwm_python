import type { MockData, Quiz, UserQuizAttempt } from "./types"

// Mock data for quizzes and user attempts
const mockData: MockData = {
  quizzes: {
    "quiz-inception": {
      id: "quiz-inception",
      title: "Inception: Dream Levels & Reality",
      description:
        "Test your knowledge about Christopher Nolan's mind-bending film Inception. This quiz covers dream levels, characters, and the film's ambiguous ending.",
      movieId: "movie-inception",
      movieTitle: "Inception",
      movieReleaseDate: "2010-07-16",
      moviePosterUrl: "/inception-movie-poster.png",
      numberOfQuestions: 5,
      timeLimit: 300, // 5 minutes
      passScore: 70,
      isVerificationRequired: true,
      createdAt: "2023-01-15T12:00:00Z",
      updatedAt: "2023-01-15T12:00:00Z",
      questions: [
        {
          id: "q1",
          quizId: "quiz-inception",
          text: "How many dream levels are explored in the main mission of Inception?",
          mediaUrl: "/inception-dream-levels.png",
          mediaType: "image",
          options: [
            { id: "q1-a", questionId: "q1", text: "2 levels", isCorrect: false, order: 0 },
            { id: "q1-b", questionId: "q1", text: "3 levels", isCorrect: false, order: 1 },
            { id: "q1-c", questionId: "q1", text: "4 levels", isCorrect: true, order: 2 },
            { id: "q1-d", questionId: "q1", text: "5 levels", isCorrect: false, order: 3 },
          ],
          explanation:
            "The team goes through 4 dream levels: the rainy city (Yusuf's dream), the hotel (Arthur's dream), the snow fortress (Eames' dream), and limbo (unconstructed dream space).",
          points: 10,
          order: 0,
          type: "multiple-choice",
        },
        {
          id: "q2",
          quizId: "quiz-inception",
          text: "Which character stays behind in the snow fortress dream level?",
          options: [
            { id: "q2-a", questionId: "q2", text: "Cobb", isCorrect: false, order: 0 },
            { id: "q2-b", questionId: "q2", text: "Arthur", isCorrect: false, order: 1 },
            { id: "q2-c", questionId: "q2", text: "Eames", isCorrect: true, order: 2 },
            { id: "q2-d", questionId: "q2", text: "Ariadne", isCorrect: false, order: 3 },
          ],
          hint: "This character is a forger who can impersonate others in dreams.",
          explanation:
            "Eames stays behind in the snow fortress to provide cover while the others go deeper into the dream.",
          points: 10,
          order: 1,
          type: "multiple-choice",
        },
        {
          id: "q3",
          quizId: "quiz-inception",
          text: "What is Cobb's totem, the object he uses to determine if he's in a dream?",
          options: [
            { id: "q3-a", questionId: "q3", text: "A loaded die", isCorrect: false, order: 0 },
            { id: "q3-b", questionId: "q3", text: "A spinning top", isCorrect: true, order: 1 },
            { id: "q3-c", questionId: "q3", text: "A chess piece", isCorrect: false, order: 2 },
            { id: "q3-d", questionId: "q3", text: "A poker chip", isCorrect: false, order: 3 },
          ],
          explanation:
            "Cobb uses a spinning top as his totem. If it keeps spinning indefinitely, he's in a dream. If it topples, he's in reality.",
          points: 10,
          order: 2,
          type: "multiple-choice",
        },
        {
          id: "q4",
          quizId: "quiz-inception",
          text: "Select all the characters who enter the limbo dream state during the movie.",
          options: [
            { id: "q4-a", questionId: "q4", text: "Cobb", isCorrect: true, order: 0 },
            { id: "q4-b", questionId: "q4", text: "Arthur", isCorrect: false, order: 1 },
            { id: "q4-c", questionId: "q4", text: "Ariadne", isCorrect: true, order: 2 },
            { id: "q4-d", questionId: "q4", text: "Saito", isCorrect: true, order: 3 },
            { id: "q4-e", questionId: "q4", text: "Fischer", isCorrect: true, order: 4 },
          ],
          explanation:
            "Cobb, Ariadne, Saito, and Fischer all enter limbo at different points in the movie. Arthur never enters limbo.",
          points: 20,
          order: 3,
          type: "multiple-select",
        },
        {
          id: "q5",
          quizId: "quiz-inception",
          text: "True or False: At the end of the movie, we see Cobb's totem stop spinning, confirming he is in reality.",
          options: [
            { id: "q5-a", questionId: "q5", text: "True", isCorrect: false, order: 0 },
            { id: "q5-b", questionId: "q5", text: "False", isCorrect: true, order: 1 },
          ],
          hint: "Think about the final shot of the film and what it shows (or doesn't show).",
          explanation:
            "False. The movie ends with Cobb's totem still spinning, cutting to black before we see if it topples, leaving the ending deliberately ambiguous.",
          points: 10,
          order: 4,
          type: "true-false",
        },
      ],
    },
    "quiz-interstellar": {
      id: "quiz-interstellar",
      title: "Interstellar: Space, Time & Gravity",
      description:
        "Test your knowledge about Christopher Nolan's epic space adventure Interstellar. This quiz covers the science, characters, and plot of the film.",
      movieId: "movie-interstellar",
      movieTitle: "Interstellar",
      movieReleaseDate: "2014-11-07",
      moviePosterUrl: "/interstellar-poster.png",
      numberOfQuestions: 5,
      timeLimit: 300, // 5 minutes
      passScore: 70,
      isVerificationRequired: true,
      createdAt: "2023-02-20T14:30:00Z",
      updatedAt: "2023-02-20T14:30:00Z",
      questions: [
        {
          id: "q1-int",
          quizId: "quiz-interstellar",
          text: "What is the name of the wormhole that the Endurance crew travels through?",
          options: [
            { id: "q1-int-a", questionId: "q1-int", text: "Gargantua", isCorrect: false, order: 0 },
            { id: "q1-int-b", questionId: "q1-int", text: "The Tesseract", isCorrect: false, order: 1 },
            { id: "q1-int-c", questionId: "q1-int", text: "The Saturn Anomaly", isCorrect: true, order: 2 },
            { id: "q1-int-d", questionId: "q1-int", text: "The Einstein-Rosen Bridge", isCorrect: false, order: 3 },
          ],
          explanation:
            "The wormhole is referred to as the Saturn Anomaly because it appeared near Saturn. Gargantua is the name of the black hole, not the wormhole.",
          points: 10,
          order: 0,
          type: "multiple-choice",
        },
        {
          id: "q2-int",
          quizId: "quiz-interstellar",
          text: "Which planet has the extreme time dilation due to its proximity to Gargantua?",
          options: [
            { id: "q2-int-a", questionId: "q2-int", text: "Mann's Planet", isCorrect: false, order: 0 },
            { id: "q2-int-b", questionId: "q2-int", text: "Edmunds' Planet", isCorrect: false, order: 1 },
            { id: "q2-int-c", questionId: "q2-int", text: "Miller's Planet", isCorrect: true, order: 2 },
            { id: "q2-int-d", questionId: "q2-int", text: "Cooper's Planet", isCorrect: false, order: 3 },
          ],
          hint: "On this planet, one hour equals seven years on Earth.",
          explanation:
            "Miller's Planet is so close to the black hole Gargantua that time dilation causes one hour on the surface to equal seven years on Earth.",
          points: 10,
          order: 1,
          type: "multiple-choice",
        },
        {
          id: "q3-int",
          quizId: "quiz-interstellar",
          text: "What does Cooper discover is the source of the 'ghost' in his daughter's bedroom?",
          options: [
            { id: "q3-int-a", questionId: "q3-int", text: "Aliens trying to communicate", isCorrect: false, order: 0 },
            {
              id: "q3-int-b",
              questionId: "q3-int",
              text: "A glitch in the space-time continuum",
              isCorrect: false,
              order: 1,
            },
            {
              id: "q3-int-c",
              questionId: "q3-int",
              text: "His future self communicating through gravity",
              isCorrect: true,
              order: 2,
            },
            {
              id: "q3-int-d",
              questionId: "q3-int",
              text: "NASA testing experimental technology",
              isCorrect: false,
              order: 3,
            },
          ],
          explanation:
            "Cooper discovers that he himself is the 'ghost', communicating with his daughter from the future through the tesseract, manipulating gravity to send messages.",
          points: 10,
          order: 2,
          type: "multiple-choice",
        },
        {
          id: "q4-int",
          quizId: "quiz-interstellar",
          text: "Select all the characters who survive until the end of the movie.",
          options: [
            { id: "q4-int-a", questionId: "q4-int", text: "Cooper", isCorrect: true, order: 0 },
            { id: "q4-int-b", questionId: "q4-int", text: "Dr. Mann", isCorrect: false, order: 1 },
            { id: "q4-int-c", questionId: "q4-int", text: "TARS", isCorrect: true, order: 2 },
            { id: "q4-int-d", questionId: "q4-int", text: "Romilly", isCorrect: false, order: 3 },
            { id: "q4-int-e", questionId: "q4-int", text: "Amelia Brand", isCorrect: true, order: 4 },
          ],
          explanation:
            "Cooper, TARS, and Amelia Brand survive. Dr. Mann dies during his attempted hijacking of the Endurance, and Romilly dies in an explosion on Mann's planet.",
          points: 20,
          order: 3,
          type: "multiple-select",
        },
        {
          id: "q5-int",
          quizId: "quiz-interstellar",
          text: "True or False: The 'They' who created the wormhole are revealed to be future humans.",
          options: [
            { id: "q5-int-a", questionId: "q5-int", text: "True", isCorrect: true, order: 0 },
            { id: "q5-int-b", questionId: "q5-int", text: "False", isCorrect: false, order: 1 },
          ],
          explanation:
            "True. It is revealed that 'They' are actually future humans who have evolved to exist in five dimensions, allowing them to manipulate time and gravity.",
          points: 10,
          order: 4,
          type: "true-false",
        },
      ],
    },
  },
  userAttempts: {
    "user-123": {
      "quiz-inception": [
        {
          id: "attempt-1",
          userId: "user-123",
          quizId: "quiz-inception",
          attemptNumber: 1,
          startedAt: "2023-03-10T15:30:00Z",
          completedAt: "2023-03-10T15:40:00Z",
          score: 60,
          passed: false,
          answers: [
            {
              questionId: "q1",
              selectedOptionIds: ["q1-c"],
              isCorrect: true,
            },
            {
              questionId: "q2",
              selectedOptionIds: ["q2-b"],
              isCorrect: false,
            },
            {
              questionId: "q3",
              selectedOptionIds: ["q3-b"],
              isCorrect: true,
            },
            {
              questionId: "q4",
              selectedOptionIds: ["q4-a", "q4-c", "q4-d"],
              isCorrect: false,
            },
            {
              questionId: "q5",
              selectedOptionIds: ["q5-a"],
              isCorrect: false,
            },
          ],
        },
      ],
    },
  },
}

// Helper functions to access mock data
export function getMockQuiz(quizId: string): Quiz | undefined {
  return mockData.quizzes[quizId]
}

export function getMockUserAttempts(userId: string, quizId: string): UserQuizAttempt[] {
  return mockData.userAttempts[userId]?.[quizId] || []
}

export function getNextAttemptNumber(userId: string, quizId: string): number {
  const attempts = getMockUserAttempts(userId, quizId)
  return attempts.length + 1
}

export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
