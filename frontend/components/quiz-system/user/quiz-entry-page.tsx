"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, Info, Clock, Award, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Quiz, UserQuizAttempt } from "../types"
import {
  getUserQuizAttempts,
  getUserCooldownStatus,
  getNextAttemptNumber,
  shouldBypassQuizVerification,
  formatDate,
} from "../utils"

interface QuizEntryPageProps {
  quiz: Quiz
  userId: string
}

export function QuizEntryPage({ quiz, userId }: QuizEntryPageProps) {
  const router = useRouter()
  const [attempts, setAttempts] = useState<UserQuizAttempt[]>([])
  const [cooldown, setCooldown] = useState<{ inCooldown: boolean; cooldownUntil?: Date }>({
    inCooldown: false,
  })
  const [bypassVerification, setBypassVerification] = useState(false)
  const [bypassReason, setBypassReason] = useState<"admin" | "time" | null>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  useEffect(() => {
    // Get user attempts for this quiz
    const userAttempts = getUserQuizAttempts(userId, quiz.id)
    setAttempts(userAttempts)

    // Check cooldown status
    const cooldownStatus = getUserCooldownStatus(userId, quiz.id)
    setCooldown(cooldownStatus)

    // Check if verification should be bypassed
    const shouldBypass = shouldBypassQuizVerification(quiz.id, quiz.movieId)
    setBypassVerification(shouldBypass)

    // Determine bypass reason
    if (shouldBypass) {
      if (!quiz.isVerificationRequired) {
        setBypassReason("admin")
      } else {
        const releaseDate = new Date(quiz.movieReleaseDate)
        const currentDate = new Date()
        const daysSinceRelease = Math.floor((currentDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysSinceRelease > 25) {
          setBypassReason("time")
        }
      }
    } else {
      setBypassReason(null)
    }
  }, [quiz, userId])

  const handleStartQuiz = () => {
    router.push(`/quiz/${quiz.id}/take`)
  }

  const handleSkipToReview = () => {
    router.push(`/movies/${quiz.movieId}/review`)
  }

  const getAttemptStatusBadge = (attempt: UserQuizAttempt) => {
    if (attempt.passed) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
          Passed ({attempt.score}%)
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
          Failed ({attempt.score}%)
        </Badge>
      )
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const pulseAnimation = {
    initial: { scale: 1, boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)" },
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(139, 92, 246, 0.7)",
        "0 0 0 10px rgba(139, 92, 246, 0)",
        "0 0 0 0 rgba(139, 92, 246, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop" as const,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.7)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <motion.div variants={itemVariants} className="w-full md:w-1/3">
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <img
                  src={quiz.moviePosterUrl || "/placeholder.svg?height=450&width=300&query=movie poster"}
                  alt={quiz.movieTitle}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-200">Movie</h3>
                <p className="text-gray-300 font-medium">{quiz.movieTitle}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-200">Release Date</h3>
                <p className="text-gray-300">{formatDate(new Date(quiz.movieReleaseDate))}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-200">Quiz Details</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {quiz.numberOfQuestions} Questions
                  </Badge>
                  {quiz.timeLimit && (
                    <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.floor(quiz.timeLimit / 60)} min
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                    <Award className="w-3 h-3 mr-1" />
                    {quiz.passScore}% to Pass
                  </Badge>
                </div>
              </div>

              {bypassVerification && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-300">Verification Not Required</h3>
                          <p className="text-blue-200 text-sm mt-1">
                            {bypassReason === "admin"
                              ? "This quiz is not required for review verification."
                              : "This movie was released more than 25 days ago, so the quiz is no longer required for review verification."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        <div className="w-full md:w-2/3">
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {quiz.title}
            </motion.h1>
            <motion.p
              className="text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {quiz.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {quiz.isVerificationRequired && !bypassVerification ? (
                <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Required for Verification
                </Badge>
              ) : (
                <Badge variant="outline" className="border-purple-600 text-purple-400">
                  Optional for Verification
                </Badge>
              )}
            </motion.div>

            {!bypassVerification && (
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/abstract-purple-nebula.png')] opacity-10"></div>
                  <CardContent className="p-4 relative">
                    <h2 className="text-xl font-semibold mb-3 text-white">Verification Rules</h2>
                    <ul className="space-y-2 text-gray-300">
                      <motion.li
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <span className="text-purple-400 mr-2">•</span>
                        You must score at least {quiz.passScore}% to pass this quiz
                      </motion.li>
                      <motion.li
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="text-purple-400 mr-2">•</span>
                        You have 2 attempts to pass the quiz
                      </motion.li>
                      <motion.li
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span className="text-purple-400 mr-2">•</span>
                        After 2 failed attempts, you must wait 1 week before trying again
                      </motion.li>
                      <motion.li
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <span className="text-purple-400 mr-2">•</span>
                        Passing the quiz allows you to leave a verified review for this movie
                      </motion.li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {attempts.length > 0 && (
              <motion.div variants={itemVariants} className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-white">Your Attempts</h2>
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {attempts.map((attempt, index) => (
                        <motion.div
                          key={attempt.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex justify-between items-center border-b border-gray-700 pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-white">Attempt {attempt.attemptNumber}</span>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-gray-400 text-sm">
                                {new Date(attempt.startedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Score: {attempt.score}% ({Math.round((attempt.score / 100) * quiz.numberOfQuestions)}/
                              {quiz.numberOfQuestions})
                            </div>
                          </div>
                          {getAttemptStatusBadge(attempt)}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {cooldown.inCooldown && cooldown.cooldownUntil && (
              <motion.div variants={itemVariants} className="mb-6">
                <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-300">Cooldown Period Active</h3>
                        <p className="text-red-200 text-sm mt-1">
                          You've failed this quiz twice. You can try again after {formatDate(cooldown.cooldownUntil)}.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
              {bypassVerification ? (
                <>
                  <motion.div
                    initial="initial"
                    animate="pulse"
                    variants={pulseAnimation}
                    className="rounded-md overflow-hidden"
                  >
                    <motion.button
                      onClick={handleSkipToReview}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center w-full sm:w-auto"
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Proceed to Review
                    </motion.button>
                  </motion.div>
                  <motion.button
                    onClick={handleStartQuiz}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="border-purple-500 text-purple-400 hover:bg-purple-900/30 hover:text-purple-200 font-medium py-2 px-4 rounded-md border flex items-center justify-center"
                  >
                    Take Quiz Anyway
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial="initial"
                  animate="pulse"
                  variants={pulseAnimation}
                  className="rounded-md overflow-hidden"
                >
                  <motion.button
                    onClick={handleStartQuiz}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center w-full sm:w-auto"
                    disabled={cooldown.inCooldown}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                  >
                    {attempts.some((a) => a.passed) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Retake Quiz
                      </>
                    ) : (
                      <>
                        Start Quiz
                        {getNextAttemptNumber(userId, quiz.id) > 1 && (
                          <span className="ml-2">(Attempt {getNextAttemptNumber(userId, quiz.id)})</span>
                        )}
                      </>
                    )}
                    <AnimatePresence>
                      {isButtonHovered && (
                        <motion.span
                          className="absolute inset-0 bg-white opacity-10"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}

              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={() => router.push(`/movies/${quiz.movieId}`)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white font-medium py-2 px-4 rounded-md border flex items-center justify-center"
              >
                Back to Movie
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
