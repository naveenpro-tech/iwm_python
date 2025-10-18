"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Star, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/profile/empty-state"
import Image from "next/image"
import Link from "next/link"

interface Review {
  id: string
  movieId: string
  movieTitle: string
  moviePosterUrl: string
  movieYear: string
  rating: number
  content: string
  date: string
  likes: number
  comments: number
}

interface ProfileReviewsProps {
  userId: string
}

export function ProfileReviews({ userId }: ProfileReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  useEffect(() => {
    // Simulate API call to fetch reviews
    const fetchReviews = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const mockReviews: Review[] = [
        {
          id: "r1",
          movieId: "m1",
          movieTitle: "Dune: Part Two",
          moviePosterUrl: "/dune-part-two-poster.png",
          movieYear: "2024",
          rating: 9,
          content:
            "Denis Villeneuve has outdone himself with this epic conclusion. The visual effects are breathtaking, and the performances are stellar across the board. A masterclass in sci-fi filmmaking that expands on the first film in every way. The score by Hans Zimmer is once again phenomenal, creating an immersive atmosphere that pulls you into the world of Arrakis.",
          date: "2 hours ago",
          likes: 24,
          comments: 5,
        },
        {
          id: "r2",
          movieId: "m3",
          movieTitle: "Oppenheimer",
          moviePosterUrl: "/oppenheimer-inspired-poster.png",
          movieYear: "2023",
          rating: 10,
          content:
            "Christopher Nolan's masterpiece. The performances are incredible, especially Cillian Murphy who delivers a career-defining performance as J. Robert Oppenheimer. The way Nolan weaves together multiple timelines is nothing short of brilliant. The film is both a character study and a historical epic that leaves you thinking long after the credits roll.",
          date: "3 days ago",
          likes: 87,
          comments: 12,
        },
        {
          id: "r3",
          movieId: "m4",
          movieTitle: "Poor Things",
          moviePosterUrl: "/poor-things-poster.png",
          movieYear: "2023",
          rating: 8,
          content:
            "Yorgos Lanthimos creates a bizarre yet captivating world in Poor Things. Emma Stone gives an absolutely fearless performance that deserves all the accolades. The production design and cinematography are stunning, creating a unique visual language that perfectly complements the strange narrative.",
          date: "2 weeks ago",
          likes: 45,
          comments: 8,
        },
        {
          id: "r4",
          movieId: "m5",
          movieTitle: "Killers of the Flower Moon",
          moviePosterUrl: "/killers-of-the-flower-moon-poster.png",
          movieYear: "2023",
          rating: 9,
          content:
            "Scorsese delivers another masterpiece with Killers of the Flower Moon. The film is a haunting examination of greed, betrayal, and the systematic exploitation of the Osage Nation. Leonardo DiCaprio and Lily Gladstone deliver powerful performances, but it's Robert De Niro who steals every scene he's in with his chilling portrayal.",
          date: "1 month ago",
          likes: 62,
          comments: 15,
        },
        {
          id: "r5",
          movieId: "m6",
          movieTitle: "Barbie",
          moviePosterUrl: "/barbie-movie-poster.png",
          movieYear: "2023",
          rating: 7,
          content:
            "Greta Gerwig's Barbie is much more than just a movie about a doll. It's a clever commentary on gender roles, identity, and corporate feminism. Margot Robbie and Ryan Gosling are perfectly cast, bringing both humor and heart to their roles. The production design is a visual feast of pink perfection.",
          date: "2 months ago",
          likes: 53,
          comments: 9,
        },
      ]

      setReviews(mockReviews)
      setIsLoading(false)
    }

    fetchReviews()
  }, [userId])

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      // Apply search filter
      if (searchQuery) {
        return (
          review.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .filter((review) => {
      // Apply rating filter
      if (filterRating === "all") return true
      if (filterRating === "high") return review.rating >= 8
      if (filterRating === "medium") return review.rating >= 5 && review.rating < 8
      if (filterRating === "low") return review.rating < 5
      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === "rating-high") {
        return b.rating - a.rating
      }
      if (sortBy === "rating-low") {
        return a.rating - b.rating
      }
      if (sortBy === "popular") {
        return b.likes + b.comments - (a.likes + a.comments)
      }
      return 0
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div>
      {/* Filters and Search */}
      <motion.div
        className="bg-[#282828] rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-[#A0A0A0] h-4 w-4" />
            <span className="text-[#A0A0A0] text-sm font-dmsans">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Star className="text-[#A0A0A0] h-4 w-4" />
            <span className="text-[#A0A0A0] text-sm font-dmsans">Rating:</span>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="high">High (8-10)</SelectItem>
                <SelectItem value="medium">Medium (5-7)</SelectItem>
                <SelectItem value="low">Low (1-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="bg-[#282828] rounded-lg p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mr-2" />
          <span className="text-[#E0E0E0] font-dmsans">Loading reviews...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8" />}
          title="No reviews found"
          description={searchQuery ? "Try adjusting your search or filters" : "You haven't written any reviews yet"}
          actionLabel={!searchQuery ? "Write a Review" : undefined}
          onAction={!searchQuery ? () => console.log("Navigate to write review") : undefined}
        />
      ) : (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {filteredReviews.map((review) => (
            <motion.div key={review.id} className="bg-[#282828] rounded-lg p-6" variants={itemVariants}>
              <div className="flex flex-col md:flex-row">
                <Link href={`/movies/${review.movieId}`} className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="w-24 md:w-32 aspect-[2/3] rounded-md overflow-hidden">
                    <Image
                      src={review.moviePosterUrl || "/placeholder.svg"}
                      alt={review.movieTitle}
                      width={128}
                      height={192}
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <Link href={`/movies/${review.movieId}`}>
                        <h3 className="text-xl font-inter font-medium text-[#E0E0E0] hover:text-[#00BFFF] transition-colors">
                          {review.movieTitle}
                        </h3>
                      </Link>
                      <p className="text-[#A0A0A0] text-sm">{review.movieYear}</p>
                    </div>

                    <div className="mt-2 md:mt-0">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-[#E0E0E0] font-inter font-medium">{review.rating}/10</span>
                      </div>
                      <p className="text-[#A0A0A0] text-xs mt-1">Reviewed {review.date}</p>
                    </div>
                  </div>

                  <p className="text-[#E0E0E0] font-dmsans mb-4">{review.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-[#A0A0A0] text-sm">
                      <span>{review.likes} likes</span>
                      <span>{review.comments} comments</span>
                    </div>

                    <Link
                      href={`/movies/${review.movieId}/reviews/${review.id}`}
                      className="text-[#00BFFF] text-sm hover:underline"
                    >
                      View Full Review
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
