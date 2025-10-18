"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Award, Eye, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Quiz } from "../types"

interface QuizPreviewModalProps {
  quiz: Quiz
}

export function QuizPreviewModal({ quiz }: QuizPreviewModalProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({})
  const [showResults, setShowResults] = useState(false)

  // Limit to the number of questions specified in the quiz settings
  const questions = quiz.questions.slice(0, quiz.numberOfQuestions || 10)
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (questionId: string, optionId: string, isMultiple: boolean) => {
    setUserAnswers((prev) => {
      const updatedAnswers = { ...prev }

      if (isMultiple) {
        // For multiple choice, toggle the selection
        if (updatedAnswers[questionId]?.includes(optionId)) {
          updatedAnswers[questionId] = updatedAnswers[questionId].filter((id) => id !== optionId)
        } else {
          updatedAnswers[questionId] = [...(updatedAnswers[questionId] || []), optionId]
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
    } else {
      setShowResults(true)
    }
  }

  const handleBackToQuiz = () => {
    setShowResults(false)
  }

  const handleBackToEditor = () => {
    router.push(`/admin/quizzes/${quiz.id}`)
  }

  const calculateScore = () => {
    let correctCount = 0

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id] || []
      const correctOptionIds = question.options?.filter((option) => option.isCorrect).map((option) => option.id) || []

      // For single answer questions
      if (question.type === "single" || question.type === "true-false") {
        if (userAnswer.length === 1 && correctOptionIds.includes(userAnswer[0])) {
          correctCount++
        }
      }
      // For multiple answer questions
      else if (question.type === "multiple") {
        // Must have selected all correct options and no incorrect ones
        if (userAnswer.length === correctOptionIds.length && correctOptionIds.every((id) => userAnswer.includes(id))) {
          correctCount++
        }
      }
    })

    return Math.round((correctCount / questions.length) * 100)
  }

  const score = calculateScore()
  const passed = score >= (quiz.passScore || 70)

  if (showResults) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" onClick={handleBackToQuiz} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Quiz
          </Button>
          <h1 className="text-3xl font-bold">Quiz Results (Preview)</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={quiz.moviePosterUrl || "/placeholder.svg"}
                  alt={quiz.movieTitle}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    passed ? "bg-green-900/70" : "bg-red-900/70"
                  }`}
                >
                  {passed ? (
                    <CheckCircle className="h-16 w-16 text-green-400" />
                  ) : (
                    <X className="h-16 w-16 text-red-400" />
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
                      <span className={`font-bold ${passed ? "text-green-400" : "text-red-400"}`}>{score}%</span>
                    </div>
                    <Progress
                      value={score}
                      className="h-2 bg-gray-700"
                      indicatorClassName={passed ? "bg-green-500" : "bg-red-500"}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>Pass: {quiz.passScore}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    {passed ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Passed</Badge>
                    ) : (
                      <Badge className="bg-red-600 hover:bg-red-700">Failed</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Questions</span>
                    <span className="text-gray-200">{questions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Preview Results</h2>
                <p className="text-gray-300 mb-6">
                  This is a preview of what users will see after completing the quiz.
                </p>

                <div className="space-y-4">
                  {passed ? (
                    <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-green-300">Verification Successful</h3>
                          <p className="text-green-200 text-sm mt-1">
                            Users who pass the quiz will be able to leave verified reviews for this movie.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-900/30 border border-red-600 rounded-lg p-4">
                      <div className="flex items-start">
                        <X className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-300">Verification Failed</h3>
                          <p className="text-red-200 text-sm mt-1">
                            Users who fail the quiz will need to try again to leave verified reviews.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBackToQuiz}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quiz
              </Button>

              <Button onClick={handleBackToEditor} className="bg-purple-600 hover:bg-purple-700">
                <Eye className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" onClick={handleBackToEditor} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Editor
        </Button>
        <h1 className="text-3xl font-bold">Quiz Preview</h1>
      </div>

      <div className="mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-300 mb-4">{quiz.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-gray-700 text-gray-300">
                {quiz.numberOfQuestions} Questions
              </Badge>
              {quiz.timeLimit && (
                <Badge variant="outline" className="bg-gray-700 text-gray-300">
                  {Math.floor(quiz.timeLimit / 60)} min
                </Badge>
              )}
              <Badge variant="outline" className="bg-gray-700 text-gray-300">
                {quiz.passScore}% to Pass
              </Badge>
            </div>

            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>This is a preview of how users will see your quiz.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2 bg-gray-700" />
        </div>
      </div>

      <motion.div
        key={currentQuestion?.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">{currentQuestion?.text}</h2>
              {currentQuestion?.imageUrl && (
                <div className="mb-4">
                  <img
                    src={currentQuestion.imageUrl || "/placeholder.svg"}
                    alt="Question visual"
                    className="rounded-lg max-h-64 w-auto mx-auto"
                  />
                </div>
              )}
              {currentQuestion?.hint && (
                <div className="bg-gray-700 p-3 rounded-lg flex items-start mt-3">
                  <Award className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">{currentQuestion.hint}</p>
                </div>
              )}
            </div>

            {currentQuestion?.type === "multiple" ? (
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
                value={userAnswers[currentQuestion?.id]?.[0] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion?.id, value, false)}
                className="space-y-3"
              >
                {currentQuestion?.options?.map((option) => (
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

      <div className="flex justify-between">
        <Button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </Button>

        <Button onClick={handleNextQuestion} className="bg-purple-600 hover:bg-purple-700">
          {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
        </Button>
      </div>
    </div>
  )
}
