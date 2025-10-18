import type { Metadata } from "next"
import { notFound } from "next/navigation"
import QuizTakingInterface from "@/components/quiz-system/user/quiz-taking-interface"
import { getMockQuiz } from "@/components/quiz-system/mock-data"

interface QuizTakePageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Take Quiz | Siddu Global",
  description: "Test your knowledge with our interactive movie quizzes",
}

export default function QuizTakePage({ params }: QuizTakePageProps) {
  const { id } = params

  // In a real app, we would fetch the quiz from an API
  const quiz = getMockQuiz(id)

  if (!quiz) {
    notFound()
  }

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user-123"

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8">
      <QuizTakingInterface quiz={quiz} userId={userId} />
    </main>
  )
}
