import { QuizEntryPage } from "@/components/quiz-system/user/quiz-entry-page"
import { getQuizById } from "@/components/quiz-system/utils"

export default function QuizEntryPageRoute({ params }: { params: { id: string } }) {
  const quiz = getQuizById(params.id)

  if (!quiz) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Quiz Not Found</h1>
        <p className="text-gray-400">The quiz you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  // In a real app, you would get the userId from the session
  const userId = "user-1"

  return <QuizEntryPage quiz={quiz} userId={userId} />
}
