import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"

export default function PersonNotFound() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col items-center justify-center p-4">
      <UserX className="h-24 w-24 text-[#00BFFF] mb-6" />
      <h1 className="text-3xl font-bold mb-2">Person Not Found</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        We couldn't find the person you're looking for. They may have been removed or the URL might be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/people">Browse People Directory</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
