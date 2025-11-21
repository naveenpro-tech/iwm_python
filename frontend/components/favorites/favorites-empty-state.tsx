"use client"
import { Button } from "@/components/ui/button"
import { HeartCrack, Search } from "lucide-react"
import Link from "next/link"

interface FavoritesEmptyStateProps {
  isFiltering?: boolean // To show a different message if filters are active
}

export function FavoritesEmptyState({ isFiltering = false }: FavoritesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 min-h-[400px] bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
      {isFiltering ? (
        <Search className="h-16 w-16 text-sky-500 mb-6" />
      ) : (
        <HeartCrack className="h-16 w-16 text-red-500 mb-6" />
      )}
      <h2 className="text-2xl font-semibold text-gray-100 mb-2">
        {isFiltering ? "No Matches Found" : "Your Favorites List is Empty"}
      </h2>
      <p className="text-gray-400 mb-6 max-w-md">
        {isFiltering
          ? "We couldn't find any favorites matching your current filters. Try adjusting your search or filter criteria."
          : "Looks like you haven't added any movies, shows, or people to your favorites yet. Start exploring and mark what you love!"}
      </p>
      {!isFiltering && (
        <div className="flex gap-4">
          <Button asChild className="bg-sky-600 hover:bg-sky-500 text-white">
            <Link href="/explore">Explore Content</Link>
          </Button>
          <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500/10 hover:text-sky-400">
            How to Add Favorites?
          </Button>
        </div>
      )}
      {isFiltering && (
        <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500/10 hover:text-sky-400">
          Clear Filters
        </Button>
      )}
    </div>
  )
}
