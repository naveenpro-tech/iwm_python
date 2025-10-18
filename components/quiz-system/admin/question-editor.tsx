"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash, Plus, ImageIcon, AlertCircle, Lightbulb, Info, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { Question } from "../types"

interface QuestionEditorProps {
  question?: Question
  questionNumber: number
  onSave: (question: Question) => void
  onDelete?: () => void
  isNew?: boolean
}

export function QuestionEditor({ question, questionNumber, onSave, onDelete, isNew = false }: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(!question || isNew)
  const [questionData, setQuestionData] = useState<Question>(
    question || {
      id: `question-${Date.now()}`,
      text: "",
      type: "single",
      options: [
        { id: `option-${Date.now()}-1`, text: "", isCorrect: false },
        { id: `option-${Date.now()}-2`, text: "", isCorrect: false },
      ],
    },
  )

  // When type changes to true-false, update options
  useEffect(() => {
    if (questionData.type === "true-false" && questionData.options?.length !== 2) {
      setQuestionData((prevQuestionData) => ({
        ...prevQuestionData,
        options: [
          { id: `option-${Date.now()}-1`, text: "True", isCorrect: false },
          { id: `option-${Date.now()}-2`, text: "False", isCorrect: false },
        ],
      }))
    }
  }, [questionData.type])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestionData({ ...questionData, text: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    setQuestionData({ ...questionData, type: value as "single" | "multiple" | "true-false" })
  }

  const handleOptionTextChange = (optionId: string, text: string) => {
    setQuestionData({
      ...questionData,
      options: questionData.options?.map((option) => (option.id === optionId ? { ...option, text } : option)),
    })
  }

  const handleOptionCorrectChange = (optionId: string, isCorrect: boolean) => {
    setQuestionData({
      ...questionData,
      options: questionData.options?.map((option) => {
        // For single choice and true-false, only one option can be correct
        if (questionData.type === "single" || questionData.type === "true-false") {
          return {
            ...option,
            isCorrect: option.id === optionId ? isCorrect : false,
          }
        }
        // For multiple choice, multiple options can be correct
        return option.id === optionId ? { ...option, isCorrect } : option
      }),
    })
  }

  const handleAddOption = () => {
    setQuestionData({
      ...questionData,
      options: [...(questionData.options || []), { id: `option-${Date.now()}`, text: "", isCorrect: false }],
    })
  }

  const handleRemoveOption = (optionId: string) => {
    setQuestionData({
      ...questionData,
      options: questionData.options?.filter((option) => option.id !== optionId),
    })
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionData({ ...questionData, imageUrl: e.target.value })
  }

  const handleHintChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionData({ ...questionData, hint: e.target.value })
  }

  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionData({ ...questionData, explanation: e.target.value })
  }

  const handleSave = () => {
    onSave(questionData)
    if (isNew) {
      // Reset form for new questions
      setQuestionData({
        id: `question-${Date.now()}`,
        text: "",
        type: "single",
        options: [
          { id: `option-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `option-${Date.now()}-2`, text: "", isCorrect: false },
        ],
      })
    } else {
      setIsExpanded(false)
    }
  }

  const isValid = () => {
    return (
      questionData.text.trim() !== "" &&
      questionData.options?.length >= 2 &&
      questionData.options.every((option) => option.text.trim() !== "") &&
      questionData.options.some((option) => option.isCorrect)
    )
  }

  return (
    <Card className={`border ${isNew ? "border-purple-500" : "border-gray-700"} bg-gray-800`}>
      <CardContent className="p-0">
        <div
          className={`p-4 flex justify-between items-center cursor-pointer ${
            isNew ? "bg-purple-900/20" : "bg-gray-700/50"
          }`}
          onClick={() => !isNew && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <span className="font-semibold text-lg mr-2">Question {questionNumber}</span>
            {!isExpanded && questionData.text && (
              <span className="text-gray-300 truncate max-w-md">{questionData.text}</span>
            )}
          </div>
          {!isNew && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-t border-gray-700"
          >
            <div className="space-y-6">
              <div>
                <Label htmlFor={`question-${questionNumber}-text`} className="text-gray-300 mb-2 block">
                  Question Text
                </Label>
                <Textarea
                  id={`question-${questionNumber}-text`}
                  value={questionData.text}
                  onChange={handleTextChange}
                  placeholder="Enter your question"
                  className="bg-gray-700 border-gray-600"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor={`question-${questionNumber}-type`} className="text-gray-300 mb-2 block">
                  Question Type
                </Label>
                <Select value={questionData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger id={`question-${questionNumber}-type`} className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Choice</SelectItem>
                    <SelectItem value="multiple">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-300">Answer Options</Label>
                  {questionData.type !== "true-false" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                      className="h-8 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {questionData.options?.map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-3 bg-gray-700 p-3 rounded-md">
                      {questionData.type === "multiple" ? (
                        <Checkbox
                          id={`option-${option.id}-correct`}
                          checked={option.isCorrect}
                          onCheckedChange={(checked) => handleOptionCorrectChange(option.id, !!checked)}
                          className="mt-1"
                        />
                      ) : (
                        <RadioGroup
                          value={questionData.options?.find((o) => o.isCorrect)?.id || ""}
                          onValueChange={(value) => handleOptionCorrectChange(value, true)}
                          className="flex"
                        >
                          <RadioGroupItem value={option.id} id={`option-${option.id}-correct`} className="mt-1" />
                        </RadioGroup>
                      )}

                      <div className="flex-grow">
                        {questionData.type === "true-false" ? (
                          <Label htmlFor={`option-${option.id}-correct`} className="text-gray-200 cursor-pointer">
                            {option.text}
                          </Label>
                        ) : (
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="bg-gray-600 border-gray-500"
                          />
                        )}
                      </div>

                      {questionData.type !== "true-false" && questionData.options!.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(option.id)}
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-600"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove option</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {questionData.type === "multiple" && (
                  <p className="text-yellow-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Select all correct options for this multiple-choice question.
                  </p>
                )}
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="mb-4">
                  <Label htmlFor={`question-${questionNumber}-image`} className="text-gray-300 mb-2 block">
                    <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image URL (Optional)
                    </div>
                  </Label>
                  <Input
                    id={`question-${questionNumber}-image`}
                    value={questionData.imageUrl || ""}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className="bg-gray-700 border-gray-600"
                  />
                  <p className="text-gray-400 text-sm mt-1">Add an image to illustrate your question.</p>
                </div>

                <div className="mb-4">
                  <Label htmlFor={`question-${questionNumber}-hint`} className="text-gray-300 mb-2 block">
                    <div className="flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Hint (Optional)
                    </div>
                  </Label>
                  <Textarea
                    id={`question-${questionNumber}-hint`}
                    value={questionData.hint || ""}
                    onChange={handleHintChange}
                    placeholder="Enter a hint for this question"
                    className="bg-gray-700 border-gray-600"
                    rows={2}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    A hint will be shown to users while they're taking the quiz.
                  </p>
                </div>

                <div>
                  <Label htmlFor={`question-${questionNumber}-explanation`} className="text-gray-300 mb-2 block">
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Explanation (Optional)
                    </div>
                  </Label>
                  <Textarea
                    id={`question-${questionNumber}-explanation`}
                    value={questionData.explanation || ""}
                    onChange={handleExplanationChange}
                    placeholder="Enter an explanation for the correct answer"
                    className="bg-gray-700 border-gray-600"
                    rows={3}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    An explanation will be shown to users after they complete the quiz.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <div>
                  {!isNew && onDelete && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onDelete}
                      className="border-red-600 text-red-500 hover:bg-red-900/30 hover:text-red-400"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!isValid()}
                  className={`${
                    isNew ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isNew ? "Add Question" : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
