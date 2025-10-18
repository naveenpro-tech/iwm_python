"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { shouldBypassQuizVerification, hasPassedQuiz, formatDate } from "../utils"
import type { Quiz } from "../types"

interface VerificationBypassCheckerProps {
  movieId: string
  userId: string
  quizId?: string
}

export function VerificationBypassChecker({ movieId, userId, quizId }: VerificationBypassCheckerProps) {
  const router = useRouter()
  const [status, setStatus] = useState<{
    loading: boolean
    canBypass: boolean
    bypassReason?: "time" | "admin" | "passed"
    quiz?: Quiz
    releaseDate?: Date
    verificationEndDate?: Date
  }>({
    loading: true,
    canBypass: false,
  })

  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll simulate the check
    setTimeout(() => {
      const bypass = shouldBypassQuizVerification(quizId || "", movieId)

      // Mock quiz data
      const quiz: Quiz = {
        id: quizId || "quiz-1",
        title: "Inception Knowledge Quiz",
        description: "Test your knowledge of Christopher Nolan's mind-bending masterpiece",
        movieId: movieId,
        movieTitle: "Inception",
        moviePosterUrl: "/inception-movie-poster.png",
        movieReleaseDate: new Date("2010-07-16"),
        status: "published",
        passScore: 70,
        timeLimit: 600,
        numberOfQuestions: 10,
        isRandomized: true,
        isVerificationRequired: true,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const releaseDate = new Date(quiz.movieReleaseDate)
      const verificationEndDate = new Date(releaseDate)
      verificationEndDate.setDate(releaseDate.getDate() + 25)

      let bypassReason: "time" | "admin" | "passed" | undefined

      if (bypass) {
        const currentDate = new Date()
        if (currentDate > verificationEndDate) {
          bypassReason = "time"
        } else if (!quiz.isVerificationRequired) {
          bypassReason = "admin"
        }
      } else if (hasPassedQuiz(userId, quizId || "")) {
        bypassReason = "passed"
      }

      setStatus({
        loading: false,
        canBypass: bypass || hasPassedQuiz(userId, quizId || ""),
        bypassReason,
        quiz,
        releaseDate,
        verificationEndDate,
      })
    }, 1000)
  }, [movieId, userId, quizId])

  const handleTakeQuiz = () => {
    router.push(`/quiz/${status.quiz?.id}`)
  }

  const handleContinueToReview = () => {
    router.push(`/movies/${movieId}/review`)
  }

  if (status.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`border ${status.canBypass ? "border-green-600" : "border-yellow-600"}`}>
        <CardContent className="p-4">
          <div className="flex items-start">
            {status.canBypass ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-2">
                {status.canBypass ? "Verification Check Passed" : "Verification Required"}
              </h3>

              <p className="text-gray-300 mb-4">
                {status.bypassReason === "time" &&
                  "This movie was released more than 25 days ago, so verification is no longer required."}
                {status.bypassReason === "admin" && "The verification requirement has been disabled for this movie."}
                {status.bypassReason === "passed" && "You have already passed the verification quiz for this movie."}
                {!status.canBypass &&
                  "To leave a verified review for this movie, you need to pass a short knowledge quiz."}
              </p>

              {status.releaseDate && status.verificationEndDate && (
                <div className="bg-gray-800 p-3 rounded-lg mb-4 flex items-start">
                  <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p>Movie Release Date: {formatDate(status.releaseDate)}</p>
                    <p>Verification Required Until: {formatDate(status.verificationEndDate)}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {status.canBypass ? (
                  <>
                    <Button onClick={handleContinueToReview} className="bg-green-600 hover:bg-green-700">
                      Continue to Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {status.bypassReason !== "passed" && (
                      <Button
                        variant="outline"
                        onClick={handleTakeQuiz}
                        className="border-purple-500 text-purple-400 hover:bg-purple-900 hover:text-purple-200"
                      >
                        Take Quiz Anyway
                      </Button>
                    )}
                  </>
                ) : (
                  <Button onClick={handleTakeQuiz} className="bg-purple-600 hover:bg-purple-700">
                    Take Verification Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
