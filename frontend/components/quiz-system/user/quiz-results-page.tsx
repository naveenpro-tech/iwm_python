"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ArrowRight, Trophy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Quiz, UserQuizAttempt, Question } from "../types"
import { getUserQuizAttempt, getUserCooldownStatus } from "../utils"

interface QuizResultsPageProps {
  quiz: Quiz
  userId: string
  attemptId: string
}

export function QuizResultsPage({ quiz, userId, attemptId }: QuizResultsPageProps) {
  const router = useRouter()
  const [attempt, setAttempt] = useState<UserQuizAttempt | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
  const [cooldown, setCooldown] = useState<{ inCooldown: boolean; cooldownUntil?: Date }>({
    inCooldown: false,
  })

  useEffect(() => {
    // Get the attempt data
    const attemptData = getUserQuizAttempt(userId, quiz.id, attemptId)
    setAttempt(attemptData)

    // Check cooldown status
    const cooldownStatus = getUserCooldownStatus(userId, quiz.id)
    setCooldown(cooldownStatus)
  }, [quiz, userId, attemptId])

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const getQuestionById = (questionId: string): Question | undefined => {
    return quiz.questions?.find((q) => q.id === questionId)
  }

  const handleRetakeQuiz = () => {
    router.push(`/quiz/${quiz.id}`)
  }

  const handleGoToMovie = () => {
    router.push(`/movies/${quiz.movieId}`)
  }

  const handleLeaveReview = () => {
    router.push(`/movies/${quiz.movieId}/review`)
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24"
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden mb-6">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={quiz.moviePosterUrl || "/placeholder.svg"}
                  alt={quiz.movieTitle}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    attempt.passed ? "bg-green-900/70" : "bg-red-900/70"
                  }`}
                >
                  {attempt.passed ? (
                    <Trophy className="h-16 w-16 text-yellow-400" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-400" />
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-1">{quiz.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{quiz.movieTitle}</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">Your Score</span>
                      <span className={`font-bold ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
                        {attempt.score}%
                      </span>
                    </div>
                    <Progress
                      value={attempt.score}
                      className="h-2 bg-gray-700"
                      indicatorClassName={attempt.passed ? "bg-green-500" : "bg-red-500"}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>Pass: {quiz.passScore}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    {attempt.passed ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Passed</Badge>
                    ) : (
                      <Badge className="bg-red-600 hover:bg-red-700">Failed</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Attempt</span>
                    <span className="text-gray-200">{attempt.attemptNumber} of 2</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Time Spent</span>
                    <span className="text-gray-200">
                      {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Date</span>
                    <span className="text-gray-200">{new Date(attempt.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {attempt.passed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="bg-green-900/30 border border-green-600">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-green-300">Verification Successful</h3>
                          <p className="text-green-200 text-sm mt-1">
                            You can now leave a verified review for this movie.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <>
                  {attempt.attemptNumber < 2 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Card className="bg-yellow-900/30 border border-yellow-600">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                            <div>
                              <h3 className="font-semibold text-yellow-300">One More Attempt Available</h3>
                              <p className="text-yellow-200 text-sm mt-1">
                                You have one more attempt to pass this quiz.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Card className="bg-red-900/30 border border-red-600">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                            <div>
                              <h3 className="font-semibold text-red-300">Verification Failed</h3>
                              <p className="text-red-200 text-sm mt-1">
                                You've used all your attempts. You can try again in 7 days.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
              <p className="text-gray-300">
                {attempt.passed
                  ? "Congratulations! You've passed the quiz."
                  : "You didn't pass this time. Review your answers below."}
              </p>
            </div>

            <div className="mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold">Question Summary</h2>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 border-gray-600 text-gray-300 hover:bg-gray-700 mr-2"
                        onClick={() => setExpandedQuestions([])}
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Collapse All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => setExpandedQuestions(attempt.answers.map((a) => a.questionId))}
                      >
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Expand All
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {attempt.answers.map((answer, index) => {
                      const question = getQuestionById(answer.questionId)
                      if (!question) return null

                      const isExpanded = expandedQuestions.includes(answer.questionId)

                      return (
                        <div
                          key={answer.questionId}
                          className={`border ${
                            answer.isCorrect ? "border-green-600" : "border-red-600"
                          } rounded-lg overflow-hidden`}
                        >
                          <div
                            className={`flex justify-between items-center p-4 cursor-pointer ${
                              answer.isCorrect ? "bg-green-900/20" : "bg-red-900/20"
                            }`}
                            onClick={() => toggleQuestion(answer.questionId)}
                          >
                            <div className="flex items-center">
                              {answer.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                              )}
                              <span className="font-medium">
                                Question {index + 1}:{" "}
                                {question.text.length > 60 ? `${question.text.substring(0, 60)}...` : question.text}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-4 bg-gray-800">
                              <p className="mb-4">{question.text}</p>

                              {question.imageUrl && (
                                <div className="mb-4">
                                  <img
                                    src={question.imageUrl || "/placeholder.svg"}
                                    alt="Question visual"
                                    className="rounded-lg max-h-48 w-auto mx-auto"
                                  />
                                </div>
                              )}

                              <div className="space-y-2 mb-4">
                                {question.options?.map((option) => {
                                  const isSelected = answer.selectedOptionIds.includes(option.id)
                                  const isCorrect = option.isCorrect

                                  let bgColor = "bg-gray-700"
                                  if (isSelected && isCorrect) bgColor = "bg-green-900/30"
                                  else if (isSelected && !isCorrect) bgColor = "bg-red-900/30"
                                  else if (!isSelected && isCorrect) bgColor = "bg-blue-900/30"

                                  return (
                                    <div key={option.id} className={`p-3 rounded-lg flex items-center ${bgColor}`}>
                                      {isSelected && isCorrect && (
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                      )}
                                      {isSelected && !isCorrect && (
                                        <XCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                      )}
                                      {!isSelected && isCorrect && (
                                        <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                      )}
                                      {!isSelected && !isCorrect && <div className="w-5 h-5 mr-3 flex-shrink-0" />}
                                      <span
                                        className={`${!isSelected && isCorrect ? "text-blue-300" : "text-gray-200"}`}
                                      >
                                        {option.text}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>

                              {question.explanation && (
                                <div className="bg-gray-700 p-3 rounded-lg">
                                  <h4 className="font-semibold mb-1">Explanation</h4>
                                  <p className="text-gray-300 text-sm">{question.explanation}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {attempt.passed ? (
                <>
                  <Button onClick={handleLeaveReview} className="bg-green-600 hover:bg-green-700">
                    Leave a Verified Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToMovie}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Back to Movie
                  </Button>
                </>
              ) : (
                <>
                  {attempt.attemptNumber < 2 && !cooldown.inCooldown ? (
                    <Button onClick={handleRetakeQuiz} className="bg-purple-600 hover:bg-purple-700">
                      Try Again
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleGoToMovie}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back to Movie
                    </Button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
