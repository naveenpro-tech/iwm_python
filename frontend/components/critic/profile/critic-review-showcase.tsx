"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, SortAsc } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CriticReviewCard from "./critic-review-card"
import type { CriticReview } from "@/types/critic"

interface CriticReviewShowcaseProps {
  reviews: CriticReview[]
  criticUsername: string
}

export default function CriticReviewShowcase({ reviews, criticUsername }: CriticReviewShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("latest")

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Rating filter
    if (filterRating !== "all") {
      const minRating = parseInt(filterRating)
      filtered = filtered.filter((review) => review.rating >= minRating)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        case "oldest":
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
        case "highest-rated":
          return b.rating - a.rating
        case "lowest-rated":
          return a.rating - b.rating
        case "most-liked":
          return b.likes_count - a.likes_count
        case "most-viewed":
          return b.views_count - a.views_count
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, searchQuery, filterRating, sortBy])

  return (
    <div id="review-showcase">
      <Card className="bg-[#282828] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">
            Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#00BFFF]"
              />
            </div>

            {/* Rating Filter */}
            <div className="w-full md:w-48">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A]">
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="9">9+ Stars</SelectItem>
                  <SelectItem value="8">8+ Stars</SelectItem>
                  <SelectItem value="7">7+ Stars</SelectItem>
                  <SelectItem value="6">6+ Stars</SelectItem>
                  <SelectItem value="5">5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="w-full md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A]">
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest-rated">Highest Rated</SelectItem>
                  <SelectItem value="lowest-rated">Lowest Rated</SelectItem>
                  <SelectItem value="most-liked">Most Liked</SelectItem>
                  <SelectItem value="most-viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-[#A0A0A0] font-dmsans mb-4">
            Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
          </p>

          {/* Reviews Grid */}
          {filteredAndSortedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredAndSortedReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CriticReviewCard review={review} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#A0A0A0] font-dmsans">No reviews found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

