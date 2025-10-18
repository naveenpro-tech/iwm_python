"use client"

import { motion } from "framer-motion"
import { QuestionNavigator } from "./question-navigator"
import type { QuizQuestion } from "../../types"

interface ProgressTrackingProps {
  currentQuestionIndex: number
  totalQuestions: number
  progress: number
  answeredQuestions: string[]
  flaggedQuestions: Set<number>
  onQuestionClick: (index: number) => void
  questions: QuizQuestion[]
}

export default function ProgressTracking({
  currentQuestionIndex,
  totalQuestions,
  progress,
  answeredQuestions,
  flaggedQuestions,
  onQuestionClick,
  questions,
}: ProgressTrackingProps) {
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: `${progress}%`,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 text-sm">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-gray-300 text-sm">{progress}% Complete</span>
      </div>

      <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
          style={{ width: `${progress}%` }}
          variants={progressVariants}
          initial="initial"
          animate="animate"
        />

        {/* Particle effects at progress edge */}
        {progress > 0 && progress < 100 && (
          <motion.div
            className="absolute top-0 h-full"
            style={{ left: `${progress}%` }}
            animate={{
              y: [-1, 1, -1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <div className="w-1 h-full bg-purple-300 rounded-full blur-[1px]" />
          </motion.div>
        )}
      </div>

      <div className="mt-4">
        <QuestionNavigator
          questions={questions}
          currentIndex={currentQuestionIndex}
          answeredQuestions={answeredQuestions}
          flaggedQuestions={flaggedQuestions}
          onQuestionClick={onQuestionClick}
        />
      </div>
    </motion.div>
  )
}
