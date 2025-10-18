import Link from "next/link"

export default function MatchNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6">Match Not Found</h2>
      <p className="text-[#A0A0A0] mb-8">The cricket match you're looking for doesn't exist or has been moved.</p>
      <div className="flex justify-center space-x-4">
        <Link
          href="/cricket"
          className="px-4 py-2 bg-[#00BFFF] text-[#1A1A1A] rounded-md font-medium hover:bg-[#33CCFF] transition-colors"
        >
          Cricket Home
        </Link>
        <Link
          href="/cricket/schedule"
          className="px-4 py-2 bg-[#333333] text-[#E0E0E0] rounded-md font-medium hover:bg-[#444444] transition-colors"
        >
          Match Schedule
        </Link>
      </div>
    </div>
  )
}
