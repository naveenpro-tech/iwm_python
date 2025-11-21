"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import QuestionCard from "./question-card"
import CircularTimer from "./circular-timer"
import ProgressTracking from "./progress-tracking"
import NavigationControls from "./navigation-controls"

import type { Quiz, QuizQuestion, UserQuizAttempt, UserQuizAnswer } from "../../types"
import { useMediaQuery } from "@/hooks/use-mobile"

interface QuizTakingInterfaceProps {
  quiz: Quiz
  userId: string
  onComplete?: (attempt: UserQuizAttempt) => void
}

export default function QuizTakingInterface({ quiz, userId, onComplete }: QuizTakingInterfaceProps) {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(quiz.timeLimit ? quiz.timeLimit : null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isTimeoutDialogOpen, setIsTimeoutDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  // Initialize questions
  useEffect(() => {
    let quizQuestions = [...quiz.questions]

    // Randomize if needed (would be a quiz setting)
    if (quiz.isRandomized) {
      quizQuestions = [...quizQuestions].sort(() => Math.random() - 0.5)
    }

    setQuestions(quizQuestions)

    // Initialize user answers
    const initialAnswers: Record<string, string[]> = {}
    quizQuestions.forEach((q) => {
      initialAnswers[q.id] = []
    })
    setUserAnswers(initialAnswers)
  }, [quiz])

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null) return

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setIsTimeoutDialogOpen(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeRemaining])

  // Check if current question is answered when changing questions
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex]
      setHasAnsweredCurrent((userAnswers[currentQuestion.id]?.length || 0) > 0)
    }
  }, [currentQuestionIndex, questions, userAnswers])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, optionId: string, isMultiple: boolean) => {
    setUserAnswers((prev) => {
      const updatedAnswers = { ...prev }

      if (isMultiple) {
        // For multiple choice, toggle the selection
        if (updatedAnswers[questionId].includes(optionId)) {
          updatedAnswers[questionId] = updatedAnswers[questionId].filter((id) => id !== optionId)
        } else {
          updatedAnswers[questionId] = [...updatedAnswers[questionId], optionId]
        }
      } else {
        // For single choice, replace the selection
        updatedAnswers[questionId] = [optionId]
      }

      return updatedAnswers
    })

    setHasAnsweredCurrent(true)
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex)
      } else {
        newSet.add(currentQuestionIndex)
      }
      return newSet
    })
  }

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitQuiz = () => {
    setIsSubmitDialogOpen(false)
    setIsSubmitting(true)

    // Calculate score
    const totalQuestions = questions.length
    let correctAnswers = 0

    const answers: UserQuizAnswer[] = questions.map((question) => {
      const userAnswer = userAnswers[question.id] || []
      const isCorrect = areAnswersCorrect(question, userAnswer)

      if (isCorrect) correctAnswers++

      return {
        questionId: question.id,
        selectedOptionIds: userAnswer,
        isCorrect,
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= quiz.passScore

    // Create attempt object
    const attempt: UserQuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId,
      quizId: quiz.id,
      attemptNumber: 1, // This would be calculated based on previous attempts
      startedAt: startTime.toISOString(),
      completedAt: new Date().toISOString(),
      score,
      passed,
      answers,
    }

    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(attempt)
    }

    // Navigate to results page
    setTimeout(() => {
      router.push(`/quiz/${quiz.id}/results?attemptId=${attempt.id}`)
    }, 1000)
  }

  const handleTimeoutSubmit = () => {
    setIsTimeoutDialogOpen(false)
    handleSubmitQuiz()
  }

  const areAnswersCorrect = (question: QuizQuestion, userAnswer: string[]) => {
    const correctOptionIds = question.options.filter((option) => option.isCorrect).map((option) => option.id)

    // For single answer questions
    if (question.type === "multiple-choice" || question.type === "true-false") {
      return userAnswer.length === 1 && correctOptionIds.includes(userAnswer[0])
    }

    // For multiple answer questions
    if (question.type === "multiple-select") {
      // Must have selected all correct options and no incorrect ones
      return userAnswer.length === correctOptionIds.length && correctOptionIds.every((id) => userAnswer.includes(id))
    }

    return false
  }

  const isQuestionAnswered = (questionId: string) => {
    return (userAnswers[questionId]?.length || 0) > 0
  }

  const getProgressPercentage = () => {
    const answeredCount = Object.values(userAnswers).filter((answers) => answers.length > 0).length
    return Math.round((answeredCount / questions.length) * 100)
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="container mx-auto py-6 px-4 max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">
              {quiz.title}
            </h1>
            <p className="text-gray-400 mt-1">
              {quiz.movieTitle} • {questions.length} Questions
            </p>
          </div>

          {timeRemaining !== null && <CircularTimer timeRemaining={timeRemaining} totalTime={quiz.timeLimit || 0} />}
        </div>

        <ProgressTracking
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progress={getProgressPercentage()}
          answeredQuestions={Object.keys(userAnswers).filter((id) => userAnswers[id].length > 0)}
          flaggedQuestions={flaggedQuestions}
          onQuestionClick={handleJumpToQuestion}
          questions={questions}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedOptions={userAnswers[currentQuestion.id] || []}
          onAnswerChange={handleAnswerChange}
          isFlagged={flaggedQuestions.has(currentQuestionIndex)}
          onFlagQuestion={handleFlagQuestion}
        />
      </AnimatePresence>

      {/* Navigation Controls */}
      <NavigationControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        hasAnsweredCurrent={hasAnsweredCurrent}
        onPrevious={handlePrevQuestion}
        onNext={handleNextQuestion}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Submit Quiz?</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              You've answered {Object.values(userAnswers).filter((a) => a.length > 0).length} out of {questions.length}{" "}
              questions.
              {Object.values(userAnswers).some((a) => a.length === 0) && " Some questions are still unanswered."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4 text-center">Are you sure you want to submit your answers?</p>

            {Object.values(userAnswers).some((a) => a.length === 0) && (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-200 text-sm">
                  You have unanswered questions. You can review them before submitting.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setIsSubmitDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmitQuiz}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Quiz
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeout Dialog */}
      <Dialog open={isTimeoutDialogOpen} onOpenChange={setIsTimeoutDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Time's Up!</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Your time for this quiz has expired.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-center">Your answers will be submitted automatically.</p>
            <p className="mt-2 text-gray-400 text-center">
              You've answered {Object.values(userAnswers).filter((a) => a.length > 0).length} out of {questions.length}{" "}
              questions.
            </p>
          </div>

          <DialogFooter className="flex justify-center">
            <Button
              onClick={handleTimeoutSubmit}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Answers
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
