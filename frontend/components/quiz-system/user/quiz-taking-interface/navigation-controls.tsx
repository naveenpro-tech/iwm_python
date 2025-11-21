"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationControlsProps {
  currentQuestionIndex: number
  totalQuestions: number
  hasAnsweredCurrent: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function NavigationControls({
  currentQuestionIndex,
  totalQuestions,
  hasAnsweredCurrent,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationControlsProps) {
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
    disabled: {
      opacity: 0.5,
      scale: 1,
    },
  }

  return (
    <motion.div className="flex justify-between mt-8" variants={containerVariants} initial="initial" animate="animate">
      <motion.div
        variants={buttonVariants}
        whileHover={!isFirstQuestion ? "hover" : undefined}
        whileTap={!isFirstQuestion ? "tap" : undefined}
        animate={isFirstQuestion ? "disabled" : undefined}
      >
        <Button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 px-5 py-6"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
      </motion.div>

      <div className="flex gap-3">
        {isLastQuestion ? (
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              onClick={onSubmit}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-5 py-6"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Quiz
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={buttonVariants}
            whileHover={hasAnsweredCurrent ? "hover" : undefined}
            whileTap={hasAnsweredCurrent ? "tap" : undefined}
            animate={!hasAnsweredCurrent ? "disabled" : undefined}
          >
            <Button
              onClick={onNext}
              disabled={!hasAnsweredCurrent}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50 px-5 py-6"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
