import { QuizPreviewModal } from "@/components/quiz-system/admin/quiz-preview-modal"
import { getQuizById } from "@/components/quiz-system/utils"

export default function PreviewQuizPage({ params }: { params: { id: string } }) {
  const quiz = getQuizById(params.id)

  if (!quiz) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <p className="text-gray-400">The quiz you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return <QuizPreviewModal quiz={quiz} />
}
