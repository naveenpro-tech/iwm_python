import { Loader2 } from "lucide-react"

export default function QuizLoading() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gray-200">Loading Quiz...</h2>
      <p className="text-gray-400 mt-2">Preparing your knowledge challenge</p>
    </div>
  )
}
