"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Film, Clock, Award, Settings, Save, Eye, Archive, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionEditor } from "./question-editor"
import type { Quiz, Question } from "../types"

interface QuizCreationFormProps {
  initialQuiz?: Quiz
}

export function QuizCreationForm({ initialQuiz }: QuizCreationFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [quiz, setQuiz] = useState<Partial<Quiz>>(
    initialQuiz || {
      title: "",
      description: "",
      movieId: "",
      movieTitle: "",
      moviePosterUrl: "",
      movieReleaseDate: new Date(),
      status: "draft",
      passScore: 70,
      timeLimit: 300,
      numberOfQuestions: 10,
      isRandomized: false,
      isVerificationRequired: true,
      questions: [],
    },
  )

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuiz({ ...quiz, [name]: value })
  }

  const handleMovieSearch = async (searchTerm: string) => {
    // In a real implementation, this would search the movie database
    // For now, we'll just use a mock movie
    if (searchTerm.length > 2) {
      setQuiz({
        ...quiz,
        movieId: "movie-1",
        movieTitle: "Inception",
        moviePosterUrl: "/inception-movie-poster.png",
        movieReleaseDate: new Date("2010-07-16"),
      })
    }
  }

  const handleSettingsChange = (name: string, value: any) => {
    setQuiz({ ...quiz, [name]: value })
  }

  const handleAddQuestion = (question: Question) => {
    const updatedQuestions = [...(quiz.questions || [])]
    const existingIndex = updatedQuestions.findIndex((q) => q.id === question.id)

    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = question
    } else {
      updatedQuestions.push(question)
    }

    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const handleRemoveQuestion = (questionId: string) => {
    const updatedQuestions = (quiz.questions || []).filter((q) => q.id !== questionId)
    setQuiz({ ...quiz, questions: updatedQuestions })
  }

  const handleSaveDraft = () => {
    // In a real implementation, this would save to the database
    console.log("Saving draft:", quiz)
    // Navigate back to quiz management
    router.push("/admin/quizzes")
  }

  const handlePublishQuiz = () => {
    // In a real implementation, this would publish the quiz
    console.log("Publishing quiz:", quiz)
    // Navigate back to quiz management
    router.push("/admin/quizzes")
  }

  const handleArchiveQuiz = () => {
    // In a real implementation, this would archive the quiz
    console.log("Archiving quiz:", quiz)
    // Navigate back to quiz management
    router.push("/admin/quizzes")
  }

  const handlePreviewQuiz = () => {
    // In a real implementation, this would open a preview
    console.log("Previewing quiz:", quiz)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-4 md:mb-0"
        >
          {initialQuiz ? "Edit Quiz" : "Create New Quiz"}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            onClick={handlePreviewQuiz}
            className="border-blue-500 text-blue-400 hover:bg-blue-900 hover:text-blue-200"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          {initialQuiz && (
            <Button
              variant="outline"
              onClick={handleArchiveQuiz}
              className="border-red-500 text-red-400 hover:bg-red-900 hover:text-red-200"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
          <Button onClick={handlePublishQuiz} className="bg-purple-600 hover:bg-purple-700">
            Publish Quiz
          </Button>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-b border-gray-700 p-0 w-full justify-start overflow-x-auto">
          <TabsTrigger
            value="basic-info"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
          >
            <Film className="mr-2 h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
          >
            <Award className="mr-2 h-4 w-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-300 mb-2 block">
                    Quiz Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={quiz.title}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter quiz title"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300 mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={quiz.description}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter quiz description"
                    rows={4}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="movieSearch" className="text-gray-300 mb-2 block">
                    Associated Movie
                  </Label>
                  <div className="relative">
                    <Input
                      id="movieSearch"
                      placeholder="Search for a movie..."
                      onChange={(e) => handleMovieSearch(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>

                {quiz.movieId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center p-3 bg-gray-700 rounded-lg"
                  >
                    <img
                      src={quiz.moviePosterUrl || "/placeholder.svg"}
                      alt={quiz.movieTitle}
                      className="w-16 h-24 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.movieTitle}</h3>
                      <p className="text-gray-400 text-sm">
                        Release Date: {new Date(quiz.movieReleaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Quiz Questions</h2>
                <p className="text-gray-400">
                  Create questions for your quiz. You can add multiple choice (single or multiple correct answers) and
                  true/false questions.
                </p>
              </div>

              <div className="space-y-8">
                {(quiz.questions || []).map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <QuestionEditor
                      question={question}
                      questionNumber={index + 1}
                      onSave={handleAddQuestion}
                      onDelete={() => handleRemoveQuestion(question.id)}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <QuestionEditor questionNumber={(quiz.questions?.length || 0) + 1} onSave={handleAddQuestion} isNew />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="passScore" className="text-gray-300 mb-2 block">
                        Pass Score (%)
                      </Label>
                      <Select
                        value={quiz.passScore?.toString()}
                        onValueChange={(value) => handleSettingsChange("passScore", Number.parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select pass score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="60">60%</SelectItem>
                          <SelectItem value="70">70%</SelectItem>
                          <SelectItem value="80">80%</SelectItem>
                          <SelectItem value="90">90%</SelectItem>
                          <SelectItem value="100">100%</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-gray-400 text-sm mt-1">Recommended: 70% for verification quizzes</p>
                    </div>

                    <div>
                      <Label htmlFor="timeLimit" className="text-gray-300 mb-2 block">
                        Time Limit (minutes)
                      </Label>
                      <Select
                        value={(quiz.timeLimit ? Math.floor(quiz.timeLimit / 60) : 0).toString()}
                        onValueChange={(value) => handleSettingsChange("timeLimit", Number.parseInt(value) * 60)}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select time limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No time limit</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="20">20 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="numberOfQuestions" className="text-gray-300 mb-2 block">
                        Number of Questions
                      </Label>
                      <Select
                        value={quiz.numberOfQuestions?.toString()}
                        onValueChange={(value) => handleSettingsChange("numberOfQuestions", Number.parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select number of questions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="15">15 questions</SelectItem>
                          <SelectItem value="20">20 questions</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-gray-400 text-sm mt-1">Recommended: 10 questions for verification quizzes</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isRandomized"
                        checked={quiz.isRandomized}
                        onCheckedChange={(checked) => handleSettingsChange("isRandomized", checked)}
                      />
                      <Label htmlFor="isRandomized" className="text-gray-300">
                        Randomize Questions
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Verification Settings</h2>

                  <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isVerificationRequired"
                          checked={quiz.isVerificationRequired}
                          onCheckedChange={(checked) => handleSettingsChange("isVerificationRequired", checked)}
                        />
                        <Label htmlFor="isVerificationRequired" className="text-gray-300 font-semibold">
                          Enable Quiz for Review Verification
                        </Label>
                      </div>
                      <p className="text-gray-400 text-sm ml-10">
                        When enabled, users must pass this quiz to leave a verified review for this movie.
                      </p>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-gray-200">Important Verification Rules</h3>
                          <ul className="text-gray-300 text-sm mt-2 space-y-2">
                            <li>• Users get 2 attempts to pass the quiz</li>
                            <li>• After 2 failed attempts, users must wait 1 week before trying again</li>
                            <li>• The quiz is only required for the first 25 days after movie release</li>
                            <li>• After 25 days, users can leave verified reviews without taking the quiz</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {quiz.movieReleaseDate && (
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-200 mb-2">Time-Based Exemption Status</h3>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-blue-400 mr-2" />
                          <div>
                            <p className="text-gray-300 text-sm">
                              Movie Release Date: {new Date(quiz.movieReleaseDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-300 text-sm">
                              Verification Required Until:{" "}
                              {new Date(
                                new Date(quiz.movieReleaseDate).getTime() + 25 * 24 * 60 * 60 * 1000,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
