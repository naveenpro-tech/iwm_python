"use client"

export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading comparison...</p>
      </div>
    </div>
  )
}
