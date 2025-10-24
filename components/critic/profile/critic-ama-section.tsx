"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, MessageCircle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateMockAMA, toggleUpvote, submitQuestion } from "@/lib/critic/mock-ama"
import type { AMAQuestion } from "@/lib/critic/mock-ama"

interface CriticAMASectionProps {
  username: string
}

export default function CriticAMASection({ username }: CriticAMASectionProps) {
  const initialAMA = useMemo(() => generateMockAMA(username), [username])
  const [questions, setQuestions] = useState<AMAQuestion[]>(initialAMA.questions)
  const [newQuestion, setNewQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpvote = (questionId: string) => {
    setQuestions(toggleUpvote(questionId, questions))
  }

  const handleSubmitQuestion = async () => {
    if (newQuestion.trim().length < 10) {
      alert("Question must be at least 10 characters long")
      return
    }

    if (newQuestion.trim().length > 500) {
      alert("Question must be less than 500 characters")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setQuestions(submitQuestion(newQuestion, questions))
    setNewQuestion("")
    setIsSubmitting(false)
  }

  return (
    <Card className="bg-[#282828] border-[#3A3A3A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">Ask Me Anything</CardTitle>
        <p className="text-sm text-[#A0A0A0] font-dmsans mt-2">
          {initialAMA.answeredQuestions} of {initialAMA.totalQuestions} questions answered
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question Submission Form */}
        <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-3">Ask a Question</h3>
            <Textarea
              placeholder="What would you like to ask?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              maxLength={500}
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[#A0A0A0]">
                {newQuestion.length}/500 characters
              </span>
              <Button
                onClick={handleSubmitQuestion}
                disabled={isSubmitting || newQuestion.trim().length < 10}
                className="bg-[#00BFFF] hover:bg-[#00A8E8] text-[#1A1A1A]"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Upvote Button */}
                      <div className="flex flex-col items-center">
                        <motion.button
                          onClick={() => handleUpvote(question.id)}
                          className={`
                            p-2 rounded-full transition-all
                            ${
                              question.isUpvoted
                                ? "bg-[#00BFFF] text-[#1A1A1A]"
                                : "bg-[#282828] text-[#A0A0A0] hover:bg-[#3A3A3A]"
                            }
                          `}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          data-testid="upvote-btn"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </motion.button>
                        <motion.span
                          key={question.upvotes}
                          className="text-sm font-bold text-[#E0E0E0] mt-1 count"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          {question.upvotes}
                        </motion.span>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <p className="text-[#E0E0E0] font-dmsans leading-relaxed">{question.text}</p>

                        {/* Question Metadata */}
                        <div className="flex items-center gap-3 mt-3 text-xs text-[#A0A0A0]">
                          <span>Asked by @{question.askedBy}</span>
                          <span>•</span>
                          <span>
                            {new Date(question.askedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Answer */}
                        {question.answer && (
                          <motion.div
                            className="mt-4 p-4 bg-[#282828] border-l-4 border-[#00BFFF] rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="w-4 h-4 text-[#00BFFF]" />
                              <span className="text-sm font-semibold text-[#00BFFF]">Answer</span>
                            </div>
                            <p className="text-[#E0E0E0] font-dmsans leading-relaxed">{question.answer.text}</p>
                            <p className="text-xs text-[#A0A0A0] mt-2">
                              Answered on{" "}
                              {new Date(question.answer.answeredAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

