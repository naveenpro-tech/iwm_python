"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "../../types"

interface QuestionNavigatorProps {
  questions: QuizQuestion[]
  currentIndex: number
  answeredQuestions: string[]
  flaggedQuestions: Set<number>
  onQuestionClick: (index: number) => void
}

export function QuestionNavigator({
  questions,
  currentIndex,
  answeredQuestions,
  flaggedQuestions,
  onQuestionClick,
}: QuestionNavigatorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div className="flex flex-wrap gap-2" variants={containerVariants} initial="initial" animate="animate">
      {questions.map((question, index) => {
        const isAnswered = answeredQuestions.includes(question.id)
        const isFlagged = flaggedQuestions.has(index)
        const isCurrent = currentIndex === index

        return (
          <motion.div
            key={question.id}
            variants={itemVariants}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => onQuestionClick(index)}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative",
                isCurrent
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30 z-10"
                  : isAnswered
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300",
              )}
            >
              {index + 1}

              {/* Flagged indicator */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-gray-900"></span>
              )}

              {/* Current question indicator */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-400"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              )}
            </button>

            {/* Tooltip */}
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] bg-gray-900 text-white text-xs rounded-md shadow-lg p-2"
              >
                <div className="text-left">
                  <div className="font-medium truncate">{question.text}</div>
                  <div className="flex items-center mt-1 space-x-2">
                    {isAnswered && (
                      <span className="inline-flex items-center text-green-400 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                        Answered
                      </span>
                    )}
                    {isFlagged && (
                      <span className="inline-flex items-center text-yellow-400 text-[10px]">
                        <Flag className="w-2 h-2 mr-1" />
                        Flagged
                      </span>
                    )}
                    {!isAnswered && !isFlagged && (
                      <span className="inline-flex items-center text-gray-400 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1"></span>
                        Not answered
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
