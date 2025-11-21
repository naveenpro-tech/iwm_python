"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Clock, AlertCircle, ChevronLeft, ChevronRight, Flag, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Quiz, Question, UserQuizAttempt, QuizAnswer } from "../types"
import { getNextAttemptNumber, formatTimeRemaining } from "../utils"

interface QuizTakingInterfaceProps {
  quiz: Quiz
  userId: string
}

export default function QuizTakingInterface({ quiz, userId }: QuizTakingInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(quiz.timeLimit || null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isTimeoutDialogOpen, setIsTimeoutDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Prepare questions (randomize if needed)
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    // Initialize questions
    let quizQuestions = [...(quiz.questions || [])]

    // Limit to the number of questions specified in the quiz settings
    quizQuestions = quizQuestions.slice(0, quiz.numberOfQuestions || 10)

    // Randomize if needed
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

  const handleSubmitQuiz = () => {
    setIsSubmitDialogOpen(false)
    setIsSubmitting(true)

    // Calculate score
    const totalQuestions = questions.length
    let correctAnswers = 0

    const answers: QuizAnswer[] = questions.map((question) => {
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
    const passed = score >= (quiz.passScore || 70)

    // Create attempt object
    const attempt: UserQuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId,
      quizId: quiz.id,
      attemptNumber: getNextAttemptNumber(userId, quiz.id),
      startedAt: startTime.toISOString(),
      completedAt: new Date().toISOString(),
      timeSpent: Math.floor((Date.now() - startTime.getTime()) / 1000),
      score,
      passed,
      answers,
    }

    // In a real implementation, this would save to the database
    console.log("Quiz attempt:", attempt)

    // Navigate to results page
    setTimeout(() => {
      router.push(`/quiz/${quiz.id}/results?attemptId=${attempt.id}`)
    }, 1000)
  }

  const handleTimeoutSubmit = () => {
    setIsTimeoutDialogOpen(false)
    handleSubmitQuiz()
  }

  const areAnswersCorrect = (question: Question, userAnswer: string[]) => {
    if (!question.options) return false

    const correctOptionIds = question.options.filter((option) => option.isCorrect).map((option) => option.id)

    // For single answer questions
    if (question.type === "single" || question.type === "true-false") {
      return userAnswer.length === 1 && correctOptionIds.includes(userAnswer[0])
    }

    // For multiple answer questions
    if (question.type === "multiple") {
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
        <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{quiz.title}</h1>
            <p className="text-gray-400 mt-1">
              {quiz.movieTitle} • {questions.length} Questions
            </p>
          </div>

          {timeRemaining !== null && (
            <div className="mt-4 md:mt-0 flex items-center bg-gray-800 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span className={`font-mono font-medium ${timeRemaining < 60 ? "text-red-400" : "text-gray-200"}`}>
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-gray-300">{getProgressPercentage()}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 bg-gray-700" />

          <div className="flex flex-wrap gap-2 mt-4">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    currentQuestionIndex === index
                      ? "bg-purple-600 text-white"
                      : isQuestionAnswered(q.id)
                        ? "bg-gray-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{currentQuestion.text}</h2>
                {currentQuestion.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={currentQuestion.imageUrl || "/placeholder.svg"}
                      alt="Question visual"
                      className="rounded-lg max-h-64 w-auto mx-auto"
                    />
                  </div>
                )}
                {currentQuestion.hint && (
                  <div className="bg-gray-700 p-3 rounded-lg flex items-start mt-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">{currentQuestion.hint}</p>
                  </div>
                )}
              </div>

              {currentQuestion.type === "multiple" ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={userAnswers[currentQuestion.id]?.includes(option.id) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleAnswerChange(currentQuestion.id, option.id, true)
                          } else {
                            handleAnswerChange(currentQuestion.id, option.id, true)
                          }
                        }}
                        className="mt-1"
                      />
                      <Label htmlFor={option.id} className="text-gray-200 cursor-pointer flex-grow">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={userAnswers[currentQuestion.id]?.[0] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value, false)}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.id} id={option.id} className="text-purple-600" />
                      <Label htmlFor={option.id} className="text-gray-200 cursor-pointer flex-grow">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={() => setIsSubmitDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Flag className="h-4 w-4 mr-2" />
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="bg-purple-600 hover:bg-purple-700">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription className="text-gray-400">
              You've answered {Object.values(userAnswers).filter((a) => a.length > 0).length} out of {questions.length}{" "}
              questions.
              {Object.values(userAnswers).some((a) => a.length === 0) && " Some questions are still unanswered."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-4">Are you sure you want to submit your answers?</p>

            {Object.values(userAnswers).some((a) => a.length === 0) && (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  You have unanswered questions. You can review them before submitting.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmitQuiz} className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Time's Up!</DialogTitle>
            <DialogDescription className="text-gray-400">Your time for this quiz has expired.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p>Your answers will be submitted automatically.</p>
            <p className="mt-2 text-gray-400">
              You've answered {Object.values(userAnswers).filter((a) => a.length > 0).length} out of {questions.length}{" "}
              questions.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={handleTimeoutSubmit} className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
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
    </div>
  )
}
