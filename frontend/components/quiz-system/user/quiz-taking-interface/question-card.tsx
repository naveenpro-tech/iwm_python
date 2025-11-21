"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Flag, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "../../types"
import { ParticleBackground } from "./particle-background"

interface QuestionCardProps {
  question: QuizQuestion
  questionNumber: number
  selectedOptions: string[]
  onAnswerChange: (questionId: string, optionId: string, isMultiple: boolean) => void
  isFlagged: boolean
  onFlagQuestion: () => void
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedOptions,
  onAnswerChange,
  isFlagged,
  onFlagQuestion,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const isMultipleSelect = question.type === "multiple-select"

  // Animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const optionVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  const hintVariants = {
    initial: { opacity: 0, height: 0 },
    animate: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative mb-8"
      layout
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-b from-gray-800/80 to-gray-900/90 shadow-xl shadow-purple-900/10">
        <div className="absolute inset-0 overflow-hidden">
          <ParticleBackground />
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/20 via-purple-400/20 to-purple-600/20"></div>

        <CardContent className="p-6 md:p-8 relative z-10">
          {/* Question Header */}
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/30">
                {questionNumber}
              </div>
            </div>

            <motion.div variants={contentVariants} className="flex-grow">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white leading-tight">{question.text}</h2>

              <div className="flex items-center text-sm text-gray-400 space-x-4">
                <span className="inline-flex items-center">
                  <span
                    className={cn("w-2 h-2 rounded-full mr-2", isMultipleSelect ? "bg-purple-500" : "bg-blue-500")}
                  ></span>
                  {isMultipleSelect ? "Select all that apply" : "Select one answer"}
                </span>

                {question.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    {showHint ? "Hide hint" : "Show hint"}
                  </button>
                )}

                <button
                  onClick={onFlagQuestion}
                  className={cn(
                    "inline-flex items-center transition-colors",
                    isFlagged ? "text-yellow-500 hover:text-yellow-400" : "text-gray-500 hover:text-gray-400",
                  )}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {isFlagged ? "Flagged" : "Flag for review"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Hint */}
          <AnimatePresence>
            {showHint && question.hint && (
              <motion.div variants={hintVariants} initial="initial" animate="animate" exit="exit" className="mb-6">
                <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-4 flex items-start">
                  <HelpCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-purple-200 text-sm">{question.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Media */}
          {question.mediaUrl && (
            <motion.div
              variants={contentVariants}
              className="mb-6 rounded-lg overflow-hidden bg-gray-900/50 border border-gray-800"
            >
              <div className="relative aspect-video max-h-[300px] w-full flex items-center justify-center overflow-hidden">
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="w-10 h-10 border-4 border-t-purple-600 border-gray-700 rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={question.mediaUrl || "/placeholder.svg"}
                  alt="Question visual"
                  fill
                  className="object-contain"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
            </motion.div>
          )}

          {/* Question Options */}
          <div className="space-y-3 mt-6">
            {isMultipleSelect ? (
              // Multiple select options
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    custom={index}
                    variants={optionVariants}
                    className={cn(
                      "relative rounded-lg border border-gray-800 transition-all duration-200",
                      selectedOptions.includes(option.id)
                        ? "bg-purple-900/30 border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                        : "bg-gray-800/50 hover:bg-gray-800/80 hover:border-gray-700",
                    )}
                  >
                    <label className="flex items-start p-4 cursor-pointer w-full">
                      <div className="flex items-center h-5 mt-0.5">
                        <Checkbox
                          id={`option-${option.id}`}
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onAnswerChange(question.id, option.id, true)
                            } else {
                              onAnswerChange(question.id, option.id, true)
                            }
                          }}
                          className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-relaxed">
                        <label htmlFor={`option-${option.id}`} className="font-medium text-gray-200 cursor-pointer">
                          {option.text}
                        </label>
                      </div>
                    </label>

                    {/* Selection effect overlay */}
                    {selectedOptions.includes(option.id) && (
                      <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5"></div>
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-purple-700"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              // Single select options
              <RadioGroup
                value={selectedOptions[0] || ""}
                onValueChange={(value) => onAnswerChange(question.id, value, false)}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <motion.div
                    key={option.id}
                    custom={index}
                    variants={optionVariants}
                    className={cn(
                      "relative rounded-lg border border-gray-800 transition-all duration-200",
                      selectedOptions[0] === option.id
                        ? "bg-purple-900/30 border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                        : "bg-gray-800/50 hover:bg-gray-800/80 hover:border-gray-700",
                    )}
                  >
                    <label className="flex items-start p-4 cursor-pointer w-full">
                      <div className="flex items-center h-5 mt-0.5">
                        <RadioGroupItem
                          value={option.id}
                          id={`option-${option.id}`}
                          className="border-gray-600 text-purple-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-relaxed">
                        <label htmlFor={`option-${option.id}`} className="font-medium text-gray-200 cursor-pointer">
                          {option.text}
                        </label>
                      </div>
                    </label>

                    {/* Selection effect overlay */}
                    {selectedOptions[0] === option.id && (
                      <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5"></div>
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-purple-700"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </RadioGroup>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
