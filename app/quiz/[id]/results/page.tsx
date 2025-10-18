"use client"

import { useSearchParams } from "next/navigation"
import { QuizResultsPage } from "@/components/quiz-system/user/quiz-results-page"
import { getQuizById } from "@/components/quiz-system/utils"

export default function QuizResultsPageRoute({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const attemptId = searchParams.get("attemptId") || ""

  const quiz = getQuizById(params.id)

  if (!quiz) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <p className="text-gray-400">The quiz you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  // In a real app, you would get the userId from the session
  const userId = "user-1"

  return <QuizResultsPage quiz={quiz} userId={userId} attemptId={attemptId} />
}
