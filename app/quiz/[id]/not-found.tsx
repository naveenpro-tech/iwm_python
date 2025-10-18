import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuizNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center max-w-md">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-6">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-white">Quiz Not Found</h1>
        <p className="text-gray-400 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/movies">Browse Movies</Link>
        </Button>
      </div>
    </div>
  )
}
