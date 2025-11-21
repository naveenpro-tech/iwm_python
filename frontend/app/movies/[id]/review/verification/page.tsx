import { VerificationBypassChecker } from "@/components/quiz-system/user/verification-bypass-checker"

export default function ReviewVerificationPage({ params }: { params: { id: string } }) {
  // In a real app, you would get the userId from the session
  const userId = "user-1"

  // In a real app, you would look up the quiz ID for this movie
  const quizId = "quiz-1"

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Review Verification</h1>
      <p className="text-gray-300 mb-6">
        Before leaving a verified review, we need to check if you need to complete a verification quiz.
      </p>

      <VerificationBypassChecker movieId={params.id} userId={userId} quizId={quizId} />
    </div>
  )
}
