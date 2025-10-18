import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"

export default function QuizTakeNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-700/50 flex items-center justify-center">
            <Search className="h-10 w-10 text-purple-400" />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-white">Quiz Not Found</h1>
          <p className="text-gray-400 mb-6">The quiz you're looking for doesn't exist or may have been removed.</p>

          <div className="flex justify-center">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/quiz">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
